const testLogin = async (username, password) => {
    const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text}\n`);
};

(async () => {
    console.log("--- Normal Request ---");
    await testLogin("user", "password123");

    console.log("--- Malicious Request (SQL Injection 4) ---");
    await testLogin("admin' or 2>1--", "123");
})();
