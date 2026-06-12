/* eslint-disable */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const openRouterKey = defineSecret("OPENROUTER_API_KEY");

exports.generateAIResponse = onCall(
  { secrets: [openRouterKey] },
  async (request) => {
    // Verify user is authenticated
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be signed in.");
    }

    const { messages, temperature, maxTokens } = request.data;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new HttpsError("invalid-argument", "Invalid messages array.");
    }

    // Validate message content lengths to prevent abuse
    for (const msg of messages) {
      if (typeof msg.content !== "string" || msg.content.length > 5000) {
        throw new HttpsError("invalid-argument", "Message content is too long or invalid.");
      }
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openRouterKey.value()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            temperature: temperature || 0.7,
            max_tokens: Math.min(maxTokens || 500, 1000),
            messages,
          }),
        }
      );

      if (!response.ok) {
        throw new HttpsError("internal", "AI service unavailable.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to generate AI response.");
    }
  }
);
