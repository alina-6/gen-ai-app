import React, { useState } from "react";
import { useChatStore } from "../store/chatStore";

const GenerateCheckpoints = ({ disabled = false }: { disabled?: boolean }) => {
  const chatMessages = useChatStore((state) => state.chatMessages);
  const [showCheckpoints, setShowCheckpoints] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetCheckpoints = async () => {
    setLoading(true);
    setShowCheckpoints(true);
    setLoading(false);
  };

  return (
    <div>
      <button
        className="my-5 text-md py-2 px-3 rounded-lg bg-green-800 text-white hover:bg-green-900"
        onClick={handleGetCheckpoints}
        disabled={loading || disabled}
      >
        {loading ? "Loading..." : "Generate Checkpoints"}
      </button>
      {showCheckpoints && (
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

export default GenerateCheckpoints;