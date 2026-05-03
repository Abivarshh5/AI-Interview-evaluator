import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RoleCreate() {
  const [role, setRole] = useState({ title: "", skills: "", qualification: "", experience: "" });
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    // Save locally
    const roles = JSON.parse(localStorage.getItem("ai_roles") || "[]");
    const id = Date.now().toString();
    const item = { id, ...role };
    roles.push(item);
    localStorage.setItem("ai_roles", JSON.stringify(roles));

    // Try remote create (optional)
    try {
      await api.post("/create-role", { roleName: role.title, skills: role.skills, qualifications: role.qualification, experience: role.experience });
    } catch (err) {
      // ignore — backend might not have endpoint
    }

    alert("Role created.");
    navigate("/evaluate");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create a Role</h2>
      <form onSubmit={handleCreate} className="space-y-3">
        <input className="border p-2 w-full rounded" placeholder="Role Title" value={role.title} onChange={e=>setRole({...role,title:e.target.value})} required/>
        <input className="border p-2 w-full rounded" placeholder="Skills (comma separated)" value={role.skills} onChange={e=>setRole({...role,skills:e.target.value})} required/>
        <input className="border p-2 w-full rounded" placeholder="Qualifications" value={role.qualification} onChange={e=>setRole({...role,qualification:e.target.value})}/>
        <input className="border p-2 w-full rounded" placeholder="Experience" value={role.experience} onChange={e=>setRole({...role,experience:e.target.value})}/>
        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save Role</button>
        </div>
      </form>
    </div>
  );
}
