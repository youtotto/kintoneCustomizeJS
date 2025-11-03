(function () {
    'use strict';

    /**
     * 保存時に指定フィールドを整形するJS
     * - 半角英数字へ統一（全角→半角）
     * - 記号（ハイフン等）を残す or すべて除去 をフィールド単位で選択
     *
     * 使い方：
     * 1) CONFIG を自分のアプリのフィールドコードに合わせて編集
     * 2) 残したい記号を ALLOWED_SYMBOLS に列挙（デフォルトはハイフン/アンダースコア/ドット/スラッシュ/@）
     */

    // ====== 設定を1か所に集約 ======
    const CONFIG = {

        triggers: [
            'app.record.create.submit',
            'app.record.edit.submit',
            'mobile.app.record.create.submit',
            'mobile.app.record.edit.submit',
        ],

        // 記号を残すフィールド（例：郵便番号・型番・メール等）
        FIELDS_KEEP_SYMBOLS: ['POSTAL', ''],

        // 記号を残さないフィールド（英数字のみ化）
        FIELDS_REMOVE_SYMBOLS: ['TELNO', ''],

        // 残してよい記号（FIELDS_KEEP_SYMBOLS にのみ適用）
        ALLOWED_SYMBOLS: '-_.@/',

    };

    // --- 全角英数・一部記号 → 半角化（英数は確実に半角へ）
    function toHalfAscii(s) {
        const str = String(s ?? '');
        // 全角英数記号（！～）→ 半角
        let out = str.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
        // 全角スペース→半角スペース、ダスト除去
        out = out.replace(/\u3000/g, ' ').trim();
        // よくある長音/ダッシュ類は半角ハイフンへ寄せる
        out = out.replace(/[ー―–—−]/g, '-');
        return out;
    }

    // 英数字と許可記号だけ残す
    function keepAlnumAndAllowed(s, allowed) {
        const re = new RegExp(`[^A-Za-z0-9${escapeForCharClass(allowed)}]`, 'g');
        return s.replace(re, '');
    }

    // 英数字のみ残す（記号は全部捨てる）
    function keepAlnumOnly(s) {
        return s.replace(/[^A-Za-z0-9]/g, '');
    }

    // 文字クラス用に記号をエスケープ
    function escapeForCharClass(chars) {
        return String(chars ?? '').replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }


    // ===============================================
    // 🚀 メイン処理
    // ===============================================

    // 設定されたイベントにハンドラーを登録
    kintone.events.on(CONFIG.triggers, (event) => {
        const rec = event.record;

        // 記号を残すグループ
        CONFIG.FIELDS_KEEP_SYMBOLS.forEach(code => {
            if (!rec[code]) return;
            const half = toHalfAscii(rec[code].value);
            rec[code].value = keepAlnumAndAllowed(half, CONFIG.ALLOWED_SYMBOLS);
        });

        // 記号を残さないグループ
        CONFIG.FIELDS_REMOVE_SYMBOLS.forEach(code => {
            if (!rec[code]) return;
            const half = toHalfAscii(rec[code].value);
            rec[code].value = keepAlnumOnly(half);
        });

        return event;
    });

})();
