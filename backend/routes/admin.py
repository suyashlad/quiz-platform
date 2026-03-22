from flask import Blueprint, request, jsonify
from database import get_connection

admin_bp = Blueprint("admin", __name__)

# 🔍 Get all users + scores
@admin_bp.route("/admin/results", methods=["GET"])
def get_results():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT users.username, attempts.score, attempts.timestamp
    FROM attempts
    JOIN users ON attempts.user_id = users.id
    ORDER BY attempts.score DESC
    """)

    rows = cur.fetchall()

    results = [
        {
            "username": row["username"],
            "score": row["score"],
            "timestamp": row["timestamp"]
        }
        for row in rows
    ]

    conn.close()
    return jsonify(results)


# ➕ Add new user
@admin_bp.route("/admin/add_user", methods=["POST"])
def add_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )
        conn.commit()
    except:
        return jsonify({"message": "User already exists"}), 400

    conn.close()
    return jsonify({"message": "User added successfully"})


# ❌ Delete user
@admin_bp.route("/admin/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = get_connection()
    cur = conn.cursor()

    # check if admin
    cur.execute("SELECT is_admin FROM users WHERE id=?", (user_id,))
    user = cur.fetchone()

    if user and user["is_admin"] == 1:
        conn.close()
        return jsonify({"message": "Cannot delete admin"}), 403

    # delete user
    cur.execute("DELETE FROM users WHERE id=?", (user_id,))
    
    conn.commit()  # ⚠️ THIS IS CRITICAL
    conn.close()

    return jsonify({"message": "User deleted"})

@admin_bp.route("/admin/users", methods=["GET"])
def get_users():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, username, is_admin FROM users")
    rows = cur.fetchall()

    users = [
        {
            "id": row["id"],
            "username": row["username"],
            "is_admin": row["is_admin"]
        }
        for row in rows
    ]

    conn.close()
    return jsonify(users)