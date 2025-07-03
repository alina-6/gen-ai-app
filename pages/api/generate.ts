import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateRequestBody {
  messages: Message[];
  maxTokens?: number;
}

interface OpenAIChoice {
  message: {
    content: string;
  };
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages, maxTokens }: GenerateRequestBody = req.body;

  if (!messages) {
    return res.status(400).json({ error: "Messages are required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or gpt-4 if you prefer
        messages: messages,
        max_tokens: maxTokens || 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Error: ", errorData);
      return res
        .status(response.status)
        .json({ error: errorData.error.message });
    }

    const data: OpenAIResponse = await response.json();
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("Error generating text: ", error);
    return res.status(500).json({ error: "Failed to generate text" });
  }
}
