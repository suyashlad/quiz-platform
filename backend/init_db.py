from database import get_connection

conn = get_connection()
cur = conn.cursor()

# 🟢 Questions Table
cur.execute("""
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    option4 TEXT,
    correct_answer TEXT
)
""")

# 🟢 Users Table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    is_admin INTEGER DEFAULT 0
)
""")

# 🟢 Attempts Table
cur.execute("""
CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    score INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
""")

# ✅ Insert users safely (no duplicate crash)
users = [
    ("admin", "admin123", 1),
    ("user1", "user123", 0)
]

for user in users:
    try:
        cur.execute(
            "INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)",
            user
        )
    except:
        # user already exists → ignore
        pass

conn.commit()
conn.close()

print("Database ready with users and attempts")