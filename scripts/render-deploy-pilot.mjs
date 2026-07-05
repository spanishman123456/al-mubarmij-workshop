#!/usr/bin/env node
/**
 * Trigger Render deploy for student-pilot-batch-07.
 *
 * Usage (deploy hook — preferred):
 *   RENDER_DEPLOY_HOOK_URL='https://api.render.com/deploy/srv-...?...' \
 *     node scripts/render-deploy-pilot.mjs
 *
 * Usage (Render API):
 *   RENDER_API_KEY='rnd_...' RENDER_SERVICE_ID='srv-...' \
 *     node scripts/render-deploy-pilot.mjs
 */
const COMMIT = process.env.DEPLOY_COMMIT || "457c1cb";
const HOOK = process.env.RENDER_DEPLOY_HOOK_URL?.trim();
const API_KEY = process.env.RENDER_API_KEY?.trim();
const SERVICE_ID = process.env.RENDER_SERVICE_ID?.trim();

async function viaHook() {
  const url = new URL(HOOK);
  url.searchParams.set("ref", COMMIT);
  const res = await fetch(url.toString(), { method: "POST" });
  const text = await res.text();
  if (!res.ok) throw new Error(`Deploy hook failed ${res.status}: ${text}`);
  console.log(JSON.stringify({ ok: true, method: "hook", commit: COMMIT, response: text }));
}

async function viaApi() {
  const res = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commitId: COMMIT, clearCache: "do_not_clear" }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Render API deploy failed ${res.status}: ${JSON.stringify(body)}`);
  console.log(JSON.stringify({ ok: true, method: "api", commit: COMMIT, deploy: body }));
}

async function main() {
  if (HOOK) return viaHook();
  if (API_KEY && SERVICE_ID) return viaApi();
  console.error(
    "Set RENDER_DEPLOY_HOOK_URL or (RENDER_API_KEY + RENDER_SERVICE_ID). See docs/render-deploy-pilot.md",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
