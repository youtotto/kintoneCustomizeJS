(function () {
  'use strict';

  /**
   * Subtable Lookup Selector（汎用テンプレート）
   *
   * - 参照アプリのレコードをボタンとして表示
   * - ボタンをクリックするとサブテーブルに行追加
   * - 指定フィールドにキーをセットし、そのままルックアップ実行
   *
   * 使い方：
   *  1. 下記 CONFIG を自分のアプリに合わせて書き換える
   *  2. kintone のカスタマイズ (JS) に登録する（PC/モバイル両方を想定）
   */

  // ===== 設定（アプリごとに変更してください）=====
  const CONFIG = {
    // --- 参照アプリ（候補を取得する側）---
    sourceAppId: 0,              // 参照アプリID（数値）
    sourceFilterField: '',       // 参照アプリ側：絞り込みに使うフィールドコード
    sourceKeyField: '',          // 参照アプリ側：サブテーブルにセットするキー値のフィールドコード
    sourceLabelField: '',        // 参照アプリ側：ボタンに表示するラベルのフィールドコード

    // --- 現アプリ（絞り込みの起点となるフィールド）---
    targetFilterField: '',       // 現アプリ側：絞り込みに使うフィールドコード

    // --- UI表示 ---
    spaceCode: '',               // ボタンを表示するスペースフィールドコード
    uiTitle: '候補から選択して追加：', // スペース上部に表示するタイトル

    // --- サブテーブル ---
    tableCode: '',               // サブテーブルフィールドコード
    subtableSetField: ''         // サブテーブル内：キーをセットするフィールドコード
  };

  // ===== 内部キャッシュ：サブテーブル列 { code: type } =====
  let SUBCELL_TYPES = null;

  /**
   * サブテーブルの列情報（フィールドコード → type）を取得・キャッシュ
   */
  async function ensureSubcellTypes() {
    if (SUBCELL_TYPES) return SUBCELL_TYPES;

    const app = kintone.app.getId();
    const { properties } = await kintone.api(
      kintone.api.url('/k/v1/app/form/fields', true),
      'GET',
      { app }
    );

    const tbl = properties[CONFIG.tableCode];
    if (!tbl || tbl.type !== 'SUBTABLE') {
      throw new Error(`サブテーブル「${CONFIG.tableCode}」が見つかりません。CONFIG.tableCode を確認してください。`);
    }

    SUBCELL_TYPES = Object.fromEntries(
      Object.entries(tbl.fields).map(([code, def]) => [code, def.type])
    );

    if (!SUBCELL_TYPES[CONFIG.subtableSetField]) {
      throw new Error(`サブテーブル列「${CONFIG.subtableSetField}」が見つかりません。CONFIG.subtableSetField を確認してください。`);
    }

    return SUBCELL_TYPES;
  }

  /**
   * 参照アプリから候補レコードを取得
   * - 現アプリの targetFilterField の値で絞り込み
   * - ボタン表示：sourceLabelField
   * - サブテーブルにセット：sourceKeyField
   */
  async function fetchCandidates(filterValue) {
    if (!filterValue) return [];

    // 例：<sourceFilterField> = "値" order by 更新日時 desc
    const query = `${CONFIG.sourceFilterField} = "${String(filterValue).trim()}" order by 更新日時 desc`;

    const resp = await kintone.api(
      kintone.api.url('/k/v1/records', true),
      'GET',
      {
        app: CONFIG.sourceAppId,
        query,
        fields: [CONFIG.sourceFilterField, CONFIG.sourceKeyField, CONFIG.sourceLabelField]
      }
    );

    return (resp.records || [])
      .map(r => ({
        key: r[CONFIG.sourceKeyField]?.value || '',   // サブテーブルに入れる値
        label: r[CONFIG.sourceLabelField]?.value || '' // ボタンの表示ラベル
      }))
      .filter(x => x.key && x.label);
  }

  /**
   * サブテーブルのセル初期値（空値）を返す
   * ここでは単純に空文字を返す。
   * 必要に応じてフィールドタイプごとに分岐させても良い。
   */
  function emptyValueFor(/* type */) {
    return '';
  }

  /**
   * サブテーブルに行を追加し、指定フィールドへキーをセット → ルックアップ実行
   *
   * 動き：
   *  - サブテーブルが空：1行追加してキーセット
   *  - 既存1行目が「キー未入力」の場合：1行目に上書き
   *  - それ以外：末尾に新規行追加
   */
  async function addRowSetKeyAndLookup(keyValue) {
    const types = await ensureSubcellTypes();

    const ro1 = kintone.app.record.get();
    const rec = ro1.record;
    const tbl = rec[CONFIG.tableCode];

    if (!tbl) {
      alert(`サブテーブル「${CONFIG.tableCode}」が見つかりません。CONFIG.tableCode を確認してください。`);
      return;
    }

    const hasRow = Array.isArray(tbl.value) && tbl.value.length > 0;
    const firstIsEmpty = hasRow
      ? (tbl.value[0].value?.[CONFIG.subtableSetField]?.value ?? '') === ''
      : false;

    let targetIndex;

    if (!hasRow) {
      // 行が1つもない場合：サブテーブルに新規行を追加
      const rowValue = {};
      Object.entries(types).forEach(([code, type]) => {
        rowValue[code] = {
          value: code === CONFIG.subtableSetField ? String(keyValue) : emptyValueFor(type),
          type
        };
      });
      tbl.value.push({ value: rowValue });
      targetIndex = 0;
    } else if (firstIsEmpty) {
      // 1行目が空の場合：1行目を上書き
      const cell = tbl.value[0].value[CONFIG.subtableSetField];
      if (cell) {
        cell.value = String(keyValue);
        cell.type = types[CONFIG.subtableSetField] || cell.type || 'SINGLE_LINE_TEXT';
      } else {
        tbl.value[0].value[CONFIG.subtableSetField] = {
          value: String(keyValue),
          type: types[CONFIG.subtableSetField] || 'SINGLE_LINE_TEXT'
        };
      }
      targetIndex = 0;
    } else {
      // それ以外：末尾に1行追加
      const rowValue = {};
      Object.entries(types).forEach(([code, type]) => {
        rowValue[code] = {
          value: code === CONFIG.subtableSetField ? String(keyValue) : emptyValueFor(type),
          type
        };
      });
      tbl.value.push({ value: rowValue });
      targetIndex = tbl.value.length - 1;
    }

    // 一旦レコード全体をセット
    kintone.app.record.set(ro1);

    // ===== ルックアップを実行 =====
    const ro2 = kintone.app.record.get();
    const targetCell = ro2.record[CONFIG.tableCode]
      .value[targetIndex].value[CONFIG.subtableSetField];

    // kintone標準のルックアップを走らせるフラグをON
    targetCell.lookup = true;
    kintone.app.record.set(ro2);
  }

  /**
   * スペースフィールドにボタン群を描画
   * - 現レコードの targetFilterField 値で参照アプリを絞り込み
   * - 候補ごとにボタンを作成
   */
  async function renderCandidateButtons(eventRecord) {
    const space = kintone.app.record.getSpaceElement(CONFIG.spaceCode);
    if (!space) return;

    // スペース初期化
    space.innerHTML = '';

    try {
      await ensureSubcellTypes();
    } catch (e) {
      space.textContent = e.message || 'サブテーブル構成の取得に失敗しました。';
      return;
    }

    const filterValue = eventRecord?.[CONFIG.targetFilterField]?.value || '';
    if (!filterValue) {
      space.textContent = '絞り込み用フィールドが未入力です。';
      return;
    }

    let candidates = [];
    try {
      candidates = await fetchCandidates(filterValue);
    } catch (e) {
      console.error(e);
      space.textContent = '参照アプリのデータ取得に失敗しました。';
      return;
    }

    if (!candidates.length) {
      space.textContent = '条件に一致する候補データがありません。';
      return;
    }

    // タイトル
    const title = document.createElement('div');
    title.style.cssText = 'font-weight:700;margin:4px 0 6px;';
    title.textContent = CONFIG.uiTitle || '候補から選択して追加：';
    space.appendChild(title);

    // ボタンのラッパー
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;align-items:center;';
    space.appendChild(wrap);

    // 候補ごとにボタンを生成
    candidates.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.cssText = 'padding:6px 10px;border-radius:8px;border:1px solid #ddd;cursor:pointer;';
      btn.addEventListener('click', () => addRowSetKeyAndLookup(key));
      wrap.appendChild(btn);
    });
  }

  // ===== イベント登録 =====

  // 新規・編集画面（PC / モバイル）表示時にボタン描画
  const SHOW_EVENTS = [
    'app.record.create.show', 'app.record.edit.show',
    'mobile.app.record.create.show', 'mobile.app.record.edit.show'
  ];
  kintone.events.on(SHOW_EVENTS, (ev) => {
    renderCandidateButtons(ev.record);
    return ev;
  });

  // 新規画面で targetFilterField が変更されたとき、ボタンを再描画
  const CHANGE_EVENTS_CREATE = [
    'app.record.create.change.' + CONFIG.targetFilterField,
    'mobile.app.record.create.change.' + CONFIG.targetFilterField
  ];
  kintone.events.on(CHANGE_EVENTS_CREATE, (ev) => {
    const space = kintone.app.record.getSpaceElement(CONFIG.spaceCode);
    if (!ev.record[CONFIG.targetFilterField]?.value) {
      if (space) space.innerHTML = '';
      return ev;
    }
    renderCandidateButtons(ev.record);
    return ev;
  });

})();
