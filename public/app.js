document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup SSE for Live Logs
    const logContainer = document.getElementById('log-container');
    const eventSource = new EventSource('/logs');
    
    function addLog(data) {
        const div = document.createElement('div');
        div.className = `log-entry ${data.type}`;
        
        const time = new Date(data.timestamp).toLocaleTimeString();
        let content = '';

        if (data.type === 'attack') {
            content = `
                <span class="timestamp">[${time}]</span>
                <span class="alert-badge">THREAT BLOCKED</span>
                <strong>${data.message}</strong>
                <span class="payload">Path: ${data.path} | Payload: ${JSON.stringify(data.payload)}</span>
            `;
        } else if (data.type === 'info') {
            content = `
                <span class="timestamp">[${time}]</span>
                <span class="method">REQ</span> ${data.path} - ${data.message}
            `;
        } else {
            content = `
                <span class="timestamp">[${time}]</span>
                ${data.message}
            `;
        }
        
        div.innerHTML = content;
        logContainer.appendChild(div);
        
        // Keep scrolled to bottom
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Remove old logs to prevent DOM bloat
        if (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.children[0]);
        }
    }

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addLog(data);
    };

    // 2. Form Submissions
    
    // Login Form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const resultBox = document.getElementById('login-result');
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (res.status === 403) {
                // SQLGuardJS blocks it
                resultBox.className = 'result-box error';
                resultBox.innerHTML = '<strong>Request Blocked (403 Forbidden)</strong><br>SQLGuardJS intercepted a malicious payload.';
            } else {
                const data = await res.json();
                if (res.ok) {
                    resultBox.className = 'result-box success';
                    resultBox.innerHTML = `<strong>Success!</strong><br>${JSON.stringify(data)}<br><br><span style="color: #f1c40f;">Hint: Bypassing auth is great, but the actual flag must be extracted via the Data Exfiltration Vector!</span>`;
                } else {
                    resultBox.className = 'result-box error';
                    resultBox.innerHTML = `<strong>Failed:</strong> ${data.message || 'Unknown error'}`;
                }
            }
        } catch (err) {
            console.error(err);
            resultBox.className = 'result-box error';
            resultBox.innerHTML = 'Network Error';
        }
    });

    // Search Form
    document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('search-query').value;
        const resultBox = document.getElementById('search-result');
        
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            
            if (res.status === 403) {
                // SQLGuardJS blocks it
                resultBox.className = 'result-box error';
                resultBox.innerHTML = '<strong>Request Blocked (403 Forbidden)</strong><br>SQLGuardJS intercepted a malicious payload.';
            } else {
                const data = await res.json();
                if (res.ok) {
                    resultBox.className = 'result-box success';
                    resultBox.innerHTML = `<strong>Results:</strong><br><pre>${JSON.stringify(data, null, 2)}</pre>`;
                } else {
                    resultBox.className = 'result-box error';
                    resultBox.innerHTML = `<strong>Failed:</strong> ${data.error || 'Unknown error'}`;
                }
            }
        } catch (err) {
            console.error(err);
            resultBox.className = 'result-box error';
            resultBox.innerHTML = 'Network Error';
        }
    });

    // Flag Submission Form
    document.getElementById('flag-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const flag = document.getElementById('flag-input').value;
        const resultBox = document.getElementById('flag-result');
        
        try {
            const res = await fetch('/api/verify-flag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flag })
            });
            
            const data = await res.json();
            if (data.success) {
                resultBox.className = 'result-box success';
                resultBox.innerHTML = `<strong>Congratulations!</strong><br>${data.message}`;
                
                // Add a visual celebration
                const panel = document.getElementById('flag-form').parentElement;
                panel.style.boxShadow = '0 0 30px rgba(46, 213, 115, 0.5)';
                panel.style.borderColor = '#2ed573';
            } else if (data.isTroll) {
                resultBox.className = 'result-box error';
                resultBox.innerHTML = `<strong>${data.message}</strong>`;
                
                // Reset styling just in case
                const panel = document.getElementById('flag-form').parentElement;
                panel.style.boxShadow = 'none';
                panel.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            } else {
                resultBox.className = 'result-box error';
                resultBox.innerHTML = `<strong>Failed:</strong> ${data.message}`;
                
                const panel = document.getElementById('flag-form').parentElement;
                panel.style.boxShadow = 'none';
                panel.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        } catch (err) {
            console.error(err);
            resultBox.className = 'result-box error';
            resultBox.innerHTML = 'Network Error';
        }
    });

    // Quick fill hints
    document.querySelectorAll('code').forEach(codeEl => {
        codeEl.addEventListener('click', () => {
            const payload = codeEl.innerText;
            const userInp = document.getElementById('username');
            const searchInp = document.getElementById('search-query');
            
            if (payload.includes('SELECT') || payload.includes('UNION') || payload.includes('<script>')) {
                searchInp.value = payload;
                searchInp.focus();
            } else {
                userInp.value = payload;
                userInp.focus();
            }
        });
    });
});
