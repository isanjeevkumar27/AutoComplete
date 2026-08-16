# Queryx — Personalised Search Autocomplete

A full-stack search autocomplete system. A **C++ Trie engine** serves sub-millisecond suggestions, a **Node.js API** handles persistence, and a **React frontend** delivers a Google-style experience shaped by your personal history and live trends.

---

## Architecture

```
React  →  Express (5000)  →  C++ Crow Engine (8080)
                ↕
            MySQL DB
```

- **Keystroke** → debounced GET → Node proxies to C++ Trie → ranked suggestions (no DB write)
- **Click suggestion** → POST → writes to `SearchLogs`, `global_frequency`, `userSearchHistory`
- **Focus empty bar** → parallel fetch of recent (personal history) + trending (last 90 min)

---

## Features

- ⚡ **Real-time autocomplete** — C++ Trie with top-5 `std::set` per node
- 🧠 **Personalised results** — user Trie merged with global Trie, your searches rank first
- ✏️ **Spell correction** — Levenshtein edit distance fallback, max distance 2
- 🔥 **Trending** — live 90-minute time window on `SearchLogs`, no cron job
- 🕐 **Recent searches** — per-user history ordered by `updatedAt DESC`
- 🔒 **Auth** — bcrypt hashed passwords (salt rounds = 10), stateless localStorage session

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express, Sequelize ORM, bcrypt |
| Engine | C++ (Crow HTTP, MySQL C Connector) |
| Database | MySQL 8 |

---

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register — hashes password with bcrypt |
| POST | `/api/auth/login` | Login — returns `{ userId, username }` |
| GET | `/api/search?query=&userId=` | Suggestions from C++ engine — no DB write |
| POST | `/api/search/select` | Save selected query to all 3 tables |
| GET | `/api/search/recent?userId=` | Last 8 personal searches |
| GET | `/api/search/trending` | Top 8 queries in last 90 minutes |

---

## Database Indexes

| Table | Index | Query it serves |
|---|---|---|
| `users` | UNIQUE on `email` | Login `WHERE email = ?` |
| `global_frequency` | UNIQUE on `query` | `findOrCreate WHERE query` |
| `SearchLogs` | B-Tree on `createdAt` | Trending range scan |
| `SearchLogs` | Composite `(createdAt, query)` | Covering index for trending |
| `userSearchHistory` | Composite UNIQUE `(userId, query)` | `findOrCreate` + dedup |
| `userSearchHistory` | B-Tree on `updatedAt` | `ORDER BY updatedAt DESC` |

---

## Authentication

**bcrypt + stateless localStorage.** Password is hashed with `bcrypt.hash(password, 10)` in a Sequelize `beforeCreate` hook — plaintext never hits the DB. On login, `bcrypt.compare` verifies it and returns `userId` + `username` which the client stores in `localStorage`. No JWT, no cookies — sessions don't expire. Add signed JWT for production.

---

## Getting Started

```bash
# 1. Create DB
mysql -u root -p -e "CREATE DATABASE queryx_db;"

# 2. Backend setup
cd backend && npm install
node DBConnect.js        # creates tables + indexes
node server.js           # port 5000

# 3. Compile + run C++ engine
first enter the db_name and password of mysql database.

g++ main.cpp -o server.exe -std=c++17 -DWIN32_LEAN_AND_MEAN -Iinclude -I"G:\mysql-connector\mysql-connector-c-6.1.11-winx64\include" -L"G:\mysql-connector\mysql-connector-c-6.1.11-winx64\lib" -lmysql -lws2_32 -lmswsock -pthread
./engine                 # port 8080

# 4. Start frontend
cd frontend && npm install && npm run dev   # port 5173
```

### `.env`
```
PORT=5000
DB_NAME=queryx_db
DB_USER=root
DB_PASSWORD=your_password
```

> Update the hardcoded MySQL credentials in `main.cpp` before compiling.