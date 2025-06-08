import React from "react";
import { FaRegClipboard, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import type { Item } from "./InputForm";

type Props = {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
};

const ItemList: React.FC<Props> = ({ items, onEdit, onDelete }) => (
  <div className="list-card">
    <div className="list-section-title">
      <FaWallet style={{ marginRight: "0.4em", color: "#0070f3" }} />
      履歴
    </div>
    <ul className="item-list-ul">
      {items.length === 0 ? (
        <div className="empty-list-message">
          <FaRegClipboard size={40} />
          <div style={{ marginTop: "1em" }}>
            まだ記録がありません
            <br />
            最初の家計簿をつけてみましょう！
          </div>
        </div>
      ) : (
        items.map((item) => (
          <li className="item-list-li" key={item.id}>
            <div className="item-list-info">
              <span className="item-date">{item.date}</span>
              <span className="item-category">{item.category}</span>
              <span
                className={`item-list-amount ${
                  item.type === "収入" ? "amount-income" : "amount-expense"
                }`}
              >
                {item.type === "収入" ? "+" : "-"}￥
                {item.amount.toLocaleString()}
              </span>
              <span className="item-list-type">
                {item.type === "収入" ? (
                  <FaMoneyBillWave
                    style={{ color: "#27ae60", marginRight: "0.2em" }}
                  />
                ) : null}
                {item.type}
              </span>
            </div>
            {item.memo && (
              <div
                className="item-memo"
                style={{ color: "#888", fontSize: 13, marginTop: 2 }}
              >
                📝 {item.memo}
              </div>
            )}
            <div className="item-actions">
              <button
                className="edit-btn"
                onClick={() => onEdit(item)}
                title="編集"
              >
                編集
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(item.id)}
                title="削除"
              >
                削除
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default ItemList;
