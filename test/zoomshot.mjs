import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:8199/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
// deep zoom at the Karussell
await page.evaluate(() => { map.setView([50.3722, 6.9860], 17); });
await page.waitForTimeout(800);
await page.screenshot({ path: "test/shots/10-deepzoom-karussell.png" });
// wehrseifen/adenau valley z16
await page.evaluate(() => { map.setView([50.3770, 6.9455], 16); });
await page.waitForTimeout(800);
await page.screenshot({ path: "test/shots/11-adenau-valley.png" });
// OSM toggle offline fallback
await page.locator("#layers-btn").click();
await page.locator("#ly-osm").check();
await page.waitForTimeout(4000);
const state = await page.evaluate(() => ({ osmChecked: document.querySelector("#ly-osm").checked, baseVisible: map.hasLayer(baseGroup) }));
console.log("after OSM toggle offline:", JSON.stringify(state));
await page.screenshot({ path: "test/shots/12-osm-fallback.png" });
await browser.close();
