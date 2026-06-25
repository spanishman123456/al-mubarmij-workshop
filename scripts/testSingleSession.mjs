const BASE = "http://127.0.0.1:3001";
const NID = "1165814631";

async function login(label) {
  const res = await fetch(`${BASE}/api/auth/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId: NID }),
    credentials: "include",
  });
  const data = await res.json();
  const cookie = res.headers.getSetCookie?.()?.[0] || "";
  console.log(label, res.status, data.ok, data.code || data.messageAr || "ok");
  return { res, data, cookie };
}

async function me(cookieHeader) {
  const res = await fetch(`${BASE}/api/auth/me`, {
    headers: cookieHeader ? { Cookie: cookieHeader.split(";")[0] } : {},
  });
  const data = await res.json();
  console.log("me", res.status, data.user?.nameAr || "null");
  return data;
}

async function logout(cookieHeader) {
  const res = await fetch(`${BASE}/api/auth/logout`, {
    method: "POST",
    headers: cookieHeader ? { Cookie: cookieHeader.split(";")[0] } : {},
  });
  console.log("logout", res.status, (await res.json()).ok);
}

function extractCookie(setCookie) {
  if (!setCookie) return "";
  return setCookie.split(";")[0];
}

async function main() {
  const jar = { device1: "", device2: "" };

  const first = await fetch(`${BASE}/api/auth/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId: NID }),
  });
  jar.device1 = extractCookie(first.headers.get("set-cookie"));
  console.log("device1 login", first.status, (await first.json()).ok);

  const second = await fetch(`${BASE}/api/auth/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId: NID }),
  });
  const secondData = await second.json();
  console.log("device2 login", second.status, secondData.ok, secondData.code);

  await me(jar.device1);

  await fetch(`${BASE}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: jar.device1 },
  });
  console.log("device1 logged out");

  const third = await fetch(`${BASE}/api/auth/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId: NID }),
  });
  jar.device2 = extractCookie(third.headers.get("set-cookie"));
  console.log("device2 login after logout", third.status, (await third.json()).ok);
}

main().catch(console.error);
