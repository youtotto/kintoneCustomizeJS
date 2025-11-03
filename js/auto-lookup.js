(function () {
    'use strict';

    /* フィールドとサブテーブル内のルックアップ列を自動取得する */

    // ====== 設定を1か所に集約 ======
    const CONFIG = {
        triggers: [
            'app.record.create.show',
            'app.record.edit.show',
            'mobile.app.record.create.show',
            'mobile.app.record.edit.show',
        ],

        // 通常フィールド（キー）
        lookupFields: [
            '顧客名',
        ],

        // サブテーブルのルックアップ列（キー）
        // 例）{ table: '明細テーブル', column: '商品名' }
        subtableLookups: [
            { table: '明細テーブル', column: '商品名' },
        ],
    };

    kintone.events.on(CONFIG.triggers, (event) => {
        const rec = event.record;
        let changed = false;

        // --- 通常フィールド ---
        CONFIG.lookupFields.forEach((code) => {
            const f = rec[code];
            const hasKey = f && String(f.value ?? '') !== '';
            if (hasKey) {
                f.lookup = true;
                changed = true;
            }
        });

        // --- サブテーブル列 ---
        CONFIG.subtableLookups.forEach(({ table, column }) => {
            const tbl = rec[table];
            // 教育メモ：サブテーブル本体は { type:'SUBTABLE', value:[{id, value:{...}}] } の形
            if (!tbl || !Array.isArray(tbl.value)) return;

            tbl.value.forEach((row) => {
                const cell = row.value[column];
                const hasKey = cell && String(cell.value ?? '') !== '';
                if (hasKey) {
                    cell.lookup = true;
                    changed = true;
                }
            });
        });

        return event;
    });
})();