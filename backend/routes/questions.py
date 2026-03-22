from flask import Blueprint, jsonify
from database import get_connection

questions_bp = Blueprint("questions", __name__)

@questions_bp.route("/questions", methods=["GET"])
def get_questions():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM questions")
    rows = cur.fetchall()

    questions = []

    for row in rows:
        questions.append({
            "id": row["id"],
            "question": row["question"],
            "option1": row["option1"],
            "option2": row["option2"],
            "option3": row["option3"],
            "option4": row["option4"]
        })

    conn.close()
    return jsonify(questions)