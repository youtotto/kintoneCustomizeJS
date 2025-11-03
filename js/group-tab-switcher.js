(function () {
    "use strict";

    /* ======================================================
     * 🚀 kintone レコード画面 汎用グループ切り替えタブUI
     * - kintoneの「グループ」フィールドをタブとして扱い、切り替えを可能にする
     * - kintoneのスペースフィールド（推奨コード: TAB_MENU）が必要です
     * ====================================================== */

    // ====== 設定を1か所に集約 (CONFIG: カスタマイズポイント) ======
    const CONFIG = {
        // どのkintone画面表示イベントで処理を実行するか
        triggers: [
            'app.record.detail.show', // レコード詳細画面
            'app.record.create.show', // レコード新規作成画面
            'app.record.edit.show'    // レコード編集画面
            // モバイル版のイベントが必要な場合は、追加してください。
        ],

        // 🎨 タブボタンの共通スタイル
        baseStyle: {
            height: '30px',
            width: '',                      // 個別 width が無いときは空（自動幅）
            border: '1px solid #D3D3D3',
            fontSize: '12px',
            // CSSによる角丸（上辺のみ）でタブらしい見た目を実現
            borderRadius: '10px 10px 0 0',
            background: '',                 // 初期は defaultBg を適用
            marginRight: '6px',
            cursor: 'pointer'               // クリック可能なことを示す
        },

        // 🌈 配色パレット（アクティブタブの背景色に利用）
        palette: {
            gray: '#D3D3D3',
            pink: '#FFC0CB',
            wheat: '#F5DEB3',
            lemon: '#FFFACD',
            mint: '#9BF9CC',
            pale: '#AFEEEE',
            violet: '#DCC2FF'
            // 必要に応じてカラーコードとキー名を追加OK
        },

        // 🔘 初期背景色（非アクティブなタブ）
        defaultBg: 'gray', // CONFIG.palette のキー名、または直接カラーコード

        // 🆕 初期にアクティブにするタブ（0始まり）
        defaultIndex: 0,

        /**
         * 🔳 タブ定義（最重要カスタマイズポイント）
         * - label: タブに表示する文字
         * - width: px 指定（未指定なら自動幅）
         * - group: 表示/非表示を切り替える**「グループ」フィールドのフィールドコード**
         * - activeBg: palette のキー名、または直接カラーコード（アクティブ時の色）
         */
        tabs: [
            { label: 'Tab 1', width: 100, group: 'group01', activeBg: 'pink' },
            { label: 'Tab 2', width: 100, group: 'group02', activeBg: 'wheat' },
            { label: 'Tab 3', width: 100, group: 'group03', activeBg: 'lemon' },
            { label: 'Tab 4', width: 100, group: 'group04', activeBg: 'mint' },
            { label: 'Tab 5', width: 100, group: 'group05', activeBg: 'pale' },
            { label: 'Admin', width: 100, group: 'group06', activeBg: 'violet' },
        ]
    };

    // ====== 内部関数：グループの表示/非表示制御 ======

    /**
     * 定義された全てのグループフィールドを非表示にする
     */
    function hideAllGroups() {
        CONFIG.tabs.forEach(b => {
            try {
                // kintone.app.record.setFieldShown() でグループフィールドを非表示に
                kintone.app.record.setFieldShown(b.group, false);
            } catch (e) {
                // グループコードが存在しない場合のエラーを無視し、処理を継続
                // console.warn('[tab-ui] group not found:', b.group, e);
            }
        });
    }

    /**
     * 指定されたインデックスのタブをアクティブにし、対応するグループを表示する
     * @param {number} index アクティブにするタブのインデックス (0から始まる)
     * @param {HTMLElement[]} btnEls 作成された全てのタブボタン要素の配列
     */
    function applyActiveState(index, btnEls) {
        const active = CONFIG.tabs[index];
        if (!active) return; // 定義されていないインデックスは無視

        // デフォルト背景色をパレットから取得（または直接指定された値）
        const defaultBg = CONFIG.palette[CONFIG.defaultBg] || CONFIG.defaultBg || '#D3D3D3';

        // 1. 全てのボタンの背景をデフォルト色に戻す（非アクティブ化）
        btnEls.forEach(el => el.style.background = defaultBg);

        // 2. 全てのグループを非表示にする
        hideAllGroups();

        // 3. アクティブなタブの色を変更し、対応するグループを表示する
        const activeColor = CONFIG.palette[active.activeBg] || active.activeBg || defaultBg;
        
        // アクティブなボタンの色変更
        if (btnEls[index]) btnEls[index].style.background = activeColor;

        // 対応するグループを表示
        try {
            kintone.app.record.setFieldShown(active.group, true);
        } catch (e) {
            // console.warn('[tab-ui] failed to show group:', active.group, e);
        }
    }

    // ===============================================
    // 🚀 メイン処理
    // ===============================================

    // 設定された画面表示イベントにハンドラーを登録
    kintone.events.on(CONFIG.triggers, function (event) {

        // 1. タブボタンを描画するスペース要素を取得
        // フォームに配置された「スペース」フィールドのフィールドコードを 'TAB_MENU' と仮定
        const space = kintone.app.record.getSpaceElement('TAB_MENU');
        if (!space) return event; // スペース未配置なら処理を終了

        // 2. 二重描画防止チェック
        if (document.getElementById('tabButton')) return event;

        // 3. 初期状態として全てのグループを非表示にする
        hideAllGroups();

        // 4. ボタン描画準備
        const fragment = document.createDocumentFragment();
        const buttonElements = []; // 生成されたボタン要素を保持する配列

        // 5. タブボタンの生成と設定
        CONFIG.tabs.forEach((tabDef, i) => {
            const btn = document.createElement("button");
            buttonElements.push(btn); // 配列に追加

            // 二重描画防止用IDは最初のボタンにのみ付与
            if (i === 0) btn.id = "tabButton";

            // 共通スタイル + 個別スタイル（width）を適用
            Object.assign(btn.style, CONFIG.baseStyle);
            if (tabDef.width) btn.style.width = `${tabDef.width}px`;

            // 初期背景色（非アクティブ）を設定
            const defaultBg = CONFIG.palette[CONFIG.defaultBg] || '#D3D3D3';
            btn.style.background = defaultBg;

            // ラベルを設定
            btn.textContent = tabDef.label || `Tab ${i + 1}`;

            // クリックイベント：アクティブ状態とグループ表示/非表示を切り替える
            btn.addEventListener("click", () => applyActiveState(i, buttonElements));

            fragment.appendChild(btn); // DocumentFragment に追加
        });

        // 6. DOMへの反映
        space.appendChild(fragment);

        // 7. 初期表示タブをアクティブにする
        applyActiveState(CONFIG.defaultIndex, buttonElements);

        return event;
    });

})();