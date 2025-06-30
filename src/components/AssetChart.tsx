import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { FaRegChartBar } from "react-icons/fa";
import type { Item } from "./InputForm";

type Props = {
  items: Item[];
};

const getAssetHistory = (items: Item[]) => {
  // 日付昇順にソート
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  let asset = 0;
  const result: { date: string; asset: number }[] = [];
<<<<<<< HEAD
  // let lastDate = "";
=======
>>>>>>> ce896a5d0da8ab12684b6bf19e17722e28e85072
  for (const item of sorted) {
    asset += item.type === "収入" ? item.amount : -item.amount;
    // 同じ日付なら上書き（1日1点にする）
    if (result.length && result[result.length - 1].date === item.date) {
      result[result.length - 1].asset = asset;
    } else {
      result.push({ date: item.date, asset });
    }
<<<<<<< HEAD
    // lastDate = item.date;
=======
>>>>>>> ce896a5d0da8ab12684b6bf19e17722e28e85072
  }
  return result;
};

const AssetChart: React.FC<Props> = ({ items }) => {
  const data = getAssetHistory(items);

  if (data.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "2em", color: "#888" }}>
        <FaRegChartBar size={48} />
        <div style={{ marginTop: "1em", fontSize: "1.1em" }}>
          データがありません<br />
          さっそく家計簿をつけて資産の推移を見てみましょう！
        </div>
      </div>
    );

  return (
    <div style={{ width: "100%", height: 300, background: "#fff", borderRadius: "8px", marginBottom: "1em", padding: "1em" }}>
      <h3 style={{ margin: "0 0 0.5em 0" }}>資産推移グラフ</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value: any) => `￥${value}`} />
          <Line type="monotone" dataKey="asset" stroke="#0070f3" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;