// functions/search.js

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const mobile = (url.searchParams.get("mobile") || "").replace(/\D/g, "");
  const clinic = "52";

  if (!/^\d{10}$/.test(mobile)) {
    return new Response(JSON.stringify({ error: "Invalid mobile number" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const api = `https://api.emedhub.in/fo/qr/patient/search/?search_key=${mobile}&clinic_id=${clinic}`;

  try {
    const resp = await fetch(api);
    const text = await resp.text();

    return new Response(text, {
      status: resp.status,
      headers: { "Content-Type": resp.headers.get("content-type") || "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Fetch failed", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
