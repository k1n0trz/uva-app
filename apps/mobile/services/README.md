# services/

Desacoplado por diseño (ver `ROADMAP.md` Fase 1.4 y `data/prompt-claude.txt` §2).

Cada carpeta expone una interfaz TypeScript + una implementación mock. Las
pantallas importan la interfaz, no la clase mock — así, cuando Codex construya
el backend real, el swap es un cambio de un archivo (`services/<dominio>/index.ts`
pasa de exportar el mock a exportar un cliente HTTP), sin tocar UI.

Ninguna carpeta debe contener claves, secretos ni credenciales reales.
