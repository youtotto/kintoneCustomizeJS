/* 基本ユーティリティ3つ */

// Kintone REST ショートカット
const API = (path, method, body) =>
  kintone.api(kintone.api.url(path, true), method, body);

// 文字列をKintoneクエリ用にエスケープ
const qesc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// ログ（本番は無効化しやすいトグル付き）
const LOG = { enabled: true, d: (...a) => LOG.enabled && console.log('[TK]', ...a) };
