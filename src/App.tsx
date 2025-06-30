import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import type { Item } from "./components/InputForm";
import ItemList from "./components/ItemList";
import AssetChart from "./components/AssetChart";
import CategoryPieChart from "./components/CategoryPieChart";
import "./App.css";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import Login from "./Login";
import { useKakeiboItems } from "./hooks/useKakeiboItems";
import CsvExportButton from "./components/CsvExportButton";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  // deleteDoc,
} from "firebase/firestore";

function getYearMonth(date: string) {
  return date.slice(0, 7); // "YYYY-MM"
}
function getCurrentYearMonth() {
  return new Date().toISOString().slice(0, 7);
}

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getCurrentYearMonth()
  );
  const [tab, setTab] = useState<"graph" | "list">("graph");
  const [categories, setCategories] = useState<
    { name: string; sub: string[] }[]
  >([
    { name: "食費", sub: ["外食", "スーパー"] },
    { name: "交通", sub: ["電車", "バス"] },
    { name: "趣味", sub: ["映画", "ゲーム"] },
  ]);

  // Firebase認証
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  // カテゴリ一覧をFirestoreから取得
  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const cats = snapshot.docs.map(
        (doc) => doc.data() as { name: string; sub: string[] }
      );
      if (cats.length > 0) setCategories(cats);
    };
    fetchCategories();
  }, []);

  const userId = user ? user.uid : null;
  const { items, addItem, updateItem, deleteItem } = useKakeiboItems(userId);

  useEffect(() => {
    console.log("items:", items);
  }, [items]);

  // 追加・編集・削除イベント
  const handleAddItem = (item: Omit<Item, "id">) => {
    addItem(item);
  };
  const handleUpdateItem = (updated: Item) => {
    updateItem(updated);
    setEditItem(null);
  };
  const handleDeleteItem = (id: string) => {
    deleteItem(id);
  };
  const handleEditClick = (item: Item) => {
    setEditItem(item);
  };

  // 大カテゴリー追加（Firestoreにも保存）
  const handleAddCategory = async (newCategory: string) => {
    if (!categories.some((c) => c.name === newCategory)) {
      const newCat = { name: newCategory, sub: [] };
      setCategories([...categories, newCat]);
      await setDoc(doc(db, "categories", newCategory), newCat);
    }
  };

  // 小項目追加（Firestoreにも保存）
  const handleAddSubCategory = async (catName: string, newSub: string) => {
    setCategories(
      categories.map((cat) =>
        cat.name === catName && !cat.sub.includes(newSub)
          ? { ...cat, sub: [...cat.sub, newSub] }
          : cat
      )
    );
    const target = categories.find((cat) => cat.name === catName);
    if (target && !target.sub.includes(newSub)) {
      await updateDoc(doc(db, "categories", catName), {
        sub: [...target.sub, newSub],
      });
    }
  };

  // カテゴリー削除（Firestoreからも削除オプション付き）
  const handleDeleteCategory = async (catName: string) => {
    setCategories(categories.filter((c) => c.name !== catName));
    // Firestoreからも削除したい場合は
    // await deleteDoc(doc(db, "categories", catName));
  };

  // サブカテゴリー削除（Firestore更新オプション付き）
  const handleDeleteSubCategory = async (catName: string, subName: string) => {
    setCategories(
      categories.map((c) =>
        c.name === catName
          ? { ...c, sub: c.sub.filter((s) => s !== subName) }
          : c
      )
    );
    // Firestoreも更新したい場合は
    // await updateDoc(doc(db, "categories", catName), {
    //   sub: categories.find(c => c.name === catName)?.sub.filter(s => s !== subName) || []
    // });
  };

  // 月ごとのフィルタと集計
  const monthlyItems = items.filter(
    (item) => getYearMonth(item.date) === selectedMonth
  );
  const monthlyIncome = monthlyItems
    .filter((item) => item.type === "収入")
    .reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpense = monthlyItems
    .filter((item) => item.type === "支出")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = items
    .filter((item) => item.type === "収入")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = items
    .filter((item) => item.type === "支出")
    .reduce((sum, item) => sum + item.amount, 0);
  const netAsset = totalIncome - totalExpense;

  const yearMonthList = Array.from(
    new Set(items.map((item) => getYearMonth(item.date)))
  ).sort((a, b) => b.localeCompare(a));

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      alert("ログアウトできませんでした: " + (e as Error).message);
      console.error(e);
    }
  };

  // 未ログインならログイン画面
  if (!user) {
    return <Login user={null} />;
  }

  // ログイン時の家計簿アプリUI
  return (
    <div className="container">
      {/* ユーザー名とログアウトボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          margin: "16px 0",
        }}
      >
        <span style={{ fontWeight: 500 }}>{user.displayName} でログイン中</span>
        <button
          onClick={handleLogout}
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ログアウト
        </button>
      </div>
      <Header />
      {/* タブ切り替えボタン */}
      <div className="tab-bar">
        <button
          className={`tab-btn${tab === "graph" ? " selected" : ""}`}
          onClick={() => setTab("graph")}
          type="button"
        >
          グラフ
        </button>
        <button
          className={`tab-btn${tab === "list" ? " selected" : ""}`}
          onClick={() => setTab("list")}
          type="button"
        >
          リスト
        </button>
      </div>
      {/* タブ内容の切り替え */}
      {tab === "graph" && (
        <>
          <AssetChart items={items} />
          <CategoryPieChart items={items} type="支出" />
          <CategoryPieChart items={items} type="収入" />
        </>
      )}

      {tab === "list" && (
        <>
          <div className="list-tab-modern">
            <div className="summary-cards-row">
              <div className="summary-card modern-card asset">
                <div className="label">現在の総資産</div>
                <div className="value">
                  <span className={netAsset >= 0 ? "pos" : "neg"}>
                    ￥{netAsset.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="summary-card modern-card monthly">
                <div className="label">
                  集計月
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="month-select"
                  >
                    {yearMonthList.length === 0 && (
                      <option value={getCurrentYearMonth()}>
                        {getCurrentYearMonth()}
                      </option>
                    )}
                    {yearMonthList.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="monthly-details">
                  <div>
                    <span>収入</span>
                    <span className="income">
                      ￥{monthlyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span>支出</span>
                    <span className="expense">
                      ￥{monthlyExpense.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span>差額</span>
                    <span
                      className={
                        monthlyIncome - monthlyExpense >= 0 ? "pos" : "neg"
                      }
                    >
                      ￥{(monthlyIncome - monthlyExpense).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-form-area">
              <InputForm
                onAdd={handleAddItem}
                onUpdate={handleUpdateItem}
                editItem={editItem}
                categories={categories}
                onAddCategory={handleAddCategory}
                onAddSubCategory={handleAddSubCategory}
                onDeleteCategory={handleDeleteCategory}
                onDeleteSubCategory={handleDeleteSubCategory}
              />
            </div>
           

            <div className="item-list-area">
              <ItemList
                items={monthlyItems}
                onEdit={handleEditClick}
                onDelete={handleDeleteItem}
              />
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("本当に全ての履歴を削除しますか？")) {
                items.forEach((item) => deleteItem(item.id));
              }
            }}
            style={{
              marginBottom: "1em",
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.5em 1.2em",
            }}
          >
            全履歴を削除
          </button>
          <CsvExportButton items={items} />
        </>
      )}
    </div>
  );
};

export default App;
