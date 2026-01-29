import { useState, useEffect, useRef } from "react";
import { IoSend, IoClose } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { baseURL } from "../common/SummaryApi";

export default function AiBot() {
  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text: "Hello 👋!! How may I help you today on Apna Bazar ☺️?",
        },
      ]);
    }
  }, [open]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/bot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "Something went wrong 😢";

      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Server error ❌" }]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setAi(!ai);
        }}
        className={`fixed bottom-4 left-6 z-[1000] group ${ai ? "" : "animate-bounce"}`}
      >
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
          
          {/* Button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="relative">
              <FaRobot className="text-xl" />
              <HiSparkles className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-pulse" />
            </div>
            <span className="font-semibold text-sm">Ask AI</span>
            {!open && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
            )}
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 left-6 w-[90vw] max-w-[380px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[9999] border border-gray-100 animate-scale-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-4 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-10 w-10 h-10 bg-white/10 rounded-full translate-y-1/2"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2">
                    Apna AI Assistant
                    <BsStars className="text-yellow-300 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-white/80 text-xs">Online • Ready to help</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setOpen(false);
                  setAi(false);
                }}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px] md:max-h-[350px] bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md"
                      : "bg-white text-gray-700 border border-gray-100 rounded-bl-md"
                    }`}
                >
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-2 mb-1 text-purple-600">
                      <FaRobot size={12} />
                      <span className="text-xs font-medium">AI Assistant</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-2">
                    <FaRobot size={12} className="text-purple-600" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["Product prices", "Delivery info", "Contact support"].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white border border-purple-200 text-purple-600 text-xs rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5">
              <input
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder-gray-400"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  input.trim()
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-purple-300 hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IoSend size={18} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Powered by Shivam✨
            </p>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
