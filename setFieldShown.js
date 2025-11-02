(function () {
    "use strict";

    // ====== 設定を1か所に集約 ======
    const CONFIG = {
        // どの画面でフィールドを非表示にするか（詳細/新規/編集）
        triggers: [
            'app.record.detail.show',
            'app.record.create.show',
            'app.record.edit.show'
        ],

        // フィールド「コード」を列挙
        fields: [
            'GRP_BASIC',   // 例：グループ
            'KOKCD',       // 例：文字列(1行)
            'TELNO1',      // 例：電話番号
        ],
    };

    kintone.events.on(CONFIG.triggers, function (event) {

        // 繰り返し処理でフィールドを非表示にする
        CONFIG.fields.forEach((code) => {
            kintone.app.record.setFieldShown(code, false);
        });

        return event;
    });

})();