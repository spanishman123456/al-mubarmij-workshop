# Code Normalization Report

## Added Normalization Layer
- File: `src/lib/text/codeNormalization.js`
- APIs:
  - `normalizeExecutablePythonCode(text)`
  - `normalizeCodeFieldsDeep(input, fieldNames)`
- Default code-like fields:
  - `code`
  - `starterCode`
  - `solutionCode`
  - `expectedCode`
  - `snippet`
  - `expression`
  - `expectedOutput`

## Normalization Rules
- Typographic double quotes → ASCII double quote
- Typographic single quotes → ASCII single quote
- Unicode minus (`−`) → ASCII minus (`-`)
- Split operators repaired:
  - `= =` → `==`
  - `+ =` → `+=`
  - `- =` → `-=`
  - `! =` → `!=`
  - `< =` → `<=`
  - `> =` → `>=`

## Where Applied
- Runtime normalization before loop-lab analysis/execution:
  - `src/components/lesson/LoopControlLab.jsx`
- Code-block rendering normalization:
  - `src/components/BilingualTextBlocks.jsx` (`LtrCodeBlock`)

## Tests
- `src/lib/text/codeNormalization.test.js`
  - verifies quote/minus/operator normalization
  - verifies normalization is restricted to code-like keys (not arbitrary Arabic narrative fields)

## Status
- Runtime protection for executable snippets: `fixed`
- Global historical content rewrite in-place: `needs-review`
