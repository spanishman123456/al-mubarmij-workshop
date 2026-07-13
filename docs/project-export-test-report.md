# Project export test report

Status as of 2026-07-12:

| Check | Status |
| --- | --- |
| Template configuration review | Completed |
| No Tauri shell/fs/network plugin declared | Completed |
| Empty capability permission list | Completed |
| Strict desktop CSP configured | Completed |
| Workflow does not invoke student Python | Completed by static review |
| Build NSIS on `windows-latest` | Pending workflow run |
| Build MSI on `windows-latest` | Pending workflow run |
| Verify optional Authenticode signature | Pending signed workflow run |
| Install, launch, upgrade, uninstall | Pending Windows test |
| Web/PWA browser and offline matrix | Pending |

No Windows build or signing success is claimed by this report. Record workflow
run URL, artifact checksum, certificate subject/thumbprint, Windows version,
and observed installer results when those tests are performed.
