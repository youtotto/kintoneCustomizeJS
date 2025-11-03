(function () {
    "use strict";

    /* フィールドの表示非表示・入力不可 */

    // ====== 設定を1か所に集約 ======
    const CONFIG = {
        // どの画面でフィールドを非表示にするか（詳細/新規/編集）
        triggers: [
            'app.record.detail.show',
            'app.record.create.show',
            'app.record.edit.show'
        ],

        // 非表示にするフィールド「コード」
        hiddenFields: [
            'GRP_BASIC',   // 例：グループ
            'KOKCD',       // 例：文字列(1行)
        ],

        // 入力不可にするフィールド「コード」
        disabledFields: [
            'ADDR1',
            'ADDR2',
        ],
    };


    // ===============================================
    // 🚀 メイン処理
    // ===============================================

    // 設定されたイベントにハンドラーを登録
    kintone.events.on(CONFIG.triggers, function (event) {

        const record = event.record;

        // 繰り返し処理でフィールドを非表示にする
        CONFIG.hiddenFields.forEach((code) => {
            kintone.app.record.setFieldShown(code, false);
        });

        // 入力不可（create/edit 画面のみ意味がある）
        CONFIG.disabledFields.forEach((code) => {
            if (record[code]) record[code].disabled = true;
        });

        return event;
    });

})();