const fields = await kintone.app.getFields();
console.log(Object.keys(fields)); // 例: ["レコード番号","顧客名","テーブル",...]