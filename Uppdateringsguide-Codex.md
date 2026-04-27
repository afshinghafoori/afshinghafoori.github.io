# Steg-för-steg: Uppdatera HTML/CSS/JS och publicera via PR + GitHub Pages

Datum: 2026-04-27

## Översikt
Detta dokument beskriver exakt arbetsflöde för att göra ändringar i `index.html`, `css/style.css` och `js/main.js`, skapa PR, mergea och verifiera deployment på GitHub Pages.

## 1) Förberedelse
1. Öppna repot lokalt i Codex/terminal.
2. Kontrollera att du står i rätt repo och branch.
3. Kör en snabb statuskontroll innan du börjar.

## 2) Gör ändringar i kod
- **HTML (`index.html`)**: uppdatera struktur/innehåll (sektioner, rubriker, navigation).
- **CSS (`css/style.css`)**: uppdatera layout, färger, typografi, responsivitet.
- **JS (`js/main.js`)**: uppdatera enkel interaktivitet/funktionslogik.
- Tips: gör fokuserade ändringar per område så diffen blir lättare att granska.

## 3) Lokal validering
1. Syntaxkontroll av JavaScript:
   ```bash
   node --check js/main.js
   ```
2. Kontrollera att sidan kan öppnas lokalt (`index.html` i webbläsare).
3. Gör en snabb visuell kontroll i desktop + mobil bredd.

## 4) Commit
1. Lägg till filer:
   ```bash
   git add index.html css/style.css js/main.js
   ```
2. Commit:
   ```bash
   git commit -m "Beskrivande commit-meddelande"
   ```
3. Bekräfta senaste commit:
   ```bash
   git log --oneline -1
   ```

## 5) Skapa PR
1. Skapa PR från feature-branch till `main`.
2. Kontrollera PR-diff i **Files changed**.
3. Säkerställ att `base = main` och `compare = din branch`.
4. Lägg tydlig PR-beskrivning: motivation, ändringar, testning.

## 6) Mergning
1. När PR är **Ready to merge**: klicka **Merge pull request**.
2. Klicka **Confirm merge**.
3. (Valfritt) klicka **Delete branch**.

## 7) Deployment via GitHub Pages
1. Gå till **Actions** och öppna senaste **pages build and deployment**.
2. Vänta på **Status: Success**.
3. Öppna live-sidan: <https://afshinghafoori.github.io/>.
4. Gör hard refresh (`Ctrl+F5`) om ändringar inte syns direkt.

## 8) Felsökning
Om gammal version visas:
- Kontrollera att PR verkligen är merged till `main`.
- Kontrollera att senaste pages-workflow är **Success**.
- Testa inkognito och/eller vänta 1–3 minuter (cache/CDN).

## 9) Rekommenderad rutin framåt
- En PR per avgränsad förändring (struktur, design, innehåll, funktion).
- Kort testchecklista i varje PR.
- Verifiera alltid live-sidan direkt efter deploy.
