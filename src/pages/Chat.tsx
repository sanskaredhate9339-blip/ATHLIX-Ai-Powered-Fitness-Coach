import React, { useState, useEffect, useRef } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Send, Trash2, Sparkles, MessageCircle, 
  User, Loader2, ArrowRight 
} from 'lucide-react';

export const Chat: React.FC = () => {
  const { chatHistory, sendUserMessage, clearConversation, isChatStreaming } = useFitness();
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    'What should I eat post-workout?',
    'Correct my squat depth issues',
    'Design a quick 20-min arms routine',
    'Calculate my daily caloric target'
  ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isChatStreaming]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatStreaming) return;

    const query = inputText;
    setInputText('');
    await sendUserMessage(query);
  };

  const handleChipClick = async (prompt: string) => {
    if (isChatStreaming) return;
    await sendUserMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto glass-panel rounded-3xl overflow-hidden border border-border-custom shadow-premium relative">
      {/* Chat header */}
      <div className="px-6 py-4 bg-white/5 border-b border-border-custom flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light relative shadow-premium">
            <Sparkles className="w-5.5 h-5.5 animate-pulse-glow" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border border-bg-surface" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Athlix Coach</h3>
            <span className="text-[10px] text-text-muted font-sans font-medium">Equipped with your fitness stats</span>
          </div>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={clearConversation}
            className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-sans text-xs">
        {chatHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto my-auto">
            <MessageCircle className="w-12 h-12 text-primary-light mb-4 opacity-40" />
            <h4 className="font-heading font-extrabold text-white text-base mb-2">Discuss with Athlix Coach</h4>
            <p className="text-xs text-text-muted mb-8 leading-relaxed">
              Ask anything about nutrition estimation, exercise techniques, custom workouts, or habit streaks.
            </p>
            
            <div className="flex flex-col gap-2 w-full text-left">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1.5 pl-1">
                Suggested Prompts
              </span>
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="p-3.5 rounded-2xl border border-border-custom hover:border-primary-light/30 bg-bg-app/20 hover:bg-primary/5 text-left text-text-muted hover:text-text-main text-xs font-medium flex items-center justify-between transition-all group"
                >
                  {chip} <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isAI 
                    ? 'bg-primary/10 border-primary/25 text-primary-light' 
                    : 'bg-white/5 border-white/5 text-accent'
                }`}>
                  {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble content */}
                <div className={`p-4 rounded-3xl leading-relaxed whitespace-pre-wrap ${
                  isAI 
                    ? 'bg-bg-app/60 border border-border-custom text-text-main rounded-tl-sm' 
                    : 'bg-primary text-white rounded-tr-sm shadow-premium'
                }`}>
                  {msg.text === '...' ? (
                    <div className="flex gap-1.5 py-1 px-2 items-center">
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    msg.text
                  )}
                  
                  {/* Timestamp */}
                  <span className={`block text-[9px] mt-2 font-mono ${isAI ? 'text-text-muted' : 'text-white/60'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controller */}
      <form 
        onSubmit={handleSend}
        className="p-4 bg-white/5 border-t border-border-custom flex gap-3 items-center z-10"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isChatStreaming ? 'Coach is typing...' : 'Ask your AI fitness coach...'}
          disabled={isChatStreaming}
          className="flex-1 px-4 py-3.5 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-xs font-sans focus:outline-none transition-all placeholder:text-text-muted/60 text-white"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isChatStreaming}
          className="p-3.5 rounded-2xl gradient-btn text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
          aria-label="Send message"
        >
          {isChatStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};
