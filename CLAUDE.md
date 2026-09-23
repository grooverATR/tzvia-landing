# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page Hebrew (RTL) landing page for Tzvia Gruber's piano lessons for women and girls in Negohot. Plain static HTML/CSS/JS: no build step, package manager, linter or tests. To preview, open `index.html` directly in a browser. All user-facing copy is in Hebrew and addresses the reader in the feminine form (e.g. "לחצי", "שלחי"). Keep that voice.

## Files

- `index.html` is the markup.
- `assets/img/` holds images: `hero.jpg` (1536×1024) is the hero image, with `hero-800.jpg` as the mobile version via `srcset`. Future `hero.mp4` / `poster.jpg` go here too. `og.jpg` is the social preview and `favicon.svg` is the tab icon. The 2MB `ChatGPT Image*.png` source image is git-ignored.
- `.nojekyll` makes GitHub Pages serve the files as-is, without Jekyll processing.
- `assets/css/styles.css` holds the design tokens as CSS variables on `:root` (`--accent`, `--overlay`, `--font-display`, `--wobble`, …). Fonts come from Google Fonts: Bellefair, Karantina, Assistant, Amatic SC.
- `assets/js/script.js` contains three independent IIFE/handlers:
  1. **Playable staff:** builds the SVG notes of the opening of "Für Elise" into `#notesLayer` and plays them with the Web Audio API (a triangle plus a sine oscillator). Each `melody` entry is `[freq, Hebrew note name, staff y, isSharp]`. The y values follow the staff line positions in the SVG `viewBox="0 0 520 80"` (the comment maps F5=16 … A4=46). The staff box is forced to `direction:ltr` inside the RTL page.
  2. **Lead form:** `#leadForm` posts to a Google Form ("פסנתר צביה", fields entry.823151790 name, entry.1418702409 phone, entry.54648334 background) through the hidden iframe `hidden_iframe`. The `<option>` values must match the Google Form choices exactly (hence `value="לא ניגנתי"` on the first one), or Google rejects the submission. The JS only swaps in `#formSuccess` after 400ms, and there is no real response handling.
  3. **Design panel:** a temporary tuning UI (the ⚙️ button) that live-edits the `--accent`, `--overlay` and `--font-display` CSS variables.

## Hosting

GitHub Pages at `https://grooveratr.github.io/tzvia-landing/` (repo `grooverATR/tzvia-landing`). `canonical`, `og:url` and `og:image` in `<head>` hard-code this absolute URL (Open Graph needs absolute URLs), so update them if the repo or domain changes. `assets/img/og.jpg` (1200×630, cropped from `hero.jpg`) is the WhatsApp/Facebook preview image.

## Pending TODOs before publishing

These are marked in the HTML/CSS comments:
- **TODO-VIDEO**: replace the hero `<img>` with a muted, looping `<video class="hero-media">` (a short MP4, ~2–4MB). The CSS comment in `assets/css/styles.css` has the snippet.
- **TODO-PHOTO**: replace the `.avatar.placeholder` div in the about section with an `<img class="avatar">` (square, ~400×400).
- **TODO-NAME**: personalize the "נעים להכיר" about text.
- **Design panel removal**: delete the block between `DESIGN PANEL START/END` in the HTML, the `DESIGN PANEL SCRIPT` IIFE in `assets/js/script.js`, and the matching `.dp`/`.dp-toggle` styles in `assets/css/styles.css`.
