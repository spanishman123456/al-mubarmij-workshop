# Project export security report

## Reviewed design

- Tauri 2 host contains no application commands and no plugins.
- Capability `empty` has zero permissions.
- CSP denies network access and remote scripts; local workers and the local
  sandbox frame are the required execution primitives.
- The workflow has read-only repository permission and never runs student
  Python. PFX material is written under the runner temporary directory and
  removed in a `finally` block.
- Final installers are hashed after optional signing. When signing is
  configured, every discovered MSI/EXE is checked with `signtool verify`.

## Residual risks

The PFX password is necessarily supplied to `signtool` on the ephemeral runner.
GitHub-hosted runner trust and secret access controls remain part of the threat
model. CSP does not correct unsafe application logic, and a WebView/Skulpt
vulnerability could cross intended boundaries. Dependencies and GitHub Actions
should be reviewed and pinned according to the project's release policy.

## Status

This is a design/configuration review, not a penetration test. Windows build,
signature, installation, repair, upgrade, and uninstall tests are **pending**
until the workflow actually runs.
