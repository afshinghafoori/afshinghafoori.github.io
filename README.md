# afshinghafoori.github.io

Personlig portfolio byggd för GitHub Pages.

## Struktur

- `index.html` - startsidan med den interaktiva pixel-gridden.
- `css/style.css` - responsiv layout och grid-styling.
- `js/main.js` - bygger pixel-gridden och kopplar projekt till bilder/länkar.
- `images/grid/` - bilder som används av pixel-gridden på startsidan.
- `assets/` - gemensamma assets som inte är grid-bilder.
- `portfolio/` - projektsidor som grid-rutorna länkar till.

## Grid-bilder

Grid-bilder för startsidan ska ligga i `images/grid/`. I `js/main.js` anges bara filnamnet i `imageName`, och koden bygger hela sökvägen från `GRID_IMAGE_DIR`.

Exempel:

```js
{
  id: 6,
  projectId: "detaljplaner",
  imageName: "detaljplaner.jpg",
  href: "portfolio/detaljplaner/",
  label: "Detaljplaner"
}
```

Det betyder att filen ska ligga här:

```text
images/grid/detaljplaner.jpg
```

## Lokal utveckling

Öppna `index.html` direkt i webbläsaren eller använd valfri enkel statisk server.
