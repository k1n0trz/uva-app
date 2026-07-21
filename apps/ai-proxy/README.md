# Abril AI proxy

Orquestador mínimo entre la app y DeepSeek. Existe para que la **key nunca viva
en la app** (ficha §17.1/§24.1/§25.2) y para aplicar las **reglas de salud** en
el servidor, no solo en el prompt. Es un stub de lo que Codex construirá de
verdad (ficha §19).

## Correr

Sin dependencias. Solo necesita la key en el entorno:

```bash
# opción A: variable de entorno
DEEPSEEK_API_KEY=sk-... node server.mjs

# opción B: archivo .env (gitignored) — copia .env.example a .env y complétalo
```

Endpoints:
- `GET /health` → `{ ok, model }`
- `POST /chat` → body `{ text, history?, replyLength? }` → `{ text, intent, warn, abrilState }`

## Qué hace (pipeline, ficha §19.1)

1. Clasifica la intención (antes del modelo, para atender el dolor aunque el LLM fallara).
2. Arma el mensaje con la personalidad de Abril y los límites de salud (`abril-persona.mjs`).
3. Llama a `deepseek-v4-pro`.
4. Filtra la salida (backstop: nada de diagnóstico ni promesas de anticoncepción).
5. Devuelve texto + intención + si mostrar advertencia + el estado del avatar.

## Reglas que NO se pueden quitar

Están en `abril-persona.mjs`. No diagnostica, no promete anticoncepción/fertilidad,
no infiere lo prohibido (§18.2), deriva a profesional ante dolor, no convierte la
charla en venta. Codex debe conservarlas en el backend real.

## Nota

`deepseek-v4-pro` es un modelo de **razonamiento**: gasta tokens pensando antes de
escribir, por eso el presupuesto de tokens es amplio. Para menor latencia se puede
usar `deepseek-v4-flash` (`DEEPSEEK_MODEL=deepseek-v4-flash`).
