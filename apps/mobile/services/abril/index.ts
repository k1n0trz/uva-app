/**
 * Conversational service for the assistant.
 *
 * The real pipeline (ficha §11.1/§19.1) is:
 *   voz/texto → STT → clasificación de intención → extracción estructurada →
 *   reglas de seguridad → perfil + memoria + biblioteca UVA validada → LLM →
 *   filtro de salida → texto/voz → retroalimentación
 *
 * This mock only stands in for the last-mile response so the chat UI is real.
 * Codex replaces it with the backend client — the UI must not change.
 *
 * Non-negotiables the real implementation must keep (ficha §25.4):
 *   - Never diagnose, never promise contraception/fertility.
 *   - Route pain/alarm signals to safe content + professional referral.
 *   - No commercial push inside sensitive conversations.
 */

export type ChatMessage = {
  id: string;
  from: 'abril' | 'user';
  text: string;
  /** Set on assistant messages the user has rated. */
  rating?: 'up' | 'down';
  /** Assistant messages that should surface a professional-consultation notice. */
  warn?: boolean;
};

/** Drives suggestion chips and safety routing after a reply. */
export type ChatIntent = 'dolor' | 'rutina' | 'periodo' | null;

export type ReplyLength = 'breve' | 'detallada';

export type AbrilReply = {
  text: string;
  intent: ChatIntent;
  warn: boolean;
};

export interface AbrilChatService {
  sendMessage(text: string, length: ReplyLength): Promise<AbrilReply>;
  /** Ask for the same answer explained differently (brief §12). */
  rephrase(text: string, length: ReplyLength): Promise<AbrilReply>;
  rateMessage(messageId: string, rating: 'up' | 'down'): Promise<void>;
}

const delay = <T>(value: T, ms = 900) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

function classify(text: string): { intent: ChatIntent; warn: boolean } {
  const t = text.toLowerCase();
  if (/cólico|colico|dolor|duele|molestia/.test(t)) return { intent: 'dolor', warn: true };
  if (/rutina|respirac|relajac|kegel/.test(t)) return { intent: 'rutina', warn: false };
  if (/periodo|regla|menstrua|ciclo/.test(t)) return { intent: 'periodo', warn: false };
  return { intent: null, warn: false };
}

const REPLIES: Record<string, Record<ReplyLength, string>> = {
  dolor: {
    breve: 'Cuéntame qué tan fuerte es. Si es intenso, mejor pausa y consulta a un profesional.',
    detallada:
      'Antes de seguir, cuéntame qué tan fuerte es el dolor y desde cuándo lo sientes. El dolor no es una parte normal del proceso: si es intenso o no cede, te recomiendo pausar el uso y consultar a un profesional de salud. Si es una molestia leve, podemos revisar juntas la posición o el doblez.',
  },
  rutina: {
    breve: 'Te preparé una rutina de respiración de 3 minutos. ¿La empezamos?',
    detallada:
      'Te preparé una rutina de respiración de 3 minutos. Es corta, puedes hacerla sentada y sirve para bajar la tensión antes de seguir con tu día. ¿Quieres empezarla ahora?',
  },
  periodo: {
    breve: 'Con lo que tengo, podría comenzar entre el 29 y el 31 de julio.',
    detallada:
      'Con la información que tengo hasta ahora, tu periodo podría comenzar entre el 29 y el 31 de julio. Es una estimación basada en tus últimos ciclos registrados, así que puede moverse — entre más registres, mejor la ajusto.',
  },
  default: {
    breve: 'Gracias por contarme. Lo tendré en cuenta.',
    detallada: 'Gracias por contarme. Lo tendré en cuenta para acompañarte mejor de aquí en adelante.',
  },
};

export const mockAbrilChatService: AbrilChatService = {
  sendMessage: (text, length) => {
    const { intent, warn } = classify(text);
    return delay({ text: REPLIES[intent ?? 'default'][length], intent, warn });
  },

  rephrase: (text, length) => {
    const { intent, warn } = classify(text);
    // Flip the length so "explícame de otra forma" actually reads differently.
    const flipped: ReplyLength = length === 'breve' ? 'detallada' : 'breve';
    return delay({ text: REPLIES[intent ?? 'default'][flipped], intent, warn });
  },

  rateMessage: (_messageId, _rating) => delay(undefined, 200),
};

/**
 * Real client: talks to the AI proxy (apps/ai-proxy), which holds the DeepSeek
 * key and applies the health-safety rules server-side. The key is NEVER here —
 * only the proxy URL, which is safe to ship.
 *
 * Resilient by design: any failure (proxy down, network) returns a safe,
 * honest fallback rather than throwing, so the chat never gets stuck.
 */
const SAFE_FALLBACK: AbrilReply = {
  text: 'Ahora mismo no puedo responder bien. Puedes seguir registrando cómo te sientes y lo retomamos en un momento.',
  intent: null,
  warn: false,
};

function makeProxyService(proxyUrl: string): AbrilChatService {
  const post = async (text: string, length: ReplyLength): Promise<AbrilReply> => {
    try {
      const res = await fetch(`${proxyUrl.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, replyLength: length }),
      });
      if (!res.ok) return SAFE_FALLBACK;
      const data = (await res.json()) as Partial<AbrilReply>;
      return {
        text: data.text || SAFE_FALLBACK.text,
        intent: (data.intent ?? null) as ChatIntent,
        warn: !!data.warn,
      };
    } catch {
      return SAFE_FALLBACK;
    }
  };

  return {
    sendMessage: (text, length) => post(text, length),
    rephrase: (text, length) => post(`${text}\n\n(Explícame lo mismo de otra forma, por favor.)`, length),
    rateMessage: (_messageId, _rating) => Promise.resolve(),
  };
}

/**
 * The service the app uses. Swaps to the real DeepSeek-backed proxy when
 * EXPO_PUBLIC_AI_PROXY_URL is set; otherwise the mock keeps the chat working
 * offline / without the proxy running. The chat UI imports THIS and never
 * changes.
 */
const PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL;
export const abrilChatService: AbrilChatService = PROXY_URL ? makeProxyService(PROXY_URL) : mockAbrilChatService;
export const isUsingRealAI = !!PROXY_URL;
