const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

(async () => {
  const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
  const appJs = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf-8');

  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.sendTo(console);
  
  // Catch specifically unhandled errors
  virtualConsole.on("jsdomError", (error) => {
    console.error("JSDOM ERROR:", error.stack, error.detail);
  });

  const dom = new JSDOM(html, { 
    runScripts: 'dangerously', 
    virtualConsole,
    url: 'http://localhost:4000'
  });

  // Mock EventSource since jsdom doesn't have it natively
  dom.window.EventSource = class EventSource {
    constructor() { this.onmessage = null; }
  };

  // Manually execute app.js in the dom context
  const script = dom.window.document.createElement('script');
  script.textContent = appJs;
  dom.window.document.body.appendChild(script);

  // Simulate DOMContentLoaded
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  console.log('Script loaded successfully. Elements attached?');
  const loginForm = dom.window.document.getElementById('login-form');
  console.log('Login form listener attached?', loginForm !== null);

})();
