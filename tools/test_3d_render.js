const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server
const server = http.createServer((req, res) => {
  let filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    let ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(8080, async () => {
  console.log('Static test server listening on http://localhost:8080');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Browser console error:', msg.text());
  });

  await page.goto('http://localhost:8080/index.html');
  console.log('Page loaded via HTTP');

  await page.evaluate(() => {
    window.openSim('macro-gdp');
  });

  await page.waitForTimeout(4000);

  const wrapper = await page.$('.cf-3d-wrapper');
  console.log('cf-3d-wrapper present:', !!wrapper);

  await page.screenshot({ path: '3d_circular_flow_screenshot.png' });
  console.log('Screenshot saved to 3d_circular_flow_screenshot.png');

  await browser.close();
  server.close();
});
