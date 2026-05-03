import React, { useEffect, useState } from "react";
import API from "../api";

export default function Roles(){
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ roleName:"", skills:"", qualifications:"", experience:"" });

  useEffect(()=>{ API.get("/roles").then(r=>setRoles(r.data)).catch(()=>setRoles([])); },[]);

  const submit = async e => {
    e.preventDefault();
    await API.post("/create-role", form);
    const r = await API.get("/roles");
    setRoles(r.data);
    setForm({ roleName:"", skills:"", qualifications:"", experience:"" });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Roles</h2>

      <form onSubmit={submit} className="bg-white p-4 rounded shadow-soft grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Role Name" className="border p-2 rounded" value={form.roleName} onChange={e=>setForm({...form, roleName:e.target.value})}/>
        <input placeholder="Skills (comma separated)" className="border p-2 rounded" value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})}/>
        <input placeholder="Qualifications" className="border p-2 rounded" value={form.qualifications} onChange={e=>setForm({...form, qualifications:e.target.value})}/>
        <input placeholder="Experience" className="border p-2 rounded" value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})}/>
        <button className="col-span-1 md:col-span-2 bg-accent text-white py-2 rounded">Create Role</button>
      </form>

      <div className="mt-6 bg-white p-4 rounded shadow-soft">
        {roles.length === 0 ? <div className="text-slate-500">No roles</div> : roles.map(r=>(
          <div key={r.id} className="border-b py-3">
            <div className="font-semibold">{r.title}</div>
            <div className="text-xs text-slate-600">Skills: {r.skills}</div>
            <div className="text-xs text-slate-600">Experience: {r.experience}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
