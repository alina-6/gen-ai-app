import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = 'key here'; // Replace with your actual OpenAI API key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { prompt, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    try {
      // Use fetch to make a request to the OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", 
          messages: [
            { role: "user", content: prompt },  // Use the messages format with role and content
          ],
          max_tokens: maxTokens || 100,
        }),
      });

      // Check if the response is ok (status code 200)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI Error: ", errorData);  // Log the error response
        return res.status(response.status).json({ error: errorData.error.message });
      }

      // Parse the response and send the text to the client
      const data = await response.json();
      return res.status(200).json({ text: data.choices[0].message.content });
    } catch (error) {
      console.error("Error generating text: ", error);
      return res.status(500).json({ error: "Failed to generate text" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
