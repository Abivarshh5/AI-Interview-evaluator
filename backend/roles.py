# role storage in data/roles.json
import os, json
DATA_DIR = "data"
ROLES_FILE = os.path.join(DATA_DIR, "roles.json")
os.makedirs(DATA_DIR, exist_ok=True)

def load_roles():
    try:
        if os.path.exists(ROLES_FILE):
            return json.load(open(ROLES_FILE, "r", encoding="utf-8"))
    except Exception:
        pass
    return {}

def save_roles(roles):
    with open(ROLES_FILE, "w", encoding="utf-8") as fh:
        json.dump(roles, fh, ensure_ascii=False, indent=2)

def create_role(payload):
    roles = load_roles()
    # create an id (timestamp)
    import time
    rid = str(int(time.time() * 1000))
    role = {
        "id": rid,
        "title": payload.get("roleName") or payload.get("title") or payload.get("name") or "Unnamed",
        "skills": payload.get("skills", ""),
        "qualifications": payload.get("qualifications", payload.get("qualification", "")),
        "experience": payload.get("experience", "")
    }
    roles[rid] = role
    save_roles(roles)
    return role

def list_roles():
    return list(load_roles().values())
