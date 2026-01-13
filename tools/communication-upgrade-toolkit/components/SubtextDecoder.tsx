
import React, { useState } from 'react';
import { Search, Info, MessageSquare, AlertCircle, CheckCircle2, Copy, Sparkles, Send, User, BrainCircuit, Eye, EyeOff, Tag, LayoutGrid, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PageHeader from './PageHeader';
import { DECODER_DATA, AI_TRANSLATOR_PROMPT, PERSONA_LIBRARY } from '../data/decoderData';
import { ToolType } from '../types';

interface SubtextDecoderProps {
    model?: string;
    apiKey?: string;
    onNavigate?: (tool: any) => void;
}

const SubtextDecoder: React.FC<SubtextDecoderProps> = ({ model = 'gemini-3-flash-preview', apiKey, onNavigate }) => {
    const parseConsultant = (text: string) => {
        const match = text.match(/^(.*)\s*[\(（]([^）\)]+)[\)）]$/);
        if (match) {
            return { script: match[1].trim(), tag: match[2].trim() };
        }
        return { script: text, tag: null };
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [customQuestion, setCustomQuestion] = useState('');
    const [clientRole, setClientRole] = useState('行銷經理');

    // Tag States
    const [decisionStyle, setDecisionStyle] = useState<string | null>(null);
    const [commStyle, setCommStyle] = useState<string | null>(null);
    const [mood, setMood] = useState<string | null>(null);

    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

    const [activeFilter, setActiveFilter] = useState('全部');

    const filteredData = DECODER_DATA.filter(item => {
        const matchesSearch = item.surface.includes(searchTerm) ||
            item.subtext.includes(searchTerm) ||
            item.category.includes(searchTerm);

        if (activeFilter === '全部') return matchesSearch;

        const filterMap: Record<string, string[]> = {
            '🔥 急件/焦慮': ['焦慮緩解'],
            '💰 講價/預算': ['價值錨定'],
            '⚔️ 政治/甩鍋': ['戰略拉回', '專業奪回'],
            '🎨 執行/細節': ['專業奪回', '價值創造']
        };

        const categories = filterMap[activeFilter] || [];
        return matchesSearch && categories.includes(item.category);
    });

    const toggleReveal = (id: string) => {
        const newSet = new Set(revealedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setRevealedIds(newSet);
    };

    const getSelectedMetadata = () => {
        const tags: string[] = [];
        const instructions: string[] = [];

        const dStyle = PERSONA_LIBRARY.decisionStyles.find(s => s.id === decisionStyle);
        const cStyle = PERSONA_LIBRARY.commStyles.find(s => s.id === commStyle);
        const mStyle = PERSONA_LIBRARY.moods.find(s => s.id === mood);

        if (dStyle) { tags.push(dStyle.label); instructions.push(`對於${dStyle.label.split(' ')[1]}的人：${dStyle.strategy}`); }
        if (cStyle) { tags.push(cStyle.label); instructions.push(`對於溝通風格為${cStyle.label.split(' ')[1]}的人：${cStyle.strategy}`); }
        if (mStyle) { tags.push(mStyle.label); instructions.push(`客戶當下狀態為${mStyle.label.split(' ')[1]}：${mStyle.strategy}`); }

        return {
            tags: tags.join(' + ') || '未設定標籤',
            instructions: instructions.length > 0 ? instructions.join('\n') : '請根據一般資深顧問邏輯回答。'
        };
    };

    const constructPrompt = (question: string) => {
        const { tags, instructions } = getSelectedMetadata();
        return AI_TRANSLATOR_PROMPT
            .replace('{{CLIENT_ROLE}}', clientRole || '客戶')
            .replace('{{SELECTED_TAGS}}', tags)
            .replace('{{STYLE_INSTRUCTIONS}}', instructions)
            .replace('{{CLIENT_QUESTION}}', question);
    };


    const handleAiTranslate = async () => {
        if (!customQuestion.trim()) return;
        if (!apiKey) {
            if (onNavigate) {
                onNavigate(ToolType.SETTINGS);
            } else {
                alert('請先在設定中輸入 API Key');
            }
            return;
        }

        setIsLoading(true);
        setAiResult(null);
        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = constructPrompt(customQuestion);

            const response = await ai.models.generateContent({
                model: model,
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });

            const text = response.text;
            setAiResult(text || '翻譯失敗，請檢查 API 設定');
        } catch (error: any) {
            console.error(error);
            setAiResult(`連線出錯: ${error.message || '請稍後再試'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const sysKey = (process.env as any).API_KEY;
    const effectiveKey = apiKey || (sysKey !== 'undefined' ? sysKey : '');
    const verifiedKey = localStorage.getItem('gemini_api_verified_key');
    const isOperational = !!(effectiveKey && effectiveKey === verifiedKey);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <PageHeader
                title="客戶潛臺詞翻譯機"
                tag="The Subtext Analyzer"
                insight="Operationalized Psychology for Consultants"
                description="客戶說出來的話往往只是冰山一角。透過標籤精準定位客戶人設，獲得客製化的戰略回擊建議。"
                engine={model}
                isOperational={isOperational}
                onStatusClick={onNavigate ? () => onNavigate(ToolType.SETTINGS) : undefined}
            />

            {/* Grid of Interactive Cards (The Gallery) */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">常見場景解碼庫</h3>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="搜尋問題或潛臺詞..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2">
                    {['全部', '🔥 急件/焦慮', '💰 講價/預算', '⚔️ 政治/甩鍋', '🎨 執行/細節'].map(chip => (
                        <button
                            key={chip}
                            onClick={() => setActiveFilter(chip)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${activeFilter === chip ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                        >
                            {chip}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item) => {
                        const isRevealed = revealedIds.has(item.id);
                        const categoryColors: Record<string, string> = {
                            '焦慮緩解': 'bg-orange-50 text-orange-600 border-orange-100',
                            '戰略拉回': 'bg-indigo-50 text-indigo-600 border-indigo-100',
                            '專業奪回': 'bg-purple-50 text-purple-600 border-purple-100',
                            '價值創造': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                            '價值錨定': 'bg-blue-50 text-blue-600 border-blue-100'
                        };
                        const catStyle = categoryColors[item.category] || 'bg-slate-50 text-slate-500 border-slate-100';

                        return (
                            <div key={item.id} className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1">
                                <div className="p-7 flex-1 flex flex-col space-y-5">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${catStyle}`}>
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">客戶說了什麼：</p>
                                        <h4 className="text-base font-black text-slate-900 leading-snug line-clamp-3">
                                            {item.surface}
                                        </h4>
                                    </div>

                                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Search className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">潛臺詞解碼</p>
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                            {item.subtext}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        {isRevealed ? (
                                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                                <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl relative">
                                                    <div className="absolute -left-1.5 top-5 w-1 h-8 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3 h-3" /> 顧問級建議話術
                                                    </p>
                                                    {(() => {
                                                        const { script, tag } = parseConsultant(item.consultant);
                                                        return (
                                                            <>
                                                                <p className="text-[11px] font-black text-slate-800 leading-relaxed">
                                                                    {script}
                                                                </p>
                                                                {tag && (
                                                                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider">
                                                                        <Zap className="w-2.5 h-2.5" /> {tag}
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                                <button
                                                    onClick={() => toggleReveal(item.id)}
                                                    className="w-full py-2.5 bg-slate-900 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-slate-800"
                                                >
                                                    隱藏話術回覆
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => toggleReveal(item.id)}
                                                className="w-full py-4 bg-white border-2 border-slate-900 rounded-2xl text-[11px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all transform active:scale-[0.97] shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <Zap className="w-3.5 h-3.5" /> 取得顧問應對話術
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Custom Decoder Section */}
            <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden mt-12 relative">
                <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight">AI 即時翻譯機</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Persona-Driven Strategic Translation</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Connect Status</p>
                            <p className={`text-xs font-bold ${isOperational ? 'text-slate-300' : 'text-rose-400'}`}>
                                {isOperational ? 'Ready to Decode' : 'Awaiting API Key'}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-slate-800" />
                        <div className={`w-3 h-3 rounded-full animate-pulse pointer-events-none ${isOperational ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
                    </div>
                </div>

                <div className="p-8 grid lg:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="space-y-8">
                        {/* Step 1: Role */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-indigo-500" /> 客戶決策角色
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['行銷經理', '老闆/創辦人', '營運主管', '採購', '技術窗口'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setClientRole(role)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${clientRole === role ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Tags */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-indigo-500" /> 性格標籤選擇 (三大維度)
                                </label>
                            </div>

                            <div className="space-y-4">
                                {/* Decision Styles */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">決策風格 Decision Style</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PERSONA_LIBRARY.decisionStyles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setDecisionStyle(decisionStyle === s.id ? null : s.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${decisionStyle === s.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comm Styles */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">溝通偏好 Comm Preference</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PERSONA_LIBRARY.commStyles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setCommStyle(commStyle === s.id ? null : s.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${commStyle === s.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Moods */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">當下狀態 Current Mood</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PERSONA_LIBRARY.moods.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setMood(mood === s.id ? null : s.id)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${mood === s.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Question */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">貼上客戶的問題</label>
                            </div>
                            <textarea
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 transition-all"
                                placeholder="例如：這個素材的字體能不能大一點？"
                                value={customQuestion}
                                onChange={(e) => setCustomQuestion(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleAiTranslate}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${apiKey ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-none'}`}
                            >
                                {isLoading ? <BrainCircuit className="w-5 h-5 animate-spin" /> : apiKey ? <Send className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {isLoading ? '正在解碼專家回覆...' : apiKey ? '啟動 AI 即時翻譯' : '尚未設定 API Key (點擊前往設定)'}
                            </button>
                        </div>
                    </div>

                    {/* Result Output */}
                    <div className="relative min-h-[500px] flex flex-col">
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl shadow-indigo-100/50 animate-in fade-in zoom-in-95 duration-500">
                                <div className="relative flex items-center justify-center mb-8">
                                    <div className="absolute inset-0 bg-indigo-400 rounded-[2.5rem] opacity-20 animate-ping duration-[2000ms]" />
                                    <div className="w-24 h-24 bg-white border-2 border-indigo-100 rounded-[2.5rem] flex items-center justify-center relative shadow-xl z-10 overflow-hidden">
                                        <BrainCircuit className="w-10 h-10 text-indigo-600 animate-pulse duration-[3000ms]" />
                                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                                {/* --- 修改區塊結束 --- */}
                                <h4 className="text-xl font-black text-slate-900 mb-2">專家大腦運算中</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                    正在同步心理模型與應對策略...
                                </p>
                                <div className="mt-8 space-y-2 w-full max-w-[200px]">
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Strategic Analysis in Progress</p>
                                </div>
                            </div>
                        ) : aiResult ? (
                            <div className="flex-1 flex flex-col bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden shadow-inner animate-in fade-in zoom-in-95 duration-500">
                                <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5" /> Strategic Report
                                    </span>
                                    <button onClick={() => setAiResult(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase">Clear</button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                                    {(() => {
                                        const sections: {
                                            subtext: string[];
                                            executor: string[];
                                            consultant: string[];
                                            tips: { title: string; content: string }[];
                                        } = {
                                            subtext: [],
                                            executor: [],
                                            consultant: [],
                                            tips: []
                                        };

                                        let currentSection: 'subtext' | 'executor' | 'consultant' | 'tips' | null = null;

                                        aiResult.split('\n').forEach(line => {
                                            const cleanLine = line.replace(/(\*\*|__)/g, '').replace(/^(#+)\s+/gm, '').trim();
                                            if (!cleanLine) return;

                                            // Filter out meta-instructions and generic connectors
                                            if (cleanLine.includes('請直接複製以下話術')) return;
                                            if (cleanLine.includes('這段話術運用了')) return;
                                            if (cleanLine.includes('以下三種技巧')) return;

                                            if (cleanLine.match(/^1\.?|潛臺詞/)) currentSection = 'subtext';
                                            else if (cleanLine.match(/^2\.?|執行者/)) currentSection = 'executor';
                                            else if (cleanLine.match(/^3\.?|顧問/)) currentSection = 'consultant';
                                            else if (cleanLine.match(/^【技巧解析】|心理技巧|專家技巧|戰略解析/)) {
                                                currentSection = 'tips';
                                            }
                                            else if (currentSection === 'consultant') {
                                                // Intelligent analysis detector: move non-dialogue analysis to tips
                                                const analysisKeywords = [
                                                    '這段', '這句話', '運用了', '心理', '戰略', '背後', '轉移', '轉變', '核心需求', '專業界定', '確定性回饋'
                                                ];

                                                // Pattern 1: Contains specific analysis keywords
                                                const hasKeyword = analysisKeywords.some(k => cleanLine.includes(k));

                                                // Pattern 2: Looks like "Title: Content" (e.g., "結論先行：...")
                                                const hasTitleColon = /^[^\uff1a:]+[\uff1a:]/.test(cleanLine);

                                                // Safety Check: specific starts that indicate script not analysis
                                                const isSafeScript = /^(我|我們|第一|第二|第三|1\.|2\.|3\.|針對|關於|為了)/.test(cleanLine);

                                                if (!isSafeScript && ((hasKeyword && cleanLine.length > 15) || (hasTitleColon && cleanLine.split(/[:：]/)[0].length < 12))) {
                                                    // If it looks like a titled analysis, try to extract the title
                                                    if (hasTitleColon) {
                                                        const separator = cleanLine.includes('：') ? '：' : ':';
                                                        const [title, ...contentParts] = cleanLine.split(separator);
                                                        sections.tips.push({
                                                            title: title.trim(),
                                                            content: contentParts.join(separator).trim()
                                                        });
                                                    } else {
                                                        sections.tips.push({ title: '戰略解析', content: cleanLine });
                                                    }
                                                } else {
                                                    sections.consultant.push(cleanLine);
                                                }
                                            }
                                            else if (currentSection === 'tips') {
                                                if (cleanLine.includes('：') || cleanLine.includes(':')) {
                                                    const separator = cleanLine.includes('：') ? '：' : ':';
                                                    const [title, ...contentParts] = cleanLine.split(separator);
                                                    sections.tips.push({
                                                        title: title.trim(),
                                                        content: contentParts.join(separator).trim()
                                                    });
                                                } else if (sections.tips.length > 0) {
                                                    sections.tips[sections.tips.length - 1].content += '\n' + cleanLine;
                                                } else {
                                                    sections.tips.push({ title: '戰略點撥', content: cleanLine });
                                                }
                                            }
                                            else if (currentSection) {
                                                sections[currentSection].push(cleanLine);
                                            }
                                        });

                                        const copyText = (text: string) => {
                                            navigator.clipboard.writeText(text);
                                            alert('已複製到剪貼簿！');
                                        };

                                        return (
                                            <>
                                                {/* Section 1 & 2 (Internal Only) */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-1.5 h-4 bg-amber-400 rounded-full" />
                                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">1. 潛臺詞解碼 (內部紀錄)</h4>
                                                        </div>
                                                        <div className="pl-4 text-sm text-slate-600 leading-relaxed space-y-2">
                                                            {sections.subtext.map((l, i) => <p key={i}>{l}</p>)}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-1.5 h-4 bg-red-400 rounded-full" />
                                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">2. 執行者思維 (應避開)</h4>
                                                        </div>
                                                        <div className="pl-4 text-sm text-slate-400 italic leading-relaxed space-y-2">
                                                            {sections.executor.map((l, i) => <p key={i}>{l}</p>)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Section 3 (The Script - Safe to Copy) */}
                                                <div className="pt-8 border-t border-slate-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">3. 顧問級回擊 (對外話術)</h4>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const textToCopy = sections.consultant.map(line => parseConsultant(line).script).join('\n');
                                                                copyText(textToCopy);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                                        >
                                                            <Copy className="w-3 h-3" /> 複製話術 Only
                                                        </button>
                                                    </div>

                                                    <div className="mb-2 pl-1">
                                                        <p className="text-[11px] font-bold text-slate-400">請直接複製以下話術（建議用通訊軟體傳送，保持極簡）：</p>
                                                    </div>

                                                    <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm relative group mb-8">
                                                        <div className="absolute -left-2 top-6 w-1 h-8 bg-emerald-500 rounded-full" />
                                                        <div className="prose prose-sm max-w-none text-slate-800 font-bold leading-relaxed space-y-3">
                                                            {sections.consultant.map((line, i) => {
                                                                const { script, tag } = parseConsultant(line);
                                                                return (
                                                                    <div key={i} className="space-y-2">
                                                                        <p>{script}</p>
                                                                        {tag && (
                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-wider">
                                                                                <Zap className="w-2.5 h-2.5" /> {tag}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Section 4: Highlights (Consolidated Box) */}
                                                    {sections.tips.length > 0 && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                            <div className="flex items-center gap-2">
                                                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">技巧解析與戰略亮點</h4>
                                                            </div>
                                                            <div className="grid gap-4">
                                                                {sections.tips.map((tip, i) => (
                                                                    <div key={i} className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                                                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                                                        <div className="space-y-2">
                                                                            {tip.title && (
                                                                                <p className="text-sm font-black text-indigo-900 leading-tight">
                                                                                    {tip.title}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-xs font-medium text-slate-600 leading-relaxed text-justify">
                                                                                {tip.content}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col items-center gap-4">
                                                    <button
                                                        onClick={() => copyText(aiResult)}
                                                        className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 uppercase tracking-widest"
                                                    >
                                                        <Copy className="w-3 h-3" /> 複製完整分析報告 (僅限內部記錄用)
                                                    </button>
                                                    <div className="flex items-center gap-2 text-red-500/50">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <p className="text-[9px] font-bold uppercase tracking-tighter text-center">注意：請勿將 1、2 點的回覆內容傳送給客戶，避免公關風險。</p>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border-2 border-slate-100 border-dashed">
                                <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
                                    <BrainCircuit className="w-10 h-10 text-slate-200" />
                                </div>
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">等候解碼指令</h4>
                                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">請完成左側標籤選擇與問題輸入，系統將為您生成專屬的戰略應對建議。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubtextDecoder;
