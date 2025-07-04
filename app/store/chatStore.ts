import { create } from "zustand";
import { persist } from "zustand/middleware";


type Message = {
  sender: "user" | "assistant";
  text: string;
};

type ChatStore = {
  chatMessages: Message[];
  setChatMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chatMessages: [],
      setChatMessages: (messages) => set({ chatMessages: messages }),
      addMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearMessages: () => set({ chatMessages: [] }),
    }),
    { name: "zuno-chat-messages" }
  )
);