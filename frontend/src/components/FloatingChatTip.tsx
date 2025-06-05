"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubbleLeftRightIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/solid";

function useTypingText(text: string, speed = 24) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

export default function FloatingChatTip() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI career assistant. Ask me anything about CVs, portfolios, or job search!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // --- Use backend as proxy for OpenRouter chat completions ---
  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      // Call backend endpoint (e.g., /api/openrouter-chat) with messages
      const res = await fetch("/api/openrouter-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();
      const aiMsg = data.choices?.[0]?.message?.content || data.message || "Sorry, I couldn't get a response.";
      setMessages((msgs) => [...msgs, { role: 'assistant', content: aiMsg }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { role: 'assistant', content: "Error: Could not connect to backend." }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
            className="mb-3 w-80 max-w-xs bg-gradient-to-br from-white/90 via-indigo-100/90 to-pink-100/90 dark:from-gray-900/90 dark:via-indigo-900/80 dark:to-blue-900/80 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-5 flex flex-col gap-3 animate-fade-in backdrop-blur-xl relative"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-300 text-lg flex items-center gap-2">
                <span className="relative flex items-center justify-center w-8 h-8 mr-1">
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="text-2xl"
                  >
                    <span role="img" aria-label="robot">🤖</span>
                  </motion.span>
                  <SparklesIcon className="absolute -top-1 -right-1 w-4 h-4 text-pink-400 animate-pulse" />
                </span>
                Chat
              </span>
              <button
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col gap-2 h-64 overflow-y-auto bg-white/60 dark:bg-gray-900/60 rounded-lg p-2 mb-2 border border-indigo-100 dark:border-indigo-800">
              {messages.map((msg, i) => (
                <div key={i} className={`text-sm mb-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-3 py-2 rounded-xl ${msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200' : 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200'}`}>{msg.content}</span>
                </div>
              ))}
              {loading && <div className="text-xs text-gray-400">AI is typing...</div>}
            </div>
            <input
              type="text"
              ref={inputRef}
              className="w-full px-3 py-2 rounded-full border border-indigo-200 dark:border-indigo-700 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm mb-2"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              disabled={loading}
            />
            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition text-sm disabled:opacity-60"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white dark:border-gray-900"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        initial={{ scale: 1 }}
        animate={{ scale: open ? 1.15 : 1, rotate: open ? 10 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
      </motion.button>
    </div>
  );
}

// --- Add a new floating ProTip card, separate from chat ---
export function FloatingProTip() {
  // Modern, animated, glassy popover style
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [tipIdx, setTipIdx] = useState(0); // index in tips array
  const [typing, setTyping] = useState("");

  // OpenRouter API config for pro tip (same as chatbot)
  const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const OPENROUTER_API_KEY = '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';
  const OPENROUTER_MODEL = 'qwen/qwen3-30b-a3b:free';

  // Fetch 20-30 pro tips in advance
  const fetchTips = async (count = 25) => {
    setLoading(true);
    const fetched: string[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const res = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a world-class career coach. Give a single, fresh, actionable, modern, and concise career pro tip for job seekers, CV/portfolio builders, or professionals. No preamble, just the tip."
              }
            ],
            max_tokens: 64
          })
        });
        const data = await res.json();
        let aiTip = data.choices?.[0]?.message?.content || data.message || "Stay curious and keep learning!";
        aiTip = aiTip.replace(/undefined/gi, '').replace(/^\W+/, '').replace(/\s+/g, ' ').trim();
        if (aiTip && aiTip.length > 10 && !fetched.includes(aiTip)) {
          fetched.push(aiTip);
        }
      } catch (e) {
        // skip
      }
    }
    setTips(fetched);
    setTipIdx(0);
    setLoading(false);
  };

  // Typing effect for the current tip
  useEffect(() => {
    if (!tips[tipIdx]) return;
    setTyping("");
    let i = 0;
    const tip = tips[tipIdx];
    const interval = setInterval(() => {
      setTyping((prev) => prev + tip[i]);
      i++;
      if (i >= tip.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [tipIdx, tips]);

  useEffect(() => {
    fetchTips(); // Fetch on mount
  }, []);

  const nextTip = () => {
    if (tipIdx < tips.length - 1) setTipIdx(tipIdx + 1);
    else fetchTips(); // If at end, reload tips
  };

  if (!show) return null;
  return (
    <div className="fixed bottom-32 left-4 z-[100] max-w-xs w-96 animate-fade-in flex justify-start">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="bg-gradient-to-br from-white/90 via-indigo-100/90 to-pink-100/90 dark:from-gray-900/95 dark:via-indigo-900/90 dark:to-blue-900/90 rounded-3xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6 flex flex-col gap-3 backdrop-blur-2xl relative overflow-visible"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-indigo-600 dark:text-indigo-300 text-lg flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-pink-400 animate-pulse" />
            Pro Tip
          </span>
          <button
            className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
            onClick={() => setShow(false)}
            aria-label="Close tip"
          >
            <XMarkIcon className="w-5 h-5 text-indigo-400" />
          </button>
        </div>
        <div className="text-base text-gray-800 dark:text-gray-100 min-h-[60px] font-medium break-words font-mono leading-relaxed px-1">
          {loading ? (
            <span className="text-gray-400">Fetching tips...</span>
          ) : (
            <>
              {typing}
              <motion.span
                className="inline-block w-2 h-5 bg-indigo-400 ml-1 align-middle rounded animate-pulse"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            className="text-xs px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold"
            onClick={nextTip}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Next tip'}
          </button>
          <span className="text-xs text-gray-400 ml-auto">Tip #{tipIdx + 1} / {tips.length}</span>
        </div>
      </motion.div>
    </div>
  );
}
