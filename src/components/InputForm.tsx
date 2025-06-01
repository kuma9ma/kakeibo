import React, { useState, useEffect } from "react";

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
};

const InputForm: React.FC<Props> = ({ onAdd, onUpdate, editItem }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"支出" | "収入">("支出");

  // 編集時は既存値をセット
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category || !amount) return;
    if (editItem) {
      onUpdate({ ...editItem, date, category, amount, type });
    } else {
      onAdd({ date, category, amount, type });
    }
    // 入力欄リセットはuseEffectで
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div>
        <label>
          <input type="radio" value="支出" checked={type === "支出"} onChange={() => setType("支出")} />
          支出
        </label>
        <label style={{ marginLeft: "1em" }}>
          <input type="radio" value="収入" checked={type === "収入"} onChange={() => setType("収入")} />
          収入
        </label>
      </div>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="カテゴリ" required />
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="金額" required />
      <button type="submit">{editItem ? "更新" : "追加"}</button>
    </form>
  );
};

export default InputForm;