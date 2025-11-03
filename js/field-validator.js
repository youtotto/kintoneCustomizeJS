(function () {
    "use strict";

    // ===============================================
    // ⚙️ 設定を1か所に集約 (CONFIG: カスタマイズポイント)
    // ===============================================
    const CONFIG = {
        // どの画面/どのタイミングで処理を実行するか（レコード保存前イベント）
        triggers: [
            'app.record.create.submit', // レコード新規作成時の保存実行前
            'app.record.edit.submit',   // レコード編集時の保存実行前
            // モバイル版のイベントが必要な場合は、コメントを解除して追加してください。
            // 'mobile.app.record.create.submit',
            // 'mobile.app.record.edit.submit',
        ],

        // 個別の条件設定で conditionMode の指定がない場合のデフォルト結合モード
        // 'and': 全ての条件が真の場合にエラーとする
        // 'or': いずれかの条件が真の場合にエラーとする
        defaultConditionMode: 'and',

        // ⚠️ エラーチェック（バリデーション）の対象となるフィールドと条件
        // 条件が一致した場合（isMatched=true）に、そのフィールドにエラーメッセージが表示されます。
        validationFields: [
            {
                fieldCode: '顧客名', // 必須: バリデーション対象のフィールドコード
                // 条件の結合モード ('or' または 'and') - 指定がなければ defaultConditionMode が適用される
                // 例: 'or' の場合、conditions のいずれか一つでも一致すればエラー
                conditionMode: 'or',
                conditions: [
                    // 必須: バリデーションの条件リスト。フィールド値とこの値/演算子を比較。
                    // equals / notEquals / in / includes / matches / empty / nonempty
                    { op: 'equals', value: 'test' },  // フィールド値が 'test' に等しい
                    { op: 'equals', value: 'test2' }, // フィールド値が 'test2' に等しい
                    // 例) 他フィールド参照:
                    // { op: 'with', value: { field: 'ADDR', op: 'empty' } },
                ],
                // message を 'auto' にすると式を自動生成。未指定でも同じ。
                message: 'auto',
            },
            // 【拡張条件例】 他フィールドの値に基づく条件 ('with' オペレーターを使用)
            // {
            //     fieldCode: '担当者名', // 自分のフィールドコード
            //     conditionMode: 'and',
            //     conditions: [
            //         // 「顧客名カナ」が空 **ではない** 場合にエラーとする
            //         { op: 'with', value: { field: '顧客名カナ', op: 'nonempty' } },
            //     ],
            //     message: '顧客名カナが入力されている場合、このフィールドはエラーです。'
            // }
        ],

        // レコード全体のエラーメッセージを表示するか
        // true の場合、画面上部に全体エラーメッセージが表示される
        eventError: true,

    };

    /**
     * kintoneレコードオブジェクトからフィールド値を取得するヘルパー関数
     * @param {object} rec kintoneのレコードオブジェクト (event.record)
     * @param {string} code フィールドコード
     * @returns {any} フィールド値
     */
    function getVal(rec, code) {
        return rec[code]?.value;
    }

    // ===============================================
    // 🧮 比較演算子と値のマッチング処理
    // ===============================================

    /**
     * 演算子に基づいて値を比較する
     * @param {string} op 演算子 ('equals', 'notEquals', 'in', 'includes', 'matches', 'empty', 'nonempty')
     * @param {any} left 比較対象の左辺（フィールドの現在の値）
     * @param {any} right 比較対象の右辺（設定値）
     * @returns {boolean} 条件が一致したかどうか (true: 一致, false: 不一致)
     */
    function matches(op, left, right) {
        // null/undefined の場合は空文字列として扱う (includes, matchesのために)
        const leftStr = String(left ?? '');
        const rightStr = String(right ?? '');

        switch (op) {
            case 'equals': return leftStr === rightStr; // 等しい (文字列比較)
            case 'notEquals': return leftStr !== rightStr; // 等しくない (文字列比較)
            // in: right が配列の場合、left がその配列に含まれているか
            case 'in': return Array.isArray(right) && right.map(String).includes(leftStr);
            case 'includes': return leftStr.includes(rightStr); // left が right を部分文字列として含む
            // matches: right を正規表現として left がマッチするか
            case 'matches': return new RegExp(String(right)).test(leftStr);
            // empty: left が null, undefined, 空文字列, または空配列か
            case 'empty': return left == null || leftStr === '' || (Array.isArray(left) && left.length === 0);
            // nonempty: left が空ではないか (empty の否定)
            case 'nonempty': return !(left == null || leftStr === '' || (Array.isArray(left) && left.length === 0));
            default: return false; // 未知の演算子は false
        }
    }

    // ===============================================
    // 📝 式レンダリング（人間が読める日本語/数式風）
    // ===============================================

    // 演算子の表示ラベル定義
    const OP_LABEL = {
        equals: '＝',
        notEquals: '≠',
        in: '∈', // 集合に含まれる (Element of)
        includes: 'に「{v}」を含む',
        matches: 'が /{v}/ にマッチ',
        empty: 'が空',
        nonempty: 'が空ではない',
    };

    /**
     * 値をクォート（引用符で囲む）して文字列化するヘルパー関数
     * @param {any} v 値
     * @returns {string} クォートされた値（文字列の場合）またはそのままの文字列
     */
    function q(v) {
        // 文字列はシングルクォートで囲む、他はそのまま
        if (typeof v === 'string') return `'${v}'`;
        return String(v);
    }

    /**
     * 単一の条件を読みやすい形式でレンダリングする
     * @param {object} cond 単一の条件オブジェクト {op: ..., value: ...}
     * @param {string|null} selfCode 条件を評価する対象フィールドのコード
     * @returns {string} レンダリングされた条件式
     */
    function renderSingle(cond, selfCode = null) {
        // 'with' オペレーターの場合 (他のフィールドを参照する条件)
        if (cond.op === 'with') {
            const { field, op, value } = cond.value || {};
            // 例: ・ADDR が空
            if (op === 'empty' || op === 'nonempty') {
                return `・${field} ${OP_LABEL[op] ?? op}`;
            }
            // 例: ・ADDR ＝ '東京'
            const label = OP_LABEL[op] || op;
            if (label.includes('{v}')) return `${field} ${label.replace('{v}', String(value))}`;
            return `・${field} ${label} ${q(value)}`;
        }

        // 通常の条件 (selfCode のフィールドを参照)
        const op = cond.op;
        const label = OP_LABEL[op] || op;
        const code = selfCode ?? ''; // フィールドコード（例: 顧客名）

        if (op === 'empty' || op === 'nonempty') {
            // 例: ・顧客名 が空
            return `・${code} ${label}`.trim();
        }
        if (op === 'includes' || op === 'matches') {
            // 例: ・顧客名 に「abc」を含む / ・顧客名 が /abc/ にマッチ
            return `・${code} ${label.replace('{v}', String(cond.value))}`.trim();
        }
        if (op === 'in') {
            // 例: ・顧客名 ∈ ['A','B']
            const arr = Array.isArray(cond.value) ? cond.value.map(q).join(', ') : String(cond.value);
            return `・${code} ${label} [${arr}]`.trim();
        }
        // デフォルト（＝, ≠ など）
        return `・${code} ${label} ${q(cond.value)}`.trim();
    }

    /**
     * 複数の条件（conditions）を整形して表示する
     * @param {string} fieldCode 対象フィールドコード
     * @param {array} conds 条件オブジェクトの配列
     * @returns {string} 全ての条件を改行で結合した文字列
     */
    function renderFormula(fieldCode, conds) {
        if (!conds?.length) return `${fieldCode} (条件未設定)`;
        const joiner = `\n`; // 条件間は改行で区切る
        const parts = conds.map(c => renderSingle(c, fieldCode));
        // 例: 
        // ・顧客名 ＝ 'test'
        // ・顧客名 ＝ 'test2'
        return `${parts.join(joiner)}`;
    }

    // ===============================================
    // ✅ 条件評価
    // ===============================================

    /**
     * 単一の条件を評価する
     * @param {object} rec kintoneのレコードオブジェクト (event.record)
     * @param {any} watchedValue 評価対象のフィールドの現在の値 (field.value)
     * @param {object} cond 単一の条件オブジェクト
     * @returns {boolean} 条件が一致したかどうか (true: 一致, false: 不一致)
     */
    function evalCondition(rec, watchedValue, cond) {
        // 'with' オペレーターの場合 (他のフィールドを参照)
        if (cond.op === 'with') {
            const { field, op, value } = cond.value || {};
            // 他フィールドの現在値を取得して比較
            return matches(op, getVal(rec, field), value);
        }
        // 通常の条件 (自身のフィールドを参照)
        return matches(cond.op, watchedValue, cond.value);
    }

    // ===============================================
    // 🚀 メイン処理
    // ===============================================

    // 設定されたイベント（保存実行前）にハンドラーを登録
    kintone.events.on(CONFIG.triggers, function (event) {

        const record = event.record;
        let hasError = false; // エラーが発生したかどうか
        const errs = [];      // エラーが発生したフィールドコードのリスト

        // 設定されたバリデーションルールを一つずつ処理
        CONFIG.validationFields.forEach((rule) => {
            const code = rule.fieldCode;
            const field = record[code];

            // レコードにフィールドが存在しない場合はスキップ (例えば、非表示フィールドなど)
            if (!field) return;

            const current = field.value; // 現在のフィールド値
            const conds = rule.conditions || []; // 条件リスト

            // 結合モードの決定 (ルール指定 > デフォルト設定 > 'or')
            const mode = rule.conditionMode || CONFIG.defaultConditionMode || 'or';

            // 条件の評価
            // 'and': 全ての条件に evalCondition が true を返すか (every)
            // 'or': いずれかの条件に evalCondition が true を返すか (some)
            const isMatched = (mode === 'and')
                ? conds.every(c => evalCondition(record, current, c))
                : conds.some(c => evalCondition(record, current, c));

            // 条件に一致した場合 (isMatched = true) -> エラーとして処理
            if (isMatched) {
                // エラーメッセージの決定
                // message==='auto' または未指定の場合は条件式を自動生成
                const dynamicMsg =
                    (!rule.message || rule.message === 'auto')
                        ? `次の入力不可条件に一致しました（結合モード: ${mode.toUpperCase()}）：\n${renderFormula(code, conds)}`
                        : rule.message;

                // フィールドにエラーを設定
                record[code].error = dynamicMsg;
                errs.push(code);
                hasError = true;
            }
        });

        // 全体エラーの設定
        if (hasError && CONFIG.eventError) {
            // event.error にメッセージを設定すると、レコード保存を中止し、画面上部にエラー表示
            event.error = `入力エラーがあります（${errs.join(', ')}）。各フィールドのエラー内容をご確認ください。`;
        }

        // event オブジェクトを返す
        return event;
    });

})();