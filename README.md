# 🍚 บัญชีร้านข้าว — คู่มือติดตั้ง

ใช้ได้บน Android, iPad, ทุกที่ทุกเวลา ข้อมูลเก็บใน Firebase (Google) ฟรี

---

## 🗂 ไฟล์ในโปรเจกต์

```
rice-shop-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── firebase.js   ← ใส่ config Firebase ของคุณที่นี่
│   ├── db.js         ← ฟังก์ชันเชื่อมต่อ Firestore
│   ├── App.js        ← UI ทั้งหมด
│   └── index.js
├── package.json
└── README.md
```

---

## 🚀 ขั้นตอน Deploy (ทำครั้งเดียว ~20 นาที)

---

### ✅ ขั้นที่ 1 — สร้าง Firebase Project

1. เปิด **https://console.firebase.google.com**
2. ล็อกอินด้วย Google Account
3. กด **"Create a project"**
4. ตั้งชื่อ เช่น `rice-shop-app` → กด Continue
5. ปิด Google Analytics → กด **"Create project"**
6. รอ 1 นาที → กด **"Continue"**

---

### ✅ ขั้นที่ 2 — เปิดใช้ Firestore (ฐานข้อมูล)

1. เมนูซ้าย → **"Firestore Database"**
2. กด **"Create database"**
3. เลือก **"Start in test mode"** → กด Next
4. เลือก Region: **asia-southeast1 (Singapore)** → กด **"Enable"**
5. รอ 30 วินาที

---

### ✅ ขั้นที่ 3 — คัดลอก Config มาใส่ในโค้ด

1. เมนูซ้าย → กด ⚙️ **"Project settings"**
2. เลื่อนลงหา **"Your apps"** → กดไอคอน **`</>`** (Web)
3. ตั้งชื่อแอพ เช่น `rice-shop` → กด **"Register app"**
4. จะเห็น code แบบนี้:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rice-shop-app.firebaseapp.com",
  projectId: "rice-shop-app",
  storageBucket: "rice-shop-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. **เปิดไฟล์ `src/firebase.js`** แล้วแทนที่ค่าทั้งหมดด้วยของคุณ
6. บันทึกไฟล์

---

### ✅ ขั้นที่ 4 — อัพโหลดโค้ดขึ้น GitHub

1. เปิด **https://github.com** → สมัครสมาชิก (ถ้ายังไม่มี)
2. กด **"New repository"** → ตั้งชื่อ `rice-shop-app` → กด **"Create"**
3. ในหน้า repo ใหม่ กด **"uploading an existing file"**
4. ลากไฟล์ทั้งหมดในโฟลเดอร์นี้เข้าไป (ยกเว้นโฟลเดอร์ `node_modules`)
5. กด **"Commit changes"**

---

### ✅ ขั้นที่ 5 — Deploy บน Vercel (ฟรี)

1. เปิด **https://vercel.com** → กด **"Sign up"** → เลือก **"Continue with GitHub"**
2. กด **"Add New Project"**
3. เลือก repo `rice-shop-app` → กด **"Import"**
4. Vercel จะตรวจจับว่าเป็น React อัตโนมัติ
5. กด **"Deploy"** → รอ 2 นาที
6. ✅ ได้ URL เช่น **`https://rice-shop-app.vercel.app`**

---

### ✅ ขั้นที่ 6 — ติดตั้งบนมือถือ

**Android (Chrome):**
1. เปิด Chrome → ไปที่ URL ของ Vercel
2. กดเมนู ⋮ (มุมขวาบน) → **"Add to Home Screen"**
3. ตั้งชื่อ "ร้านข้าว" → กด **Add**

**iPad (Safari):**
1. เปิด Safari → ไปที่ URL ของ Vercel
2. กด Share 📤 → **"Add to Home Screen"** → **Add**

🎉 **เสร็จแล้ว!** ใช้งานได้ทุกที่ ข้อมูล sync ทุกเครื่องอัตโนมัติ

---

## 💡 ข้อดีของ Firebase

- ✅ ไม่ต้องมี backend เลย
- ✅ ข้อมูล sync realtime ทุกเครื่อง
- ✅ ฟรี (Firestore ฟรี 1GB + 50,000 reads/วัน เกินพอ)
- ✅ Google ดูแลให้ ไม่มี server หลับ
