
import React, { useState, useEffect } from 'react';
import {
  Compass,
  FileText,
  Mail,
  Cpu,
  Menu,
  X,
  ChevronRight,
  Github,
  Settings as SettingsIcon,
  Target
} from 'lucide-react';
import { ToolType, NavItem } from './types';
import StrategyMatrix from './components/StrategyMatrix';
import IntelligenceCard from './components/IntelligenceCard';
import EmailTemplates from './components/EmailTemplates';
import PromptLibrary from './components/PromptLibrary';
import Settings from './components/Settings';
import Home from './components/Home';

const NAV_ITEMS: NavItem[] = [
  { id: ToolType.HOME, label: '工具首頁', icon: <Compass className="w-5 h-5" /> },
  { id: ToolType.STRATEGY_MATRIX, label: '3R 戰略導航圖', icon: <Target className="w-5 h-5" /> },
  { id: ToolType.EMAIL_TEMPLATES, label: '外部溝通模組', icon: <Mail className="w-5 h-5" /> },
  { id: ToolType.INTELLIGENCE_CARD, label: '內部情報卡', icon: <FileText className="w-5 h-5" /> },
  { id: ToolType.AI_PROMPTS, label: 'AI 賦能指令庫', icon: <Cpu className="w-5 h-5" /> },
];

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 全局 AI 模型設定
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('gemini_model_preference') || 'gemini-3-flash-preview';
  });

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('gemini_model_preference', model);
  };

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case ToolType.HOME:
        return <Home onStart={setActiveTool} />;
      case ToolType.STRATEGY_MATRIX:
        return <StrategyMatrix />;
      case ToolType.INTELLIGENCE_CARD:
        return <IntelligenceCard model={selectedModel} apiKey={apiKey} />;
      case ToolType.EMAIL_TEMPLATES:
        return <EmailTemplates />;
      case ToolType.AI_PROMPTS:
        return <PromptLibrary model={selectedModel} apiKey={apiKey} />;
      case ToolType.SETTINGS:
        return (
          <Settings
            currentModel={selectedModel}
            onModelChange={handleModelChange}
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
          />
        );
      default:
        return <Home onStart={setActiveTool} />;
    }
  };

  const mainContentRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTool]);

  return (
    <div className="h-screen bg-white flex flex-col md:flex-row text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span>升維溝通工具包</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-100 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div
            className="hidden md:flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTool(ToolType.HOME)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-900">升維溝通</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Communication Toolkit</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTool(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTool === item.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                {activeTool === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <button
              onClick={() => {
                setActiveTool(ToolType.SETTINGS);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTool === ToolType.SETTINGS
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-100'}
              `}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="font-medium text-sm">系統設定</span>
            </button>

            <div className="pt-6 border-t border-slate-200">
              <a
                href="https://github.com/caseywang/project"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Github className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">© 2025 Yiting Wang</p>
                  <p className="text-[9px] text-indigo-500 font-medium">Project Github</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        ref={mainContentRef}
        className="flex-1 overflow-y-auto bg-white p-4 md:p-8 lg:p-12 scroll-smooth"
      >
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderActiveTool()}
        </div>
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
