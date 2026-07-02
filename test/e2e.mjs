/* End-to-end validation of the Nordschleife interactive map.
   Run: node test/e2e.mjs [--shots-only]  (server must be on :8199) */
import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:8199/";
const SHOTS = "test/shots";
fs.mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const ok = (cond, msg) => {
  console.log((cond ? "  ✓ " : "  ✗ FAIL ") + msg);
  if (!cond) failures++;
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

console.log("== load ==");
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok(await page.title() === "Nürburgring Nordschleife — Interactive Map", "title");
ok(await page.locator("#map .leaflet-overlay-pane canvas, #map canvas").count() > 0, "map canvas rendered");
const nSections = await page.locator("#section-list li").count();
ok(nSections === 41, `section list has 41 entries (got ${nSections})`);
const nMarkers = await page.locator(".sec-marker").count();
ok(nMarkers === 41, `41 section markers on map (got ${nMarkers})`);
ok(await page.locator("#elev-chart svg polyline").count() === 1, "elevation profile drawn");
ok((await page.locator("#statbar .chip").count()) >= 4, "stat chips");
await page.screenshot({ path: `${SHOTS}/01-overview.png` });

console.log("== data sanity (in page) ==");
const sanity = await page.evaluate(() => {
  const total = TRACK.geometryLengthKm;
  const names = TRACK.sections.map(s => s.name);
  const contentMiss = names.filter(n => !CONTENT.sections[n]);
  const elevs = TRACK.elev.map(p => p[1]);
  return { total, contentMiss, eMin: Math.min(...elevs), eMax: Math.max(...elevs),
           nRecords: CONTENT.records.reduce((a, g) => a + g.items.length, 0),
           nHistory: CONTENT.history.length,
           secsWithSources: names.filter(n => CONTENT.sections[n] && CONTENT.sections[n].sources.length > 0).length };
});
ok(Math.abs(sanity.total - 20.711) < 0.05, `geometry length ≈ 20.7 km (${sanity.total})`);
ok(sanity.contentMiss.length === 0, `every section has curated content (missing: ${sanity.contentMiss.join(",") || "none"})`);
ok(sanity.eMin > 300 && sanity.eMin < 360, `min elevation plausible (${sanity.eMin} m)`);
ok(sanity.eMax > 590 && sanity.eMax < 650, `max elevation plausible (${sanity.eMax} m)`);
ok(sanity.nRecords >= 14, `records present (${sanity.nRecords})`);
ok(sanity.nHistory >= 14, `history events (${sanity.nHistory})`);
ok(sanity.secsWithSources === 41, `all 41 sections carry sources (${sanity.secsWithSources})`);

console.log("== click every corner in the list ==");
let cornerFails = 0;
for (let i = 0; i < nSections; i++) {
  await page.locator(`#section-list li[data-i="${i}"]`).click();
  await page.waitForTimeout(60);
  const h2 = await page.locator("#detail-body h2").textContent();
  const hasSources = await page.locator("#detail-body .src-list li").count();
  const hasStats = await page.locator("#detail-body .dstat").count();
  if (!h2 || hasSources === 0 || hasStats < 2) { cornerFails++; ok(false, `section ${i + 1} detail incomplete (${h2}, src=${hasSources}, stats=${hasStats})`); }
  await page.locator("#back-btn").click();
  await page.waitForTimeout(30);
}
ok(nSections === 41 && cornerFails === 0, `all 41 detail cards render with stats + sources (${cornerFails} failures)`);

console.log("== stationing consistency ==");
const stationing = await page.evaluate(() => {
  const last = SECTIONS[SECTIONS.length - 1];
  const gapEnd = TOTAL - last.endM;                    // unassigned meters before start/finish
  const p = pointAt(SECTIONS[24].midM);                // Karussell marker position
  return { gapEnd, karussellLat: p[0], karussellLng: p[1] };
});
ok(stationing.gapEnd < 30, `sections cover the lap to <30 m of start/finish (gap ${stationing.gapEnd.toFixed(1)} m)`);
ok(Math.abs(stationing.karussellLat - 50.3717) < 0.0012 && Math.abs(stationing.karussellLng - 6.9860) < 0.0018,
   `Karussell marker lands at the real Karussell (${stationing.karussellLat.toFixed(4)}, ${stationing.karussellLng.toFixed(4)})`);

console.log("== deep-dive: Karussell ==");
await page.locator("#search").fill("karussell");
await page.waitForTimeout(100);
const visible = await page.locator("#section-list li:visible").count();
ok(visible === 2, `search finds Karussell + Kleines Karussell (got ${visible})`);
await page.locator("#section-list li:visible").first().click();
await page.waitForTimeout(700);
ok((await page.locator("#detail-body h2").textContent()) === "Caracciola-Karussell", "display name Caracciola-Karussell");
ok((await page.locator("#detail-body").textContent()).includes("Caracciola"), "detail text");
await page.screenshot({ path: `${SHOTS}/02-karussell.png` });

console.log("== marker click + popup ==");
await page.locator("#back-btn").click();
await page.locator("#search").fill("");
await page.waitForTimeout(100);
await page.locator('#section-list li[data-i="7"]').click(); // Schwedenkreuz
await page.waitForTimeout(600);
ok((await page.locator("#detail-body h2").textContent()) === "Schwedenkreuz", "Schwedenkreuz selected");
await page.screenshot({ path: `${SHOTS}/03-schwedenkreuz.png` });

console.log("== keyboard nav ==");
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(300);
ok((await page.locator("#detail-body h2").textContent()) === "Aremberg", "ArrowRight -> Aremberg");
await page.keyboard.press("ArrowLeft");
await page.waitForTimeout(300);
ok((await page.locator("#detail-body h2").textContent()) === "Schwedenkreuz", "ArrowLeft -> back");

console.log("== elevation hover & click ==");
await page.keyboard.press("Escape");
const chart = page.locator("#elev-chart");
const cb = await chart.boundingBox();
await page.mouse.move(cb.x + cb.width * 0.4, cb.y + cb.height * 0.5);
await page.waitForTimeout(200);
ok(await page.locator(".elev-tip").count() === 1, "elevation tooltip appears");
const tipText = await page.locator(".elev-tip").textContent();
ok(/km \d+\.\d+ · \d+ m/.test(tipText), `tooltip has km + elevation (${tipText})`);
await page.mouse.click(cb.x + cb.width * 0.4, cb.y + cb.height * 0.5);
await page.waitForTimeout(400);
ok((await page.locator("#detail-body h2").count()) === 1, "chart click selects a section");
await page.screenshot({ path: `${SHOTS}/04-elevation.png` });

console.log("== records / history / about tabs ==");
await page.locator('.tab[data-tab="records"]').click();
ok(await page.locator("#tab-records .rec").count() >= 14, "records rendered");
ok((await page.locator("#tab-records").textContent()).includes("5:19.546"), "919 Evo record present");
ok((await page.locator("#tab-records").textContent()).includes("6:29.090"), "AMG ONE record present");
await page.screenshot({ path: `${SHOTS}/05-records.png` });
await page.locator('.tab[data-tab="history"]').click();
ok(await page.locator("#tab-history .tl li").count() >= 14, "history timeline rendered");
await page.locator('.tab[data-tab="about"]').click();
ok((await page.locator("#tab-about").textContent()).includes("20.832"), "about includes official length");
ok(await page.locator("#tab-about a").count() >= 5, "about has source links");
await page.screenshot({ path: `${SHOTS}/06-about.png` });
await page.locator('.tab[data-tab="explore"]').click();

console.log("== layers menu ==");
await page.locator("#layers-btn").click();
await page.locator("#ly-km").uncheck();
ok(await page.evaluate(() => !map.hasLayer(kmGroup)), "km layer actually removed");
await page.locator("#ly-km").check();
ok(await page.evaluate(() => map.hasLayer(kmGroup)), "km layer restored");
await page.locator("#ly-gp").uncheck();
ok(await page.evaluate(() => !map.hasLayer(gpGroup)), "GP layer actually removed");
await page.locator("#ly-gp").check();
await page.locator("#ly-steil").uncheck();
await page.locator("#ly-steil").check();
// km labels must stay zoom-gated after a remove/re-add cycle (CSS bucket rules)
const kmGate = await page.evaluate(() => {
  const el = document.querySelector(".km-label");
  return { visible: el ? getComputedStyle(el).display !== "none" : null, z: map.getZoom() };
});
ok(kmGate.visible === (kmGate.z >= 14.5), `km labels zoom-gated after layer re-add (visible=${kmGate.visible} at z${kmGate.z})`);
await page.keyboard.press("Escape");

console.log("== lap tour ==");
await page.locator("#tour-btn").click();
await page.waitForTimeout(500);
ok(!(await page.locator("#tour-hud").isHidden()), "tour HUD visible");
await page.waitForTimeout(2500);
const stats1 = await page.locator("#tour-stats").textContent();
await page.waitForTimeout(2000);
const stats2 = await page.locator("#tour-stats").textContent();
ok(stats1 !== stats2, `car advances (${stats1} -> ${stats2})`);
ok((await page.locator("#tour-section").textContent()).length > 2, "tour shows current section");
await page.screenshot({ path: `${SHOTS}/07-tour.png` });
await page.locator("#tour-play").click(); // pause
const s3 = await page.locator("#tour-stats").textContent();
await page.waitForTimeout(700);
ok(s3 === await page.locator("#tour-stats").textContent(), "pause works");
await page.locator("#tour-exit").click();
ok(await page.locator("#tour-hud").isHidden(), "tour exits");

console.log("== zoom interactions ==");
await page.waitForTimeout(1200); // let tourStop's animated fitBounds settle
const z0 = await page.evaluate(() => map.getZoom());
await page.locator(".leaflet-control-zoom-in").click();
await page.locator(".leaflet-control-zoom-in").click();
await page.waitForTimeout(700);
const z1 = await page.evaluate(() => map.getZoom());
ok(z1 > z0, `zoom control raises zoom (${z0} -> ${z1})`);
const kmVisibleZoomed = await page.evaluate(() => {
  const el = document.querySelector(".km-label");
  return el ? getComputedStyle(el).display !== "none" : null;
});
ok(kmVisibleZoomed === (z1 >= 14.5), `km labels visibility matches zoom bucket at z${z1}`);
await page.screenshot({ path: `${SHOTS}/08-zoomed.png` });

console.log("== mobile viewport ==");
await page.setViewportSize({ width: 390, height: 800 });
await page.waitForTimeout(500);
ok(await page.locator("#side-toggle").isVisible(), "mobile: sidebar toggle visible");
await page.locator("#side-toggle").click();
await page.waitForTimeout(400);
ok(await page.locator("#sidebar.open").count() === 1, "mobile: sidebar opens");
await page.keyboard.press("Escape"); // back to explore list
await page.waitForTimeout(200);
await page.locator("#side-toggle").click(); // Escape may not reopen; ensure open
await page.waitForTimeout(200);
if (!(await page.locator("#sidebar.open").count())) await page.locator("#side-toggle").click();
await page.locator('#section-list li[data-i="14"]').click();
await page.waitForTimeout(500);
ok((await page.locator("#detail-body h2").count()) === 1, "mobile: detail renders");
await page.screenshot({ path: `${SHOTS}/09-mobile.png` });
await page.setViewportSize({ width: 1440, height: 900 });

console.log("== console errors ==");
ok(errors.length === 0, `no console/page errors (${errors.slice(0, 5).join(" | ") || "clean"})`);

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} FAILURES`);
process.exit(failures ? 1 : 0);
