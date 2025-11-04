// 電話番号正規化（半角化・ハイフン除去）
function normalizePhone(s) {
  if (!s) return '';
  const z2h = String(s).replace(/[！-～]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  return z2h.replace(/[^\d]/g, ''); // 数字のみ
}