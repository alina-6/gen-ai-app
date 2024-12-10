"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(""); // Clear previous results

    try {
      // Use fetch to call the API route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          maxTokens: 100,
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        setResult(`Error: ${errorData.error}`);
      } else {
        const data = await response.json();
        setResult(data.text); // Set the result from the response
      }
    } catch (error) {
      setResult("Error generating text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 m-5 ">
      <h1 className="text-3xl font-bold mb-10">Text Generator</h1>
      <div className="flex">
        <textarea
          className=" w-5/6 rounded-md border p-3"
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="w-1/6 h-1/6 self-end border bg-slate-900 font-semibold p-2 ml-3 rounded-lg text-white"
          onClick={handleGenerate}
          disabled={loading || !prompt}
        >
          {loading ? "Generating..." : "Generate Text"}
        </button>
      </div>
      <div className="mt-32">
        <h3 className="text-xl font-bold">Generated Text:</h3>
        <p className="mt-2">{result}</p>
      </div>
    </div>
  );
}
