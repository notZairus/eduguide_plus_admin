import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPEN_ROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function summarize(text: string) {
  const completion = await openai.chat.completions.create({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [
      {
        role: "user",
        content: `
          Summarize the text into multiple short bullet points.

          Rules:
          - Return at least 5 summary points
          - Each summary must be a separate string
          - Each string should contain only ONE idea
          - Do NOT return a single paragraph

          Text:
          ${text}
        `,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "summaries_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summaries: {
              type: "array",
              minItems: 5, // ✅ FIXED
              items: {
                type: "string",
              },
              description: "List of summary strings",
            },
          },
          required: ["summaries"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = completion.choices[0].message.content as string;
  const json = JSON.parse(result);
  return json.summaries || [];
}
