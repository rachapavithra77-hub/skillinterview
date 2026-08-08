export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  "Access-Control-Max-Age": "86400",
};

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function errorResponse(error: unknown) {
  const e = error as { name?: string; message?: string; status?: number };
  const status = typeof e?.status === "number" ? e.status : e?.name === "AIConfigError" ? 500 : 500;
  return json(
    { error: e?.message || "Unexpected server error", code: e?.name || "ServerError" },
    status,
  );
}
