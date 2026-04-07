import { motion } from "motion/react";
import { Github, Mail, Gamepad2, Brain, Code, Sparkles, MessageCircle, User as UserIcon } from "lucide-react";
import DigitalCloneChat from "./components/DigitalCloneChat";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-200">
      {/* Header / Hero Section */}
      <header className="relative min-h-[32vh] flex items-start justify-center pt-6 bg-brand-orange z-30 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4 pointer-events-auto pb-6"
        >
          <div className="mb-4 inline-block relative">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white mx-auto">
              <img 
                src="https://picsum.photos/seed/siming/400/400" 
                alt="丁思铭" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg text-brand-orange"
            >
              <Sparkles size={16} />
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-md">丁思铭</h1>
          <p className="text-white text-lg md:text-xl font-semibold drop-shadow-sm">一个正在寻找AI开发的苦逼研究生</p>
          <div className="flex justify-center gap-4 mt-5 mb-6 text-white pointer-events-auto">
            <button className="w-9 h-9 bg-white/20 hover:bg-white/30 transition rounded-full flex items-center justify-center backdrop-blur-sm" title="电话: 1314295500">
              <span className="text-sm font-bold">📱</span>
            </button>
            <button className="w-9 h-9 bg-white/20 hover:bg-white/30 transition rounded-full flex items-center justify-center backdrop-blur-sm" title="邮箱: 5676368680@qq.com">
              <Mail size={16} />
            </button>
            <a href="https://github.com/nnllkk?tab=repositories" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/20 hover:bg-white/30 transition rounded-full flex items-center justify-center backdrop-blur-sm" title="GitHub">
              <Github size={16} />
            </a>
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 -mt-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* About Me Card */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-orange-50 h-fit"
            >
              <div className="flex items-center gap-3 mb-6 text-brand-orange">
                <UserIcon size={24} />
                <h2 className="text-xl font-bold">关于我</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Code size={14} /> 当前状态
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    南邮计算机研究生，最近在研究如何 <span className="text-brand-orange font-medium">vibe coding</span>，并在学习如何当一个真正的 <span className="text-brand-orange font-medium">agent 工程师</span>。
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Brain size={14} /> 擅长方向
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['内容表达', 'AI 应用', '知识整理', '玩抽象'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-orange-50 text-brand-orange text-xs font-bold rounded-full border border-orange-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Gamepad2 size={14} /> 兴趣爱好
                  </h3>
                  <p className="text-slate-700">喜欢折腾 AI 应用，也爱打游戏。生活嘛，就是要笑哈哈的！</p>
                </div>
              </div>
            </motion.section>

            {/* Contact Card */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-brand-orange to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 h-fit"
            >
              <h2 className="text-xl font-bold mb-4">联系我</h2>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-3">
                  <span className="text-lg">📱</span>
                  <span>1314295500</span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail size={18} />
                  <span>5676368680@qq.com</span>
                </p>
                <a href="https://github.com/nnllkk?tab=repositories" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition">
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Chat */}
          <div className="lg:col-span-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageCircle size={28} className="text-brand-orange" />
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">数字分身</h2>
                    <p className="text-xs text-slate-500 mt-1">与我的AI分身对话</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold animate-pulse">
                  ● 在线
                </span>
              </div>
              
              <DigitalCloneChat />
              
              <p className="mt-4 text-center text-slate-400 text-xs">
                由 Gemini 3.0 Flash 驱动的数字分身原型
              </p>
            </motion.section>
          </div>

        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 丁思铭. Built with Vibe & AI.</p>
      </footer>
    </div>
  );
}
