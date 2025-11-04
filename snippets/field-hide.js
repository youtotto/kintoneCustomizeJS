// フィールド表示/非表示
function setShown(codes = [], shown = true) {
  codes.forEach(code => kintone.app.record.setFieldShown(code, shown));
}