import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/schools');
        const data = await res.json();
        setSchools(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cities = Array.from(new Set(schools.map(s => s.city))).sort();
  const filtered = schools.filter(s =>
    (q === '' || s.name?.toLowerCase().includes(q.toLowerCase())) &&
    (city === '' || s.city === city)
  );

  return (
    <main className="container">
      <Head><title>Schools</title></Head>
      <div className="header">
        <h1 className="title">Schools</h1>
        <div className="nav">
          <Link href="/addSchool">Add School</Link>
          <Link href="/">Home</Link>
        </div>
      </div>

      <div className="card" style={{marginBottom:'1rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>
          <input className="input" placeholder="Search by name..." value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={city} onChange={e=>setCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div><span className="badge">{filtered.length}</span> results</div>
        </div>
      </div>

      {loading ? <p className="subtitle">Loading...</p> : (
        <div className="grid">
          {filtered.map(s => (
            <article key={s.id} className="card">
              <div style={{aspectRatio:'16/9', overflow:'hidden', borderRadius:'.75rem', border:'1px solid #e5e7eb', marginBottom:'.5rem'}}>
                <img
                  src={s.image || '/no-image.png'}
                  alt={s.name}
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                />
              </div>
              <h3 style={{margin:'0 0 .25rem 0'}}>{s.name}</h3>
              <p className="subtitle" style={{margin:0}}>{s.address}</p>
              <p className="subtitle" style={{margin:0}}>{s.city}</p>
            </article>
          ))}
          {filtered.length === 0 && <p className="subtitle">No schools found.</p>}
        </div>
      )}
    </main>
  );
}
