// 非モーダル通知（右下で邪魔しないタイプ）
function toast(msg, ms = 2000) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = 'position:fixed;right:16px;bottom:16px;padding:10px 14px;border:1px solid #999;border-radius:8px;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.12);z-index:9999;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}