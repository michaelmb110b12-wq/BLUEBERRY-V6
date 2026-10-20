import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  throw new Error("Usage: node patch-scramjet.mjs /path/to/public/index.html");
}

let html = readFileSync(file, "utf8");

if (
  html.includes('id="blueberry-shortcut"') &&
  html.includes('id="blueberry-loader-shortcut"')
) {
  console.log("Blueberry shortcuts already present; nothing to do.");
  process.exit(0);
}

const targetUrl = "https://nocturne.lol/";
const marker = "</body>";
if (!html.includes(marker)) {
  throw new Error("Upstream index.html did not contain </body>. The upstream page structure may have changed.");
}

const addition = `
		<div id="blueberry-shortcut" aria-label="Open Blueberry Cloud Games">
			<button id="blueberry-launch" type="button" title="Open Blueberry Cloud Games">
				<img src="https://cdn.simpleicons.org/steam/ffffff" alt="Steam" width="30" height="30" />
			</button>
		</div>
		<div id="blueberry-loader-shortcut">
			<a href="/loader.html" target="_blank" rel="noopener" title="Open the experimental third-party relay loader">Relay Loader ↗</a>
		</div>
		<style>
			#blueberry-shortcut {
				position: fixed;
				top: 18px;
				right: 18px;
				z-index: 9999;
			}
			#blueberry-loader-shortcut {
				position: fixed;
				top: 82px;
				right: 18px;
				z-index: 9999;
			}
			#blueberry-loader-shortcut a {
				display: block;
				padding: 9px 11px;
				border: 1px solid rgba(255, 255, 255, 0.2);
				border-radius: 10px;
				background: rgba(30, 25, 45, 0.88);
				backdrop-filter: blur(14px);
				color: #fff;
				text-decoration: none;
				font-size: 12px;
				font-weight: 700;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
			}
			#blueberry-loader-shortcut a:hover {
				background: rgba(60, 50, 90, 0.95);
			}
			#blueberry-launch {
				width: 54px;
				height: 54px;
				padding: 0;
				border-radius: 16px;
				border: 1px solid rgba(255, 255, 255, 0.22);
				background: rgba(30, 25, 45, 0.82);
				backdrop-filter: blur(14px);
				cursor: pointer;
				box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30);
				display: grid;
				place-items: center;
			}
			#blueberry-launch:hover {
				transform: translateY(-1px);
			}
			#blueberry-launch:focus-visible {
				outline: 2px solid #8b7cff;
				outline-offset: 3px;
			}
			#blueberry-launch img {
				display: block;
			}
		</style>
		<script>
			document.getElementById("blueberry-launch").addEventListener("click", () => {
				const address = document.getElementById("sj-address");
				const form = document.getElementById("sj-form");
				if (!address || !form) {
					window.open("${targetUrl}", "_blank", "noopener");
					return;
				}
				address.value = "${targetUrl}";
				if (form.requestSubmit) {
					form.requestSubmit();
				} else {
					form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
				}
			});
		</script>
`;

html = html.replace(marker, addition + marker);
writeFileSync(file, html);
console.log("Added Blueberry shortcuts for the game page and the experimental relay loader.");
