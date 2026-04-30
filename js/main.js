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

function shuffle(array) {
  const clone = [...array];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

function attachRippleHoverEffect(tiles) {
  const maxDistance = 2;
  const stepDelay = 95;
  let activeTimers = [];

  const resetTiles = () => {
    activeTimers.forEach((timer) => window.clearTimeout(timer));
    activeTimers = [];
    tiles.forEach((tile) => {
      tile.classList.remove("is-flipped");
      tile.style.setProperty("--flip-delay", "0ms");
    });
  };

  tiles.forEach((tile, tileIndex) => {
    tile.addEventListener("mouseenter", () => {
      resetTiles();

      const originRow = Math.floor(tileIndex / GRID_COLUMNS);
      const originCol = tileIndex % GRID_COLUMNS;

      const nearby = [];
      tiles.forEach((candidate, candidateIndex) => {
        const row = Math.floor(candidateIndex / GRID_COLUMNS);
        const col = candidateIndex % GRID_COLUMNS;
        const distance = Math.abs(originRow - row) + Math.abs(originCol - col);

        if (distance <= maxDistance) {
          nearby.push({ candidate, distance, candidateIndex });
        }
      });

      const center = nearby.find((entry) => entry.candidateIndex === tileIndex);
      const surrounding = nearby.filter((entry) => entry.candidateIndex !== tileIndex);

      if (center) {
        center.candidate.classList.add("is-flipped");
      }

      const distanceRings = new Map();
      surrounding.forEach((entry) => {
        if (!distanceRings.has(entry.distance)) {
          distanceRings.set(entry.distance, []);
        }
        distanceRings.get(entry.distance).push(entry);
      });

      const orderedSurrounding = [];
      Array.from(distanceRings.keys())
        .sort((a, b) => a - b)
        .forEach((distance) => {
          orderedSurrounding.push(...shuffle(distanceRings.get(distance)));
        });

      orderedSurrounding.forEach((entry, order) => {
        const timer = window.setTimeout(() => {
          entry.candidate.classList.add("is-flipped");
        }, (order + 1) * stepDelay);
        activeTimers.push(timer);
      });
    });

    tile.addEventListener("mouseleave", resetTiles);
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
