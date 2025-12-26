
export const GET_INTERNAL_PROMPT = (transcript: string, internalTeam: string, clientName: string, today: string) => `
你是一位精通商業心理學與台灣商務敘事的策略總監。分析以下逐字稿，提取戰略資訊。請嚴格遵守以下規則：
1. 語氣：台灣商務用語，禁止大陸術語。
2. 數據處理：涉及數據、統計或技術術語請加註英文。
3. **關鍵定義**：在分析「政治角力 (political)」時，『關鍵影響者 (Influencer)』嚴格定義為**客戶端組織內部**對決策有影響力的人（例如：老闆娘、財務長、技術主管）。**嚴禁**將我方人員、外部顧問或非客戶端的人員誤判為影響者。
      【輸出格式：純 JSON (不含 Markdown)】
      {
        "projectName": "專案名稱",
        "meetingDate": "${today}",
        "political": {
          "decisionMaker": { "name": "姓名", "title": "職稱", "caresAbout": "最在意的事情" },
          "influencer": { "name": "姓名(必須是客戶端人員)", "title": "職稱", "attitude": "態度描述（支持/中立/敵對）", "isAlly": true/false },
          "situationType": "Marketing" 或 "Tech" 或 "Sales"
        },
        "risks": {
          "landmines": "地雷區：客戶討厭什麼",
          "hiddenCosts": "隱形成本：沒說出口的麻煩"
        },
        "strategy": {
          "role": "Consultant" 或 "Executioner",
          "actions": [
            { "task": "行動事項", "owner": "我方/客戶" }
          ]
        }
      }
      逐字稿：
      ${transcript}`;

export const GET_EXTERNAL_PROMPT = (transcript: string, internalTeam: string, clientName: string) => `
請將逐字稿轉化為一份專業的「會議紀錄 (Meeting Minutes)」內容，語氣專業且精簡。
- 發言方：${internalTeam}
- 接收方：${clientName}
- 語言：台灣商務繁體中文 (必要時加註英文術語)
- 格式要求：請使用適量的 Markdown 標註（標題用 #，重點用 **），包含主旨、出席人員、會議重點、與後續待辦事項。

逐字稿：
${transcript}`;
