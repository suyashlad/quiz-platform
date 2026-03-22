from flask import Blueprint, request, jsonify
import pandas as pd
from database import get_connection

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400
    file = request.files["file"]
    df = pd.read_excel(file)

    conn = get_connection()
    cur = conn.cursor()

    for _, row in df.iterrows():
        cur.execute("""
        INSERT INTO questions (question, option1, option2, option3, option4, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            row["question"],
            row["option1"],
            row["option2"],
            row["option3"],
            row["option4"],
            row["correct_answer"]
        ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Upload success"})