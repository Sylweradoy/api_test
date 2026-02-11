# 🚀 Admin API + Next Dashboard

Backend API w **Node.js (Express)** z autoryzacją opartą o **JWT (cookie httpOnly)**,  
przeznaczone jako **źródło prawdy** dla panelu admina w **Next.js** oraz przyszłego **AI agenta**.

---

## 🧠 Architektura

Next.js (Admin UI)
   |
   | fetch (credentials: include)
   v
Node.js API (Express)
   - Auth (JWT + cookies)
   - Logika biznesowa
   - MongoDB
   - AI endpoints (future)

➡️ Cała logika i zabezpieczenia są w API
➡️ Next to tylko UI (bez logiki biznesowej)

## 🛠 Stack

- Node.js + Express

- MongoDB (Mongoose)

- JWT (cookie httpOnly)

- CORS + credentials

- Next.js (panel admina – osobny projekt)

+ Bezpieczne (cookie httpOnly)
- Brak logiki auth w Next


## 📦 Endpointy (API)
1. Auth

- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me

## ⚙️ Konfiguracja (.env)

PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/admin_panel
JWT_SECRET=MIN_32_ZNAKI_LOSOWE
JWT_EXPIRES_IN=7d
COOKIE_NAME=token
NEXT_ORIGIN=http://localhost:3000
NODE_ENV=development


## ▶️ Uruchomienie (DEV)

npm install
npm run dev


## 👤 Tworzenie admina (seed)

npm run seed:admin

## 🧩 Współpraca z Next.js

await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

## 🤖 AI (planowane)

POST /api/ai/chat
POST /api/ai/agent

## ✅ Status

+ API auth gotowe
+ MongoDB podłączone
+ Admin seed
+ CORS + cookies
- Next admin UI (TODO)
- AI agent (TODO)

## 📄 Licencja

MIT

MIT License

Copyright (c) 2026 Moozaik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
















## 🟢  Produkcja  🟢
1. zmień
- NEXT_ORIGIN=https://twojadomena.pl
- NODE_ENV=production



🟢   
🔴 Wymaga konfiguracji  
⚠️ Uwaga

```diff
+ API READY
- TODO: rate limit
+ API READY
- TODO: rate limit