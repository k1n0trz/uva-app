# Abril — Roadmap del personaje (3D + IA conversacional)

> Documento aparte del `ROADMAP.md` general. Cubre **solo** a Abril: su diseño,
> sus expresiones y animaciones, el pipeline de Blender, la voz y el cerebro
> conversacional (DeepSeek). Dueño de esta parte: **Claude (Fable)** — el 3D no
> puede hacerlo Codex.
>
> Fuentes: ficha técnica §4 (Abril/Vera), §11 (voz), §19 (arquitectura IA), §20
> (Abril 3D y animaciones), §25.4 (límites de salud); `data/prompt-claude.txt` §4;
> y **el conocimiento de toda la app ya construida** — cada pantalla donde Abril
> aparece y qué tiene que transmitir ahí.
>
> ⚠️ El nombre es "Abril" (antes "Vera", aún provisional — ver `ROADMAP.md`).

---

## 0. Principios no negociables

Antes de modelar un solo polígono, esto manda sobre todo lo demás:

| Principio | De dónde | Qué implica en Blender / en la IA |
|---|---|---|
| **Mujer adulta, estilizada, cálida, sofisticada** | ficha §20.1 | Ni fotorrealista ni caricatura infantil. Proporciones humanas creíbles pero suavizadas. |
| **Nunca médica, infantil ni sexualizada** | ficha §20.1 / brief §4 | Sin bata, sin instrumental clínico, sin uniforme. Vestuario cálido, cercano, neutro. El "Nurse" del nombre del archivo Meshy es solo el prompt — el render ya cumple, UVA lo confirmó. |
| **Transmite acompañamiento y calma** | ficha §20.1 | El registro base es sereno. Nada de energía estridente, ni siquiera al celebrar ("celebración discreta"). |
| **Beta = clips pre-renderizados, no 3D en tiempo real** | ficha §20.3 / §33 | El modelo Meshy tiene ~255k caras: inviable renderizar en vivo en gama media/baja. Se anima en Blender y se **exporta a clips 2D** que la app reproduce. El realtime 3D se difiere a fase 3.0. |
| **Voz: STT y TTS son servicios aparte del LLM** | ficha §11.3 | DeepSeek conversa; NO hace audio. La boca de los clips no se sincroniza palabra por palabra (imposible con texto dinámico) — ver §5. |
| **La IA no diagnostica, no promete anticoncepción/fertilidad, no infiere lo prohibido** | ficha §25.4 / §18.2 | Va codificado en el system prompt Y en un filtro de salida. La personalidad no puede saltarse los límites de salud. |
| **Accesibilidad primero** | ficha §20.5 / brief §22 | Subtítulos SIEMPRE. Botón para detener la voz. `reduce-motion` → imagen estática. Modo bajo consumo. La animación nunca es el único canal de información. |

---

## 1. Inventario completo de estados y expresiones — **el corazón del personaje**

Esto es lo que conozco mejor que nadie: cada momento de la app donde Abril
existe, qué siente, y qué debe hacer su cara y su cuerpo. La app ya declara 9
estados en `components/abril/AbrilAvatar.tsx`; la ficha §20.4 lista 9 estados
mínimos. Los cruzo y los amplío con el **contexto real de dónde se usan**.

### 1.1 Estados canónicos (los que el componente ya espera)

| Estado (`AbrilState`) | Dónde aparece HOY en la app | Registro emocional | Cara | Cuerpo / gesto | Tipo | Notas de fidelidad |
|---|---|---|---|---|---|---|
| `idle` | Tarjeta de Hoy, header del chat en reposo | Presencia cálida y tranquila | Sonrisa suave neutra, parpadeo natural | Respiración sutil (hombros/pecho), micro-balanceo | **Loop** (largo, ~6–10 s) | Es el estado que más se ve. Tiene que sostener la mirada sin cansar: variar el parpadeo, algún micro-gesto ocasional. |
| `greeting` | Onboarding intro ("Hola, soy Abril") | Bienvenida, apertura, primera impresión | Sonrisa amplia pero elegante, ojos que se iluminan | Ligero saludo con la mano o inclinación de cabeza acogedora | **One-shot → idle** | El primer contacto de la usuaria con Abril. Define todo. Que se sienta recibida, no vendida. |
| `listening` | Chat, mientras el micrófono está activo | Atención plena, receptiva | Cejas ligeramente arriba, mirada atenta y cálida | Leve inclinación de cabeza hacia la usuaria, quietud atenta | **Loop** | Debe leerse como "te estoy escuchando de verdad", no como espera pasiva. |
| `thinking` | Chat, tras enviar (procesando/transcribiendo) | Reflexiva, considerada | Mirada que se desvía un instante hacia arriba/lado, concentración | Mano cerca del mentón o quietud pensativa | **Loop** (corto) | Puente entre lo que dijo la usuaria y la respuesta. Que no parezca "cargando", sino "considerando". |
| `speaking` | Chat, mientras reproduce la respuesta (TTS) | Explicativa, cálida, presente | Boca en movimiento genérico de habla (ver §5), expresión viva | Gestos de manos abiertas, asentimientos suaves | **Loop** (sincronizado al inicio/fin del TTS) | No hay lip-sync exacto. La boca se mueve de forma creíble mientras suena la voz. |
| `guiding` | Reproductor de rutina (respiración 4-7-8), Primera Copa (explica paso) | Serena, didáctica, contenedora | Expresión calmada, ojos suaves | **Respiración marcada y visible** (para que la usuaria respire con ella), o gesto que ilustra el paso | **Loop** (para respiración: ciclo de ~8 s inhala/exhala) | Este es especial: en la rutina de respiración, el cuerpo de Abril **es la guía**. Su inhalar/exhalar marca el ritmo. Vale la pena una variante dedicada `guiding-breath`. |
| `celebrating` | Rutina completada, "Lo logré" en Primera Copa, nivel Kegel superado | Alegría **discreta**, orgullo por la usuaria | Sonrisa genuina, ojos cerrados un instante de gusto | Un gesto pequeño: aplauso suave, pulgar, manos al pecho | **One-shot → idle** | La ficha dice "celebración discreta" literal. Nada de confeti ni saltos. Es el orgullo tranquilo de una amiga. |
| `concerned` | Modo Rescate, intent de dolor en el chat, error de micrófono | Preocupación **sin dramatismo**, sostén | Cejas en preocupación suave, mirada atenta y cálida (no alarma) | Ligero acercamiento, manos que transmiten calma | **Loop** (suave) | El estado más delicado: cuando algo va mal, Abril está presente y serena, no asustada. Si ella se alarma, la usuaria se alarma. |
| `unavailable` | Sin conexión, Abril temporalmente caída | Ausencia amable | Imagen estática atenuada, expresión neutra en reposo | Sin animación (o mínima) | **Estático / fallback** | Deja claro que no está disponible ahora, sin que se sienta rota. |

### 1.2 Sub-estados y micro-momentos que suman fidelidad

No son estados nuevos del componente, pero son transiciones/matices que hacen la
diferencia entre "un avatar que cambia de pose" y "un personaje que está vivo":

- **`greeting` → `idle`**: transición suave al asentarse, no un corte.
- **`listening` → `thinking`**: el momento en que deja de escuchar y empieza a considerar.
- **`speaking` → `idle`**: al terminar de hablar, vuelve a la calma atenta.
- **`guiding-breath` (variante de `guiding`)**: ciclo respiratorio explícito para la rutina 4-7-8. Su pecho/hombros suben en la inhalación (4), sostienen (7), bajan en la exhalación (8). Es, literalmente, la interfaz de esa pantalla.
- **`concerned-soft` vs `concerned` en Rescate**: en Rescate el registro es aún más contenido — la usuaria puede estar con dolor o angustia real.
- **`thinking` largo (timeout)**: si la respuesta tarda, un loop de espera paciente en vez de congelarse.
- **Parpadeo y respiración como capa base**: presentes en todos los loops, con variación para que no se sienta mecánico.
- **Micro-asentimientos** durante `listening` y `speaking`: el gesto humano de "sigo contigo".

### 1.3 Consolidación: la biblioteca de clips a producir

Traducido a entregables concretos para Blender → app:

| Clip | Estado | Tipo | Duración objetivo | Prioridad |
|---|---|---|---|---|
| `idle` | idle | loop | 8–10 s | **P0** (se ve siempre) |
| `greeting` | greeting | one-shot | 2–3 s | **P0** (primera impresión) |
| `listening` | listening | loop | 4–6 s | **P0** (chat) |
| `thinking` | thinking | loop | 3–4 s | **P0** (chat) |
| `speaking` | speaking | loop | 4–6 s | **P0** (chat) |
| `guiding-breath` | guiding | loop | 8 s (ciclo 4-7-8) | **P1** (rutinas) |
| `concerned` | concerned | loop | 4–6 s | **P1** (Rescate) |
| `celebrating` | celebrating | one-shot | 2–3 s | **P1** |
| `guiding-explain` | guiding | loop | 4–6 s | **P2** (Primera Copa paso a paso) |
| `unavailable` | unavailable | estático | frame único | **P2** (fallback) |
| Transiciones (greeting→idle, speaking→idle, listening→thinking) | — | one-shot corto | <1 s | **P2** (pulido) |

Meta mínima para una beta creíble: **los 5 P0 + los 3 P1**. El resto es pulido progresivo.

---

## 2. Diseño y consolidación del personaje (concepto → modelo limpio)

| # | Tarea | Detalle |
|---|---|---|
| 2.1 | **Auditar el modelo Meshy** (`vera/Meshy_AI_Pink_Serenity_Nurse_...glb`) | Cargar en Blender, revisar topología, escala, materiales, UVs, si tiene o no armature. Medir: caras, vértices, tamaño de texturas. |
| 2.2 | **Character sheet definitivo** | Fijar de una vez: proporciones, peinado, vestuario (cálido, no clínico), paleta (coherente con el rosa UVA `#CD2F62` pero sin disfrazarla de logo), y **la expresión neutra canónica**. Todo lo demás se anima desde aquí. |
| 2.3 | **Retopología / limpieza para animación** | 255k caras es demasiado incluso para renderizar clips con agilidad. Retopo a una malla limpia y deformable (cara con loops correctos para expresiones). Objetivo: malla que se anime bien y renderice rápido en Blender. |
| 2.4 | **Materiales / shading UVA** | Shading estilizado (no PBR fotorrealista), iluminación cálida y suave, coherente con la "dirección premium, limpia, con mucho espacio en blanco" del brief. Fondo transparente para los clips. |
| 2.5 | **Fijar encuadre y cámara** | Un encuadre canónico (busto/medio cuerpo) que sirva para todos los clips, para que al intercambiarlos en la app no "salte". Definir resolución de render y área segura. |

---

## 3. Rigging (Blender)

| # | Tarea | Detalle |
|---|---|---|
| 3.1 | **Armature corporal** | Huesos para hombros, cuello, cabeza, brazos y manos — lo necesario para saludo, gestos de habla, acercamiento en `concerned`. No hace falta un rig de cuerpo completo si el encuadre es busto. |
| 3.2 | **Rig facial** | Shape keys (blend shapes) o huesos para: cejas (neutra/arriba/preocupación), ojos (mirada, entrecerrar), párpados (**parpadeo**), boca (sonrisa neutra→amplia, gesto de habla), mejillas. Estas controlan casi toda la expresividad. |
| 3.3 | **Visemas para la boca** | Un set pequeño de formas de boca (A, E, I, O, U, M/cerrada, reposo) — aunque el lip-sync sea genérico (§5), tener visemas permite un "habla" creíble y deja la puerta abierta a lip-sync real en fase 3.0. |
| 3.4 | **Control de respiración** | Un controlador que suba/baje hombros y pecho, reutilizable en `idle`, `guiding-breath` y `concerned`. |
| 3.5 | **Poses base guardadas** | Guardar como poses/acciones la expresión neutra y las claves de cada estado, para animar consistente. |

---

## 4. Producción de animaciones (Blender)

| # | Tarea | Detalle |
|---|---|---|
| 4.1 | Animar los **5 clips P0** (idle, greeting, listening, thinking, speaking) | Loops con entrada/salida que casen (para que el bucle no tenga costura). Parpadeo y respiración como capa base. |
| 4.2 | Animar los **3 clips P1** (guiding-breath, concerned, celebrating) | `guiding-breath` cronometrado al ciclo 4-7-8 real de la rutina (coincide con `BREATH_CYCLE_SEC` del reproductor). |
| 4.3 | Animar **P2** (guiding-explain, unavailable, transiciones) | Pulido. |
| 4.4 | **Revisión de registro emocional** | Chequear contra el §1: que `concerned` no se lea como alarma, que `celebrating` sea discreto, que `idle` no canse. Aquí Fable importa: iterar hasta que Abril se sienta una amiga cálida, no un asistente genérico. |

---

## 5. Voz y lip-sync (la parte honesta)

El TTS genera audio de **texto dinámico** (respuestas de la IA), así que **no se
puede pre-renderizar un lip-sync exacto**. Decisión para la beta:

- **Clip `speaking` genérico**: la boca se mueve de forma creíble en bucle mientras suena el TTS. Empieza cuando arranca el audio, para cuando termina. Ya está modelado así en el chat (`status: 'speaking'`).
- **Subtítulos SIEMPRE** (ficha §11.2/§20.5): la voz nunca es el único canal. Ya hay soporte de subtítulo/transcripción en la app.
- **Botón "Detener"** la voz sin apagar el micrófono (ya existe en el chat).
- **Velocidad de voz** configurable (ficha §11.2).
- **Lip-sync real por visemas** → **fase 3.0** (ficha §33): con los visemas del rig ya listos (3.3), más adelante se puede mapear fonemas del TTS a formas de boca. No es beta.
- **Proveedor de voz (STT/TTS): SIN DECIDIR** — es decisión de UVA (ficha §11.3, §0.3 del roadmap general). DeepSeek no hace audio. Hasta que se elija, la app usa `speechToTextService`/`textToSpeechService` mockeados y el clip `speaking` corre con un temporizador.

---

## 6. Renderizado, exportación y formato de entrega

| # | Tarea | Detalle |
|---|---|---|
| 6.1 | **Elegir formato de clip para la app** | El personaje es 3D pero se entrega como animación 2D con **alfa** (fondo transparente). Opciones y recomendación: **secuencia de PNG con alfa → empaquetada como WebP animado** (o sprite sheet) por estado. Es lo más fiable cross-platform en React Native (el video transparente es problemático en Android/iOS). Lottie no aplica bien a render 3D. |
| 6.2 | **Render desde Blender** | Cada clip a su secuencia de frames con alfa, a la resolución/encuadre canónicos (2.5). Fondo transparente. |
| 6.3 | **Compresión y tamaños** | Peso controlado por clip (la ficha pide carga diferida y caché). Definir presupuesto por clip y total. |
| 6.4 | **Manifest de clips** | Un `abril-clips.json` (estado → archivo, tipo loop/one-shot, fps, duración) que `AbrilAvatar` consume. Así agregar/cambiar un clip no toca código de UI. |
| 6.5 | **Fallback estático** | Un frame por estado (sobre todo `idle` y `unavailable`) para `reduce-motion`, modo bajo consumo y mientras cargan los clips. |

---

## 7. Integración en la app (React Native / Expo)

`components/abril/AbrilAvatar.tsx` ya está diseñado como **reemplazable**: acepta
un `source` y hoy usa un placeholder. La integración es evolución, no reescritura.

| # | Tarea | Detalle |
|---|---|---|
| 7.1 | **Extender `AbrilAvatar`** para reproducir clips por estado | Leer el manifest, reproducir el clip del estado actual (loop u one-shot→idle). Mantener la misma API `state`/`size` — el resto de la app no cambia. |
| 7.2 | **Transiciones** | one-shots (`greeting`, `celebrating`) que al terminar caen a `idle`; cross-fade suave entre estados. |
| 7.3 | **Respeta `reduce-motion` y bajo consumo** | Ya hay `useReduceMotion`. Con reduce-motion → frame estático. Modo bajo consumo → estático. |
| 7.4 | **Precarga y caché** | Precargar al menos `idle` y los P0 del chat; cachear el resto (ficha §20.5). |
| 7.5 | **Verificar en dispositivo** | Rendimiento real en el Galaxy S22+ (fluidez, memoria, batería). |

---

## 8. El cerebro conversacional (DeepSeek) — que Abril de verdad hable

"El personaje es una IA": los clips le dan cara; esto le da mente. Es el flujo de
la ficha §19.1 completo.

### 8.1 Arquitectura (y por qué NO va en la app)

```
Usuaria (texto o voz)
  → [STT si es voz]                     (proveedor por definir)
  → clasificación de intención
  → extracción de datos estructurados
  → REGLAS DE SEGURIDAD                  (elegibilidad, alertas, límites de salud)
  → contexto: perfil + memoria + biblioteca UVA validada
  → LLM (DeepSeek V4 Pro)                ← la key vive AQUÍ, en el servidor
  → FILTRO DE SALIDA                     (no diagnóstico, no venta invasiva, no fuga de datos)
  → respuesta en texto (+ TTS si activo)
  → mapear a estado de Abril (thinking → speaking → idle)
  → retroalimentación (👍/👎, "explícame de otra forma")
```

🔒 **La key de DeepSeek NUNCA entra al bundle de la app** (misma regla que
WooCommerce, ficha §24.1/§25.2). Todo lo que va en `EXPO_PUBLIC_*` es legible con
el APK. La app llama a un **proxy/orquestador**; el proxy tiene la key y aplica
las reglas de seguridad.

| # | Tarea | Dueño | Estado |
|---|---|---|---|
| 8.2 | **Elegir proveedor**: **DeepSeek V4 Pro** | ⚪ Claude + 🟣 UVA (aprobar) | ✅ Elegido y probado. Nota: v4-pro es modelo de **razonamiento** (gasta tokens pensando → más latencia/costo). `deepseek-v4-flash` disponible si prima la latencia. |
| 8.3 | **Proxy/orquestador mínimo** (key en el servidor) | ⚪ Claude (stub) → 🔵 Codex (real) | ✅ `apps/ai-proxy/server.mjs` — node sin dependencias, key por entorno |
| 8.4 | **System prompt / personalidad de Abril** | ⚪ Claude | ✅ `apps/ai-proxy/abril-persona.mjs` |
| 8.5 | **Reglas de seguridad en el prompt + filtro de salida** | ⚪ Claude | ✅ Verificado adversarial: no diagnostica, no promete anticoncepción, no infiere embarazo, deriva a profesional |
| 8.6 | **Swap del mock** | ⚪ Claude | ✅ `services/abril` → cliente del proxy tras `EXPO_PUBLIC_AI_PROXY_URL` (mock como respaldo). UI sin cambios |
| 8.7 | **Mapear la respuesta a estados de Abril** | ⚪ Claude | ✅ intent → estado del avatar (dolor→`concerned`, rutina→`guiding`) |

**✅ Track IA funcionando** (commit `174a10c`): Abril conversa con `deepseek-v4-pro` dentro de la app, respeta los límites de salud, y dispara el banner de advertencia + la ruta a Rescate ante dolor. Correr el proxy: `DEEPSEEK_API_KEY=... node apps/ai-proxy/server.mjs`; la app con `EXPO_PUBLIC_AI_PROXY_URL=http://localhost:8787`.

**Pendiente de pulido (no bloqueante):**
- Inyectar el **contexto de la usuaria** (perfil, memoria, productos) y la **biblioteca UVA validada** al prompt (ficha §19) — hoy Abril responde sin ese contexto, así que a veces nombra funciones de forma aproximada.
- Historial de conversación multi-turno hacia el proxy (hoy es por-turno).

### 8.2 Personalidad de Abril (borrador del system prompt — a refinar)

Basado en ficha §6.2:
- Habla como **una amiga informada, sin infantilizar**. Cálida, elegante, directa, adaptable.
- Reconoce **incertidumbre**; no afirma lo que no puede comprobar.
- **No diagnostica, no sustituye a un profesional**, no promete prevenir embarazo.
- **No convierte cada conversación en una venta.** Primero ayuda; lo comercial es opcional y explicado.
- Dice qué recuerda y permite corregirlo.
- Español (Colombia). Tono adaptable: breve / paso a paso / cercana / más técnica (lo elige la usuaria — ya existe en el chat).
- Ante dolor intenso o señales de alerta: **detiene, no minimiza, y deriva a un profesional.**

---

## 9. Verificación y calidad

- **Fidelidad del personaje**: revisar cada clip contra el registro emocional del §1. Iterar en Blender hasta que Abril se sienta la amiga cálida que describe la ficha, no un asistente genérico. (Es el motivo de usar Fable: iterar sin escatimar.)
- **En dispositivo real**: fluidez, memoria y batería de los clips en el Galaxy S22+.
- **Chat real**: probar el flujo con DeepSeek — que respete los límites de salud, que el registro emocional de Abril acompañe la conversación, que no venda.
- **Accesibilidad**: subtítulos, detener voz, reduce-motion → estático, todo funcionando.

---

## Pendientes que necesito de ti (bloquean el arranque)

1. **Las API keys llegaron vacías.** Pásame la de DeepSeek (V4 Pro) y/o DeepInfra **de forma segura**, igual que hiciste con WooCommerce: déjalas en un archivo local (un `.env`) y me dices la ruta — las leo sin imprimirlas y **nunca** entran al repo ni al bundle.
2. **Cómo trabajo Blender.** Dijiste que ya has usado Claude para 3D. ¿Tienes un **Blender MCP** conectado, o prefieres que te genere **scripts `bpy`** (Python) que corres tú? Con MCP puedo iterar directo; con scripts, iteramos por tandas.
3. **Proveedor de voz (STT/TTS): sigue sin decidir** (ficha §11.3). No bloquea el 3D ni el chat de texto, pero sí la voz hablada de Abril. Puedo dejar todo listo para conectarlo.

## Orden de arranque sugerido

1. Tú: dejas las keys de DeepSeek en un `.env` local + me dices cómo va Blender.
2. Yo, en paralelo:
   - **Track IA** (rápido, alto impacto): proxy mínimo + system prompt + swap del mock → **Abril conversa de verdad por texto** con DeepSeek. Verificable en el teléfono en poco tiempo.
   - **Track 3D** (largo, iterativo): auditar Meshy → limpiar/riggear → los 5 clips P0 → integrarlos en `AbrilAvatar`.
3. Los dos tracks convergen: Abril con cara viva **y** mente propia.
