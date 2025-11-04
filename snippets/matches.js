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