import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  throw new Error("Usage: node patch-scramjet.mjs /path/to/public/index.html");
}

let html = readFileSync(file, "utf8");

if (html.includes('id="blueberry-shortcut"')) {
  console.log("Blueberry shortcut already present; nothing to do.");
  process.exit(0);
}

const targetUrl = "https://scramjet-blueberry-clone.hostless.app/";
const marker = "</body>";
if (!html.includes(marker)) {
  throw new Error("Upstream index.html did not contain </body>. The upstream page structure may have changed.");
}

const addition = `
\t\t<div id="blueberry-shortcut" aria-label="Open Blueberry Cloud Games">
\t\t\t<button id="blueberry-launch" type="button" title="Open Blueberry Cloud Games">
\t\t\t\t<img src="https://cdn.simpleicons.org/steam/ffffff" alt="Steam" width="30" height="30" />
\t\t\t</button>
\t\t</div>
\t\t<style>
\t\t\t#blueberry-shortcut {
\t\t\t\tposition: fixed;
\t\t\t\ttop: 18px;
\t\t\t\tright: 18px;
\t\t\t\tz-index: 9999;
\t\t\t}
\t\t\t#blueberry-launch {
\t\t\t\twidth: 54px;
\t\t\t\theight: 54px;
\t\t\t\tpadding: 0;
\t\t\t\tborder-radius: 16px;
\t\t\t\tborder: 1px solid rgba(255, 255, 255, 0.22);
\t\t\t\tbackground: rgba(30, 25, 45, 0.82);
\t\t\t\tbackdrop-filter: blur(14px);
\t\t\t\tcursor: pointer;
\t\t\t\tbox-shadow: 0 10px 30px rgba(0, 0, 0, 0.30);
\t\t\t\tdisplay: grid;
\t\t\t\tplace-items: center;
\t\t\t}
\t\t\t#blueberry-launch:hover {
\t\t\t\ttransform: translateY(-1px);
\t\t\t}
\t\t\t#blueberry-launch:focus-visible {
\t\t\t\toutline: 2px solid #8b7cff;
\t\t\t\toutline-offset: 3px;
\t\t\t}
\t\t\t#blueberry-launch img {
\t\t\t\tdisplay: block;
\t\t\t}
\t\t</style>
\t\t<script>
\t\t\tdocument.getElementById("blueberry-launch").addEventListener("click", () => {
\t\t\t\tconst address = document.getElementById("sj-address");
\t\t\t\tconst form = document.getElementById("sj-form");
\t\t\t\taddress.value = "${targetUrl}";
\t\t\t\tif (form.requestSubmit) {
\t\t\t\t\tform.requestSubmit();
\t\t\t\t} else {
\t\t\t\t\tform.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
\t\t\t\t}
\t\t\t});
\t\t</script>
`;

html = html.replace(marker, addition + marker);
writeFileSync(file, html);
console.log(`Added the single Blueberry/Steam shortcut targeting ${targetUrl}`);
