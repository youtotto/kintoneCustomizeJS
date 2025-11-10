(function () {
  'use strict';

  /**
   * ラベル目次（完全一致のみ）
   * - CONFIG.items でラベル文字と階層レベルを指定
   */

  // ===== 設定 =====
  const CONFIG = {
    showOnDetail: true,
    showOnEdit: true,
    scrollOffset: 240, // スクロール位置補正(px)
    openOnInit: true, // ← 追加：初期表示でパネルを開く
    panelHeight: 30,
    items: [
      { text: '基本情報', level: 0 },
      { text: '顧客情報', level: 1 },
      { text: '案件情報', level: 1 },
      { text: '詳細メモ', level: 0 }
    ]
  };

  // ===== 最小スタイル =====
  const injectStyle = () => {
    if (document.getElementById('toc-mini-style')) return;
    const style = document.createElement('style');
    style.id = 'toc-mini-style';
    style.textContent = `
      .toc-btn {
        position: fixed; right: 16px; bottom: 16px;
        width: 96px; height: 40px; line-height: 40px;
        background: #007bff; color: #fff; text-align: center;
        border-radius: 8px; font-weight: 700; cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,.18); z-index: 2001; user-select: none;
      }
      .toc-panel {
        position: fixed; right: 16px; bottom: -60vh; /* 初期は隠す（実値はJSで上書き） */
        width: 240px; background: #fff;
        border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 20px;
        overflow-y: auto; box-shadow: 0 -6px 18px rgba(0,0,0,.18);
        transition: bottom .25s ease; z-index: 2000;
      }
      .toc-list { list-style: none; padding: 0; margin: 0; }
      .toc-list li { margin: 6px 0; }
      .toc-link { color: #007bff; text-decoration: none; cursor: pointer; }
    `;
    document.head.appendChild(style);
  };

  // ===== 完全一致でラベル要素を探す =====
  const LABEL_SELECTOR = '.control-label-field-gaia';
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

  function findLabelByTextExact(text) {
    const target = norm(text);
    const els = Array.from(document.querySelectorAll(LABEL_SELECTOR));
    for (const el of els) {
      if (norm(el.textContent) === target) return el;
    }
    return null;
  }

  function createAnchor(id) {
    const a = document.createElement('a');
    a.id = id;
    a.style.cssText = 'display:inline-block;height:1px;margin-top:-200px;visibility:hidden;';
    return a;
  }

  // ===== 目次描画 =====
  function renderToc() {
    // 再描画対策：既存UIを除去
    document.getElementById('toc-mini-panel')?.remove();
    document.getElementById('toc-mini-btn')?.remove();

    const entries = [];
    CONFIG.items.forEach((item, idx) => {
      const labelEl = findLabelByTextExact(item.text);
      if (!labelEl) return;

      const anchorId = `tocmini-${idx}`;
      if (!document.getElementById(anchorId)) {
        labelEl.appendChild(createAnchor(anchorId));
      }
      entries.push({ title: item.text, id: anchorId, level: item.level || 0 });
    });

    if (!entries.length) return;

    // ボタン
    const btn = document.createElement('div');
    btn.id = 'toc-mini-btn';
    btn.className = 'toc-btn';
    btn.textContent = '目次';

    // パネル
    const panel = document.createElement('div');
    panel.id = 'toc-mini-panel';
    panel.className = 'toc-panel';
    panel.style.height = CONFIG.panelHeight; // ← 高さを反映

    // リスト
    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    entries.forEach(({ title, id, level }) => {
      const li = document.createElement('li');
      li.style.paddingLeft = `${level * 18}px`;

      const a = document.createElement('a');
      a.className = 'toc-link';
      a.textContent = title;
      a.href = `#${id}`;
      a.onclick = (e) => {
        e.preventDefault();
        const t = document.getElementById(id);
        if (!t) return;
        const rect = t.getBoundingClientRect();
        const top = rect.top + window.scrollY - CONFIG.scrollOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      };

      li.appendChild(a);
      ul.appendChild(li);
    });

    panel.appendChild(ul);

    // 開閉制御
    let open = false;
    const openPanel = () => { open = true; panel.style.bottom = '64px'; };
    const closePanel = () => { open = false; panel.style.bottom = `-${CONFIG.panelHeight}`; };
    const togglePanel = () => (open ? closePanel() : openPanel());

    btn.onclick = togglePanel;

    // 追加
    (document.getElementById('record-gaia') || document.body).append(btn, panel);

    // 初期表示で開く
    if (CONFIG.openOnInit) openPanel();
    else closePanel(); // 明示的に閉じ状態へ
  }

  // ===== kintoneイベント =====
  kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], (ev) => {
    injectStyle();

    if (ev.type === 'app.record.detail.show' && CONFIG.showOnDetail) renderToc();
    if (ev.type === 'app.record.edit.show' && CONFIG.showOnEdit) renderToc();
    return ev;
  });

})();