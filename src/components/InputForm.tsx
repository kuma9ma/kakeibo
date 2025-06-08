import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export type Item = {
  id: string;
  date: string;
  category: string;
  subCategory: string;
  amount: number;
  type: "支出" | "収入";
  memo?: string; // ←追加
};

type Props = {
  onAdd: (item: Omit<Item, "id">) => void;
  onUpdate: (item: Item) => void;
  editItem: Item | null;
  categories: { name: string; sub: string[] }[];
  onAddCategory: (cat: string) => void;
  onAddSubCategory: (cat: string, sub: string) => void;
  onDeleteCategory: (cat: string) => void; // 追加
  onDeleteSubCategory: (cat: string, sub: string) => void; // 追加
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

const modalAddBtnStyle: React.CSSProperties = {
  background: "#4285F4",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  transition: "background 0.2s",
};

const modalCancelBtnStyle: React.CSSProperties = {
  marginTop: 8,
  background: "#eee",
  color: "#333",
  border: "none",
  borderRadius: 8,
  padding: "6px 0",
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
};

// アイコンボタン用スタイル
const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 6,
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
  fontSize: 16,
};

const iconEditStyle: React.CSSProperties = {
  color: "#4285F4",
};

const iconDeleteStyle: React.CSSProperties = {
  color: "#e53935",
  marginLeft: 2,
};

const InputForm: React.FC<Props> = ({
  onAdd,
  onUpdate,
  editItem,
  categories,
  onAddCategory,
  onAddSubCategory,
  onDeleteCategory,
  onDeleteSubCategory,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [amount, setAmount] = useState<number | "">(""); // 初期値を空文字に
  const [type, setType] = useState<"支出" | "収入">("支出");
  const [memo, setMemo] = useState(""); // 追加

  // モーダル用
  const [showCatModal, setShowCatModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  // 編集・削除用のstateを追加
  const [editCatModal, setEditCatModal] = useState(false);
  const [editSubModal, setEditSubModal] = useState(false);
  const [catToEdit, setCatToEdit] = useState<string>("");
  const [subToEdit, setSubToEdit] = useState<string>("");
  const [editCatName, setEditCatName] = useState("");
  const [editSubName, setEditSubName] = useState("");

  useEffect(() => {
    if (editItem) {
      setDate(editItem.date);
      setCategory(editItem.category);
      setAmount(editItem.amount);
      setType(editItem.type);
      setMemo(editItem.memo || ""); // 追加
    } else {
      setDate(today);
      setCategory("");
      setAmount(""); // 追加・編集解除時も空欄に
      setType("支出");
      setMemo(""); // 追加
    }
  }, [editItem, today]);

  // カテゴリ選択時
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__add__") {
      setShowCatModal(true);
    } else {
      setCategory(e.target.value);
      setSubCategory("");
    }
  };

  // サブカテゴリ選択時
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__add__") {
      setShowSubModal(true);
    } else {
      setSubCategory(e.target.value);
    }
  };

  // 大カテゴリ追加
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some((c) => c.name === trimmed)) {
      onAddCategory(trimmed);
      setCategory(trimmed);
      setSubCategory("");
    }
    setNewCategory("");
    setShowCatModal(false);
  };

  // 小項目追加
  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubCategory.trim();
    if (
      trimmed &&
      category &&
      !categories.find((c) => c.name === category)?.sub.includes(trimmed)
    ) {
      onAddSubCategory(category, trimmed);
      setSubCategory(trimmed);
    }
    setNewSubCategory("");
    setShowSubModal(false);
  };

  // 大カテゴリ編集・削除
  const handleEditCat = (name: string) => {
    setCatToEdit(name);
    setEditCatName(name);
    setEditCatModal(true);
  };
  const handleUpdateCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCatName.trim() || editCatName === catToEdit) {
      setEditCatModal(false);
      return;
    }
    // カテゴリ名変更
    onAddCategory(editCatName.trim());
    // 旧カテゴリ削除
    onDeleteCategory(catToEdit);
    // 選択状態も更新
    setCategory(editCatName.trim());
    setEditCatModal(false);
  };
  const handleDeleteCat = () => {
    onDeleteCategory(catToEdit);
    setCategory("");
    setEditCatModal(false);
  };

  // 小項目編集・削除
  const handleEditSub = (name: string) => {
    setSubToEdit(name);
    setEditSubName(name);
    setEditSubModal(true);
  };
  const handleUpdateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubName.trim() || editSubName === subToEdit) {
      setEditSubModal(false);
      return;
    }
    onAddSubCategory(category, editSubName.trim());
    onDeleteSubCategory(category, subToEdit);
    setSubCategory(editSubName.trim());
    setEditSubModal(false);
  };
  const handleDeleteSub = () => {
    onDeleteSubCategory(category, subToEdit);
    setSubCategory("");
    setEditSubModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category || !amount) return; // subCategoryの必須チェックを外す
    if (editItem) {
      onUpdate({
        ...editItem,
        date,
        category,
        subCategory,
        amount,
        type,
        memo,
      });
    } else {
      onAdd({ date, category, subCategory, amount, type, memo });
    }
  };

  return (
    <div className="list-card">
      <form onSubmit={handleSubmit}>
        {/* 大カテゴリ */}
        <label style={labelStyle}>カテゴリ</label>
        {/* 大カテゴリ選択欄 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <select
            value={category}
            onChange={handleCategoryChange}
            required
            style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          >
            <option value="">カテゴリを選択</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="__add__">+ 新しいカテゴリを追加</option>
          </select>
          {category && (
            <>
              <button
                type="button"
                onClick={() => handleEditCat(category)}
                style={iconBtnStyle}
                title="カテゴリ編集"
              >
                <FaEdit style={iconEditStyle} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatToEdit(category);
                  setEditCatModal(true);
                }}
                style={iconBtnStyle}
                title="カテゴリ削除"
              >
                <FaTrash style={iconDeleteStyle} />
              </button>
            </>
          )}
        </div>

        {/* 小項目（サブカテゴリ） */}
        {category && (
          <>
            <label style={labelStyle}>小項目</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              <select
                value={subCategory}
                onChange={handleSubCategoryChange}
                // required を削除
                style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              >
                <option value="">小項目を選択（空でもOK）</option>
                {(categories.find((c) => c.name === category)?.sub || []).map(
                  (sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )
                )}
                <option value="__add__">+ 新しい小項目を追加</option>
              </select>
              {subCategory && (
                <>
                  <button
                    type="button"
                    onClick={() => handleEditSub(subCategory)}
                    style={iconBtnStyle}
                    title="小項目編集"
                  >
                    <FaEdit style={iconEditStyle} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubToEdit(subCategory);
                      setEditSubModal(true);
                    }}
                    style={iconBtnStyle}
                    title="小項目削除"
                  >
                    <FaTrash style={iconDeleteStyle} />
                  </button>
                </>
              )}
            </div>
          </>
        )}

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
          value={amount === 0 ? "" : amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="金額"
          required
          style={inputStyle}
        />

        {/* メモ欄 追加 */}
        <label style={labelStyle}>メモ</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモ（任意）"
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {editItem ? "更新" : "追加"}
        </button>
      </form>

      {/* 大カテゴリ追加モーダル */}
      {showCatModal && (
        <div style={modalOverlayStyle} onClick={() => setShowCatModal(false)}>
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
              <button type="submit" style={modalAddBtnStyle}>
                <FaPlus />
              </button>
            </form>
            <button
              onClick={() => setShowCatModal(false)}
              style={modalCancelBtnStyle}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
      {/* 小項目追加モーダル */}
      {showSubModal && (
        <div style={modalOverlayStyle} onClick={() => setShowSubModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              新しい小項目を追加
            </div>
            <form
              onSubmit={handleAddSubCategory}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="小項目名"
                style={{ ...inputStyle, marginBottom: 0 }}
                autoFocus
                required
              />
              <button type="submit" style={modalAddBtnStyle}>
                <FaPlus />
              </button>
            </form>
            <button
              onClick={() => setShowSubModal(false)}
              style={modalCancelBtnStyle}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 大カテゴリ編集モーダル */}
      {editCatModal && (
        <div style={modalOverlayStyle} onClick={() => setEditCatModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              カテゴリ編集・削除
            </div>
            <form
              onSubmit={handleUpdateCat}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="text"
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
                placeholder="カテゴリ名"
                style={{ ...inputStyle, marginBottom: 0 }}
                autoFocus
                required
              />
              <button type="submit" style={modalAddBtnStyle}>
                保存
              </button>
            </form>
            <button
              onClick={handleDeleteCat}
              style={{ ...modalCancelBtnStyle, color: "#e53935" }}
            >
              このカテゴリを削除
            </button>
            <button
              onClick={() => setEditCatModal(false)}
              style={modalCancelBtnStyle}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 小項目編集モーダル */}
      {editSubModal && (
        <div style={modalOverlayStyle} onClick={() => setEditSubModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              小項目編集・削除
            </div>
            <form
              onSubmit={handleUpdateSub}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="text"
                value={editSubName}
                onChange={(e) => setEditSubName(e.target.value)}
                placeholder="小項目名"
                style={{ ...inputStyle, marginBottom: 0 }}
                autoFocus
                required
              />
              <button type="submit" style={modalAddBtnStyle}>
                保存
              </button>
            </form>
            <button
              onClick={handleDeleteSub}
              style={{ ...modalCancelBtnStyle, color: "#e53935" }}
            >
              この小項目を削除
            </button>
            <button
              onClick={() => setEditSubModal(false)}
              style={modalCancelBtnStyle}
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

/* --- 追加でレスポンシブ対応を強化したい場合はCSSファイルに以下を追加してください ---
@media (max-width: 600px) {
  .list-card select, .list-card input[type="text"], .list-card input[type="number"], .list-card input[type="date"] {
    font-size: 15px;
    padding: 8px 6px;
  }
  .list-card {
    padding: 16px 6px;
  }
}
*/
