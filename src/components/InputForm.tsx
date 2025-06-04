import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export type Item = {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: "支出" | "収入";
};

type Props = {
  onAdd: (item: Omit<Item, "id">) => void;
  onUpdate: (item: Item) => void;
  editItem: Item | null;
  categories: string[];
  onAddCategory: (cat: string) => void;
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 4,
  display: "block",
  color: "#333",
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 12,
  fontSize: 15,
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  background: "#4285F4",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 0",
  width: "100%",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  marginTop: 8,
  transition: "background 0.2s",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: "24px 20px",
  minWidth: 280,
  boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  alignItems: "stretch",
};

const InputForm: React.FC<Props> = ({
  onAdd,
  onUpdate,
  editItem,
  categories,
  onAddCategory,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"支出" | "収入">("支出");

  // モーダル用
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (editItem) {
      setDate(editItem.date);
      setCategory(editItem.category);
      setAmount(editItem.amount);
      setType(editItem.type);
    } else {
      setDate(today);
      setCategory("");
      setAmount(0);
      setType("支出");
    }
  }, [editItem, today]);

  // カテゴリ選択時
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__add__") {
      setShowModal(true);
    } else {
      setCategory(e.target.value);
    }
  };

  // モーダルでカテゴリ追加
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onAddCategory(trimmed);
      setCategory(trimmed);
    }
    setNewCategory("");
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category || !amount) return;
    if (editItem) {
      onUpdate({ ...editItem, date, category, amount, type });
    } else {
      onAdd({ date, category, amount, type });
    }
  };

  return (
    <div className="list-card">
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>カテゴリ</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          required
          style={inputStyle}
        >
          <option value="">カテゴリを選択</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__add__">+ 新しいカテゴリを追加</option>
        </select>

        <label style={labelStyle}>種別</label>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <label style={{ fontWeight: 500 }}>
            <input
              type="radio"
              value="支出"
              checked={type === "支出"}
              onChange={() => setType("支出")}
              style={{ marginRight: 4 }}
            />
            支出
          </label>
          <label style={{ fontWeight: 500 }}>
            <input
              type="radio"
              value="収入"
              checked={type === "収入"}
              onChange={() => setType("収入")}
              style={{ marginRight: 4 }}
            />
            収入
          </label>
        </div>

        <label style={labelStyle}>日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>金額</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="金額"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {editItem ? "更新" : "追加"}
        </button>
      </form>

      {/* カテゴリ追加モーダル */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              新しいカテゴリを追加
            </div>
            <form
              onSubmit={handleAddCategory}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="カテゴリ名"
                style={{ ...inputStyle, marginBottom: 0 }}
                autoFocus
                required
              />
              <button
                type="submit"
                style={{
                  background: "#4285F4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <FaPlus />
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 8,
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 8,
                padding: "6px 0",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
