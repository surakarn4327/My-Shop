import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Default categories ────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  {
    id: "cat-1",
    name: "วัตถุดิบ",
    type: "expense",
    icon: "🛒",
    color: "#E67E22",
    isDefault: true,
  },
  {
    id: "cat-2",
    name: "ภาชนะ",
    type: "expense",
    icon: "🥡",
    color: "#3498DB",
    isDefault: true,
  },
  {
    id: "cat-3",
    name: "อุปกรณ์",
    type: "expense",
    icon: "🔧",
    color: "#9B59B6",
    isDefault: true,
  },
  {
    id: "cat-4",
    name: "ขายข้าว/อาหาร",
    type: "income",
    icon: "🍚",
    color: "#27AE60",
    isDefault: true,
  },
  {
    id: "cat-5",
    name: "เครื่องดื่ม",
    type: "income",
    icon: "🥤",
    color: "#16A085",
    isDefault: true,
  },
  {
    id: "cat-6",
    name: "อื่นๆ",
    type: "both",
    icon: "📝",
    color: "#7F8C8D",
    isDefault: true,
  },
];

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  // Seed defaults if collection empty
  const snap = await getDocs(collection(db, "categories"));
  if (snap.empty) {
    for (const cat of DEFAULT_CATEGORIES) {
      await setDoc(doc(db, "categories", cat.id), {
        ...cat,
        createdAt: serverTimestamp(),
      });
    }
    return DEFAULT_CATEGORIES;
  }
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
}

export async function addCategory({ name, type, icon, color }) {
  const ref = await addDoc(collection(db, "categories"), {
    name,
    type,
    icon,
    color,
    isDefault: false,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, name, type, icon, color, isDefault: false };
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, "categories", id));
}

// ── Transactions ──────────────────────────────────────────────────────────────

export async function getTransactions({ date, month } = {}) {
  let q;
  if (date) {
    q = query(
      collection(db, "transactions"),
      where("date", "==", date),
      orderBy("createdAt", "desc"),
    );
  } else if (month) {
    q = query(
      collection(db, "transactions"),
      where("month", "==", month),
      orderBy("createdAt", "desc"),
    );
  } else {
    q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addTransaction({
  type,
  amount,
  categoryId,
  categoryName,
  note,
  date,
}) {
  const month = date.slice(0, 7); // YYYY-MM
  const ref = await addDoc(collection(db, "transactions"), {
    type,
    amount,
    categoryId,
    categoryName,
    note: note || "",
    date,
    month,
    createdAt: serverTimestamp(),
  });
  return {
    id: ref.id,
    type,
    amount,
    categoryId,
    categoryName,
    note,
    date,
    month,
  };
}

export async function deleteTransaction(id) {
  await deleteDoc(doc(db, "transactions", id));
}

// ── Summary ───────────────────────────────────────────────────────────────────

export async function getSummary(month) {
  const txns = await getTransactions({ month });
  const totInc = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totExp = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // Group by category
  const catMap = {};
  txns.forEach((t) => {
    const key = `${t.type}__${t.categoryName}`;
    if (!catMap[key])
      catMap[key] = {
        type: t.type,
        categoryName: t.categoryName,
        total: 0,
        count: 0,
      };
    catMap[key].total += t.amount;
    catMap[key].count += 1;
  });

  return {
    totInc,
    totExp,
    byCategory: Object.values(catMap).sort((a, b) => b.total - a.total),
  };
}
