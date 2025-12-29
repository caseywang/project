
import React from 'react';
import {
    ArrowRight,
    Search,
    AlertTriangle,
    Mail,
    Compass,
    ShieldCheck,
    Cpu,
    Target,
    Users,
    MessagesSquare,
    FileText,
    Sparkles,
    Zap
} from 'lucide-react';
import { ToolType } from '../types';

interface HomeProps {
    onStart: (tool: ToolType) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-24 py-12 px-4 animate-in fade-in duration-1000">
            {/* ① Landing / Tool Home */}
            <header className="text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 mb-4 shadow-sm">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Version 2.5</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
                    From execution support<br />
                    to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">decision authority</span>.
                </h1>

                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    This tool helps consultants and presales teams understand their strategic position before deciding what to say, propose, or challenge.
                </p>

                {/* 3R Mini Snapshot */}
                <div className="pt-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">
                        The 3R Decision Framework
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all group">
                            <div className="flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
                                <Compass className="w-4 h-4" /> Reframe
                            </div>
                            <h5 className="text-sm font-black text-slate-900 mb-1">重構問題</h5>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">Redefine challenges beyond surface requests to uncover the root cause.</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-rose-50 transition-all group">
                            <div className="flex items-center gap-3 text-rose-600 font-black text-xs uppercase tracking-widest mb-3">
                                <Target className="w-4 h-4" /> Reason
                            </div>
                            <h5 className="text-sm font-black text-slate-900 mb-1">邏輯推理</h5>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">Translate complex signals into structured, data-driven decision logic.</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-50 transition-all group">
                            <div className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest mb-3">
                                <ShieldCheck className="w-4 h-4" /> Resolve
                            </div>
                            <h5 className="text-sm font-black text-slate-900 mb-1">價值解答</h5>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">Enable confident, value-driven actions that cement your expert authority.</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ② Core Tool / Scenario Selector */}
            <section className="space-y-12">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[10px] bg-slate-900 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-[0.3em] mb-4">
                        Select Your Combat Module
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Tool 1: Strategy Matrix */}
                    <button
                        onClick={() => onStart(ToolType.STRATEGY_MATRIX)}
                        className="group relative flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 mb-6 shadow-sm group-hover:rotate-6">
                            <Target className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">3R 戰略導航圖</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Strategy Matrix</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                            面對新客或混亂局勢，快速對齊「偵探模式」與「教練模式」核心策略。
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Launch Matrix <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    {/* Tool 2: Email Templates */}
                    <button
                        onClick={() => onStart(ToolType.EMAIL_TEMPLATES)}
                        className="group relative flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 mb-6 shadow-sm group-hover:-rotate-6">
                            <Mail className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">外部溝通模組</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Strategic Narratives</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                            高風險郵件或談判建議，將戰略思維轉化為具備影響力的專業敘事。
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Open Templates <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    {/* Tool 3: Intelligence Card */}
                    <button
                        onClick={() => onStart(ToolType.INTELLIGENCE_CARD)}
                        className="group relative flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 mb-6 shadow-sm group-hover:scale-110">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">內部情報卡 2.0</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Meeting Intelligence</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                            AI 即時解構會議逐字稿，提取隱藏政治角力、風險地雷與行動地圖。
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Start Analysis <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    {/* Tool 4: Subtext Decoder */}
                    <button
                        onClick={() => onStart(ToolType.SUBTEXT_DECODER)}
                        className="group relative flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 mb-6 shadow-sm group-hover:rotate-12">
                            <MessagesSquare className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">潛臺詞翻譯機</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Subtext Decoder</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                            透視客戶表象問題後的真實焦慮與動機，提供顧問等級的即時應對話術。
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Decode Now <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    {/* Tool 5: AI Prompts */}
                    <button
                        onClick={() => onStart(ToolType.AI_PROMPTS)}
                        className="group relative flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-14 h-14 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all duration-500 mb-6 shadow-sm group-hover:-rotate-12">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">AI 策略指令庫</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-3">Prompt Library</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                            不限通路，將原始執行思維升級為戰略決策指令，提升交付價值。
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Get Prompts <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    {/* Placeholder for future expansion */}
                    <div className="hidden lg:flex flex-col p-8 border-2 border-slate-50 border-dashed rounded-[2.5rem] justify-center items-center text-center space-y-4 opacity-50">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">More Modules Coming Soon</p>
                    </div>
                </div>
            </section>

            {/* ③ Philosophy Footer */}
            <footer className="pt-24 border-t border-slate-100 text-center space-y-12 pb-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Decision Philosophy</h5>
                    <p className="text-2xl font-black text-slate-800 leading-relaxed italic px-4">
                        “Communication is not about delivering information —<br />
                        it is about <span className="text-indigo-600">shifting the perceived value</span> of the problem.”
                    </p>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">A decision framework for reframing problems, reasoning clearly, and resolving high-stakes decisions.</p>
                </div>

                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-12 space-y-2">
                    <p className="text-slate-900">Designed & Built by Yiting Wang • 2025</p>
                    <p>Decision Enablement Tools for Consulting & Presales</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
