export function GET() {
  return Response.json({
    ok: true,
    app: "AnimeDebt Studio",
    backend: "Vercel Functions",
    time: new Date().toISOString()
  });
}
