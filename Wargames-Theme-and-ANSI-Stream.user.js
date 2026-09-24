// ==UserScript==
// @name         Wargames - Theme and ANSI Art Stream
// @namespace    wargames.local
// @version      3.6.6
// @description  Wargames theme, ANSI stream, and Bit activity mascot for Claude Code.
// @match        https://claude.ai/*
// @updateURL    https://raw.githubusercontent.com/jackwalsh88/terminal/main/Wargames-Theme-and-ANSI-Stream.user.js
// @downloadURL  https://raw.githubusercontent.com/jackwalsh88/terminal/main/Wargames-Theme-and-ANSI-Stream.user.js
// @run-at       document-start
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      16colo.rs
// ==/UserScript==

(async () => {
  'use strict';
  // document-start removes Claude's several-second load gate. Firefox can run
  // this before <html> exists, so wait only for that root node, not DOM ready.
  if (!document.documentElement) {
    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (!document.documentElement) return;
        observer.disconnect();
        resolve();
      });
      observer.observe(document, { childList: true });
    });
  }
  // Replace the old ANSI Art Stream script with this complete script.
  // Disable the separate Wargames Stylus style; keep the random header script.
  // CSS applies only on /code, including Claude's in-app navigation.
  const themeStyle = document.createElement('style');
  themeStyle.id = 'wargames-theme-css';
  themeStyle.textContent = `
/* wargames — Claude Code / Stylus — version 1.1
   Create a normal Stylus style named wargames.
   Applies to: URLs starting with https://claude.ai/code
   Disable cyberbbs/neotron on Claude before enabling this complete replacement.
*/

:root {
  --ansi-bg: #020805;
  --ansi-panel: #04140e;
  --ansi-text: #50e7ff;
  --ansi-user: #8fffab;
  --ansi-muted: #80b59a;
  --ansi-border: #145938;
  --ansi-amber: #cc88ff;
  --ansi-cyan: #00e5ff;
  --ansi-font: "Departure Mono", "Cascadia Code", "IBM Plex Mono",
    "Fira Code", Consolas, "Liberation Mono", monospace;
  --ansi-scan-opacity: .60;
  --wargames-glow: .32;
  --wargames-vignette: .74;
}

:root, [data-theme="dark"], .dark {
  color-scheme: dark;
  --bg-000: 150 60% 2% !important;
  --bg-100: 158 67% 5% !important;
  --bg-200: 155 45% 8% !important;
  --bg-300: 155 35% 11% !important;
  --bg-400: 155 28% 16% !important;
  --text-000: 188 100% 66% !important;
  --text-100: 188 100% 66% !important;
  --text-200: 184 80% 62% !important;
  --text-300: 181 55% 52% !important;
  --text-400: 175 40% 48% !important;
  --text-500: 170 30% 44% !important;
  --border-100: 151 45% 30% !important;
  --border-200: 151 50% 24% !important;
  --border-300: 151 63% 21% !important;
  --accent-main-000: 174 100% 75% !important;
  --accent-main-100: 186 100% 50% !important;
  --accent-main-200: 186 85% 40% !important;
  --accent-secondary-100: 274 100% 77% !important;
}

html, body {
  background-color: var(--ansi-bg) !important;
  color: var(--ansi-text) !important;
  scrollbar-width: none !important;
}

main {
  background-color: var(--ansi-bg) !important;
}

/* The refreshed Code landing page uses ordinary headings, links and buttons
   outside the conversation prose. Keep icon fonts and status indicators native. */
main :is(h1, h2, h3):not(:is(.prose, .font-claude-message, .cds-user-message-body) *) {
  font-family: var(--ansi-font) !important;
  color: var(--ansi-cyan) !important;
  font-weight: 500 !important;
  text-shadow: 0 0 5px #00e5ff55;
}

main :is(button, a, [role="tab"]) {
  font-family: var(--ansi-font) !important;
}

/* Session links on the landing page; no sizing or click-target changes. */
main a[href^="/code/"]:not(.cds-user-message-body *) {
  border-radius: 2px !important;
}

main a[href^="/code/"]:not(.cds-user-message-body *):hover {
  box-shadow: inset 2px 0 var(--ansi-cyan) !important;
}

/* Text-bearing elements only. CDS icons retain their native icon font. */
main :is(.font-claude-message, .prose, .cds-user-message-body),
main :is(textarea, [contenteditable="true"], pre, code, kbd, samp),
[data-row-label],
#portal-root [role="menuitem"] > span.truncate {
  font-family: var(--ansi-font) !important;
}

main :is(.font-claude-message, .prose) {
  color: var(--ansi-text) !important;
  text-shadow: 0 0 4px rgb(80 231 255 / var(--wargames-glow));
}

main .cds-user-message-body,
main .cds-user-message-body :is(p, li, blockquote) {
  color: var(--ansi-user) !important;
  text-shadow: 0 0 4px rgb(143 255 171 / var(--wargames-glow));
}

main .cds-user-message-body {
  background-color: var(--ansi-panel) !important;
  border: 1px solid var(--ansi-border) !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 0 8px #00ff960a,
    2px 2px 0 #000c !important;
}

/* Composer typography and caret. Preserve Claude's editor sizing and behavior. */
main :is(textarea, [contenteditable="true"]) {
  color: var(--ansi-user) !important;
  caret-color: var(--ansi-cyan) !important;
  border-radius: 2px !important;
}

main input:is([type="text"], [type="search"], [type="url"], [type="email"], [type="password"]) {
  font-family: var(--ansi-font) !important;
  color: var(--ansi-user) !important;
  border-color: var(--ansi-border) !important;
  border-radius: 2px !important;
}

/* Square the immediate composer shell without changing its layout. */
main div:has(> [data-cds="ChatComposerEditor"]) {
  border-radius: 2px !important;
}

/* Claude centers the conversation as if the ANSI feed did not exist. The
   script marks the live message/composer columns and supplies a measured
   width that balances the space between the sidebar and artwork feed. */
@media (min-width: 1100px) {
  main [data-wargames-wide-column="true"] {
    width: var(--wargames-content-width) !important;
    max-width: none !important;
    translate: var(--wargames-content-shift) 0 !important;
  }

  /* Assistant replies are separate siblings in Claude's refreshed UI, so the
     script measures and places them directly in the usable center lane. */
  main [data-wargames-assistant-column="true"] {
    width: var(--wargames-assistant-width) !important;
    max-width: none !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    translate: var(--wargames-assistant-shift) 0 !important;
  }
}

main :is(.prose, .font-claude-message) :is(h1, h2, h3, h4) {
  color: var(--ansi-cyan) !important;
}

main :is(.prose, .font-claude-message, .cds-user-message-body)
  :is(strong, b):not(pre *, code *) {
  color: var(--ansi-cyan) !important;
  text-shadow: 0 0 6px #00e5ff59;
}

main :is(.prose, .font-claude-message, .cds-user-message-body) a {
  color: var(--ansi-cyan) !important;
  text-underline-offset: 3px;
}

main pre {
  background: #020b07 !important;
  border: 1px solid var(--ansi-border) !important;
  border-radius: 2px !important;
  box-shadow:
    inset 0 0 8px #00ff960a,
    2px 2px 0 #000c !important;
}

main code:not(pre code) {
  color: var(--ansi-amber) !important;
  background: color-mix(in srgb, var(--ansi-amber) 8%, transparent) !important;
  border: 1px solid color-mix(in srgb, var(--ansi-amber) 30%, transparent) !important;
  border-radius: 0 !important;
  padding: 1px 7px !important;
}

main hr {
  border: 0 !important;
  border-top: 1px dashed var(--ansi-border) !important;
  opacity: .7;
}

/* Sidebar. The refreshed header can be a text wordmark instead of the SVG. */
aside, nav[aria-label="Sidebar"] {
  background: var(--ansi-bg) !important;
  border-right: 1px solid var(--ansi-border) !important;
}

aside :is(a, button)[aria-label="Claude"],
nav[aria-label="Sidebar"] :is(a, button)[aria-label="Claude"],
aside :is(header, [data-testid="sidebar-header"]) a[href="/"],
nav[aria-label="Sidebar"] :is(header, [data-testid="sidebar-header"]) a[href="/"] {
  color: var(--ansi-cyan) !important;
  font-family: var(--ansi-font) !important;
  text-shadow: 0 0 5px #00e5ff80;
}

/* Identified by the userscript from the visible sidebar label. */
[data-wargames-brand="true"] {
  color: var(--ansi-cyan) !important;
  font-family: var(--ansi-font) !important;
  font-weight: 500 !important;
  text-shadow: 0 0 5px #00e5ff80;
}

aside a:is([href="/code"], [href="/code/"]):is([aria-current="page"], [data-selected="focused"]),
nav[aria-label="Sidebar"] a:is([href="/code"], [href="/code/"]):is([aria-current="page"], [data-selected="focused"]) {
  color: var(--ansi-cyan) !important;
  background: var(--ansi-panel) !important;
  box-shadow: inset 2px 0 var(--ansi-cyan) !important;
  border-radius: 2px !important;
}

/* Text inside new sidebar controls; SVG icons still use their own styling. */
aside :is(a, button),
nav[aria-label="Sidebar"] :is(a, button) {
  font-family: var(--ansi-font) !important;
}

a[data-row-main-button][href^="/code/"] {
  color: var(--ansi-muted) !important;
  border-radius: 0 !important;
}

a[data-row-main-button][href^="/code/"]:hover {
  background: var(--ansi-panel) !important;
  color: var(--ansi-text) !important;
}

a[data-row-main-button][href^="/code/"]:is([data-selected="focused"], [aria-current="page"]) {
  background: var(--ansi-panel) !important;
  color: var(--ansi-cyan) !important;
  box-shadow: inset 3px 0 var(--ansi-cyan) !important;
}

a[aria-label="Home"] > svg[data-cds="ClaudeLogo"] {
  color: var(--ansi-cyan) !important;
  filter: drop-shadow(0 0 3px #00e5ff40);
}

/* Portaled chat-action menu and tooltips. */
#portal-root [data-cds-sheet-scroll]:has(> [role="menuitem"][aria-keyshortcuts="r"]) {
  background: var(--ansi-panel) !important;
  border: 1px solid var(--ansi-border) !important;
  border-radius: 0 !important;
}

#portal-root [data-cds-sheet-scroll]:has(> [role="menuitem"][aria-keyshortcuts="r"])
  > [role="menuitem"] {
  border-radius: 0 !important;
}

#portal-root [data-cds-sheet-scroll]:has(> [role="menuitem"][aria-keyshortcuts="r"])
  > [role="menuitem"]:is(:hover, [data-highlighted]):not([aria-disabled="true"]):not([data-disabled]) {
  background: #103a26 !important;
}

#portal-root [role="tooltip"] {
  background: var(--ansi-panel) !important;
  color: var(--ansi-text) !important;
  border: 1px solid var(--ansi-border) !important;
  border-radius: 0 !important;
  font-family: var(--ansi-font) !important;
}

/* 1. Phosphor glow is applied narrowly to conversation and user text above. */

/* 2. CRT edge vignette. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483645;
  pointer-events: none;
  box-shadow:
    inset 0 0 120px rgb(0 0 0 / var(--wargames-vignette)),
    inset 0 0 32px rgb(0 255 140 / .035);
}

/* 3. WOPR terminal status. */
main::before {
  content: "WOPR TERMINAL // LINK ACTIVE";
  position: fixed;
  top: 14px;
  right: 220px;
  z-index: 40;
  color: var(--ansi-cyan);
  font-family: var(--ansi-font);
  font-size: 11px;
  line-height: 1;
  letter-spacing: .09em;
  text-shadow: 0 0 5px #00e5ff80;
  pointer-events: none;
  user-select: none;
}

/* 4. Square terminal geometry is applied to messages, code and composer above. */

/* 5. Apple II-style cyan prompt with localized glow. */
[data-cds="ChatComposerEditor"] {
  position: relative !important;
  padding-left: 1.25em !important;
}

[data-cds="ChatComposerEditor"]::before {
  content: none !important;
}

[data-wargames-prompt-chevron="true"] {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  padding-top: 1px;
  color: var(--ansi-cyan);
  font-family: var(--ansi-font, monospace);
  font-size: inherit;
  line-height: inherit;
  text-shadow:
    0 0 4px #00e5ffcc,
    0 0 9px #00e5ff66;
  pointer-events: none;
  user-select: none;
}

[data-composer-placeholder] {
  padding-left: 1.25em !important;
  box-sizing: border-box !important;
}

[data-cds="ChatComposerEditor"]
  [contenteditable="true"][data-testid="code-prompt-input"] {
  caret-color: #fff !important;
  outline: none !important;
}

/* Static scanlines and aperture grille. */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg, #0000 0 2px, #0000001a 2px 3px),
    repeating-linear-gradient(90deg, #00ff6605 0 1px, #0000 1px 3px);
  opacity: var(--ansi-scan-opacity);
}

* {
  scrollbar-width: none !important;
}

*::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

::selection {
  background: #154737 !important;
  color: #d6ffeb !important;
}

:focus-visible {
  outline: 2px solid var(--ansi-cyan) !important;
  outline-offset: 2px;
}

@media (max-width: 900px) {
  main::before {
    content: "WOPR // ONLINE";
    top: 10px;
    right: auto;
    left: 14px;
    font-size: 9px;
  }
}

@media print, (forced-colors: active) {
  body::before,
  body::after,
  main::before {
    content: none;
  }
}

`;
  themeStyle.disabled = !/^\/code(?:\/|$)/.test(location.pathname);
  document.documentElement.append(themeStyle);

  // Fetch selected images from 16colo.rs through Violentmonkey; do not alter Claude's layout.
  const SPEED = 10; // pixels per second
  const WIDTH = 160;
  const MARGIN = 16;
  // Start directly beneath the telemetry header on Claude's refreshed UI.
  const TOP = 44;
  const BOTTOM = 24;
  const ARTWORKS = [
    { title: "Darkness / Ungenannt", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ungenannt-darkness.ans.png" },
    { title: "axelgear__BLADE-2.ANS.png", src: "https://16colo.rs/pack/axelgear/x1/BLADE-2.ANS.png" },
    { title: "acid-50a__ACID-50.XB.png", src: "https://16colo.rs/pack/acid-50a/x1/ACID-50.XB.png" },
    { title: "AS-UNEAR.TPB.png", src: "https://16colo.rs/pack/tpb1094/x1/AS-UNEAR.TPB.png" },
    { title: "ath-9406__RT-TSA.ANS.png", src: "https://16colo.rs/pack/ath-9406/x1/RT-TSA.ANS.png" },
    { title: "avg-bladerunner.ans.png", src: "https://16colo.rs/pack/blocktronics_darker_image_2/x1/avg-bladerunner.ans.png" },
    { title: "blde9603__BLDE9603.MEM.png", src: "https://16colo.rs/pack/blde9603/x1/BLDE9603.MEM.png" },
    { title: "cia40oz1__1296MEMB.CIA.png", src: "https://16colo.rs/pack/cia40oz1/x1/1296MEMB.CIA.png" },
    { title: "cia58-a__1198MEMB.CIA.png", src: "https://16colo.rs/pack/cia58-a/x1/1198MEMB.CIA.png" },
    { title: "ciapak05__MEMLIST.CIA.png", src: "https://16colo.rs/pack/ciapak05/x1/MEMLIST.CIA.png" },
    { title: "ciapak05__TR-UFP.CIA.png", src: "https://16colo.rs/pack/ciapak05/x1/TR-UFP.CIA.png" },
    { title: "ciapak06__CIAPAK6.NFO.png", src: "https://16colo.rs/pack/ciapak06/x1/CIAPAK6.NFO.png" },
    { title: "ciapak11__TR-EVIL.CIA.png", src: "https://16colo.rs/pack/ciapak11/x1/TR-EVIL.CIA.png" },
    { title: "ciapak14__TR-ARC.CIA.png", src: "https://16colo.rs/pack/ciapak14/x1/TR-ARC.CIA.png" },
    { title: "ciapak35__0696MEMB.CIA.png", src: "https://16colo.rs/pack/ciapak35/x1/0696MEMB.CIA.png" },
    { title: "ciapak43__0397MEMB.ADF.png", src: "https://16colo.rs/pack/ciapak43/x1/0397MEMB.ADF.png" },
    { title: "dls0296__AM-SKULL.ANS.png", src: "https://16colo.rs/pack/dls0296/x1/AM-SKULL.ANS.png" },
    { title: "ecl-03__US-PHEAR.ANS.png", src: "https://16colo.rs/pack/ecl-03/x1/US-PHEAR.ANS.png" },
    { title: "eglo01__US-LIT.ANS.png", src: "https://16colo.rs/pack/eglo01/x1/US-LIT.ANS.png" },
    { title: "fuel27__pg-robocat.ans.png", src: "https://16colo.rs/pack/fuel27/x1/pg-robocat.ans.png" },
    { title: "fuel27__tk-hackers.ans.png", src: "https://16colo.rs/pack/fuel27/x1/tk-hackers.ans.png" },
    { title: "grk-#cyb.ans.png", src: "https://16colo.rs/pack/impure70/x1/grk-%23cyb.ans.png" },
    { title: "mdn-9611__NEWS9611.NFO.png", src: "https://16colo.rs/pack/mdn-9611/x1/NEWS9611.NFO.png" },
    { title: "MIST1017.NFO.ANS.png", src: "https://16colo.rs/pack/mist1017/x1/MIST1017.NFO.ANS.png" },
    { title: "rave-02__RV-THEAD.ANS.png", src: "https://16colo.rs/pack/rave-02/x1/RV-THEAD.ANS.png" },
    { title: "rem-0894__IC-COI.ANS.png", src: "https://16colo.rs/pack/rem-0894/x1/IC-COI.ANS.png" },
    { title: "TH-HIGH.ANS.png", src: "https://16colo.rs/pack/fl-pack7/x1/TH-HIGH.ANS.png" },
    { title: "us-Neuromancer.ans.png", src: "https://16colo.rs/pack/laz14/x1/us-Neuromancer.ans.png" },
    { title: "vor-0394__MEMBERS.NFO.png", src: "https://16colo.rs/pack/vor-0394/x1/MEMBERS.NFO.png" },

    // Temporary uncurated Max Headroom portrait collection.
    { title: "dem-0797__DEM0797.MEM.png", src: "https://16colo.rs/pack/dem-0797/x1/DEM0797.MEM.png" },
    { title: "dem-0797__DEM0797.NFO.png", src: "https://16colo.rs/pack/dem-0797/x1/DEM0797.NFO.png" },
    { title: "dark0597__DARK0597.NFO.png", src: "https://16colo.rs/pack/dark0597/x1/DARK0597.NFO.png" },
    { title: "wsp-3__CB-WOS.ANS.png", src: "https://16colo.rs/pack/wsp-3/x1/CB-WOS.ANS.png" },

    // Temporary uncurated Snow Crash portrait collection.
    { title: "rmrs-09__R-TSM.TXT.png", src: "https://16colo.rs/pack/rmrs-09/x1/R-TSM.TXT.png" },
    { title: "quad0297__QUAD0297.LST.png", src: "https://16colo.rs/pack/quad0297/x1/QUAD0297.LST.png" },
    { title: "fld9703__0397-FLD.ANS.png", src: "https://16colo.rs/pack/fld9703/x1/0397-FLD.ANS.png" },
    { title: "mist0796__ANSI!.___.png", src: "https://16colo.rs/pack/mist0796/x1/ANSI%21.%C2%B7%C2%B7%C2%B7.png" },
    { title: "rel-1294__US-RFC1.REL.png", src: "https://16colo.rs/pack/rel-1294/x1/US-RFC1.REL.png" },
    { title: "mist1194__EO-ICE.LIT.png", src: "https://16colo.rs/pack/mist1194/x1/EO-ICE.LIT.png" },

    // Temporary uncurated Blocktronics DSOTB portrait collection.
    { title: "blocktronics-dsotb__1NVITATION.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/1NVITATION.ans.png" },
    { title: "blocktronics-dsotb__ak67-vucub-came.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ak67-vucub-came.ans.png" },
    { title: "blocktronics-dsotb__AKFiL-airavata.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/AKFiL-airavata.ans.png" },
    { title: "blocktronics-dsotb__avg-fadingblack.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/avg-fadingblack.ans.png" },
    { title: "blocktronics-dsotb__cx-drogo.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/cx-drogo.ans.png" },
    { title: "blocktronics-dsotb__misfit-bourdain.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/misfit-bourdain.ans.png" },
    { title: "blocktronics-dsotb__moebius.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/moebius.ans.png" },
    { title: "blocktronics-dsotb__mx-mess.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/mx-mess.ans.png" },
    { title: "blocktronics-dsotb__ndh-johnny.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ndh-johnny.ans.png" },
    { title: "blocktronics-dsotb__nf-EvilDead.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/nf-EvilDead.ans.png" },
    { title: "blocktronics-dsotb__om-x-2m-feminism.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/om-x-2m-feminism.ans.png" },
    { title: "blocktronics-dsotb__tg-bunny.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/tg-bunny.ans.png" },
    { title: "blocktronics-dsotb__ungenannt-darkness-headers.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ungenannt-darkness-headers.ans.png" },
    { title: "blocktronics-dsotb__ungenannt-zhentilkeep-menus.png.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ungenannt-zhentilkeep-menus.png" },
    { title: "blocktronics-dsotb__ungenannt-zhentilkeep.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/ungenannt-zhentilkeep.ans.png" },
    { title: "blocktronics-dsotb__us-birth-of-mawu-liza.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/us-birth-of-mawu-liza.ans.png" },
    { title: "blocktronics-dsotb__us-fueltronics.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/us-fueltronics.ans.png" },
    { title: "blocktronics-dsotb__v-shelton.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/v-shelton.ans.png" },
    { title: "blocktronics-dsotb__v-tdc16.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/v-tdc16.ans.png" },
    { title: "blocktronics-dsotb__we-ascend.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/we-ascend.ans.png" },
    { title: "blocktronics-dsotb__wz-sitter-of-dragons.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/wz-sitter-of-dragons.ans.png" },
    { title: "blocktronics-dsotb__wz-smallscale-9px.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/wz-smallscale-9px.ans.png" },
    { title: "blocktronics-dsotb__zii-chqm.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/zii-chqm.ans.png" },
    { title: "blocktronics-dsotb___b7_dsotb_members.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/_b7_dsotb_members.ans.png" },
    { title: "blocktronics-dsotb___b7_dsotb_nfo.ans.png", src: "https://16colo.rs/pack/blocktronics-dsotb/x1/_b7_dsotb_nfo.ans.png" },

    // Temporary uncurated Aliens portrait collection.
    { title: "break_12__h7-trsi-exodus-infofile.asc.png", src: "https://16colo.rs/pack/break_12/x1/h7-trsi-exodus-infofile.asc.png" },
    { title: "impure71__arl-nonbinary-gender.ans.png", src: "https://16colo.rs/pack/impure71/x1/arl-nonbinary-gender.ans.png" },
    { title: "titan-artpack3__iks-dv.asc.png", src: "https://16colo.rs/pack/titan-artpack3/x1/iks-dv.asc.png" },
    { title: "fuel23__bs-spknt.ans.png", src: "https://16colo.rs/pack/fuel23/x1/bs-spknt.ans.png" },
    { title: "crime__biggie_tupac_live_freestyle.ans.png", src: "https://16colo.rs/pack/crime/x1/biggie%20tupac%20live%20freestyle.ans.png" },
    { title: "blndr048-060__BLENDER.060.ANS.png", src: "https://16colo.rs/pack/blndr048-060/x1/BLENDER.060.ANS.png" },
    { title: "mist1014__li-babble.lit.png", src: "https://16colo.rs/pack/mist1014/x1/li-babble.lit.png" },
    { title: "mist1014__me-peacefullyintothenight.lit.png", src: "https://16colo.rs/pack/mist1014/x1/me-peacefullyintothenight.lit.png" },
    { title: "sac-33__dip-jfk.nfo.png", src: "https://16colo.rs/pack/sac-33/x1/dip-jfk.nfo.png" },
    { title: "sac-29__dip-rs.nfo.png", src: "https://16colo.rs/pack/sac-29/x1/dip-rs.nfo.png" },
    { title: "hoa-pack01__high-aliens.nfo.png", src: "https://16colo.rs/pack/hoa-pack01/x1/high-aliens.nfo.png" },
    { title: "bafh-pack6__Mrg-lotm.nfo.png", src: "https://16colo.rs/pack/bafh-pack6/x1/Mrg-lotm.nfo.png" },
    { title: "impure21__PO-APLAN.TXT.png", src: "https://16colo.rs/pack/impure21/x1/PO-APLAN.TXT.png" },
    { title: "ceg-013a__013-PACK.NFO.png", src: "https://16colo.rs/pack/ceg-013a/x1/013-PACK.NFO.png" },
    { title: "bmbook22__DIP-BNFO.ASC.png", src: "https://16colo.rs/pack/bmbook22/x1/DIP-BNFO.ASC.png" },
    { title: "purg-29a__TR-GC01.ANS.png", src: "https://16colo.rs/pack/purg-29a/x1/TR-GC01.ANS.png" },
    { title: "purg-29a__TR-RPR01.ANS.png", src: "https://16colo.rs/pack/purg-29a/x1/TR-RPR01.ANS.png" },
    { title: "jtx-crs__JUST-X.NFO.png", src: "https://16colo.rs/pack/jtx-crs/x1/JUST-X.NFO.png" },
    { title: "avenge13__NEWS0299.ANS.png", src: "https://16colo.rs/pack/avenge13/x1/NEWS0299.ANS.png" },
    { title: "rmrs-28__REMORSE.NFO.png", src: "https://16colo.rs/pack/rmrs-28/x1/REMORSE.NFO.png" },
    { title: "mimic06__m-suck.txt.png", src: "https://16colo.rs/pack/mimic06/x1/m-suck.txt.png" },
    { title: "ice9806a__US-BLEND.ICE.png", src: "https://16colo.rs/pack/ice9806a/x1/US-BLEND.ICE.png" },
    { title: "ice9805__IN-DRONE.ICE.png", src: "https://16colo.rs/pack/ice9805/x1/IN-DRONE.ICE.png" },
    { title: "glue-07__GLUE-07.NFO.png", src: "https://16colo.rs/pack/glue-07/x1/GLUE-07.NFO.png" },
    { title: "flange05__MRD-MENU.ANS.png", src: "https://16colo.rs/pack/flange05/x1/MRD-MENU.ANS.png" },
    { title: "dom003__ANM-AH6.ANS.png", src: "https://16colo.rs/pack/dom003/x1/ANM-AH6.ANS.png" },
    { title: "blomann__BL!-6NWS.ANS.png", src: "https://16colo.rs/pack/blomann/x1/BL%21-6NWS.ANS.png" },
    { title: "bl_omann__BL!-6NWS.ANS.png", src: "https://16colo.rs/pack/bl_omann/x1/BL%21-6NWS.ANS.png" },
    { title: "arc-art4__XP-FARM.ANS.png", src: "https://16colo.rs/pack/arc-art4/x1/XP-FARM.ANS.png" },
    { title: "arc-4__XP-FARM.ANS.png", src: "https://16colo.rs/pack/arc-4/x1/XP-FARM.ANS.png" },
    { title: "acid-65__news-65.asc.png", src: "https://16colo.rs/pack/acid-65/x1/news-65.asc.png" },
    { title: "twst-15__Twst-bln.ans.png", src: "https://16colo.rs/pack/twst-15/x1/Twst-bln.ans.png" },
    { title: "tly-0797__DROL#3.MAG.png", src: "https://16colo.rs/pack/tly-0797/x1/DROL%233.MAG.png" },
    { title: "tly-0597__DROL#2.MAG.png", src: "https://16colo.rs/pack/tly-0597/x1/DROL%232.MAG.png" },
    { title: "synth12a__ISO-ALIE.ANS.png", src: "https://16colo.rs/pack/synth12a/x1/ISO-ALIE.ANS.png" },
    { title: "rmrs-11__REMORSE.NFO.png", src: "https://16colo.rs/pack/rmrs-11/x1/REMORSE.NFO.png" },
    { title: "mist3yra__GTBM-BL1.LIT.png", src: "https://16colo.rs/pack/mist3yra/x1/GTBM-BL1.LIT.png" },
    { title: "laz10sep__LAZ10PRT.ANS.png", src: "https://16colo.rs/pack/laz10sep/x1/LAZ10PRT.ANS.png" },
    { title: "laz09aug__LAZ09PRT.ANS.png", src: "https://16colo.rs/pack/laz09aug/x1/LAZ09PRT.ANS.png" },
    { title: "impact07__IMPACT.BND.png", src: "https://16colo.rs/pack/impact07/x1/IMPACT.BND.png" },
    { title: "fuqu-01__FUCKYOU.NFO.png", src: "https://16colo.rs/pack/fuqu-01/x1/FUCKYOU.NFO.png" },
    { title: "fos-0197__END._.png", src: "https://16colo.rs/pack/fos-0197/x1/END.%C2%B7.png" },
    { title: "fire0497___VGA____.___.png", src: "https://16colo.rs/pack/fire0497/x1/%E2%94%80VGA%E2%94%80%E2%94%80%E2%94%80%E2%94%80.%E2%94%80%E2%94%80%E2%94%80.png" },
    { title: "ecl-12__12-PHOTO.NFO.png", src: "https://16colo.rs/pack/ecl-12/x1/12-PHOTO.NFO.png" },
    { title: "dna0397__DI-COLL.ASC.png", src: "https://16colo.rs/pack/dna0397/x1/DI-COLL.ASC.png" },
    { title: "blndr041__US-MARS.ANS.png", src: "https://16colo.rs/pack/blndr041/x1/US-MARS.ANS.png" },
    { title: "blndr038__B38-SDY.TXT.png", src: "https://16colo.rs/pack/blndr038/x1/B38-SDY.TXT.png" },
    { title: "blndr032__TWISTED.ANS.png", src: "https://16colo.rs/pack/blndr032/x1/TWISTED.ANS.png" },
    { title: "blndr020__IMPACT.ANS.png", src: "https://16colo.rs/pack/blndr020/x1/IMPACT.ANS.png" },
    { title: "blndr018__XM-BLN18.ANS.png", src: "https://16colo.rs/pack/blndr018/x1/XM-BLN18.ANS.png" },
    { title: "blde9701__BLDE9701.ANS.png", src: "https://16colo.rs/pack/blde9701/x1/BLDE9701.ANS.png" },
    { title: "bl-gong__JR_GRIN!.ANS.png", src: "https://16colo.rs/pack/bl-gong/x1/JR_GRIN%21.ANS.png" },
    { title: "bl-brtsh__BOILCRIT.ICS.png", src: "https://16colo.rs/pack/bl-brtsh/x1/BOILCRIT.ICS.png" },
    { title: "bl-brtsh__TUTOR2.ANS.png", src: "https://16colo.rs/pack/bl-brtsh/x1/TUTOR2.ANS.png" },
    { title: "plain06__COLI01.CZ.png", src: "https://16colo.rs/pack/plain06/x1/COLI01.CZ.png" },
    { title: "nh-0596__CY-WHA2.ANS.png", src: "https://16colo.rs/pack/nh-0596/x1/CY-WHA2.ANS.png" },
    { title: "icon1296__1296NEWS.ANS.png", src: "https://16colo.rs/pack/icon1296/x1/1296NEWS.ANS.png" },
    { title: "ice9611a__ICE-9611.NFO.png", src: "https://16colo.rs/pack/ice9611a/x1/ICE-9611.NFO.png" },
    { title: "ice9608a__ICE-9608.NFO.png", src: "https://16colo.rs/pack/ice9608a/x1/ICE-9608.NFO.png" },
    { title: "hn-0396__HN!0396.NFO.png", src: "https://16colo.rs/pack/hn-0396/x1/HN%210396.NFO.png" },
    { title: "ecl-03__M7-IRCEX.ANS.png", src: "https://16colo.rs/pack/ecl-03/x1/M7-IRCEX.ANS.png" },
    { title: "ecl-02__02-MEM.NFO.png", src: "https://16colo.rs/pack/ecl-02/x1/02-MEM.NFO.png" },
    { title: "blde9612__OX-1296.ASC.png", src: "https://16colo.rs/pack/blde9612/x1/OX-1296.ASC.png" },
    { title: "blde9609__BLDE9609.NFO.png", src: "https://16colo.rs/pack/blde9609/x1/BLDE9609.NFO.png" },
    { title: "apathy05__NT-INFZ.ANS.png", src: "https://16colo.rs/pack/apathy05/x1/NT-INFZ.ANS.png" },
    { title: "saz-0195__--DEATH-.TXT.png", src: "https://16colo.rs/pack/saz-0195/x1/--DEATH-.TXT.png" },
    { title: "mtn-0695__D0-PARAD.ANS.png", src: "https://16colo.rs/pack/mtn-0695/x1/D0-PARAD.ANS.png" },
    { title: "mad0595__MADNEWS.TXT.png", src: "https://16colo.rs/pack/mad0595/x1/MADNEWS.TXT.png" },
    { title: "ice-9501__SC-GRZ1.ICE.png", src: "https://16colo.rs/pack/ice-9501/x1/SC-GRZ1.ICE.png" },
    { title: "dark0495__DARK0495.NFO.png", src: "https://16colo.rs/pack/dark0495/x1/DARK0495.NFO.png" },
    { title: "apathy03__1195-NFO.ANS.png", src: "https://16colo.rs/pack/apathy03/x1/1195-NFO.ANS.png" },
    { title: "acdu0895__ACDU0895.NFO.png", src: "https://16colo.rs/pack/acdu0895/x1/ACDU0895.NFO.png" },
    { title: "titan-04__KX-THC.TIT.png", src: "https://16colo.rs/pack/titan-04/x1/KX-THC.TIT.png" },
    { title: "raid1294__PROPHET.INT.png", src: "https://16colo.rs/pack/raid1294/x1/PROPHET.INT.png" },
    { title: "mist1194__-MUSIC-.___.png", src: "https://16colo.rs/pack/mist1194/x1/-MUSIC-.%C2%B7%E2%88%99%C2%B7.png" },
    { title: "mist1194__-OTHERS-.___.png", src: "https://16colo.rs/pack/mist1194/x1/-OTHERS-.%C2%B7%E2%88%99%C2%B7.png" },
    { title: "mist1194__B_STUFF.LIT.png", src: "https://16colo.rs/pack/mist1194/x1/B_STUFF.LIT.png" },
    { title: "mist1194__EO-STUPI.LIT.png", src: "https://16colo.rs/pack/mist1194/x1/EO-STUPI.LIT.png" },
    { title: "mist1094__EO-ALIEN.LIT.png", src: "https://16colo.rs/pack/mist1094/x1/EO-ALIEN.LIT.png" },
    { title: "mist1094__EO-CONQU.LIT.png", src: "https://16colo.rs/pack/mist1094/x1/EO-CONQU.LIT.png" },
    { title: "mist1094__EO-PERFE.LIT.png", src: "https://16colo.rs/pack/mist1094/x1/EO-PERFE.LIT.png" },
    { title: "blde9409__FLX-BALT.LIT.png", src: "https://16colo.rs/pack/blde9409/x1/FLX-BALT.LIT.png" },
    { title: "mpir1193__MPIR1193.NFO.png", src: "https://16colo.rs/pack/mpir1193/x1/MPIR1193.NFO.png" },
    { title: "grip0993__GRIP0993.NFO.png", src: "https://16colo.rs/pack/grip0993/x1/GRIP0993.NFO.png" },
  ];

  if (document.getElementById('wargames-ansi-stream')) return;
  const host = document.createElement('div');
  host.id = 'wargames-ansi-stream';
  // Shadow DOM keeps the theme's global rules away from the artwork controls.
  host.style.cssText = 'all:initial!important;position:fixed!important;display:none!important;z-index:30!important;';
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    :host { color-scheme: dark; }
    * { box-sizing: border-box; }
    .panel { height:100%; display:flex; flex-direction:column;
      background:#000; border:1px solid #145938;
      color:#50e7ff; font:10px/1.5 "Departure Mono",Consolas,monospace; }
    button { flex:none; width:100%; background:#020805; color:#50e7ff;
      font:inherit; text-align:left; padding:7px 6px; border:0;
      border-bottom:1px solid #145938; cursor:pointer; }
    button:focus-visible { outline:1px solid #50e7ff; outline-offset:-2px; }
    .viewport { position:relative; flex:1; min-height:0; overflow:hidden; padding:0 3px; }
    .loading { position:absolute; inset:12px 6px auto; color:#50e7ff;
      font:10px/1.5 "Departure Mono",Consolas,monospace;
      letter-spacing:.08em; text-shadow:0 0 5px #00e5ff80; }
    .loading[hidden] { display:none; }
    .track { will-change:transform; transform:translate3d(0,0,0); contain:paint; }
    figure { margin:0; padding:0 0 12px; }
    img { display:block; width:100%; height:auto; image-rendering:pixelated; opacity:1; }
    figcaption { padding:6px 2px; color:#80b59a; font-size:8px; overflow-wrap:anywhere; }
    @media print, (forced-colors:active) { .panel { display:none; } }
  `;
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.setAttribute('aria-label', 'ANSI artwork stream');
  const button = document.createElement('button');
  button.type = 'button';
  button.title = 'Click to pause or resume. Hover over the artwork to pause temporarily.';
  const viewport = document.createElement('div');
  viewport.className = 'viewport';
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'loading';
  loadingMessage.textContent = '/// LOADING...';
  const track = document.createElement('div');
  track.className = 'track';
  const group = document.createElement('div');
  track.append(group);
  viewport.append(loadingMessage, track);
  panel.append(button, viewport);
  shadow.append(style, panel);
  document.documentElement.append(host);

  // Phase 2: replace only Claude's small orange composer mascot with a
  // Bit-inspired faceted indicator. The native element keeps its layout box;
  // our overlay follows that box without touching the composer itself.
  const bitHost = document.createElement('div');
  bitHost.id = 'wargames-bit-mascot';
  bitHost.setAttribute('aria-hidden', 'true');
  bitHost.style.cssText =
    'all:initial!important;position:fixed!important;display:none!important;' +
    'width:44px!important;height:44px!important;pointer-events:none!important;' +
    'z-index:32!important;';
  const bitShadow = bitHost.attachShadow({ mode: 'closed' });
  bitShadow.innerHTML = `
    <style>
      :host { color-scheme:dark; }
      svg { display:block; width:100%; height:100%; overflow:visible;
        filter:drop-shadow(0 0 3px #ffe66d99) drop-shadow(0 0 7px #00e5ff55); }
      .edge { fill:none; stroke:#fff6a8; stroke-width:1; vector-effect:non-scaling-stroke; }
      .state { transform-box:fill-box; transform-origin:center; animation:bit-tumble 5.5s linear infinite; }
      :host([data-bit-state="yes"]) .no { display:none; }
      :host([data-bit-state="no"]) .yes { display:none; }
      :host([data-bit-state="no"]) svg {
        filter:drop-shadow(0 0 3px #ff3344bb) drop-shadow(0 0 8px #cc00ff66);
      }
      :host([data-bit-state="no"]) .state { animation-direction:reverse; animation-duration:4.2s; }
      @keyframes bit-tumble {
        0%   { transform:rotate(0deg) scaleY(1); }
        25%  { transform:rotate(90deg) scaleY(.82); }
        50%  { transform:rotate(180deg) scaleY(1); }
        75%  { transform:rotate(270deg) scaleY(.82); }
        100% { transform:rotate(360deg) scaleY(1); }
      }
      @media (prefers-reduced-motion:reduce) { .state { animation:none; } }
    </style>
    <svg viewBox="0 0 44 44" role="presentation">
      <g class="state yes">
      <polygon points="22,2 39,11 42,29 31,41 13,41 2,29 5,11" fill="#ffd23f"/>
      <polygon points="22,2 22,22 5,11" fill="#fff3a1"/>
      <polygon points="22,2 39,11 22,22" fill="#ffe066"/>
      <polygon points="39,11 42,29 22,22" fill="#e7a900"/>
      <polygon points="42,29 31,41 22,22" fill="#ffbf00"/>
      <polygon points="31,41 13,41 22,22" fill="#00cfe8"/>
      <polygon points="13,41 2,29 22,22" fill="#009db8"/>
      <polygon points="2,29 5,11 22,22" fill="#39e7ff"/>
      <polygon class="edge" points="22,2 39,11 42,29 31,41 13,41 2,29 5,11"/>
      <path class="edge" d="M22 2V22M39 11 22 22M42 29 22 22M31 41 22 22M13 41 22 22M2 29 22 22M5 11 22 22" opacity=".72"/>
      </g>
      <g class="state no">
        <polygon points="22,1 27,10 36,4 34,14 43,12 37,21 44,26 34,29 38,40 28,35 22,44 17,35 6,40 10,29 0,26 8,21 1,13 11,14 10,4 18,10" fill="#c7002f"/>
        <polygon points="22,1 27,10 22,22 18,10" fill="#ff5a5f"/>
        <polygon points="36,4 34,14 22,22 27,10" fill="#d91445"/>
        <polygon points="43,12 37,21 22,22 34,14" fill="#ff304f"/>
        <polygon points="44,26 34,29 22,22 37,21" fill="#8e0038"/>
        <polygon points="38,40 28,35 22,22 34,29" fill="#c00066"/>
        <polygon points="22,44 17,35 22,22 28,35" fill="#ff1744"/>
        <polygon points="6,40 10,29 22,22 17,35" fill="#85002e"/>
        <polygon points="0,26 8,21 22,22 10,29" fill="#d1003f"/>
        <polygon points="1,13 11,14 22,22 8,21" fill="#ff4055"/>
        <polygon points="10,4 18,10 22,22 11,14" fill="#a60048"/>
        <circle cx="22" cy="22" r="3.2" fill="#ffdfef"/>
        <polygon class="edge" points="22,1 27,10 36,4 34,14 43,12 37,21 44,26 34,29 38,40 28,35 22,44 17,35 6,40 10,29 0,26 8,21 1,13 11,14 10,4 18,10" style="stroke:#ff8aa0"/>
      </g>
    </svg>`;
  bitHost.setAttribute('data-bit-state', 'yes');
  document.body.append(bitHost);

  let nativeMascot = null;
  let nativeMascotVisibility = '';
  let nativeMascotPriority = '';
  let lastMascotRect = null;
  let bitNoUntil = 0;

  function orangeChannel(value) {
    const numbers = String(value).match(/[\d.]+/g);
    if (!numbers || numbers.length < 3) return false;
    const [red, green, blue] = numbers.map(Number);
    return red >= 165 && green >= 55 && green <= 175 &&
      blue <= 135 && red >= green + 35;
  }

  function hasOrangeInk(element) {
    const nodes = [element, ...element.querySelectorAll('*')].slice(0, 48);
    return nodes.some(node => {
      const css = getComputedStyle(node);
      return orangeChannel(css.color) || orangeChannel(css.fill) ||
        orangeChannel(css.stroke) || orangeChannel(css.backgroundColor);
    });
  }

  function redChannel(value) {
    const numbers = String(value).match(/[\d.]+/g);
    if (!numbers || numbers.length < 3) return false;
    const [red, green, blue] = numbers.map(Number);
    return red >= 145 && red >= green * 1.35 && red >= blue * 1.2;
  }

  function hasRedInk(element) {
    const nodes = [element, ...element.querySelectorAll('*')].slice(0, 48);
    return nodes.some(node => {
      const css = getComputedStyle(node);
      return redChannel(css.color) || redChannel(css.fill) ||
        redChannel(css.stroke) || redChannel(css.backgroundColor) ||
        redChannel(css.borderColor);
    });
  }

  function visibleFailureSignal() {
    const candidates = document.querySelectorAll(
      '[role="alert"], [aria-live="assertive"], [data-type="error"], ' +
      '[data-state="error"], [class*="error" i], [class*="destructive" i]'
    );
    return [...candidates].some(element => {
      if (element.closest('#wargames-ansi-stream, #wargames-bit-mascot')) return false;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) return false;
      const css = getComputedStyle(element);
      if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) return false;
      const signature = [
        element.getAttribute('aria-label'), element.getAttribute('data-type'),
        element.getAttribute('data-state'), element.className
      ].join(' ');
      return /error|failed|failure|danger|destructive/i.test(signature) || hasRedInk(element);
    });
  }

  function updateBitState() {
    if (visibleFailureSignal()) bitNoUntil = Date.now() + 5000;
    const noState = Date.now() < bitNoUntil;
    bitHost.setAttribute('data-bit-state', noState ? 'no' : 'yes');
    return noState;
  }

  function restoreNativeMascot() {
    if (!nativeMascot?.isConnected) {
      nativeMascot = null;
      return;
    }
    nativeMascot.style.setProperty(
      'visibility', nativeMascotVisibility, nativeMascotPriority
    );
    nativeMascot.removeAttribute('data-wargames-native-mascot');
    nativeMascot = null;
  }

  function hideBitMascot() {
    bitHost.style.setProperty('display', 'none', 'important');
  }

  function placeBitMascot(rect) {
    const size = Math.max(30, Math.min(44, Math.round(Math.max(rect.width, rect.height) * 1.35)));
    bitHost.style.setProperty('width', `${size}px`, 'important');
    bitHost.style.setProperty('height', `${size}px`, 'important');
    bitHost.style.setProperty('left', `${Math.round(rect.left + rect.width / 2 - size / 2)}px`, 'important');
    bitHost.style.setProperty('top', `${Math.round(rect.top + rect.height / 2 - size / 2)}px`, 'important');
    bitHost.style.setProperty('display', 'block', 'important');
    lastMascotRect = {
      left: rect.left, top: rect.top, width: rect.width, height: rect.height
    };
  }

  function syncBitMascot(editor, codeRoute) {
    if (!codeRoute || !editor) {
      restoreNativeMascot();
      hideBitMascot();
      lastMascotRect = null;
      bitNoUntil = 0;
      return;
    }

    const noState = updateBitState();

    const editorRect = editor.getBoundingClientRect();
    const inMascotZone = rect => rect.width >= 14 && rect.width <= 100 &&
      rect.height >= 14 && rect.height <= 100 &&
      rect.left >= editorRect.left - 24 &&
      rect.right <= editorRect.right + 24 &&
      rect.top >= editorRect.top - 150 && rect.bottom <= editorRect.top + 14;

    if (nativeMascot?.isConnected) {
      const rect = nativeMascot.getBoundingClientRect();
      if (inMascotZone(rect)) {
        placeBitMascot(rect);
        return;
      }
      restoreNativeMascot();
    }

    const graphics = document.querySelectorAll(
      'main svg, main img, main canvas, main [role="img"], ' +
      'main [data-testid*="mascot" i], main [class*="mascot" i]'
    );
    const matches = [...graphics].filter(element => {
      if (editor.contains(element) || element.closest('#wargames-ansi-stream')) return false;
      const rect = element.getBoundingClientRect();
      return inMascotZone(rect) && hasOrangeInk(element);
    });
    if (!matches.length) {
      if (noState && lastMascotRect) placeBitMascot(lastMascotRect);
      else hideBitMascot();
      return;
    }

    // Claude uses more than one orange activity treatment. The live one is the
    // lowest matching glyph immediately above the composer.
    matches.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return Math.abs(editorRect.top - ar.bottom) - Math.abs(editorRect.top - br.bottom);
    });
    let target = matches[0];
    for (let parent = target.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      const rect = parent.getBoundingClientRect();
      if (!inMascotZone(rect)) break;
      target = parent;
    }

    nativeMascot = target;
    nativeMascotVisibility = target.style.getPropertyValue('visibility');
    nativeMascotPriority = target.style.getPropertyPriority('visibility');
    target.setAttribute('data-wargames-native-mascot', 'true');
    target.style.setProperty('visibility', 'hidden', 'important');
    placeBitMascot(target.getBoundingClientRect());
  }

  let animation = null;
  let cycleHeight = 0;
  let ready = false;
  let loading = true;
  let loadFailed = false;
  let shown = false;
  let hovering = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = reducedMotion.matches;

  function updatePlayback() {
    const paused = manuallyPaused || hovering || document.hidden || !shown;
    if (animation) paused ? animation.pause() : animation.play();
    if (loadFailed) button.textContent = 'ANSI // LINK FAILED';
    else if (loading) button.textContent = 'ANSI // LINKING';
    else button.textContent = paused ? 'ANSI // FEED PAUSED' : 'ANSI // VISUAL FEED';
    button.setAttribute('aria-pressed', String(manuallyPaused));
    button.setAttribute('aria-label', loading || loadFailed
      ? button.textContent
      : (manuallyPaused ? 'Resume ANSI stream' : 'Pause ANSI stream'));
  }

  function rebuild() {
    if (!ready || !shown) return;
    const height = group.getBoundingClientRect().height;
    if (!height) return;
    const progress = animation && cycleHeight
      ? ((Number(animation.currentTime) || 0) / (cycleHeight / SPEED * 1000)) % 1 : 0;
    if (animation) animation.cancel();
    while (track.children.length > 1) track.lastElementChild.remove();
    // Enough repeats to cover even an unusually tall viewport, with no blank seam.
    const copies = Math.ceil(viewport.clientHeight / height) + 1;
    for (let i = 0; i < copies; i++) {
      const copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
    }
    cycleHeight = height;
    // Keep the track continuously composited. The earlier stepped easing made
    // every pixel advance read as a brightness flash in high-contrast ANSI art.
    animation = track.animate([
      { transform: 'translate3d(0,0,0)' },
      { transform: `translate3d(0,-${height}px,0)` },
    ], {
      duration: height / SPEED * 1000,
      iterations: Infinity,
      easing: 'linear'
    });
    animation.currentTime = progress * height / SPEED * 1000;
    updatePlayback();
  }

  function markClaudeWordmark() {
    const sidebar = document.querySelector('aside, nav[aria-label="Sidebar"]');
    if (!sidebar || sidebar.querySelector('[data-wargames-brand="true"]')) return;
    const candidates = [...sidebar.querySelectorAll('a, button, span')];
    const wordmark = candidates.reverse().find(element => element.textContent.trim() === 'Claude');
    if (wordmark) wordmark.setAttribute('data-wargames-brand', 'true');
  }

  function widenConversation(editor, feedLeft) {
    const main = document.querySelector('main');
    if (!main || !editor || innerWidth < 1100) return;

    const sidebar = document.querySelector('aside, nav[aria-label="Sidebar"]');
    const mainRect = main.getBoundingClientRect();
    const sidebarRect = sidebar?.getBoundingClientRect();
    const sidebarRight = Math.max(mainRect.left, sidebarRect?.right || 0);
    const gutter = 32;
    const availableWidth = Math.floor(feedLeft - sidebarRight - gutter * 2);
    // Wider than Claude's native column, but capped so long responses remain
    // readable and the right-aligned user bubble never runs under the feed.
    const targetWidth = Math.min(1280, availableWidth);
    if (targetWidth < 720) return;
    const desiredLeft = Math.floor(
      sidebarRight + gutter + (availableWidth - targetWidth) / 2
    );

    document.documentElement.style.setProperty(
      '--wargames-content-width', `${targetWidth}px`
    );
    const assistantWidth = Math.min(1120, availableWidth);
    const assistantLeft = Math.floor(
      sidebarRight + gutter + (availableWidth - assistantWidth) / 2
    );
    document.documentElement.style.setProperty(
      '--wargames-assistant-width', `${assistantWidth}px`
    );

    // Replies no longer share the composer's wrapper. Select only the outermost
    // assistant prose block, then place it directly so both gutters match.
    const previouslyPositioned = [...main.querySelectorAll('[data-wargames-assistant-column="true"]')];
    for (const reply of previouslyPositioned) {
      reply.removeAttribute('data-wargames-assistant-column');
      reply.style.removeProperty('--wargames-assistant-shift');
    }
    const allReplies = [...main.querySelectorAll('.font-claude-message, .prose')]
      .filter(reply => !reply.closest('.cds-user-message-body'));
    const replies = allReplies.filter(reply =>
      !allReplies.some(other => other !== reply && other.contains(reply))
    );
    for (const reply of replies) {
      const rect = reply.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      reply.style.setProperty(
        '--wargames-assistant-shift', `${Math.round(assistantLeft - rect.left)}px`
      );
      reply.setAttribute('data-wargames-assistant-column', 'true');
    }

    // Keep an existing outer composer mark stable between geometry checks.
    const existingTargets = [...main.querySelectorAll('[data-wargames-wide-column="true"]')];
    if (existingTargets.length) return;

    const baseline = editor.getBoundingClientRect();
    if (!baseline.width) return;
    // Claude's refreshed interface no longer gives every response the older
    // message classes. Include geometry-matched containers so the conversation
    // body and composer receive the same measured width.
    const geometricSeeds = [...main.querySelectorAll('div, section, article')]
      .filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.height > 80 &&
          rect.width >= baseline.width - 64 &&
          rect.width <= baseline.width + 64 &&
          Math.abs(rect.left - baseline.left) <= 64;
      });
    const seeds = [
      editor,
      ...main.querySelectorAll('.font-claude-message, .prose, .cds-user-message-body'),
      ...geometricSeeds
    ];
    const targets = new Set();

    for (const seed of seeds) {
      let candidate = null;
      for (let node = seed; node && node !== main.parentElement; node = node.parentElement) {
        const rect = node.getBoundingClientRect();
        const matchesColumn = rect.width >= baseline.width - 48 &&
          rect.width <= baseline.width + 48 &&
          rect.left >= sidebarRight - 8 && rect.right <= feedLeft + 8;
        if (matchesColumn) candidate = node;
        if (node === main) break;
      }
      if (candidate && candidate !== main) targets.add(candidate);
    }

    // If both a wrapper and one of its descendants matched, widen only the
    // wrapper. This preserves message padding and Claude's internal layout.
    for (const outer of [...targets]) {
      for (const inner of [...targets]) {
        if (outer !== inner && outer.contains(inner)) targets.delete(inner);
      }
    }
    for (const target of targets) {
      const originalLeft = target.getBoundingClientRect().left;
      target.style.setProperty(
        '--wargames-content-shift', `${Math.round(desiredLeft - originalLeft)}px`
      );
      target.setAttribute('data-wargames-wide-column', 'true');
    }
  }

  let promptChevron = null;
  let promptChevronEditor = null;

  function syncPromptChevron(editor) {
    if (!editor) {
      promptChevron?.remove();
      promptChevron = null;
      promptChevronEditor = null;
      return;
    }
    const input = editor.querySelector(
      '[contenteditable="true"][data-testid="code-prompt-input"], [contenteditable="true"]'
    );
    if (!input) return;
    if (!promptChevron || promptChevronEditor !== editor) {
      promptChevron?.remove();
      promptChevron = document.createElement('span');
      promptChevron.setAttribute('data-wargames-prompt-chevron', 'true');
      promptChevron.setAttribute('aria-hidden', 'true');
      promptChevron.textContent = '>';
      editor.append(promptChevron);
      promptChevronEditor = editor;
    }
    const editorRect = editor.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const inputStyle = getComputedStyle(input);
    const fontSize = parseFloat(inputStyle.fontSize) || 16;
    const lineHeight = parseFloat(inputStyle.lineHeight) || fontSize * 1.2;
    // Anchor to row one only. Using inputRect.height centered the marker across
    // the entire multiline composer and caused it to overlap later text rows.
    promptChevron.style.top = `${Math.round(inputRect.top - editorRect.top)}px`;
    promptChevron.style.height = `${Math.round(lineHeight)}px`;
    promptChevron.style.fontFamily = inputStyle.fontFamily;
    promptChevron.style.fontSize = inputStyle.fontSize;
    promptChevron.style.lineHeight = inputStyle.lineHeight;
  }

  function checkSpace() {
    const codeRoute = /^\/code(?:\/|$)/.test(location.pathname);
    themeStyle.disabled = !codeRoute;
    if (codeRoute) markClaudeWordmark();
    const left = innerWidth - WIDTH - MARGIN;
    const lower = innerHeight - BOTTOM;
    const editor = document.querySelector('[data-cds="ChatComposerEditor"]');
    syncPromptChevron(editor);
    syncBitMascot(editor, codeRoute);
    if (codeRoute && editor) widenConversation(editor, left);
    // The feed owns its reserved gutter for the entire Code route. Do not tie
    // visibility to Claude's transient composer/message geometry: React can
    // briefly remove or resize those nodes while loading, which made the panel
    // arrive late and flash off during otherwise normal layout updates.
    const allowed = codeRoute && innerWidth >= 1100 && innerHeight >= 500;
    host.style.setProperty('width', `${WIDTH}px`, 'important');
    host.style.setProperty('right', `${MARGIN}px`, 'important');
    host.style.setProperty('top', `${TOP}px`, 'important');
    host.style.setProperty('height', `${Math.max(0, lower - TOP)}px`, 'important');
    host.style.setProperty('display', allowed ? 'block' : 'none', 'important');
    const wasShown = shown;
    shown = allowed;
    if (shown && !wasShown) rebuild();
    updatePlayback();
  }

  button.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updatePlayback(); });
  panel.addEventListener('mouseenter', () => { hovering = true; updatePlayback(); });
  panel.addEventListener('mouseleave', () => { hovering = false; updatePlayback(); });
  document.addEventListener('visibilitychange', () => { checkSpace(); updatePlayback(); });
  reducedMotion.addEventListener('change', event => { manuallyPaused = event.matches; updatePlayback(); });
  window.addEventListener('resize', () => { checkSpace(); rebuild(); });
  // Low-frequency geometry check also handles Claude's navigation without reloads.
  setInterval(() => { if (!document.hidden) checkSpace(); }, 750);

  // Claude may restrict third-party image URLs. Violentmonkey fetches each source;
  // converting the response in memory lets the existing image display work.
  function loadArtwork(art, destination = group) {
    return new Promise(resolve => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.alt = art.title;
      img.draggable = false;
      const caption = document.createElement('figcaption');
      caption.textContent = art.title;
      figure.append(img, caption);
      destination.append(figure);

      const failed = () => { figure.remove(); resolve(false); };
      GM_xmlhttpRequest({
        method: 'GET',
        url: art.src,
        responseType: 'blob',
        timeout: 30000,
        onload(response) {
          if (response.status !== 200 || !response.response) return failed();
          const reader = new FileReader();
          reader.onerror = failed;
          reader.onload = () => {
            img.onload = () => resolve(true);
            img.onerror = failed;
            img.src = reader.result;
          };
          reader.readAsDataURL(response.response);
        },
        onerror: failed,
        ontimeout: failed
      });
    });
  }

  async function loadSelection() {
    // Darkness owns slot one. Nothing else starts until it has decoded, so
    // network timing can never change the first artwork.
    const darkness = ARTWORKS[0];
    let darknessReady = false;
    for (let attempt = 1; attempt <= 3 && !darknessReady; attempt++) {
      darknessReady = await loadArtwork(darkness, group);
      if (!darknessReady && attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }

    if (!darknessReady) {
      loading = false;
      loadFailed = true;
      loadingMessage.textContent = '/// DARKNESS LINK FAILED';
      checkSpace();
      updatePlayback();
      console.warn('Wargames ANSI stream: Darkness could not load from 16colo.rs.');
      return;
    }

    ready = true;
    loading = false;
    loadingMessage.hidden = true;
    checkSpace();
    rebuild();

    // Keep the live loop stable on Darkness while the rest load off-screen.
    // They are added to the real stream together after the batch completes.
    const staging = document.createElement('div');
    const remaining = ARTWORKS.slice(1);
    let next = 0;
    let loaded = 0;
    async function worker() {
      while (next < remaining.length) {
        const art = remaining[next++];
        if (await loadArtwork(art, staging)) loaded++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    await Promise.all([worker(), worker()]);
    group.append(...staging.children);
    rebuild();
    if (!loaded) console.warn('Wargames ANSI stream: additional images could not load from 16colo.rs.');
  }
  // Paint the frame before beginning any network request.
  checkSpace();
  loadSelection();
})();
