// 件数だけ知りたい（重複チェック等）
async function countBy(app, condition) {
  const query = `${condition} limit 1`;
  const r = await API('/k/v1/records.json', 'GET', { app, query, totalCount: true });
  return Number(r.totalCount) || 0;
}