from flask import Blueprint, request, jsonify
from database import get_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (username, password)
    )

    user = cur.fetchone()
    conn.close()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({
        "id": user["id"],
        "username": user["username"],
        "is_admin": user["is_admin"]
    })