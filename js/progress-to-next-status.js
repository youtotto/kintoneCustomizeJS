(function () {
  'use strict';

  /** =======================
   * CONFIG（ここだけ編集）
   * ======================= */
  const CONFIG = {
    trigger: 'app.record.create.submit.success', // 実行タイミング
    current: '下書き',   // 現在ステータス
    next: '承認依頼',   // 次に進めるアクション名
  };

  /** =======================
   * 実装（編集不要）
   * ======================= */
  kintone.events.on(CONFIG.trigger, async (ev) => {
    try {
      const app = kintone.app.getId();
      const id = ev.recordId;

      // ステータスチェック（STATUSまたはステータスフィールドを確認）
      const recordResp = await kintone.api(kintone.api.url('/k/v1/record', true), 'GET', { app, id });
      const rec = recordResp.record;
      const statusField = rec.STATUS?.value ?? rec['ステータス']?.value ?? '';

      if (CONFIG.current && CONFIG.current !== statusField) {
        console.log(`[AutoStatus] ステータス "${statusField}" は対象外のためスキップ`);
        return ev;
      }

      // ステータス遷移
      await kintone.api(kintone.api.url('/k/v1/record/status', true), 'PUT', {
        app, id, action: CONFIG.next
      });

      location.reload();
    } catch (e) {
      console.error(e);
      (window.__KUTIL__?.toast || alert)('ステータス遷移に失敗しました');
    }
    return ev;
  });

})();
