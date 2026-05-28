const DESKTOP_COLUMNS = 12;
const MAX_GRID_ROWS = 12;
const TOTAL_TILES = DESKTOP_COLUMNS * MAX_GRID_ROWS;
const GRID_IMAGE_DIR = "grid";

const palette = ["#ffffff", "#f6f6f6", "#ececec", "#e2e2e2", "#d8d8d8", "#cecece"];

const gridProjects = [
  {
    id: 6,
    projectId: "detaljplaner",
    color: "#d8d8d8",
    imageName: "detaljplaner.jpg",
    href: "portfolio/detaljplaner/",
    label: "Detaljplaner"
  },
  {
    id: 14,
    projectId: "projects",
    color: "#e2e2e2",
    imageName: "projects.jpg",
    href: "portfolio/projects/",
    label: "Projects"
  },
  {
    id: 22,
    projectId: "rosengard",
    color: "#cecece",
    imageName: "rosengard.jpg",
    href: "portfolio/rosengard/",
    label: "Rosengård"
  },
  {
    id: 58,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Moneyshot1.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 69,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Moneyshot.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 82,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Moneyshot2.webp",
    href: "",
    label: "Amman"
  }
];

function getGridImagePath(imageName) {
  return imageName ? `${GRID_IMAGE_DIR}/${imageName}` : "";
}

const featuredTiles = gridProjects.map((project) => ({
  ...project,
  image: getGridImagePath(project.imageName)
}));

const featuredMap = new Map(featuredTiles.map((tile) => [tile.id, tile]));
const gridEl = document.getElementById("pixel-grid");
const tileRegistry = new Map();

function formatTileId(id) {
  return String(id).padStart(3, "0");
}

function getVisibleTiles(tiles) {
  return tiles.filter((tile) => window.getComputedStyle(tile).display !== "none");
}

function getCurrentColumnCount() {
  const value = window.getComputedStyle(gridEl).getPropertyValue("--grid-columns");
  return Number.parseInt(value, 10) || DESKTOP_COLUMNS;
}

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

  tiles.forEach((tile) => {
    tile.addEventListener("mouseenter", () => {
      resetTiles();

      const visibleTiles = getVisibleTiles(tiles);
      const tileIndex = visibleTiles.indexOf(tile);
      if (tileIndex === -1) return;

      const currentColumns = getCurrentColumnCount();
      const originRow = Math.floor(tileIndex / currentColumns);
      const originCol = tileIndex % currentColumns;

      const nearby = [];
      visibleTiles.forEach((candidate, candidateIndex) => {
        const row = Math.floor(candidateIndex / currentColumns);
        const col = candidateIndex % currentColumns;
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
    const tileId = formatTileId(id);
    const tile = featuredMap.get(id) ?? {
      id,
      projectId: "",
      color: palette[id % palette.length],
      image: "",
      href: "",
      label: "Dekorativ ruta"
    };

    const isLink = Boolean(tile.href);
    const wrapperTag = isLink ? "a" : "div";
    const wrapper = document.createElement(wrapperTag);

    wrapper.id = `tile-${tileId}`;
    wrapper.className = `tile${isLink ? " tile--link" : ""}`;
    wrapper.dataset.tileId = tileId;
    wrapper.dataset.projectId = tile.projectId || "";
    wrapper.dataset.imageSrc = tile.image || "";
    wrapper.style.setProperty("--tile-color", tile.color);
    wrapper.setAttribute("role", "listitem");

    tileRegistry.set(tileId, {
      element: wrapper,
      projectId: wrapper.dataset.projectId,
      imageSrc: wrapper.dataset.imageSrc,
      href: tile.href || ""
    });

    if (isLink) {
      wrapper.href = tile.href;
      wrapper.setAttribute("aria-label", `Öppna ${tile.label} (${tileId})`);
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
      <span class="tile-number" aria-hidden="true">${tileId}</span>
    `;

    fragment.appendChild(wrapper);
  }

  gridEl.appendChild(fragment);
  gridEl.tileRegistry = tileRegistry;
  attachRippleHoverEffect(Array.from(gridEl.children));
}
