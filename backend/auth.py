# in auth.py (or where you handle register/login)
import json
import os
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash

USERS_FILE = "data/users.json"

def _load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    return json.load(open(USERS_FILE,"r",encoding="utf-8"))

def _save_users(users):
    with open(USERS_FILE,"w",encoding="utf-8") as fh:
        json.dump(users, fh, indent=2)

def register_user(email, password):
    users = _load_users()
    if email in users:
        return False, "Email already registered"
    # hash password for safety
    users[email] = {"password": generate_password_hash(password)}
    _save_users(users)
    return True, "Registered"

def login_user(email, password):
    users = _load_users()
    user = users.get(email)
    if not user:
        return False, "Invalid credentials"
    if not check_password_hash(user["password"], password):
        return False, "Invalid credentials"
    return True, "Login successful"
