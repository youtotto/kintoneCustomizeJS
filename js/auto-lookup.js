(function () {
    "use strict";

    // ====== 設定を1か所に集約 ======
    const CONFIG = {
        // どの画面でフィールドを自動ルックアップするか（新規/編集）
        triggers: [
            'app.record.create.show',
            'app.record.edit.show'
        ],

        // ルックアップしたいフィールド「コード」
        lookupFields: [
            'lookupField',
        ],

    };

    kintone.events.on(CONFIG.triggers, function (event) {

        const record = event.record;

        // 繰り返し処理でルックアップ取得
        CONFIG.lookupFields.forEach((code) => {
            if (!record[`${code}`] || !record[`${code}`].value) return;
            record[`${code}`].lookup = true;
        });

        return event;
    });

})();