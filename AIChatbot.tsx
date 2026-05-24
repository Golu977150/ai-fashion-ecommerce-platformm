import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { products } from '@/data/products';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const outfitKeywords = ['outfit', 'wear', 'style', 'match', 'combine', 'look', 'dress'];
const productKeywords = ['product', 'item', 'buy', 'price', 'cost', 'shop'];

function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (outfitKeywords.some((k) => lower.includes(k))) {
    const suggestions = [
      "I'd suggest pairing our Premium Wool Overcoat with the Tailored Slim Fit Suit for a sharp formal look. Add the Minimalist Leather Sneakers for a modern twist.",
      "For a casual yet refined outfit, try the Cashmere Turtleneck with Chelsea Leather Boots. The textures complement each other beautifully.",
      "A great evening look would be the Silk Evening Dress with the Gold Chain Necklace. Elegant and timeless.",
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  if (productKeywords.some((k) => lower.includes(k))) {
    const matches = products.filter((p) =>
      lower.includes(p.category.toLowerCase()) ||
      lower.includes(p.subcategory.toLowerCase()) ||
      p.tags.some((t) => lower.includes(t))
    );
    if (matches.length > 0) {
      const p = matches[0];
      return `I found ${p.name} — ${p.description.slice(0, 100)}... It's priced at $${p.price}. Would you like to see more details?`;
    }
    return "I can help you find the perfect item! Try asking about specific categories like 'men's shoes' or 'evening dresses'.";
  }

  if (lower.includes('color') || lower.includes('colour')) {
    return "Our most versatile colors are Black, Navy, and Beige — they pair well with almost anything. For a bold statement, try Red or Green accents.";
  }

  if (lower.includes('size') || lower.includes('fit')) {
    return "All our products include a detailed size guide. Most items run true to size. If you're between sizes, I'd recommend sizing up for outerwear and down for tailored pieces.";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm NOVA's AI stylist. I can help you find outfits, recommend products, or answer any fashion questions. What are you looking for today?";
  }

  const fallback = [
    "That's a great question! I'd recommend browsing our AI Outfit page for personalized styling suggestions.",
    "I can help with that. Would you like me to suggest some products or create an outfit for you?",
    "Our collection has something for every style. Try using the filters on our Shop page to narrow down your search.",
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hi! I'm NOVA's AI stylist. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: generateResponse(userMsg.text),
      };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-[60] w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-[60] w-[360px] max-w-[calc(100vw-3rem)] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-black dark:bg-white text-white dark:text-black flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">NOVA AI Stylist</p>
                <p className="text-[10px] opacity-70">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'bot'
                        ? 'bg-neutral-100 dark:bg-neutral-800'
                        : 'bg-black dark:bg-white'
                    }`}
                  >
                    {msg.role === 'bot' ? (
                      <Bot className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white dark:text-black" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'bot'
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm'
                        : 'bg-black dark:bg-white text-white dark:text-black rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-neutral-600" />
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about outfits, products..."
                  className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
