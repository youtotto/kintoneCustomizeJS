(function () {
  "use strict";

  /* ドロップダウン選択に応じて通常フィールドへ自動入力 */

  // ====== 設定を1か所に集約 ======
  const CONFIG = {
    // 監視イベント（表示＋変更）
    triggers: [
      'app.record.create.show',
      'app.record.edit.show',
      // 変更イベントは下で自動追加
    ],

    // 参照するドロップダウンのフィールドコード
    selectCode: 'テンプレ選択',

    // マッピング：selectの値 -> { フィールドコード: 入力値 or (rec)=>入力値 }
    // 例は “プラン” を選ぶと、説明/金額/納期を自動入力
    mapping: {
      'ライト':   { 説明: 'ライトプラン', 金額: '30000', 納期: '3' },
      'スタンダード': {
        説明: 'スタンダードプラン',
        金額: '50000',
        納期: (rec) => String(5), // 関数も可（rec = event.record）
      },
      'プレミアム': { 説明: 'プレミアムプラン', 金額: '80000', 納期: '7' },
    },

    // 上書き挙動
    overwrite: true,          // true: 常に上書き / false: 空欄のときのみセット
    clearWhenUnknown: false,  // true: 未定義の選択時に対象フィールドを空にする
    clearWhenEmpty:   true,   // true: ドロップダウン未選択(null/空)なら対象を空にする

    // 画面表示時、すでに選択済みなら即反映する
    autorunOnShow: true,
  };

  // ====== 内部ユーティリティ ======
  const CHANGE_CREATE = `app.record.create.change.${CONFIG.selectCode}`;
  const CHANGE_EDIT   = `app.record.edit.change.${CONFIG.selectCode}`;
  CONFIG.triggers.push(CHANGE_CREATE, CHANGE_EDIT);

  function setFieldValue(field, next, overwrite) {
    if (!field) return;
    if (!overwrite && field.value) return; // 空欄のみ許可
    field.value = next ?? '';
  }

  function applyMapping(event) {
    const rec = event.record;
    const sel = rec?.[CONFIG.selectCode]?.value || '';
    const rules = CONFIG.mapping[sel];

    // クリア条件
    const needClear =
      (CONFIG.clearWhenEmpty && !sel) ||
      (CONFIG.clearWhenUnknown && !rules);

    // 対象フィールド集合（mappingの全キー union）
    const targetCodes = Array.from(
      new Set(
        Object.values(CONFIG.mapping).flatMap(obj => Object.keys(obj || {}))
      )
    );

    if (needClear) {
      targetCodes.forEach(code => setFieldValue(rec[code], '', true));
      return event;
    }

    if (!rules) return event;

    // 適用
    Object.entries(rules).forEach(([code, v]) => {
      const next = (typeof v === 'function') ? v(rec) : v;
      setFieldValue(rec[code], next, CONFIG.overwrite);
    });

    return event;
  }

  // ====== イベント配線 ======
  kintone.events.on(CONFIG.triggers, function (event) {
    if (event.type === 'app.record.create.show' || event.type === 'app.record.edit.show') {
      if (CONFIG.autorunOnShow) return applyMapping(event);
      return event;
    }
    // change: ドロップダウン変更時
    return applyMapping(event);
  });

})();
