'use client'
import React, { useState } from "react";
import { useChatStore } from "../store/chatStore";

const WorkSpace = ({ disabled = false }: { disabled?: boolean }) => {
  const chatMessages = useChatStore((state) => state.chatMessages);
  const [showConversation, setShowConversation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetConversation = async () => {
    setLoading(true);
    setShowConversation(true);
    setLoading(false);
  };

  return (
    <div>
      <button
        className="my-5 text-md py-2 px-3 rounded-lg bg-green-800 text-white hover:bg-green-900"
        onClick={handleGetConversation}
        disabled={loading || disabled}
      >
        {loading ? "Loading..." : "Show Conversation"}
      </button>
      {showConversation && (
        <ul>
          {chatMessages.length === 0 && <li>No messages yet.</li>}
          {chatMessages.map((cp, idx) => (
            <li key={idx}>
              <strong>{cp.sender}:</strong> {cp.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkSpace;