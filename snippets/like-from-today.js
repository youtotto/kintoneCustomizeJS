// FROM_TODAY 風の簡易関数
function fromToday(n = 0, unit = 'DAYS') {
  const d = new Date();
  const m = new Date(d);
  if (unit === 'DAYS') m.setDate(d.getDate() + n);
  if (unit === 'MONTHS') m.setMonth(d.getMonth() + n);
  if (unit === 'YEARS') m.setFullYear(d.getFullYear() + n);
  const pad = (x) => String(x).padStart(2, '0');
  return `${m.getFullYear()}-${pad(m.getMonth()+1)}-${pad(m.getDate())}`;
}
