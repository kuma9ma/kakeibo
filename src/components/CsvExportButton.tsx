import React from "react";
import type { Item } from "./InputForm";

type Props = {
  items: Item[];
};

const CsvExportButton: React.FC<Props> = ({ items }) => {
  // items配列 → CSV文字列
  const toCsv = () => {
    if (items.length === 0) return "";

    // ヘッダー（日本語表示例）
    const header = "日付,カテゴリ,金額,タイプ,ID";
    const rows = items.map(item =>
      [
        item.date,
        item.category,
        item.amount,
        item.type,
        item.id,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    );
    return [header, ...rows].join("\r\n");
  };

  // UTF-8 BOM (Excel用)
  const bom = "\uFEFF";

  // CSVダウンロード用Blobを生成
  const csvData = bom + toCsv();
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  return (
    <a href={url} download="kakeibo.csv">
      <button disabled={items.length === 0}>CSV出力</button>
    </a>
  );
};

export default CsvExportButton;