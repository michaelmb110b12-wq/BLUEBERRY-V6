#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] || '.';
const TARGET = 'https://michaelmb110b12-wq.github.io/Cine-Cloud-SRC/src/';
const TARGET_LABEL = 'Cine Cloud';
const GITHUB_PROFILE = 'https://github.com/michaelmb110b12-wq';

const read = file => fs.readFileSync(file, 'utf8');
const write = (file, data) => fs.writeFileSync(file, data, 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(message); };

const steamSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Steam"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-10.88 8.9l5.08 2.11a3.02 3.02 0 0 1 3.02-.18l2.4-1.74a3.6 3.6 0 1 1 3.1 3.1l-1.74 2.4c.1.35.16.71.16 1.09a3.04 3.04 0 0 1-6.05.5L2.7 14.99A11.1 11.1 0 1 0 12 .9Zm6.02 5.1a2.06 2.06 0 1 0 0 4.12 2.06 2.06 0 0 0 0-4.12Zm-5.1 10.33a1.52 1.52 0 1 0 0 3.04 1.52 1.52 0 0 0 0-3.04Z"/></svg>`;
const githubSvg = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="GitHub"><path fill="currentColor" d="M12 .297a12 12 0 0 0-3.79 23.384c.6.113.82-.258.82-.577 0-.285-.011-1.04-.017-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.805 1.304 3.49.997.108-.775.418-1.304.762-1.604-2.665-.303-5.466-1.332-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 6.103c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.806 5.624-5.478 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.696.825.578A12.001 12.001 0 0 0 12 .297Z"/></svg>`;

function patchIndex(file) {
  let html = read(file);

  const gamesEntryRe = /\{\s*id:\s*'games'\s*,\s*name:\s*'Games'\s*,\s*svg:\s*`[\s\S]*?`\s*\},/m;
  must(gamesEntryRe.test(html), `Games system entry not found in ${file}`);
  html = html.replace(gamesEntryRe, `{ id: 'games', name: '${TARGET_LABEL}', svg: \`${steamSvg}\` },`);

  const gamesBranchRe = /(\}\s*else if\s*\(page\s*===\s*'games'\)\s*\{)[\s\S]*?(\}\s*else if\s*\(page\s*===\s*'run_custom'\s*&&\s*appData\))/m;
  must(gamesBranchRe.test(html), `Games navigation branch not found in ${file}. Upstream GhostLink structure may have changed.`);
  html = html.replace(gamesBranchRe, `$1
                gamesView.style.display = 'none';
                proxyView.style.display = 'flex';
                if (!proxyBrowserInitialized) {
                    proxyBrowserInitialized = true;
                    await proxyInit();
                }
                handleSubmit('${TARGET}');
             $2`);

  html = html.replace(/Open Games \(Alt \+ \?\)/g, 'Open Cine Cloud (Alt + ?)');
  html = html.replace(/<option\s+value=["']games["']>Games<\/option>/g, '<option value="games">Cine Cloud</option>');
  html = html.replace(/games:\s*'Games'/g, `games: '${TARGET_LABEL}'`);

  const discordSocialRe = /<a href="https:\/\/discord\.gg\/[^\"]+" target="_blank" class="social-icon" title="Discord">[\s\S]*?<\/a>/m;
  const githubSocialRe = /<a href="https:\/\/github\.com\/virtuan4-max\/ghostlinkhub" target="_blank" class="social-icon" title="GitHub">[\s\S]*?<\/a>/m;
  const githubSocial = `<a href="${GITHUB_PROFILE}" target="_blank" class="social-icon" title="GitHub">${githubSvg}</a>`;
  must(discordSocialRe.test(html), `Discord social icon not found in ${file}`);
  must(githubSocialRe.test(html), `GhostLink GitHub social icon not found in ${file}`);
  html = html.replace(discordSocialRe, githubSocial).replace(githubSocialRe, githubSocial);

  // Blueberry failover config. On Hostless, same-origin Wisp is primary.
  // On Bunny, set hostlessWisp in bunny-config.js to the Hostless app's /wisp/ URL.
  const wispMarker = `let proxyBrowserInitialized = false;`;
  must(html.includes(wispMarker), `Wisp initialization marker not found in ${file}`);
  const wispConfigScript = `<script src="bunny-config.js"></script>\n`;
  if (!html.includes('src="bunny-config.js"')) {
    html = html.replace('<head>', '<head>\n    ' + wispConfigScript);
  }
  const inject = `
<script>
(function () {
  const isBunny = location.hostname.endsWith('.b-cdn.net');
  const sameOrigin = (!isBunny && location.protocol === 'https:') ? ('wss://' + location.host + '/wisp/') : null;
  const configured = Array.isArray(window.BLUEBERRY_WISP_FALLBACKS) ? window.BLUEBERRY_WISP_FALLBACKS : [];
  window.SITE_CONFIG = Object.assign({}, window.SITE_CONFIG || {});
  const existing = Array.isArray(window.SITE_CONFIG.wispServers) ? window.SITE_CONFIG.wispServers : [];
  const local = sameOrigin ? [{ name: 'Blueberry Hostless', url: sameOrigin }] : [];
  const extra = configured.filter(Boolean).map((url, i) => ({ name: 'Blueberry Fallback ' + (i + 1), url }));
  window.SITE_CONFIG.wispServers = [...local, ...extra, ...existing];
  if (sameOrigin && !window.SITE_CONFIG.defaultWisp) window.SITE_CONFIG.defaultWisp = sameOrigin;
})();
</script>
`;
  if (!html.includes('BLUEBERRY_WISP_FALLBACKS')) {
    html = html.replace(wispMarker, inject + '\n' + wispMarker);
  }

  const wispAssign = `if (match) {\n                    WISP_SERVERS = (new Function('return ' + match[1]))();\n                }`;
  const wispAssignRe = /if\s*\(match\)\s*\{\s*WISP_SERVERS\s*=\s*\(new Function\('return '\s*\+\s*match\[1\]\)\)\(\);\s*\}/m;
  must(wispAssignRe.test(html), `Wisp server-list assignment not found in ${file}`);
  html = html.replace(wispAssignRe, `if (match) {
                    WISP_SERVERS = (new Function('return ' + match[1]))();
                }
                const configured = Array.isArray(window.SITE_CONFIG?.wispServers) ? window.SITE_CONFIG.wispServers : [];
                WISP_SERVERS = [...configured, ...WISP_SERVERS];
                const seen = new Set();
                WISP_SERVERS = WISP_SERVERS.filter(s => s && s.url && !seen.has(s.url) && seen.add(s.url));`);

  write(file, html);
}

const candidates = [path.join(ROOT, 'src', 'index.html'), path.join(ROOT, 'ghostlinksinglefile.html')];
let patched = 0;
for (const file of candidates) if (fs.existsSync(file)) { patchIndex(file); patched++; }
must(patched > 0, 'No GhostLink HTML entrypoint found. Expected src/index.html or ghostlinksinglefile.html.');
console.log(`Blueberry Hostless + Bunny failover patch applied to ${patched} file(s).`);
