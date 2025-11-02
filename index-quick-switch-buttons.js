(function () {
  "use strict";

  /* ================================
   * 汎用ボタン版（テンプレート）
   * - 追加はCONFIG.buttonsへ行追加のみ
   * ================================ */
  // シンプルな色セット
  const COLORS = {
    overview: '#E7F0FF', // 淡いブルー
    ops: '#EDE9FE', // 淡いパープル
    pricing: '#FFE8CC', // 薄いオレンジ
    kpi: '#D1FADF', // 淡いグリーン
    rules: '#E5E7EB', // グレー
    product: '#CCFBF1', // ティール
    request: '#FECACA', // 薄いレッド
    efiling: '#BAE6FD', // ライトブルー
    monthly: '#FDE68A'  // イエロー
  };

  const CONFIG = {
    // ボタンを設置しない一覧の名称（例：システム用ビュー）
    skipViewName: "【システム】",

    // ボタン共通スタイル
    baseStyle: {
      height: "48px",
      fontSize: "14px",
      border: "1px solid #D3D3D3",
      borderRadius: "5px",
      marginRight: "16px"
    },

    // 各ボタン定義（※ viewId はご利用環境に合わせて維持/変更してください）
    buttons: [
      { label: "概要", viewId: 5758653, width: 60, bg: COLORS.overview },
      { label: "業務一覧", viewId: 5741508, width: 70, bg: COLORS.ops },
      { label: "料金/契約", viewId: 5758650, width: 80, bg: COLORS.pricing },
      { label: "KPI/生産性", viewId: 5757874, width: 90, bg: COLORS.kpi },
      { label: "標準/ルール", viewId: 5758648, width: 95, bg: COLORS.rules },
      { label: "製品/サービス", viewId: 5758646, width: 110, bg: COLORS.product },
      { label: "申請/延長", viewId: 5759549, width: 80, bg: COLORS.request },
      { label: "電子手続", viewId: 5758245, width: 75, bg: COLORS.efiling },
      { label: "月次チェック", viewId: 5771619, width: 110, bg: COLORS.monthly },
      // 例）{ label: "外部リンク", href: "https://example.com", width: 90, bg: "#9BF9CC" }
    ]
  };

  const urlByView = (viewId, appId) => `${location.origin}/k/${appId}/?view=${viewId}`;

  kintone.events.on("app.record.index.show", function (event) {
    if (event.viewName === CONFIG.skipViewName) return;

    const space = kintone.app.getHeaderSpaceElement();
    if (!space || document.getElementById("my_index_button")) return;

    const appId = kintone.app.getId();

    const fragment = document.createDocumentFragment();

    CONFIG.buttons.forEach((btnDef, i) => {
      const btn = document.createElement("button");

      // 二重描画防止用IDは先頭ボタンに付与
      if (i === 0) {
        btn.id = "my_index_button";
        btn.style.marginLeft = "24px";
        btn.style.marginBottom = "16px";
      }

      // 共通スタイル + 個別スタイル
      Object.assign(btn.style, CONFIG.baseStyle);
      if (btnDef.width) btn.style.width = `${btnDef.width}px`;
      if (btnDef.bg) btn.style.backgroundColor = btnDef.bg;

      btn.textContent = btnDef.label || "";

      // クリック動作（viewId優先。hrefがあれば外部リンクも可能）
      btn.addEventListener("click", () => {
        if (btnDef.viewId) {
          location.href = urlByView(btnDef.viewId, appId);
        } else if (btnDef.href) {
          window.open(btnDef.href, "_blank");
        }
      });

      fragment.appendChild(btn);
    });

    space.appendChild(fragment);
  });
})();
