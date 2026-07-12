# SKUI Tauri 2 export

`desktop/skui-tauri-template` is a static-asset host:

- put the completed export in `dist/`;
- build from `src-tauri/`;
- produce `nsis` and `msi` bundles;
- do not add shell, filesystem, or network plugins.

The checked-in `dist` is only a placeholder. The template's CSP permits local
scripts, local/sandbox frames, and workers, while denying network connections.
Its capability permission list is empty.

Use `.github/workflows/skui-windows-export.yml` for a reproducible Windows
build. It can sign produced `.exe` and `.msi` files with optional PFX secrets,
verifies configured signatures, and publishes SHA-256 checksums. It packages
static assets and Rust only; it does not execute student Python during build.

Windows bundle construction, installation/uninstallation, SmartScreen
behavior, and Authenticode verification remain **pending** until the workflow
has actually run on `windows-latest`.
