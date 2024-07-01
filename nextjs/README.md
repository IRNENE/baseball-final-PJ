# 大專前端注意事項

## 部屬相關

- 因會有前後端兩包環境，此包為前端 next 專用
- 記得要先 cd 到 nextjs 資料夾，再執行 npm i

## 資料夾說明

**components**

- 存放建立的 components
- ==統一以該元件名稱建立資料夾==
- 該元件的 module.css 放在同一資料夾內

**data**

- 若有 json 相關文件，可存放於此資料夾

**page**

- ==路由建於此資料夾==
- 路徑請先建資料夾
- 用 index.js 當作跟目錄
- ex: member 路徑=>建立 member 資料夾=>內部建立 index.js=>連到/member 路徑就會以 index.js 當路由

**public**

- 圖片、影片等靜態資源放置於此資料夾
- 在 images 資料夾裡建立資料夾後存放
- 使用時路徑不用加上 public
- ex: /images/course/檔名

**styles**

- css 檔可存放於此
- global.css 為全域 css，請勿刪除
- 若還有甚麼全域參數需設置，可以再提出~
