(function () {
  "use strict";

  /* ======================================================
   * 🚀 kintone 一覧画面 汎用ナビゲーションボタン（テンプレート）
   * - レコード一覧画面のヘッダースペースに、別の一覧や外部リンクへ遷移するボタンを設置する
   * - ボタンの追加/変更は CONFIG.buttons の配列に行を追加/修正するだけで可能です
   * ====================================================== */

  // ===============================================
  // ⚙️ 設定を1か所に集約 (CONFIG: カスタマイズポイント)
  // ===============================================
  const CONFIG = {
    // 🌈 ボタンの背景色パレット
    // button.bg にここのキーを指定するか、直接カラーコードを指定できます。
    COLORS: {
      overview: '#E7F0FF', // 淡いブルー (概要)
      ops: '#EDE9FE',      // 淡いパープル (業務)
      pricing: '#FFE8CC',  // 薄いオレンジ (料金/契約)
      kpi: '#D1FADF',      // 淡いグリーン (KPI)
      rules: '#E5E7EB',    // グレー (標準/ルール)
      product: '#CCFBF1',  // ティール (製品/サービス)
      request: '#FECACA',  // 薄いレッド (申請)
      efiling: '#BAE6FD',  // ライトブルー (電子手続)
      monthly: '#FDE68A'   // イエロー (月次)
    },

    // 🪶 ボタンを設置しない一覧の名称（部分一致でスキップ）
    // 例: 特定のシステムビューなど、ボタン表示が不要なビューを除外する
    skipViewName: "【システム】",

    // 🎨 ボタン共通スタイル (CSS in JS)
    baseStyle: {
      height: "48px",
      fontSize: "14px",
      border: "1px solid #D3D3D3",
      borderRadius: "5px",
      marginRight: "16px",
      // マウスホバー時のカーソルをポインターに変更
      cursor: "pointer",
    },

    // 🔳 各ボタン定義（最重要カスタマイズポイント）
    // viewId: 同じアプリ内の別一覧へ遷移
    // href: 外部URLへ遷移 (hrefがある場合、viewIdは無視される)
    buttons: [
      // { label: 表示名, viewId: 遷移先の一覧ID, width: 幅(px), bg: 背景色 }
      { label: "概要", viewId: 5758653, width: 60, bg: 'overview' }, // COLORS.overview を参照
      { label: "業務一覧", viewId: 5741508, width: 70, bg: 'ops' },
      { label: "料金/契約", viewId: 5758650, width: 80, bg: 'pricing' },
      { label: "KPI/生産性", viewId: 5757874, width: 90, bg: 'kpi' },
      { label: "標準/ルール", viewId: 5758648, width: 95, bg: 'rules' },
      { label: "製品/サービス", viewId: 5758646, width: 110, bg: 'product' },
      { label: "申請/延長", viewId: 5759549, width: 80, bg: 'request' },
      { label: "電子手続", viewId: 5758245, width: 75, bg: 'efiling' },
      { label: "月次チェック", viewId: 5771619, width: 110, bg: 'monthly' },
      // 外部リンクの例
      { label: "外部リンク", href: "https://example.com", width: 90, bg: "#9BF9CC" }
    ]
  };

  /**
   * kintoneの指定された一覧IDのURLを生成するヘルパー関数
   * @param {number} viewId 遷移先の一覧ID
   * @param {number} appId 現在のアプリID
   * @returns {string} kintone一覧のURL
   */
  const urlByView = (viewId, appId) => `${location.origin}/k/${appId}/?view=${viewId}`;

  
  // ===============================================
  // 🚀 メイン処理
  // ===============================================

  // 設定されたイベントにハンドラーを登録
  kintone.events.on("app.record.index.show", function (event) {

    // 1. スキップ対象のビュー名チェック
    if (event.viewName.includes(CONFIG.skipViewName)) return event;

    // 2. ボタンを設置するスペースの取得と二重描画防止チェック
    const space = kintone.app.getHeaderSpaceElement();
    // ヘッダースペースが存在しない、またはボタンが既に描画されている場合は処理を終了
    if (!space || document.getElementById("my_index_button")) return event;

    const appId = kintone.app.getId();
    // 効率的なDOM操作のため DocumentFragment を使用
    const fragment = document.createDocumentFragment();

    // 3. ボタンの生成と設定
    CONFIG.buttons.forEach((btnDef, i) => {
      const btn = document.createElement("button");

      // 🎨 スタイル設定
      // 二重描画防止用IDは最初のボタンにのみ付与
      if (i === 0) {
        btn.id = "my_index_button";
        // 最初のボタンのみ左側の余白を追加してレイアウトを整える
        btn.style.marginLeft = "24px";
        btn.style.marginBottom = "16px";
      }

      // 共通スタイル + 個別スタイル（width, background）を適用
      Object.assign(btn.style, CONFIG.baseStyle);
      if (btnDef.width) btn.style.width = `${btnDef.width}px`;

      // 背景色の適用 (CONFIG.COLORS のキーまたは直接指定されたカラーコード)
      const bgColor = CONFIG.COLORS[btnDef.bg] || btnDef.bg;
      if (bgColor) btn.style.backgroundColor = bgColor;

      btn.textContent = btnDef.label || ""; // ボタンラベルの設定

      // 🖱️ クリック動作定義（イベントリスナー）
      btn.addEventListener("click", () => {
        // viewId が設定されている場合はアプリ内の一覧へ遷移
        if (btnDef.viewId) {
          location.href = urlByView(btnDef.viewId, appId);
          // href が設定されている場合は外部リンクとして新しいウィンドウで開く
        } else if (btnDef.href) {
          window.open(btnDef.href, "_blank");
        }
      });

      fragment.appendChild(btn); // DocumentFragment にボタンを追加
    });

    // 4. DOMへの反映
    // DocumentFragment を一度の操作でヘッダースペースに追加
    space.appendChild(fragment);

    return event;
  });
})();