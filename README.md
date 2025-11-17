# kintone Customization JS Templates

― 現場でそのまま使える、汎用カスタマイズスクリプト集 ―

kintone 開発の現場でよく必要になる
「ちょうどいいスクリプト」だけを集めたテンプレート集 です。

- 外部ライブラリなし
- 設定（CONFIG）を書き換えるだけ
- モジュール化済み
- 商用利用OK

初心者〜上級者まで、そのまま or 改造して使えます。

---

## 📁 収録テンプレ一覧

### 🟦 入力補助（Input Assist）
| ファイル名                            | 概要                      | 主な用途           |
| -------------------------------- | ----------------------- | -------------- |
| `dropdown-to-fields-autofill.js` | ドロップダウン選択で複数フィールド自動入力   | プラン反映 / テンプレ入力 |
| `auto-lookup.js`                 | ルックアップ値の自動取得            | ルックアップ漏れ防止     |
| `field-hide-disabled.js`         | フィールド非表示・入力不可化          | 権限制御・操作抑制      |
| `normalize-fields.js`            | 保存時に半角英数字へ整形            | 電話番号・郵便番号整形    |
| `auto-number-on-save.js`         | レコード保存時に自動採番            | 見積番号/伝票番号生成    |
| `subtable-lookup-selector.js`    | ボタン選択でサブテーブルへ行追加＋ルックアップ | 候補選択UIの構築      |

### 🟧 表示改善・ナビゲーション（UI / UX）
| ファイル名                           | 概要            | 主な用途      |
| ------------------------------- | ------------- | --------- |
| `group-tab-switcher.js`         | グループフィールドをタブ化 | 長いフォームを分割 |
| `label-navigator.js`            | ラベルから“目次”を生成  | 項目ジャンプ    |
| `index-quick-switch-buttons.js` | 一覧ビュー切替ボタン    | 現場向けナビ設定  |
| `sidebar-closed.js`             | サイドバーを自動で閉じる  | 入力集中モード   |

### 🟩 データ品質・バリデーション（Validation）
| ファイル名                | 概要             | 主な用途       |
| -------------------- | -------------- | ---------- |
| `field-validator.js` | 複雑な条件式でバリデーション | 入力チェックの高度化 |

### 🟪 自動化（Automation）
| ファイル名                        | 概要           | 主な用途     |
| ---------------------------- | ------------ | -------- |
| `progress-to-next-status.js` | 保存後ステータス自動遷移 | 承認フロー自動化 |


## 🚀 使い方（共通）
1. 使いたい .js ファイルをダウンロード
GitHub の対象テンプレをクリック → Download raw file

2. kintoneの「JavaScript / CSSカスタマイズ」へアップロード
- アプリ設定 → カスタマイズ → JavaScript
- デスクトップ用に登録（必要ならモバイルにも）

3. CONFIG を自分のアプリに合わせて書き換え
テンプレート上部には必ずこのような設定があります：
```js
const CONFIG = {
  fieldCode: '顧客名',
  targetView: '今日',
  tableCode: '明細',
  ...
};
```

## 💡 Templates / Snippets / Documents

https://github.com/youtotto/kintone-app-toolkit

Toolkit と連携する “3階層構造”

Toolkit の Templates タブでは、このリポジトリの3種類の素材をすべて読み込み、
開発 → 設計 → ドキュメント化 → デプロイ までを一気通貫で扱えます。

### 1️⃣ JS Templates（JavaScriptテンプレート集）
現場でそのまま使えるカスタマイズJS
この README で紹介している「JSテンプレート」はすべて Toolkit Templates → JS Templates から直接開けます。

機能は主に：
| 種類                 | 目的              |
| ------------------ | --------------- |
| 入力補助（Input Assist） | 入力自動化・整形・候補選択UI |
| 表示改善（UX / UI）      | タブ化・目次・ビュー切替    |
| 自動化（Automation）    | 採番・自動ステータス遷移    |
| データ品質（Validation）  | 複合条件バリデーション     |


Toolkit 上で開くと：
- フィールドコード補完
- Snippets 挿入
- カスタマイズJS の即時実行テスト
- Upload & Deploy までワンストップ
で扱えます。

### 2️⃣ Snippets（JSコード断片・ユーティリティ）
「JSの書き始め」を楽にするユーティリティ集
Snippets は、テンプレより小さな「JS断片」です。
Toolkit 内では JS Templates の補助素材 として使われます。

収録中の Snippets例：
| ファイル                 | 役割                           |
| -------------------- | ---------------------------- |
| `basic-utility.js`   | API ショートカット / ロガー / クエリエスケープ |
| `config-template.js` | CONFIG ブロックの雛形               |
| `event-bundling.js`  | PC/モバイル両対応のイベント束             |


- JS テンプレを改造したい
- 小さなユーティリティだけ取り込みたい
- 既存コードの品質を Toolkit 流に統一したい

Toolkit Templates の Snippets カテゴリからワンクリックで挿入できます。


### 3️⃣ Documents（構成・レビュー・要件定義のテンプレ）
kintoneの設計・議論・改善を“構造化”するためのドキュメント集
Toolkit の Documents → Markdown Editor から直接開けます。

| ファイル                      | 内容           | 用途           |
| ------------------------- | ------------ | ------------ |
| `kintoneアプリ現状整理ドキュメント.md` | アプリ構成の棚卸・可視化 | 初期ヒアリング・引継ぎ  |
| `kintone開発レビュー依頼.md`      | レビュー依頼テンプレ   | 開発後レビュー依頼    |
| `kintone要件定義書.md`         | 要件定義テンプレ     | 新規開発・改修要件まとめ |
| `改善提案ドキュメント.md`           | 改善テーマの整理     | PoC・業務改善提案   |
| `問題提起ドキュメント.md`           | 問題定義と根因分析    | 問題解決の起点作り    |
| `議論整理ドキュメント.md`           | 議論の論点整理      | 合意形成・議事録として  |

#### 💡 Documents の強み
- Markdownで構造化
- Toolkit 上で編集 → コピペ → 共有可能
- AIプロンプト生成（要件書→AI要求文自動生成）も対応
- 現場とのレビューサイクルを高速化

### 🧩 3種類の役割まとめ
| 種別               | 内容             | 目的           | Toolkitでの扱い      |
| ---------------- | -------------- | ------------ | ---------------- |
| **JS Templates** | カスタマイズJS本体     | できることを増やす    | Monacoで編集 → デプロイ |
| **Snippets**     | コード断片・補助関数     | 書きやすさ・再利用性向上 | テンプレ挿入補助         |
| **Documents**    | Markdownドキュメント | 整理・議論・要件定義   | AI生成・MDエディタ連携    |


Toolkit を使うと、この3つがシームレスにつながり：

**✔ 設計（Documents）**
- → ✔ 開発（JS Templates + Snippets）
- → ✔ デプロイ（Customize + Upload & Deploy）
- → ✔ 構造可視化（Field Scanner / Relations）

という “kintone開発エコシステム” が 1つのUXとして成立します。

---

## 📘 テンプレ別：詳細ガイド

### 🔹 field-hide-disabled.js
特定のフィールドを「非表示」または「入力不可」にするテンプレ

#### 📌 使い所
- 権限によって表示したくない項目を隠す
- 変更されると困る項目を入力不可にしたい
- 編集画面だけ「非表示」などの制御が必要

#### 🛠 CONFIG例
```js
hiddenFields: ['GRP_BASIC', 'KOKCD'],   // 非表示
disabledFields: ['ADDR1', 'ADDR2'],     // 入力不可
```

### 🔹 field-validator.js
複合条件によるフィールドバリデーション（保存前チェック）

#### 📌 使い所
- 「顧客名が test ならエラー」などの条件チェック
- 他フィールドを参照した複雑な制御
- 条件エラーの詳細メッセージを自動生成したい

#### 🛠 CONFIG例
```js
validationFields: [
  {
    fieldCode: '顧客名',
    conditionMode: 'or',
    conditions: [
      { op: 'equals', value: 'test' },
      { op: 'equals', value: 'test2' }
    ],
    message: 'auto'
  }
]
```

### 🔹 group-tab-switcher.js
グループフィールドを “タブUI” として切り替えるテンプレ

#### 📌 使い所
- 長いフォームをタブで切り替えたい
- グループフィールドを使って画面を分割したい
- 管理者用タブなど、特定のグループだけ見せたい

#### 🛠 CONFIG例
```js
tabSpace: 'TAB_MENU',
tabs: [
  { label: '基本', group: 'grp01', activeBg: 'mint' },
  { label: '詳細', group: 'grp02', activeBg: 'pale' }
]
```

### 🔹 index-quick-switch-buttons.js
一覧画面ヘッダに “ビュー切替ボタン” を配置するテンプレ

#### 📌 使い所
- 一覧ビューが多く、迷いやすい
- 現場のオペレーションに合わせたナビゲーションを置きたい
- 外部リンクもまとめて置きたい

#### 🛠 CONFIG例
```js
buttons: [
  { label: "概要", viewId: 5758653, width: 60, bg: 'overview' },
  { label: "料金", viewId: 5758650, width: 80, bg: 'pricing' },
  { label: "外部サイト", href: "https://example.com", width: 90 }
]
```

### 🔹 auto-lookup.js
通常フィールド & サブテーブルのルックアップを “自動取得”

#### 📌 使い所
- ルックアップ元が既に入っているのに「未取得」状態を自動解決したい
- サブテーブル内のルックアップ忘れを防止したい

#### 🛠 CONFIG例
```js
lookupFields: ['顧客コード'],
subtableLookups: [{ table: '明細', column: '商品名' }]
```

### 🔹 normalize-fields.js
保存時に文字列を半角英数字に正規化するテンプレ

#### 📌 使い所
- 郵便番号・電話番号・型番などの入力ブレをなくしたい
- 全角 → 半角変換
- 記号（ハイフンなど）を「残す／捨てる」をフィールドごとに設定したい

#### 🛠 CONFIG例
```js
FIELDS_KEEP_SYMBOLS: ['POSTAL'],       // 許容記号を残す
FIELDS_REMOVE_SYMBOLS: ['TELNO'],      // 記号を全部消す
ALLOWED_SYMBOLS: '-_.@/'               // 残す記号
```

### 🔹 auto-number-on-save.js
保存時に「日付＋接頭辞＋連番」で自動採番

#### 📌 使い所
- 見積番号・伝票番号・受注番号を自動生成
- 「YYYYMMDD-E001」形式の採番が欲しい
- 手動入力を防ぎたい

#### 🛠 CONFIG例
```js
TARGET_FIELD: '見積番号',
DATE_PATTERN: 'yyyyMMdd',
DELIMITER: '-',
PREFIX: 'E',
SEQ_WIDTH: 3
```

### 🔹 dropdown-to-fields-autofill.js
ドロップダウン選択 → 複数フィールド自動入力

#### 📌 使い所
- プラン選択 → 説明／金額／納期 を自動で埋めたい
- カタログ情報のテンプレ化
- 選択肢ごとのテンプレ反映

#### 🛠 CONFIG例
```js
mapping: {
  'ライト': { 説明: 'ライトプラン', 金額: '30000' },
  'プレミアム': { 説明: '最上位プラン', 金額: '80000' }
},
overwrite: true
```

### 🔹 sidebar-closed.js
レコード画面のコメント／履歴サイドバーを自動で閉じる

#### 📌 使い所
- フォーム入力に集中してほしい
- “履歴を見るために勝手に開いてしまう” を防ぎたい
- 限られた画面スペースを広く使いたい

#### 🛠 CONFIG例
// 設定不要。デフォルトで全画面に適用される


### 🔹 label-navigator.js
フォームのラベル（項目名）から“ミニ目次”を生成するUI

#### 📌 使い所
- 長いフォームでスクロールが大変
- 「基本情報」→「詳細」などに即ジャンプしたい
- 編集画面でも迷いたくない

#### 🛠 CONFIG例
```js
items: [
  { text: '基本情報', level: 0 },
  { text: '顧客情報', level: 1 },
  { text: '詳細メモ', level: 0 }
],
panelHeight: '30vh',
openOnInit: true
```

### 🔹 progress-to-next-status.js
保存後にプロセス管理のステータスを自動で次に進める

#### 📌 使い所
- 自動承認
- 作業ステータスの漏れ防止
- 人手で押す必要のないフローを自動化

#### 🛠 CONFIG例
```js
trigger: 'app.record.create.submit.success',
current: '下書き',
next: '承認依頼'
```

### 🔹 subtable-lookup-selector.js
参照アプリから候補をボタン化 → クリックでサブテーブル行追加＋ルックアップ実行

#### 📌 使い所
- 家族、プラン、商品など「選択UI」化したい
- 候補をボタンにして直感的に選ばせたい
- ルックアップ取得まで一気通貫にしたい

#### 🛠 CONFIG例
```js
sourceAppId: 12,
sourceFilterField: '顧客ID',
sourceKeyField: '商品コード',
sourceLabelField: '商品名',

targetFilterField: '顧客ID',
spaceCode: 'BTN_AREA',

tableCode: '明細',
subtableSetField: '商品コード'
```


## 🔧 開発の考え方（作者メモ）
- コードは「小さく・依存ゼロ」にこだわる
- カスタマイズ初心者でも読めるようコメント多め
- 地味だけど“現場で効く”ものだけ収録
- すべて MIT ライセンス（商用OK / 改変OK）

## 📄 ライセンス
MIT License
自由に利用・改変・再配布していただけます。


## 👤 作者
河合祐斗（こん太ぱぱ）
- note: https://note.com/konta_papa
- Nest Rec: https://nestrec.com
- Qiita: https://qiita.com/NestRec
