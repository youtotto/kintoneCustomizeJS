(function () {
    "use strict";

    /* ======================================================
     * ✅ kintone レコード画面：フィールド値によるグループ表示制御
     * - 指定フィールドの「値」に応じて、表示するグループを切り替える
     * - すべての対象グループを一旦非表示にしてから、該当のみ表示
     * ====================================================== */

    // ======================================================
    // 🔧 CONFIG（設定はここだけ編集すればOK）
    // ======================================================
    const CONFIG = {
        // 実行対象の画面表示イベント
        EVENTS: [
            "app.record.detail.show",
            "app.record.create.show",
            "app.record.edit.show"
        ],

        // グループ切り替えの判定に使うフィールドコード
        SWITCH_FIELD_CODE: "switch_field",

        /**
         * フィールドの値 → 表示するグループコード
         * ※ 値は「選択肢の表示名」と完全一致させる
         */
        VALUE_GROUP_MAP: {
            "OPTION_A": "GROUP_A",
            "OPTION_B": "GROUP_B",
            "OPTION_C": "GROUP_C"
        },

        // 値が未入力・未定義の場合に表示するグループ（不要なら null）
        DEFAULT_GROUP: null
    };

    // ======================================================
    // 🧠 内部処理
    // ======================================================

    /**
     * 制御対象となる全グループコードを取得
     */
    function getAllGroups() {
        const set = new Set(Object.values(CONFIG.VALUE_GROUP_MAP));
        if (CONFIG.DEFAULT_GROUP) set.add(CONFIG.DEFAULT_GROUP);
        return Array.from(set);
    }

    /**
     * 全グループを非表示にする
     */
    function hideAllGroups() {
        getAllGroups().forEach((groupCode) => {
            try {
                kintone.app.record.setFieldShown(groupCode, false);
            } catch (e) {
                // グループ未存在などは無視
            }
        });
    }

    /**
     * 判定用フィールドの値を取得
     * - DROP_DOWN / RADIO_BUTTON : string
     * - CHECK_BOX               : string[] → 先頭を使用
     */
    function getSwitchValue(record) {
        const field = record?.[CONFIG.SWITCH_FIELD_CODE];
        if (!field) return "";

        const value = field.value;
        return Array.isArray(value) ? (value[0] || "") : (value || "");
    }

    /**
     * グループ表示制御を適用
     */
    function applyGroupVisibility(record) {
        // ① 全非表示
        hideAllGroups();

        // ② 表示対象グループを決定
        const value = getSwitchValue(record);
        const groupCode =
            CONFIG.VALUE_GROUP_MAP[value] || CONFIG.DEFAULT_GROUP;

        // ③ 該当グループのみ表示
        if (groupCode) {
            try {
                kintone.app.record.setFieldShown(groupCode, true);
            } catch (e) {
                // 無視
            }
        }
    }

    // ======================================================
    // 🚀 イベント登録
    // ======================================================

    // 画面表示時
    kintone.events.on(CONFIG.EVENTS, function (event) {
        applyGroupVisibility(event.record);
        return event;
    });

    // create / edit 時のフィールド変更追従
    kintone.events.on(
        [
            `app.record.create.change.${CONFIG.SWITCH_FIELD_CODE}`,
            `app.record.edit.change.${CONFIG.SWITCH_FIELD_CODE}`
        ],
        function (event) {
            applyGroupVisibility(event.record);
            return event;
        }
    );

})();
