export default async function getGeminiQuote() {
  const prompt = "Give me a short inspirational quote with author";

  try {
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD8Gm_3Y6vReOBtdce9Bzp6MxgGnSg18B0",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error("Failed to fetch from Gemini API");
    }

    const result = await geminiResponse.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to split quote and author
    let quote = rawText.trim();
    let author = "";

    if (quote.includes("—")) {
      const parts = quote.split("—").map((s) => s.trim());
      quote = parts[0];
      author = parts[1] || author;
    }

    return { quote, author };
  } catch (error) {
    console.error("Quote fetch failed:", error);
    throw error;
  }
}