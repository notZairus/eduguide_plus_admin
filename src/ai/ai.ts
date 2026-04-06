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

export async function generateQuestion(text: string) {
  const completion = await openai.chat.completions.create({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [
      {
        role: "user",
        content: `
Generate multiple quiz questions based on the given text.

Rules:
- Generate at least 5 questions
- Each question must follow ONE of these types:
  - "multiple-choice"
  - "identification"
  - "true-or-false"
- Each question must focus on a single clear idea
- Avoid repeating the same concept
- Make questions clear and concise

Field rules:
- question: minimum 8 characters
- answer: must be correct and precise
- for "identification" type, answer must be exactly one word
- explanation: optional, but include when helpful
- choices:
  - REQUIRED for "multiple-choice"
  - Must be an array of exactly 4 strings
  - Include the correct answer in the array
  - Omit for other question types

Text:
${text}
      `,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "questions_response",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              minItems: 5,
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "multiple-choice",
                      "identification",
                      "true-or-false",
                    ],
                  },
                  question: { type: "string", minLength: 8 },
                  answer: { type: "string" },
                  explanation: { type: "string" },
                  choices: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: { type: "string" },
                  },
                },
                required: ["type", "question", "answer"],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    },
  });

  const result = completion.choices[0].message.content as string;
  const json = JSON.parse(result);
  return json.questions || [];
}
