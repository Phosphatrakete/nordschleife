/* Nürburgring Nordschleife interactive map. Data: js/track.js (geometry, OSM-derived),
   js/basemap.js (surroundings), js/data.js (curated cited content). */
"use strict";

/* ================= geometry helpers ================= */
const R_EARTH = 6371000;
function havM(a, b) { // [lat,lng] pairs -> meters
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;
  const la1 = a[0] * Math.PI / 180, la2 = b[0] * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(h));
}
const RING = TRACK.ring;                 // [[lat,lng],...] closed
const CUM = [0];
for (let i = 1; i < RING.length; i++) CUM.push(CUM[i - 1] + havM(RING[i - 1], RING[i]));
const TOTAL = CUM[CUM.length - 1];

function pointAt(m) { // meters along ring -> [lat,lng]
  m = ((m % TOTAL) + TOTAL) % TOTAL;
  let lo = 0, hi = CUM.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; (CUM[mid] < m) ? lo = mid + 1 : hi = mid; }
  const i = Math.max(1, lo);
  const t = (m - CUM[i - 1]) / Math.max(1e-9, CUM[i] - CUM[i - 1]);
  return [RING[i - 1][0] + (RING[i][0] - RING[i - 1][0]) * t,
          RING[i - 1][1] + (RING[i][1] - RING[i - 1][1]) * t];
}
function subLine(s, e) { // section polyline, wrap-aware
  s = ((s % TOTAL) + TOTAL) % TOTAL; e = ((e % TOTAL) + TOTAL) % TOTAL;
  const pts = [pointAt(s)];
  let i = CUM.findIndex(c => c > s);
  if (i < 0) i = 1;
  if (e >= s) {
    for (; i < RING.length && CUM[i] < e; i++) pts.push(RING[i]);
  } else {
    for (; i < RING.length; i++) pts.push(RING[i]);
    for (i = 1; CUM[i] < e && i < RING.length; i++) pts.push(RING[i]);
  }
  pts.push(pointAt(e));
  return pts;
}
function spanLen(s, e) { return ((e - s) % TOTAL + TOTAL) % TOTAL; }
function spanMid(s, e) { return (s + spanLen(s, e) / 2) % TOTAL; }
function fmtKm(m) { return (m / 1000).toFixed(m < 9950 ? 2 : 1); }

/* sections enriched */
const SECTIONS = TRACK.sections.map((s, i) => {
  const c = CONTENT.sections[s.name] || {};
  return { i, name: s.name, display: c.display || s.name, startM: s.startM, endM: s.endM,
           lenM: spanLen(s.startM, s.endM), midM: spanMid(s.startM, s.endM),
           type: c.type || "", text: c.text || "", origin: c.origin || "", sources: c.sources || [] };
});

/* elevation lookup (TRACK.elev = [[km, m], ...]) */
const ELEV = TRACK.elev;
function elevAt(m) {
  const km = (((m % TOTAL) + TOTAL) % TOTAL) / 1000;
  let lo = 0, hi = ELEV.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; (ELEV[mid][0] < km) ? lo = mid + 1 : hi = mid; }
  const i = Math.max(1, lo);
  const t = (km - ELEV[i - 1][0]) / Math.max(1e-9, ELEV[i][0] - ELEV[i - 1][0]);
  return ELEV[i - 1][1] + (ELEV[i][1] - ELEV[i - 1][1]) * Math.min(1, Math.max(0, t));
}
function sectionElevStats(sec) {
  const a = sec.startM / 1000, b = sec.endM / 1000;
  const pts = ELEV.filter(p => (sec.endM >= sec.startM) ? (p[0] >= a && p[0] <= b) : (p[0] >= a || p[0] <= b));
  if (pts.length < 2) return null;
  let mn = Infinity, mx = -Infinity, maxG = 0;
  for (const p of pts) { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); }
  for (let i = 3; i < pts.length; i++) {
    const dz = pts[i][1] - pts[i - 3][1], dx = (pts[i][0] - pts[i - 3][0]) * 1000;
    if (dx > 0) maxG = Math.max(maxG, Math.abs(dz / dx) * 100);
  }
  const net = pts[pts.length - 1][1] - pts[0][1];
  return { min: mn, max: mx, net, maxG };
}

/* ================= map ================= */
const map = L.map("map", {
  zoomControl: true, minZoom: 12, maxZoom: 18, zoomSnap: 0.25,
  maxBounds: [[50.28, 6.85], [50.43, 7.08]], maxBoundsViscosity: 0.8,
  attributionControl: false,
});
map.createPane("base");   map.getPane("base").style.zIndex = 300;
map.createPane("ctx");    map.getPane("ctx").style.zIndex = 380;
map.createPane("track");  map.getPane("track").style.zIndex = 420;
map.createPane("hilite"); map.getPane("hilite").style.zIndex = 430;
map.createPane("labels"); map.getPane("labels").style.zIndex = 620;
const rBase = L.canvas({ pane: "base" });
const rCtx = L.canvas({ pane: "ctx" });
const rTrack = L.canvas({ pane: "track" });
const rHi = L.canvas({ pane: "hilite" });

/* basemap */
const baseGroup = L.layerGroup();
const BM_STYLE = {
  forest: { fill: "#1c2f1d" },
  grass:  { fill: "#232e1e" },
  urban:  { fill: "#262d34" },
  water:  { fill: "#1a3b4d" },
};
for (const key of ["grass", "forest", "urban", "water"]) {
  for (const ringCoords of (BASEMAP[key] || [])) {
    L.polygon(ringCoords, { renderer: rBase, pane: "base", stroke: false,
      fillColor: BM_STYLE[key].fill, fillOpacity: 1, interactive: false }).addTo(baseGroup);
  }
}
for (const arr of BASEMAP.roadsMinor || [])
  L.polyline(arr, { renderer: rBase, pane: "base", color: "#2c343d", weight: 1.4, interactive: false }).addTo(baseGroup);
for (const arr of BASEMAP.roadsMajor || [])
  L.polyline(arr, { renderer: rBase, pane: "base", color: "#3d4854", weight: 2.4, interactive: false }).addTo(baseGroup);
baseGroup.addTo(map);

/* context: GP circuit + historic Steilstrecke */
const gpGroup = L.layerGroup(
  (TRACK.gp || []).map(arr => L.polyline(arr, { renderer: rCtx, pane: "ctx", color: "#5a6673", weight: 3, opacity: .8, interactive: false }))
).addTo(map);
const steilGroup = L.layerGroup(
  (TRACK.steil || []).map(arr => L.polyline(arr, { renderer: rCtx, pane: "ctx", color: "#b98a3a", weight: 2.5, dashArray: "5 6", opacity: .9, interactive: false })
    .bindTooltip("Steilstrecke (1927) — disused 27% concrete test ramp", { className: "sec-tip", sticky: true }))
).addTo(map);
steilGroup.eachLayer(l => l.options.interactive = true);

/* track */
L.polyline(RING, { renderer: rTrack, pane: "track", color: "#f5f7f9", weight: 9, opacity: .95, interactive: false }).addTo(map);
const trackLine = L.polyline(RING, { renderer: rTrack, pane: "track", color: "#e23d3d", weight: 5, interactive: true }).addTo(map);
trackLine.on("click", ev => {
  const m = nearestOnRing(ev.latlng);
  const sec = SECTIONS.find(s => (s.endM >= s.startM) ? (m >= s.startM && m <= s.endM) : (m >= s.startM || m <= s.endM));
  if (sec) selectSection(sec.i);
});
function nearestOnRing(latlng) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < RING.length; i += 2) {
    const d = (RING[i][0] - latlng.lat) ** 2 + (RING[i][1] - latlng.lng) ** 2 * 0.41;
    if (d < bd) { bd = d; best = i; }
  }
  return CUM[best];
}

/* start/finish marker */
const sfIcon = L.divIcon({ className: "sf-marker", iconSize: [26, 26], iconAnchor: [13, 13], html:
  `<svg width="26" height="26" viewBox="0 0 26 26"><rect x="1" y="1" width="24" height="24" rx="5" fill="#14181d" stroke="#f5f7f9" stroke-width="1.6"/>` +
  `<g fill="#f5f7f9"><rect x="5" y="5" width="4" height="4"/><rect x="13" y="5" width="4" height="4"/><rect x="9" y="9" width="4" height="4"/><rect x="17" y="9" width="4" height="4"/><rect x="5" y="13" width="4" height="4"/><rect x="13" y="13" width="4" height="4"/><rect x="9" y="17" width="4" height="4"/><rect x="17" y="17" width="4" height="4"/></g></svg>` });
L.marker(pointAt(0), { icon: sfIcon, zIndexOffset: 900 }).addTo(map)
  .bindTooltip("Start/Finish — T13 (official 20.832 km lap timed here)", { className: "sec-tip" });

/* km marks */
const kmGroup = L.layerGroup().addTo(map);
for (let k = 1; k < TOTAL / 1000; k++) {
  const p = pointAt(k * 1000);
  L.circleMarker(p, { renderer: rTrack, pane: "track", radius: 2.5, color: "#fff", fillColor: "#14181d", fillOpacity: 1, weight: 1.2, interactive: false }).addTo(kmGroup);
  L.marker(p, { pane: "labels", interactive: false, icon: L.divIcon({ className: "km-label", html: `<span>${k}</span>`, iconAnchor: [-6, 14] }) }).addTo(kmGroup);
}

/* section markers */
const secMarkers = SECTIONS.map(sec => {
  const icon = L.divIcon({ className: "sec-marker", html: String(sec.i + 1), iconSize: [20, 20], iconAnchor: [10, 10] });
  const mk = L.marker(pointAt(sec.midM), { icon, zIndexOffset: 500 })
    .bindTooltip(`${sec.i + 1} · ${sec.display}`, { className: "sec-tip", direction: "top", offset: [0, -10] })
    .on("click", () => selectSection(sec.i));
  mk.addTo(map);
  return mk;
});

/* village labels (kind from OSM place=* via Protomaps kind_detail) */
const labelGroup = L.layerGroup().addTo(map);
for (const p of TRACK.places || []) {
  if (!["town", "village", "hamlet", "suburb"].includes(p.kind)) continue;
  const cls = (p.kind === "town" || p.kind === "village") ? "town" : "hamlet";
  L.marker([p.lat, p.lon], { pane: "labels", interactive: false,
    icon: L.divIcon({ className: `place-label ${cls}`, html: `<span>${p.name}</span>`, iconAnchor: [0, 6] }) }).addTo(labelGroup);
}

/* highlight layer */
let hiLine = null, hoverDot = null;
function highlight(sec) {
  if (hiLine) { map.removeLayer(hiLine); hiLine = null; }
  if (sec) {
    hiLine = L.polyline(subLine(sec.startM, sec.endM),
      { renderer: rHi, pane: "hilite", color: "#ffb547", weight: 7, opacity: .95, interactive: false }).addTo(map);
  }
}
function setHoverDot(m) {
  if (m == null) { if (hoverDot) { map.removeLayer(hoverDot); hoverDot = null; } return; }
  const p = pointAt(m);
  if (!hoverDot) hoverDot = L.circleMarker(p, { renderer: rHi, pane: "hilite", radius: 6, color: "#fff", weight: 2, fillColor: "#56c1d6", fillOpacity: 1, interactive: false }).addTo(map);
  else hoverDot.setLatLng(p);
}

map.fitBounds(trackLine.getBounds(), { padding: [30, 30] });

/* zoom-dependent visibility */
function onZoom() {
  const z = map.getZoom();
  document.querySelectorAll(".km-label").forEach(el => el.style.display = z >= 14.25 ? "" : "none");
  document.querySelectorAll(".place-label").forEach(el => {
    const town = el.classList.contains("town");
    el.style.display = (z >= (town ? 12 : 14)) ? "" : "none";
  });
  secMarkers.forEach((mk, i) => {
    const el = mk.getElement(); if (!el) return;
    const big = z >= 14.5, mid = z >= 13;
    el.style.width = el.style.height = (big ? 24 : mid ? 20 : 15) + "px";
    el.style.marginLeft = el.style.marginTop = -(big ? 12 : mid ? 10 : 7.5) + "px";
    el.style.fontSize = (big ? 11 : mid ? 10 : 8.5) + "px";
  });
}
map.on("zoomend", onZoom);

/* OSM tiles toggle */
let osmLayer = null;
function setOsm(on) {
  if (on && !osmLayer) {
    let errs = 0;
    osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, opacity: 1 });
    osmLayer.on("tileerror", () => {
      if (++errs === 5) { // offline or blocked: fall back to the built-in basemap
        setOsm(false);
        const cb = document.querySelector("#ly-osm");
        if (cb) cb.checked = false;
      }
    });
    osmLayer.addTo(map);
    map.removeLayer(baseGroup);
  } else if (!on && osmLayer) {
    map.removeLayer(osmLayer); osmLayer = null;
    baseGroup.addTo(map);
  }
}

/* ================= sidebar ================= */
const $ = sel => document.querySelector(sel);
const statbar = $("#statbar");
[
  `<span class="chip"><b>${CONTENT.facts.officialLengthKm} km</b> lap</span>`,
  `<span class="chip"><b>73</b> corners</span>`,
  `<span class="chip"><b>320→617 m</b> elevation</span>`,
  `<span class="chip"><b>17%</b> max gradient</span>`,
  `<span class="chip">opened <b>1927</b></span>`,
].forEach(h => statbar.insertAdjacentHTML("beforeend", h));

/* tabs */
const panes = { explore: $("#tab-explore"), records: $("#tab-records"), history: $("#tab-history"), about: $("#tab-about"), detail: $("#tab-detail") };
function showPane(name) {
  Object.values(panes).forEach(p => p.classList.remove("active"));
  panes[name].classList.add("active");
  document.querySelectorAll(".tab").forEach(t => {
    const on = t.dataset.tab === (name === "detail" ? "explore" : name);
    t.classList.toggle("active", on);
    t.setAttribute("aria-selected", on);
  });
}
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => { deselect(); showPane(t.dataset.tab); }));

/* section list */
const listEl = $("#section-list");
SECTIONS.forEach(sec => {
  const li = document.createElement("li");
  li.dataset.i = sec.i;
  li.innerHTML = `<span class="sec-num">${sec.i + 1}</span><span class="sec-name">${sec.display}</span>` +
                 `<span class="sec-km">km ${fmtKm(sec.startM)}</span>` +
                 (sec.type ? `<span class="sec-type">${sec.type}</span>` : "");
  li.addEventListener("click", () => selectSection(sec.i));
  listEl.appendChild(li);
});
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
$("#search").addEventListener("input", ev => {
  const q = norm(ev.target.value.trim());
  listEl.querySelectorAll("li").forEach(li => {
    const sec = SECTIONS[+li.dataset.i];
    li.style.display = !q || norm(sec.display + " " + sec.name + " " + sec.type).includes(q) ? "" : "none";
  });
});

/* detail */
let selected = -1;
function selectSection(i, opts = {}) {
  selected = i;
  const sec = SECTIONS[i];
  listEl.querySelectorAll("li").forEach(li => li.classList.toggle("active", +li.dataset.i === i));
  secMarkers.forEach((mk, j) => { const el = mk.getElement(); if (el) el.classList.toggle("sel", j === i); });
  highlight(sec);
  drawElev();
  const st = sectionElevStats(sec);
  const body = $("#detail-body");
  body.innerHTML =
    `<div class="detail-kicker">Section ${i + 1} of ${SECTIONS.length}</div>` +
    `<h2>${sec.display}</h2>` +
    `<div class="detail-meta">km ${fmtKm(sec.startM)} – ${fmtKm(sec.endM)} · ${sec.type || "track section"}</div>` +
    `<div class="detail-stats">` +
      `<div class="dstat"><span class="v">${Math.round(sec.lenM)} m</span><span class="l">length</span></div>` +
      (st ? `<div class="dstat"><span class="v">${Math.round(st.min)}–${Math.round(st.max)} m</span><span class="l">elevation</span></div>` +
            `<div class="dstat"><span class="v">${st.net >= 0 ? "+" : ""}${Math.round(st.net)} m</span><span class="l">net change</span></div>` +
            `<div class="dstat"><span class="v">≈${st.maxG.toFixed(1)}%</span><span class="l">max grade*</span></div>` : "") +
    `</div>` +
    (sec.text ? `<p>${sec.text}</p>` : "") +
    (sec.origin ? `<div class="origin"><b>Name:</b> ${sec.origin}</div>` : "") +
    (st ? `<p style="color:var(--ink-3);font-size:11px">*Terrain-derived (EU-DEM), smoothed — indicative, not a survey value.</p>` : "") +
    (sec.sources.length ? `<div class="src-head">Sources</div><ul class="src-list">` +
      sec.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("") + `</ul>` : "");
  showPane("detail");
  if (!opts.noZoom) {
    const b = L.latLngBounds(subLine(sec.startM, sec.endM));
    map.fitBounds(b.pad(0.6), { maxZoom: 15.5 });
  }
  if (window.innerWidth <= 860 && !opts.noSidebar) $("#sidebar").classList.add("open");
}
function deselect() {
  selected = -1;
  highlight(null);
  drawElev();
  listEl.querySelectorAll("li").forEach(li => li.classList.remove("active"));
  secMarkers.forEach(mk => { const el = mk.getElement(); if (el) el.classList.remove("sel"); });
}
$("#back-btn").addEventListener("click", () => { deselect(); showPane("explore"); });
$("#prev-btn").addEventListener("click", () => selectSection((selected + SECTIONS.length - 1) % SECTIONS.length));
$("#next-btn").addEventListener("click", () => selectSection((selected + 1) % SECTIONS.length));

/* records */
(function renderRecords() {
  const el = panes.records;
  let h = `<div class="rec-note">${CONTENT.recordsNote} ` +
    CONTENT.recordsNoteSources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join(" · ") + `</div>`;
  for (const g of CONTENT.records) {
    h += `<div class="rec-group"><h3>${g.group}</h3>`;
    for (const r of g.items) {
      h += `<div class="rec"><div class="rec-top"><span class="rec-time">${r.time}</span><span class="rec-driver">${r.driver}</span><span class="rec-date">${r.date}</span></div>` +
           `<div class="rec-car">${r.vehicle}</div>` +
           `<div class="rec-note2">${r.note}</div>` +
           `<div class="rec-src">${r.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join("")}</div></div>`;
    }
    h += `</div>`;
  }
  el.innerHTML = h;
})();

/* history */
(function renderHistory() {
  panes.history.innerHTML = `<ul class="tl">` + CONTENT.history.map(ev =>
    `<li><span class="y">${ev.year}</span><p>${ev.text}</p><div class="rec-src">` +
    ev.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join("") + `</div></li>`).join("") + `</ul>`;
})();

/* about */
(function renderAbout() {
  const f = CONTENT.facts, m = CONTENT.methodology;
  panes.about.innerHTML =
    `<h3>The track</h3>
     <p>The Nürburgring Nordschleife (“North Loop”) is a ${f.officialLengthKm} km race track winding through the Eifel mountains around the medieval castle of Nürburg, Germany. Opened on ${f.opened}, it has ${f.corners}, climbs and falls through ${f.elevation}, with gradients up to ${f.gradients.replace("max. ", "")}. ${f.nickname}</p>
     <p>${f.lengthNote}</p>
     <h3>Today</h3>
     <p>The Nordschleife hosts public <i>Touristenfahrten</i> sessions, the manufacturer “industry pool” test days, the NLS endurance series (24.358 km combined layout) and the Nürburgring 24 Hours (25.378 km combined layout).</p>
     <h3>Data & methodology</h3>
     <p>${m.geometry}</p><p>${m.elevation}</p><p>${m.positions}</p>
     <p>Computed centerline length of this map’s geometry: <b>${TRACK.geometryLengthKm} km</b> (official lap: ${f.officialLengthKm} km).</p>
     <h3>Primary sources</h3>
     <ul class="src-list">` + f.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join("") + `</ul>
     <p>Full per-corner and per-record citations appear on each corner card and record entry. The complete research notes live in the <code>research/</code> folder of this repository.</p>
     <h3>Attribution</h3>
     <p>${TRACK.attribution}</p>`;
})();

/* ================= elevation chart ================= */
const elevChart = $("#elev-chart");
let elevGeom = null;
function drawElev() {
  const W = elevChart.clientWidth || 600, H = elevChart.clientHeight || 110;
  const P = { l: 44, r: 14, t: 8, b: 18 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const kmMax = TOTAL / 1000;
  let eMin = Infinity, eMax = -Infinity;
  for (const p of ELEV) { eMin = Math.min(eMin, p[1]); eMax = Math.max(eMax, p[1]); }
  const y0 = Math.floor((eMin - 15) / 50) * 50, y1 = Math.ceil((eMax + 15) / 50) * 50;
  const X = km => P.l + km / kmMax * iw;
  const Y = e => P.t + (1 - (e - y0) / (y1 - y0)) * ih;
  elevGeom = { X, Y, P, iw, ih, kmMax };
  let grid = "", xlab = "", ylab = "";
  for (let e = y0 + 50; e < y1; e += 50) {
    grid += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(e)}" y2="${Y(e)}" stroke="#242d36" stroke-width="1"/>`;
    ylab += `<text x="${P.l - 6}" y="${Y(e) + 3.5}" fill="#7c8794" font-size="9.5" text-anchor="end" font-family="ui-monospace,monospace">${e} m</text>`;
  }
  for (let k = 0; k <= Math.floor(kmMax); k += 2) {
    xlab += `<text x="${X(k)}" y="${H - 5}" fill="#7c8794" font-size="9.5" text-anchor="middle" font-family="ui-monospace,monospace">${k}${k === 0 ? " km" : ""}</text>`;
    grid += `<line x1="${X(k)}" x2="${X(k)}" y1="${P.t}" y2="${P.t + ih}" stroke="#1e262e" stroke-width="1"/>`;
  }
  const pts = ELEV.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
  const area = `${P.l},${Y(ELEV[0][1]).toFixed(1)} ${pts} ${X(ELEV[ELEV.length - 1][0]).toFixed(1)},${P.t + ih} ${P.l},${P.t + ih}`;
  let band = "";
  if (selected >= 0) {
    const s = SECTIONS[selected];
    const a = X(s.startM / 1000), b = X(s.endM / 1000);
    band = (s.endM >= s.startM)
      ? `<rect x="${a}" y="${P.t}" width="${Math.max(2, b - a)}" height="${ih}" fill="#ffb547" opacity="0.16"/>`
      : `<rect x="${a}" y="${P.t}" width="${X(kmMax) - a}" height="${ih}" fill="#ffb547" opacity="0.16"/><rect x="${P.l}" y="${P.t}" width="${b - P.l}" height="${ih}" fill="#ffb547" opacity="0.16"/>`;
  }
  elevChart.innerHTML =
    `<svg width="${W}" height="${H}" role="img" aria-label="Elevation profile of the Nordschleife">` +
    grid + band +
    `<polygon points="${area}" fill="#56c1d6" opacity="0.14"/>` +
    `<polyline points="${pts}" fill="none" stroke="#56c1d6" stroke-width="2"/>` +
    ylab + xlab +
    `<line id="elev-cursor" y1="${P.t}" y2="${P.t + ih}" stroke="#e9edf2" stroke-width="1" opacity="0"/>` +
    `<circle id="elev-dot" r="3.5" fill="#56c1d6" stroke="#fff" stroke-width="1.5" opacity="0"/>` +
    `</svg>`;
}
drawElev();
new ResizeObserver(() => drawElev()).observe(elevChart);

let elevTip = null;
function elevHover(clientX, clientY, active) {
  const svg = elevChart.querySelector("svg");
  if (!svg || !elevGeom) return;
  const rect = svg.getBoundingClientRect();
  const x = clientX - rect.left;
  const { X, Y, P, iw, kmMax } = elevGeom;
  const cursor = svg.querySelector("#elev-cursor"), dot = svg.querySelector("#elev-dot");
  if (!active || x < P.l || x > P.l + iw) {
    cursor.setAttribute("opacity", 0); dot.setAttribute("opacity", 0);
    if (elevTip) { elevTip.remove(); elevTip = null; }
    setHoverDot(null);
    return;
  }
  const km = (x - P.l) / iw * kmMax, m = km * 1000;
  const e = elevAt(m);
  cursor.setAttribute("x1", x); cursor.setAttribute("x2", x); cursor.setAttribute("opacity", 0.4);
  dot.setAttribute("cx", X(km)); dot.setAttribute("cy", Y(e)); dot.setAttribute("opacity", 1);
  setHoverDot(m);
  const sec = SECTIONS.find(s => (s.endM >= s.startM) ? (m >= s.startM && m <= s.endM) : (m >= s.startM || m <= s.endM));
  if (!elevTip) { elevTip = document.createElement("div"); elevTip.className = "elev-tip"; document.body.appendChild(elevTip); }
  elevTip.innerHTML = `${sec ? `<span class="n">${sec.display}</span> · ` : ""}km ${km.toFixed(2)} · ${Math.round(e)} m`;
  const tw = elevTip.offsetWidth;
  elevTip.style.left = Math.min(window.innerWidth - tw - 8, Math.max(8, clientX - tw / 2)) + "px";
  elevTip.style.top = (rect.top - 30) + "px";
}
elevChart.addEventListener("mousemove", ev => elevHover(ev.clientX, ev.clientY, true));
elevChart.addEventListener("mouseleave", () => elevHover(0, 0, false));
elevChart.addEventListener("click", ev => {
  const svg = elevChart.querySelector("svg");
  const rect = svg.getBoundingClientRect();
  const { P, iw, kmMax } = elevGeom;
  const km = (ev.clientX - rect.left - P.l) / iw * kmMax;
  if (km < 0 || km > kmMax) return;
  const m = km * 1000;
  const sec = SECTIONS.find(s => (s.endM >= s.startM) ? (m >= s.startM && m <= s.endM) : (m >= s.startM || m <= s.endM));
  if (sec) selectSection(sec.i);
});
$("#elev-toggle").addEventListener("click", () => {
  const p = $("#elev-panel");
  p.classList.toggle("collapsed");
  $("#elev-toggle").textContent = p.classList.contains("collapsed") ? "▴" : "▾";
});

/* ================= layers menu ================= */
$("#layers-btn").addEventListener("click", () => $("#layers-menu").classList.toggle("hidden"));
document.addEventListener("click", ev => {
  if (!$("#layers-ctl").contains(ev.target)) $("#layers-menu").classList.add("hidden");
});
$("#ly-labels").addEventListener("change", ev => ev.target.checked ? labelGroup.addTo(map) : map.removeLayer(labelGroup));
$("#ly-gp").addEventListener("change", ev => ev.target.checked ? gpGroup.addTo(map) : map.removeLayer(gpGroup));
$("#ly-steil").addEventListener("change", ev => ev.target.checked ? steilGroup.addTo(map) : map.removeLayer(steilGroup));
$("#ly-km").addEventListener("change", ev => ev.target.checked ? kmGroup.addTo(map) : map.removeLayer(kmGroup));
$("#ly-osm").addEventListener("change", ev => setOsm(ev.target.checked));

/* ================= lap tour ================= */
const tour = { on: false, playing: false, m: 0, raf: null, last: 0 };
const carIcon = L.divIcon({ className: "", iconSize: [18, 18], iconAnchor: [9, 9], html:
  `<div style="width:18px;height:18px;border-radius:50%;background:#e23d3d;border:3px solid #fff;box-shadow:0 0 10px 2px rgba(226,61,61,.8)"></div>` });
let carMarker = null;
function tourSpeed() { return (+$("#tour-speed").value) * 20; } // m/s
function tourStart() {
  if (tour.on) return;
  tour.on = true; tour.playing = true; tour.m = 0; tour.last = 0;
  $("#tour-hud").classList.remove("hidden");
  $("#tour-play").textContent = "⏸";
  carMarker = L.marker(pointAt(0), { icon: carIcon, zIndexOffset: 1200, interactive: false }).addTo(map);
  map.setView(pointAt(0), 15.5, { animate: true });
  if (window.innerWidth <= 860) $("#sidebar").classList.remove("open");
  tour.raf = requestAnimationFrame(tourStep);
}
let tourLastSec = -1;
function tourStep(ts) {
  if (!tour.on) return;
  if (tour.playing) {
    const dt = tour.last ? Math.min(0.1, (ts - tour.last) / 1000) : 0;
    tour.m += tourSpeed() * dt;
    if (tour.m >= TOTAL) tour.m -= TOTAL;
    const p = pointAt(tour.m);
    carMarker.setLatLng(p);
    map.panTo(p, { animate: false });
    setHoverDot(tour.m);
    const e = elevAt(tour.m);
    const kmh = Math.round(tourSpeed() * 3.6);
    $("#tour-stats").textContent = `km ${(tour.m / 1000).toFixed(2)} · ${Math.round(e)} m · ${kmh} km/h`;
    const si = SECTIONS.findIndex(s => (s.endM >= s.startM) ? (tour.m >= s.startM && tour.m <= s.endM) : (tour.m >= s.startM || tour.m <= s.endM));
    if (si >= 0 && si !== tourLastSec) {
      tourLastSec = si;
      $("#tour-section").textContent = `${si + 1} · ${SECTIONS[si].display}`;
      selectSection(si, { noZoom: true, noSidebar: true });
    } else if (si < 0 && tourLastSec >= 0) {
      $("#tour-section").textContent = "—";
    }
  }
  tour.last = ts;
  tour.raf = requestAnimationFrame(tourStep);
}
function tourStop() {
  tour.on = false; tour.playing = false; tourLastSec = -1;
  cancelAnimationFrame(tour.raf);
  $("#tour-hud").classList.add("hidden");
  if (carMarker) { map.removeLayer(carMarker); carMarker = null; }
  setHoverDot(null);
  map.fitBounds(trackLine.getBounds(), { padding: [30, 30] });
}
$("#tour-btn").addEventListener("click", () => { tourStart(); if (window.innerWidth <= 860) $("#sidebar").classList.remove("open"); });
$("#tour-play").addEventListener("click", () => { tour.playing = !tour.playing; $("#tour-play").textContent = tour.playing ? "⏸" : "▶"; });
$("#tour-exit").addEventListener("click", tourStop);
$("#tour-speed").addEventListener("input", () => $("#tour-speed-val").textContent = $("#tour-speed").value + "×");

/* ================= keyboard & misc ================= */
document.addEventListener("keydown", ev => {
  if (ev.target.matches("input,textarea")) return;
  if (ev.key === "Escape") { if (tour.on) tourStop(); else { deselect(); showPane("explore"); } }
  else if (ev.key === "ArrowRight") selectSection(selected < 0 ? 0 : (selected + 1) % SECTIONS.length);
  else if (ev.key === "ArrowLeft") selectSection(selected < 0 ? SECTIONS.length - 1 : (selected + SECTIONS.length - 1) % SECTIONS.length);
  else if (ev.key === "t" || ev.key === "T") tour.on ? tourStop() : tourStart();
  else if (ev.key === " " && tour.on) { ev.preventDefault(); $("#tour-play").click(); }
});
$("#side-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

onZoom();
