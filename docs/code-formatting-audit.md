# Code Formatting Audit

## Scope
- Lesson code blocks and worked examples
- Interactive Python labs (`LoopControlLab`, matrix activity)
- Mixed Arabic/English/code rendering paths

## What Was Fixed
- Unified LTR code-block rendering behavior in `src/components/BilingualTextBlocks.jsx`:
  - `direction: ltr`
  - `text-align: left`
  - `unicode-bidi: isolate`
  - `white-space: pre`
  - `tab-size: 4`
  - monospace stack (`ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`)
- Added executable-code normalization utility:
  - `src/lib/text/codeNormalization.js`
  - Fixes typographic quotes (`“ ” ‘ ’`) in code fields
  - Fixes unicode minus (`−`) to ASCII minus (`-`) in code fields
  - Fixes split operators (`= =`, `+ =`, `- =`, `<=`, `>=`, `!=` spaced forms) in code fields
- Applied normalization in loop interactive execution path:
  - `src/components/lesson/LoopControlLab.jsx`

## Findings (Repository Scan)
- Symbol/operator scan across `src/content` surfaced mixed text cases containing:
  - mathematical minus glyphs (`−`) mostly in narrative/math notation
  - a small number of split-operator tokens in non-executable prose hints
- No broad operator-splitting issues detected in `src/components` code paths from the scan.

## Current Risk Status
- Interactive loop code execution formatting: `fixed`
- LTR code block visual consistency: `fixed`
- Repository-wide content-bank normalization (all historical entries): `needs-review`
  - A full automated rewrite of every historical content file was intentionally not forced in this patch to avoid accidental corruption of Arabic narrative text.
