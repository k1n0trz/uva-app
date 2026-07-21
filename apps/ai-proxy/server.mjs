/**
 * AI orchestrator / proxy for Abril.
 *
 * WHY THIS EXISTS: the DeepSeek key can never live in the app — anything in an
 * Expo bundle is readable with the APK, and a leaked key means arbitrary
 * strangers spending on the account, with no way to rotate it without shipping
 * a new app (ficha §24.1/§25.2). So the app talks to THIS server, and this
 * server holds the key and applies the health-safety rules (ficha §19).
 *
 * Zero dependencies on purpose (node's built-in http + global fetch): it must
 * run with a single `node server.mjs`, no install step. This is a stand-in for
 * the real backend Codex will build.
 *
 * The key comes from the environment, never from a committed file:
 *   DEEPSEEK_API_KEY=sk-... node apps/ai-proxy/server.mjs
 */
import { createServer } from 'node:http';
import {
  ABRIL_SYSTEM_PROMPT,
  avatarStateForIntent,
  classifyIntent,
  filterOutput,
} from './abril-persona.mjs';

const PORT = Number(process.env.PORT || 8787);
const API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-pro';
const API_URL = 'https://api.deepseek.com/chat/completions';

if (!API_KEY) {
  console.error('Falta DEEPSEEK_API_KEY en el entorno. El proxy no puede arrancar.');
  process.exit(1);
}

const LENGTH_HINT = {
  breve: 'Responde breve: una o dos frases.',
  detallada: 'Puedes explayarte un poco más, pero sin irte por las ramas.',
};

// v4-pro is a reasoning model: it spends tokens thinking before writing, so the
// budget must cover reasoning + the actual reply, or the content comes back empty.
const MAX_TOKENS = MODEL.includes('pro') ? 1600 : 600;

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    // Dev only — the real backend scopes this to the app's origins.
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(payload);
}

async function callDeepSeek(messages) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: MAX_TOKENS, temperature: 0.7 }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`DeepSeek ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

/**
 * Build the message list. History lets Abril keep context; the length hint and
 * a fresh restatement of the safety frame ride along every turn (a long chat
 * shouldn't dilute the limits).
 */
function buildMessages({ text, history = [], replyLength = 'breve', intent }) {
  const messages = [{ role: 'system', content: ABRIL_SYSTEM_PROMPT }];

  for (const m of history.slice(-8)) {
    messages.push({ role: m.from === 'abril' ? 'assistant' : 'user', content: m.text });
  }

  let userContent = text;
  const hints = [LENGTH_HINT[replyLength] || LENGTH_HINT.breve];
  if (intent === 'dolor') {
    hints.push(
      'La usuaria menciona dolor o molestia. No lo minimices ni diagnostiques; con calma, sugiere pausar y consultar a un profesional si es intenso o persiste.'
    );
  }
  messages.push({ role: 'user', content: `${userContent}\n\n[${hints.join(' ')}]` });
  return messages;
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});

  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { ok: true, model: MODEL });
  }

  if (req.method === 'POST' && req.url === '/chat') {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      try {
        const body = JSON.parse(raw || '{}');
        const text = String(body.text || '').slice(0, 2000);
        if (!text.trim()) return json(res, 400, { error: 'texto vacío' });

        // Safety routing runs before the model, so a pain signal is handled
        // even if the LLM were to ignore the prompt.
        const { intent, warn } = classifyIntent(text);
        const messages = buildMessages({ text, history: body.history, replyLength: body.replyLength, intent });

        const modelText = await callDeepSeek(messages);
        const safeText = modelText || 'Estoy aquí contigo. ¿Me lo cuentas de otra forma?';
        const filtered = filterOutput(safeText, intent);

        return json(res, 200, {
          text: filtered.text,
          intent,
          warn: warn || filtered.replaced,
          abrilState: avatarStateForIntent(intent),
        });
      } catch (err) {
        console.error('error en /chat:', err.message);
        // Fail safe and honest — never invent a medical answer on error.
        return json(res, 502, {
          text: 'Ahora mismo no puedo responder bien. Puedes seguir registrando cómo te sientes y lo retomamos en un momento.',
          intent: null,
          warn: false,
          abrilState: 'unavailable',
          error: true,
        });
      }
    });
    return;
  }

  json(res, 404, { error: 'no encontrado' });
});

server.listen(PORT, () => {
  console.log(`Abril proxy escuchando en http://localhost:${PORT} · modelo ${MODEL}`);
});
