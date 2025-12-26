
import React, { useState, useEffect } from 'react';
import {
  Copy, Check, FileSearch, Users, ShieldAlert, Zap, Globe, Sparkles,
  MessageSquare, FileText, Lock, Crown, Megaphone, TrendingUp, AlertTriangle, ListTodo, Calendar, Building2, User,
  LayoutDashboard, UserCheck, AlertOctagon, Briefcase, Loader2, Radar, ShieldCheck, Activity, Mail, Hash, Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PageHeader from './PageHeader';
import { GET_INTERNAL_PROMPT, GET_EXTERNAL_PROMPT } from '../data/intelligencePrompts';

interface IntelligenceCardProps {
  model?: string;
  apiKey?: string;
}

// 定義符合新 UI 的結構化資料介面
interface StrategyData {
  projectName: string;
  meetingDate: string;
  political: {
    decisionMaker: { name: string; title: string; caresAbout: string };
    influencer: { name: string; title: string; attitude: string; isAlly: boolean };
    situationType: 'Marketing' | 'Tech' | 'Sales' | 'Unknown';
  };
  risks: {
    landmines: string;
    hiddenCosts: string;
  };
  strategy: {
    role: 'Executioner' | 'Consultant';
    actions: { task: string; owner: string }[];
  };
}

const LOADING_STEPS = [
  { text: "正在解構會議逐字稿內容...", icon: <MessageSquare className="w-4 h-4" /> },
  { text: "正在建立權力關係地圖 (Political Mapping)...", icon: <Users className="w-4 h-4" /> },
  { text: "正在進行風險歸因與地雷掃描 (Risk Scan)...", icon: <ShieldAlert className="w-4 h-4" /> },
  { text: "正在生成 3R 戰略建議與行動清單...", icon: <Zap className="w-4 h-4" /> },
  { text: "正在進行商務語言校準 (Localization)...", icon: <Globe className="w-4 h-4" /> }
];

const IntelligenceCard: React.FC<IntelligenceCardProps> = ({ model = 'gemini-3-flash-preview', apiKey }) => {
  const [transcript, setTranscript] = useState('');
  const [internalTeam, setInternalTeam] = useState('CloudAD 雲數位');
  const [clientName, setClientName] = useState('');

  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [internalTextForCopy, setInternalTextForCopy] = useState('');
  const [externalMinutes, setExternalMinutes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeView, setActiveView] = useState<'internal' | 'external'>('internal');
  const [copiedType, setCopiedType] = useState<'internal' | 'email' | 'markdown' | null>(null);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setLoadingStep(0);
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    setIsLoading(true);
    setStrategyData(null);
    setExternalMinutes('');

    const today = new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');

    try {
      // 優先使用使用者輸入的金鑰，否則使用系統預設
      const effectiveApiKey = apiKey || (process as any).env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

      const internalPrompt = GET_INTERNAL_PROMPT(transcript, internalTeam, clientName, today);
      const externalPrompt = GET_EXTERNAL_PROMPT(transcript, internalTeam, clientName);

      const [resInternal, resExternal] = await Promise.all([
        ai.models.generateContent({
          model: model,
          contents: internalPrompt,
          config: { responseMimeType: "application/json" }
        }),
        ai.models.generateContent({ model: model, contents: externalPrompt })
      ]);

      try {
        const jsonText = resInternal.text || "{}";
        const parsedData: StrategyData = JSON.parse(jsonText);
        setStrategyData(parsedData);

        const situationText = parsedData.political.situationType === 'Marketing' ? '行銷主導' : parsedData.political.situationType === 'Tech' ? '技術主導' : '業務主導';
        const readableText = `🔒 戰略情報紀錄表 (${parsedData.meetingDate})\n專案：${parsedData.projectName}\n局勢：${situationText}\n地雷：${parsedData.risks.landmines}`;
        setInternalTextForCopy(readableText);
      } catch (e) {
        console.error(e);
      }
      setExternalMinutes(resExternal.text || '分析失敗');
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        alert("API 金鑰驗證失敗或無效。請前往「系統設定」輸入或更新您的 API Key。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'internal' | 'email' | 'markdown') => {
    if (!text) return;

    let contentToCopy = text;
    if (type === 'email') {
      contentToCopy = text
        .replace(/(\*\*|__)/g, '')
        .replace(/^(#+)\s+/gm, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*-\s+/gm, '• ');
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="內部情報卡 2.0"
        tag="Strategic Hub"
        insight="Before analysis, clarify your position: Are you reacting, or repositioning?"
        description="AI 即時解構會議逐字稿，將對話轉換為「戰略作戰地圖」。"
        engine={model}
      />

      {/* Input Section */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-6 shadow-inner">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">我方發言角色</label>
                  <input
                    type="text"
                    value={internalTeam}
                    onChange={(e) => setInternalTeam(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">客戶名稱</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">會議逐字稿內容</label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="貼上 Vocol / Otter / Teams 會議紀錄..."
                  className="w-full h-80 bg-white border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !transcript.trim()}
              className={`
                w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl transition-all
                ${isLoading || !transcript.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 active:scale-95'}
              `}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Radar className="w-5 h-5" />}
              {isLoading ? '正在進行戰略運算...' : '產出雙向會議紀錄'}
            </button>
          </div>
        </div>

        {/* Right: Output Section */}
        <div className="lg:col-span-7 flex flex-col min-h-[700px]">

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-2 p-1 bg-slate-100 rounded-2xl w-fit">
            <button
              onClick={() => setActiveView('internal')}
              className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeView === 'internal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Lock className="w-3.5 h-3.5" /> 內部情報卡
            </button>
            <button
              onClick={() => setActiveView('external')}
              className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeView === 'external' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Globe className="w-3.5 h-3.5" /> 外部會議紀錄
            </button>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden relative flex flex-col">

            {/* 動態複製按鈕工具列 */}
            {!isLoading && (
              <div className="absolute top-6 right-6 z-30 flex gap-2">
                {activeView === 'internal' && strategyData && (
                  <button
                    onClick={() => handleCopy(internalTextForCopy, 'internal')}
                    className="px-4 py-2 bg-white/90 backdrop-blur border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm hover:border-indigo-500 transition-all"
                  >
                    {copiedType === 'internal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedType === 'internal' ? '已複製情報' : '複製文字'}
                  </button>
                )}

                {activeView === 'external' && externalMinutes && (
                  <>
                    <button
                      onClick={() => handleCopy(externalMinutes, 'email')}
                      className="px-4 py-2 bg-indigo-600 text-white border border-indigo-700 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      {copiedType === 'email' ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      {copiedType === 'email' ? '已複製 Email 格式' : '複製 Email 內容'}
                    </button>
                    <button
                      onClick={() => handleCopy(externalMinutes, 'markdown')}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 shadow-sm hover:border-slate-400 transition-all"
                    >
                      {copiedType === 'markdown' ? <Check className="w-4 h-4 text-emerald-500" /> : <Hash className="w-4 h-4 text-slate-400" />}
                      {copiedType === 'markdown' ? '已複製 MD 格式' : 'Markdown'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-12">
                  <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 animate-pulse">
                      {LOADING_STEPS[loadingStep].icon}
                    </div>
                  </div>
                  <Activity className="absolute -top-2 -right-2 w-6 h-6 text-indigo-400 animate-bounce" />
                </div>
                <div className="space-y-4 max-w-sm w-full">
                  <h4 className="text-lg font-black text-slate-800 animate-pulse">{LOADING_STEPS[loadingStep].text}</h4>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Strategic Core Operating</span>
                    <span>Step {loadingStep + 1} / {LOADING_STEPS.length}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeView === 'internal' ? (
                strategyData ? (
                  <div className="animate-in fade-in duration-700">
                    <div className="bg-slate-900 p-8 text-white">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                            <FileText className="w-6 h-6 text-indigo-300" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black tracking-tight uppercase">戰略情報紀錄表</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">INTERNAL CONFIDENTIAL</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-indigo-400 mb-1">{strategyData.meetingDate}</div>
                          <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 justify-end">
                            <ShieldCheck className="w-3 h-3" /> SECURE ANALYSIS
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-10">
                      <div className="relative pl-6 border-l-4 border-indigo-500">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">專案定義</label>
                        <h4 className="text-2xl font-black text-slate-800">{strategyData.projectName}</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">1. 權力與局勢 (Political Map)</h5>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">決策者 (Budget Owner)</label>
                            <div className="text-base font-black text-slate-900">{strategyData.political.decisionMaker.name}</div>
                            <div className="text-xs text-slate-500 font-medium mb-3">{strategyData.political.decisionMaker.title}</div>
                            <div className="pt-3 border-t border-slate-200/60 text-xs leading-relaxed text-slate-600">
                              <span className="font-bold text-slate-800">焦點：</span>{strategyData.political.decisionMaker.caresAbout}
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">關鍵影響者</label>
                              {strategyData.political.influencer.isAlly && (
                                <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 友軍
                                </span>
                              )}
                            </div>
                            <div className="text-base font-black text-slate-900">{strategyData.political.influencer.name}</div>
                            <div className="text-xs text-slate-500 font-medium mb-3">{strategyData.political.influencer.title}</div>
                            <div className="pt-3 border-t border-slate-200/60 text-xs leading-relaxed text-slate-600">
                              <span className="font-bold text-slate-800">動向：</span>{strategyData.political.influencer.attitude}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">目前局勢主導</span>
                          <div className="flex gap-2">
                            {['Marketing', 'Tech', 'Sales'].map(type => (
                              <span key={type} className={`text-[11px] font-bold px-4 py-1 rounded-lg border transition-all ${strategyData.political.situationType === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-300 border-slate-100'}`}>
                                {type === 'Marketing' ? '行銷主導' : type === 'Tech' ? '技術主導' : '業務主導'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertOctagon className="w-4 h-4 text-amber-600" />
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">2. 風險掃描 (Risk Assessment)</h5>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 relative group overflow-hidden">
                            <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-200/30 group-hover:rotate-12 transition-transform" />
                            <label className="text-[10px] font-bold text-amber-700/60 uppercase mb-2 block tracking-widest">地雷區 (Red Flags)</label>
                            <p className="text-sm font-medium text-amber-900 leading-relaxed z-10">{strategyData.risks.landmines}</p>
                          </div>
                          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 relative group overflow-hidden">
                            <Briefcase className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-200/30 group-hover:-rotate-12 transition-transform" />
                            <label className="text-[10px] font-bold text-amber-700/60 uppercase mb-2 block tracking-widest">隱形成本 (Hidden Friction)</label>
                            <p className="text-sm font-medium text-amber-900 leading-relaxed z-10">{strategyData.risks.hiddenCosts}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ListTodo className="w-4 h-4 text-emerald-600" />
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">3. 作戰策略 (Action Plan)</h5>
                          </div>
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${strategyData.strategy.role === 'Consultant' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>顧問模式</div>
                            <div className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${strategyData.strategy.role === 'Executioner' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>執行模式</div>
                          </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                          {strategyData.strategy.actions.map((action, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">{i + 1}</div>
                              <div className="flex-1 text-sm font-medium text-slate-700">{action.task}</div>
                              <div className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase group-hover:bg-white border border-transparent group-hover:border-slate-200 transition-all">{action.owner}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyPlaceholder icon={<Lock className="w-16 h-16" />} text="請在左側貼入逐字稿，啟動「戰略情報分析引擎」" />
                )
              ) : (
                externalMinutes ? (
                  <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Mail className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-black text-slate-800">外部會議紀錄</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Professional Client Memo</p>
                      </div>
                    </div>
                    <div className="flex-1 whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm select-all">
                      {externalMinutes}
                    </div>
                    <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                      <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <p className="text-[11px] text-indigo-800/70 leading-relaxed font-medium">
                        提示：點擊右上角「複製 Email 內容」將自動去除 Markdown 符號與加重號，確保在 Gmail 中的排版純淨專業。
                      </p>
                    </div>
                  </div>
                ) : (
                  <EmptyPlaceholder icon={<Globe className="w-16 h-16" />} text="分析完成後，這裡將生成專業的對外會議紀錄草稿" />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyPlaceholder: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-20">
    <div className="mb-6">{icon}</div>
    <p className="text-sm font-black text-slate-900 max-w-[200px] leading-relaxed uppercase tracking-widest">
      {text}
    </p>
  </div>
);

export default IntelligenceCard;
