import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, doc, setDoc, deleteDoc, onSnapshot
} from "firebase/firestore";
import type { Item } from "../components/InputForm";

export function useKakeiboItems(userId: string) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!userId) return;
    const col = collection(db, "users", userId, "items");
    // リアルタイム取得
    const unsub = onSnapshot(col, snapshot => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Item)));
    });
    return unsub;
  }, [userId]);

  // 追加
  const addItem = async (item: Omit<Item, "id">) => {
    const col = collection(db, "users", userId, "items");
    await addDoc(col, item);
  };

  // 更新
  const updateItem = async (item: Item) => {
    const d = doc(db, "users", userId, "items", item.id);
    await setDoc(d, item);
  };

  // 削除
  const deleteItem = async (id: string) => {
    const d = doc(db, "users", userId, "items", id);
    await deleteDoc(d);
  };

  return { items, addItem, updateItem, deleteItem };
}