'use client';
import { useState } from 'react';

export default function Page() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);

  async function doSearch(e) {
    e.preventDefault();
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setRes(j);
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Vulnerable Next.js Demo (JS)</h1>

      <form onSubmit={doSearch}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={"search (try: ' OR '1'='1 or <script>alert(1)</script>)"}
          style={{ padding: 8, width: 420 }}
        />
        <button style={{ marginLeft: 8, padding: '8px 12px' }}>Search</button>
      </form>

      <section style={{ marginTop: 20 }}>
        <h2>Endpoints</h2>
        <ul>
          <li><code>/api/search?q=...</code> — vulnerable search (simulated SQLi)</li>
          <li><code>/api/greet?name=...</code> — reflected XSS demo</li>
          <li><code>/api/admin?admin=true</code> — broken access control demo</li>
        </ul>
      </section>

      <section style={{ marginTop: 20 }}>
        <pre style={{ maxWidth: 800, whiteSpace: 'pre-wrap' }}>{JSON.stringify(res, null, 2)}</pre>
      </section>
    </main>
  );
}
