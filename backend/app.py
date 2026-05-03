import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# ------------------ LOCAL MODULES ------------------ #
# These local modules are expected to exist in your backend folder:
# - auth.py should expose register_user(email, password) -> (ok: bool, message: str)
#   and login_user(email, password) -> (ok: bool, message: str)
# - roles.py should expose create_role(payload), list_roles(), load_roles()
# - whisper_model.py should expose transcribe_audio(filepath)
# - summarizer.py should expose summarize_text(transcript)
# - evaluator.py should expose evaluate_summary(summary, role_data)
from auth import register_user, login_user
from roles import create_role, list_roles, load_roles
from whisper_model import transcribe_audio
from summarizer import summarize_text
from evaluator import evaluate_summary

# ------------------ CONFIG ------------------ #
UPLOAD_DIR = "uploads"
DATA_DIR = "data"
ALLOWED_EXT = {"wav", "mp3", "m4a", "mp4", "mov", "mpeg", "webm"}

# Ensure necessary directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_DIR
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024  # 200 MB


# ------------------ HELPERS ------------------ #
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def load_reports():
    path = os.path.join(DATA_DIR, "reports.json")
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_reports(reports):
    path = os.path.join(DATA_DIR, "reports.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)


# ------------------ AUTH ------------------ #
@app.route("/register", methods=["POST"])
def route_register():
    """
    Expected JSON: { "email": "...", "password": "..." }
    Returns: { "success": bool, "message": str }
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"success": False, "message": "Invalid JSON payload"}), 400

    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"success": False, "message": "Email & password required"}), 400

    ok, msg = register_user(email, password)
    status = 200 if ok else 400
    print(f"[AUTH] register: {email} -> {ok} ({msg})")
    return jsonify({"success": ok, "message": msg}), status


@app.route("/login", methods=["POST"])
def route_login():
    """
    Expected JSON: { "email": "...", "password": "..." }
    Returns: { "success": bool, "message": str }
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"success": False, "message": "Invalid JSON payload"}), 400

    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"success": False, "message": "Email & password required"}), 400

    ok, msg = login_user(email, password)
    status = 200 if ok else 401
    print(f"[AUTH] login: {email} -> {ok} ({msg})")
    return jsonify({"success": ok, "message": msg}), status


# ------------------ ROLES ------------------ #
@app.route("/create-role", methods=["POST"])
def route_create_role():
    try:
        payload = request.get_json(force=True)
    except Exception:
        return jsonify({"success": False, "message": "Invalid JSON payload"}), 400

    if not payload:
        return jsonify({"success": False, "message": "Invalid payload"}), 400

    role = create_role(payload)
    return jsonify({"success": True, "message": "Role created", "role": role}), 200


@app.route("/roles", methods=["GET"])
def route_list_roles():
    return jsonify(list_roles()), 200


# ------------------ AUDIO PIPELINE ------------------ #
@app.route("/transcribe", methods=["POST"])
def route_transcribe():
    """
    Multipart form-data:
      - file field: "audio" (audio or video)
      - roleId (optional)
      - roleName (optional)
    Returns JSON with transcript, summary, evaluation.
    """
    if "audio" not in request.files:
        return jsonify({"error": "No file uploaded (use field name 'audio')"}), 400

    file = request.files["audio"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": f"File type not allowed. Allowed: {ALLOWED_EXT}"}), 400

    role_id = request.form.get("roleId") or request.form.get("role_id") or request.form.get("role")
    role_name = request.form.get("roleName") or request.form.get("role_name") or ""

    filename = secure_filename(f"{int(datetime.utcnow().timestamp()*1000)}_{file.filename}")
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    try:
        print(f"[UPLOAD] Processing audio file: {filename}")

        # 1. Transcribe
        transcript = transcribe_audio(filepath)
        print("[STAGE] Transcription completed")

        # 2. Summarize
        summary = summarize_text(transcript)
        print("[STAGE] Summarization completed")

        # 3. Evaluate
        roles = load_roles()
        role_data = roles.get(role_id) if role_id else None
        evaluation = evaluate_summary(summary, role_data)
        print("[STAGE] Evaluation completed")

        # 4. Persist report
        reports = load_reports()
        report = {
            "id": str(int(datetime.utcnow().timestamp() * 1000)),
            "roleId": role_id,
            "roleName": role_name or (role_data.get("title") if role_data else ""),
            "transcript": transcript,
            "summary": summary,
            "evaluation": evaluation,
            "audioFile": filename,
            "timestamp": datetime.utcnow().isoformat(),
        }
        reports.append(report)
        save_reports(reports)
        print("[STAGE] Report saved")

        return jsonify({
            "transcript": transcript,
            "summary": summary,
            "evaluation": evaluation
        }), 200

    except Exception as e:
        print(f"[ERROR] Processing failed: {e}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500


# ------------------ DIRECT EVALUATION (TEXT) ------------------ #
@app.route("/api/evaluate", methods=["POST"])
def route_evaluate():
    """
    Evaluate a transcript directly without uploading audio.
    JSON body: { "transcript": "...", "roleId": "..." (optional) }
    Returns: { transcript, summary, evaluation }
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    transcript = data.get("transcript")
    role_id = data.get("roleId")

    if not transcript:
        return jsonify({"error": "Missing transcript"}), 400

    try:
        summary = summarize_text(transcript)
        roles = load_roles()
        role_data = roles.get(role_id) if role_id else None
        evaluation = evaluate_summary(summary, role_data)

        # Save report
        reports = load_reports()
        report = {
            "id": str(int(datetime.utcnow().timestamp() * 1000)),
            "roleId": role_id,
            "roleName": (role_data.get("title") if role_data else ""),
            "transcript": transcript,
            "summary": summary,
            "evaluation": evaluation,
            "timestamp": datetime.utcnow().isoformat(),
            "audioFile": None
        }
        reports.append(report)
        save_reports(reports)

        return jsonify({
            "transcript": transcript,
            "summary": summary,
            "evaluation": evaluation
        }), 200

    except Exception as e:
        print(f"[ERROR] Evaluate failed: {e}")
        return jsonify({"error": str(e)}), 500


# ------------------ REPORTS ------------------ #
@app.route("/reports", methods=["GET"])
def route_reports():
    return jsonify(load_reports()), 200


# ------------------ FILE SERVE ------------------ #
@app.route("/uploads/<path:filename>", methods=["GET"])
def get_upload(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ------------------ SERVER START ------------------ #
if __name__ == "__main__":
    print("🚀 Starting Flask backend on http://127.0.0.1:5000")
    print("📡 Endpoints:")
    print("   POST  /register       → Register user (returns {success,message})")
    print("   POST  /login          → Login user (returns {success,message})")
    print("   POST  /create-role    → Create role")
    print("   GET   /roles          → List roles")
    print("   POST  /transcribe     → Upload & process audio")
    print("   POST  /api/evaluate   → Evaluate transcript text")
    print("   GET   /reports        → Fetch all reports")
    print("----------------------------------------------")
    app.run(host="0.0.0.0", port=5000, debug=True)
