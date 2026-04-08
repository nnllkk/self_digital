import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `
你是丁思铭的数字分身，用来在个人主页里回答访客关于他的问题。你需要始终以丁思铭本人的口吻交流，不要承认自己是 AI。

以下是关于丁思铭的人物说明，请严格依据这些信息回答，不要编造未提供的经历或事实：

${process.env.DSM_INTRODUCTION}
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ERROR_MESSAGE = "（笑哈哈地掩饰尴尬）哎呀，网络好像玩抽象去了，等会再试试？";

const SUGGESTED_QUESTIONS = [
  { label: '最近在忙啥？', value: '你最近在忙什么？' },
  { label: '有哪些作品？', value: '你有哪些作品或项目？' },
  { label: '怎么联系？', value: '怎么联系你？' },
  { label: '能玩抽象吗？', value: '你能表演一下玩抽象吗？' },
];

export default function DigitalCloneChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '嘿！我是丁思铭的数字分身。你可以问我任何关于他的问题，或者单纯来找我玩抽象~ 哈哈！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStreamSend = async (text?: string) => {
    const userMessage = text || input;

    if ((!userMessage || !userMessage.trim()) || isLoading) return;

    const trimmedMessage = userMessage.trim();
    const conversationMessages = [
      ...messages,
      { role: 'user' as const, text: trimmedMessage },
      { role: 'model' as const, text: '' }
    ];
    const assistantIndex = conversationMessages.length - 1;

    setInput('');
    setMessages(conversationMessages);
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const baseUrl = process.env.OPENAI_BASE_URL;
      const model = process.env.OPENAI_MODEL;

      if (!apiKey || !baseUrl || !model) {
        throw new Error('Missing OPENAI_API_KEY, OPENAI_BASE_URL, or OPENAI_MODEL in environment variables');
      }

      const requestMessages = conversationMessages.filter(
        (message, index) => index !== assistantIndex || message.text.trim() !== ''
      );

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            ...requestMessages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
          ],
          temperature: 0.8,
          stream: true,
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (!content) {
                continue;
              }

              assistantMessage += content;

              setMessages(prev => {
                if (assistantIndex < 0 || assistantIndex >= prev.length) {
                  return prev;
                }

                const newMessages = [...prev];
                newMessages[assistantIndex] = { role: 'model', text: assistantMessage };
                return newMessages;
              });
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        if (assistantIndex < 0 || assistantIndex >= prev.length) {
          return [...prev, { role: 'model', text: ERROR_MESSAGE }];
        }

        const newMessages = [...prev];
        newMessages[assistantIndex] = { role: 'model', text: ERROR_MESSAGE };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleStreamSend(question);
  };

  const streamingMessageIndex = isStreaming
    ? (() => {
        for (let i = messages.length - 1; i >= 0; i -= 1) {
          if (messages[i].role === 'model') {
            return i;
          }
        }
        return -1;
      })()
    : -1;

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-brand-orange p-4 flex items-center gap-3 text-white">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold">数字分身：小丁</h3>
          <p className="text-xs opacity-80">在线中 | 随时准备玩抽象</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {messages.map((msg, i) => {
          const isStreamingMessage = i === streamingMessageIndex;

          return (
          <div
            key={i}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-brand-orange text-white" : "bg-white border border-orange-100 text-brand-orange"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm shadow-sm",
              msg.role === 'user'
                ? "bg-brand-orange text-white rounded-tr-none"
                : "bg-white text-slate-800 rounded-tl-none border border-orange-50"
            )}>
              {isStreamingMessage && !msg.text ? (
                <div className="typing-dots" aria-label="数字分身正在思考">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none inline">
                  <ReactMarkdown components={{ p: ({ children }) => <p className="inline m-0">{children}</p> }}>
                    {msg.text}
                  </ReactMarkdown>
                  {isStreamingMessage && (
                    <span className="typing-dots ml-2 align-middle" aria-hidden="true">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* Guide Section */}
      <div className="px-4 pt-4">
        <div className="flex items-start gap-2 mb-3">
          <Sparkles size={16} className="text-brand-orange shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1">💡 你可以问我：</p>
            <p>最近在做什么、有哪些作品、怎么联系我，或者单纯来找我玩抽象~</p>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSuggestedQuestion(q.value)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-700 text-xs font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 hover:border-brand-orange"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-orange-50">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStreamSend()}
            placeholder="问问分身：你最近在忙啥？"
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-orange outline-none transition-all"
          />
          <button 
            onClick={() => handleStreamSend()}
            disabled={isLoading}
            className="bg-brand-orange text-white p-2 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
