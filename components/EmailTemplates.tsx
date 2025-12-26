
import React, { useState, useEffect } from 'react';
import {
  Copy, Check, Mail, ArrowRight,
  Lightbulb, ShieldCheck, Target, Eye, Pencil,
  Sparkles, MessageSquare, Info, Layout, ExternalLink, ChevronRight
} from 'lucide-react';
import PageHeader from './PageHeader';

import { EMAIL_TEMPLATES as TEMPLATES } from '../data/templates';

const EmailTemplates: React.FC = () => {
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

  const activeTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0];

  // Local state for all sections text to allow individual editing
  const [editableSections, setEditableSections] = useState(activeTemplate.sections.map(s => s.text));
  const [editableSubject, setEditableSubject] = useState(activeTemplate.subject);
  const [editableClosing, setEditableClosing] = useState(activeTemplate.closing);

  useEffect(() => {
    setEditableSections(activeTemplate.sections.map(s => s.text));
    setEditableSubject(activeTemplate.subject);
    setEditableClosing(activeTemplate.closing);
  }, [selectedId]);

  const handleCopy = () => {
    const emailBody = editableSections.join('\n\n') + '\n\n' + editableClosing;
    const text = `主旨：${editableSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateSectionText = (index: number, newText: string) => {
    const newSections = [...editableSections];
    newSections[index] = newText;
    setEditableSections(newSections);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="外部溝通模組"
        tag="3R Framework"
        insight="Before writing, clarify your position: Are you reacting, or repositioning?"
        description="將戰略思維隱藏在專業辭令下。點擊段落旁的標籤可查看該段落的戰略目標集。"
      >
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Eye className="w-3.5 h-3.5" /> 戰略預覽
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Pencil className="w-3.5 h-3.5" /> 自由編輯
          </button>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-12 gap-8">

        {/* Left Column: Scene Selector */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">場景切換</h3>
            <div className="grid gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`
                    w-full text-left p-4 rounded-2xl border transition-all duration-300 group
                    ${selectedId === t.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100'
                      : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-600 hover:shadow-md'}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{t.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === t.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                  </div>
                  <p className={`text-[10px] leading-relaxed ${selectedId === t.id ? 'text-indigo-100/80' : 'text-slate-400'}`}>
                    {t.usage}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Strategic Context */}
          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
              <Lightbulb className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">核心戰略目標</span>
            </div>
            <p className="text-xs text-amber-900/70 leading-relaxed font-medium">
              「{activeTemplate.overviewStrategy}」
            </p>
            <div className="pt-2 border-t border-amber-100 flex gap-2">
              {activeTemplate.labels.map(l => (
                <span key={l} className="text-[9px] font-bold bg-white text-amber-600 px-2 py-0.5 rounded border border-amber-200">#{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Annotated Email Simulator */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">

            {/* Browser/Email Header UI */}
            <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">主旨</span>
                    {viewMode === 'edit' ? (
                      <input
                        type="text"
                        value={editableSubject}
                        onChange={(e) => setEditableSubject(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <h4 className="text-sm font-bold text-slate-800">{editableSubject}</h4>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">副本</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">相關決策者 (Decision Makers)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`
                  px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg
                  ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-0.5'}
                `}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已複製純淨內容' : '複製內容'}
              </button>
            </div>

            {/* Email Content Area with Annotations */}
            <div className="flex-1 flex flex-col p-8 space-y-6 overflow-y-auto custom-scrollbar">

              <div className="text-sm text-slate-400 mb-2 font-sans">[客戶窗口職稱/姓名] 您好，</div>

              {/* 3R Sections */}
              {activeTemplate.sections.map((section, idx) => (
                <div key={section.key} className="flex gap-6 items-start group">
                  {/* Annotation Label (Hidden in Email) */}
                  <div className={`w-32 flex-shrink-0 transition-opacity duration-300 ${viewMode === 'preview' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`text-[10px] font-black uppercase tracking-tighter ${section.colorClass} flex items-center gap-1.5 mb-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                      {section.label}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 mb-1">{section.subLabel}</div>
                    <div className="text-[9px] text-slate-400 leading-tight pr-2">{section.description}</div>
                  </div>

                  {/* Text Block */}
                  <div className={`flex-1 p-4 rounded-2xl transition-all border ${viewMode === 'preview' ? `${section.bgClass} ${section.borderClass}` : 'bg-transparent border-transparent'}`}>
                    {viewMode === 'edit' ? (
                      <textarea
                        value={editableSections[idx]}
                        onChange={(e) => updateSectionText(idx, e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-700 leading-relaxed outline-none resize-none font-sans"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed font-sans select-all">
                        {editableSections[idx]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Closing Section */}
              <div className="flex gap-6 items-start">
                <div className="w-32 flex-shrink-0" /> {/* Spacer */}
                <div className="flex-1 p-4">
                  {viewMode === 'edit' ? (
                    <textarea
                      value={editableClosing}
                      onChange={(e) => setEditableClosing(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-700 leading-relaxed outline-none resize-none font-sans"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-slate-700 leading-relaxed font-sans select-all">
                      {editableClosing}
                    </p>
                  )}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="text-sm font-bold text-slate-900">[您的職稱與姓名]</div>
                    <div className="text-xs text-slate-400">CloudAD 雲數位 策略團隊</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-slate-900 px-8 py-3 flex items-center justify-between text-white/40">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">內部戰略安全過濾</span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <span className="text-[10px] font-medium">複製內容已自動去除 [Recognize/Review/Re-align] 等術語標籤</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                Strategic Drafting v2.2 <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Tips / Tactical Advice */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100 flex gap-4">
              <div className="p-2 bg-indigo-100 rounded-xl h-fit">
                <Layout className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-indigo-900 mb-1">排版建議</h5>
                <p className="text-[11px] text-indigo-800/60 leading-relaxed">
                  Gmail 傳送前，建議對「3R 段落」進行換行，確保行動裝置閱讀體驗。
                </p>
              </div>
            </div>
            <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100 flex gap-4">
              <div className="p-2 bg-emerald-100 rounded-xl h-fit">
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-900 mb-1">附件連結</h5>
                <p className="text-[11px] text-emerald-800/60 leading-relaxed">
                  提及數據報告時，請務必在 Re-align 段落補上對應的 Looker Studio 連結。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;
