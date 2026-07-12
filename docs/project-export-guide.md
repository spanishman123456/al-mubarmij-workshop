# Project export guide

Choose the output for the target device:

| Output | Use | Important constraint |
| --- | --- | --- |
| Web | Sharing from a normal web server | Serve over HTTP(S) |
| PWA | Install-like browser experience | HTTPS and browser support required |
| Tauri MSI/NSIS | Managed Windows desktops | Build on Windows; signing optional |

For Tauri, prepare a self-contained `dist/index.html` and local assets, then
dispatch `Build SKUI Windows export`. Set `dist_path` to that checked-in export
directory and use a SemVer version. Download the workflow artifact containing
the installers and `SHA256SUMS.txt`.

If signing secrets are absent, the workflow intentionally emits unsigned
installers. If exactly one secret is present, the build fails instead of
silently producing a partly configured release.

Do not place Python launchers, secrets, source maps containing private data, or
remote CDN references in the release directory.
