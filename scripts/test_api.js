async function testAll() {
  const base = 'http://localhost:3000/api';
  const endpoints = ['stats', 'sectors', 'users', 'support', 'documentation', 'launch-points', 'standard-launches', 'tasks'];
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${base}/${ep}`);
      const data = await res.json();
      console.log(`Endpoint /api/${ep}: Status ${res.status}`, Array.isArray(data) ? `[${data.length} registros]` : data);
    } catch(e) {
      console.error(`Erro no endpoint /api/${ep}:`, e.message);
    }
  }
}

testAll();
