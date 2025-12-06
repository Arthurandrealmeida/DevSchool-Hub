 import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
      import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

      const TOPO_URL =
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

      const mapContainer = d3.select("#mapContainer");
      const guessInput = document.getElementById("guessInput");
      const markBtn = document.getElementById("markBtn");
      const resetBtn = document.getElementById("resetBtn");
      const logEl = document.getElementById("log");
      const scoreEl = document.getElementById("score");
      const totalCountEl = document.getElementById("totalCount");
      const foundListEl = document.getElementById("found-list");
      const showListBtn = document.getElementById("showListBtn");
      const namesContainer = document.getElementById("namesContainer");

      let svg, g, projection, path;
      let countries = []; // geo features
      let nameIndex = new Map(); // normalizedName -> array of features
      let enToFeature = new Map(); // english name -> feature
      let foundSet = new Set(); // ids (feature.id or name) of found countries
      let totalCountries = 0;

      /* Traduções PT + variantes problemáticas
   Map EN name -> array of acceptable PT variants (and common aliases).
   Vou incluir muitos casos comuns; podemos expandir depois.
*/
      const variants = {
        "United States": [
          "estados unidos",
          "estados unidos da américa",
          "eua",
          "usa",
          "united states",
        ],
        "United States of America": ["estados unidos", "eua", "usa"],
        Russia: ["russia", "rússia", "russian federation"],
        "United Kingdom": [
          "reino unido",
          "inglaterra",
          "uk",
          "grã-bretanha",
          "britain",
        ],
        Iran: ["irã", "iran", "iran, islamic republic of"],

        Venezuela: ["venezuela", "venezuela, bolivarian republic of"],

        Bolivia: ["bolivia", "bolívia", "bolivia plurinational state of"],

        Tanzania: ["tanzania", "tanzânia", "tanzania united republic of"],

        Laos: ["laos", "lao people's democratic republic"],

        Moldova: ["moldova", "moldova republic of"],

        Czechia: ["republica tcheca", "czech republic", "czechia"],

        "Holy See (Vatican City State)": ["vaticano", "holy see", "vatican"],
        "Cabo Verde": ["cabo verde", "cape verde"],
        "Côte d'Ivoire": ["costa do marfim", "cote d'ivoire", "ivory coast"],
        Eswatini: ["eswatini", "suazilandia", "swaziland"],
        Myanmar: ["mianmar", "burma", "myanmar"],
        "South Korea": ["coreia do sul", "south korea","coreiadosul"],
        "North Korea": ["coreia do norte", "north korea"],
        "Korea, Democratic People's Republic of": [
          "coreia do norte",
          "north korea",
        ],
        Congo: ["congo brazzaville", "congo"],
        "Democratic Republic of the Congo": [
          "rd congo",
          "republic democratic of congo",
          "congo kinshasa",
          "dr congo",
        ],
        "North Macedonia": ["macedonia do norte", "north macedonia"],
        "United Arab Emirates": [
          "emirados arabes unidos",
          "emirados árabes",
          "uae",
          "ea u",
        ],
        "South Africa": ["africa do sul", "south africa"],
        Greenland: ["groenlandia", "greenland"],
        Brazil: ["brasil", "brazil"],
        Germany: ["alemania", "alemanha", "germany"],
        France: ["franca", "frança", "france"],
        Spain: ["espanha", "spain"],
        Portugal: ["portugal"],
        Italy: ["italia", "itália", "italy"],
        China: ["china"],
        India: ["india", "índia"],
        Japan: ["japao", "japão", "japan"],
        Canada: ["canada", "canadá"],
        Australia: ["australia", "austrália"],
        Mexico: ["mexico", "méxico"],

        Argentina: ["argentina"],
        Chile: ["chile"],
        Colombia: ["colombia", "colômbia"],
        Peru: ["peru"],
        Ecuador: ["equador", "ecuador"],
        Paraguay: ["paraguai", "paraguay"],
        Uruguay: ["uruguai", "uruguay"],
        Guyana: ["guiana", "guyana"],
        Suriname: ["suriname"],
        Panama: ["panamá", "panama"],
        "Costa Rica": ["costa rica"],
        Nicaragua: ["nicaragua", "nicarágua"],
        Honduras: ["honduras"],
        "El Salvador": ["el salvador"],
        Guatemala: ["guatemala"],
        Belize: ["belize"],
        Cuba: ["cuba"],
        Haiti: ["haiti", "haïti"],
        "Dominican Republic": ["republica dominicana", "dominican republic"],
        Jamaica: ["jamaica"],
        Bahamas: ["bahamas"],
        "Trinidad and Tobago": ["trinidad e tobago"],

        Egypt: ["egito", "egypt"],
        Morocco: ["marrocos", "morocco"],
        Algeria: ["argelia", "argélia", "algeria"],
        Tunisia: ["tunisia", "tunísia"],
        Libya: ["libia", "líbia"],
        Sudan: ["sudao", "sudão", "sudan"],
        "South Sudan": ["sudao do sul", "south sudan"],
        Ethiopia: ["etiopia", "etiópia"],
        Somalia: ["somalia"],
        Kenya: ["quenia", "quênia", "kenya"],
        Uganda: ["uganda"],
        Rwanda: ["ruanda", "rwanda"],
        Burundi: ["burundi"],
        Ghana: ["gana", "ghana"],
        Nigeria: ["nigeria", "nígeria"],
        Niger: ["níger", "niger"],
        Chad: ["chade", "chad"],
        Cameroon: ["camaroes", "camaroês", "cameroon"],
        Angola: ["angola"],
        Namibia: ["namibia", "namíbia"],
        Botswana: ["botsuana", "botswana"],
        Zimbabwe: ["zimbabue", "zimbabwe"],
        Zambia: ["zambia", "zâmbia"],
        Malawi: ["malawi"],
        Mozambique: ["mocambique", "moçambique"],
        Madagascar: ["madagascar"],
        Senegal: ["senegal"],
        Mali: ["mali"],
        Mauritania: ["mauritania", "mauritânia"],
        Guinea: ["guine", "guiné"],
        "Guinea-Bissau": ["guine bissau", "guiné bisau"],
        "Sierra Leone": ["serra leoa"],
        Liberia: ["liberia", "libéria"],
        Benin: ["benin", "benim"],
        Togo: ["togo"],
        Gambia: ["gambia", "gâmbia"],
        "Burkina Faso": ["burkina faso"],
        Eritrea: ["eritreia", "eritrea"],
        Djibouti: ["djibouti", "jibuti"],
        Seychelles: ["seicheles", "seychelles"],
        Mauritius: ["mauricio", "maurício"],
        Comoros: ["comores", "comoros"],

        "Saudi Arabia": ["arabia saudita", "arábia saudita"],
        Turkey: ["turquia", "turkey"],
        Iraq: ["iraque"],
        Syria: ["siria", "síria"],
        Jordan: ["jordania", "jordânia"],
        Lebanon: ["libano", "líbano"],
        Israel: ["israel"],
        Palestine: ["palestina"],
        Qatar: ["qatar", "catar"],
        Bahrain: ["barein", "bahrain"],
        Kuwait: ["kuwait", "kuwait"],
        Oman: ["oma", "oman"],
        Yemen: ["iemen", "yemen"],

        Pakistan: ["paquistao", "paquistão", "pakistan"],
        Afghanistan: ["afeganistao", "afeganistão"],
        Bangladesh: ["bangladesh"],
        "Sri Lanka": ["sri lanka","siri lanka"],
        Nepal: ["nepal"],
        Bhutan: ["butao", "butão"],
        Thailand: ["tailandia", "tailândia"],
        Vietnam: ["vietna", "vietnam"],
        Cambodia: ["camboja", "cambodia"],
        Malaysia: ["malasia", "malásia"],
        Singapore: ["singapura", "singapore"],
        Indonesia: ["indonesia", "indonésia"],
        Philippines: ["filipinas", "philippines"],
        Mongolia: ["mongolia", "mongólia"],

        Kazakhstan: ["kazaquistao", "casaquistão"],
        Uzbekistan: ["uzbequistao", "uzbequistão"],
        Turkmenistan: ["turcomenistao", "turcomenistão"],
        Kyrgyzstan: ["quirguistao", "quirguistão"],
        Tajikistan: ["tadjiquistao", "tadjiquistão"],

        Norway: ["noruega"],
        Sweden: ["suecia", "suécia"],
        Finland: ["finlandia", "finlândia"],
        Denmark: ["dinamarca"],
        Iceland: ["islandia", "islândia"],
        Ireland: ["irlanda"],
        Netherlands: ["holanda", "paises baixos", "netherlands"],
        Belgium: ["belgica", "bélgica"],
        Luxembourg: ["luxemburgo"],
        Switzerland: ["suica", "suíça"],
        Austria: ["austria", "áustria"],
        Poland: ["polonia", "polônia"],
        Hungary: ["hungria"],
        Romania: ["romenia", "romênia"],
        Bulgaria: ["bulgaria", "bulgária"],
        Greece: ["grecia", "grécia"],
        Serbia: ["servia", "sérvia"],
        Croatia: ["croacia", "croácia"],
        Slovenia: ["eslovenia", "eslovênia"],
        Slovakia: ["eslovaquia", "eslováquia"],
        "Bosnia and Herzegovina": ["bosnia", "bósnia"],
        Montenegro: ["montenegro"],
        Albania: ["albania", "albânia"],
        Lithuania: ["lituania", "lituânia"],
        Latvia: ["letonia", "letônia"],
        Estonia: ["estonia", "estônia"],
        Belarus: ["belarus"],
        Ukraine: ["ucrania", "ucrânia"],

        "New Zealand": ["nova zelandia", "nova zelândia"],
        Fiji: ["fiji"],
        "Papua New Guinea": ["papua nova guine", "papua-nova guiné"],
        Samoa: ["samoa"],
        Tonga: ["tonga"],
        "Solomon Islands": ["ilhas salomao", "salomão"],
        Vanuatu: ["vanuatu"],
        Kiribati: ["kiribati"],
        Micronesia: ["micronesia"],
        "Marshall Islands": ["ilhas marshall"],
        Nauru: ["nauru"],
      };

      /* normalize helper: remove accents, punctuation, lowercase */
      function normalize(s) {
        if (!s) return "";
        return s
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .trim();
      }

      /* build reverse lookup from variants */
      const variantIndex = new Map();
      for (const [en, arr] of Object.entries(variants)) {
        const normEn = normalize(en);
        // include normalized EN itself
        if (!variantIndex.has(normEn)) variantIndex.set(normEn, new Set());
        variantIndex.get(normEn).add(en);
        arr.forEach((v) => {
          const nv = normalize(v);
          if (!variantIndex.has(nv)) variantIndex.set(nv, new Set());
          variantIndex.get(nv).add(en);
        });
      }

      /* fetch topojson and draw */
      async function init() {
        const res = await fetch(TOPO_URL);
        const topo = await res.json();
        const geo = feature(topo, topo.objects.countries);
        countries = geo.features;
        totalCountries = countries.length;
        totalCountEl.textContent = totalCountries;

        // prepare indices
        countries.forEach((f) => {
          const props = f.properties || {};
          // name detection - many datasets use .name
          const enName = props.name || props.ADMIN || props.NAME || "";
          const id = f.id || enName;
          enToFeature.set(enName, f);

          // gather normalized keys: EN, ADMIN, translations (if present)
          const keys = new Set();
          keys.add(normalize(enName));
          if (props.admin) keys.add(normalize(props.admin));
          if (props.name_long) keys.add(normalize(props.name_long));
          // also add variantIndex entries if any
          const normEn = normalize(enName);
          if (variantIndex.has(normEn)) {
            for (const mappedEN of variantIndex.get(normEn))
              keys.add(normalize(mappedEN));
          }

          // for each key, map to feature
          for (const k of keys) {
            if (!nameIndex.has(k)) nameIndex.set(k, []);
            nameIndex.get(k).push(f);
          }
        });

        drawMap();
        buildNamesList();
      }

      /* draw map with d3 */
      function drawMap() {
        mapContainer.selectAll("*").remove();
        const rect = mapContainer.node().getBoundingClientRect();
        const width = Math.max(900, rect.width);
        const height = Math.max(720, rect.height);

        svg = mapContainer
          .append("svg")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        g = svg.append("g");

        projection = d3.geoNaturalEarth1()
  .translate([width/2, height/2])
  .scale((width/900)*230);

        path = d3.geoPath().projection(projection);

        g.selectAll("path.country")
          .data(countries)
          .join("path")
          .attr("class", "country")
          .attr("d", path)
          .attr("data-name", (d) => (d.properties && d.properties.name) || "")
          .on("click", function (event, d) {
            // clicar **preenche** o input, mas NÃO marca
            const name = (d.properties && d.properties.name) || "";
            guessInput.value = variants[name]
              ? variants[name][0] || name
              : translationsPT && translationsPT[name]
              ? translationsPT[name]
              : name;
            guessInput.focus();
          })
          .append("title") // native tooltip with English name
          .text((d) => (d.properties && d.properties.name) || "");

        // resize handler
        window.addEventListener("resize", () => {
          drawMap(); // simpler re-render (reapply found below)
          reapplyFound();
        });
      }

      /* Build list of all country names (click to fill input) below the map */
      function buildNamesList() {
        namesContainer.innerHTML = "";
        // sort alphabetically by displayed name (prefer PT if variant exists)
        const arr = countries
          .map((f) => (f.properties && f.properties.name) || "")
          .sort((a, b) => a.localeCompare(b));
        arr.forEach((enName) => {
          const div = document.createElement("div");
          div.style.padding = "6px 4px";
          div.style.borderBottom = "1px solid #f1f1f1";
          div.style.cursor = "pointer";
          const display =
            variants[enName] && variants[enName][0]
              ? variants[enName][0]
              : enName;
          div.textContent = display;
          div.title = enName;
          div.addEventListener("click", () => {
            // fill input with PT variant if available, else EN
            const val =
              variants[enName] && variants[enName][0]
                ? variants[enName][0]
                : enName;
            guessInput.value = val;
            guessInput.focus();
          });
          namesContainer.appendChild(div);
        });
      }

      /* find matches by a user-provided string (tolerant) */
      function findMatches(raw) {
        const q = normalize(raw);
        if (!q) return [];

        // 1) direct variant map (PT aliases)
        if (variantIndex.has(q)) {
          const enTargets = Array.from(variantIndex.get(q));
          // map to features
          const features = [];
          enTargets.forEach((en) => {
            const f = enToFeature.get(en);
            if (f) features.push(f);
          });
          if (features.length) return uniqueFeatures(features);
        }

        // 2) direct nameIndex lookup (normalized english/admin)
        if (nameIndex.has(q)) {
          return uniqueFeatures(nameIndex.get(q));
        }

        // 3) substring includes on nameIndex keys (fuzzy)
        const matches = [];
        for (const [k, flist] of nameIndex.entries()) {
          if (k.includes(q) || q.includes(k)) {
            flist.forEach((f) => matches.push(f));
          }
        }
        if (matches.length) return uniqueFeatures(matches);

        // 4) try find by exact english match ignoring diacritics
        for (const [en, f] of enToFeature.entries()) {
          if (normalize(en) === q) return [f];
        }

        return [];
      }

      function uniqueFeatures(list) {
        const seen = new Set();
        const out = [];
        list.forEach((f) => {
          const key = (f.id || (f.properties && f.properties.name)) + "";
          if (!seen.has(key)) {
            seen.add(key);
            out.push(f);
          }
        });
        return out;
      }

      /* apply found matches (mark correct) */
      function applyMatches(features, raw) {
        if (!features || features.length === 0) {
          flashNoMatch();
          addLog(raw, []);
          return;
        }

        const addedNames = [];
        features.forEach((f) => {
          const key = (f.id || (f.properties && f.properties.name)) + "";
          if (foundSet.has(key)) return;
          foundSet.add(key);
          addedNames.push((f.properties && f.properties.name) || "");

          // apply class on the corresponding path element
          // find path by data-name attribute
          d3.selectAll("path.country").each(function (d) {
            const nm = (d.properties && d.properties.name) || "";
            if (nm === f.properties.name)
              d3.select(this).classed("correct", true);
          });
        });

        // update UI
        updateScore();
        addLog(raw, addedNames);
        renderFoundList();
      }

      /* update score element */
      function updateScore() {
        scoreEl.textContent = `Acertos únicos: ${foundSet.size}`;
      }

      /* add log entry */
      function addLog(raw, matchedNames) {
        const li = document.createElement("li");
        if (matchedNames.length) {
          const pretty = matchedNames.map((n) =>
            variants[n] && variants[n][0] ? variants[n][0] : n
          );
          li.textContent = `"${raw}" → ${pretty.join(", ")}`;
        } else {
          li.textContent = `"${raw}" → (nenhum país encontrado)`;
          li.style.color = "var(--wrong)";
        }
        logEl.insertBefore(li, logEl.firstChild);
        while (logEl.children.length > 30) logEl.removeChild(logEl.lastChild);
      }

      /* render found list below map */
      function renderFoundList() {
        foundListEl.innerHTML = "";
        // build array of display names
        const arr = [];
        countries.forEach((f) => {
          const key = (f.id || (f.properties && f.properties.name)) + "";
          if (foundSet.has(key)) {
            const en = (f.properties && f.properties.name) || "";
            const display =
              variants[en] && variants[en][0] ? variants[en][0] : en;
            arr.push(display);
          }
        });
        // sort alphabetically
        arr.sort((a, b) => a.localeCompare(b));
        arr.forEach((name) => {
          const li = document.createElement("li");
          li.textContent = name;
          foundListEl.appendChild(li);
        });
      }

      /* flash input when no match */
      function flashNoMatch() {
        const old = guessInput.style.border;
        guessInput.style.border = "2px solid var(--wrong)";
        setTimeout(() => (guessInput.style.border = old), 600);
      }

      /* reapply found classes after re-render */
      function reapplyFound() {
        d3.selectAll("path.country").classed("correct", false);
        countries.forEach((f) => {
          const key = (f.id || (f.properties && f.properties.name)) + "";
          if (foundSet.has(key)) {
            d3.selectAll("path.country").each(function (d) {
              const nm = (d.properties && d.properties.name) || "";
              if (nm === f.properties.name)
                d3.select(this).classed("correct", true);
            });
          }
        });
      }

      /* reset all progress */
      function resetAll() {
        foundSet.clear();
        updateScore();
        renderFoundList();
        logEl.innerHTML = "";
        d3.selectAll("path.country").classed("correct", false);
      }

      /* show/hide names list */
      let namesVisible = false;
      showListBtn.addEventListener("click", () => {
        namesVisible = !namesVisible;
        document.getElementById("namesList").style.display = namesVisible
          ? "block"
          : "none";
        showListBtn.textContent = namesVisible
          ? "Ocultar lista de nomes"
          : "Mostrar lista de nomes";
      });

      /* mark button / enter */
      markBtn.addEventListener("click", () => {
        const v = guessInput.value.trim();
        if (!v) return;
        const matches = findMatches(v);
        applyMatches(matches, v);
        guessInput.value = "";
        guessInput.focus();
      });
      guessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          markBtn.click();
        }
      });

      /* initialization */
      init().catch((err) => {
        console.error("Erro ao iniciar mapa", err);
        mapContainer.text("Erro ao carregar mapa.");
      });