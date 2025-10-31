(function () {
  "use strict";

  /* ================================
   * 汎用ボタン版（テンプレート）
   * - 追加はCONFIG.buttonsへ行追加のみ
   * ================================ */
  const CONFIG = {
    // 処理を行いたくない一覧の名称（例：システム用ビュー）
    skipViewName: "【システム】",

    // ボタン共通スタイル
    baseStyle: {
      height: "30px",
      fontSize: "12px",
      border: "1px solid #D3D3D3",
      borderRadius: "5px",
      marginRight: "5px"
    },

    // 各ボタン定義（※ viewId はご利用環境に合わせて維持/変更してください）
    buttons: [
      { label: "概要", viewId: 5758653, width: 60, bg: "#FFC0CB" },
      { label: "業務一覧", viewId: 5741508, width: 70, bg: "#F5DEB3" },
      { label: "料金/契約", viewId: 5758650, width: 80, bg: "#FFFACD" },
      { label: "KPI/生産性", viewId: 5757874, width: 90, bg: "#9BF9CC" },
      { label: "標準/ルール", viewId: 5758648, width: 95, bg: "#AFEEEE" },
      { label: "製品/サービス", viewId: 5758646, width: 110, bg: "#DCC2FF" },
      { label: "申請/延長", viewId: 5759549, width: 80, bg: "#FFC0CB" },
      { label: "電子手続", viewId: 5758245, width: 75, bg: "#F5DEB3" },
      { label: "月次チェック", viewId: 5771619, width: 95, bg: "#FFFACD" },
      // 例）{ label: "外部リンク", href: "https://example.com", width: 90, bg: "#9BF9CC" }
    ]
  };

  kintone.events.on("app.record.index.show", function (event) {
    if (event.viewName === CONFIG.skipViewName) return;

    const space = kintone.app.getHeaderSpaceElement();
    if (!space || document.getElementById("my_index_button")) return;

    const appId = kintone.app.getId();
    const urlByView = (viewId) => `${location.origin}/k/${appId}/?view=${viewId}`;

    const fragment = document.createDocumentFragment();

    CONFIG.buttons.forEach((btnDef, i) => {
      const btn = document.createElement("button");

      // 二重描画防止用IDは先頭ボタンに付与
      if (i === 0) {
        btn.id = "my_index_button";
        btn.style.marginLeft = "20px";
        btn.style.marginBottom = "5px";
      }

      // 共通スタイル + 個別スタイル
      Object.assign(btn.style, CONFIG.baseStyle);
      if (btnDef.width) btn.style.width = `${btnDef.width}px`;
      if (btnDef.bg) btn.style.backgroundColor = btnDef.bg;

      btn.textContent = btnDef.label || "";

      // クリック動作（viewId優先。hrefがあれば外部リンクも可能）
      btn.addEventListener("click", () => {
        if (btnDef.viewId) {
          location.href = urlByView(btnDef.viewId);
        } else if (btnDef.href) {
          window.open(btnDef.href, "_blank");
        }
      });

      fragment.appendChild(btn);
    });

    space.appendChild(fragment);
  });
})();
