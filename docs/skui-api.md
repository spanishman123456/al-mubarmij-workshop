# SKUI built-in bridge

The `skui` module is a declarative, educational API. Supported exports should
be limited to the documented operations for:

- page title and text;
- text/number inputs and outputs;
- buttons and click handlers;
- a bounded canvas with rectangle, text, clear, and build operations.

Calls update an internal model. The worker sends a serializable snapshot to
the sandboxed renderer; the renderer sends validated input and button events
back. Event messages must never contain executable JavaScript, DOM handles, or
Tauri command names.

`skui` does not promise CPython GUI compatibility and is not an alias for
Tkinter, PyGame, browser DOM access, file access, subprocesses, sockets, or
HTTP. Unsupported imports should fail with a student-readable error rather
than being forwarded to the host.
