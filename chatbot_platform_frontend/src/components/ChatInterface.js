import React, { useRef, useEffect } from "react";

// PUBLIC_INTERFACE
function ChatInterface({
  chatHistory,
  onSendMessage,
  input,
  setInput,
  isSending,
  appSelected,
}) {
  /**
   * Central chat interface for user/assistant conversations.
   * @param {Array} chatHistory - List of {sender: 'assistant'|'user', message: string, timestamp}
   * @param {function} onSendMessage - Sends user message
   * @param {string} input - Current value of chat input
   * @param {function} setInput - Sets chat input value
   * @param {boolean} isSending - Whether the assistant is generating a response
   * @param {object|null} appSelected - Current selected app, can be null
   */
  const messagesEndRef = useRef(null);

  // Scroll to bottom when chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSendMessage(input);
      }
    }
  };

  return (
    <main className="chat-interface">
      <div className="chat-top-bar">
        <h2>
          {appSelected
            ? `Assistant: ${appSelected.name}`
            : "Conversational Assistant"}
        </h2>
      </div>
      <div className="chat-history">
        {chatHistory.length === 0 && (
          <div className="empty-chat">No conversation yet.</div>
        )}
        {chatHistory.map((entry, idx) => (
          <div
            key={idx}
            className={`chat-msg ${
              entry.sender === "user" ? "user-msg" : "assistant-msg"
            }`}
          >
            <div className="msg-meta">
              <span className="sender">
                {entry.sender === "user" ? "You" : "Assistant"}
              </span>
              <span className="timestamp">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="msg-body">{entry.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) onSendMessage(input);
        }}
      >
        <textarea
          rows={2}
          placeholder={
            appSelected ? `Message ${appSelected.name}…` : "Ask the assistant..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={isSending}
        />
        <button
          className="btn accent"
          type="submit"
          disabled={isSending || !input.trim()}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}

export default ChatInterface;
