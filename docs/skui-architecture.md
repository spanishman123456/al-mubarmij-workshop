# SKUI export architecture

SKUI is the platform's small, built-in educational UI bridge. Student Python
describes text, inputs, buttons, outputs, and canvas operations; it does not
receive a general browser API.

The exported runtime is split into three trust boundaries:

1. The host page owns project loading and lifecycle.
2. Python executes with the locally vendored Skulpt runtime in a Web Worker.
3. UI output is rendered in a sandboxed iframe. Structured, validated messages
   carry UI snapshots and user events between the iframe, host, and worker.

No Python source is evaluated by the Tauri Rust process. The desktop wrapper
only serves the same static `dist` assets in a webview. It registers no Tauri
commands or plugins.

The vendored `skulpt.min.js` reports upstream build hash
`e3c1c1a4e081362d96ba8afc5997be516b437f30`. Exports must vendor both Skulpt
and its standard library; a CDN dependency would break the offline and
`connect-src 'none'` guarantees.

Vendored file SHA-256 values:

- `skulpt.min.js`: `1a319d8eedf314dba5af2444313e3cf2ac072a335df0f5100277e8f49b64eae9`
- `skulpt-stdlib.js`: `e3ecccbc17c6164d19ed3c5561aaaeb752c38c8efa2d88b62b5fb7a7e1b086a7`

The Web/PWA and Tauri packages share this browser runtime. PWA adds a manifest
and service worker. Tauri adds an NSIS or MSI shell; it does not turn the
project into native Python.
