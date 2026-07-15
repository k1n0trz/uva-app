# Roadmap — UVA App (Beta v1.0)

> Basado en: prototipo `frontend/Diseño original sin Bootstrap-handoff.zip` (`UVA App.dc.html`, README de handoff), `data/prompt-claude.txt` (brief original de producto/diseño) y `data/Ficha_Funcional_Tecnica_UVA_App_Beta_v1.0.docx` (ficha funcional y técnica v1.0, 15 jul 2026).
>
> Orden de prioridad para resolver contradicciones (definido en el propio brief): 1) decisiones de `prompt-claude.txt`, 2) ficha funcional y técnica, 3) identidad/logo UVA, 4) copauva.com.

## Cómo leer este documento

Cada tarea tiene un dueño:

| Ícono | Dueño | Qué significa |
|---|---|---|
| 🟣 **UVA** | El equipo de negocio/producto (ustedes) | Decisiones, contenido, contratos, cuentas, validaciones legales/clínicas, credenciales reales |
| 🔵 **Codex** | Agente de código para backend complejo | Servicios, APIs, integraciones, base de datos, IA, infraestructura |
| ⚪ **Claude** | Yo | Frontend (app + admin), design system, mocks, wiring de UI a APIs cuando existan, QA de UI |

El frontend (`UVA App.dc.html`) es la fuente de verdad visual: hay que reproducirlo *pixel-perfect* en el stack de producción, no copiar su estructura interna (es un prototipo HTML/CSS/JS de una herramienta de diseño, no código de producción).

**Stack objetivo** (combinando el brief y la ficha técnica, sección 30):
- App consumidor: **Expo Router + React Native + React Native Web** (Expo **SDK 54**, alineado con la versión de Expo Go disponible en Play Store para permitir testing nativo en dispositivo), TypeScript estricto, NativeWind, Zustand, TanStack Query, React Hook Form.
- Web admin: **Next.js** (separado, desktop-first), misma identidad visual.
- Backend: **NestJS + TypeScript**, **PostgreSQL** (+ pgvector para memoria/personalización), **Redis** (cache/colas/sesión), almacenamiento compatible S3.
- IA: capa de proveedores abstraída para **LLM (DeepSeek V4 Pro candidato)**, **STT** y **TTS** independientes — reemplazables sin tocar la app.
- Comercio: **WooCommerce REST API** (credenciales solo en backend) + **Mercado Pago** vía checkout de WooCommerce.
- Monorepo sugerido (Turborepo/Nx) para compartir tipos entre app, admin y backend.

> **Estado de avance:** la app consumidor vive en [`apps/mobile`](apps/mobile) (Expo Router + RN + RN Web + NativeWind + TS estricto, **Expo SDK 54**). Fases 1 y 2 listas y verificadas por web (`expo export`) **y nativamente en un Galaxy S22+ vía Expo Go**. Repo en [github.com/k1n0trz/uva-app](https://github.com/k1n0trz/uva-app). Ver detalle marcado ✅ más abajo.
>
> **Cómo correr la app** — Web: `cd apps/mobile && npx expo export --platform web` (o `npx expo start --web`). Nativo (Android, con teléfono en modo desarrollador por USB): `cd apps/mobile && npx expo start`, luego escanear el QR con Expo Go, o `adb reverse tcp:8081 tcp:8081` + abrir `exp://127.0.0.1:8081` en Expo Go.

---

## Fase 0 — Fundaciones (antes de escribir una sola pantalla)

| # | Tarea | Dueño |
|---|---|---|
| 0.1 | Confirmar naming: "Vera" es nombre de trabajo — hacer búsqueda marcaria/dominios/redes antes de fijar identidad definitiva (ficha §33) | 🟣 UVA |
| 0.2 | Confirmar mercado inicial (Colombia/COP), idioma único (español) y target 18+ para la beta | 🟣 UVA |
| 0.3 | Decidir proveedor de voz (STT/TTS) — DeepSeek **no** cubre audio; evaluar DeepInfra u otros con benchmark de acento colombiano, latencia (<2.5s objetivo), costo y privacidad (ficha §11.3) | 🟣 UVA |
| 0.4 | Conseguir credenciales de WooCommerce (consumer key/secret) y de Mercado Pago en ambiente de pruebas | 🟣 UVA |
| 0.5 | Definir accesos sociales reales a implementar: Google, Apple, Facebook, teléfono/OTP (Instagram queda fuera, confirmado) | 🟣 UVA |
| 0.6 | Aprobar contenido sensible inicial (Modo Rescate, Kegel, Primera Copa) con una persona experta en piso pélvico antes de producción (ficha §33, §15.5) | 🟣 UVA |
| 0.7 | Setear monorepo (Turborepo/Nx), repos, CI básico, convenciones de lint/format, `.env.example` | ⚪ Claude |
| 0.8 | Extraer/tokenizar design tokens del prototipo (colores, radios, tipografía Manrope, sombras, spacing) en un paquete compartido | ⚪ Claude |
| 0.9 | Definir modelo de datos funcional completo (usuario, consentimiento, perfil Vera, perfil menstrual, registro diario, producto personal, rutina/sesión, conversación, memoria, recomendación, referencia comercial, notificación, auditoría — ficha §23) como schema Postgres | 🔵 Codex |
| 0.10 | Diseñar arquitectura de servicios/microservicios y contratos de API (autenticación, perfil, ciclo, check-in, rutinas, Vera, voz, productos, comercio, promociones, anuncios, admin, analítica — ficha §24) | 🔵 Codex |

**Nota:** El repo ya tiene un asset relevante para Vera 3D: `vera/Meshy_AI_Pink_Serenity_Nurse_0715202320_texture.glb` — es un primer modelo generado en Meshy. Encaja directo en el pipeline recomendado por la ficha (§20.2: Meshy → Blender → clips pre-renderizados). Ver Fase 9.

---

## Fase 1 — Design system y shell de navegación (frontend)

Reproducir del prototipo: paleta (`#CD2F62` primary, `#9E234C` dark, `#FBE8EF`/`#FFF5F8` soft, `#282326` texto, `#6F666B` texto secundario, `#EDE4E8` borde), tipografía Manrope 400–800, radios 12–24px, sombras discretas, animaciones `breathe`/`pulse-ring`/`fadeup`, botones mín. 44×44px.

| # | Tarea | Dueño | Estado |
|---|---|---|---|
| 1.1 | Librería de componentes base: `AppButton`, `AppInput`, `AppModal`, `BottomSheet`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `HealthWarning`, `PrivacyNotice` | ⚪ Claude | ✅ `components/ui/` |
| 1.2 | `AppHeader` + `BottomNavigation` (5 tabs: Hoy, Calendario, Vera centrada y más grande, Rutinas, Tienda) — igual al patrón visto en `tabs` del prototipo | ⚪ Claude | ✅ `components/nav/` + `app/(tabs)/` |
| 1.3 | Componente `VeraAvatar` reemplazable con estados: idle, greeting, listening, thinking, speaking, guiding, celebrating, concerned, unavailable — placeholder orgánico/silueta (nunca stock ni infantil) | ⚪ Claude | ✅ `components/vera/VeraAvatar.tsx` |
| 1.4 | Setup de mocks: capa de servicios desacoplados (`authService`, `cycleService`, `veraChatService`, `speechToTextService`, `textToSpeechService`, `routinesService`, `productsService`, `wooCommerceService`, `personalizationService`, `userMemoryService`, `recommendationService`, `notificationsService`) — todas simuladas, sin claves reales | ⚪ Claude | ✅ `services/*` (contratos + mocks; datos completos llegan por fase) |
| 1.5 | Selector de escenario de desarrollo (igual al `<select>` de escenarios del prototipo): Laura/demo completa, usuaria nueva, sin productos, primera copa, con Kegel, ciclo irregular, mic denegado, sin conexión | ⚪ Claude | ✅ `stores/scenarioStore.ts` + `components/dev/ScenarioSwitcher.tsx` (gated tras `__DEV__`) |

**Extra de Fase 1** (no listado originalmente, agregado por necesidad): experiencia web centrada tipo app (max-width 480px, sin estirar en pantallas anchas) en `app/_layout.tsx`, según brief §5.

---

## Fase 2 — Onboarding, auth y privacidad (mock)

Pantallas del prototipo: splash → intro Vera (voz/texto) → onboarding conversacional (10 preguntas + resumen editable) → privacidad (consentimiento general + sensible) → auth (email/Google/Apple/Facebook/teléfono/invitada).

| # | Tarea | Dueño | Estado |
|---|---|---|---|
| 2.1 | Splash con logo + animación `breathe` | ⚪ Claude | ✅ `app/index.tsx` (+ atajo dev "saltar a la app") |
| 2.2 | Flujo onboarding conversacional completo: progreso, omitir, volver, chips, input, selector múltiple de productos, resumen editable | ⚪ Claude | ✅ `app/(onboarding)/chat.tsx` + `stores/onboardingStore.ts` + `constants/onboarding.ts` |
| 2.3 | Pantallas de consentimiento (general vs. sensible, independientes, bloquean continuar si falta el general) | ⚪ Claude | ✅ `app/(onboarding)/privacy.tsx` + `components/ui/Checkbox.tsx` |
| 2.4 | Pantallas de auth (mock): email/password, Google, Apple, Facebook, teléfono+OTP, continuar sin cuenta, recuperación | ⚪ Claude | ✅ `app/(auth)/login.tsx` (React Hook Form; teléfono/OTP + recuperación como entry points, se conectan en 2.5). Verificación por código y biometría: pendientes de sub-pantalla dedicada |
| 2.5 | **Backend real de auth**: registro, login, refresh, OTP por teléfono, login federado (Google/Apple/Facebook), recuperación segura (sin revelar si la cuenta existe), políticas de contraseña, rate limiting | 🔵 Codex | |
| 2.6 | **Migración invitada → registrada**: fusionar calendario/productos/rutinas sin duplicar, pedir confirmación si ya existe cuenta con mismo correo/proveedor (ficha §9.1) | 🔵 Codex | |
| 2.7 | Servicio de consentimientos versionados y revocables (tipo, versión, fecha, estado, evidencia) | 🔵 Codex | |
| 2.8 | Revisar textos de privacidad con legal antes de producción (Ley 1581 de 2012) | 🟣 UVA | |

**Nota de alcance:** el catálogo completo de productos de la ficha §8.4 (con buscador y categorías) vive en la pantalla dedicada "Mis productos" (Fase 6). El paso de onboarding usa la lista corta de chips del prototipo, con "No tengo productos UVA" como respuesta de primera clase (excluyente con productos reales, verificado).

---

## Fase 3 — Hoy, Calendario y Check-in (mock)

| # | Tarea | Dueño |
|---|---|---|
| 3.1 | Pantalla "Hoy con Vera": saludo, tarjeta Vera, resumen de ciclo, "Tu cuerpo hoy", "Tu rutina", tarjeta Primera Copa (condicional), "Prepárate" con productos, promo, botón "Necesito ayuda ahora" | ⚪ Claude |
| 3.2 | Check-in diario en bottom sheet: flujo, síntomas (multi-select), nota, estados (sin síntomas, parcial, guardado, error, sin conexión) | ⚪ Claude |
| 3.3 | Calendario mensual: celdas con estado (registrado/estimado/hoy), leyenda, historial de ciclos, nota de confianza según regularidad | ⚪ Claude |
| 3.4 | Mensajería de incertidumbre correcta según ficha §12.2 (sin historial / un ciclo / varios ciclos / irregular / embarazo-posparto-menopausia desactiva predicción estándar) | ⚪ Claude (copy) + 🔵 Codex (lógica real) |
| 3.5 | **Backend real**: servicio de ciclo (registrar, editar, calcular predicción por rango con nivel de confianza, no anticonceptiva/no diagnóstica), servicio de check-in (crear/editar/consultar) | 🔵 Codex |
| 3.6 | Modo offline: guardar registro local y sincronizar después (ficha §26 Offline) | 🔵 Codex (sync) + ⚪ Claude (UI offline banner, ya está en el prototipo) |

---

## Fase 4 — Vera (chat), Modo Rescate, Modo Primera Copa (mock)

| # | Tarea | Dueño |
|---|---|---|
| 4.1 | Chat con Vera: burbujas, quick replies, pulsar-para-hablar, transcripción editable, detener voz, estados (escuchando/procesando/pensando/hablando/error mic/sin conexión/timeout) | ⚪ Claude |
| 4.2 | Modo Rescate: 10 situaciones (copa no abre, filtraciones, no retira, no sabe si está bien puesta, manchado, cólicos, olvidó limpiar, no sabe qué usar, dolor, otro) + advertencia de "consulta profesional" cuando aplique | ⚪ Claude |
| 4.3 | Modo Primera Copa: 14 etapas, progreso, expandir/colapsar, "lo logré"/"necesito ayuda" (deriva a Rescate), evaluación final | ⚪ Claude |
| 4.4 | Personalización por producto declarado (no extrapolar instrucciones de una copa a otra sin validar — ficha §13.3) | ⚪ Claude (UI condicional) + 🔵 Codex (reglas) |
| 4.5 | **Backend/IA real — flujo completo de voz**: mic → STT → clasificación de intención → extracción estructurada → motor de reglas de seguridad → contexto (perfil+memoria+biblioteca UVA validada) → LLM (DeepSeek u otro) → filtro de salida → texto/voz (ficha §11.1, §19.1) | 🔵 Codex |
| 4.6 | Motor de reglas: elegibilidad, alertas, contraindicaciones, límites (nunca diagnostica, nunca promete anticoncepción/fertilidad, detiene ante dolor) | 🔵 Codex |
| 4.7 | Capa de abstracción de proveedores LLM/STT/TTS (reemplazable sin reescribir app; registrar costo/latencia/calidad por proveedor) | 🔵 Codex |
| 4.8 | Biblioteca de contenido UVA validado (tutoriales, limpieza, rutinas) — contenido debe tener dueño y aprobación profesional | 🟣 UVA (contenido) + 🔵 Codex (CMS/almacenamiento) |
| 4.9 | Memoria: hechos estructurados con fuente/confianza/expiración, no conversaciones completas indefinidamente; toggle activar/desactivar, borrar recuerdo individual o historial completo | 🔵 Codex |

---

## Fase 5 — Rutinas, piso pélvico y Bolas Kegel (mock)

| # | Tarea | Dueño |
|---|---|---|
| 5.1 | Hub de rutinas generales (conciencia, respiración, coordinación, fortalecimiento, resistencia) — disponibles para todas | ⚪ Claude |
| 5.2 | Evaluación inicial Kegel (4+ preguntas de elegibilidad y señales de exclusión) | ⚪ Claude |
| 5.3 | 3 niveles Kegel con gate real: declarar tener las bolas **y** pasar el filtro **y** superar autoevaluación de cada nivel — nunca desbloquear por compra o por solo completar sesión (ficha §15.4, corrección importante) | ⚪ Claude (UI) + 🔵 Codex (reglas de progresión) |
| 5.4 | Player de rutina: temporizador, animación de respiración, pausar/reanudar/finalizar, autoevaluación final (comodidad/control/dolor), advertencia si hay dolor | ⚪ Claude |
| 5.5 | Historial de rutinas | ⚪ Claude (UI) + 🔵 Codex (persistencia) |
| 5.6 | **Validación clínica del contenido Kegel/piso pélvico por profesional antes de producción** (ficha §33 — riesgo marcado explícitamente) | 🟣 UVA |

---

## Fase 6 — Mis productos, Tienda, WooCommerce/Mercado Pago (mock → real)

| # | Tarea | Dueño |
|---|---|---|
| 6.1 | "Mis productos": estados (lo tengo / lo uso / quiero conocerlo / dejé de usarlo / no recuerdo cuál es), tutoriales, rutinas relacionadas, FAQs | ⚪ Claude |
| 6.2 | Tienda: categorías, grid de productos, ficha de producto (precio COP, promo, stock, rating, "por qué te lo recomendamos", agregar a mis productos, ver en UVA, comprar) | ⚪ Claude |
| 6.3 | Checkout simulado: abre "ventana segura" (WebBrowser) con vuelta clara a la app — **nunca** checkout nativo ni datos de tarjeta simulados | ⚪ Claude |
| 6.4 | **Integración real WooCommerce**: sync de catálogo/precio/stock/variantes vía REST API, claves solo en backend, webhooks para inventario/pedidos | 🔵 Codex |
| 6.5 | **Enlace de compra con producto/variación ya en el carrito** (no solo landing) para reducir fricción, con Mercado Pago como método de pago en WooCommerce (ficha §17.3, recomendación explícita) | 🔵 Codex |
| 6.6 | Atribución de conversión (clic → apertura checkout → compra) sin enviar datos íntimos a plataformas publicitarias | 🔵 Codex |
| 6.7 | Reglas comerciales: nunca recomendar agotado, explicar motivo, distinguir "puede ayudarte"/"opcional"/"ya lo tienes" | ⚪ Claude (UI) + 🔵 Codex (motor de recomendación) |
| 6.8 | Confirmar con el equipo de e-commerce si se comparte identidad de cuenta o se vincula por correo/token entre app y WooCommerce (ficha §33, decisión pendiente) | 🟣 UVA |

---

## Fase 7 — Perfil, privacidad y memoria (mock)

| # | Tarea | Dueño |
|---|---|---|
| 7.1 | Perfil: objetivos, ciclo, productos, preferencias de Vera, voz/audio, notificaciones, modo discreto, biometría, cuenta, pedidos, privacidad, descargar mis datos, eliminar cuenta, cerrar sesión | ⚪ Claude |
| 7.2 | "Lo que Vera sabe de mí": ver/corregir/eliminar recuerdos, diferenciar declarado vs. inferido, activar/desactivar memoria, borrar historial conversacional | ⚪ Claude |
| 7.3 | **Backend real**: exportación de datos, eliminación de cuenta con confirmación, borrado de memoria/historial con retención configurable | 🔵 Codex |

---

## Fase 8 — Panel administrativo (Next.js, desktop-first)

| # | Tarea | Dueño |
|---|---|---|
| 8.1 | Shell admin: sidebar (Dashboard, Usuarios, Promociones, Anuncios, Rutinas, Configuración) + identidad UVA | ⚪ Claude |
| 8.2 | Dashboard: stats (usuarias activas, onboardings, conversaciones Vera, pedidos referidos) + actividad reciente | ⚪ Claude |
| 8.3 | Usuarios: buscar/filtrar, ver estado, editar datos administrativos, activar/desactivar, eliminar con confirmación — **sin exponer registros de salud íntimos** | ⚪ Claude (UI) + 🔵 Codex (permisos/roles) |
| 8.4 | Promociones: crear/editar/programar/segmentar/URL interna-externa/activar-desactivar | ⚪ Claude (UI) + 🔵 Codex (CRUD + reglas de segmento) |
| 8.5 | Anuncios: título/imagen/fechas/segmento/prioridad/URL/preview — **nunca interrumpir Modo Rescate ni conversaciones sensibles** | ⚪ Claude |
| 8.6 | Módulo rutinas (admin): crear pasos, orden, duración, clips de Vera asociados, elegibilidad, publicar/borrador | ⚪ Claude (UI) + 🔵 Codex (backend) |
| 8.7 | **Roles y permisos reales**: superadmin, contenido, comercial, soporte, analítica, clínico/editor experto — con auditoría de quién cambió qué y cuándo (ficha §22) | 🔵 Codex |
| 8.8 | Definir quién ocupa cada rol y flujo de aprobación de contenido sensible | 🟣 UVA |

---

## Fase 9 — Vera 3D (pipeline de animación)

| # | Tarea | Dueño |
|---|---|---|
| 9.1 | Revisar el modelo ya generado (`vera/Meshy_AI_Pink_Serenity_Nurse_0715202320_texture.glb`) contra el brief: adulta estilizada, cálida, sofisticada, sin apariencia médica/infantil/sexualizada — ajustar dirección si el nombre/skin actual ("Nurse") no calza con "acompañamiento, no enfermedad" | 🟣 UVA |
| 9.2 | Corrección de topología, rigging, materiales y expresiones en Blender | 🟣 UVA (o proveedor externo que definan) |
| 9.3 | Crear clips por estado: bienvenida, escuchando, procesando, hablando, explicando paso a paso, guiando respiración, celebración discreta, preocupación/alerta, espera/error | 🟣 UVA |
| 9.4 | Exportar optimizado (GLB/FBX) + versiones pre-renderizadas (recomendación: **no** renderizar 3D complejo en tiempo real en todos los dispositivos para la beta) | 🟣 UVA |
| 9.5 | Integrar clips en `VeraAvatar` con fallback estático, carga diferida y caché | ⚪ Claude |
| 9.6 | Modo bajo consumo (imagen estática) y "reducir movimiento" | ⚪ Claude |

---

## Fase 10 — Notificaciones

| # | Tarea | Dueño |
|---|---|---|
| 10.1 | UI de configuración: tipos (registro, próximo periodo, preparación, rutina, cuidado, Primera Copa, promos, pedidos) × 3 niveles de discreción | ⚪ Claude |
| 10.2 | **Backend**: plantillas, segmentación, límites de frecuencia, no insistir tras rechazo repetido, no mostrar detalle sensible en pantalla bloqueada por defecto | 🔵 Codex |

---

## Fase 11 — Seguridad, privacidad y cumplimiento

| # | Tarea | Dueño |
|---|---|---|
| 11.1 | Revisión legal formal bajo Ley 1581/2012 (Colombia): autorización previa/expresa/informada, finalidades claras, mecanismos de consulta/rectificación/supresión | 🟣 UVA |
| 11.2 | Cifrado en tránsito (TLS) y en reposo, separación lógica identidad/salud/conversaciones/comercio, mínimo privilegio, secretos en gestor seguro (nunca en app/repo) | 🔵 Codex |
| 11.3 | Auditoría de accesos administrativos, entornos separados (dev/test/prod), pruebas de penetración y análisis de dependencias | 🔵 Codex |
| 11.4 | Declaraciones de salud/privacidad para Google Play y guidelines de Apple para apps de salud — verificar que la ficha de privacidad coincida con el comportamiento real | 🟣 UVA |
| 11.5 | Definir política de menores (beta 18+ hasta evaluación legal específica) | 🟣 UVA |

---

## Fase 12 — No funcionales, analítica y pruebas

| # | Tarea | Dueño |
|---|---|---|
| 12.1 | Accesibilidad: contraste AA, texto escalable, labels, foco visible, navegación por teclado en web, subtítulos para toda voz, "reducir movimiento" | ⚪ Claude |
| 12.2 | Resoluciones mínimas 360×800 hasta 1440px de ancho, verificación responsive completa | ⚪ Claude |
| 12.3 | Analítica de eventos (adquisición, onboarding, activación, retención D1/D7/D30, calendario, Vera, rutinas, productos, tienda, privacidad, calidad) — **sin texto libre ni síntomas detallados** | 🔵 Codex |
| 12.4 | Suite de pruebas: unitarias (cálculo de calendario/reglas), integración (WooCommerce/Mercado Pago/DeepSeek/STT/TTS), seguridad/permisos, conversaciones inseguras, accesibilidad, voz con acentos/ruido, recuperación ante fallos, exportación/eliminación de datos | 🔵 Codex (backend) + ⚪ Claude (frontend/UI) |
| 12.5 | Piloto cerrado segmentado (sin productos, primeras usuarias de copa, experimentadas, con Bolas Kegel) — medir comprensión, confianza, utilidad, presión comercial percibida | 🟣 UVA |

---

## Fase 13 — Publicación

| # | Tarea | Dueño |
|---|---|---|
| 13.1 | Cuentas de Google Play / App Store, contratos con proveedores (IA, voz, hosting) revisados | 🟣 UVA |
| 13.2 | Gate de lanzamiento: contenido sensible aprobado, políticas listas, integraciones de pago probadas, monitoreo/soporte definidos | 🟣 UVA + 🔵 Codex |
| 13.3 | Empaquetado/build de producción (Expo EAS build, despliegue web/admin) | ⚪ Claude + 🔵 Codex |

---

## Fases futuras (post-MVP, no bloquean la beta)

Del roadmap de la ficha (§32): escaneo QR y pasaporte de producto (1.1) · patrones avanzados / "Mapa Vivo UVA" (1.2) · hidratación/cuidado íntimo/dilatadores con validación experta (1.3) · maternidad/posparto (2.0) · belleza (2.1) · wearables (2.2) · avatar con lip-sync en tiempo real (3.0) · modelos propios de recomendación entrenados con datos autorizados (3.1) · expansión internacional.

---

## Riesgos y decisiones abiertas que necesitan resolución de UVA antes de escalar

Estas son las que la propia ficha marca como pendientes (§33) — las dejo aquí para que no se pierdan:

1. Disponibilidad real del nombre "Vera" (marca/dominio/redes).
2. Proveedor de voz definitivo (benchmark pendiente).
3. Real-time 3D vs. clips pre-renderizados — mantener clips como base, probar tiempo real aparte.
4. Instagram Login — no incluir hasta validar un flujo de consumidor.
5. Acceso de menores — bloqueado en 18+ hasta revisión legal/producto.
6. Contenido Kegel — requiere validación de profesional de piso pélvico.
7. Compra directa a carrito/checkout vs. landing — probar para mejorar conversión.
8. Sincronización de identidad de cuenta entre UVA App y WooCommerce.
9. Uso de datos para ML — consentimiento separado, anonimización, retención.
10. Modelo de costos de IA/voz por usuaria activa (proyectar en 1K/10K/100K usuarias).
11. Catálogo/reglas por país para expansión futura.

---

## Orden recomendado de arranque inmediato

1. 🟣 UVA cierra Fase 0 (naming, mercado, accesos sociales reales, proveedor de voz, credenciales de prueba).
2. ⚪ Claude arranca en paralelo: monorepo + design tokens + shell de navegación + `VeraAvatar` placeholder (Fase 1), sin esperar al backend.
3. 🔵 Codex arranca en paralelo: modelo de datos (0.9) y contratos de API (0.10), para que cuando el frontend mock esté listo, conectar sea un simple swap de `services/*` por clientes reales.
4. Frontend mock completo (Fases 2–8) es el hito de "app ejecutable, navegable, sin backend real" que pide el brief original.
5. Backend + IA (Codex) se conectan fase por fase, reemplazando cada mock service sin tocar UI.
