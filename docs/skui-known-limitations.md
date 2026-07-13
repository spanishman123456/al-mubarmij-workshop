# SKUI known limitations

- Skulpt implements a Python subset, not CPython. Native wheels and modules
  such as Tkinter, PyGame, sockets, and arbitrary filesystem access do not run.
- SKUI supports its documented widgets and canvas operations only. It is not a
  general DOM or desktop GUI bridge.
- Worker termination can stop runaway execution, but browsers may still vary
  in timing and memory behavior.
- iframe sandboxing and CSP can restrict browser features used by otherwise
  valid web code.
- PWA installation varies by browser and requires HTTPS. iOS and Android do
  not run Windows installers.
- The Tauri wrapper supports the Windows targets configured here; macOS,
  Linux, mobile, auto-update, and code-signing services are not supplied.
- Unsigned Windows installers may trigger SmartScreen. Signing and installer
  behavior are pending real workflow and installation tests.
- The template does not itself generate `dist`; it only embeds a prepared,
  fully local SKUI export.
