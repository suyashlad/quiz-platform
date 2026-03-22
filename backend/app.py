from flask import Flask
from flask_cors import CORS

# Route imports
from routes.upload import upload_bp
from routes.questions import questions_bp
from routes.submit import submit_bp
from routes.auth import auth_bp
from routes.admin import admin_bp

from database import get_connection

app = Flask(__name__)
CORS(app)  # allow frontend access

# =========================
# 🔥 DATABASE INITIALIZATION
# =========================
def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # USERS TABLE
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        is_admin INTEGER DEFAULT 0
    );
    """)

    # QUESTIONS TABLE
    cur.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        option1 TEXT,
        option2 TEXT,
        option3 TEXT,
        option4 TEXT,
        correct_answer TEXT
    );
    """)

    # ATTEMPTS TABLE
    cur.execute("""
    CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        score INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    # 🔥 CREATE DEFAULT ADMIN IF NOT EXISTS
    cur.execute("SELECT * FROM users WHERE username = 'admin'")
    if not cur.fetchone():
        cur.execute("""
        INSERT INTO users (username, password, is_admin)
        VALUES (?, ?, ?)
        """, ("admin", "admin123", 1))

    conn.commit()
    conn.close()


# 🚨 THIS LINE FIXES YOUR WHOLE LIFE
init_db()


# =========================
# 🔗 REGISTER ROUTES
# =========================
app.register_blueprint(upload_bp)
app.register_blueprint(questions_bp)
app.register_blueprint(submit_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)


# =========================
# 🏠 HEALTH CHECK
# =========================
@app.route("/")
def home():
    return {"message": "Quiz Backend Running 🚀"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
