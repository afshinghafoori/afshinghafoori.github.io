const PROJECT_COLUMNS = 12;
const PROJECT_ROWS = 8;
const PROJECT_TILE_COUNT = PROJECT_COLUMNS * PROJECT_ROWS;
const PROJECT_HERO_PAUSE_MS = 2600;
const PROJECT_HERO_REVEAL_DELAY_MS = 1000;
const PROJECT_HERO_DURATION_MS = 1400;
const PROJECT_HERO_EASING = "cubic-bezier(0.16, 0.72, 0.18, 1)";
const PROJECT_HERO_TRANSITION = `width ${PROJECT_HERO_DURATION_MS}ms ${PROJECT_HERO_EASING}, height ${PROJECT_HERO_DURATION_MS}ms ${PROJECT_HERO_EASING}, left ${PROJECT_HERO_DURATION_MS}ms ${PROJECT_HERO_EASING}, top ${PROJECT_HERO_DURATION_MS}ms ${PROJECT_HERO_EASING}`;
const PROJECT_HERO_REVERSE_TRANSITION = PROJECT_HERO_TRANSITION;
const PROJECT_PALETTE = ["#ffffff", "#f6f6f6", "#ececec", "#e2e2e2", "#d8d8d8", "#cecece"];
const PROJECT_TILE_COLORS = new Map([
  [6, "#d8d8d8"],
  [14, "#e2e2e2"],
  [22, "#cecece"],
  [36, "#d8d8d8"],
  [48, "#d8d8d8"],
  [55, "#d8d8d8"],
  [58, "#d8d8d8"],
  [60, "#d8d8d8"],
  [67, "#d8d8d8"],
  [71, "#d8d8d8"],
  [72, "#d8d8d8"],
  [80, "#d8d8d8"],
  [82, "#d8d8d8"],
  [84, "#d8d8d8"],
  [90, "#d8d8d8"],
  [91, "#d8d8d8"],
  [96, "#d8d8d8"]
]);

const PROJECT_VISIBLE_GRID_IMAGES = new Map([
  [48, "Amman_Section2.webp"],
  [60, "Amman_Section1.webp"],
  [72, "Amman_Section.webp"],
  [84, "Tower Diagram2.webp"],
  [96, "Tower Diagram1.webp"]
]);

const projectImageMap = new Map([
  ["Amman_Moneyshot_grid.webp", "Amman_Moneyshot_project.webp"],
  ["Amman_Moneyshot1_grid.webp", "Amman_Moneyshot1_project.webp"],
  ["Amman_Moneyshot2_grid.webp", "Amman_Moneyshot2_project.webp"]
]);

const projectImageOrder = Array.from(projectImageMap.keys());

let activeProjectGridEl = document.getElementById("project-grid");
let selectedProjectGridImageName = "";
let projectImageBasePath = "moneyshot/";
let projectGridImageBasePath = "../../../grid/";

function getProjectTileLabel(id) {
  return String(id).padStart(3, "0");
}

function getPixelValue(value) {
  return Number.parseFloat(value) || 0;
}

function getProjectTileColor(id) {
  return PROJECT_TILE_COLORS.get(id) || PROJECT_PALETTE[id % PROJECT_PALETTE.length];
}

function getVisibleGridImage(id) {
  const image = PROJECT_VISIBLE_GRID_IMAGES.get(id);
  return image ? `${projectGridImageBasePath}${image}` : "";
}

function getRequestedGridImageName() {
  const params = new URLSearchParams(window.location.search);
  const requestedImage = selectedProjectGridImageName || params.get("image") || projectImageOrder[0];
  return projectImageMap.has(requestedImage) ? requestedImage : projectImageOrder[0];
}

function getProjectImageSequence() {
  const selectedImage = getRequestedGridImageName();
  const selectedIndex = projectImageOrder.indexOf(selectedImage);
  return projectImageOrder.map((_, index) => {
    const imageName = projectImageOrder[(selectedIndex + index) % projectImageOrder.length];
    return `${projectImageBasePath}${projectImageMap.get(imageName)}`;
  });
}

function getGridMetrics() {
  const gridStyles = window.getComputedStyle(activeProjectGridEl);
  const gap = getPixelValue(gridStyles.columnGap);
  const paddingLeft = getPixelValue(gridStyles.paddingLeft);
  const paddingTop = getPixelValue(gridStyles.paddingTop);
  const gridWidth = activeProjectGridEl.clientWidth;
  const tileSize = (gridWidth - (paddingLeft * 2) - ((PROJECT_COLUMNS - 1) * gap)) / PROJECT_COLUMNS;

  return {
    gap,
    paddingLeft,
    paddingTop,
    tileSize
  };
}

function getSpanSize(tileSize, gap, span) {
  return (tileSize * span) + (gap * (span - 1));
}

function getHeroSpan(columnStart, rowStart, columns, rows) {
  const { gap, paddingLeft, paddingTop, tileSize } = getGridMetrics();

  return {
    left: paddingLeft + ((columnStart - 1) * (tileSize + gap)),
    top: paddingTop + ((rowStart - 1) * (tileSize + gap)),
    width: getSpanSize(tileSize, gap, columns),
    height: getSpanSize(tileSize, gap, rows)
  };
}

function setHeroFrame(hero, columnStart, rowStart, columns, rows) {
  const span = getHeroSpan(columnStart, rowStart, columns, rows);
  hero.style.left = `${span.left}px`;
  hero.style.top = `${span.top}px`;
  hero.style.width = `${span.width}px`;
  hero.style.height = `${span.height}px`;
}

function setHeroImageSpan(hero, columns, rows) {
  const image = hero.querySelector("img");
  const span = getHeroSpan(1, 1, columns, rows);
  if (!image) return;

  image.style.width = `${span.width}px`;
  image.style.height = `${span.height}px`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForHeroTransition(hero, fallbackMs = PROJECT_HERO_DURATION_MS + 100) {
  return new Promise((resolve) => {
    let isResolved = false;

    const finish = () => {
      if (isResolved) return;
      isResolved = true;
      hero.removeEventListener("transitionend", handleTransitionEnd);
      window.clearTimeout(timer);
      resolve();
    };

    const handleTransitionEnd = (event) => {
      if (event.target === hero && event.propertyName === "width") {
        finish();
      }
    };

    const timer = window.setTimeout(finish, fallbackMs);
    hero.addEventListener("transitionend", handleTransitionEnd);
  });
}

async function animateHeroFrame(hero, columnStart, rowStart, columns, rows, transition = PROJECT_HERO_TRANSITION) {
  hero.style.transition = transition;
  hero.offsetWidth;
  window.requestAnimationFrame(() => {
    setHeroFrame(hero, columnStart, rowStart, columns, rows);
  });
  await waitForHeroTransition(hero);
}

function renderProjectGrid(targetGridEl, options = {}) {
  if (!targetGridEl) return;

  activeProjectGridEl = targetGridEl;
  selectedProjectGridImageName = options.imageName || "";
  projectImageBasePath = options.projectImageBasePath || "moneyshot/";
  projectGridImageBasePath = options.projectGridImageBasePath || "../../../grid/";
  activeProjectGridEl.innerHTML = "";
  const initialRevealDelay = options.initialRevealDelayMs ?? PROJECT_HERO_REVEAL_DELAY_MS;

  const projectImageSequence = getProjectImageSequence();
  const fragment = document.createDocumentFragment();

  for (let id = 1; id <= PROJECT_TILE_COUNT; id += 1) {
    const tile = document.createElement("div");
    tile.className = "tile project-tile";
    tile.dataset.tileId = getProjectTileLabel(id);
    tile.style.setProperty("--tile-color", getProjectTileColor(id));
    tile.setAttribute("role", "listitem");
    tile.setAttribute("aria-hidden", "true");
    const image = getVisibleGridImage(id);
    tile.innerHTML = `
      ${image ? `<img src="${image}" alt="" loading="eager" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;max-width:100%;object-fit:cover;display:block;">` : ""}
      <span class="tile-number" aria-hidden="true">${getProjectTileLabel(id)}</span>
    `;
    fragment.appendChild(tile);
  }

  const hero = document.createElement("figure");
  hero.className = "project-hero";
  hero.setAttribute("aria-label", "Projektbild");
  hero.innerHTML = `<img src="${projectImageSequence[0]}" alt="">`;

  const secondHero = document.createElement("figure");
  secondHero.className = "project-hero";
  secondHero.setAttribute("aria-label", "Projektbild");
  secondHero.innerHTML = `<img src="${projectImageSequence[1]}" alt="">`;
  secondHero.style.zIndex = "11";
  secondHero.style.visibility = "hidden";

  const thirdHero = document.createElement("figure");
  thirdHero.className = "project-hero";
  thirdHero.setAttribute("aria-label", "Projektbild");
  thirdHero.innerHTML = `<img src="${projectImageSequence[2]}" alt="">`;
  thirdHero.style.zIndex = "10";
  thirdHero.style.visibility = "hidden";

  activeProjectGridEl.appendChild(fragment);
  activeProjectGridEl.appendChild(hero);
  activeProjectGridEl.appendChild(secondHero);
  activeProjectGridEl.appendChild(thirdHero);

  const animateHero = async () => {
    setHeroImageSpan(hero, 6, 3);
    setHeroImageSpan(secondHero, 6, 3);
    setHeroImageSpan(thirdHero, 6, 3);
    hero.style.transition = "none";
    secondHero.style.transition = "none";
    thirdHero.style.transition = "none";
    setHeroFrame(hero, 1, 1, 3, 3);
    setHeroFrame(secondHero, 4, 1, 3, 3);
    setHeroFrame(thirdHero, 7, 1, 3, 3);
    hero.offsetWidth;
    secondHero.offsetWidth;
    thirdHero.offsetWidth;
    hero.style.transition = "";
    secondHero.style.transition = "";
    thirdHero.style.transition = "";

    await wait(initialRevealDelay);
    await animateHeroFrame(hero, 1, 1, 6, 3);
    await wait(PROJECT_HERO_PAUSE_MS);

    secondHero.style.visibility = "visible";
    await animateHeroFrame(hero, 1, 1, 3, 3, PROJECT_HERO_REVERSE_TRANSITION);

    await wait(PROJECT_HERO_REVEAL_DELAY_MS);
    await animateHeroFrame(secondHero, 4, 1, 6, 3);
    await wait(PROJECT_HERO_PAUSE_MS);

    thirdHero.style.visibility = "visible";
    await animateHeroFrame(secondHero, 4, 1, 3, 3, PROJECT_HERO_REVERSE_TRANSITION);

    await wait(PROJECT_HERO_REVEAL_DELAY_MS);
    await animateHeroFrame(thirdHero, 7, 1, 6, 3);
  };

  animateHero();
  window.addEventListener("resize", () => {
    setHeroImageSpan(hero, 6, 3);
    setHeroImageSpan(secondHero, 6, 3);
    setHeroImageSpan(thirdHero, 6, 3);
    setHeroFrame(hero, 1, 1, 3, 3);
    setHeroFrame(secondHero, 4, 1, 3, 3);
    setHeroFrame(thirdHero, 7, 1, 6, 3);
  });
}

window.renderProjectGrid = renderProjectGrid;

if (activeProjectGridEl) {
  renderProjectGrid(activeProjectGridEl);
}
