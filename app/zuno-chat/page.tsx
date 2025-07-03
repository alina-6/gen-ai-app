"use client";
import { useState } from "react";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

export default function ZunoChat() {
  const [prompt, setPrompt] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const handleGenerate = async (userPrompt?: string) => {
    const text = userPrompt !== undefined ? userPrompt : prompt;
    if (!text.trim()) return;

    setLoading(true);

    const newMessages: Message[] = [
      ...chatMessages,
      { sender: "user", text: text.trim() },
    ];

    const openAIMessages = [
      {
        role: "system",
        content:
          "You are a friendly assistant. Keep your responses short and mostly ask questions to help clarify and refine the user's ideas. Avoid long explanations unless asked. Once you have a clear goal defined with at least 5 actionable next steps, guide the user to press the generate checkpoints button in order to create actionable next steps.",
      },
      ...newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4",
          messages: openAIMessages,
          maxTokens: 100,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setChatMessages((msgs) => [
          ...msgs,
          { sender: "assistant", text: `Error: ${errorData.error}` },
        ]);
      } else {
        const data = await response.json();
        setChatMessages([
          ...newMessages,
          { sender: "assistant", text: data.text },
        ]);
        setPrompt("");
        if (!hasStarted) setHasStarted(true);
      }
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: "Error generating text" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-24 max-w-3xl flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Your brain dump starts here...
      </h1>
      <p className="text-l my-10">
        Start with a vague idea. Zuno will guide the conversation, extract the
        goal, and shape it into tasks and timelines.
      </p>

      {!hasStarted ? (
        <div className="w-full max-w-3xl">
          <textarea
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="Whats the next thing you've been meaning to tackle?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-900 disabled:opacity-50"
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Ideating..." : "Start Ideation"}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full p-3 mb-4">
          <div>
            {chatMessages.length === 0 && <p>No messages yet.</p>}
            {chatMessages.map((msg, idx) => (
              <div
                className={`my-4 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
                key={idx}
              >
                <div
                  className={`flex flex-col w-full ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold mb-1 ${
                      msg.sender === "user" ? "text-green-800" : "text-gray-700"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "Zuno"}
                  </span>
                  <div className="whitespace-pre-line text-base text-gray-900">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full border-2 flex flex-col rounded-lg">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Chat to Zuno..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && prompt.trim()) {
                      handleGenerate();
                    }
                  }
                }}
                disabled={loading}
                className="flex-1 p-2 outline-none"
                style={{ border: "none", boxShadow: "none" }}
              />
              <button
                className="m-1 text-3xl px-3 py-0.5 rounded-lg bg-green-800 text-white hover:bg-green-900 disabled:opacity-50"
                onClick={() => handleGenerate()}
                disabled={loading || !prompt.trim()}
              >
                {loading ? "..." : "↑"}
              </button>
            </div>
          </div>
          <div>
            <button className="my-5 text-md py-2 px-3 rounded-lg bg-green-800 text-white hover:bg-green-900 ">
              Generate Checkpoints
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
