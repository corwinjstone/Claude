import { useState } from "react";
import { Send } from "lucide-react";

const initialMessages = [
  { id: 1, from: "dealer", name: "Sunrise Auto", text: "Hi, just checking on APP-90210 — any updates?", time: "9:22 AM" },
  { id: 2, from: "funder", name: "J. Martinez", text: "Hi! We're reviewing the insurance binder right now. The deductible listed is $750 — can you have the customer update it to $500 or less?", time: "10:05 AM" },
  { id: 3, from: "dealer", name: "Sunrise Auto", text: "Got it, reaching out to the customer now. Should have updated docs within the hour.", time: "10:08 AM" },
];

export default function DealerChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "funder", name: "J. Martinez", text, time: "Now" },
    ]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 400 }}>
      {/* Dealer info bar */}
      <div className="px-4 py-2.5 bg-[#f7f3eb]" style={{ borderBottom: "1px solid #e9e9e9" }}>
        <p className="text-xs font-bold text-[#00132b]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          Sunrise Auto Group
        </p>
        <p className="text-xs text-[#525252]" style={{ fontFamily: '"Optimist", sans-serif' }}>
          Austin, TX · APP-90210
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 max-w-[85%] ${
              msg.from === "funder" ? "self-end items-end" : "self-start items-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm leading-snug ${
                msg.from === "funder"
                  ? "bg-[#00132b] text-white rounded-br-sm"
                  : "bg-[#e9e9e9] text-[#00132b] rounded-bl-sm"
              }`}
              style={{ fontFamily: '"Optimist", sans-serif' }}
            >
              {msg.text}
            </div>
            <span className="text-xs text-[#b5b5b5]" style={{ fontFamily: '"Optimist", sans-serif' }}>
              {msg.name} · {msg.time}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2" style={{ borderTop: "1px solid #e9e9e9" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 text-sm rounded-md border border-[#e9e9e9] bg-[#fcf9f4] text-[#00132b] placeholder-[#b5b5b5] outline-none focus:border-[#00132b] focus:ring-1 focus:ring-[#00132b] transition-colors"
          style={{ fontFamily: '"Optimist", sans-serif' }}
        />
        <button
          onClick={send}
          className="w-9 h-9 flex items-center justify-center rounded-md bg-[#00132b] text-white hover:bg-[#013d5b] transition-colors flex-shrink-0"
          aria-label="Send"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
