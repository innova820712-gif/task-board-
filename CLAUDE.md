# CLAUDE.md

このファイルは、Claude Code がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

`task-board` — React 製のシンプルなタスク管理ボード。タスクの追加・完了トグル・削除に対応し、状態は `localStorage` に保存される。

## デプロイ先

<https://innova820712-gif.github.io/task-board-/>

- 配信方式: GitHub Pages (`gh-pages` ブランチ)
- 公開フロー: ローカルで `npm run deploy` → `dist/` を `gh-pages` ブランチに push

## 技術スタック

- **言語**: TypeScript (strict モード / `noUnusedLocals` / `noUnusedParameters` 有効)
- **UI**: React 18 (`react`, `react-dom`) + JSX (`react-jsx`)
- **ビルドツール**: Vite 5 (`@vitejs/plugin-react`)
- **モジュール形式**: ESM (`"type": "module"`)
- **状態管理**: React `useState` / `useEffect` のみ(外部ストアなし)
- **永続化**: ブラウザ `localStorage`(キーは `task-board:tasks`)
- **スタイル**: プレーン CSS(CSS Modules / CSS-in-JS は未使用)
- **PWA**: `vite-plugin-pwa`(Workbox `generateSW` / `autoUpdate`)。manifest と Service Worker は `vite build` 時に自動生成
- **アイコン生成**: `sharp` で `scripts/generate-icons.mjs` から PNG を出力(再生成は `node scripts/generate-icons.mjs`)
- **デプロイ**: `gh-pages` パッケージ
- **テスト**: 未導入

ライブラリを追加するときはこのリストも更新する。

## Git 運用ルール

**重要: コードを変更するたびに、必ず GitHub にプッシュしてください。**

具体的なフロー:

1. 変更を加えたら、変更内容を確認する (`git status` / `git diff`)
2. 関連ファイルを明示的に `git add <file>` でステージング(`git add .` や `-A` は避ける)
3. 変更内容を端的に説明するコミットメッセージで `git commit`
4. **直ちに `git push` でリモート (GitHub) に反映する**

補足ルール:

- 1つの論理的変更につき1コミットを基本とする(関連のない変更を混ぜない)
- コミットメッセージは「なぜ変えたか」を中心に簡潔に書く
- `--force` / `--no-verify` / `reset --hard` などの破壊的操作はユーザーが明示的に指示した場合のみ
- pre-commit フックが失敗したら `--amend` ではなく原因を直して**新しいコミット**を作る
- `.env` や認証情報など機密ファイルはコミットしない
- 本番反映は main への push とは別オペレーション(`npm run deploy` を別途実行)

## コーディング方針

- 既存ファイルの編集を優先し、不要な新規ファイルは作らない
- 仕様にない機能・抽象化・将来予測のコードは追加しない
- コメントは「なぜ」が自明でない場合だけ書く(何をしているかは命名で表現する)
- セキュリティ上の落とし穴(XSS / SQL インジェクション / コマンドインジェクション等)に注意する
- `localStorage` から読み込んだデータは型ガードしてから使う(JSON 不正/古いスキーマに備える)

## コンポーネント / 命名規約

| 種類 | 規約 | 例 |
| --- | --- | --- |
| コンポーネントファイル | `PascalCase.tsx` | `App.tsx` |
| コンポーネントに対応する CSS | コンポーネントと同名 | `App.css` |
| 型 / 型エイリアス | `PascalCase` | `type Task = { ... }` |
| 関数コンポーネント | `PascalCase` | `function App() { ... }` |
| 通常の関数 / 変数 | `camelCase` | `loadTasks`, `addTask` |
| イベントハンドラ | 動詞 + 対象の `camelCase` | `addTask`, `toggleTask`, `deleteTask` |
| 定数(モジュールスコープ) | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY` |
| `localStorage` キー | `task-board:<scope>` 形式で名前空間を切る | `task-board:tasks` |
| CSS クラス名 | `kebab-case`、状態は修飾語を併記 | `.task`, `.task.completed`, `.input-row` |
| 真偽値 props / 状態 | `is` / `has` / `completed` のような自然な述語 | `completed: boolean` |

追加ルール:

- 1ファイル1コンポーネントを基本とする(子コンポーネントが小さい場合は同居可)
- `export default` はコンポーネントに使い、型・ユーティリティは名前付き export を優先
- `useState` の初期値生成にコストがかかる処理は遅延初期化 (`useState(loadTasks)`) を使う
- 副作用は `useEffect` に閉じ込め、依存配列を明示する
- TypeScript の型 import は `import type { ... }` を使い、値 import と分ける

## 開発コマンド

| コマンド | 用途 |
| --- | --- |
| `npm install` | 依存をインストール |
| `npm run dev` | 開発サーバー起動(<http://localhost:5173/>) |
| `npm run build` | 本番ビルド(`dist/` を生成、CI/デプロイ前提) |
| `npm run preview` | ビルド成果物をローカル確認 |
| `npm run deploy` | `dist/` を `gh-pages` ブランチに push して本番公開 |

## ディレクトリ構成

```text
task-board/
├── CLAUDE.md              # 本ファイル
├── index.html             # Vite エントリ HTML
├── package.json
├── vite.config.ts         # Vite 設定(本番ビルド時のみ base を /task-board-/)
├── tsconfig.json          # ルート TS 設定 (project references)
├── tsconfig.app.json      # アプリ用 TS 設定(strict)
├── tsconfig.node.json     # ビルドツール用 TS 設定
└── src/
    ├── main.tsx           # React エントリ
    ├── App.tsx            # ルートコンポーネント
    ├── App.css            # App 用スタイル
    ├── index.css          # グローバル基本スタイル
    └── vite-env.d.ts      # Vite 型定義
```

ファイルが増えてきたら以下を目安にディレクトリを切る:

- `src/components/` — 再利用可能なコンポーネント
- `src/hooks/` — カスタムフック (`useXxx`)
- `src/lib/` または `src/utils/` — 純粋関数のヘルパー
- `src/types/` — 共有の型定義
