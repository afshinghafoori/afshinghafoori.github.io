const PROJECT_COLUMNS = 12;
const PROJECT_ROWS = 8;
const PROJECT_TILE_COUNT = PROJECT_COLUMNS * PROJECT_ROWS;
const PROJECT_HERO_PAUSE_MS = 2600;
const PROJECT_HERO_REVEAL_DELAY_MS = 1000;
const PROJECT_HERO_TRANSITION = "width 1400ms cubic-bezier(0.16, 0.72, 0.18, 1), height 1400ms cubic-bezier(0.16, 0.72, 0.18, 1), left 1400ms cubic-bezier(0.16, 0.72, 0.18, 1), top 1400ms cubic-bezier(0.16, 0.72, 0.18, 1)";
const PROJECT_HERO_REVERSE_TRANSITION = "width 1400ms cubic-bezier(0.82, 0, 0.84, 0.28), height 1400ms cubic-bezier(0.82, 0, 0.84, 0.28), left 1400ms cubic-bezier(0.82, 0, 0.84, 0.28), top 1400ms cubic-bezier(0.82, 0, 0.84, 0.28)";
const PROJECT_PALETTE = ["#ffffff", "#f6f6f6", "#ececec", "#e2e2e2", "#d8d8d8", "#cecece"];

const projectImageMap = new Map([
  ["AmmanMoneyshot (rev).webp", "moneyshot/AmmanMoneyshot_project(rev).webp"],
  ["AmmanMoneyshot1.webp", "moneyshot/AmmanMoneyshot2_project.webp"],
  ["AmmanMoneyshot2.webp", "moneyshot/AmmanMoneyshot3_project.webp"]
]);

const projectGridEl = document.getElementById("project-grid");

function getProjectTileLabel(id) {
  return String(id).padStart(3, "0");
}

function getPixelValue(value) {
  return Number.parseFloat(value) || 0;
}

function getSelectedProjectImage() {
  const params = new URLSearchParams(window.location.search);
  const requestedImage = params.get("image") || "AmmanMoneyshot (rev).webp";
  return projectImageMap.get(requestedImage) || projectImageMap.get("AmmanMoneyshot (rev).webp");
}

function getGridMetrics() {
  const gridStyles = window.getComputedStyle(projectGridEl);
  const gap = getPixelValue(gridStyles.columnGap);
  const paddingLeft = getPixelValue(gridStyles.paddingLeft);
  const paddingTop = getPixelValue(gridStyles.paddingTop);
  const gridWidth = projectGridEl.clientWidth;
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

function waitForHeroTransition(hero, fallbackMs = 1500) {
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

if (projectGridEl) {
  const fragment = document.createDocumentFragment();

  for (let id = 1; id <= PROJECT_TILE_COUNT; id += 1) {
    const tile = document.createElement("div");
    tile.className = "tile project-tile";
    tile.dataset.tileId = getProjectTileLabel(id);
    tile.style.setProperty("--tile-color", PROJECT_PALETTE[id % PROJECT_PALETTE.length]);
    tile.setAttribute("role", "listitem");
    tile.setAttribute("aria-hidden", "true");
    tile.innerHTML = `<span class="tile-number" aria-hidden="true">${getProjectTileLabel(id)}</span>`;
    fragment.appendChild(tile);
  }

  const hero = document.createElement("figure");
  hero.className = "project-hero";
  hero.setAttribute("aria-label", "Projektbild");
  hero.innerHTML = `<img src="${getSelectedProjectImage()}" alt="">`;

  const secondHero = document.createElement("figure");
  secondHero.className = "project-hero";
  secondHero.setAttribute("aria-label", "Projektbild");
  secondHero.innerHTML = '<img src="moneyshot/AmmanMoneyshot2_project.webp" alt="">';
  secondHero.style.zIndex = "11";
  secondHero.style.visibility = "hidden";

  projectGridEl.appendChild(fragment);
  projectGridEl.appendChild(hero);
  projectGridEl.appendChild(secondHero);

  const animateHero = async () => {
    setHeroImageSpan(hero, 6, 3);
    setHeroImageSpan(secondHero, 6, 3);
    hero.style.transition = "none";
    secondHero.style.transition = "none";
    setHeroFrame(hero, 1, 1, 3, 3);
    setHeroFrame(secondHero, 4, 1, 3, 3);
    hero.offsetWidth;
    secondHero.offsetWidth;
    hero.style.transition = "";
    secondHero.style.transition = "";

    await wait(PROJECT_HERO_REVEAL_DELAY_MS);
    await animateHeroFrame(hero, 1, 1, 6, 3);
    await wait(PROJECT_HERO_PAUSE_MS);

    secondHero.style.visibility = "visible";
    await animateHeroFrame(hero, 1, 1, 3, 3, PROJECT_HERO_REVERSE_TRANSITION);

    await wait(PROJECT_HERO_REVEAL_DELAY_MS);
    await animateHeroFrame(secondHero, 4, 1, 6, 3);
  };

  animateHero();
  window.addEventListener("resize", () => {
    setHeroImageSpan(hero, 6, 3);
    setHeroImageSpan(secondHero, 6, 3);
    setHeroFrame(hero, 1, 1, 3, 3);
    setHeroFrame(secondHero, 4, 1, 6, 3);
  });
}
