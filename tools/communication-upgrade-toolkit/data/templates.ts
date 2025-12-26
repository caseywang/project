
export interface StrategySection {
    key: 'reframe' | 'reason' | 'resolve';
    label: string;
    subLabel: string;
    description: string;
    text: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
}

export interface Template {
    id: string;
    category: 'new' | 'existing';
    title: string;
    usage: string;
    overviewStrategy: string;
    subject: string;
    sections: StrategySection[];
    closing: string;
    labels: string[];
}

export const EMAIL_TEMPLATES: Template[] = [
    {
        id: 'new-diagnosis',
        category: 'new',
        title: '新客【共識診斷信】',
        usage: '初次會議後發送，鎖定範疇並展現顧問高度。',
        overviewStrategy: '利用「診斷」框架建立專家身份，將我方從「比價對象」升級為「增長夥伴」。',
        subject: '【會議共識】關於 [客戶品牌] 行銷合作方向之初步診斷與建議',
        sections: [
            {
                key: 'reframe',
                label: 'Reframe',
                subLabel: '重構預設',
                description: '確認雙方對於本次合作目標 (KPI) 與內部決策鏈的共識。',
                text: '感謝今日的撥冗會議。針對本次專案，我們確認首要目標將聚焦於解決 [某部門] 對於 [某指標] 的提升需求，並需在 [特定時間點] 前完成初步佈局。',
                colorClass: 'text-indigo-600',
                bgClass: 'bg-indigo-50/50',
                borderClass: 'border-indigo-100'
            },
            {
                key: 'reason',
                label: 'Reason',
                subLabel: '決策推理',
                description: '挖掘過往失敗經驗或執行盲區，提出針對性解法。',
                text: '回顧貴司過去在 [某領域] 遇到的執行挑戰，我們認為關鍵瓶頸在於 [原因]。因此，本次規劃將特別加強 [具體解法]，以確保資源投放的精準度。',
                colorClass: 'text-rose-600',
                bgClass: 'bg-rose-50/50',
                borderClass: 'border-rose-100'
            },
            {
                key: 'resolve',
                label: 'Resolve',
                subLabel: '價值解答',
                description: '定義我方的顧問角色，而不僅僅是執行端。',
                text: '在接下來的合作中，[我方公司] 將不僅僅擔任執行角色，更會以戰略顧問的維度，定期提供 [加值價值，如：競品異動報告]，確保決策始終對齊市場變化。',
                colorClass: 'text-emerald-600',
                bgClass: 'bg-emerald-50/50',
                borderClass: 'border-emerald-100'
            }
        ],
        closing: '若上述方向符合預期，我們將於 [日期] 提供更詳盡的執行方案。',
        labels: ['專業權威', '建立信任']
    },
    {
        id: 'existing-opportunity',
        category: 'existing',
        title: '舊客【機會啟動信】',
        usage: '季度檢討或關係平淡時，主動提出新機會。',
        overviewStrategy: '透過「歸零思考」打破 SOP 慣性，創造新的溝通破口。',
        subject: '【季度回顧】[客戶品牌] 下階段增長紅利觀察與測試建議',
        sections: [
            {
                key: 'reframe',
                label: 'Reframe',
                subLabel: '目標重構',
                description: '偵測客戶本季目標是否變動，重新對齊決策者關注點。',
                text: '合作進入新季度，觀察到近期市場在 [某管道] 的動態，這可能對我們目前的 [KPI] 產生影響。想與您對齊，貴司目前的年度重心是否仍維持在 [原目標]？',
                colorClass: 'text-indigo-600',
                bgClass: 'bg-indigo-50/50',
                borderClass: 'border-indigo-100'
            },
            {
                key: 'reason',
                label: 'Reason',
                subLabel: '因果分析',
                description: '檢視目前成效是否邊際遞減，提出最佳化必要性。',
                text: '分析過去三個月的數據，雖然整體成效穩定，但我們發現 [特定分眾] 的轉換 (Conversion) 已逐漸進入高原期。如果維持現狀，未來的獲客成本 (CPA) 恐有上升風險。',
                colorClass: 'text-rose-600',
                bgClass: 'bg-rose-50/50',
                borderClass: 'border-rose-100'
            },
            {
                key: 'resolve',
                label: 'Resolve',
                subLabel: '路徑解答',
                description: '引導客戶撥出小部分預算嘗試新機會 (New Opportunity)。',
                text: '因此，我們建議啟動一項為期兩週的「增長實驗」，撥出約 [5%-10%] 的彈性預算測試 [新功能/新管道]。這將有助於我們在 [特定大節日] 前，先行掌握新的紅利密碼。',
                colorClass: 'text-emerald-600',
                bgClass: 'bg-emerald-50/50',
                borderClass: 'border-emerald-100'
            }
        ],
        closing: '希望能針對此實驗方向安排 10 分鐘的快速通話進行討論。',
        labels: ['價值續約', '主動出擊']
    }
];
