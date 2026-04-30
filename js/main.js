const GRID_COLUMNS = 12;
const GRID_ROWS = 12;
const TOTAL_TILES = GRID_COLUMNS * GRID_ROWS;

const palette = [
  "#f4f1ef",
  "#ebe7e4",
  "#d7cec7",
  "#c9bbb2",
  "#d07d58",
  "#b96b52"
];

/**
 * Only define tiles that need a specific image/link.
 * All other tiles are generated as decorative defaults.
 */
const featuredTiles = [
  {
    id: 18,
    color: "#d07d58",
    image: "assets/images/grid/detaljplaner.jpg",
    href: "portfolio/detaljplaner/",
    label: "Detaljplaner"
  },
  {
    id: 67,
    color: "#c9bbb2",
    image: "assets/images/grid/projects.jpg",
    href: "portfolio/projects/",
    label: "Projects"
  },
  {
    id: 122,
    color: "#b96b52",
    image: "assets/images/grid/rosengard.jpg",
    href: "portfolio/rosengard/",
    label: "Rosengård"
  }
];

const featuredMap = new Map(featuredTiles.map((tile) => [tile.id, tile]));
const gridEl = document.getElementById("pixel-grid");

if (gridEl) {
  const fragment = document.createDocumentFragment();

  for (let id = 1; id <= TOTAL_TILES; id += 1) {
    const tile = featuredMap.get(id) ?? {
      id,
      color: palette[id % palette.length],
      image: "",
      href: "",
      label: "Dekorativ ruta"
    };

    const isLink = Boolean(tile.href);
    const wrapperTag = isLink ? "a" : "div";
    const wrapper = document.createElement(wrapperTag);

    wrapper.className = `tile${isLink ? " tile--link" : ""}`;
    wrapper.style.setProperty("--tile-color", tile.color);
    wrapper.setAttribute("role", "listitem");

    if (isLink) {
      wrapper.href = tile.href;
      wrapper.setAttribute("aria-label", `Öppna ${tile.label}`);
    } else {
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.tabIndex = -1;
    }

    const imageMarkup = tile.image
      ? `<img src="${tile.image}" alt="" loading="lazy" decoding="async">`
      : "<div class=\"tile-empty\" aria-hidden=\"true\"></div>";

    wrapper.innerHTML = `
      <span class="tile-inner">
        <span class="tile-face tile-front" aria-hidden="true"></span>
        <span class="tile-face tile-back" aria-hidden="true">
          ${imageMarkup}
        </span>
      </span>
    `;

    fragment.appendChild(wrapper);
  }

  gridEl.appendChild(fragment);
}
