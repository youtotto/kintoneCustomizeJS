// getAllRecords（カーソル自動フォールバック）
async function getAllRecords(app, fields = [], condition = '', orderBy = '') {
  // 100件以下→通常API、超えたらcursorへ自動切替
  const limit = 100;
  const base = { app, query: [condition, orderBy && `order by ${orderBy}`].filter(Boolean).join(' ') };
  if (fields?.length) base.fields = fields;

  // まずは軽く1ページ試行
  const r = await API('/k/v1/records.json', 'GET', { ...base, totalCount: true, limit });
  if ((Number(r.totalCount) || 0) <= limit) return r.records;

  // カーソル
  const c = await API('/k/v1/records/cursor.json', 'POST', { app, fields, query: base.query, size: 500 });
  const out = [];
  while (true) {
    const chunk = await API('/k/v1/records/cursor.json', 'GET', { id: c.id });
    out.push(...chunk.records);
    if (!chunk.next) break;
  }
  await API('/k/v1/records/cursor.json', 'DELETE', { id: c.id }).catch(() => {});
  return out;
}
