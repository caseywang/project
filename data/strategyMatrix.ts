
export interface MatrixPoint {
    title: string;
    goal: string;
    items: string[];
}

export interface MatrixCategory {
    title: string;
    mode: string;
    color: 'rose' | 'sky';
    points: MatrixPoint[];
}

export const STRATEGY_DATA: MatrixCategory[] = [
    {
        title: "面對新客戶",
        mode: "偵探模式 (Detective Mode)",
        color: "rose",
        points: [
            {
                title: "1. 重構問題 (Reframe Context)",
                goal: "目標：定義表面需求下的真實挑戰",
                items: ["誰擁有預算權？", "誰是技術/執行把關者？", "專案目標是「做業績」還是「做品牌」？"]
            },
            {
                title: "2. 邏輯推理 (Reason Logic)",
                goal: "目標：將雜訊轉化為結構化決策",
                items: ["過去跟誰合作過？失敗原因？", "內部團隊的執行盲區在哪？", "切入點：避免踩雷，補足缺口。"]
            },
            {
                title: "3. 價值解答 (Resolve Positioning)",
                goal: "目標：驅動具備信心的價值行動",
                items: ["醜話說前頭：我們是顧問，不只是手腳。", "定義「成功」：除了 KPI，怎樣才算合作愉快？"]
            }
        ]
    },
    {
        title: "面對舊客戶",
        mode: "教練模式 (Coach Mode)",
        color: "sky",
        points: [
            {
                title: "1. 重構問題 (Reframe Context)",
                goal: "目標：偵測目標位移與新痛點",
                items: ["老闆這一季關注的指標變了嗎？", "公司的市場策略有沒有轉向？", "我們是否還在用舊邏輯跑新戰場？"]
            },
            {
                title: "2. 邏輯推理 (Reason Logic)",
                goal: "目標：打破慣性思維，掃描新機會",
                items: ["如果預算歸零，我們還會這樣投嗎？", "目前成效是否已進入「邊際效應遞減」？", "切入點：主動提出「反直覺」的測試。"]
            },
            {
                title: "3. 價值解答 (Resolve Positioning)",
                goal: "目標：重塑導師定位，引導長期增長",
                items: ["拒絕當客服，升級為「增長教練」。", "主動索取小預算做 MVP 測試 (New Opportunity)。"]
            }
        ]
    }
];
