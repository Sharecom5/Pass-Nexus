"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User as UserIcon, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Update UI with user message
    const newMessage: Message = { role: 'user', parts: [{ text: userMessage }] };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMessage: Message = { role: 'model', parts: [{ text: data.text }] };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting to the network. Please try again later." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[90vw] md:w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight leading-none mb-1">PassNexus AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Intelligent Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 mb-2">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-black text-slate-800 tracking-tight">How can I help you today?</h4>
                  <p className="text-sm text-slate-500 font-medium">Ask me anything about PassNexus features, pricing, or event setup.</p>
                  <div className="grid grid-cols-1 gap-2 w-full pt-4">
                    <button onClick={() => setInput("What are the pricing plans?")} className="text-xs font-bold text-blue-600 bg-white border border-blue-100 p-3 rounded-xl hover:bg-blue-50 transition-all text-left shadow-sm">What are the pricing plans?</button>
                    <button onClick={() => setInput("How do I create an event?")} className="text-xs font-bold text-blue-600 bg-white border border-blue-100 p-3 rounded-xl hover:bg-blue-50 transition-all text-left shadow-sm">How do I create an event?</button>
                    <button onClick={() => setInput("How can I contact support?")} className="text-xs font-bold text-blue-600 bg-white border border-blue-100 p-3 rounded-xl hover:bg-blue-50 transition-all text-left shadow-sm">Contact Support</button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-14 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-700 transition-all relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500 opacity-100 transition-opacity" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7 relative z-10" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-7 h-7 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
