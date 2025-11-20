# kintone Customization JS Templates

― 現場でそのまま使える、汎用カスタマイズスクリプト集 ―

kintone 開発の現場でよく必要になる  
「ちょうどいいスクリプト」だけを集めたテンプレート集です。

- 外部ライブラリなし
- 設定（CONFIG）を書き換えるだけ
- モジュール化済み
- 商用利用OK（MIT）

初心者〜上級者まで、そのまま or 改造して使えます。

---

## 📂 ディレクトリ構成

このリポジトリは、次の 3 種類の素材で構成されています。

| ディレクトリ  | 種別            | 役割                         |
| --------- | ------------- | -------------------------- |
| `js/`     | JS Templates  | そのまま使えるカスタマイズ JS 本体          |
| `snippets/` | Snippets      | JS テンプレを補助するユーティリティ／断片コード |
| `documents/` | Documents     | 要件定義・レビュー・改善のための Markdown ドキュメント |

詳しい使い方は、それぞれのディレクトリ内の README を参照してください。

- [js/README.md](./js/README.md)
- [snippets/README.md](./snippets/README.md)
- [documents/README.md](./documents/README.md)

---

## 🧩 Toolkit との連携

https://github.com/youtotto/kintone-app-toolkit

Tampermonkey スクリプト「kintone App Toolkit」からは、

- `js/` → Templates
- `snippets/` → Snippets
- `documents/` → Documents

として読み込まれます。

Toolkit を使うと、この 3 種をシームレスに扱いながら

**設計（Documents） → 開発（JS + Snippets） → デプロイ → 可視化**

までを 1 つの UX として回せます。

---

## 📄 ライセンス

MIT License  
自由に利用・改変・再配布していただけます。

## 👤 作者

河合祐斗（こん太ぱぱ）

- note: https://note.com/konta_papa  
- Nest Rec: https://nestrec.com  
- Qiita: https://qiita.com/NestRec
