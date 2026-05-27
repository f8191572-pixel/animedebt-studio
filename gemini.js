const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function runGeminiPrompt({ apiKey, prompt, model = "gemini-3.1-flash-lite" }) {
  const cleanKey = String(apiKey || "").trim();
  const cleanPrompt = String(prompt || "").trim();
  const cleanModel = String(model || "gemini-3.1-flash-lite").trim();

  if (!cleanKey) throw new Error("Missing Gemini API key. Paste your key or use Free Prompt Mode.");
  if (!cleanPrompt) throw new Error("Missing prompt.");

  const response = await fetch(`${API_BASE}/${encodeURIComponent(cleanModel)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": cleanKey
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: cleanPrompt }] }],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with status ${response.status}. Check the key, model, quota, and network connection.`;
    throw new Error(message);
  }

  const text = extractText(data);
  if (!text) throw new Error("Gemini returned no text. Try a different model or shorter prompt.");

  return { text, raw: data, model: cleanModel };
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text || "").filter(Boolean).join("\n").trim();
}
