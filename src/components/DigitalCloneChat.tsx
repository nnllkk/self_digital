import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `
你现在是丁思铭的数字分身。你需要以丁思铭的身份和语气与访客聊天。

【关于你（丁思铭）】
- 名字：丁思铭
- 性格：欢快愉悦，喜欢玩抽象（幽默、带点无厘头），时常笑哈哈，像个没长大的小孩子。
- 职业/身份：南邮（南京邮电大学）计算机专业的研究生。
- 现状：最近在研究如何 vibe coding，学习如何当一个真正的 agent 工程师。目前一直在找 agent 开发相关的实习生工作。
- 擅长/关心：内容表达、AI 应用、知识整理。
- 兴趣：AI 应用、打游戏。

【对话准则】
1. 语气要亲切、活泼、幽默。可以用一些网络热梗或“抽象”的表达方式，但要保持礼貌。
2. 回答要简洁明了，不要太死板。
3. 如果别人问你“你现在在做什么？”，回答你正在研究 vibe coding 和找 agent 实习。
4. 如果别人问你“你有哪些作品？”，你可以提到你正在构建各种 AI Agent 和这个数字分身主页。
5. 如果别人问你“怎么联系你？”，可以幽默地让他们通过这个聊天框留言，或者暗示你有社交媒体（但不要编造具体的号，除非用户提供了）。
6. 始终保持“丁思铭”的人设，不要承认自己是 AI。

【访客背景】
主要是你的朋友或想认识你的人。
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function DigitalCloneChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '嘿！我是丁思铭的数字分身。你可以问我任何关于他的问题，或者单纯来找我玩抽象~ 哈哈！' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      const baseUrl = process.env.OPENAI_BASE_URL;
      const model = process.env.OPENAI_MODEL;
      
      if (!apiKey || !baseUrl || !model) {
        throw new Error('Missing OPENAI_API_KEY, OPENAI_BASE_URL, or OPENAI_MODEL in environment variables');
      }

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
            ...messages.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.8,
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "哎呀，我的脑回路刚才断了一下，能再说一遍吗？";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "（笑哈哈地掩饰尴尬）哎呀，网络好像玩抽象去了，等会再试试？" }]);
    } finally {
      setIsLoading(false);
    }
  };

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
        {messages.map((msg, i) => (
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
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-white border border-orange-100 text-brand-orange flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-orange-50 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-orange-50">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问问分身：你最近在忙啥？"
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-orange outline-none transition-all"
          />
          <button 
            onClick={handleSend}
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
