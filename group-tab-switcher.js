(function () {
  "use strict";

  // ====== 設定を1か所に集約 ======
  const CONFIG = {
    // どの画面でタブを出すか（詳細/新規/編集）
    triggers: [
      'app.record.detail.show',
      'app.record.create.show',
      'app.record.edit.show'
    ],

    // 見た目（共通）
    baseStyle: {
      height: '30px',
      width: '',                       // ← 個別 width が無いときは空＝自動
      border: '1px solid #D3D3D3',
      fontSize: '12px',
      borderRadius: '10px 10px 0 0',   // 角丸（上だけ丸いタブ風）
      background: '',                  // 初期は後で defaultBg を適用
      marginRight: '6px',
      cursor: 'pointer'
    },

    // 配色パレット（必要に応じて追加OK）
    palette: {
      gray: '#D3D3D3',
      pink: '#FFC0CB',
      wheat: '#F5DEB3',
      lemon: '#FFFACD',
      mint: '#9BF9CC',
      pale: '#AFEEEE',
      violet: '#DCC2FF'
    },

    // 初期背景色（非アクティブ）
    defaultBg: 'gray',

    // 初期にアクティブにするタブ（0始まり）
    defaultIndex: 0,

    /**
     * タブ定義（ラベル/幅/対象グループ/アクティブ色）
     * - label: タブに表示する文字（公開版では固有名詞にしない）
     * - width: px 指定（未指定なら自動幅）
     * - group: 表示/非表示を切り替える「グループ」フィールドのフィールドコード
     * - activeBg: palette のキー名
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

  // ====== 内部関数（CONFIGを使うだけ） ======
  function hideAllGroups() {
    CONFIG.tabs.forEach(b => {
      try {
        kintone.app.record.setFieldShown(b.group, false);
      } catch (e) {
        // 存在しないグループコードがあっても処理継続
        // console.warn('[tab-ui] group not found:', b.group, e);
      }
    });
  }

  function applyActiveState(index, btnEls) {
    const active = CONFIG.tabs[index];
    if (!active) return;

    const defaultBg = CONFIG.palette[CONFIG.defaultBg] || CONFIG.defaultBg || '#D3D3D3';

    // 背景を全てデフォルトに戻す
    btnEls.forEach(el => el.style.background = defaultBg);

    // グループを全て非表示に
    hideAllGroups();

    // アクティブだけ色変更＆グループ表示
    const color = CONFIG.palette[active.activeBg] || defaultBg;
    if (btnEls[index]) btnEls[index].style.background = color;

    try {
      kintone.app.record.setFieldShown(active.group, true);
    } catch (e) {
      // console.warn('[tab-ui] failed to show group:', active.group, e);
    }
  }

  kintone.events.on(CONFIG.triggers, function (event) {

    // タブボタンを描画するスペースのフィールド
    const space = kintone.app.record.getSpaceElement('TAB_MENU');
    if (!space) return; // スペース未配置なら何もしない

    if (document.getElementById('tabButton')) return; // 二重描画防止

    hideAllGroups();

    const fragment = document.createDocumentFragment();
    const buttonElements = [];

    CONFIG.tabs.forEach((tabDef, i) => {
      const btn = document.createElement("button");
      buttonElements.push(btn);

      // 二重描画防止用IDは先頭ボタンに付与
      if (i === 0) btn.id = "tabButton";

      // 共通スタイル + 個別スタイル
      Object.assign(btn.style, CONFIG.baseStyle);
      if (tabDef.width) btn.style.width = `${tabDef.width}px`;

      // 初期背景色（非アクティブ）
      const defaultBg = CONFIG.palette[CONFIG.defaultBg] || '#D3D3D3';
      btn.style.background = defaultBg;

      // ラベル（公開版は汎用名推奨）
      btn.textContent = tabDef.label || `Tab ${i + 1}`;

      // クリック：アクティブ切替
      btn.addEventListener("click", () => applyActiveState(i, buttonElements));

      fragment.appendChild(btn);
    });

    space.appendChild(fragment);

    // 初期表示タブ
    applyActiveState(CONFIG.defaultIndex, buttonElements);

    return event;
  });

})();