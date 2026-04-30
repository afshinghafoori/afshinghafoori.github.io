const GRID_COLUMNS = 12;
const GRID_ROWS = 12;
const TOTAL_TILES = GRID_COLUMNS * GRID_ROWS;

const palette = ["#ffffff", "#f6f6f6", "#ececec", "#e2e2e2", "#d8d8d8", "#cecece"];

const featuredTiles = [
  {
    id: 18,
    color: "#d8d8d8",
    image: "assets/images/grid/detaljplaner.jpg",
    href: "portfolio/detaljplaner/",
    label: "Detaljplaner"
  },
  {
    id: 67,
    color: "#e2e2e2",
    image: "assets/images/grid/projects.jpg",
    href: "portfolio/projects/",
    label: "Projects"
  },
  {
    id: 122,
    color: "#cecece",
    image: "assets/images/grid/rosengard.jpg",
    href: "portfolio/rosengard/",
    label: "Rosengård"
  }
];

const featuredMap = new Map(featuredTiles.map((tile) => [tile.id, tile]));
const gridEl = document.getElementById("pixel-grid");

function attachRippleHoverEffect(tiles) {
  const maxDistance = 2;
  const delayStep = 75;

  const clearDelays = () => {
    tiles.forEach((tile) => tile.style.setProperty("--flip-delay", "0ms"));
  };

  tiles.forEach((tile, tileIndex) => {
    tile.addEventListener("mouseenter", () => {
      const originRow = Math.floor(tileIndex / GRID_COLUMNS);
      const originCol = tileIndex % GRID_COLUMNS;

      tiles.forEach((candidate, candidateIndex) => {
        const row = Math.floor(candidateIndex / GRID_COLUMNS);
        const col = candidateIndex % GRID_COLUMNS;
        const distance = Math.abs(originRow - row) + Math.abs(originCol - col);

        if (distance <= maxDistance) {
          candidate.classList.add("is-flipped");
          candidate.style.setProperty("--flip-delay", `${distance * delayStep}ms`);
        }
      });
    });

    tile.addEventListener("mouseleave", () => {
      tiles.forEach((candidate) => candidate.classList.remove("is-flipped"));
      clearDelays();
    });
  });
}

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
      : '<div class="tile-empty" aria-hidden="true"></div>';

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
  attachRippleHoverEffect(Array.from(gridEl.children));
}
