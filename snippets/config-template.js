// CONFIG雛形
const CONFIG = {
  LOOKUPS: ['顧客', '住所'],        // 自動取得したいルックアップコード
  TAB_BY_GROUP: true,               // GRP_からタブ化する
  HIDE_ON_TAB: {                    // タブ毎にフィールド出し分け（任意）
    '基本情報': ['内部メモ', '隠しID'],
    '履歴':     ['社内評価']
  }
};