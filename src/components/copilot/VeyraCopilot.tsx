import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { SuggestedPrompt } from './SuggestedPrompt';
import { CopilotMessage } from './CopilotMessage';
import { CopilotInput } from './CopilotInput';
import { eventService } from '../../services/event.service';
import type { 
  CopilotChanges, 
  CopilotMessageItem, 
  EventCreationFormData, 
  ServerGeneratedPlan 
} from '../../types/event';

interface VeyraCopilotProps {
  eventContext: EventCreationFormData;
  currentPlan: ServerGeneratedPlan;
  onApplyPlanChanges: (changes: CopilotChanges) => void;
  onAddMissingItemToTasks?: (itemText: string) => void;
  addedTasksMap?: Record<string, boolean>;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const VeyraCopilot: React.FC<VeyraCopilotProps> = ({
  eventContext,
  currentPlan,
  onApplyPlanChanges,
  onAddMissingItemToTasks,
  addedTasksMap,
  isOpen,
  onToggleOpen,
}) => {
  const [messages, setMessages] = useState<CopilotMessageItem[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'veyra',
      text: `Hello! I'm your Veyra Copilot. Ask me to recalculate budgets, add ceremonies, adjust guest counts, or audit what you might be forgetting.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptText: string) => {
    const userMsgId = `user-${Date.now()}`;
    const userMessage: CopilotMessageItem = {
      id: userMsgId,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLastUserPrompt(promptText);
    setIsLoading(true);

    try {
      const result = await eventService.callCopilot(promptText, currentPlan, eventContext);
      const copilotResponse = result.response;

      const veyraMessage: CopilotMessageItem = {
        id: `veyra-${Date.now()}`,
        sender: 'veyra',
        text: copilotResponse.message,
        timestamp: new Date().toISOString(),
        changes: copilotResponse.changes,
        requiresConfirmation: copilotResponse.requiresConfirmation,
        status: 'pending',
      };

      setMessages((prev) => [...prev, veyraMessage]);
    } catch {
      const errorMessage: CopilotMessageItem = {
        id: `err-${Date.now()}`,
        sender: 'veyra',
        text: "I couldn't update your plan right now.",
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = (messageId: string) => {
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg || !targetMsg.changes) return;

    // Trigger dashboard state update
    onApplyPlanChanges(targetMsg.changes);

    // Update message status to applied
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: 'applied' } : m
      )
    );
  };

  const handleCancelChanges = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: 'cancelled' } : m
      )
    );
  };

  const handleRetryLast = () => {
    if (lastUserPrompt) {
      handleSendMessage(lastUserPrompt);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'veyra',
        text: `Conversation reset. What changes would you like to explore for "${eventContext.eventName}"?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (when Copilot is closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggleOpen}
          aria-label="Open Veyra Copilot Assistant"
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/30 flex items-center gap-2.5 font-semibold text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <Sparkles className="w-4 h-4 animate-spin text-white" />
          <span>Veyra Copilot</span>
        </button>
      )}

      {/* Main Copilot Panel */}
      {isOpen && (
        <aside
          aria-label="Veyra Copilot"
          className="flex flex-col h-[650px] lg:h-[780px] w-full lg:w-[380px] xl:w-[420px] rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden shrink-0 transition-all duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Veyra Copilot
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-full font-mono">
                    AI
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ask me to change your plan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onToggleOpen}
                title="Close Copilot"
                aria-label="Close Copilot Panel"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((item) => (
              <CopilotMessage
                key={item.id}
                item={item}
                currentPlan={currentPlan}
                currency={eventContext.currency}
                onApplyChanges={handleApplyChanges}
                onCancelChanges={handleCancelChanges}
                onRetry={handleRetryLast}
                onKeepCurrent={() => {
                  setMessages((prev) =>
                    prev.filter((m) => m.id !== item.id)
                  );
                }}
                onAddMissingItemToTasks={onAddMissingItemToTasks}
                addedTasksMap={addedTasksMap}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div 
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-rose-300 animate-pulse"
                aria-live="polite"
              >
                <div className="w-4 h-4 rounded-full border-2 border-rose-400 border-t-transparent animate-spin shrink-0" />
                <span>Veyra is rethinking your plan...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area: Suggested Prompts & Input */}
          <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
            {/* Suggestions appear when conversation is short or idle */}
            {messages.length <= 3 && !isLoading && (
              <SuggestedPrompt
                onSelectPrompt={handleSendMessage}
                disabled={isLoading}
              />
            )}

            <CopilotInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </aside>
      )}
    </>
  );
};
