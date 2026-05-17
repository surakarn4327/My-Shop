import React, { useState, useEffect, useCallback } from "react";
import {
  getCategories, addCategory, deleteCategory,
  getTransactions, addTransaction, deleteTransaction,
  getSummary
} from "./db";
import "./App.css";

const ICONS = ["🍚","🛒","🥡","🔧","🥤","🍖","🧂","🔥","💡","🏠","👷","💰","📦","📝","🍜","🥗","🧃","🫙","🥄","🍳"];
const COLORS = ["#E67E22","#3498DB","#9B59B6","#27AE60","#E74C3C","#16A085","#F39C12","#2980B9","#8E44AD","#C0392B"];

function todayStr() { return new Date().toISOString().slice(0, 10); }
function currentMonth() { return new Date().toISOString().slice(0, 7); }
function fmt(n) { return Number(n).toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }

// ── Add Category Modal ───────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onSaved }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("both");
  const [icon, setIcon] = useState("📦");
  const [color, setColor] = useState("#E67E22");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    if (!name.trim()) { setErr("กรุณาใส่ชื่อหมวดหมู่"); return; }
    setLoading(true);
    try {
      await addCategory({ name: name.trim(), type, icon, color });
      onSaved(); onClose();
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-header"><span>เพิ่มหมวดหมู่ใหม่</span><button className="x-btn" onClick={onClose}>✕</button></div>
        {err && <div className="err-box">{err}</div>}
        <div className="fg"><label>ชื่อ</label><input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น ค่าแรง" /></div>
        <div className="fg">
          <label>ใช้สำหรับ</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="both">รายรับและรายจ่าย</option>
            <option value="income">รายรับเท่านั้น</option>
            <option value="expense">รายจ่ายเท่านั้น</option>
          </select>
        </div>
        <div className="fg">
          <label>ไอคอน</label>
          <div className="icon-grid">{ICONS.map(ic => <button key={ic} className={`ico-btn${icon===ic?" sel":""}`} onClick={() => setIcon(ic)}>{ic}</button>)}</div>
        </div>
        <div className="fg">
          <label>สี</label>
          <div className="color-row">{COLORS.map(c => <button key={c} className={`clr-btn${color===c?" sel":""}`} style={{background:c}} onClick={() => setColor(c)} />)}</div>
        </div>
        <button className="pri-btn" onClick={save} disabled={loading}>{loading ? "กำลังบันทึก..." : "+ เพิ่มหมวดหมู่"}</button>
      </div>
    </div>
  );
}

// ── Add Transaction Tab ──────────────────────────────────────────────────────
function AddTab({ type, categories, onSaved }) {
  const cats = categories.filter(c => c.type === type || c.type === "both");
  const [catId, setCatId] = useState("");
  const [catName, setCatName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (cats.length && !catId) { setCatId(cats[0].id); setCatName(cats[0].name); }
  }, [categories]);

  async function submit() {
    if (!amount || Number(amount) <= 0) { setErr("กรุณาใส่จำนวนเงิน"); return; }
    if (!catId) { setErr("กรุณาเลือกหมวดหมู่"); return; }
    setLoading(true); setErr("");
    try {
      await addTransaction({ type, amount: Number(amount), categoryId: catId, categoryName: catName, note, date });
      setAmount(""); setNote("");
      setOk(true); setTimeout(() => setOk(false), 2000);
      onSaved();
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  const isInc = type === "income";
  return (
    <div className="tab-body">
      {ok && <div className={`banner ${isInc?"b-inc":"b-exp"}`}>✅ บันทึกสำเร็จ!</div>}
      {err && <div className="err-box">{err}</div>}
      <div className="fg"><label>หมวดหมู่</label>
        <div className="chips">
          {cats.map(c => (
            <button key={c.id} className={`chip${catId===c.id?" active":""}`}
              style={catId===c.id?{background:c.color,borderColor:c.color}:{}}
              onClick={() => { setCatId(c.id); setCatName(c.name); }}>
              <span>{c.icon}</span>{c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="fg"><label>จำนวนเงิน (บาท)</label>
        <div className="amt-wrap">
          <span className={`sign ${isInc?"s-inc":"s-exp"}`}>{isInc?"+":"−"}</span>
          <input className="amt-inp" type="number" placeholder="0.00" value={amount}
            onChange={e => setAmount(e.target.value)} inputMode="decimal" />
        </div>
      </div>
      <div className="fg"><label>วันที่</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
      <div className="fg"><label>หมายเหตุ <span className="opt">(ไม่บังคับ)</span></label>
        <input placeholder="เช่น ซื้อข้าวสาร 10 กก." value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <button className={`sub-btn ${isInc?"sb-inc":"sb-exp"}`} onClick={submit} disabled={loading}>
        {loading ? "กำลังบันทึก..." : (isInc ? "+ บันทึกรายรับ" : "− บันทึกรายจ่าย")}
      </button>
    </div>
  );
}

// ── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({ refreshKey }) {
  const [txns, setTxns] = useState([]);
  const [filterDate, setFilterDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setTxns(await getTransactions(filterDate ? { date: filterDate } : {})); }
    catch (e) { console.error(e); }
    setLoading(false);
  }, [filterDate, refreshKey]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!window.confirm("ลบรายการนี้?")) return;
    await deleteTransaction(id); load();
  }

  const totInc = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totExp = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const profit = totInc - totExp;

  return (
    <div className="tab-body">
      <div className="date-row">
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <button className="ghost" onClick={() => setFilterDate("")}>ทั้งหมด</button>
      </div>
      <div className="sum-row">
        <div className="sc inc"><div className="slb">รายรับ</div><div className="svl">฿{fmt(totInc)}</div></div>
        <div className="sc exp"><div className="slb">รายจ่าย</div><div className="svl">฿{fmt(totExp)}</div></div>
        <div className={`sc ${profit>=0?"prf":"los"}`}><div className="slb">กำไร</div><div className="svl">฿{fmt(profit)}</div></div>
      </div>
      {loading ? <div className="empty">⏳ กำลังโหลด...</div>
        : txns.length === 0 ? <div className="empty">ไม่มีรายการ</div>
        : txns.map(t => (
          <div key={t.id} className={`txn ${t.type}`}>
            <div className="txn-l">
              <div className="txn-cat">{t.categoryName}</div>
              <div className="txn-meta">{t.note || "—"} · {t.date}</div>
            </div>
            <div className={`txn-amt ${t.type==="income"?"ta-inc":"ta-exp"}`}>{t.type==="income"?"+":"−"}฿{fmt(t.amount)}</div>
            <button className="del" onClick={() => del(t.id)}>🗑</button>
          </div>
        ))}
    </div>
  );
}

// ── Summary Tab ──────────────────────────────────────────────────────────────
function SummaryTab({ refreshKey }) {
  const [data, setData] = useState({ totInc: 0, totExp: 0, byCategory: [] });
  const [month, setMonth] = useState(currentMonth());

  const load = useCallback(async () => {
    try { setData(await getSummary(month)); }
    catch (e) { console.error(e); }
  }, [month, refreshKey]);

  useEffect(() => { load(); }, [load]);

  const expCats = data.byCategory.filter(c => c.type === "expense");
  const incCats = data.byCategory.filter(c => c.type === "income");
  const maxExp = expCats[0]?.total || 1;

  return (
    <div className="tab-body">
      <div className="date-row"><input type="month" value={month} onChange={e => setMonth(e.target.value)} /></div>
      <div className="sum-row">
        <div className="sc inc"><div className="slb">รายรับรวม</div><div className="svl">฿{fmt(data.totInc)}</div></div>
        <div className="sc exp"><div className="slb">รายจ่ายรวม</div><div className="svl">฿{fmt(data.totExp)}</div></div>
        <div className={`sc ${data.totInc-data.totExp>=0?"prf":"los"}`}><div className="slb">กำไรสุทธิ</div><div className="svl">฿{fmt(data.totInc-data.totExp)}</div></div>
      </div>
      {expCats.length > 0 && (
        <div className="chart-box">
          <div className="chart-ttl">รายจ่ายแยกหมวดหมู่</div>
          {expCats.map(c => (
            <div key={c.categoryName} className="bar-row">
              <div className="bar-lbl">{c.categoryName}</div>
              <div className="bar-trk"><div className="bar-fil ef" style={{width:`${Math.round(c.total/maxExp*100)}%`}} /></div>
              <div className="bar-val">฿{fmt(c.total)}</div>
            </div>
          ))}
        </div>
      )}
      {incCats.length > 0 && (
        <div className="chart-box">
          <div className="chart-ttl">รายรับแยกหมวดหมู่</div>
          {incCats.map(c => (
            <div key={c.categoryName} className="bar-row">
              <div className="bar-lbl">{c.categoryName}</div>
              <div className="bar-trk"><div className="bar-fil if" style={{width:`${Math.round(c.total/data.totInc*100)}%`}} /></div>
              <div className="bar-val">฿{fmt(c.total)}</div>
            </div>
          ))}
        </div>
      )}
      {data.byCategory.length === 0 && <div className="empty">ยังไม่มีข้อมูลในเดือนนี้</div>}
    </div>
  );
}

// ── Categories Tab ───────────────────────────────────────────────────────────
function CategoriesTab({ categories, onReload }) {
  const [showModal, setShowModal] = useState(false);
  const typeLabel = { income: "รายรับ", expense: "รายจ่าย", both: "ทั้งคู่" };

  async function del(cat) {
    if (cat.isDefault) { alert("ไม่สามารถลบหมวดหมู่เริ่มต้นได้"); return; }
    if (!window.confirm(`ลบ "${cat.name}"?`)) return;
    await deleteCategory(cat.id); onReload();
  }

  return (
    <div className="tab-body">
      <button className="pri-btn" onClick={() => setShowModal(true)}>+ เพิ่มหมวดหมู่ใหม่</button>
      {categories.map(c => (
        <div key={c.id} className="cat-row">
          <span className="cat-ico" style={{background:c.color+"22",color:c.color}}>{c.icon}</span>
          <div className="cat-inf"><div className="cat-nm">{c.name}</div><div className="cat-tp">{typeLabel[c.type]}</div></div>
          {!c.isDefault && <button className="del" onClick={() => del(c)}>🗑</button>}
        </div>
      ))}
      {showModal && <AddCategoryModal onClose={() => setShowModal(false)} onSaved={onReload} />}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [initLoading, setInitLoading] = useState(true);

  const loadCats = useCallback(async () => {
    try { setCategories(await getCategories()); }
    catch (e) { console.error(e); }
    setInitLoading(false);
  }, []);

  useEffect(() => { loadCats(); }, [loadCats]);

  const onSaved = () => setRefreshKey(k => k + 1);

  const TABS = [
    { id: "expense",    label: "ซื้อของ",  icon: "🛒" },
    { id: "income",     label: "รายรับ",   icon: "💰" },
    { id: "history",    label: "ประวัติ",  icon: "📋" },
    { id: "summary",    label: "สรุป",     icon: "📊" },
    { id: "categories", label: "หมวดหมู่", icon: "🏷" },
  ];

  if (initLoading) return <div className="loading">🍚 กำลังโหลด...</div>;

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-title">🍚 บัญชีร้านข้าว</div>
        <div className="hdr-date">{new Date().toLocaleDateString("th-TH", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}</div>
      </header>
      <main className="main">
        {tab === "expense"    && <AddTab type="expense" categories={categories} onSaved={onSaved} />}
        {tab === "income"     && <AddTab type="income"  categories={categories} onSaved={onSaved} />}
        {tab === "history"    && <HistoryTab refreshKey={refreshKey} />}
        {tab === "summary"    && <SummaryTab refreshKey={refreshKey} />}
        {tab === "categories" && <CategoriesTab categories={categories} onReload={loadCats} />}
      </main>
      <nav className="bnav">
        {TABS.map(t => (
          <button key={t.id} className={`nb${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
            <span className="ni">{t.icon}</span><span className="nl">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
