/* Curated, cited content for the Nordschleife interactive map.
   Every factual claim carries source URLs (see also research/ in the repo).
   Research date: July 2026. Geometry-derived km positions are computed from
   OSM-derived centerline data and are approximate (lap start = T13 section). */

const CONTENT = {
  facts: {
    officialLengthKm: 20.832,
    /* short values for the header stat chips (full strings below carry context) */
    chips: { corners: "73", elevation: "320→617 m", maxGradient: "17%", opened: "1927" },
    lengthNote:
      "20.832 km is the full Nordschleife lap used for official record attempts (flying start, timed at T13). Industry/press laps were historically quoted on a ~20.6 km variant; “Bridge to Gantry” tourist timing covers ~19.1 km.",
    corners: "73 official corners (33 left, 40 right)",
    elevation: "~320 m at Breidscheid to ~617 m near Hohe Acht (≈300 m difference)",
    gradients: "max. 17% uphill, 11% downhill",
    opened: "18 June 1927",
    nickname:
      "“The Green Hell” — coined by Jackie Stewart after winning the 1968 German GP in fog and torrential rain.",
    sources: [
      { label: "Nürburgring — Nordschleife", url: "https://www.nuerburgring.de/en/fans-info/race-tracks/nordschleife.html" },
      { label: "Wikipedia — Nürburgring", url: "https://en.wikipedia.org/wiki/N%C3%BCrburgring" },
      { label: "ADAC NLS — The Nürburgring", url: "https://www.nuerburgring-langstrecken-serie.de/en/the-nurburgring/" },
      { label: "Nordschleife-BtG — Gradient of altitude", url: "https://www.nordschleife-btg.net/nordschleife/gradient-of-altitude/" },
      { label: "Formula1.com — Stewart conquers the Green Hell", url: "https://www.formula1.com/en/latest/article/f1s-best-drives-1-stewart-conquers-the-green-hell.466hYmp1yJAiNY0vZXpx0r" }
    ]
  },

  /* Corner/section guide. Keys match OSM section names in TRACK.sections. */
  sections: {
    "T13": {
      display: "T13 / Start–Finish",
      type: "Grandstand straight · timing line",
      text: "The T13 straight carries the official start/finish of the 20.832 km lap. Since 2019 the Nürburgring certifies record laps here: flying start, notary supervision, calibrated timing, TÜV-verified production conformity.",
      origin: "“T13” refers to the historic Tribune 13 grandstand section.",
      sources: [
        { label: "Nürburgring — Record drives", url: "https://nuerburgring.de/info/nuerburgring/records?locale=en" },
        { label: "Tarmac Timewarp — Hohenrain/T13", url: "https://tarmac-timewarp.com/section-1-panos/" }
      ]
    },
    "Sabine-Schmitz-Kurve": {
      type: "Left-hander",
      text: "First Nordschleife corner after the GP-circuit junction. Officially named in September 2021 for Sabine Schmitz, “Queen of the Nordschleife” and first woman to win the Nürburgring 24 Hours — only the third renaming in track history.",
      origin: "Named for Sabine Schmitz (1969–2021), who grew up in Nürburg.",
      sources: [
        { label: "Nürburgring — Sabine-Schmitz-Kurve", url: "https://nuerburgring.de/news/besondere-ehre-fur-die-botschafterin-des-nurburgrings-nordschleife-bekommt-sabine-schmitz-kurve" },
        { label: "ADAC NLS announcement (2021)", url: "https://www.nuerburgring-langstrecken-serie.de/language/de/2021/06/18/nordschleife-bekommt-sabine-schmitz-kurve/" }
      ]
    },
    "Hatzenbogen": {
      type: "Fast left sweep",
      text: "The fast left-hand bow that funnels the field into the Hatzenbach esses — commit early, because the S-complex arrives immediately.",
      origin: "The “bow” (Bogen) leading into Hatzenbach.",
      sources: [
        { label: "Nordschleife-BtG — Hatzenbach racing line", url: "https://www.nordschleife-btg.net/racing-line/hatzenbach-and-hocheichen/" }
      ]
    },
    "Hatzenbach": {
      type: "Right-left-right S-complex",
      text: "The densest corner sequence on the track — a twisting chain of esses with high inside kerbs and a small crest before the final left. A classic early-lap accident spot for the over-eager; rhythm and patience matter more than power.",
      origin: "From a local stream/field name: “hatzen” (to hunt) + “Bach” (brook).",
      sources: [
        { label: "nring.info — Hatzenbach", url: "https://nring.info/nurburgring-nordschleife-corners/hatzenbach/" },
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Hocheichen": {
      type: "Right into downhill-uphill left",
      text: "A long right-hander flowing into a tricky left with strong elevation change — the car goes light downhill, then compresses as the road climbs again toward Quiddelbacher Höhe.",
      origin: "“High Oaks” — for the large oak trees that stood on the left of the track.",
      sources: [
        { label: "Nordschleife-BtG — Hocheichen", url: "https://www.nordschleife-btg.net/racing-line/hatzenbach-and-hocheichen/" },
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Quiddelbacher Höhe": {
      type: "Flat-out crest / jump",
      text: "Uphill crest where the track crosses a bridge over the B257 — cars go light or airborne at speed. Resurfaced and levelled together with Flugplatz after the 2015 accident.",
      origin: "“Quiddelbach height” — the high point near the village of Quiddelbach.",
      sources: [
        { label: "Oversteer48 — Nürburgring jumps", url: "https://oversteer48.com/nurburgring-jump/" },
        { label: "Tarmac Timewarp — section guide", url: "https://tarmac-timewarp.com/section-3-drone/" }
      ]
    },
    "Flugplatz": {
      type: "High-speed right over blind crest",
      text: "Despite the name, the famous “jump” is just before it — Flugplatz itself is a very fast right-hander with a blind entry. In the March 2015 VLN opener a GT3 car took off here and cleared the fence, killing a spectator and prompting fencing changes and resurfacing.",
      origin: "“Airfield” — a small glider airfield lay beside the track.",
      sources: [
        { label: "nring.info — Flugplatz", url: "https://nring.info/nurburgring-nordschleife-corners/flugplatz/" },
        { label: "RACER — 2015 spectator fatality", url: "https://racer.com/2015/03/28/spectator-killed-in-nurburgring-crash" },
        { label: "Motorsport.com — 2015 safety changes", url: "https://www.motorsport.com/NLS/news/top-stories-of-2015-15-fatal-nordschleife-crash-prompts-safety-changes/664558/" }
      ]
    },
    "Schwedenkreuz": {
      type: "Very fast banked left",
      text: "Approached at 200+ km/h over a crest that makes the car go light — widely called the most dangerous corner on the ’Ring. Slightly banked, bumpy on the outside, and utterly unforgiving of a lifted throttle at the wrong moment.",
      origin: "“Swedish Cross” — a 1638 stone cross beside the track commemorating Adenau tax collector Hans Friedrich Datenberg, murdered by Swedish soldiers in the Thirty Years’ War.",
      sources: [
        { label: "nring.info — Schwedenkreuz", url: "https://nring.info/nurburgring-nordschleife-corners/schwedenkreuz/" },
        { label: "BridgeToGantry — most dangerous corner?", url: "https://www.bridgetogantry.com/video-is-schwedenkreuz-the-most-dangerous-corner-on-the-nurburgring/" }
      ]
    },
    "Aremberg": {
      type: "90° right",
      text: "A medium-speed right-hander at the bottom of the hill after Schwedenkreuz. Get the exit right — it launches the flat-out plunge under the bridge into the Fuchsröhre.",
      origin: "Named after the nearby Aremberg hill, castle and village.",
      sources: [
        { label: "Nordschleife-BtG — Schwedenkreuz & Aremberg", url: "https://www.nordschleife-btg.net/racing-line/schwedenkreuz-and-aremberg/" }
      ]
    },
    "Fuchsröhre": {
      type: "Downhill plunge & compression",
      text: "A plunging left-right sequence dropping at up to ~11% — the steepest descent on the track — into a violent compression at the bottom, then steeply uphill toward Adenauer Forst. Among the highest sustained speeds and strongest vertical G-loads of the lap.",
      origin: "“Fox tube” — during 1925–27 construction a fox took refuge in a drainage pipe here.",
      sources: [
        { label: "Circuits of the Past — Fuchsröhre", url: "https://www.circuitsofthepast.com/fuchsrohre-nurburgring/" },
        { label: "Oversteer48 — Foxhole", url: "https://oversteer48.com/nurburgring-foxhole/" }
      ]
    },
    "Adenauer Forst": {
      type: "Blind chicane in the forest",
      text: "A fast right, then an unexpectedly tight blind left over a crest, then right — effectively a chicane hidden by the brow. One of the most common tourist-driver crash spots on the whole circuit.",
      origin: "“Adenau Forest” — woodland belonging to the town of Adenau.",
      sources: [
        { label: "Oversteer48 — Adenauer Forst", url: "https://oversteer48.com/adenauer-forst/" },
        { label: "autoevolution — the corner that makes cars fly", url: "https://www.autoevolution.com/news/nurburgring-s-adenauer-forst-the-corner-that-makes-cars-fly-108304.html" }
      ]
    },
    "Metzgesfeld": {
      type: "High-speed left pair",
      text: "A high-speed left followed by a slower second left, beginning the long downhill run toward Adenau. Braking while turning is the exam question here.",
      origin: "A field name, from the family that once owned the land.",
      sources: [
        { label: "Nordschleife erfahren — Metzgesfeld & Kallenhard", url: "https://www.nordschleife-erfahren.de/streckenbeschreibung/metzgesfeld-und-kallenhard/" }
      ]
    },
    "Kallenhard": {
      type: "Tight downhill right",
      text: "A tight, late-apex downhill right opening into a long multi-part right. Easy to out-brake yourself — the road keeps falling away through the exit.",
      origin: "Named for the forested Kallenhard hill (471 m).",
      sources: [
        { label: "nring.info — Kallenhard", url: "https://nring.info/nurburgring-nordschleife-corners/kallenhard/" },
        { label: "Nordschleife-BtG — Kallenhard", url: "https://www.nordschleife-btg.net/racing-line/kallenhard/" }
      ]
    },
    "Spiegelkurve": {
      type: "Right (part of the Kallenhard run)",
      text: "“Mirror corner” — drivers used to scrape their mirrors on the hedges that once lined it. Today it is the middle of the long right-hand sequence dropping toward Wehrseifen.",
      origin: "Unofficial nickname from the mirror-scraping hedges.",
      sources: [
        { label: "GetSpeed — famous corners and their stories", url: "https://www.getspeed-racetaxi.de/en/blog-artikel/the-most-famous-corners-on-the-nurburgring----and-their-stories" }
      ]
    },
    "Dreifach-Rechts": {
      type: "Triple right",
      text: "The “triple right” — three linked right-handers of decreasing radius completing the descent toward Wehrseifen. Patience: the corner keeps going longer than it looks.",
      origin: "Literally “triple right”.",
      sources: [
        { label: "Nordschleife-BtG — Kallenhard section", url: "https://www.nordschleife-btg.net/racing-line/kallenhard/" }
      ]
    },
    "Wehrseifen": {
      type: "Slowest corner on the track",
      text: "A very tight downhill left-right combination at the end of the long descent — the slowest point of the Nordschleife. A favourite photo spot, with the village of Adenau just beyond the trees.",
      origin: "From local topography — “Seifen” is a regional term for a wet stream hollow.",
      sources: [
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" },
        { label: "Nordschleife-BtG — Wehrseifen & Ex-Mühle", url: "https://www.nordschleife-btg.net/racing-line/wehrseifen-and-exmuehle/" }
      ]
    },
    "Breidscheid": {
      type: "Downhill left at the valley floor",
      text: "Fast downhill left kink at the Adenau bridge — the lowest point of the circuit at about 320 m above sea level. From here the track climbs almost continuously for ~5 km back up the Eifel ridge.",
      origin: "Named after the Breidscheid district of Adenau, where the track crosses the public road.",
      sources: [
        { label: "Nordschleife-BtG — gradient of altitude", url: "https://www.nordschleife-btg.net/nordschleife/gradient-of-altitude/" },
        { label: "Tarmac Timewarp — Breidscheid", url: "https://tarmac-timewarp.com/section-7-video-2/" }
      ]
    },
    "Ex-Mühle": {
      type: "Steep uphill right",
      text: "The steep right-hander immediately after the bridge, beginning the long climb out of the Adenau valley. Grip is plentiful — the hill presses the car into the road — but a slow exit costs time all the way to Bergwerk.",
      origin: "“Former mill” — a water mill once stood beside the track here.",
      sources: [
        { label: "Nordschleife-BtG — Wehrseifen & Ex-Mühle", url: "https://www.nordschleife-btg.net/racing-line/wehrseifen-and-exmuehle/" },
        { label: "Oversteer48 — Bergwerk", url: "https://oversteer48.com/nurburgring-nordschleife-bergwerk/" }
      ]
    },
    "Lauda-Links": {
      type: "Fast left kink · 1976 Lauda crash site",
      text: "The fast left kink between Ex-Mühle and Bergwerk. On lap 2 of the 1976 German GP, Niki Lauda’s Ferrari 312T2 snapped right here, hit the embankment and burst into flames; drivers Edwards, Lunger, Ertl and Merzario pulled him from the fire. The crash ended Formula 1 racing on the Nordschleife.",
      origin: "Unofficially named for Niki Lauda’s 1 August 1976 accident.",
      sources: [
        { label: "nring.info — Lauda-Links", url: "https://nring.info/nurburgring-nordschleife-corners/lauda-links-extal/" },
        { label: "Wikipedia — 1976 German Grand Prix", url: "https://en.wikipedia.org/wiki/1976_German_Grand_Prix" },
        { label: "Jalopnik — 40th-anniversary account", url: "https://www.jalopnik.com/forty-years-ago-f1-drivers-saved-niki-lauda-from-a-fier-1784656102/" }
      ]
    },
    "Bergwerk": {
      type: "Slow-medium right · lap-time critical",
      text: "The corner regularly voted most important for lap time: it launches the ~3 km uphill charge through Kesselchen to the Karussell. A poor exit here is paid for over the longest full-throttle climb of the lap.",
      origin: "“Mine” — a lead-and-silver ore mine operated nearby until the early 1900s.",
      sources: [
        { label: "Oversteer48 — Bergwerk", url: "https://oversteer48.com/nurburgring-nordschleife-bergwerk/" }
      ]
    },
    "Senkenlinks": {
      type: "Fast left in the valley",
      text: "The fast left-hand “dip” that opens the climb from Bergwerk into Kesselchen — taken flat by committed drivers as the valley walls close in.",
      origin: "“Left in the hollow/dip” (Senke = hollow).",
      sources: [
        { label: "Nordschleife-BtG — sections", url: "https://www.nordschleife-btg.net/nordschleife/sections/" }
      ]
    },
    "Kesselchen": {
      type: "Very fast uphill valley section",
      text: "A long, very fast uphill left-curving valley — flat-out for the committed, with the car loaded up over crests and compressions the whole way.",
      origin: "“Little kettle/basin” — the track runs through a natural hollow.",
      sources: [
        { label: "Nordschleife-BtG — sections", url: "https://www.nordschleife-btg.net/nordschleife/sections/" },
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Mutkurve": {
      type: "Fast right (“courage corner”)",
      text: "The “courage corner” — a fast right sweep where commitment is rewarded, on the approach to the Steilstrecke junction and the Karussell climb.",
      origin: "“Mut” = courage.",
      sources: [
        { label: "Circuits of the Past — Steilstrecke", url: "https://www.circuitsofthepast.com/steilstrecke-nurburgring/" }
      ]
    },
    "Klostertal": {
      type: "Fast valley sweepers into tight right",
      text: "Fast sweepers through the “monastery valley” ending in a tight right-hander. Just after it, the disused Steilstrecke — a 1927 concrete test ramp with gradients up to 27% — branches straight up the hillside while the modern track climbs to the Karussell.",
      origin: "“Monastery valley” — a 14th-century Order of St. John community occupied the valley.",
      sources: [
        { label: "Nordschleife-BtG — Klostertal", url: "https://www.nordschleife-btg.net/racing-line/klostertal/" },
        { label: "Circuits of the Past — Steilstrecke", url: "https://www.circuitsofthepast.com/steilstrecke-nurburgring/" }
      ]
    },
    "Karussell": {
      display: "Caracciola-Karussell",
      type: "Banked concrete bowl (~210°)",
      text: "The most photographed corner on the track: drop the inside wheels into the steeply banked concrete-slab bowl and let it sling the car around, teeth rattling over the slab joints. In 1931 Rudolf Caracciola popularised hooking the inside wheels into what was then a drainage ditch; the ditch was later paved into the banking (~17° per enthusiast sources). One of only three corners ever renamed.",
      origin: "Renamed for pre-war Mercedes ace Rudolf Caracciola.",
      sources: [
        { label: "Porsche Newsroom — Banking on the Nordschleife", url: "https://newsroom.porsche.com/en/2020/motorsports/porsche-nuerburgring-nordschleife-caracciola-karussell-22455.html" },
        { label: "Wikipedia — Caracciola Karussell", url: "https://en.wikipedia.org/wiki/Caracciola_Karussell" },
        { label: "BridgeToGantry — the truth behind the Karussell", url: "https://www.bridgetogantry.com/the-truth-behind-the-nurburgrings-karussell/" }
      ]
    },
    "Hohe Acht": {
      type: "Uphill right at the track's high point",
      text: "The climb to Hohe Acht — quoted at up to 17–18% — tops out here at roughly 617 m, the commonly cited highest point of the circuit (some guides place the highest point at the T13/start area instead; our terrain profile shows the two within a few metres).",
      origin: "Named after the Hohe Acht mountain (747 m), the highest peak in the Eifel.",
      sources: [
        { label: "Wikipedia — Hohe Acht", url: "https://en.wikipedia.org/wiki/Hohe_Acht" },
        { label: "nring.info — Hohe Acht", url: "https://nring.info/nurburgring-nordschleife-corners/hohe-acht/" },
        { label: "Nordschleife-BtG — gradient of altitude", url: "https://www.nordschleife-btg.net/nordschleife/gradient-of-altitude/" }
      ]
    },
    "Hedwigshöhe": {
      type: "Fast right on the ridge",
      text: "A fast right-hander over a crest on the high ridge after Hohe Acht, opening the rhythm section down through Wippermann.",
      origin: "“Hedwig’s height” — for Hedwig Creutz, wife of Dr. Otto Creutz, the driving force behind the Nürburgring’s construction.",
      sources: [
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Wippermann": {
      type: "Bumpy left-right-left",
      text: "A bumpy, cambered left-right-left combination — one of the most rhythm-critical sequences on the lap, with notoriously slippery kerbs.",
      origin: "A local family name.",
      sources: [
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Eschbach": {
      type: "Downhill right",
      text: "The right-hander after Wippermann, dropping downhill toward Brünnchen — the name also attaches to the left before it.",
      origin: "Named for a small stream, piped to supply a nearby village.",
      sources: [
        { label: "Oversteer48 — corner names", url: "https://oversteer48.com/nurburgring-corner-names/" }
      ]
    },
    "Brünnchen": {
      type: "Two rights · the spectator amphitheatre",
      text: "Two right-handers — downhill entry, uphill exit — forming a natural amphitheatre. The most famous spectator spot on tourist days, nicknamed the “YouTube corner” for the volume of crash footage filmed here.",
      origin: "“Little well/spring”.",
      sources: [
        { label: "Oversteer48 — Brünnchen", url: "https://oversteer48.com/nurburgring-brunchen/" },
        { label: "Nürburgring Now — viewing points", url: "https://www.nurburgringnow.com/viewing-points" }
      ]
    },
    "Eiskurve": {
      type: "Shaded left",
      text: "A left-hander toward a concealed crest — shaded by overhanging trees, it stays damp or icy long after the rest of the track has dried. Treat it with suspicion in every season.",
      origin: "“Ice curve”.",
      sources: [
        { label: "nring.info — Eiskurve", url: "https://nring.info/nurburgring-nordschleife-corners/eiskurve/" }
      ]
    },
    "Pflanzgarten": {
      type: "Fast downhill · jumps",
      text: "Very fast downhill section with a jump into a left-hander — among the fastest, trickiest and most dangerous parts of the lap. Peter Collins (Ferrari) was fatally injured here in the 1958 German GP.",
      origin: "“Planting garden” — a tree nursery once stood here.",
      sources: [
        { label: "nring.info — Pflanzgarten", url: "https://nring.info/nurburgring-nordschleife-corners/pflanzgarten/" },
        { label: "Nordschleife-BtG — Pflanzgarten", url: "https://www.nordschleife-btg.net/racing-line/pflanzgarten/" }
      ]
    },
    "Sprunghügel": {
      type: "The jump hill",
      text: "Pflanzgarten’s second, bigger jump — taken flat by the brave. Stefan Bellof crashed his Porsche 956 here at ~257 km/h while leading the 1983 Nürburgring 1000 km (he was unhurt).",
      origin: "Literally “jump hill”.",
      sources: [
        { label: "Oversteer48 — Nürburgring jumps", url: "https://oversteer48.com/nurburgring-jump/" },
        { label: "Speedweek — Bellof record lap and crash", url: "https://www.speedweek.com/amp/sportwagen/news/208294/Stefan-Bellof-Rekordrunde-und-Rekord-Crash.html?lang=en" }
      ]
    },
    "Stefan-Bellof-S": {
      type: "Very fast left-right",
      text: "The flat-out left-right combination before Schwalbenschwanz, officially dedicated in August 2013 to Stefan Bellof in honour of his legendary 6:11.13 qualifying lap — one of the very few renamings in track history.",
      origin: "Named for Stefan Bellof (1957–1985).",
      sources: [
        { label: "ADAC NLS — section dedicated to Bellof (2013)", url: "https://www.nuerburgring-langstrecken-serie.de/en/2013/08/11/track-section-at-the-nordschleife-dedicated-to-stefan-bellof/" },
        { label: "Porsche Newsroom — Bellof brothers", url: "https://newsroom.porsche.com/en/history/porsche-stefan-georg-bellof-brothers-956-nuerburgring-nordschleife-6-11-13-minutes-legendary-record-16022.html" }
      ]
    },
    "Schwalbenschwanz": {
      type: "Fast right, then downhill left-right",
      text: "A fast right, short straight, then the downhill left-right “tail” that sets up the Kleines Karussell.",
      origin: "“Swallow’s tail” — construction workers thought the track’s shape here resembled one.",
      sources: [
        { label: "nring.info — Schwalbenschwanz", url: "https://nring.info/nurburgring-nordschleife-corners/schwalbenschwanz/" }
      ]
    },
    "Mini-Karussell": {
      display: "Kleines Karussell",
      type: "Banked concrete bowl (~90°)",
      text: "The Karussell’s little brother — a ~90° banked concrete bowl, faster and slightly less steep, again ridden on the slabs with the inside wheels.",
      origin: "“Little carousel”.",
      sources: [
        { label: "nring.info — Kleines Karussell", url: "https://nring.info/nurburgring-nordschleife-corners/kleines-karussel/" }
      ]
    },
    "Galgenkopf": {
      type: "Long blind right · exit critical",
      text: "A long, partially blind right-hander whose exit speed dictates pace down the entire Döttinger Höhe — nearly 3 km of full throttle ride on this one corner.",
      origin: "“Gallows head” — site of the Counts of Nürburg’s gallows.",
      sources: [
        { label: "nring.info — Galgenkopf", url: "https://nring.info/nurburgring-nordschleife-corners/galgenkopf/" },
        { label: "Nordschleife-BtG — Galgenkopf", url: "https://www.nordschleife-btg.net/racing-line/galgenkopf/" }
      ]
    },
    "Döttinger Höhe": {
      type: "Longest straight (~2.1 km)",
      text: "The Nordschleife’s longest “straight” — gently curving, slightly uphill then flat — where the fastest machinery exceeds 300 km/h. The tourist-drive entrance is here, which is why informal “Bridge to Gantry” timing excludes it.",
      origin: "“Döttingen height” — the high ground near the village of Döttingen.",
      sources: [
        { label: "Tarmac Timewarp — Döttinger Höhe", url: "https://tarmac-timewarp.com/section-15-panos/" },
        { label: "Oversteer48 — how long is the Nordschleife", url: "https://oversteer48.com/how-long-is-the-nurburgring-nordschleife/" }
      ]
    },
    "Antoniusbuche": {
      type: "Flat-out right kink under the bridge",
      text: "A very fast right kink taken near top speed at the end of Döttinger Höhe, where the track passes under a bridge — nerve, aero and faith in the machinery.",
      origin: "“Anthony’s beech” — a huge beech tree stood trackside until 1935; legend says a shrine to St. Antonius stood beneath it.",
      sources: [
        { label: "nring.info — Antoniusbuche", url: "https://nring.info/nurburgring-nordschleife-corners/antoniusbuche/" }
      ]
    },
    "Tiergarten": {
      type: "Fast downhill sweepers",
      text: "Fast downhill left-right sweepers immediately after Antoniusbuche, still near maximum speed — record laps are effectively banked or lost here before braking for Hohenrain.",
      origin: "“Animal garden / deer park”, a local place name.",
      sources: [
        { label: "Tarmac Timewarp — Tiergarten", url: "https://tarmac-timewarp.com/section-1-drone/" }
      ]
    },
    "Hohenrain": {
      type: "Braking chicane before T13",
      text: "The hard-braking right-left chicane that gathers the lap up before the T13 grandstand straight and the junction back toward the GP circuit.",
      origin: "“High ridge/field boundary”.",
      sources: [
        { label: "Tarmac Timewarp — Hohenrain", url: "https://tarmac-timewarp.com/section-1-panos/" }
      ]
    }
  },

  records: [
    {
      group: "Outright",
      items: [
        { time: "5:19.546", driver: "Timo Bernhard", vehicle: "Porsche 919 Hybrid Evo (LMP1)", date: "29 Jun 2018", note: "All-time lap record · avg 233.8 km/h · 20.832 km · still unbeaten (mid-2026)",
          sources: [ { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/motorsports/porsche-919-hybrid-evo-record-nuerburgring-nordschleife-5-minutes-19-seconds-55-timo-bernhard-15752.html" }, { label: "Nürburgring official", url: "https://nuerburgring.de/news/rekordjagd-auf-der-nordschleife-die-offiziellen-bestzeiten-2025?locale=en" } ] },
        { time: "6:05.336", driver: "Romain Dumas", vehicle: "Volkswagen ID.R (electric prototype)", date: "3 Jun 2019", note: "Fastest electric vehicle ever · second-fastest lap of any kind",
          sources: [ { label: "Volkswagen Newsroom", url: "https://www.volkswagen-newsroom.com/en/press-releases/605336-minutes-volkswagen-idr-sets-new-electric-record-on-the-nuerburgring-5045" } ] },
        { time: "6:11.13", driver: "Stefan Bellof", vehicle: "Porsche 956", date: "28 May 1983", note: "Qualifying, 1000 km Nürburgring · avg ~202 km/h · record for 35 years",
          sources: [ { label: "stefan-bellof.de", url: "https://www.stefan-bellof.de/en-us/karriere/rekordrunde/" }, { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/christophorus/porsche-christophorus-stefan-bellof-nuerburgring-record-12756.html" } ] },
        { time: "6:25.91", driver: "Stefan Bellof", vehicle: "Porsche 956", date: "29 May 1983", note: "Fastest lap in actual race conditions (1983 1000 km race). A few sources render 6:25.19.",
          sources: [ { label: "Wikipedia — Porsche 956", url: "https://en.wikipedia.org/wiki/Porsche_956" }, { label: "Motorsport-Total", url: "https://www.motorsport-total.com/wec/news/vor-35-jahren-bellof-und-der-unfassbare-nordschleifen-rekord-18052801" } ] }
      ]
    },
    {
      group: "Production cars",
      items: [
        { time: "6:29.090", driver: "Maro Engel", vehicle: "Mercedes-AMG ONE", date: "23 Sep 2024", note: "Road-legal production car record · first road car under 6:30 · notarized · still stands mid-2026",
          sources: [ { label: "Mercedes-Benz media", url: "https://media.mbusa.com/releases/release-9ce9755cd9dcbb00611364b99f035b12-629090-min-mercedes-amg-one-breaks-its-own-lap-record-on-the-nurburgring-nordschleife" }, { label: "Auto Express round-up", url: "https://www.autoexpress.co.uk/best/fastest-nurburgring-lap-record-times" } ] },
        { time: "6:55.553", driver: "Lars Kern", vehicle: "Porsche Taycan Turbo GT (Manthey Kit)", date: "15 Apr 2026", note: "Fastest production EV · official “Electric Executive Cars” record",
          sources: [ { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/2026/products/porsche-taycan-turbo-gt-manthey-kit-record-nordschleife-42424.html" }, { label: "Electrek", url: "https://electrek.co/2026/05/07/porsche-taycan-turbo-gt-manthey-kit-nurburgring-ev-record/" } ] },
        { time: "6:56.294", driver: "Jörg Bergmeister", vehicle: "Porsche 911 GT3 (992.2), 6-speed manual", date: "Apr 2025", note: "Fastest manual-transmission production car · notarized",
          sources: [ { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/2025/products/porsche-911gt3-nordschleife-nuerburgring-39264.html" } ] },
        { time: "6:59.157", driver: "Moritz Kranz", vehicle: "Yangwang U9 Xtreme (BYD)", date: "22 Aug 2025", note: "First EV under 7:00 · official “electric super sports car” record (limited run)",
          sources: [ { label: "Nürburgring official", url: "https://www.nuerburgring.de/news/neuer-rekord-fuer-den-yangwang-u9-xtreme-das-schnellste-elektrische-supersportauto-auf-der-nordschleife?locale=en" } ] },
        { time: "7:04.957", driver: "Vincent Radermecker", vehicle: "Xiaomi SU7 Ultra", date: "1 Apr 2025", note: "Production version with Nürburgring package",
          sources: [ { label: "Nürburgring official", url: "https://nuerburgring.de/news/rekordrunde-auf-der-nordschleife-xiaomi-su7-ultra-ist-mit-7-04-957-minuten-schnellstes-e-fahrzeug-der-oberklasse?locale=en" } ] },
        { time: "7:22.755", driver: "—", vehicle: "Xiaomi YU7 GT (Track Professional Package)", date: "May 2026", note: "Fastest SUV · the YU7 GT also set the first officially timed autonomous lap (10:29.483, no occupants, 8 Jun 2026)",
          sources: [ { label: "Top Gear", url: "https://www.topgear.com/car-news/suvs/xiaomi-yu7-gt-has-smashed-suv-record-nurburgring" }, { label: "Electrek — autonomous lap", url: "https://electrek.co/2026/06/22/xiaomi-yu7-gt-sets-another-nurburgring-record-with-nobody-in-the-drivers-seat/" } ] },
        { time: "7:44.523", driver: "Benjamin Leuchter", vehicle: "VW Golf GTI EDITION 50", date: "May 2026", note: "Fastest front-wheel-drive production car · beat Honda Civic Type R by 0.358 s",
          sources: [ { label: "Volkswagen Newsroom", url: "https://www.volkswagen-newsroom.com/en/press-releases/golf-gti-edition-50-is-the-fastest-frontwheel-drive-production-model-on-the-nuerburgring-nordschleife-20365" } ] }
      ]
    },
    {
      group: "Non-production & other categories",
      items: [
        { time: "6:15.977", driver: "Frédéric Vervisch", vehicle: "Ford GT Mk IV (track-only)", date: "1 Apr 2026", note: "Fastest pure-combustion lap ever recorded · not road-legal, so not a production record",
          sources: [ { label: "Ford", url: "https://www.fromtheroad.ford.com/us/en/articles/2026/ford-gt-mk-iv-nurburgring-record" } ] },
        { time: "6:22.091", driver: "David Pittard", vehicle: "Xiaomi SU7 Ultra prototype", date: "Apr 2025", note: "Third-fastest officially certified time ever · stripped prototype, not a road car",
          sources: [ { label: "Nürburgring official", url: "https://nuerburgring.de/news/xiaomi-su7-ultra-prototype-absolviert-eine-rundenzeit-von-6-22-091-minuten-auf-der-nordschleife?locale=en" } ] },
        { time: "7:49.578", driver: "Christian Krognes", vehicle: "BMW M4 GT3", date: "2022", note: "GT3 reference lap on the pure Nordschleife (NLS conditions)",
          sources: [ { label: "Motorsport.com — N24 analysis", url: "https://www.motorsport.com/NLS/news/analysis-how-dominant-was-max-verstappen-at-the-nurburgring-24-hours/10822585/" } ] },
        { time: "7:49.71", driver: "Helmut Dähne", vehicle: "Honda RC30 (VFR750R)", date: "23 May 1993", note: "Motorcycle record — effectively eternal: bike homologation lapsed after 1994",
          sources: [ { label: "Wikipedia — Helmut Dähne", url: "https://en.wikipedia.org/wiki/Helmut_D%C3%A4hne" } ] },
        { time: "7:51.514", driver: "Max Verstappen", vehicle: "Mercedes-AMG GT3", date: "16–17 May 2026", note: "GT3 race-conditions lap record, set at night during the 2026 N24 (25.378 km combined layout)",
          sources: [ { label: "Motorsport.com", url: "https://www.motorsport.com/NLS/news/analysis-how-dominant-was-max-verstappen-at-the-nurburgring-24-hours/10822585/" } ] }
      ]
    }
  ],
  recordsNote:
    "Official record laps (since 2019) use the full 20.832 km lap with flying start, timed at T13, supervised by a notary, with TÜV-verified production conformity. Many older manufacturer claims used a ~20.6 km lap and are not directly comparable.",
  recordsNoteSources: [
    { label: "Nürburgring — Record drives", url: "https://nuerburgring.de/info/nuerburgring/records?locale=en" },
    { label: "Wikipedia — List of Nordschleife lap times", url: "https://en.wikipedia.org/wiki/List_of_N%C3%BCrburgring_Nordschleife_lap_times" }
  ],

  history: [
    { year: "1925", text: "Construction approved (13 Aug) and begun as an employment project for the poor Eifel region — up to 2,300 workers at once.", sources: [ { label: "nuerburgring.de", url: "https://nuerburgring.de/news/100-jahre-nuerburgring-13-08-1925-genehmigung-zum-bau-der-nordschleife" } ] },
    { year: "1927", text: "Opened 18 June with the Eifelrennen motorcycle race; Rudolf Caracciola wins the first car race the next day. Full Gesamtstrecke (North + South loops): 28.265 km.", sources: [ { label: "Hagerty", url: "https://www.hagerty.com/media/automotive-history/nurburgring-first-race-this-day-in-1927/" }, { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/N%C3%BCrburgring" } ] },
    { year: "1931", text: "Caracciola popularises the ditch-hooking line through what becomes the Karussell; the banking is later concreted.", sources: [ { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/2020/motorsports/porsche-nuerburgring-nordschleife-caracciola-karussell-22455.html" } ] },
    { year: "1958", text: "Peter Collins (Ferrari) fatally injured at Pflanzgarten during the German GP.", sources: [ { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/N%C3%BCrburgring" } ] },
    { year: "1968", text: "Jackie Stewart wins the German GP by ~4 minutes in fog and rain and coins “The Green Hell”.", sources: [ { label: "Formula1.com", url: "https://www.formula1.com/en/latest/article/f1s-best-drives-1-stewart-conquers-the-green-hell.466hYmp1yJAiNY0vZXpx0r" } ] },
    { year: "1970–71", text: "F1 drivers boycott the ’Ring over safety; the track is rebuilt for 1971 with Armco, smoothing and run-off. Official corner count becomes 73.", sources: [ { label: "Wikipedia — German GP", url: "https://en.wikipedia.org/wiki/German_Grand_Prix" } ] },
    { year: "1976", text: "Niki Lauda’s fiery crash at the kink before Bergwerk (lap 2, German GP). The 1976 race is F1’s last on the Nordschleife.", sources: [ { label: "Wikipedia — 1976 German GP", url: "https://en.wikipedia.org/wiki/1976_German_Grand_Prix" }, { label: "PlanetF1", url: "https://www.planetf1.com/features/f1-revisited-niki-lauda-1976-nurburgring-crash" } ] },
    { year: "1982–84", text: "GP-Strecke built on the old start/finish loop; the Nordschleife gets its bypass and small pit lane — the modern 20.832 km lap. Last major Nordschleife-only race: the 1983 1000 km.", sources: [ { label: "RacingCircuits.info", url: "https://www.racingcircuits.info/europe/germany/nurburgring.html" } ] },
    { year: "1983", text: "Stefan Bellof laps in 6:11.13 qualifying a Porsche 956 — a record that stands for 35 years.", sources: [ { label: "stefan-bellof.de", url: "https://www.stefan-bellof.de/en-us/karriere/rekordrunde/" } ] },
    { year: "1993", text: "Helmut Dähne sets the effectively-eternal motorcycle record (7:49.71, Honda RC30).", sources: [ { label: "Wikipedia — Helmut Dähne", url: "https://en.wikipedia.org/wiki/Helmut_D%C3%A4hne" } ] },
    { year: "2013", text: "The fast left-right before Schwalbenschwanz is dedicated as the Stefan-Bellof-S.", sources: [ { label: "ADAC NLS", url: "https://www.nuerburgring-langstrecken-serie.de/en/2013/08/11/track-section-at-the-nordschleife-dedicated-to-stefan-bellof/" } ] },
    { year: "2015", text: "Fatal spectator accident at Flugplatz (VLN opener) leads to fencing changes and resurfacing of Flugplatz/Quiddelbacher Höhe.", sources: [ { label: "Motorsport.com", url: "https://www.motorsport.com/NLS/news/top-stories-of-2015-15-fatal-nordschleife-crash-prompts-safety-changes/664558/" } ] },
    { year: "2018", text: "Timo Bernhard’s Porsche 919 Hybrid Evo laps in 5:19.546 — the all-time record.", sources: [ { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/motorsports/porsche-919-hybrid-evo-record-nuerburgring-nordschleife-5-minutes-19-seconds-55-timo-bernhard-15752.html" } ] },
    { year: "2019", text: "VW ID.R sets the electric record (6:05.336); the Nürburgring introduces officially certified record rules.", sources: [ { label: "Volkswagen Newsroom", url: "https://www.volkswagen-newsroom.com/en/press-releases/605336-minutes-volkswagen-idr-sets-new-electric-record-on-the-nuerburgring-5045" }, { label: "Nürburgring — Record drives", url: "https://nuerburgring.de/info/nuerburgring/records?locale=en" } ] },
    { year: "2021", text: "The first corner of the Nordschleife is named the Sabine-Schmitz-Kurve.", sources: [ { label: "Nürburgring", url: "https://nuerburgring.de/news/besondere-ehre-fur-die-botschafterin-des-nurburgrings-nordschleife-bekommt-sabine-schmitz-kurve" } ] },
    { year: "2024", text: "Mercedes-AMG ONE takes the production-car record: 6:29.090 (Maro Engel).", sources: [ { label: "Mercedes-Benz media", url: "https://media.mbusa.com/releases/release-9ce9755cd9dcbb00611364b99f035b12-629090-min-mercedes-amg-one-breaks-its-own-lap-record-on-the-nurburgring-nordschleife" } ] },
    { year: "2026", text: "Max Verstappen dominates the N24 and sets a GT3 race-lap record (7:51.514) before retiring; the #80 Mercedes-AMG wins. Taycan Turbo GT Manthey becomes the fastest production EV (6:55.553).", sources: [ { label: "Motorsport.com", url: "https://www.motorsport.com/NLS/news/analysis-how-dominant-was-max-verstappen-at-the-nurburgring-24-hours/10822585/" }, { label: "Porsche Newsroom", url: "https://newsroom.porsche.com/en/2026/products/porsche-taycan-turbo-gt-manthey-kit-record-nordschleife-42424.html" } ] }
  ],

  methodology: {
    geometry: "Track centerline and surrounding map assembled from OpenStreetMap data via the Protomaps daily planet build (v4 PMTiles, Source Cooperative mirror, March 2026), extracted at zoom 15. Section boundaries follow the named raceway segments mapped in OSM. Computed centerline length: see the header (official lap length 20.832 km).",
    elevation: "Elevation profile sampled every 10 m from Terrarium terrain tiles (AWS Open Data; EU-DEM/SRTM-derived, ~25 m source resolution in Germany), lightly smoothed. Values are terrain elevations and can deviate several metres from trackside survey figures in cuttings, on bridges and in narrow valleys — documented figures (320 m Breidscheid, ~617 m Hohe Acht) come from the cited sources.",
    positions: "Kilometre positions are measured along the OSM centerline from the start of the T13 section and are approximate; trackside kilometre posts use the historic start/finish and differ by roughly 2 km."
  }
};
