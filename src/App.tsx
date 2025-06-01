import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import type { Item } from "./components/InputForm";
import ItemList from "./components/ItemList";
import AssetChart from "./components/AssetChart";
import CategoryPieChart from "./components/CategoryPieChart";
import "./App.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./Login";
import { useKakeiboItems } from "./hooks/useKakeiboItems";

function getYearMonth(date: string) {
  return date.slice(0, 7); // "YYYY-MM"
}
function getCurrentYearMonth() {
  return new Date().toISOString().slice(0, 7);
}

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentYearMonth());
  const [tab, setTab] = useState<"graph" | "list">("graph"); // タブの状態

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const userId = user ? user.uid : null;
  // Firebase用のカスタムフックからitems操作を取得
  const { items, addItem, updateItem, deleteItem } = useKakeiboItems(userId);

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

  // 月ごとのフィルタと集計
  const monthlyItems = items.filter(item => getYearMonth(item.date) === selectedMonth);
  const monthlyIncome = monthlyItems.filter(item => item.type === "収入").reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpense = monthlyItems.filter(item => item.type === "支出").reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = items.filter(item => item.type === "収入").reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = items.filter(item => item.type === "支出").reduce((sum, item) => sum + item.amount, 0);
  const netAsset = totalIncome - totalExpense;

  const yearMonthList = Array.from(
    new Set(items.map(item => getYearMonth(item.date)))
  ).sort((a, b) => b.localeCompare(a));

  // 未ログインならログイン画面
  if (!user) {
    return <Login user={null} />;
  }

  // ログイン時の家計簿アプリUI
  return (
    <div className="container">
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
                  <span className={netAsset >= 0 ? "pos" : "neg"}>￥{netAsset.toLocaleString()}</span>
                </div>
              </div>
              <div className="summary-card modern-card monthly">
                <div className="label">
                  集計月
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="month-select"
                  >
                    {yearMonthList.length === 0 && (
                      <option value={getCurrentYearMonth()}>{getCurrentYearMonth()}</option>
                    )}
                    {yearMonthList.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="monthly-details">
                  <div><span>収入</span><span className="income">￥{monthlyIncome.toLocaleString()}</span></div>
                  <div><span>支出</span><span className="expense">￥{monthlyExpense.toLocaleString()}</span></div>
                  <div><span>差額</span><span className={monthlyIncome - monthlyExpense >= 0 ? "pos" : "neg"}>￥{(monthlyIncome - monthlyExpense).toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="input-form-area">
              <InputForm
                onAdd={handleAddItem}
                onUpdate={handleUpdateItem}
                editItem={editItem}
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
        </>
      )}
    </div>
  );
};

export default App;