
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
    Users
} from 'lucide-react';
import { ToolType } from '../types';

interface HomeProps {
    onStart: (tool: ToolType) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-20 py-12 px-4 animate-in fade-in duration-700">
            {/* ① Landing / Tool Home */}
            <header className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 mb-4">
                    <SparkleIcon className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Version 2.0 Alpha</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
                    From execution support<br />
                    to <span className="text-indigo-600">decision authority</span>.
                </h1>


                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    This tool helps consultants and presales teams
                    understand their strategic position
                    before deciding what to say, propose, or challenge.

                </p>

                {/* 3R Mini Snapshot */}
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 text-center">
                    Core Decision Framework
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 text-left">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                            <Compass className="w-3.5 h-3.5" /> Reframe
                        </div>
                        <p className="text-sm font-bold text-slate-700">Redefine the problem beyond surface requests</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest">
                            <Target className="w-3.5 h-3.5" /> Reason
                        </div>
                        <p className="text-sm font-bold text-slate-700">Translate signals into structured decision logic</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" /> Resolve
                        </div>
                        <p className="text-sm font-bold text-slate-700">Enable confident, value-driven action</p>
                    </div>
                </div>
            </header>

            {/* ② Core Tool / Scenario Selector */}
            <section className="space-y-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-sm border-b-4 border-indigo-500 pb-1 font-black text-slate-900 uppercase tracking-[0.2em] mb-4">
                        Where is your decision currently stuck?
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <button
                        onClick={() => onStart(ToolType.STRATEGY_MATRIX)}
                        className="group flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-colors mb-6 shadow-sm">
                            <Search className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">New client, unclear decision ownership
                        </h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                            Start by mapping the political landscape and identifying budget owners using the 3R Matrix.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore 3R Matrix <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    <button
                        onClick={() => onStart(ToolType.AI_PROMPTS)}
                        className="group flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-colors mb-6 shadow-sm">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">Project stuck, stakeholder friction</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                            Use AI-powered strategic redirection to break deadlocks and realign expectations.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Launch Prompt Lab <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>

                    <button
                        onClick={() => onStart(ToolType.INTELLIGENCE_CARD)}
                        className="group flex flex-col text-left p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
                    >
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-colors mb-6 shadow-sm">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">High-risk communication or negotiation
                        </h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                            Convert raw transcripts into combat maps and strategic templates for precise communication.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open Intelligence Hub <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </section>

            {/* Option B: Footer Information */}
            <footer className="pt-20 border-t border-slate-100 text-center space-y-8 pb-12">
                <div className="max-w-2xl mx-auto space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decision Philosophy</h5>
                    <p className="text-sm text-slate-500 leading-relaxed italic">
                        “Communication is not about delivering information —<br />
                        it is about shifting the perceived value of the problem.”
                    </p>

                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-4">
                        A decision framework for reframing problems, reasoning clearly,
                        and resolving high-stakes decisions.
                    </p>


                </div>

                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <p>© 2025 Designed & Built by Yiting Wang</p>
                    <p>Decision Enablement Tools for Consulting & Presales</p>

                </div>
            </footer>
        </div>
    );
};

const SparkleIcon = ({ className }: { className: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

export default Home;
