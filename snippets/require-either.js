// どちらか必須（A or B）
function requireEither(record, codeA, codeB, msg) {
  const a = (record[codeA]?.value ?? '').trim();
  const b = (record[codeB]?.value ?? '').trim();
  if (!a && !b) return msg || `${codeA}か${codeB}のどちらかは必須です。`;
  return '';
}
