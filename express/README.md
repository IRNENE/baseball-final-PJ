## !!使用前注意

- `.env.template`檔名改為`.env` 
- 已設定好，xampp的port/database名稱/管理者名稱/管理者密碼
- 若與設定不同請自行更改 `.env`中`DB_XXX`的欄位

## 指令
express執行:

```sh
npm run dev
```

## 路由
- 預設路由是/api
- 所以npm run dev要檢查有沒有成功的話
- 網址輸入 localhost:3005/api
- 就會連到預設的index
