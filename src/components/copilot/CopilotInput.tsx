import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface CopilotInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const CopilotInput: React.FC<CopilotInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        placeholder="Ask Veyra to modify your plan..."
        aria-label="Ask Veyra Copilot to modify your plan"
        className="w-full pl-4 pr-11 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 transition-colors shadow-inner"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        aria-label="Send prompt to Veyra Copilot"
        className="absolute right-2 p-2 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-white/5 text-white disabled:text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <SendHorizontal className="w-4 h-4" />
      </button>
    </form>
  );
};
