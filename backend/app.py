from flask import Flask
from flask_cors import CORS

from routes.upload import upload_bp
from routes.questions import questions_bp
from routes.submit import submit_bp
from routes.auth import auth_bp  # ✅ NEW
from routes.admin import admin_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(upload_bp)
app.register_blueprint(questions_bp)
app.register_blueprint(submit_bp)
app.register_blueprint(auth_bp)  # ✅ NEW
app.register_blueprint(admin_bp)

@app.route("/")
def home():
    return {"message": "Backend running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)