// ルックアップ自動取得
function runAllLookups(record, lookupCodes = []) {
  return Promise.all(lookupCodes.map(code =>
    kintone.app.record.setFieldValue(code, record[code].value) // 値を“触る”ことで再取得トリガ
  ));
}
