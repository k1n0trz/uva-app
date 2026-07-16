# UVA App — frontend (Expo)

## SDK

This project targets **Expo SDK 54** (not the latest). This is deliberate: SDK 54
is what the Expo Go build available on the Play Store runs, which lets us test
natively on real devices without a custom dev build. Read the versioned docs at
https://docs.expo.dev/versions/v54.0.0/ before writing code — do not assume the
latest SDK's APIs.

If you bump the SDK, Expo Go on device must support it or native testing breaks.

## Design source of truth

The approved design lives in the handoff prototype at
`frontend/Diseño original sin Bootstrap-handoff.zip` → `project/UVA App.dc.html`.
Recreate it visually; do not copy its internal structure (it's an HTML/CSS
prototype, not production code). Design tokens are mirrored in
`tailwind.config.js` and `constants/theme.ts` — use those, never raw hex.

## Non-negotiable product rules

These come from the ficha técnica and are health/privacy constraints, not style
preferences:

- Never diagnose, never promise contraception/fertility, never infer pregnancy.
- Cycle prediction is always a **range** with uncertainty language; with little
  data, say so instead of showing a confident date.
- Kegel levels unlock by functional criteria + self-assessment, never by purchase.
- Commercial recommendations must be optional, explained, and never shown in
  Modo Rescate or sensitive conversations.
- Services in `services/` are mocks behind typed interfaces — swap them for real
  API clients without touching UI. Never put keys/secrets in the app.

## Gotchas found the hard way

- `react-native-web` keeps a closed `<Modal visible={false}>` mounted, leaving its
  controls in the a11y tree and tab order. `BottomSheet`/`AppModal` return `null`
  when closed for this reason — don't "simplify" that away.
- `accessibilityState={{ checked }}` doesn't map to `aria-checked` on RN-web 0.21;
  `Checkbox` passes `aria-checked` explicitly on web.
- No CSS `conic-gradient` in RN — use `ProgressRing` (SVG).
- Dev-only UI must be gated behind `__DEV__` (see `ScenarioSwitcher`), which is
  false in `expo export` production builds.

## Run

- Web: `npx expo start --web` (or `npx expo export --platform web`)
- Native (Android over USB): `adb reverse tcp:8081 tcp:8081`, `npx expo start`,
  then open `exp://127.0.0.1:8081` in Expo Go. Deep link a route with
  `exp://127.0.0.1:8081/--/hoy`.
