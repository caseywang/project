# 升維溝通工具包 (Communication Upgrade Toolkit) - 架構內容說明文件

本文件旨在說明「升維溝通工具包」的系統架構、技術棧、核心功能模組以及開發規範。

---

## 1. 專案核心定位
本工具包是為了 **CloudAD 策略團隊** 設計的內部戰略輔助系統。其核心在於透過 **3R 戰略架構 (Reframe, Reason, Resolve)**，將日常的商務溝通從單純的「任務執行」提升至「顧問式洞察」維度。

**核心目標**：從執行的工具 (Tool for Execution) 升級為定位的系統 (System for Positioning)。

---

## 2. 技術棧 (Tech Stack)
*   **前端框架**: React 19 (TypeScript)
*   **建置工具**: Vite 6
*   **樣式處理**: Tailwind CSS (Vanilla CSS 輔助)
*   **圖標庫**: Lucide React
*   **AI 引擎**: Google Gemini API (@google/genai)
*   **數據驅動**: 抽離內容至 `data/` 目錄，實現邏輯與數據分離

---

## 3. 目錄結構
```text
/
├── components/           # 核心功能元件定義
│   ├── Home.tsx              # 工具首頁 (Landing Page / Scenario Selector)
│   ├── StrategyMatrix.tsx    # 3R 戰略導航圖 (數據驅動渲染)
│   ├── IntelligenceCard.tsx  # 內部情報卡 (逐字稿 AI 分析)
│   ├── EmailTemplates.tsx    # 外部溝通模組 (3R 郵件範本)
│   ├── PromptLibrary.tsx     # AI 賦能指令庫 (升維指令生成)
│   └── Settings.tsx          # 系統設定 (API Key 與模型管理)
├── data/                 # 內容數據定義 (Prompts, Templates, Matrix data)
├── App.tsx               # 應用程式主入口，包含路由跳轉、滾動重置與狀態管理
├── index.tsx             # React 掛載點
├── types.ts              # 全域 TypeScript 型別定義
└── vite.config.ts        # Vite 編譯設定與環境變數定義
```

---

## 4. 核心功能模組

### 4.1 工具首頁 (`Home.tsx`)
*   **定位**: 系統定錨點，強調「定位先於行動」。
*   **功能**:
    *   **3R Mini Snapshot**: 快速呈現 Reframe, Reason, Resolve 的核心戰略定義。
    *   **情境選擇器 (Scenario Selector)**: 根據使用者的現況（如：新客、卡關係、高風險溝通）引導至對應工具。
    *   **品牌哲學**: 內嵌溝通價值觀與 Impact 宣告。

### 4.2 3R 戰略導航圖 (`StrategyMatrix.tsx`)
*   **功能**: 作為策略團隊的 Quick Reference Guide。
*   **內容**: 區分「新客戶 (偵探模式)」與「舊客戶 (教練模式)」的操作心法，對齊「重構問題、邏輯推理、價值解答」三階段。
*   **標語**: *Before planning, clarify your position: Are you reacting, or repositioning?*

### 4.3 內部情報卡 2.0 (`IntelligenceCard.tsx`)
*   **核心**: 整合 Google Gemini AI。
*   **功能**:
    *   **Transcript 解構**: 將會議逐字稿自動轉換為戰略地圖。
    *   **政治角力 & 風險掃描**: 自動偵測決策者與隱藏地雷。
*   **標語**: *Before analysis, clarify your position: Are you reacting, or repositioning?*

### 4.4 外部溝通模組 (`EmailTemplates.tsx`)
*   **功能**: 提供標準化的 3R 郵件架構，協助產出具備顧問高度的郵件。
*   **特色**: 支援戰略預覽與自由編輯模式，並提供純淨內容複製（自動去除系統術語標籤）。
*   **標語**: *Before writing, clarify your position: Are you reacting, or repositioning?*

### 4.5 AI 賦能指令庫 (`PromptLibrary.tsx`)
*   **功能**: 提供針對「跨維度調頻」、「舊客戰略破局」等專用 Prompt，協助原始草稿升維。
*   **標語**: *Before running prompts, clarify your position: Are you reacting, or repositioning?*

---

## 5. UI/UX 開發規範
1.  **高度鎖定 (Layout Locked)**: 使用 `h-screen` 確保側邊欄固定，主要內容區域獨立滾動。
2.  **滾動重置 (Scroll Reset)**: 換頁時透過 `mainContentRef` 與 `useEffect` 自動將 `scrollTop` 歸零。
3.  **金鑰管理**: 支援 `localStorage` 本地儲存 API KEY，確保個人化運算配額與資料隱私。
4.  **戰略提示 (Insight Line)**: 每個工具頂部必須包含一行極簡的戰略問句，強化系統深度感。

---
*© 2025 CloudAD Datateam Yiting • Strategic Core v2.0*
