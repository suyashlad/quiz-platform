from flask import Blueprint, request, jsonify
from database import get_connection

submit_bp = Blueprint("submit", __name__)

@submit_bp.route("/submit", methods=["POST"])
def submit_test():
    data = request.json
    answers = data.get("answers")
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"message": "User ID required"}), 400

    conn = get_connection()
    cur = conn.cursor()

    # 🚫 Check if already attempted
    cur.execute("SELECT * FROM attempts WHERE user_id=?", (user_id,))
    attempt = cur.fetchone()

    if attempt:
        conn.close()
        return jsonify({"message": "You already attempted the test"}), 403

    score = 0

    for q_id, ans in answers.items():
        cur.execute("SELECT correct_answer FROM questions WHERE id=?", (q_id,))
        row = cur.fetchone()

        if row and ans == row["correct_answer"]:
            score += 1

    # ✅ Save attempt
    cur.execute(
        "INSERT INTO attempts (user_id, score) VALUES (?, ?)",
        (user_id, score)
    )

    conn.commit()
    conn.close()

    return jsonify({"score": score})