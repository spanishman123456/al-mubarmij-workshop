# SKUI security model

- Student Python runs in a worker, not in the host page or Rust process.
- The `skui` built-in exposes an allowlisted UI vocabulary. It is not a shell,
  filesystem, DOM, or network bridge.
- The preview iframe must use a sandbox without `allow-same-origin`,
  `allow-top-navigation`, `allow-popups`, or `allow-forms`. Messages must check
  source, type, shape, size, and project/session identifier.
- Exported assets are local. The expected Skulpt build hash is
  `e3c1c1a4e081362d96ba8afc5997be516b437f30`.
- Tauri CSP denies connections, objects, forms, and embedding. Scripts may
  load only from the packaged app. The only capability has no permissions;
  there are no shell, filesystem, network, updater, or dialog plugins.

These controls reduce exposure; they are not proof that hostile Python is
fully isolated. Resource limits, message validation, dependency review, and
testing remain required. Do not add a permissive Tauri command to work around
an export limitation.
