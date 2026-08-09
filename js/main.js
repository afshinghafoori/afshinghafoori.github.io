const DESKTOP_COLUMNS = 12;
const MAX_GRID_ROWS = 12;
const TOTAL_TILES = DESKTOP_COLUMNS * MAX_GRID_ROWS;
const GRID_IMAGE_DIR = "grid";
const AMMAN_PROJECT_PATH = "portfolio/architecture/Creative%20Competition%20-%20Amman%20hospital/";

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
    id: 72,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Tower Diagram2.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 84,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Tower Diagram1.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 96,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Tower Diagram.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 36,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Section2.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 48,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Section1.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 60,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "Amman_Section.webp",
    href: "",
    label: "Amman"
  },
  {
    id: 58,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "AmmanMoneyshot1.webp",
    href: AMMAN_PROJECT_PATH,
    label: "Amman"
  },
  {
    id: 82,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "AmmanMoneyshot (rev).webp",
    href: AMMAN_PROJECT_PATH,
    label: "Amman"
  },
  {
    id: 71,
    projectId: "amman",
    color: "#d8d8d8",
    imageName: "AmmanMoneyshot2.webp",
    href: AMMAN_PROJECT_PATH,
    label: "Amman"
  },
  {
    id: 80,
    projectId: "lanzarote",
    color: "#d8d8d8",
    imageName: "LanzaroteMoneyshot1.webp",
    href: "",
    label: "Lanzarote"
  },
  {
    id: 67,
    projectId: "lanzarote",
    color: "#d8d8d8",
    imageName: "LanzaroteMoneyshot2.webp",
    href: "",
    label: "Lanzarote"
  },
  {
    id: 55,
    projectId: "lanzarote",
    color: "#d8d8d8",
    imageName: "LanzaroteMoneyshot3.webp",
    href: "",
    label: "Lanzarote"
  },
  {
    id: 90,
    projectId: "lanzarote",
    color: "#d8d8d8",
    imageName: "LanzaroteMoneyshot_Landscape.webp",
    href: "",
    label: "Lanzarote"
  },
  {
    id: 91,
    projectId: "lanzarote",
    color: "#d8d8d8",
    imageName: "LanzaroteMoneyshot_Landscape1.webp",
    href: "",
    label: "Lanzarote"
  }
];

function getGridImagePath(imageName) {
  return imageName ? `${GRID_IMAGE_DIR}/${imageName}` : "";
}

function getImageNameFromPath(imagePath) {
  return imagePath.split("/").pop() || "";
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

      const projectId = tile.dataset.projectId;
      const nearby = [];
      visibleTiles.forEach((candidate, candidateIndex) => {
        const row = Math.floor(candidateIndex / currentColumns);
        const col = candidateIndex % currentColumns;
        const distance = Math.abs(originRow - row) + Math.abs(originCol - col);
        const isProjectClusterTile = projectId && candidate.dataset.projectId === projectId;
        const isNearbyEmptyTile = !projectId && distance <= maxDistance;

        if (isProjectClusterTile || isNearbyEmptyTile) {
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

function attachTileExpandEffect(tiles) {
  let expandedTile = null;
  let isOpeningProject = false;

  const getPixelValue = (value) => Number.parseFloat(value) || 0;

  const expandTile = (tile) => {
    const inner = tile.querySelector(".tile-inner");
    const front = tile.querySelector(".tile-front");
    const back = tile.querySelector(".tile-back");
    const number = tile.querySelector(".tile-number");
    if (!inner) return;

    const tileRect = tile.getBoundingClientRect();
    const gridStyles = window.getComputedStyle(gridEl);
    const columnGap = getPixelValue(gridStyles.columnGap);
    const rowGap = getPixelValue(gridStyles.rowGap);

    tile.classList.remove("is-flipped");
    tile.classList.add("is-expanded");
    tile.setAttribute("aria-pressed", "true");
    tile.style.zIndex = "12";

    inner.style.width = `${(tileRect.width * 3) + (columnGap * 2)}px`;
    inner.style.height = `${(tileRect.height * 3) + (rowGap * 2)}px`;
    inner.style.left = `-${tileRect.width + columnGap}px`;
    inner.style.top = `-${tileRect.height + rowGap}px`;
    inner.style.boxShadow = "0 18px 48px rgba(0, 0, 0, 0.24)";
    inner.style.transition = "width 550ms cubic-bezier(0.2, 0.65, 0.2, 1), height 550ms cubic-bezier(0.2, 0.65, 0.2, 1), left 550ms cubic-bezier(0.2, 0.65, 0.2, 1), top 550ms cubic-bezier(0.2, 0.65, 0.2, 1), box-shadow 550ms cubic-bezier(0.2, 0.65, 0.2, 1)";
    inner.style.transform = "none";

    if (front) {
      front.style.display = "none";
    }

    if (back) {
      back.style.transform = "none";
    }

    if (number) {
      number.style.opacity = "0";
    }

    expandedTile = tile;
  };

  const getProjectOriginRect = () => {
    const gridRect = gridEl.getBoundingClientRect();
    const gridStyles = window.getComputedStyle(gridEl);
    const gap = getPixelValue(gridStyles.columnGap);
    const paddingLeft = getPixelValue(gridStyles.paddingLeft);
    const paddingTop = getPixelValue(gridStyles.paddingTop);
    const tileSize = (gridEl.clientWidth - (paddingLeft * 2) - ((getCurrentColumnCount() - 1) * gap)) / getCurrentColumnCount();

    return {
      left: gridRect.left + paddingLeft,
      top: gridRect.top + paddingTop,
      width: (tileSize * 3) + (gap * 2),
      height: (tileSize * 3) + (gap * 2)
    };
  };

  const waitForTileTransition = (inner, fallbackMs = 700) => new Promise((resolve) => {
    let isResolved = false;

    const finish = () => {
      if (isResolved) return;
      isResolved = true;
      inner.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(timer);
      resolve();
    };

    const handleTransitionEnd = (event) => {
      if (event.target === inner && (event.propertyName === "left" || event.propertyName === "top")) {
        finish();
      }
    };

    const timer = window.setTimeout(finish, fallbackMs);
    inner.addEventListener("transitionend", handleTransitionEnd);
  });

  const moveExpandedTileToProjectOrigin = (tile) => {
    const inner = tile.querySelector(".tile-inner");
    if (!inner) return Promise.resolve();

    const tileRect = tile.getBoundingClientRect();
    const targetRect = getProjectOriginRect();

    inner.style.width = `${targetRect.width}px`;
    inner.style.height = `${targetRect.height}px`;
    inner.style.left = `${targetRect.left - tileRect.left}px`;
    inner.style.top = `${targetRect.top - tileRect.top}px`;
    inner.style.boxShadow = "0 18px 48px rgba(0, 0, 0, 0.22)";
    inner.style.transition = "width 700ms cubic-bezier(0.16, 0.72, 0.18, 1), height 700ms cubic-bezier(0.16, 0.72, 0.18, 1), left 700ms cubic-bezier(0.16, 0.72, 0.18, 1), top 700ms cubic-bezier(0.16, 0.72, 0.18, 1), box-shadow 700ms cubic-bezier(0.16, 0.72, 0.18, 1)";

    return waitForTileTransition(inner);
  };

  const openExpandedTileProject = async (tile) => {
    const href = tile.dataset.projectHref;
    if (!href) return false;

    await moveExpandedTileToProjectOrigin(tile);

    const url = new URL(href, window.location.href);
    const imageName = getImageNameFromPath(tile.dataset.imageSrc || "");
    if (imageName) {
      url.searchParams.set("image", imageName);
    }

    window.location.href = url.href;
    return true;
  };

  const collapseExpandedTile = () => {
    if (!expandedTile) return;
    const inner = expandedTile.querySelector(".tile-inner");
    const front = expandedTile.querySelector(".tile-front");
    const back = expandedTile.querySelector(".tile-back");
    const number = expandedTile.querySelector(".tile-number");

    expandedTile.classList.remove("is-expanded");
    expandedTile.setAttribute("aria-pressed", "false");
    expandedTile.style.zIndex = "";

    if (inner) {
      inner.style.width = "";
      inner.style.height = "";
      inner.style.left = "";
      inner.style.top = "";
      inner.style.boxShadow = "";
      inner.style.transition = "";
      inner.style.transform = "";
    }

    if (front) {
      front.style.display = "";
    }

    if (back) {
      back.style.transform = "";
    }

    if (number) {
      number.style.opacity = "";
    }

    expandedTile = null;
  };

  tiles.forEach((tile) => {
    if (!tile.dataset.projectId || !tile.dataset.imageSrc) return;

    tile.addEventListener("click", (event) => {
      event.preventDefault();
      if (isOpeningProject) return;

      const isExpanded = tile === expandedTile;

      if (isExpanded && tile.dataset.projectHref) {
        isOpeningProject = true;
        openExpandedTileProject(tile);
        return;
      }

      collapseExpandedTile();

      if (!isExpanded) {
        expandTile(tile);
      }
    });

    tile.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      tile.click();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      collapseExpandedTile();
    }
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

    const opensProjectAfterExpand = Boolean(tile.projectId === "amman" && tile.image && tile.href);
    const isLink = Boolean(tile.href && !opensProjectAfterExpand);
    const wrapperTag = isLink ? "a" : "div";
    const wrapper = document.createElement(wrapperTag);

    wrapper.id = `tile-${tileId}`;
    wrapper.className = `tile${isLink ? " tile--link" : ""}${tile.projectId && tile.image ? " tile--project" : ""}`;
    wrapper.dataset.tileId = tileId;
    wrapper.dataset.projectId = tile.projectId || "";
    wrapper.dataset.imageSrc = tile.image || "";
    wrapper.dataset.projectHref = tile.href || "";
    wrapper.style.setProperty("--tile-color", tile.color);
    wrapper.setAttribute("role", "listitem");

    if (tile.projectId && tile.image) {
      wrapper.style.cursor = "zoom-in";
    }

    tileRegistry.set(tileId, {
      element: wrapper,
      projectId: wrapper.dataset.projectId,
      imageSrc: wrapper.dataset.imageSrc,
      href: tile.href || ""
    });

    if (isLink) {
      wrapper.href = tile.href;
      wrapper.setAttribute("aria-label", `Öppna ${tile.label} (${tileId})`);
    } else if (tile.projectId && tile.image) {
      wrapper.setAttribute("aria-label", `Förstora ${tile.label} (${tileId})`);
      wrapper.setAttribute("aria-pressed", "false");
      wrapper.setAttribute("role", "button");
      wrapper.tabIndex = 0;
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
  const tiles = Array.from(gridEl.children);
  attachRippleHoverEffect(tiles);
  attachTileExpandEffect(tiles);
}
