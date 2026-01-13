
import React from 'react';
import { AlertCircle, ArrowRight, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';
import { ToolType } from '../types';

interface ApiStatusBannerProps {
    apiKey: string;
    onNavigateToSettings: (tool: ToolType) => void;
}

const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({ apiKey, onNavigateToSettings }) => {
    const verifiedKey = localStorage.getItem('gemini_api_verified_key');
    const isOperational = !!(apiKey && apiKey === verifiedKey);

    if (isOperational) return null;

    return (
        <div className={`mb-8 p-4 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${!apiKey ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl h-fit ${!apiKey ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                    <h5 className={`text-sm font-black uppercase tracking-widest ${!apiKey ? 'text-amber-900' : 'text-rose-900'}`}>
                        {!apiKey ? '未偵測到 AI API 金鑰' : 'API 金鑰尚未通過驗證'}
                    </h5>
                    <p className={`text-xs font-medium leading-relaxed ${!apiKey ? 'text-amber-800/70' : 'text-rose-800/70'}`}>
                        {!apiKey
                            ? '本工具的多項核心功能需要 Gemini API 支援。請先配置金鑰以解鎖 AI 即時分析功能。'
                            : '您的 API 金鑰已輸入但尚未成功完成連通測試，部分功能可能無法穩定運作。'}
                    </p>
                </div>
            </div>

            <button
                onClick={() => onNavigateToSettings(ToolType.SETTINGS)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg whitespace-nowrap ${!apiKey ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-100' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100'}`}
            >
                <SettingsIcon className="w-4 h-4" />
                立刻前往設定
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ApiStatusBanner;
