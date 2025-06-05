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
        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-2xl flex items-center justify-center hover:scale-110 focus:scale-105 transition-transform border-4 border-white dark:border-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        initial={{ scale: 1 }}
        animate={{ scale: open ? 1.15 : 1, rotate: open ? 10 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        tabIndex={0}
      >
        <ChatBubbleLeftRightIcon className="w-9 h-9 text-white drop-shadow-lg" />
        <span className="sr-only">Open chat</span>
      </motion.button>
    </div>
  );
}

// --- Add a new floating ProTip card, separate from chat ---
export function FloatingProTip() {
  // 100 high-quality, modern, actionable pro tips (sampled for brevity)
  const tips = [
    "Tailor your CV for each job application—highlight the most relevant skills and achievements.",
    "Quantify your impact: use numbers to show results (e.g., 'Increased sales by 30%').",
    "Keep your portfolio clean and focused—showcase only your best, most relevant work.",
    "Use action verbs in your CV and portfolio to convey energy and ownership.",
    "Update your LinkedIn and portfolio regularly to reflect new skills and projects.",
    "Practice your elevator pitch—it helps in interviews and networking.",
    "Show, don’t just tell: use real examples and case studies in your portfolio.",
    "Customize your cover letter for each application—address the company’s needs directly.",
    "Highlight soft skills with concrete examples, not just buzzwords.",
    "Keep your CV to one page if you have less than 10 years of experience.",
    "Include a professional photo only if it’s standard in your industry.",
    "Use a modern, readable font and plenty of white space for clarity.",
    "Add a 'Projects' section to your CV to showcase hands-on experience.",
    "Show continuous learning: list recent courses, certifications, or workshops.",
    "Ask for feedback on your CV and portfolio from mentors or peers.",
    "Include links to your GitHub, Behance, or other relevant profiles.",
    "Use keywords from the job description to pass automated resume screeners.",
    "Show your personality in your portfolio—let your unique style shine.",
    "Prepare a concise, compelling summary statement at the top of your CV.",
    "Proofread everything—typos can cost you interviews.",
    "Network actively: reach out to professionals in your field for advice and opportunities.",
    "Document your achievements as you go, not just when job hunting.",
    "Showcase teamwork and leadership with specific stories.",
    "Keep your online presence professional—employers will check.",
    "Use metrics to back up your claims wherever possible.",
    "Highlight adaptability and willingness to learn new tools.",
    "Include a section for volunteer work or extracurriculars if relevant.",
    "Be honest—never exaggerate your skills or experience.",
    "Prepare for interviews by practicing common questions and your own stories.",
    "Show your process: include case studies or project breakdowns in your portfolio.",
    "Keep file names professional when submitting digital CVs or portfolios.",
    "Use a custom domain for your portfolio for a polished impression.",
    "Add testimonials or references if you have them.",
    "Show your work in progress—demonstrate growth and learning.",
    "Be concise: avoid long paragraphs in your CV and portfolio.",
    "Highlight remote work skills if applying for distributed teams.",
    "Include a call to action in your portfolio (e.g., 'Contact Me').",
    "Show your passion for your field through side projects or blogs.",
    "Keep design consistent across your CV, portfolio, and LinkedIn.",
    "Use bullet points for easy scanning.",
    "Research the company before interviews and tailor your questions.",
    "Show results, not just responsibilities.",
    "Include relevant keywords for applicant tracking systems.",
    "Keep your contact info up to date.",
    "Showcase your adaptability to new technologies.",
    "Highlight cross-functional collaboration.",
    "Include a section for awards or recognitions.",
    "Show your problem-solving skills with real examples.",
    "Keep your portfolio mobile-friendly.",
    "Use color sparingly and purposefully.",
    "Show your process, not just the final product.",
    "Include a downloadable PDF version of your CV.",
    "Show your impact in every role.",
    "Keep your summary statement short and impactful.",
    "Highlight your unique selling proposition.",
    "Show your curiosity and willingness to learn.",
    "Include links to published work or media mentions.",
    "Show your technical and soft skills balance.",
    "Keep your portfolio navigation simple.",
    "Show your work in context—explain the problem and your solution.",
    "Include a section for hobbies if they add value.",
    "Show your leadership in group projects.",
    "Highlight your communication skills.",
    "Show your initiative with self-started projects.",
    "Keep your design accessible for all users.",
    "Show your global or multicultural experience.",
    "Include a section for languages spoken.",
    "Show your time management skills.",
    "Highlight your ability to work under pressure.",
    "Show your attention to detail.",
    "Include a section for professional memberships.",
    "Show your willingness to mentor others.",
    "Highlight your creativity with unique solutions.",
    "Show your ability to learn from failure.",
    "Include a section for patents or publications if relevant.",
    "Show your negotiation or persuasion skills.",
    "Highlight your project management experience.",
    "Show your ability to work independently.",
    "Include a section for speaking engagements.",
    "Show your adaptability to change.",
    "Highlight your customer service experience.",
    "Show your entrepreneurial mindset.",
    "Include a section for open source contributions.",
    "Show your ability to prioritize tasks.",
    "Highlight your research skills.",
    "Show your willingness to relocate if applicable.",
    "Include a section for certifications.",
    "Show your ability to work in fast-paced environments.",
    "Highlight your analytical thinking.",
    "Show your commitment to professional development.",
    "Include a section for conferences attended.",
    "Show your ability to work with diverse teams.",
    "Highlight your strategic thinking.",
    "Show your ability to deliver results on time.",
    "Include a section for community involvement.",
    "Show your ability to manage multiple projects."
  ];
  const [show, setShow] = useState(true);
  const [tipIdx, setTipIdx] = useState(0);

  // Shuffle/random logic
  const shuffleTip = () => {
    let next;
    do {
      next = Math.floor(Math.random() * tips.length);
    } while (next === tipIdx && tips.length > 1);
    setTipIdx(next);
  };

  const nextTip = () => {
    if (tipIdx < tips.length - 1) setTipIdx(tipIdx + 1);
  };
  const prevTip = () => {
    if (tipIdx > 0) setTipIdx(tipIdx - 1);
  };

  if (!show) return null;
  return (
    <div className="fixed bottom-32 left-4 z-[100] max-w-xs w-96 animate-fade-in flex flex-col items-center justify-start">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="bg-gradient-to-br from-white/90 via-indigo-100/90 to-pink-100/90 dark:from-gray-900/95 dark:via-indigo-900/90 dark:to-blue-900/90 rounded-3xl shadow-2xl border border-indigo-200 dark:border-indigo-700 p-6 flex flex-col gap-3 backdrop-blur-2xl relative overflow-visible protip-bubble"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)', minHeight: 140 }}
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
        <div className="text-base text-gray-800 dark:text-gray-100 min-h-[60px] font-medium break-words font-mono leading-relaxed px-1 flex items-center justify-center text-center" style={{minHeight: 60}}>
          {tips[tipIdx]}
        </div>
        <div className="flex justify-between items-center mt-2 gap-2">
          <button
            className="text-xs px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold"
            onClick={prevTip}
            disabled={tipIdx === 0}
          >
            Prev
          </button>
          <button
            className="text-xs px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition font-semibold"
            onClick={nextTip}
            disabled={tipIdx === tips.length - 1}
          >
            Next
          </button>
          <button
            className="text-xs px-2 py-1 rounded bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800 transition font-semibold"
            onClick={shuffleTip}
            aria-label="Random tip"
          >
            Random
          </button>
          <span className="text-xs text-gray-400 ml-auto">Tip #{tipIdx + 1} / {tips.length}</span>
        </div>
        {/* Animated thinking dots connecting to robot head */}
        <div className="protip-thinking-dots flex flex-col items-center absolute left-1/2 -bottom-10 -translate-x-1/2">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
        </div>
      </motion.div>
      {/* Robot head SVG below the tip bubble */}
      <div className="protip-robot-head mt-2">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="28" cy="32" rx="20" ry="18" fill="#f3f4f6" stroke="#6366f1" strokeWidth="2.5" />
          <ellipse cx="19.5" cy="32.5" rx="3.5" ry="4.5" fill="#6366f1" />
          <ellipse cx="36.5" cy="32.5" rx="3.5" ry="4.5" fill="#6366f1" />
          <rect x="18" y="41" width="20" height="5" rx="2.5" fill="#a5b4fc" />
          <rect x="25" y="12" width="6" height="10" rx="3" fill="#6366f1" />
          <circle cx="28" cy="10" r="3" fill="#a5b4fc" stroke="#6366f1" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
