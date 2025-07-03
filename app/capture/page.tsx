'use client'
import React, { useState, FormEvent } from "react";

type Note = {
  title: string;
  description: string;
  date: string;
};

type Message = {
  sender: "user" | "assistant";
  text: string;
};

const dummyProjects = ["Project Alpha", "Project Beta", "Project Gamma"];

const dummyNotes: Note[] = [
  {
    title: "Website Redesign Brainstorm",
    description:
      "Brainstorming session for website redesign. Discussed user personas, key features, and design aesthetics.",
    date: "2024-01-20",
  },
  {
    title: "Client Meeting",
    description:
      "Client meeting to gather requirements for the new website. Discussed target audience and business goals.",
    date: "2024-01-19",
  },
  {
    title: "Competitor Research",
    description:
      "Initial research on competitor websites and industry trends. Analyzed design patterns and user experience.",
    date: "2024-01-18",
  },
];

export const CaptureIdeasPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newTask, setNewTask] = useState("");
  const [notes, setNotes] = useState<Note[]>(dummyNotes);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "How can I help you capture your ideas today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");




  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: Message = { sender: "user", text: chatInput.trim() };
    setChatMessages((msgs) => [...msgs, userMessage]);
    setChatInput("");

    // Call OpenAI API endpoint
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: chatInput.trim() }),
      });
      const data = await response.json();

      // Assume response JSON shape: { text: string }
      if (data.text) {
        const assistantMessage: Message = {
          sender: "assistant",
          text: data.text,
        };
        setChatMessages((msgs) => [...msgs, assistantMessage]);
      } else {
        setChatMessages((msgs) => [
          ...msgs,
          { sender: "assistant", text: "Sorry, I didn't get a response." },
        ]);
      }
    } catch (error) {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: "Error contacting API." },
      ]);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-10" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Left Panel */}
      <div className="flex-1 max-w-lg">
        <h1 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 16 }}>
          Capture Your Ideas
        </h1>

        <label htmlFor="project-select" style={{ display: "block", fontWeight: "600" }}>
          Project
        </label>
        <select
          id="project-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{
            marginTop: 4,
            marginBottom: 20,
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="" disabled>
            Select a project
          </option>
          {dummyProjects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        <label
          htmlFor="new-task-input"
          style={{ display: "block", fontWeight: "600", marginBottom: 4 }}
        >
          New Task or Idea
        </label>
        <input
          id="new-task-input"
          type="text"
          placeholder="What's on your mind?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 30,
            fontSize: 16,
          }}
        />

        <h2 style={{ fontWeight: "700", fontSize: 18, marginBottom: 12 }}>
          Recent Notes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {notes.map(({ title, description, date }) => (
            <div
              key={title}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: 12,
                backgroundColor: "#f9fafb",
              }}
            >
              <strong style={{ fontWeight: "700", fontSize: 15 }}>{title}</strong>
              <p
                style={{
                  fontSize: 14,
                  marginTop: 4,
                  color: "#4b5563",
                  lineHeight: 1.3,
                }}
              >
                {description}
              </p>
              <small style={{ fontSize: 12, color: "#9ca3af" }}>{date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: AI Assistant Chat */}
      <div
        className="flex flex-col flex-grow max-w-xl border border-gray-200 rounded-lg p-6"
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          height: "600px",
          backgroundColor: "#fff",
          flexBasis: "40%",
        }}
      >
        <h2 style={{ fontWeight: "700", fontSize: 18, marginBottom: 16 }}>
          AI Assistant Chat
        </h2>
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "10px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            marginBottom: 12,
            backgroundColor: "#f9fafb",
          }}
        >
          {chatMessages.map((msg, idx) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  marginBottom: 14,
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    backgroundColor: isUser ? "#2563eb" : "#e5e7eb",
                    color: isUser ? "white" : "black",
                    padding: "10px 14px",
                    borderRadius: 18,
                    borderTopLeftRadius: isUser ? 18 : 2,
                    borderTopRightRadius: isUser ? 2 : 18,
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            placeholder="Type a message or use voice..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{
              flexGrow: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          />
          <button
            type="button"

            style={{
              backgroundColor: "#3b82f6",
              border: "none",
              borderRadius: 8,
              color: "white",
              width: 36,
              height: 36,
              cursor: "pointer",
            }}

            aria-label="Voice input"
          >
            🎤
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "white",
              padding: "0 16px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaptureIdeasPage;
