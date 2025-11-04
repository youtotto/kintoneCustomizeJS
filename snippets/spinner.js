/* シンプルなスピナー: Spinner.show()で表示　.hide()で非表示 */
const Spinner = (() => {
    let node;
    return {
        show() {
            if (node) return;
            node = document.createElement('div');
            node.innerHTML = '<div style="padding:12px 16px;border:1px solid #999;border-radius:10px;background:#fff">Loading...</div>';
            node.style.cssText = 'position:fixed;inset:0;display:grid;place-items:center;background:rgba(255,255,255,.4);z-index:9998;';
            document.body.appendChild(node);
        },
        hide() { node?.remove(); node = null; }
    };
})();