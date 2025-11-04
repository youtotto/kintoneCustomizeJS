(function () {
    "use strict";

    // ---- 一覧で何かしたいとき ----
    kintone.events.on(['app.record.index.show', 'mobile.app.record.index.show'], (event) => {

        console.log('[index.show] viewType=', event.viewType, 'viewId=', event.viewId);

        return event;
    });


    // ---- 詳細画面で何かしたいとき ----
    kintone.events.on(['app.record.detail.show', 'mobile.app.record.detail.show'], (event) => {

        const rec = event.record;
        console.log('[detail.show] id=', rec.$id.value);

        return event;
    });

    // ---- 新規/編集で何かしたいとき ----
    kintone.events.on([
        'app.record.create.show', 'mobile.app.record.create.show',
        'app.record.edit.show', 'mobile.app.record.edit.show'
    ], (event) => {
        const rec = event.record;

        return event;
    });

})();
