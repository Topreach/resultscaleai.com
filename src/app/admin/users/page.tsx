"use client";
import {useEffect,useState} from "react";
import type {User} from "@/types";
type ManagedUser=User & {active:boolean};
export default function AdminUsersPage(){
 const [users,setUsers]=useState<ManagedUser[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState("");
 useEffect(()=>{fetch("/api/admin/users").then(async r=>{if(!r.ok)throw new Error("Could not load users");setUsers(await r.json());}).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 async function toggle(user:ManagedUser){setBusy(user.id);setError("");try{const r=await fetch("/api/admin/users",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:user.id,active:!user.active})});if(!r.ok)throw new Error("Could not update user");const updated=await r.json();setUsers(users=>users.map(u=>u.id===user.id?updated:u));}catch(e){setError(e instanceof Error?e.message:"Update failed");}finally{setBusy("");}}
 return <div className="p-6 lg:p-10"><h1 className="text-3xl font-bold mb-6">User Management</h1>{error&&<p role="alert" className="text-red-600">{error}</p>}{loading?<p role="status">Loading users…</p>:users.length?<div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{['Name','Email','Downloads','Joined','Status','Action'].map(s=><th key={s} className="p-3">{s}</th>)}</tr></thead><tbody>{users.map(user=><tr key={user.id} className="border-t"><td className="p-3">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{user.downloads.length}</td><td className="p-3">{user.createdAt.slice(0,10)}</td><td className="p-3">{user.active?'Active':'Disabled'}</td><td className="p-3"><button disabled={busy===user.id} onClick={()=>toggle(user)} className="text-indigo-600 disabled:opacity-50">{busy===user.id?'Saving…':user.active?'Disable':'Enable'}</button></td></tr>)}</tbody></table></div>:<p>No registered users yet.</p>}</div>;
}
