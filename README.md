# 家計簿アプリ with GitHub認証

React + Vite + TypeScriptで構築された家計簿アプリケーションです。

## 機能

- 💰 **収支管理**: 収入・支出の記録と管理
- 📊 **サマリー表示**: 収入、支出、残高を一目で確認
- 📝 **取引履歴**: すべての取引を時系列で表示
- 🔐 **GitHub認証**: GitHubアカウントでログイン
- 🎨 **レスポンシブデザイン**: PC・スマホ両対応

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## GitHub OAuth設定（オプション）

実際のGitHub OAuth認証を使用する場合：

1. [GitHub Developer Settings](https://github.com/settings/developers)でOAuthアプリケーションを作成
2. `.env`ファイルを作成し、Client IDを設定：

```bash
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```

3. Authorization callback URLを設定：`http://localhost:5173/callback`

Client IDを設定しない場合は、デモモードで動作します。

## 技術スタック

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules

## ファイル構成

```
src/
├── components/          # 共通コンポーネント
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── Summary.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # コンテキスト
│   └── AuthContext.tsx
├── pages/              # ページコンポーネント
│   ├── Login.tsx
│   └── Home.tsx
├── types.ts            # 型定義
├── App.tsx             # ルーティング設定
└── main.tsx            # エントリーポイント
```

## ライセンス

MIT
