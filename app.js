(function () {
  // ---------- Tema claro/oscuro ----------
  const THEME_KEY = "asturias_theme";
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : systemPrefersDark() ? "dark" : "light";
  }
  let currentTheme = getInitialTheme();
  if (localStorage.getItem(THEME_KEY)) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  const map = L.map("map", {
    zoomControl: false,
    minZoom: 8,
    maxZoom: 19,
  }).setView([43.3, -6.1], 9);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  window.addEventListener("resize", () => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 200);

  const lightTile = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri — Esri, HERE, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors",
      maxZoom: 19,
    }
  );
  const darkBase = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri — Esri, DeLorme, NAVTEQ",
      maxNativeZoom: 16,
      maxZoom: 19,
    }
  );
  const darkRef = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    { maxNativeZoom: 16, maxZoom: 19 }
  );

  function applyMapTheme(theme) {
    if (theme === "dark") {
      if (map.hasLayer(lightTile)) map.removeLayer(lightTile);
      if (!map.hasLayer(darkBase)) darkBase.addTo(map);
      if (!map.hasLayer(darkRef)) darkRef.addTo(map);
      // El basemap oscuro no tiene detalle real mas alla del zoom 16: mas alla de
      // eso Leaflet solo estira la ultima tesela y se ve pixelado. Se limita el
      // zoom maximo para que nunca se llegue a ver esa zona borrosa.
      map.setMaxZoom(16);
    } else {
      if (map.hasLayer(darkBase)) map.removeLayer(darkBase);
      if (map.hasLayer(darkRef)) map.removeLayer(darkRef);
      if (!map.hasLayer(lightTile)) lightTile.addTo(map);
      // En zonas rurales Esri no tiene teselas propias mas alla del zoom 18
      // (se verian en blanco), asi que se limita ahi tambien.
      map.setMaxZoom(18);
    }
  }
  applyMapTheme(currentTheme);

  const themeToggleBtn = document.getElementById("themeToggle");
  function updateThemeButton() {
    themeToggleBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";
  }
  updateThemeButton();
  themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
    applyMapTheme(currentTheme);
    updateThemeButton();
  });

  const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const activeCats = new Set(CATEGORIES.filter((c) => !c.defaultOff).map((c) => c.id));

  // ---------- Filtros avanzados (Michelin, emblematicos, rutas destacadas) ----------
  const advancedFilters = { michelin: false, emblematico: false, destacada: false };

  // ---------- Destacados del mes (locales que pagan cuota, ver destacados.js) ----------
  const destacadosSet = new Set(typeof DESTACADOS_MES !== "undefined" ? DESTACADOS_MES : []);
  let destacadosOnly = false;

  // ---------- Favoritos (guardados en este navegador, sin cuenta) ----------
  const FAV_KEY = "asturias_favoritos";
  const favorites = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  let favoritesOnly = false;

  function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
    document.getElementById("favCount").textContent = favorites.size;
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function isHighlighted(poi) {
    return !!(
      (advancedFilters.michelin && poi.michelin) ||
      (advancedFilters.emblematico && poi.emblematico) ||
      (advancedFilters.destacada && poi.destacada) ||
      (destacadosOnly && destacadosSet.has(poi.id))
    );
  }

  function makeIcon(poi) {
    const info = catById[poi.cat];
    const cls = "custom-marker" + (isHighlighted(poi) ? " marker-highlight" : "");
    return L.divIcon({
      className: "",
      html: `<div class="${cls}" style="background:${info.color}"><span>${info.icon}</span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }

  function directionsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  const clusterGroups = {};
  CATEGORIES.forEach((c) => {
    clusterGroups[c.id] = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 55,
      iconCreateFunction: function (cluster) {
        return L.divIcon({
          html: `<div style="background:${c.color}">${cluster.getChildCount()}</div>`,
          className: "marker-cluster-custom",
          iconSize: [34, 34],
        });
      },
    });
  });

  const usedIds = new Set();
  const allMarkers = POIS.map((poi) => {
    let id = slugify(poi.cat + "-" + poi.name);
    while (usedIds.has(id)) id += "-x";
    usedIds.add(id);
    poi.id = id;

    const marker = L.marker([poi.lat, poi.lng], { icon: makeIcon(poi) });
    marker.poi = poi;
    marker.on("click", () => openDetail(poi));
    return marker;
  });

  const highlightableMarkers = allMarkers.filter(
    (m) => m.poi.michelin || m.poi.emblematico || m.poi.destacada || destacadosSet.has(m.poi.id)
  );
  function applyHighlights() {
    highlightableMarkers.forEach((marker) => marker.setIcon(makeIcon(marker.poi)));
  }

  // ---------- Panel de detalle (derecha) ----------
  const detailPanel = document.getElementById("detailPanel");
  const detailContent = document.getElementById("detailContent");

  function starRow(rating) {
    const full = Math.round(rating);
    const stars = "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
    return `<div class="detail-rating"><span class="stars">${stars}</span> ${rating.toFixed(1)}</div>`;
  }

  function openDetail(poi) {
    const info = catById[poi.cat];
    const isSaved = favorites.has(poi.id);

    const infoRows = [];
    if (poi.hours) {
      infoRows.push(`<div class="detail-info-row"><span class="icon">🕒</span><span class="hours-text">${poi.hours}</span></div>`);
    }
    if (poi.phone) {
      infoRows.push(`<div class="detail-info-row"><span class="icon">📞</span><a href="tel:${poi.phone.replace(/\s+/g, "")}">${poi.phone}</a></div>`);
    }
    if (poi.website) {
      const label = poi.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
      infoRows.push(`<div class="detail-info-row"><span class="icon">🌐</span><a href="${poi.website}" target="_blank" rel="noopener">${label}</a></div>`);
    }

    const badges = [];
    if (poi.michelin) {
      badges.push(`<span class="detail-badge michelin">${"⭐".repeat(poi.michelin)} Michelin</span>`);
    }
    if (poi.emblematico) {
      badges.push(`<span class="detail-badge emblematico">🏛️ Emblemático</span>`);
    }
    if (poi.destacada) {
      badges.push(`<span class="detail-badge destacada">🥾 Ruta destacada</span>`);
    }
    if (destacadosSet.has(poi.id)) {
      badges.push(`<span class="detail-badge patrocinado">🌟 Destacado este mes</span>`);
    }

    detailContent.innerHTML = `
      <span class="detail-tag" style="background:${info.color}">${info.icon} ${info.label}</span>
      ${badges.join("")}
      ${poi.rating ? starRow(poi.rating) : ""}
      <h2 class="detail-title">${poi.name}</h2>
      <div class="detail-town"><span class="icon">📍</span><span>${poi.town}</span></div>
      <div class="detail-actions">
        <a class="go" target="_blank" rel="noopener" href="${directionsUrl(poi.lat, poi.lng)}">
          <span class="icon">🧭</span> Cómo llegar
        </a>
        <button class="save${isSaved ? " saved" : ""}" id="saveBtn">
          <span class="icon">${isSaved ? "★" : "☆"}</span> ${isSaved ? "Guardado" : "Guardar"}
        </button>
      </div>
      <p class="detail-desc">${poi.desc}</p>
      ${infoRows.length ? `<div class="detail-info">${infoRows.join("")}</div>` : ""}
    `;

    document.getElementById("saveBtn").addEventListener("click", () => {
      if (favorites.has(poi.id)) {
        favorites.delete(poi.id);
      } else {
        favorites.add(poi.id);
      }
      saveFavorites();
      openDetail(poi);
      if (favoritesOnly) refreshMap();
    });

    detailPanel.classList.add("open");
  }

  document.getElementById("detailClose").addEventListener("click", () => {
    detailPanel.classList.remove("open");
  });

  function refreshMap() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    Object.values(clusterGroups).forEach((g) => g.clearLayers());

    const categoriesToShow = new Set();
    let visibleCount = 0;
    allMarkers.forEach((marker) => {
      const poi = marker.poi;
      if (destacadosOnly) {
        if (!destacadosSet.has(poi.id)) return;
      } else {
        if (!activeCats.has(poi.cat)) return;
        if (favoritesOnly && !favorites.has(poi.id)) return;
      }
      if (query) {
        const haystack = (poi.name + " " + poi.town).toLowerCase();
        if (!haystack.includes(query)) return;
      }
      clusterGroups[poi.cat].addLayer(marker);
      categoriesToShow.add(poi.cat);
      visibleCount++;
    });

    Object.entries(clusterGroups).forEach(([id, group]) => {
      if (categoriesToShow.has(id)) {
        if (!map.hasLayer(group)) map.addLayer(group);
      } else if (map.hasLayer(group)) {
        map.removeLayer(group);
      }
    });

    document.getElementById("resultCount").textContent =
      visibleCount + (visibleCount === 1 ? " lugar" : " lugares");
  }

  // ---------- Sidebar category list ----------
  const listEl = document.getElementById("categoryList");
  const primaryCategories = CATEGORIES.filter((c) => !c.advanced);
  primaryCategories.forEach((c) => {
    const count = POIS.filter((p) => p.cat === c.id).length;
    const item = document.createElement("div");
    item.className = "category-item active";
    item.dataset.cat = c.id;
    item.innerHTML = `
      <span class="cat-dot" style="background:${c.color}">${c.icon}</span>
      <span class="cat-label">${c.label}</span>
      <span class="cat-count">${count}</span>
    `;
    item.addEventListener("click", () => {
      if (activeCats.has(c.id)) {
        activeCats.delete(c.id);
        item.classList.remove("active");
      } else {
        activeCats.add(c.id);
        item.classList.add("active");
      }
      refreshMap();
    });
    listEl.appendChild(item);
  });

  // ---------- Filtros avanzados ----------
  const advancedListEl = document.getElementById("advancedList");

  CATEGORIES.filter((c) => c.advanced).forEach((c) => {
    const count = POIS.filter((p) => p.cat === c.id).length;
    const item = document.createElement("div");
    item.className = "category-item" + (activeCats.has(c.id) ? " active" : "");
    item.innerHTML = `
      <span class="cat-dot" style="background:${c.color}">${c.icon}</span>
      <span class="cat-label">${c.label}</span>
      <span class="cat-count">${count}</span>
    `;
    item.addEventListener("click", () => {
      if (activeCats.has(c.id)) {
        activeCats.delete(c.id);
        item.classList.remove("active");
      } else {
        activeCats.add(c.id);
        item.classList.add("active");
      }
      refreshMap();
    });
    advancedListEl.appendChild(item);
  });

  const BOOLEAN_FILTERS = [
    { key: "michelin", label: "Estrella Michelin", color: "#c9a227", icon: "⭐" },
    { key: "emblematico", label: "Emblemáticos", color: "#8a5a44", icon: "🏛️" },
    { key: "destacada", label: "Rutas destacadas", color: "#588157", icon: "🥾" },
  ];
  BOOLEAN_FILTERS.forEach((f) => {
    const count = POIS.filter((p) => p[f.key]).length;
    const item = document.createElement("div");
    item.className = "category-item";
    item.innerHTML = `
      <span class="cat-dot" style="background:${f.color}">${f.icon}</span>
      <span class="cat-label">${f.label}</span>
      <span class="cat-count">${count}</span>
    `;
    item.addEventListener("click", () => {
      advancedFilters[f.key] = !advancedFilters[f.key];
      item.classList.toggle("active", advancedFilters[f.key]);
      applyHighlights();
    });
    advancedListEl.appendChild(item);
  });

  document.getElementById("selectAll").addEventListener("click", () => {
    primaryCategories.forEach((c) => activeCats.add(c.id));
    listEl.querySelectorAll(".category-item").forEach((el) => el.classList.add("active"));
    refreshMap();
  });

  document.getElementById("selectNone").addEventListener("click", () => {
    primaryCategories.forEach((c) => activeCats.delete(c.id));
    listEl.querySelectorAll(".category-item").forEach((el) => el.classList.remove("active"));
    refreshMap();
  });

  document.getElementById("searchInput").addEventListener("input", refreshMap);

  const favToggleBtn = document.getElementById("favoritesToggle");
  document.getElementById("favCount").textContent = favorites.size;
  favToggleBtn.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    favToggleBtn.classList.toggle("active", favoritesOnly);
    refreshMap();
  });

  const destacadosToggleBtn = document.getElementById("destacadosToggle");
  const normalFiltersEl = document.getElementById("normalFilters");
  destacadosToggleBtn.addEventListener("click", () => {
    destacadosOnly = !destacadosOnly;
    destacadosToggleBtn.classList.toggle("active", destacadosOnly);
    normalFiltersEl.classList.toggle("dimmed", destacadosOnly);
    refreshMap();
    applyHighlights();
  });

  // ---------- Mobile sidebar toggle ----------
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
  map.on("click", () => {
    sidebar.classList.remove("open");
    detailPanel.classList.remove("open");
  });

  refreshMap();
})();
