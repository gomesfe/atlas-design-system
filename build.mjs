#!/usr/bin/env node
/**
 * Gera as telas do portal Atlas: um .html autocontido por tela, na raiz de
 * `telas/`, mais a galeria `index.html`.
 *
 * As fontes em `src/telas/` guardam só o miolo de cada tela e usam dois atalhos:
 *
 *   {{nav:catalog}}     a barra de navegação, com a pílula "catalog" acesa
 *   {{i:busca}}         um ícone do DS (18px); {{i:busca:14}} com outro tamanho
 *
 * O build troca os atalhos pela marcação final e embute o `atlas.css` — o
 * mesmo CSS do repositório atlas-design-system, sem alteração. Cada arquivo
 * gerado abre sozinho, com dois cliques, sem servidor.
 *
 *   node build.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src', 'telas');
const OUT = join(ROOT, 'telas');

const CSS = readFileSync(join(ROOT, 'atlas.css'), 'utf8').trim();
const FONT =
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap">';

/* ------------------------------------------------------------- ícones --- */
/* Traço de 2px, cantos arredondados — o mesmo desenho dos ícones do DS. Os
   treze primeiros têm os nomes e os traços do construtor do design system. */
const ICONS = {
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  sino: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  nuvem: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 12 3.5 3.5 0 0 0 6 19z"/>',
  tabela: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  usuarios: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pasta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  chave: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  grade: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  codigo: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  // Complementos, no mesmo traço.
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  predio: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  apps: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/>',
  rede: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
  template: '<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="9" height="7" rx="1.5"/><rect x="16" y="14" width="5" height="7" rx="1.5"/>',
  seta: '<path d="M7 17 17 7M7 7h10v10"/>',
  externo: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  estrela: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  ferramenta: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  bandeira: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  concluido: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  pendente: '<circle cx="12" cy="12" r="10"/>',
  camadas: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  alerta: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  ampulheta: '<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
  relogio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  historico: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3.5 2"/>',
  selo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  olho: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  fechar: '<path d="M18 6 6 18M6 6l12 12"/>',
  copiar: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trilha: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  pulso: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  caixa: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  servidor: '<rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01"/>',
  livro: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  casa: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  voltar: '<path d="m15 18-6-6 6-6"/>',
  sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
};

function icon(name, size = 18) {
  if (!ICONS[name]) throw new Error(`ícone desconhecido: ${name}`);
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}

/* ---------------------------------------------------------------- nav --- */
/* Ordem das pílulas do portal (PILL_ORDER do AtlasTopNav). Busca,
   notificações e configurações ficam só como botões à direita. */
const NAV = [
  ['home', 'Home', 'home.html'],
  ['catalog', 'Catalog', 'catalogo.html'],
  ['catalog-v2', 'Catálogo V2', 'catalogo-v2.html'],
  ['my-groups', 'Meus grupos', 'meus-grupos.html'],
  ['apis', 'APIs', 'apis.html'],
  ['docs', 'Docs', 'docs.html'],
  ['learning', 'Trilhas', 'trilhas.html'],
  ['create', 'Create', 'create.html'],
  ['break-glass', 'Break Glass', 'break-glass.html'],
  ['api-keys', 'API Keys', 'api-keys.html'],
  ['admin', 'Administração', 'admin.html'],
  ['status', 'Status da Plataforma', 'status-plataforma.html'],
];

function nav(active) {
  const pills = NAV.map(
    ([id, label, href]) =>
      `        <a class="atlas-navPill${id === active ? ' atlas-navPillActive' : ''}" href="${href}"${
        id === active ? ' aria-current="page"' : ''
      }>${label}</a>`,
  ).join('\n');
  const action = (href, label, name, current) =>
    `    <a class="atlas-navActionBtn" href="${href}" aria-label="${label}" title="${label}"${
      current ? ' aria-current="page" style="color:var(--lime);border-color:var(--lime-border)"' : ''
    }>${icon(name)}</a>`;

  return `<header class="atlas-topNav atlas-topNav--fixed">
  <div class="atlas-navLeft">
    <div class="atlas-brandLogo">
      <span class="atlas-brandMark">A</span>
      <span class="atlas-brandName">Atlas</span>
      <span class="atlas-badgeTag atlas-badgeInfo" title="Rodando na sua máquina · v0.1.0">local</span>
    </div>
    <div class="atlas-navPillsWrapper">
      <nav class="atlas-navPills" aria-label="Navegação principal">
${pills}
      </nav>
    </div>
  </div>
  <div class="atlas-navRight">
${action('buscar.html', 'Buscar', 'busca', active === 'search')}
${action('notificacoes.html', 'Notificações', 'sino', active === 'notifications')}
    <button type="button" class="atlas-navActionBtn" data-theme-toggle aria-label="Alternar tema" title="Alternar tema">${icon('sol')}</button>
${action('configuracoes.html', 'Configurações', 'engrenagem', active === 'settings')}
  </div>
</header>`;
}

/* ------------------------------------------------------------- páginas --- */
/** Cabeçalho `<!-- chave: valor -->` no topo de cada fonte. */
function parse(source) {
  const match = source.match(/^<!--([\s\S]*?)-->\s*/);
  const meta = {};
  for (const line of (match?.[1] ?? '').split('\n')) {
    const kv = line.match(/^\s*([\w-]+):\s*(.+?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: source.slice(match ? match[0].length : 0).trim() };
}

const expand = text =>
  text
    .replace(/\{\{nav:([\w-]+)\}\}/g, (_, id) => nav(id))
    .replace(/\{\{i:([\w-]+)(?::(\d+))?\}\}/g, (_, name, size) => icon(name, size ? Number(size) : 18));

/* Único JS das telas, só de apresentação: o botão de tema da nav (guarda a
   escolha para valer ao navegar entre telas) e a faixa de pílulas rolando até
   a tela atual, que no fim da lista ficaria escondida atrás da borda. */
const THEME_SCRIPT = `<script>
  (function () {
    var pill = document.querySelector('.atlas-navPillActive');
    if (pill) {
      var strip = pill.parentElement;
      strip.scrollLeft = pill.offsetLeft - (strip.clientWidth - pill.offsetWidth) / 2;
    }
    var root = document.body, key = 'atlas.theme';
    try { var saved = localStorage.getItem(key); if (saved) root.dataset.theme = saved; } catch (e) {}
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = root.dataset.theme === 'light' ? 'dark' : 'light';
        root.dataset.theme = next;
        try { localStorage.setItem(key, next); } catch (e) {}
      });
    });
  })();
</script>`;

function page({ meta, body }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title} · Atlas</title>
  <meta name="description" content="${meta.description ?? ''}">
  ${FONT}
  <!-- Atlas Design System — atlas.css (github.com/gomesfe/atlas-design-system) -->
  <style>
${CSS}
  </style>
</head>
<body class="atlas-root" data-theme="dark">
${expand(body)}
${THEME_SCRIPT}
</body>
</html>
`;
}

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC).filter(f => f.endsWith('.html')).sort();
const screens = [];
for (const file of files) {
  const parsed = parse(readFileSync(join(SRC, file), 'utf8'));
  writeFileSync(join(OUT, file), page(parsed));
  screens.push({ file, ...parsed.meta });
}

/* Galeria: um cartão por tela, na ordem do campo `order`. */
screens.sort((a, b) => Number(a.order ?? 99) - Number(b.order ?? 99));
const cards = screens
  .map(
    s => `      <article class="atlas-featureCard">
        <div class="atlas-featureCardHead"><span class="atlas-badgeTag ${
          s.kind === 'estado' ? 'atlas-badgePurple' : 'atlas-badgeInfo'
        }">${s.kind === 'estado' ? 'estado' : 'tela'}</span></div>
        <div class="atlas-featureCardTitle">${s.title}</div>
        <div class="atlas-featureCardDesc">${s.description ?? ''}</div>
        <div class="atlas-featureCardFooter"><span class="atlas-costMono" style="font-size:.75rem">telas/${s.file}</span><a class="atlas-templateLink" style="margin-left:auto;display:inline-flex;align-items:center;gap:4px" href="telas/${s.file}">Abrir ${icon('seta', 13)}</a></div>
      </article>`,
  )
  .join('\n');

const gallery = `<!--
title: Telas do portal
-->
<header class="atlas-topNav atlas-topNav--fixed">
  <div class="atlas-navLeft">
    <div class="atlas-brandLogo">
      <span class="atlas-brandMark">A</span>
      <span class="atlas-brandName">Atlas</span>
      <span class="atlas-badgeTag atlas-badgeLime">telas</span>
    </div>
  </div>
  <div class="atlas-navRight">
    <a class="atlas-navActionBtn" href="https://github.com/gomesfe/atlas-design-system" aria-label="Design system" title="Design system">{{i:template}}</a>
    <button type="button" class="atlas-navActionBtn" data-theme-toggle aria-label="Alternar tema" title="Alternar tema">{{i:sol}}</button>
  </div>
</header>
<main class="atlas-pageMain">
  <div class="atlas-appContainer">
    <div class="atlas-pageHeader">
      <div class="atlas-pageTitleGroup">
        <span class="atlas-pageEyebrow">Portal do Desenvolvedor</span>
        <h1 class="atlas-pageTitle">Telas do Atlas</h1>
        <p class="atlas-pageSubtitle">O design de cada tela do portal, em HTML e CSS puros, com o Atlas Design System. ${screens.length} arquivos — cada um abre sozinho.</p>
      </div>
    </div>
    <div class="atlas-cardGrid">
${cards}
    </div>
  </div>
</main>`;
writeFileSync(join(ROOT, 'index.html'), page(parse(gallery)));

console.log(`✓ ${files.length} tela(s) em telas/ + index.html`);
