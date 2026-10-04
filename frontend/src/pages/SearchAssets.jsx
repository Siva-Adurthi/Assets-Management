import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AppShell from "../components/AppShell";
import StatusBadge from "../components/StatusBadge";
import { PageTitle } from "./FacultyDashboard";
import api from "../api";
import { CATEGORIES, STATUSES } from "../constants";
import { errorMessage } from "../utils";
import { Link } from "react-router-dom";

export default function SearchAssets() {
  const [q,setQ]=useState("");
  const [category,setCategory]=useState("");
  const [department,setDepartment]=useState("");
  const [status,setStatus]=useState("");
  const [assets,setAssets]=useState([]);
  const [departments,setDepartments]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{api.get("/departments").then(r=>setDepartments(r.data.departments)).catch(()=>{})},[]);

  const search=async()=>{
    try{
      const params={};
      if(q)params.search=q;
      if(category)params.category=category;
      if(department)params.department=department;
      if(status)params.status=status;
      const r=await api.get("/assets",{params});
      setAssets(r.data.assets);
    }catch(err){setError(errorMessage(err))}
  };

  return <AppShell>
    <PageTitle title="Search Assets" subtitle="Find assets by category, name or department."/>
    {error&&<div className="alert error">{error}</div>}
    <div className="search-panel">
      <div className="search-input large"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Enter asset name, category or keyword..."/></div>
      <button className="btn btn-orange" onClick={search}>Search</button>
      <div className="filter-row">
        <select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All Categories</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select>
        <select value={department} onChange={e=>setDepartment(e.target.value)}><option value="">All Departments</option>{departments.map(d=><option key={d._id}>{d.departmentName}</option>)}</select>
        <select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All Status</option>{STATUSES.map(x=><option key={x}>{x}</option>)}</select>
      </div>
    </div>
    <div className="section-head"><div><h2>Search Results ({assets.length})</h2><p>Matching department assets.</p></div></div>
    <div className="result-list">{assets.map(a=><Link to={`/faculty/assets/${a._id}`} className="result-card" key={a._id}><div className="result-thumb"><span>▣</span></div><div><strong>{a.assetName}</strong><small>{a.assetCategory} • {a.department}</small></div><StatusBadge value={a.assetStatus}/></Link>)}</div>
  </AppShell>
}
