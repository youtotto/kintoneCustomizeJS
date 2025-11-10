(function () {
    "use strict";

    const CONFIG = {
        // 監視イベント（表示＋変更）
        triggers: [
            'app.record.create.show',
            'app.record.edit.show',
            'app.record.detail.show',
            // 変更イベントは下で自動追加
        ],
    }

    // 既定でサイドバー（コメント/履歴）を閉じる（PC画面）
    kintone.events.on(CONFIG.triggers, async (event) => {
        await kintone.app.record.showSideBar('CLOSED');
        return event;
    });

})();