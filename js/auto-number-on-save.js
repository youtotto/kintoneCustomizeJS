/**
 * auto-number-on-save.js
 * ----------------------------------------------------------------------
 * 目的：
 *   レコード作成時の保存前に、自動採番した番号を指定フィールドへ付与する。
 *
 * 注意（教育メモ）：
 *   - 本法は“簡易採番”です。多重同時保存が頻発する運用では競合の可能性があります。
 *    （厳格採番にするなら、採番専用アプリ／管理レコード方式 or サーバー側Webhookが安全）
 * 
 * Based on:
 * 　"Autofill number sample" (c) 2025 Cybozu, Inc.
 * 　Licensed under the MIT License.
 * 　Rewritten and extended for educational use.
 */

(function () {
    'use strict';

    // =========================
    // 1) 設定：ここだけ直せば使える
    // =========================
    const CONFIG = {
        TARGET_FIELD: '見積番号',  // 採番を書き込むフィールドコード
        DISABLE_ON_EDIT: true,     // 画面で手入力させない（表示時に disabled）

        // 採番の見た目： 例) 20250101-E001
        DATE_PATTERN: 'yyyyMMdd',  // 'yyyyMMdd' / 'yyyy-MM' など簡易パターン
        DELIMITER: '-',            // 日付とプレフィックスの区切り記号
        PREFIX: 'E',               // 例: 見積: E / 受注: O / 請求: B など
        SEQ_WIDTH: 3,              // 連番の桁数（ゼロ埋め）

        // イベント束（PC/モバイル両対応）
        SHOW_TRIGGERS: [
            'app.record.create.show',
            'app.record.edit.show',
            'mobile.app.record.create.show',
            'mobile.app.record.edit.show',
        ],
        SUBMIT_CREATE_TRIGGERS: [
            'app.record.create.submit',
            'mobile.app.record.create.submit',
        ],
    };

    // =========================
    // 2) 小さなユーティリティ
    // =========================

    // ゼロ埋め
    const zeroPad = (num, width) => String(num).padStart(width, '0');

    // 超簡易フォーマッタ（必要十分な置換のみ）
    function formatDate(date, pattern) {
        const yyyy = String(date.getFullYear());
        const MM = zeroPad(date.getMonth() + 1, 2);
        const dd = zeroPad(date.getDate(), 2);
        const HH = zeroPad(date.getHours(), 2);
        const mm = zeroPad(date.getMinutes(), 2);
        const ss = zeroPad(date.getSeconds(), 2);
        return pattern
            .replace('yyyy', yyyy)
            .replace('MM', MM)
            .replace('dd', dd)
            .replace('HH', HH)
            .replace('mm', mm)
            .replace('ss', ss);
    }

    // Kintone REST（GET）
    const API_GET = (path, params) =>
        kintone.api(kintone.api.url(path, true), 'GET', params);

    // =========================
    // 3) 画面表示時：手入力を禁止
    // =========================
    kintone.events.on(CONFIG.SHOW_TRIGGERS, (event) => {
        const rec = event.record;
        if (!rec[CONFIG.TARGET_FIELD]) return event;

        // 作成画面ではフィールドを空にしておく（再入力時の取り残し対策）
        if (event.type.indexOf('create.show') >= 0) {
            rec[CONFIG.TARGET_FIELD].value = '';
        }
        // 入力禁止（編集時も上書き不可にする）
        if (CONFIG.DISABLE_ON_EDIT) {
            rec[CONFIG.TARGET_FIELD].disabled = true;
        }
        return event;
    });

    // =========================
    // 4) 作成の保存前：採番して書き込む
    // =========================
    kintone.events.on(CONFIG.SUBMIT_CREATE_TRIGGERS, async (event) => {
        const rec = event.record;
        if (!rec[CONFIG.TARGET_FIELD]) return event;

        // --- a) 最新$id を取得して “簡易連番”を決める
        const params = {
            app: kintone.app.getId(),
            query: 'order by $id desc limit 1',
            fields: ['$id']
        };

        let seq = 1;
        try {
            const resp = await API_GET('/k/v1/records', params);
            if (resp.records && resp.records.length > 0) {
                const lastId = parseInt(resp.records[0].$id.value, 10);
                seq = isNaN(lastId) ? 1 : (lastId + 1);
            }
        } catch (e) {
            // 取得失敗時は 1 始まり（必要ならブロックに変更可）
            seq = 1;
        }

        // --- b) 採番の体裁を組み立てる
        const today = new Date();
        const dateStr = formatDate(today, CONFIG.DATE_PATTERN);
        const seqStr = zeroPad(seq, CONFIG.SEQ_WIDTH);
        const autoNo = `${dateStr}${CONFIG.DELIMITER}${CONFIG.PREFIX}${seqStr}`;

        // --- c) フィールドに書き込んで保存続行
        rec[CONFIG.TARGET_FIELD].value = autoNo;

        // 教育メモ：
        // - 保存前ハンドラでは event.record を変更して return でOK
        // - kintone.app.record.set() はハンドラ内で使うとエラーになる
        return event;
    });

})();
