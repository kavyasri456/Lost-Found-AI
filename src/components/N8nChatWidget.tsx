import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Settings,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import {
  ChatMessage,
  DEFAULT_N8N_WEBHOOK_URL,
  sendChatMessageToN8n
} from '../services/n8nChatService';

export const N8nChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hi! I'm your Campus Lost & Found AI Agent powered by your n8n workflow. How can I help you recover or report belongings today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'n8n',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_N8N_WEBHOOK_URL);
  const [connectionNote, setConnectionNote] = useState<string | null>(null);
  const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 9));

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessageToN8n(text, {
        webhookUrl,
        sessionId,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.isN8nSuccess ? 'n8n' : 'fallback',
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.statusHint) {
        setConnectionNote(response.statusHint);
      } else {
        setConnectionNote(null);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: "I couldn't reach the agent right now. Please verify your n8n workflow is active or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Lost AirPods at the library',
    'Found a water bottle at the gym',
    'How do I claim a lost item?',
    'What are the campus handover desks?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-[90vw] sm:w-[400px] h-[540px] flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>Lost & Found AI</span>
                  <span className="text-[10px] font-medium bg-white/25 px-1.5 py-0.2 rounded-full">
                    n8n Agent
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Campus Recovery Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Webhook Connection Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Drawer / Dropdown */}
          {showSettings && (
            <div className="bg-slate-50 border-b border-slate-200 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Connected n8n Webhook</span>
                <button
                  onClick={() => setWebhookUrl(DEFAULT_N8N_WEBHOOK_URL)}
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Default
                </button>
              </div>

              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                placeholder="https://.../webhook/.../chat"
              />

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Quick URL Switch:</span>
                <button
                  type="button"
                  onClick={() =>
                    setWebhookUrl(
                      webhookUrl.replace('/webhook-test/', '/webhook/').includes('/webhook/')
                        ? webhookUrl.replace('/webhook-test/', '/webhook/')
                        : DEFAULT_N8N_WEBHOOK_URL
                    )
                  }
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    webhookUrl.includes('/webhook/') && !webhookUrl.includes('/webhook-test/')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Production
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWebhookUrl(webhookUrl.replace('/webhook/', '/webhook-test/'))
                  }
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    webhookUrl.includes('/webhook-test/')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Test Mode
                </button>
              </div>
            </div>
          )}

          {/* Connection note alert banner if workflow isn't active yet */}
          {connectionNote && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">n8n Workflow Notice:</span>
                <span>{connectionNote}</span>
              </div>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-1 max-w-[80%]">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-[10px] text-slate-400 px-1 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="text-slate-500 font-medium">
                        · {msg.source === 'n8n' ? 'n8n agent' : 'built-in engine'}
                      </span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pl-9">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.3s]" />
                </div>
                <span>n8n agent is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 bg-slate-100 px-2.5 py-1 rounded-full transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask agent about lost or found items..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group focus:outline-hidden"
        aria-label="Open AI chat assistant"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-blue-600" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight">AI Assistant</span>
          <span className="text-[10px] text-blue-200 leading-tight">n8n Connected</span>
        </div>
      </button>
    </div>
  );
};
