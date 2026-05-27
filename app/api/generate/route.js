import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.5-flash";

function jsonResponse(payload, status = 200) {
  return Response.json(payload, { status });
}

async function getAuthenticatedUser(request) {
  const allowAnon = process.env.ALLOW_ANON_GENERATION === "true";
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    if (allowAnon) return { user: null, token: null };
    return { error: "You must be signed in to generate." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Server is missing Supabase environment variables." };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: "Invalid or expired session. Sign in again." };
  }

  return { user: data.user, token };
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text || "").filter(Boolean).join("\n").trim();
}

export async function POST(request) {
  try {
    const auth = await getAuthenticatedUser(request);

    if (auth.error) {
      return jsonResponse({ error: auth.error }, 401);
    }

    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    const model = String(body.model || DEFAULT_MODEL).trim();
    const userApiKey = String(body.userApiKey || "").trim();

    if (!prompt || prompt.length < 10) {
      return jsonResponse({ error: "Prompt is too short." }, 400);
    }

    if (prompt.length > 45000) {
      return jsonResponse({ error: "Prompt is too long. Shorten the project or use a smaller module." }, 400);
    }

    const geminiKey = process.env.GEMINI_API_KEY || userApiKey;

    if (!geminiKey) {
      return jsonResponse({
        error: "No Gemini API key configured. Add GEMINI_API_KEY in Vercel Environment Variables or paste a BYOK key."
      }, 400);
    }

    const response = await fetch(`${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return jsonResponse({
        error: data?.error?.message || `Gemini request failed with status ${response.status}.`
      }, response.status);
    }

    const text = extractGeminiText(data);

    if (!text) {
      return jsonResponse({ error: "Gemini returned no text." }, 502);
    }

    return jsonResponse({
      text,
      model,
      userId: auth.user?.id || null,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({ error: error.message || "Unexpected generation error." }, 500);
  }
}
