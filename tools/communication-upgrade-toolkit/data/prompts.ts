
import React from 'react';
import { MessageCircle, BarChart3, Target } from 'lucide-react';

export interface PromptTemplate {
    id: number;
    title: string;
    icon: React.ReactNode;
    desc: string;
    content: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
    {
        id: 0,
        title: "【跨維度調頻】(萬用溝通升級)",
        icon: React.createElement(MessageCircle, { className: "w-5 h-5" }),
        desc: "不限 Email。將語氣從「執行匯報」轉換為「決策洞察」，適用於 LINE/Slack、口頭報告或會議發言。",
        content: `你是一位專業商務專家。請將以下原始內容進行「維度升級」。
【原始內容】: [貼上你的內容]

【任務目標】:
1. 語氣轉換：焦點從「具體任務 (Task)」轉向「商業影響力 (Impact)」。
2. 敘事邏輯：採用專業商務敘事，語氣謙和但邏輯強硬，強調對齊老闆的關注重點。
3. 數據標註：若提及數據或統計，請務必括號標註英文（如：轉換率 (Conversion Rate)）。

【輸出格式規範】:
1. [最佳化產出]: 提供直接可用的文字內容。嚴禁使用 Markdown 符號（如 **粗體**、#）。
2. [戰略解析]: 說明此次調整背後的心理邏輯，以及針對特定溝通管道（LINE vs 報告）的細微調整建議。`
    },
    {
        id: 1,
        title: "【舊客戰略破局】(增長靈感生成)",
        icon: React.createElement(BarChart3, { className: "w-5 h-5" }),
        desc: "針對合作舊客，尋找「邊際遞減」之外的新機會。從預算分配與市場變因提出「方向性」建議。",
        content: `你是一位資深增長顧問。我方與客戶 [公司/產業] 面臨成效高原期。
【現況背景】: [貼上現況]

【任務目標與規範】:
1. 找出盲區：分析目前的執行邏輯中，哪些已進入邊際效應遞減 (Diminishing Returns)。
2. 方向性建議：
   - 【禁止】直接給予單一硬性數字（如：增加預算 20%）。
   - 【必須】提供「建議區區間」與「WHY 戰略理由」。
3. 實驗性提案：提出 1 個「假設性測試」方向。

【輸出格式規範】:
1. [最佳化產出]: 直接產出提案草案。嚴禁使用 Markdown 符號。
2. [戰略解析]: 說明這些建議如何對齊客戶端的年度商業計畫。`
    },
    {
        id: 2,
        title: "【危機拆彈與重定向】",
        icon: React.createElement(Target, { className: "w-5 h-5" }),
        desc: "成效波動或客戶質疑時，如何不卑不亢地承認問題，並將討論引導回長線價值。",
        content: `你是一位高 EQ 的商務談判專家。
【危機描述】: [描述問題]

【任務目標】:
1. 負面對沖：用宏觀視角 (Context) 解釋波動。
2. 方向指引：提供階段性的優化方向。
3. 信任重建：強調短期波動 (Volatility) 是長期最佳化 (Optimization) 的必要養分。

【輸出格式規範】:
1. [最佳化產出]: 提供回覆內容。嚴禁使用 Markdown 符號。
2. [戰略解析]: 分析客戶焦慮點。`
    }
];
