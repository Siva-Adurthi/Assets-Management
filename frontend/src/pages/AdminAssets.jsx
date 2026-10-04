import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AppShell from "../components/AppShell";
import { PageTitle, AssetTable } from "./FacultyDashboard";
import AssetFormModal from "../components/AssetFormModal";
import api from "../api";
import { errorMessage } from "../utils";

export default function AdminAssets(){
  const [assets,setAssets]=useState([]);
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState("");

  const load=async()=>{try{setAssets((await api.get("/assets")).data.assets)}catch(e){setError(errorMessage(e))}};
  useEffect(()=>{load()},[]);

  const remove=async a=>{
    if(!confirm(`Delete ${a.assetName}?`))return;
    try{await api.delete(`/assets/${a._id}`);load()}catch(e){setError(errorMessage(e))}
  };

  return <AppShell admin>
    <PageTitle title="Manage Assets" subtitle="Add, update or delete department assets." actions={<button className="btn btn-orange" onClick={()=>{setEditing(null);setOpen(true)}}><Plus size={17}/> Add Asset</button>}/>
    {error&&<div className="alert error">{error}</div>}
    <AssetTable assets={assets} admin onEdit={a=>{setEditing(a);setOpen(true)}} onDelete={remove}/>
    {open&&<AssetFormModal asset={editing} onClose={()=>setOpen(false)} onSaved={()=>{setOpen(false);load()}}/>}
  </AppShell>
}
