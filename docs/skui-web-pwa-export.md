# SKUI Web and PWA export

A Web export is a static directory with `index.html`, local JavaScript/CSS,
the worker, the sandboxed preview document, and vendored Skulpt files. Serve
it over HTTP(S); opening it as `file://` is not a supported deployment.

A PWA export adds a manifest, icons, and service worker. Installation and
service workers require HTTPS (localhost is the development exception).
Offline behavior begins only after required local assets have been cached.
Changing an export requires a cache/version update.

The package must not fetch Skulpt from a CDN. A strict deployment CSP should
match the desktop policy where possible. Network-dependent student programs
are outside the supported SKUI API.
