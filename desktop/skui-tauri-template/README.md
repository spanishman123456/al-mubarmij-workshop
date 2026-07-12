# SKUI Tauri 2 export template

This is a minimal Tauri 2 host for already-built static assets.

1. Replace everything in `dist/` with the SKUI export. The entry point must be
   `dist/index.html`; all runtime dependencies must be local.
2. Review the CSP in `src-tauri/tauri.conf.json` and keep it at least as
   restrictive. Exported code must not require network, filesystem, or shell
   access.
3. On Windows, install Rust and the Tauri 2 prerequisites, then run:

   ```powershell
   cargo install tauri-cli --version "^2" --locked
   Set-Location src-tauri
   cargo tauri build --bundles nsis,msi
   ```

The Rust host registers no commands or plugins. Its sole capability has an
empty permission list. The checked-in `dist/` page is only a placeholder, not
a student project.

Windows installer construction and signing are intentionally delegated to
`.github/workflows/skui-windows-export.yml`.
