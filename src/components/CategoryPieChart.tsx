import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaRegSmileBeam, FaRegMoneyBillAlt } from "react-icons/fa"; // アイコン追加
import type { Item } from "./InputForm";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

type Props = {
  items: Item[];
  type: "支出" | "収入";
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#fa709a",
  "#e2e2e2",
];

function getCategoryData(items: Item[], type: "支出" | "収入") {
  const map: Record<string, number> = {};
  items
    .filter((item) => item.type === type)
    .forEach((item) => {
      map[item.category] = (map[item.category] || 0) + item.amount;
    });
  return Object.entries(map).map(([category, value]) => ({
    name: category,
    value,
  }));
}

const CategoryPieChart: React.FC<Props> = ({ items, type }) => {
  const [mode, setMode] = useState<"pie" | "bar">("pie");
  const data = getCategoryData(items, type);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2em", color: "#888" }}>
        {type === "支出" ? (
          <FaRegSmileBeam size={48} />
        ) : (
          <FaRegMoneyBillAlt size={48} />
        )}
        <div style={{ marginTop: "1em", fontSize: "1.1em" }}>
          {type === "支出" ? (
            <>
              支出データがありません
              <br />
              お財布にやさしい日が続いていますね！
            </>
          ) : (
            <>
              収入データがありません
              <br />
              まずは収入を登録してみましょう！
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: 8 }}>
        <button
          onClick={() => setMode(mode === "pie" ? "bar" : "pie")}
          style={{
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {mode === "pie" ? "棒グラフで見る" : "円グラフで見る"}
        </button>
      </div>
      {mode === "pie" ? (
        <div
          style={{
            width: "100%",
            height: 300,
            marginBottom: "1em",
            background: "#fff",
            borderRadius: "8px",
            padding: "1em",
          }}
        >
          <h3 style={{ margin: "0 0 0.5em 0" }}>{type}カテゴリ別割合</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((_entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `￥${v}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <CategoryBarChart data={data} type={type} />
      )}
    </div>
  );
};

const CategoryBarChart: React.FC<{
  data: { name: string; value: number }[];
  type: "支出" | "収入";
}> = ({ data, type }) => (
  <div
    style={{
      width: "100%",
      height: 300,
      marginBottom: "1em",
      background: "#fff",
      borderRadius: "8px",
      padding: "1em",
    }}
  >
    <h3 style={{ margin: "0 0 0.5em 0" }}>{type}カテゴリ別金額（棒グラフ）</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(v: any) => `￥${v}`} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CategoryPieChart;
