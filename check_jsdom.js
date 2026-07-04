const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    const appJs = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf-8');

    const dom = new JSDOM(html, { 
      runScripts: 'dangerously', 
      virtualConsole: new (require('jsdom')).VirtualConsole().sendTo(console),
      url: 'http://localhost:4000'
    });

    // Manually execute app.js in the dom context
    const script = dom.window.document.createElement('script');
    script.textContent = appJs;
    dom.window.document.body.appendChild(script);

    // Simulate DOMContentLoaded
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    console.log('Script loaded successfully with no immediate errors.');
  } catch (err) {
    console.error('ERROR CAUGHT:', err);
  }
})();
