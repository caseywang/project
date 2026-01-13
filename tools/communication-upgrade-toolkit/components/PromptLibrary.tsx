
import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu, Zap, Copy, Check, Sparkles, MessageSquare, BrainCircuit,
  Lightbulb, ClipboardCheck, Mail, PencilLine, Info,
  ShieldCheck, MessageCircle, BarChart3, Target, Presentation, AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import PageHeader from './PageHeader';
import { ToolType } from '../types';

interface PromptLibraryProps {
  model?: string;
  apiKey?: string;
  onNavigate?: (tool: any) => void;
}

interface StructuredResponse {
  output: string;
  suggestions: string;
}

import { PROMPT_TEMPLATES } from '../data/prompts';

const PromptLibrary: React.FC<PromptLibraryProps> = ({ model = 'gemini-3-flash-preview', apiKey, onNavigate }) => {
  const [copiedResult, setCopiedResult] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [structuredResponse, setStructuredResponse] = useState<StructuredResponse | null>(null);
  const [rawResponse, setRawResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  const prompts = PROMPT_TEMPLATES;

  const handleCopyResult = (text: string) => {
    if (!text) return;
    const cleanText = text.replace(/(\*\*|__)/g, '').replace(/^(#+)\s+/gm, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const handleRunAi = async () => {
    if (!userInput.trim()) return;
    if (!apiKey) {
      if (onNavigate) {
        onNavigate(ToolType.SETTINGS);
      } else {
        alert("請前往「系統設定」輸入您的 API Key。");
      }
      return;
    }
    setIsLoading(true);
    setStructuredResponse(null);
    setRawResponse('');

    try {
      const effectiveApiKey = apiKey || (process as any).env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
      const activePrompt = prompts[selectedPromptIndex];
      const finalPrompt = `${activePrompt.content.replace('[貼上你的內容]', userInput).replace('[貼上現況]', userInput).replace('[描述問題]', userInput)}

【語言與文化規範】：
1. 嚴禁使用中國大陸用語 (支語)。
2. 使用台灣在地敘事邏輯。
3. 涉及數位行銷術語，請加註英文。
4. 提供「建議區間」並提供詳盡的「為什麼 (WHY)」戰略邏輯。
5. 在 "[最佳化產出]" 區塊中，絕對不要使用 Markdown。`;

      const response = await ai.models.generateContent({
        model: model,
        contents: finalPrompt,
      });

      const text = response.text || "";
      setRawResponse(text);

      const outputMatch = text.match(/\[最佳化產出\]:?([\s\S]*?)(?=\[戰略解析\]|$)/i);
      const suggestionMatch = text.match(/\[戰略解析\]:?([\s\S]*)/i);

      if (outputMatch && suggestionMatch) {
        setStructuredResponse({
          output: outputMatch[1].trim(),
          suggestions: suggestionMatch[1].trim()
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        setRawResponse("API 金鑰驗證失敗或無效。請前往「系統設定」輸入或更新您的 API Key。");
      } else {
        setRawResponse("生成過程中發生錯誤。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sysKey = (process.env as any).API_KEY;
  const effectiveKey = apiKey || (sysKey !== 'undefined' ? sysKey : '');
  const verifiedKey = localStorage.getItem('gemini_api_verified_key');
  const isOperational = !!(effectiveKey && effectiveKey === verifiedKey);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI 策略指令庫"
        tag="Creative Logic"
        insight="Before running prompts, clarify your position: Are you reacting, or repositioning?"
        description="將溝通從單純的「訊息傳遞」升級為「顧問式諮詢」。"
        engine={model}
        isOperational={isOperational}
        onStatusClick={onNavigate ? () => onNavigate(ToolType.SETTINGS) : undefined}
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 mt-2">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-wider">Strategic Logic AI</span>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left: Tactical Scene Selection */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-slate-400 font-bold text-[10px]">1</div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">選擇戰略場景</span>
          </div>
          <div className="space-y-3">
            {prompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedPromptIndex(idx)}
                className={`
                  w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group
                  ${selectedPromptIndex === idx
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50'
                    : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'}
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${selectedPromptIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-50 text-indigo-600'}`}>
                    {p.icon}
                  </div>
                  <h4 className="font-bold text-sm">{p.title}</h4>
                </div>
                <p className={`text-[11px] font-medium leading-relaxed ${selectedPromptIndex === idx ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Input & Output Engine */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-slate-400 font-bold text-[10px]">2</div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">輸入溝通背景 / 草稿</span>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 shadow-inner flex flex-col gap-8 flex-1 min-h-[800px]">

            {/* Input Form */}
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="請在此輸入內容..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-48 shadow-sm font-sans"
                />
                <button
                  onClick={handleRunAi}
                  disabled={isLoading || !userInput.trim()}
                  className={`
                    absolute bottom-4 right-4 px-8 py-3 rounded-xl flex items-center gap-2 font-black shadow-xl transition-all
                    ${isLoading || !userInput.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : apiKey ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200' : 'bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-none'}
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      戰略運算中...
                    </div>
                  ) : !apiKey ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      尚未設定 API Key (點擊前往設定)
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      啟動升維運算
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div ref={resultsRef} className="flex-1 flex flex-col gap-6">
              {isLoading && !structuredResponse && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                    <BrainCircuit className="w-8 h-8 animate-bounce text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 tracking-widest uppercase">Analyzing Context...</p>
                </div>
              )}

              {structuredResponse ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col flex-1">

                  {/* Optimized Content */}
                  <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 bg-indigo-50/50 border-b border-indigo-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">[升維產出內容]</span>
                      </div>
                      <button
                        onClick={() => handleCopyResult(structuredResponse.output)}
                        className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${copiedResult ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100'}`}
                      >
                        {copiedResult ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedResult ? '已複製純文本' : '複製內容'}
                      </button>
                    </div>
                    <div className="p-8">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed select-all">
                        {structuredResponse.output}
                      </pre>
                    </div>
                  </div>

                  {/* Strategic Analysis */}
                  <div className="bg-amber-50/40 rounded-3xl border border-amber-100 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">[戰略背書]</span>
                    </div>
                    <div className="text-sm text-amber-900/70 leading-relaxed whitespace-pre-wrap italic font-medium">
                      {structuredResponse.suggestions}
                    </div>
                  </div>
                </div>
              ) : (
                !isLoading && !rawResponse && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
                    <Presentation className="w-16 h-16 text-slate-300 mb-4" />
                    <h4 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">等待輸入</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      選擇左側戰略場景，輸入內容後，<br />AI助理將產出升維建議。
                    </p>
                  </div>
                )
              )}

              {!isLoading && !structuredResponse && rawResponse && (
                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                    {rawResponse}
                  </div>
                </div>
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

export default PromptLibrary;
