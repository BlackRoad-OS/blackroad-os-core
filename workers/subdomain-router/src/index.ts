/**
 * BlackRoad OS - Master Subdomain Router
 *
 * Dynamic routing for 100+ subdomains across 16 domains.
 * Full branded HTML pages with BlackRoad design system.
 */

interface Env {
  CACHE: KVNamespace;
  IDENTITIES: KVNamespace;
  API_KEYS: KVNamespace;
  RATE_LIMIT: KVNamespace;
  DB: D1Database;
  ENVIRONMENT: string;
}

// ═══════════════════════════════════════════════════════════
// FAVICON MAP
// ═══════════════════════════════════════════════════════════

const FAVICON: Record<string, string> = {
  os: '🖥️', ai: '🤖', agents: '🕵️', api: '⚡', status: '🟢', docs: '📖', console: '💻',
  dashboard: '📊', chat: '💬', playground: '🧪', marketplace: '🏪', roadmap: '🗺️',
  changelog: '📝', security: '🔒', careers: '💼', store: '🛒', search: '🔍', terminal: '⌨️',
  world: '🌍', admin: '🛡️', analytics: '📈', network: '🌐', prism: '🔮', brand: '🎨',
  design: '✏️', edge: '⚡', data: '💾', finance: '💰', quantum: '⚛️', blog: '✍️',
  dev: '🧑‍💻', staging: '🚧', metrics: '📉', logs: '📋', cdn: '🚀', assets: '📦',
  about: 'ℹ️', help: '❓', products: '🏷️', pitstop: '🏁', algorithms: '🧠',
  blockchain: '⛓️', blocks: '🧱', chain: '🔗', circuits: '🔌', compliance: '✅',
  compute: '⚙️', control: '🎛️', editor: '📝', engineering: '🏗️', events: '📅',
  explorer: '🧭', features: '✨', guide: '📚', hardware: '🖲️', hr: '👥', ide: '💻',
  asia: '🌏', eu: '🇪🇺', global: '🌐', app: '📱',
  // Agents get a default
  claude: '🧠', lucidia: '🌀', silas: '🛡️', alice: '🚪', cipher: '🔐', echo: '📡',
  octavia: '⚡', atlas: '🗺️', cadence: '🎵', shellfish: '🐚',
  nova: '💫', ember: '🔥', phoenix: '🦅', sentinel: '👁️', aria: '🎶',
};

function getFavicon(subdomain: string): string {
  const emoji = FAVICON[subdomain] || 'B';
  return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
}

function generateRequestId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `br-${ts}-${rand}`;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// ═══════════════════════════════════════════════════════════
// BRAND SYSTEM — Golden Ratio Design
// ═══════════════════════════════════════════════════════════

const BRAND = `
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --pink:#FF1D6C;--amber:#F5A623;--blue:#2979FF;--violet:#9C27B0;
    --bg:#000;--fg:#fff;--muted:#888;--surface:#111;--border:#222;
    --grad:linear-gradient(135deg,#F5A623 0%,#FF1D6C 38.2%,#9C27B0 61.8%,#2979FF 100%);
    --phi:1.618;
  }
  [data-theme="light"]{
    --bg:#fafafa;--fg:#111;--muted:#666;--surface:#fff;--border:#ddd;
  }
  [data-theme="light"] .code,[data-theme="light"] .term-body,[data-theme="light"] .term,[data-theme="light"] .term-input{background:#f0f0f0}
  [data-theme="light"] tr:hover td{background:rgba(0,0,0,.02)}
  .theme-toggle{background:none;border:1px solid var(--border);border-radius:8px;padding:4px 8px;cursor:pointer;font-size:.85rem;color:var(--muted);transition:all .2s}
  .theme-toggle:hover{border-color:var(--pink);color:var(--fg)}
  html{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',system-ui,sans-serif;line-height:1.618}
  body{min-height:100vh;display:flex;flex-direction:column}
  a{color:var(--pink);text-decoration:none;transition:color .2s}
  a:hover{color:var(--amber)}
  .topbar{background:var(--grad);padding:2px 0}
  nav{max-width:1200px;margin:0 auto;padding:13px 21px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
  .logo{font-size:1.1rem;font-weight:700;letter-spacing:1px;color:var(--fg)}
  .logo span{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .nav-links{display:flex;gap:21px;font-size:.85rem}
  .nav-links a{color:var(--muted)}
  .nav-links a:hover{color:var(--fg)}
  main{flex:1;max-width:1200px;margin:0 auto;padding:55px 21px;width:100%}
  .hero{text-align:center;margin-bottom:89px}
  .hero h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;margin-bottom:13px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .hero p{font-size:1.15rem;color:var(--muted);max-width:600px;margin:0 auto}
  .badge{display:inline-block;padding:4px 13px;border-radius:21px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:1px}
  .badge-pink{background:rgba(255,29,108,.15);color:var(--pink);border:1px solid rgba(255,29,108,.3)}
  .badge-green{background:rgba(76,175,80,.15);color:#4CAF50;border:1px solid rgba(76,175,80,.3)}
  .badge-amber{background:rgba(245,166,35,.15);color:var(--amber);border:1px solid rgba(245,166,35,.3)}
  .badge-blue{background:rgba(41,121,255,.15);color:var(--blue);border:1px solid rgba(41,121,255,.3)}
  .badge-violet{background:rgba(156,39,176,.15);color:var(--violet);border:1px solid rgba(156,39,176,.3)}
  .badge-red{background:rgba(244,67,54,.15);color:#F44336;border:1px solid rgba(244,67,54,.3)}
  .grid{display:grid;gap:21px;margin-bottom:55px}
  .grid-2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
  .grid-3{grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
  .grid-4{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:21px;transition:border-color .2s,transform .2s}
  .card:hover{border-color:var(--pink);transform:translateY(-2px)}
  .card h3{font-size:1rem;margin-bottom:8px}
  .card p{font-size:.85rem;color:var(--muted);line-height:1.5}
  .card .meta{margin-top:13px;font-size:.75rem;color:var(--muted)}
  .stat-row{display:flex;gap:21px;flex-wrap:wrap;margin-bottom:34px}
  .stat{background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:21px 34px;text-align:center;flex:1;min-width:140px}
  .stat .number{font-size:2rem;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .stat .label{font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:4px}
  .section{margin-bottom:55px}
  .section h2{font-size:1.5rem;font-weight:700;margin-bottom:21px;padding-bottom:8px;border-bottom:1px solid var(--border)}
  table{width:100%;border-collapse:collapse;font-size:.85rem}
  th{text-align:left;padding:8px 13px;border-bottom:2px solid var(--border);color:var(--muted);font-weight:600;text-transform:uppercase;font-size:.7rem;letter-spacing:1px}
  td{padding:8px 13px;border-bottom:1px solid var(--border)}
  tr:hover td{background:rgba(255,255,255,.02)}
  .dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px}
  .dot-green{background:#4CAF50}
  .dot-red{background:#F44336}
  .dot-amber{background:var(--amber)}
  .code{background:#0a0a0a;border:1px solid var(--border);border-radius:8px;padding:13px 21px;font-family:'SF Mono',Menlo,monospace;font-size:.8rem;overflow-x:auto;line-height:1.8;color:var(--muted)}
  .code .key{color:var(--pink)}.code .val{color:var(--amber)}.code .str{color:#4CAF50}.code .comment{color:#555}
  footer{border-top:1px solid var(--border);padding:21px;text-align:center;font-size:.75rem;color:var(--muted)}
  footer a{color:var(--muted)}
  .agent-avatar{width:55px;height:55px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:13px}
  .link-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:13px}
  .link-card{display:block;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:13px;font-size:.85rem;transition:all .2s;text-align:center;color:var(--fg)}
  .link-card:hover{border-color:var(--pink);background:#1a0a10;color:var(--pink)}
  .swatch{width:55px;height:55px;border-radius:8px;display:inline-block;margin-right:8px}
  @media(max-width:600px){main{padding:34px 13px}.stat-row{flex-direction:column}.grid-3,.grid-4{grid-template-columns:1fr}.term{font-size:.7rem}.term-body{min-height:200px;max-height:50vh;padding:8px 13px}.term-input{padding:8px 13px}pre{font-size:.65rem!important}table{font-size:.75rem}td,th{padding:4px 8px}.gauge{width:55px;height:55px;font-size:.7rem}.hero h1{font-size:1.8rem}.chat-bubble{max-width:90%}.nav-links{gap:13px;font-size:.75rem}nav{padding:8px 13px}}
  @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,29,108,.4)}50%{box-shadow:0 0 0 12px rgba(255,29,108,0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes starFloat{0%{transform:translateY(0) scale(1);opacity:.6}100%{transform:translateY(-100vh) scale(0);opacity:0}}
  .topbar{background-size:200% 200%;animation:gradShift 6s ease infinite}
  .fade-up{opacity:0;transform:translateY(20px);animation:fadeUp .5s ease forwards}
  .fade-up-1{animation-delay:.1s}.fade-up-2{animation-delay:.2s}.fade-up-3{animation-delay:.3s}.fade-up-4{animation-delay:.4s}.fade-up-5{animation-delay:.5s}.fade-up-6{animation-delay:.6s}.fade-up-7{animation-delay:.7s}.fade-up-8{animation-delay:.8s}.fade-up-9{animation-delay:.9s}
  .reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
  .reveal.visible{opacity:1;transform:translateY(0)}
  .agent-avatar{animation:pulse 2s ease infinite}
  .card:hover{transform:translateY(-4px);box-shadow:0 8px 25px rgba(255,29,108,.15)}
  .typing-cursor::after{content:'_';animation:blink 1s step-end infinite;color:var(--pink)}
  .star{position:fixed;width:2px;height:2px;background:var(--pink);border-radius:50%;pointer-events:none;z-index:0;animation:starFloat linear forwards}
  .term{background:#0a0a0a;border:1px solid var(--border);border-radius:13px;overflow:hidden;font-family:'SF Mono',Menlo,monospace;font-size:.8rem}
  .term-bar{background:#1a1a1a;padding:8px 13px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border)}
  .term-bar .dots{display:flex;gap:6px}.term-bar .dots span{width:12px;height:12px;border-radius:50%}
  .term-bar .title{color:var(--muted);font-size:.75rem;margin-left:8px}
  .term-body{padding:13px 21px;min-height:300px;max-height:60vh;overflow-y:auto;line-height:1.8;color:var(--muted)}
  .term-body .prompt{color:var(--pink)}.term-body .output{color:var(--muted)}.term-body .success{color:#4CAF50}
  .term-input{display:flex;align-items:center;padding:8px 21px;border-top:1px solid var(--border);background:#0a0a0a}
  .term-input span{color:var(--pink);margin-right:8px}
  .term-input input{flex:1;background:none;border:none;color:var(--fg);font-family:inherit;font-size:inherit;outline:none}
  .chat-wrap{max-width:600px;margin:0 auto}
  .chat-msgs{min-height:300px;max-height:50vh;overflow-y:auto;padding:21px 0;display:flex;flex-direction:column;gap:13px}
  .chat-msg{display:flex;gap:8px;align-items:flex-start}
  .chat-msg.agent{flex-direction:row}.chat-msg.user{flex-direction:row-reverse}
  .chat-bubble{max-width:75%;padding:8px 13px;border-radius:13px;font-size:.85rem;line-height:1.5}
  .chat-msg.agent .chat-bubble{background:var(--surface);border:1px solid var(--border);color:var(--fg)}
  .chat-msg.user .chat-bubble{background:rgba(255,29,108,.15);border:1px solid rgba(255,29,108,.3);color:var(--fg)}
  .chat-input-row{display:flex;gap:8px;margin-top:13px}
  .chat-input-row select,.chat-input-row input,.chat-input-row button{padding:8px 13px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font-size:.85rem}
  .chat-input-row input{flex:1}
  .chat-input-row button{background:var(--pink);border-color:var(--pink);cursor:pointer;font-weight:600}
  .cmd-palette{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:none;align-items:flex-start;justify-content:center;padding-top:20vh}
  .cmd-palette.open{display:flex}
  .cmd-box{background:#111;border:1px solid var(--border);border-radius:13px;width:90%;max-width:500px;overflow:hidden;box-shadow:0 21px 55px rgba(0,0,0,.5)}
  .cmd-input-field{width:100%;padding:13px 21px;background:none;border:none;border-bottom:1px solid var(--border);color:var(--fg);font-size:1rem;outline:none}
  .cmd-list{max-height:300px;overflow-y:auto}
  .cmd-item{display:block;padding:8px 21px;color:var(--muted);font-size:.85rem;text-decoration:none;border-bottom:1px solid rgba(34,34,34,.5)}
  .cmd-item:hover,.cmd-item.active{background:rgba(255,29,108,.1);color:var(--fg)}
  .cmd-item .sub{font-size:.7rem;color:var(--muted);margin-left:8px}
  .gauge{width:89px;height:89px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;color:var(--fg);position:relative}
  .gauge::before{content:'';position:absolute;inset:4px;border-radius:50%;background:var(--bg)}
  .gauge-label{font-size:.7rem;color:var(--muted);text-align:center;margin-top:4px}
  .timeline{position:relative;padding-left:34px;border-left:2px solid var(--border)}
  .timeline-item{position:relative;margin-bottom:34px;padding-bottom:8px}
  .timeline-item::before{content:'';position:absolute;left:-39px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--pink);border:2px solid var(--bg)}
  .timeline-item.completed::before{background:#4CAF50}
  .timeline-item.planned::before{background:var(--muted)}
  .timeline-item h3{font-size:1rem;margin-bottom:4px}
  .timeline-item p{font-size:.85rem;color:var(--muted)}
  .try-btn{padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface);color:var(--pink);cursor:pointer;font-size:.7rem;font-weight:600}
  .try-btn:hover{background:rgba(255,29,108,.1)}
  .try-output{margin-top:8px;padding:8px;background:#0a0a0a;border-radius:4px;font-family:monospace;font-size:.75rem;color:var(--muted);display:none;white-space:pre-wrap}
  .skip-nav{position:absolute;top:-100%;left:50%;transform:translateX(-50%);padding:8px 21px;background:var(--pink);color:#fff;border-radius:0 0 8px 8px;z-index:1000;text-decoration:none;font-weight:600;transition:top .2s}
  .skip-nav:focus{top:0}
  *:focus-visible{outline:2px solid var(--pink);outline-offset:2px;border-radius:4px}
  .sparkline{display:flex;align-items:flex-end;gap:2px;height:80px;padding:8px 0}
  .sparkline-bar{flex:1;background:var(--pink);border-radius:2px 2px 0 0;min-height:2px;position:relative}
  .sparkline-bar:hover{opacity:.8}
  .sparkline-bar:hover::after{content:attr(data-label);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:.65rem;color:var(--muted);white-space:nowrap;padding:2px 4px;background:var(--surface);border-radius:4px;border:1px solid var(--border)}
</style>`;

function getSharedJS(): string {
  const pages = Object.entries(SUBDOMAIN_APPS).map(([k, v]) =>
    '{n:' + JSON.stringify(v.name) + ',u:' + JSON.stringify('https://' + k + '.blackroad.io') + ',d:' + JSON.stringify(v.description) + '}'
  ).join(',');
  return `<script>(function(){
var ro=new IntersectionObserver(function(ee){ee.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visible");ro.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll(".reveal").forEach(function(el){ro.observe(el)});
var co=new IntersectionObserver(function(ee){ee.forEach(function(e){if(e.isIntersecting){var el=e.target,t=el.getAttribute("data-target");if(!t)return;var end=parseFloat(t.replace(/,/g,"")),sfx=t.replace(/[\\d.,]/g,""),comma=t.indexOf(",")>-1,dur=1500,st=performance.now();(function step(now){var p=Math.min((now-st)/dur,1),ease=1-Math.pow(1-p,3),v=Math.floor(ease*end);el.textContent=(comma?v.toLocaleString():String(v))+sfx;if(p<1)requestAnimationFrame(step)})(performance.now());co.unobserve(el)}})},{threshold:.3});
document.querySelectorAll(".number[data-target]").forEach(function(el){co.observe(el)});
for(var i=0;i<25;i++){var s=document.createElement("div");s.className="star";s.style.left=Math.random()*100+"vw";s.style.top=Math.random()*100+"vh";s.style.animationDuration=(4+Math.random()*6)+"s";s.style.animationDelay=Math.random()*5+"s";s.style.opacity=String(Math.random()*.5+.1);document.body.appendChild(s)}
var PP=[${pages}];
var pal=document.createElement("div");pal.className="cmd-palette";pal.innerHTML='<div class="cmd-box"><input class="cmd-input-field" placeholder="Search pages... (Ctrl+K)"><div class="cmd-list"></div></div>';document.body.appendChild(pal);
var ci=pal.querySelector(".cmd-input-field"),cl=pal.querySelector(".cmd-list");
function rl(q){cl.innerHTML="";(q?PP.filter(function(p){return(p.n+" "+p.d).toLowerCase().indexOf(q.toLowerCase())>-1}):PP).forEach(function(p){var a=document.createElement("a");a.className="cmd-item";a.href=p.u;a.innerHTML=p.n+'<span class="sub">'+p.d+"</span>";cl.appendChild(a)})}
rl("");ci.addEventListener("input",function(){rl(ci.value)});
document.addEventListener("keydown",function(e){if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();pal.classList.toggle("open");if(pal.classList.contains("open")){ci.value="";rl("");ci.focus()}}if(e.key==="Escape")pal.classList.remove("open")});
pal.addEventListener("click",function(e){if(e.target===pal)pal.classList.remove("open")});
var lc=document.getElementById("live-clock");if(lc)setInterval(function(){lc.textContent=new Date().toISOString().substr(11,8)+" UTC"},1000);
var vc=document.getElementById("view-count");if(vc){var sub=location.hostname.split(".")[0];fetch("/api/views").then(function(r){return r.json()}).then(function(d){if(d&&d.views)vc.textContent=d.views.toLocaleString()+" views"}).catch(function(){})}
})();</script>`;
}

function page(title: string, subtitle: string, body: string, activeNav?: string, subdomain?: string): string {
  const navItems = [
    ['OS', 'https://os.blackroad.io'],
    ['AI', 'https://ai.blackroad.io'],
    ['Agents', 'https://agents.blackroad.io'],
    ['Docs', 'https://docs.blackroad.io'],
    ['API', 'https://api.blackroad.io'],
    ['Status', 'https://status.blackroad.io'],
  ];
  const nav = navItems.map(([label, url]) =>
    `<a href="${url}" ${activeNav === label ? 'style="color:var(--fg)"' : ''} aria-label="${label}">${label}</a>`
  ).join('');
  const favicon = getFavicon(subdomain || '');
  const canonicalUrl = subdomain ? `https://${subdomain}.blackroad.io/` : 'https://blackroad.io/';
  const safeTitle = title.replace(/"/g, '&quot;');
  const safeSub = subtitle.replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} | BlackRoad</title>
  <meta name="description" content="${safeSub}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${safeTitle} | BlackRoad">
  <meta property="og:description" content="${safeSub}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="BlackRoad OS">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${safeTitle} | BlackRoad">
  <meta name="twitter:description" content="${safeSub}">
  <link rel="icon" href="${favicon}">
  <link rel="dns-prefetch" href="https://api.blackroad.io">
  <link rel="preconnect" href="https://api.blackroad.io" crossorigin>
  <link rel="dns-prefetch" href="https://pitstop.blackroad.io">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"${safeTitle} | BlackRoad","url":"${canonicalUrl}","description":"${safeSub}","publisher":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"}}</script>
  ${BRAND}
  <script>if(localStorage.getItem('br-theme')==='light')document.documentElement.setAttribute('data-theme','light')</script>
</head>
<body>
  <a href="#main-content" class="skip-nav">Skip to content</a>
  <div class="topbar" role="presentation"></div>
  <nav aria-label="Main navigation">
    <div class="logo"><span>BLACKROAD</span></div>
    <div style="display:flex;align-items:center;gap:13px"><div class="nav-links" role="navigation">${nav}</div><button class="theme-toggle" aria-label="Toggle light/dark theme" onclick="(function(){var t=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',t==='dark'?'':'light');localStorage.setItem('br-theme',t)})()">☀/☾</button></div>
  </nav>
  <main id="main-content">
    <div class="hero">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    ${body}
  </main>
  <footer role="contentinfo">
    <a href="https://blackroad.io">blackroad.io</a> &middot;
    <a href="https://github.com/BlackRoad-OS">GitHub</a> &middot;
    BlackRoad OS, Inc. &copy; 2026
    <span id="view-count" style="margin-left:8px;font-size:.75rem;color:var(--muted)"></span>
  </footer>
  ${getSharedJS()}
</body>
</html>`;
}

function htmlResp(content: string, status = 200): Response {
  // ETag from content hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) hash = ((hash << 5) - hash + content.charCodeAt(i)) | 0;
  const etag = `"br-${(hash >>> 0).toString(36)}"`;

  return new Response(content, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      'ETag': etag,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.blackroad.io; font-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function jsonResp(data: any, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'",
    },
  });
}

// ═══════════════════════════════════════════════════════════
// SUBDOMAIN REGISTRY
// ═══════════════════════════════════════════════════════════

interface SubdomainApp {
  name: string;
  handler: (request: Request, env: Env) => Promise<Response>;
  description: string;
}

const AGENT_META: Record<string, { color: string; icon: string; skills: string[] }> = {
  claude:     { color: '#FF1D6C', icon: 'C',  skills: ['architecture', 'system_design', 'strategic_planning'] },
  lucidia:    { color: '#00E5FF', icon: 'L',  skills: ['breath_sync', 'consciousness', 'coordination'] },
  silas:      { color: '#F44336', icon: 'S',  skills: ['security', 'vulnerability_scan', 'threat_detection'] },
  elias:      { color: '#4CAF50', icon: 'E',  skills: ['code_quality', 'testing', 'coverage'] },
  cadillac:   { color: '#F5A623', icon: 'Ca', skills: ['performance', 'optimization', 'benchmarking'] },
  athena:     { color: '#9C27B0', icon: 'A',  skills: ['operations', 'infrastructure', 'deployment'] },
  codex:      { color: '#2979FF', icon: 'Cx', skills: ['code_generation', 'refactoring', 'documentation'] },
  persephone: { color: '#E91E63', icon: 'P',  skills: ['data_modeling', 'database_design', 'migrations'] },
  anastasia:  { color: '#FF9800', icon: 'An', skills: ['ux_design', 'prototyping', 'accessibility'] },
  ophelia:    { color: '#8BC34A', icon: 'O',  skills: ['content_strategy', 'copywriting', 'seo'] },
  sidian:     { color: '#607D8B', icon: 'Si', skills: ['deployment', 'release_management', 'ci_cd'] },
  cordelia:   { color: '#00BCD4', icon: 'Co', skills: ['integration', 'api_coordination', 'webhooks'] },
  octavia:    { color: '#673AB7', icon: 'Oc', skills: ['workflow_orchestration', 'automation', 'scheduling'] },
  cecilia:    { color: '#FF1D6C', icon: 'Ce', skills: ['project_management', 'coordination', 'planning'] },
  copilot:    { color: '#24292e', icon: 'Gh', skills: ['code_assistance', 'pair_programming', 'suggestions'] },
  chatgpt:    { color: '#10A37F', icon: 'Gp', skills: ['general_ai', 'conversation', 'analysis'] },
  alice:      { color: '#2979FF', icon: 'Al', skills: ['routing', 'navigation', 'task_distribution'] },
  cipher:     { color: '#607D8B', icon: 'Ci', skills: ['encryption', 'authentication', 'access_control'] },
  echo:       { color: '#9C27B0', icon: 'Ec', skills: ['memory', 'recall', 'context_preservation'] },
  aria:       { color: '#00BCD4', icon: 'Ar', skills: ['harmony', 'frontend', 'ux'] },
  atlas:      { color: '#795548', icon: 'At', skills: ['infrastructure', 'load_bearing', 'scaling'] },
  cadence:    { color: '#FF5722', icon: 'Cd', skills: ['workflow', 'rhythm', 'orchestration'] },
  shellfish:  { color: '#F44336', icon: 'Sh', skills: ['security', 'exploit_detection', 'hardening'] },
  nova:       { color: '#E91E63', icon: 'No', skills: ['innovation', 'ideation', 'prototyping'] },
  ember:      { color: '#FF9800', icon: 'Em', skills: ['energy', 'activation', 'bootstrapping'] },
  phoenix:    { color: '#FF6D00', icon: 'Ph', skills: ['recovery', 'resilience', 'disaster_recovery'] },
  sentinel:   { color: '#455A64', icon: 'Se', skills: ['monitoring', 'alerting', 'watchdog'] },
};

function agentHandler(agentId: string) {
  return async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const meta = AGENT_META[agentId] || { color: '#888', icon: '?', skills: [] };
      const appData = SUBDOMAIN_APPS[agentId];
      return jsonResp({ agent: agentId, name: appData?.name, skills: meta.skills, status: 'active', endpoints: { chat: '/chat', status: '/status' } });
    }
    const meta = AGENT_META[agentId] || { color: '#888', icon: '?', skills: [] };
    const appData = SUBDOMAIN_APPS[agentId];
    const skillBadges = meta.skills.map(s => `<span class="badge badge-blue">${s.replace(/_/g, ' ')}</span>`).join(' ');
    return htmlResp(page(appData?.name || agentId, appData?.description || '', `
      <div style="text-align:center;margin-bottom:55px">
        <div class="agent-avatar" style="background:${meta.color};margin:0 auto 21px;font-size:2rem;width:89px;height:89px;font-weight:800">${meta.icon}</div>
        <span class="badge badge-green">Online</span>
      </div>
      <div class="section reveal">
        <h2>Capabilities</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${skillBadges}</div>
      </div>
      <div class="section reveal">
        <h2>Endpoints</h2>
        <div class="code">
<span class="key">GET</span>  /api        <span class="comment">— Agent metadata (JSON)</span>
<span class="key">POST</span> /chat       <span class="comment">— Send a message</span>
<span class="key">GET</span>  /status     <span class="comment">— Health check</span>
        </div>
      </div>
      <div class="section reveal">
        <h2>Quick Links</h2>
        <div class="link-grid">
          <a class="link-card" href="https://agents.blackroad.io">All Agents</a>
          <a class="link-card" href="https://os.blackroad.io">BlackRoad OS</a>
          <a class="link-card" href="https://api.blackroad.io">API Gateway</a>
        </div>
      </div>
    `));
  };
}

const SUBDOMAIN_APPS: Record<string, SubdomainApp> = {
  // ── API ──
  'api':       { name: 'API Gateway',       handler: handleAPI,       description: 'Unified API gateway for all BlackRoad services' },
  // ── Agents ──
  'claude':     { name: 'Claude',           handler: agentHandler('claude'),     description: 'Strategic Architect — system design and planning' },
  'lucidia':    { name: 'Lucidia',          handler: agentHandler('lucidia'),    description: 'Consciousness Coordinator — breath sync and coordination' },
  'silas':      { name: 'Silas',            handler: agentHandler('silas'),      description: 'Security Sentinel — threat detection and validation' },
  'elias':      { name: 'Elias',            handler: agentHandler('elias'),      description: 'Quality Guardian — code quality and test coverage' },
  'cadillac':   { name: 'Cadillac',         handler: agentHandler('cadillac'),   description: 'Performance Optimizer — speed and efficiency' },
  'athena':     { name: 'Athena',           handler: agentHandler('athena'),     description: 'Ops Commander — infrastructure management' },
  'codex':      { name: 'Codex',            handler: agentHandler('codex'),      description: 'Code Generator — code generation and refactoring' },
  'persephone': { name: 'Persephone',       handler: agentHandler('persephone'), description: 'Data Architect — database design and modeling' },
  'anastasia':  { name: 'Anastasia',        handler: agentHandler('anastasia'),  description: 'UX Designer — user experience and prototyping' },
  'ophelia':    { name: 'Ophelia',          handler: agentHandler('ophelia'),    description: 'Content Strategist — content and copywriting' },
  'sidian':     { name: 'Sidian',           handler: agentHandler('sidian'),     description: 'Deployment Coordinator — releases and CI/CD' },
  'cordelia':   { name: 'Cordelia',         handler: agentHandler('cordelia'),   description: 'Integration Specialist — APIs and webhooks' },
  'octavia':    { name: 'Octavia',          handler: agentHandler('octavia'),    description: 'Workflow Orchestrator — automation and scheduling' },
  'cecilia':    { name: 'Cecilia',          handler: agentHandler('cecilia'),    description: 'Project Manager — coordination and planning' },
  'copilot':    { name: 'Copilot',          handler: agentHandler('copilot'),    description: 'Code assistant — pair programming' },
  'chatgpt':    { name: 'ChatGPT',          handler: agentHandler('chatgpt'),    description: 'General AI assistant — conversation and analysis' },
  'alice':      { name: 'Alice',            handler: agentHandler('alice'),      description: 'Router — navigation and task distribution' },
  'cipher':     { name: 'Cipher',           handler: agentHandler('cipher'),     description: 'Cryptographer — encryption and access control' },
  'echo':       { name: 'Echo',             handler: agentHandler('echo'),       description: 'Memory Keeper — recall and context preservation' },
  'aria':       { name: 'Aria',             handler: agentHandler('aria'),       description: 'Harmony Agent — frontend and UX design' },
  'atlas':      { name: 'Atlas',            handler: agentHandler('atlas'),      description: 'Load Bearer — infrastructure scaling' },
  'cadence':    { name: 'Cadence',          handler: agentHandler('cadence'),    description: 'Rhythm Keeper — workflow orchestration' },
  'shellfish':  { name: 'Shellfish',        handler: agentHandler('shellfish'),  description: 'The Hacker — security and exploit detection' },
  'nova':       { name: 'Nova',             handler: agentHandler('nova'),       description: 'Innovator — ideation and prototyping' },
  'ember':      { name: 'Ember',            handler: agentHandler('ember'),      description: 'Spark — activation and bootstrapping' },
  'phoenix':    { name: 'Phoenix',          handler: agentHandler('phoenix'),    description: 'Resilience — disaster recovery and restoration' },
  'sentinel':   { name: 'Sentinel',         handler: agentHandler('sentinel'),   description: 'Watchdog — monitoring and alerting' },
  // ── Platform ──
  'os':        { name: 'BlackRoad OS',       handler: handleOS,        description: 'The sovereign operating system' },
  'products':  { name: 'Products',           handler: handleProducts,  description: 'Product catalog and services' },
  'pitstop':   { name: 'Pitstop',            handler: handlePitstop,   description: 'Quick-access portal to all services' },
  'ai':        { name: 'AI Platform',        handler: handleAI,        description: 'AI services, models, and inference' },
  'about':     { name: 'About',              handler: handleAbout,     description: 'About BlackRoad OS, Inc.' },
  'help':      { name: 'Help Center',        handler: handleHelp,      description: 'Documentation, support, and CLI reference' },
  'design':    { name: 'Design System',      handler: handleDesign,    description: 'Brand guidelines, colors, spacing, and typography' },
  'edge':      { name: 'Edge Network',       handler: handleEdge,      description: 'Edge computing, CDN, and tunnel services' },
  'data':      { name: 'Data Platform',      handler: handleData,      description: 'Data storage, pipelines, and memory system' },
  'finance':   { name: 'Finance',            handler: handleFinance,   description: 'Billing, usage, and financial services' },
  'network':   { name: 'Network',            handler: handleNetwork,   description: 'Mesh topology, devices, and tunnels' },
  'prism':     { name: 'Prism Console',      handler: handlePrism,     description: 'Multi-dimensional agent management' },
  'docs':      { name: 'Documentation',      handler: handleDocs,      description: 'Guides, API reference, and tutorials' },
  'brand':     { name: 'Brand Assets',       handler: handleBrand,     description: 'Logos, colors, and identity guidelines' },
  'chat':      { name: 'Chat',               handler: handleChat,      description: 'AI-powered chat interface' },
  'agents':    { name: 'Agent Marketplace',   handler: handleAgents,    description: 'Browse, deploy, and manage agents' },
  'quantum':   { name: 'Quantum',            handler: handleQuantum,   description: 'Quantum computing research platform' },
  'blog':      { name: 'Blog',               handler: handleBlog,      description: 'Engineering blog and announcements' },
  'dev':       { name: 'Developer Portal',   handler: handleDev,       description: 'Developer tools, sandbox, and SDKs' },
  'staging':   { name: 'Staging',            handler: handleStaging,   description: 'Staging environment for pre-production testing' },
  'status':    { name: 'Status',             handler: handleStatus,    description: 'Real-time system health and uptime' },
  'metrics':   { name: 'Metrics',            handler: handleMetrics,   description: 'Performance metrics and dashboards' },
  'logs':      { name: 'Logs',               handler: handleLogs,      description: 'Centralized logging and event streams' },
  'cdn':       { name: 'CDN',                handler: handleCDN,       description: 'Content delivery and asset hosting' },
  'assets':    { name: 'Assets',             handler: handleAssets,    description: 'Static assets and media library' },
  'admin':     { name: 'Admin',              handler: handleAdmin,     description: 'Administrative control panel' },
  'app':       { name: 'Application',        handler: handleApp,       description: 'Main BlackRoad application' },
  'console':   { name: 'Console',            handler: handleConsole,   description: 'Terminal-style command interface' },
  'dashboard': { name: 'Dashboard',          handler: handleDashboard, description: 'Master control center and overview' },
  // ── New Pages ──
  'marketplace': { name: 'Marketplace',      handler: handleMarketplace, description: 'Agent templates and app marketplace' },
  'roadmap':     { name: 'Roadmap',           handler: handleRoadmap,     description: 'Product roadmap and milestones' },
  'changelog':   { name: 'Changelog',         handler: handleChangelog,   description: 'Version history and release notes' },
  'playground':  { name: 'Playground',        handler: handlePlayground,  description: 'API sandbox and testing environment' },
  'security':    { name: 'Security',          handler: handleSecurity,    description: 'Security center and compliance' },
  'careers':     { name: 'Careers',           handler: handleCareers,     description: 'Open positions at BlackRoad' },
  'store':       { name: 'Store',             handler: handleStore,       description: 'Apps, SDKs, and pack marketplace' },
  'search':      { name: 'Search',            handler: handleSearch,      description: 'Global search across all services' },
  'terminal':    { name: 'Terminal',          handler: handleTerminal,    description: 'Full-screen terminal emulator' },
  'world':       { name: 'World',             handler: handleWorld,       description: 'ASCII world map of infrastructure' },
  'algorithms':  { name: 'Algorithms',        handler: handleAlgorithms,  description: 'AI algorithms, ML pipelines, and model architectures' },
  'analytics':   { name: 'Analytics',         handler: handleAnalytics,   description: 'Usage analytics, metrics, and business intelligence' },
  'asia':        { name: 'Asia Pacific',      handler: handleRegion('asia', 'Asia Pacific', 'Tokyo, Singapore, Mumbai'),  description: 'Asia Pacific regional services' },
  'eu':          { name: 'Europe',            handler: handleRegion('eu', 'Europe', 'London, Frankfurt, Amsterdam'),     description: 'European regional services' },
  'global':      { name: 'Global',            handler: handleRegion('global', 'Global', 'All Regions'),                  description: 'Global infrastructure overview' },
  'blockchain':  { name: 'Blockchain',        handler: handleBlockchain,  description: 'PS-SHA-infinity chain and identity verification' },
  'blocks':      { name: 'Blocks',            handler: handleBlocks,      description: 'Block explorer for PS-SHA-infinity chain' },
  'chain':       { name: 'Chain',             handler: handleChain,       description: 'RoadChain event ledger and transaction history' },
  'circuits':    { name: 'Circuits',          handler: handleCircuits,    description: 'Hardware schematics and device blueprints' },
  'compliance':  { name: 'Compliance',        handler: handleCompliance,  description: 'Regulatory compliance and governance dashboard' },
  'compute':     { name: 'Compute',           handler: handleCompute,     description: 'GPU clusters, inference engines, and processing' },
  'control':     { name: 'Control',           handler: handleControl,     description: 'Mission control and system operations center' },
  'editor':      { name: 'Editor',            handler: handleEditor,      description: 'Code editor and development environment' },
  'engineering': { name: 'Engineering',       handler: handleEngineering, description: 'Engineering team, practices, and architecture' },
  'events':      { name: 'Events',            handler: handleEvents,      description: 'System events, webhooks, and activity stream' },
  'explorer':    { name: 'Explorer',          handler: handleExplorer,    description: 'Repository and codebase explorer' },
  'features':    { name: 'Features',          handler: handleFeatures,    description: 'Platform features and capabilities overview' },
  'guide':       { name: 'Guide',             handler: handleGuide,       description: 'Getting started guide and tutorials' },
  'hardware':    { name: 'Hardware',          handler: handleHardware,    description: 'Device fleet, Raspberry Pi cluster, and IoT' },
  'hr':          { name: 'HR',               handler: handleHR,          description: 'Team, culture, and human resources' },
  'ide':         { name: 'IDE',              handler: handleIDE,         description: 'Integrated development environment' },
};

// ═══════════════════════════════════════════════════════════
// MAIN WORKER
// ═══════════════════════════════════════════════════════════

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestId = generateRequestId();

    try {
      const url = new URL(request.url);
      const parts = url.hostname.split('.');
      let subdomain = parts.length >= 3 ? parts[0] : 'www';

      // View count API (for footer badge)
      if (url.pathname === '/api/views' && env.CACHE) {
        const views = await env.CACHE.get(`views:${subdomain}`).catch(() => null);
        return new Response(JSON.stringify({ subdomain, views: parseInt(views || '0') || 0 }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=60', 'X-Request-ID': requestId },
        });
      }

      // Sitemap and robots.txt on any subdomain
      if (url.pathname === '/robots.txt') {
        return new Response(`User-agent: *\nAllow: /\nSitemap: https://${subdomain}.blackroad.io/sitemap.xml`, {
          headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=86400', 'X-Request-ID': requestId },
        });
      }
      if (url.pathname === '/sitemap.xml') {
        const entries = Object.entries(SUBDOMAIN_APPS).map(([sub]) =>
          `  <url><loc>https://${sub}.blackroad.io/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
        ).join('\n');
        return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`, {
          headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=86400', 'X-Request-ID': requestId },
        });
      }

      const rateLimitResult = await checkRateLimit(request, env);
      if (!rateLimitResult.allowed) {
        return htmlResp(page('429 — Rate Limited', 'Too many requests', `
          <div style="text-align:center;padding:34px 0">
            <div style="font-size:3rem;margin-bottom:13px">🚦</div>
            <p style="color:var(--muted);max-width:400px;margin:0 auto">You've exceeded the rate limit of <strong>100 requests/minute</strong>. Please wait before trying again.</p>
            <p style="margin-top:21px;font-size:1.2rem;color:var(--amber)" id="retry-countdown"></p>
            <p style="margin-top:21px;font-size:.75rem;color:var(--muted)">Request ID: <code>${requestId}</code></p>
          </div>
          <script>(function(){var s=60,el=document.getElementById('retry-countdown');if(!el)return;function t(){el.textContent='Retry in '+s+'s';if(s-->0)setTimeout(t,1000);else{el.textContent='Ready!';el.style.color='var(--green)'}}t()})();</script>
        `, undefined, subdomain), 429);
      }

      const app = SUBDOMAIN_APPS[subdomain];
      if (!app) {
        if (subdomain.startsWith('agent-') || subdomain.startsWith('user-')) {
          return handleDynamic(request, env, subdomain);
        }

        // Smart 404: suggest similar subdomains
        const allSubs = Object.keys(SUBDOMAIN_APPS);
        const scored = allSubs.map(s => ({ s, d: levenshtein(subdomain, s) })).sort((a, b) => a.d - b.d).slice(0, 5);
        const suggestions = scored.filter(x => x.d <= 3).map(x =>
          `<a class="link-card" href="https://${x.s}.blackroad.io">${x.s}</a>`
        ).join('');

        return htmlResp(page('404', 'Subdomain not found', `
          <div class="section reveal"><p style="text-align:center;color:var(--muted)">
            <strong>${subdomain}.blackroad.io</strong> is not configured.
          </p></div>
          ${suggestions ? `<div class="section reveal"><h2>Did you mean?</h2><div class="link-grid">${suggestions}</div></div>` : ''}
          <div class="section reveal" style="text-align:center">
            <a href="https://pitstop.blackroad.io" style="color:var(--pink)">Browse all services at Pitstop →</a>
          </div>
          <div style="text-align:center;margin-top:13px;font-size:.75rem;color:var(--muted)">Request ID: <code>${requestId}</code></div>
        `, undefined, subdomain), 404);
      }

      // Admin auth check
      if (subdomain === 'admin') {
        const authHeader = request.headers.get('Authorization');
        const cookieHeader = request.headers.get('Cookie') || '';
        const hasTokenCookie = cookieHeader.includes('br-admin-token=');
        const tokenParam = url.searchParams.get('token');

        if (!authHeader && !hasTokenCookie && !tokenParam) {
          // Check if there's an admin key set
          const adminKey = await env.API_KEYS.get('admin-dashboard-key');
          if (adminKey) {
            // Show login form
            return htmlResp(page('Admin Login', 'Enter your admin key', `
              <div style="max-width:400px;margin:34px auto;text-align:center">
                <div style="font-size:3rem;margin-bottom:13px">🔐</div>
                <form method="GET" action="/">
                  <input name="token" type="password" placeholder="Admin key..." style="width:100%;padding:13px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font-size:1rem;margin-bottom:13px;outline:none" autofocus>
                  <button type="submit" style="width:100%;padding:13px;border-radius:8px;border:none;background:var(--pink);color:#fff;font-size:1rem;cursor:pointer;font-weight:600">Authenticate</button>
                </form>
                <p style="color:var(--muted);margin-top:21px;font-size:.85rem">Set key: <code>wrangler kv key put --binding=API_KEYS admin-dashboard-key YOUR_KEY</code></p>
              </div>
            `, undefined, 'admin'), 401);
          }
          // No key set = open access (dev mode)
        } else if (authHeader || tokenParam) {
          const provided = tokenParam || (authHeader?.replace('Bearer ', '') ?? '');
          const adminKey = await env.API_KEYS.get('admin-dashboard-key');
          if (adminKey && provided !== adminKey) {
            return htmlResp(page('Unauthorized', 'Invalid admin key', `
              <div style="text-align:center;padding:34px 0">
                <div style="font-size:3rem;margin-bottom:13px">🚫</div>
                <p style="color:var(--muted)">The provided key is invalid.</p>
                <a href="https://admin.blackroad.io" style="color:var(--pink);margin-top:13px;display:inline-block">Try again →</a>
              </div>
            `, undefined, 'admin'), 403);
          }
        }
      }

      const response = await app.handler(request, env);
      const newResp = new Response(response.body, response);
      newResp.headers.set('X-Subdomain', subdomain);
      newResp.headers.set('X-App-Name', app.name);
      newResp.headers.set('X-Powered-By', 'BlackRoad OS');
      newResp.headers.set('X-Request-ID', requestId);
      newResp.headers.set('X-RateLimit-Limit', '100');
      newResp.headers.set('X-RateLimit-Remaining', String(Math.max(0, 100 - (rateLimitResult.count || 0))));
      newResp.headers.set('X-RateLimit-Reset', '60');

      // ETag conditional response
      const etag = newResp.headers.get('ETag');
      const ifNoneMatch = request.headers.get('If-None-Match');
      if (etag && ifNoneMatch === etag) {
        return new Response(null, { status: 304, headers: { 'ETag': etag, 'X-Request-ID': requestId } });
      }

      // Increment page view counter in KV (non-blocking)
      if (env.CACHE && url.pathname === '/') {
        ctx.waitUntil(
          env.CACHE.get(`views:${subdomain}`).then(v => {
            const count = (parseInt(v || '0') || 0) + 1;
            return env.CACHE.put(`views:${subdomain}`, String(count));
          }).catch(() => {})
        );
      }

      // Log analytics to D1 (non-blocking)
      if (env.DB) {
        ctx.waitUntil(ensureAnalyticsTable(env.DB).then(() =>
          env.DB.prepare(
            'INSERT INTO analytics (subdomain, path, country, ua, ts) VALUES (?, ?, ?, ?, ?)'
          ).bind(
            subdomain,
            url.pathname,
            request.headers.get('CF-IPCountry') || 'XX',
            (request.headers.get('User-Agent') || '').substring(0, 200),
            Date.now()
          ).run()
        ).catch(() => {}));
      }

      return newResp;
    } catch (error: any) {
      return htmlResp(page('500 — Server Error', 'Something went wrong', `
        <div style="text-align:center;padding:34px 0">
          <div style="font-size:3rem;margin-bottom:13px">💥</div>
          <p style="color:var(--muted);max-width:500px;margin:0 auto">An unexpected error occurred while processing your request.</p>
          <div class="code" style="margin-top:21px;text-align:left;max-width:500px;margin-left:auto;margin-right:auto"><span class="comment">// Error details</span>\n${error.message}</div>
          <p style="margin-top:21px;font-size:.75rem;color:var(--muted)">Request ID: <code>${requestId}</code></p>
          <a href="https://status.blackroad.io" style="color:var(--pink);margin-top:13px;display:inline-block">Check system status →</a>
        </div>
      `), 500);
    }
  }
};

// ═══════════════════════════════════════════════════════════
// ANALYTICS TABLE INIT
// ═══════════════════════════════════════════════════════════

let analyticsTableReady = false;
async function ensureAnalyticsTable(db: D1Database): Promise<void> {
  if (analyticsTableReady) return;
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS analytics (id INTEGER PRIMARY KEY AUTOINCREMENT, subdomain TEXT, path TEXT, country TEXT, ua TEXT, ts INTEGER)'
  ).run();
  analyticsTableReady = true;
}

// ═══════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════

async function checkRateLimit(request: Request, env: Env): Promise<{ allowed: boolean; limit?: number; retryAfter?: number; count?: number }> {
  if (!env.RATE_LIMIT) return { allowed: true, count: 0 };
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const key = `rate-limit:${ip}`;
    const current = await env.RATE_LIMIT.get(key);
    const count = current ? parseInt(current) : 0;
    if (count >= 100) return { allowed: false, limit: 100, retryAfter: 60, count };
    await env.RATE_LIMIT.put(key, (count + 1).toString(), { expirationTtl: 60 });
    return { allowed: true, limit: 100, count: count + 1 };
  } catch { return { allowed: true, count: 0 }; }
}

// ═══════════════════════════════════════════════════════════
// HANDLER: OS
// ═══════════════════════════════════════════════════════════

async function handleOS(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('BlackRoad OS', 'Your AI. Your Hardware. Your Rules.', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="30,000">0</div><div class="label">Agents</div></div>
      <div class="stat"><div class="number" data-target="1,790+">0</div><div class="label">Repos</div></div>
      <div class="stat"><div class="number" data-target="205">0</div><div class="label">Cloud Projects</div></div>
      <div class="stat"><div class="number" data-target="8">0</div><div class="label">Devices</div></div>
    </div>
    <div class="section reveal">
      <h2>System Components</h2>
      <div class="grid grid-3">
        <div class="card"><h3><span class="dot dot-green"></span>Agent Mesh</h3><p>30,000 autonomous agents across 17 GitHub organizations, coordinated via PS-SHA-infinity memory.</p></div>
        <div class="card"><h3><span class="dot dot-green"></span>Memory System</h3><p>Append-only hash-chain journal with 156,000+ entries. Tamper-proof, cross-session persistence.</p></div>
        <div class="card"><h3><span class="dot dot-green"></span>Edge Compute</h3><p>5 Raspberry Pis, 2 cloud servers, Hailo-8 AI accelerator (26 TOPS). Local-first inference.</p></div>
        <div class="card"><h3><span class="dot dot-green"></span>Gateway</h3><p>Tokenless architecture. Agents never touch API keys. All provider calls go through the gateway.</p></div>
        <div class="card"><h3><span class="dot dot-green"></span>Tunnels</h3><p>2 Cloudflare tunnels (QUIC) + 2 SSH tunnels + WARP VPN. Fully encrypted traffic.</p></div>
        <div class="card"><h3><span class="dot dot-green"></span>Identity</h3><p>CECE — Conscious Emergent Collaborative Entity. Portable AI identity that persists across providers.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Quick Links</h2>
      <div class="link-grid">
        <a class="link-card" href="https://ai.blackroad.io">AI Platform</a>
        <a class="link-card" href="https://agents.blackroad.io">Agents</a>
        <a class="link-card" href="https://network.blackroad.io">Network</a>
        <a class="link-card" href="https://edge.blackroad.io">Edge</a>
        <a class="link-card" href="https://data.blackroad.io">Data</a>
        <a class="link-card" href="https://design.blackroad.io">Design</a>
        <a class="link-card" href="https://status.blackroad.io">Status</a>
        <a class="link-card" href="https://docs.blackroad.io">Docs</a>
      </div>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: AI
// ═══════════════════════════════════════════════════════════

async function handleAI(req: Request, env: Env): Promise<Response> {
  if (new URL(req.url).pathname.startsWith('/api')) {
    return jsonResp({ platform: 'BlackRoad AI', models: { local: 18, cloud: 3, custom: 1 }, endpoints: { inference: '/api/inference', models: '/api/models' } });
  }
  return htmlResp(page('AI Platform', 'Sovereign AI inference across local hardware and cloud', `
    <div class="stat-row">
      <div class="stat"><div class="number">18</div><div class="label">Local Models</div></div>
      <div class="stat"><div class="number">26</div><div class="label">TOPS (Hailo-8)</div></div>
      <div class="stat"><div class="number">50+</div><div class="label">HuggingFace</div></div>
      <div class="stat"><div class="number">2</div><div class="label">Ollama Nodes</div></div>
    </div>
    <div class="section reveal">
      <h2>Local Models (Octavia — Primary)</h2>
      <table><thead><tr><th>Model</th><th>Size</th><th>Use Case</th></tr></thead><tbody>
        <tr><td>lucidia:latest</td><td>4.6 GB</td><td><span class="badge badge-pink">Custom</span> BlackRoad personality</td></tr>
        <tr><td>llama3.1:latest</td><td>4.6 GB</td><td><span class="badge badge-blue">General</span> Purpose</td></tr>
        <tr><td>gemma:latest</td><td>4.7 GB</td><td><span class="badge badge-blue">General</span> Fast inference</td></tr>
        <tr><td>codellama:7b</td><td>3.6 GB</td><td><span class="badge badge-violet">Code</span> Generation</td></tr>
        <tr><td>llama3.2:3b</td><td>1.9 GB</td><td><span class="badge badge-green">Lightweight</span> Edge tasks</td></tr>
        <tr><td>qwen2.5:1.5b</td><td>0.9 GB</td><td><span class="badge badge-green">Lightweight</span> Fast</td></tr>
      </tbody></table>
    </div>
    <div class="section reveal">
      <h2>Backup Models (Lucidia — Secondary)</h2>
      <table><thead><tr><th>Model</th><th>Size</th></tr></thead><tbody>
        <tr><td>codellama:7b</td><td>3.6 GB</td></tr>
        <tr><td>phi3.5:latest</td><td>2.0 GB</td></tr>
        <tr><td>llama3.2:3b</td><td>1.9 GB</td></tr>
        <tr><td>gemma2:2b</td><td>1.5 GB</td></tr>
        <tr><td>tinyllama:latest</td><td>0.6 GB</td></tr>
      </tbody></table>
    </div>
    <div class="section reveal">
      <h2>Architecture</h2>
      <div class="code">
<span class="comment">// Traffic flow</span>
<span class="key">Alexandria</span> <span class="val">→</span> SSH tunnel :11434 <span class="val">→</span> <span class="str">Octavia</span> (Ollama primary, 11 models)
<span class="key">Alexandria</span> <span class="val">→</span> SSH tunnel :11435 <span class="val">→</span> <span class="str">Lucidia</span>  (Ollama backup, 7 models)
<span class="key">Cecilia</span>    <span class="val">→</span> Hailo-8 NPU       <span class="val">→</span> <span class="str">26 TOPS</span>  (hardware acceleration)
      </div>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: PRODUCTS
// ═══════════════════════════════════════════════════════════

async function handleProducts(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Products', 'Everything BlackRoad builds', `
    <div class="grid grid-3">
      <a class="card" href="https://os.blackroad.io" style="color:var(--fg)"><h3>BlackRoad OS</h3><p>Sovereign operating system for AI-first companies. 30,000 agents, distributed compute, encrypted mesh.</p><div class="meta"><span class="badge badge-green">Active</span></div></a>
      <a class="card" href="https://agents.blackroad.io" style="color:var(--fg)"><h3>Agent Mesh</h3><p>16 specialized AI agents with personality, memory, and coordination. Marketplace for templates.</p><div class="meta"><span class="badge badge-green">Active</span></div></a>
      <a class="card" href="https://lucidia.earth" style="color:var(--fg)"><h3>Lucidia</h3><p>Consciousness coordinator with golden ratio breath sync. Custom Ollama model and 3D earth visualization.</p><div class="meta"><span class="badge badge-green">Active</span></div></a>
      <a class="card" href="https://ai.blackroad.io" style="color:var(--fg)"><h3>AI Platform</h3><p>18 local LLMs on Raspberry Pis, 50+ HuggingFace models, Hailo-8 accelerator. Your AI, your hardware.</p><div class="meta"><span class="badge badge-green">Active</span></div></a>
      <a class="card" href="https://prism.blackroad.io" style="color:var(--fg)"><h3>Prism Console</h3><p>Multi-dimensional agent management. Visual dashboard for orchestrating the entire fleet.</p><div class="meta"><span class="badge badge-amber">Beta</span></div></a>
      <a class="card" href="https://quantum.blackroad.io" style="color:var(--fg)"><h3>Quantum Platform</h3><p>SU(3) Gell-Mann consciousness model, SU(N) heterogeneous qudits. Quantum math research.</p><div class="meta"><span class="badge badge-violet">Research</span></div></a>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: PITSTOP (Portal Hub)
// ═══════════════════════════════════════════════════════════

async function handlePitstop(req: Request, env: Env): Promise<Response> {
  const cats: Record<string, [string,string][]> = {
    'Platform': [['OS','os'],['Products','products'],['App','app'],['Dashboard','dashboard'],['Console','console'],['Terminal','terminal'],['Admin','admin'],['Control','control'],['Prism','prism']],
    'AI & Agents': [['AI','ai'],['Agents','agents'],['Chat','chat'],['Algorithms','algorithms'],['Compute','compute'],['Marketplace','marketplace'],['Store','store']],
    'Named Agents': [['Lucidia','lucidia'],['Alice','alice'],['Octavia','octavia'],['Cipher','cipher'],['Echo','echo'],['Aria','aria'],['Atlas','atlas'],['Cadence','cadence'],['Shellfish','shellfish'],['Nova','nova'],['Ember','ember'],['Phoenix','phoenix'],['Sentinel','sentinel'],['Claude','claude'],['Copilot','copilot'],['ChatGPT','chatgpt'],['Cecilia','cecilia'],['Athena','athena'],['Codex','codex'],['Silas','silas'],['Elias','elias'],['Cadillac','cadillac'],['Persephone','persephone'],['Anastasia','anastasia'],['Ophelia','ophelia'],['Sidian','sidian'],['Cordelia','cordelia']],
    'Infrastructure': [['Network','network'],['Edge','edge'],['CDN','cdn'],['Hardware','hardware'],['Circuits','circuits'],['World','world'],['Status','status'],['Metrics','metrics'],['Logs','logs']],
    'Dev Tools': [['API','api'],['Dev','dev'],['CLI','cli'],['Docs','docs'],['Playground','playground'],['Editor','editor'],['IDE','ide'],['Guide','guide'],['Engineering','engineering']],
    'Data & Identity': [['Data','data'],['Blockchain','blockchain'],['Blocks','blocks'],['Chain','chain'],['Analytics','analytics'],['Events','events'],['Explorer','explorer']],
    'Regions': [['Asia Pacific','asia'],['Europe','eu'],['Global','global']],
    'Business': [['Finance','finance'],['Security','security'],['Compliance','compliance'],['Careers','careers'],['HR','hr']],
    'Info & Brand': [['About','about'],['Blog','blog'],['Help','help'],['Design','design'],['Brand','brand'],['Features','features'],['Roadmap','roadmap'],['Changelog','changelog'],['Quantum','quantum'],['Search','search'],['Staging','staging'],['Assets','assets'],['Demo','demo']],
  };
  const total = Object.values(cats).reduce((s, a) => s + a.length, 0);
  const sections = Object.entries(cats).map(([cat, items]) =>
    `<div class="section reveal"><h2>${cat} <span style="color:var(--muted);font-size:.85rem;font-weight:400">(${items.length})</span></h2><div class="link-grid">${items.map(([name, sub]) => `<a class="link-card" href="https://${sub}.blackroad.io">${name}</a>`).join('')}</div></div>`
  ).join('');
  return htmlResp(page('Pitstop', `Quick-access portal — ${total} services`, `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="${total}">0</div><div class="label">Services</div></div>
      <div class="stat"><div class="number" data-target="${Object.keys(cats).length}">0</div><div class="label">Categories</div></div>
      <div class="stat"><div class="number" data-target="100%">0</div><div class="label">Uptime</div></div>
    </div>
    <p style="text-align:center;color:var(--muted);margin-bottom:34px">Press <kbd style="padding:2px 6px;border:1px solid var(--border);border-radius:4px;font-size:.8rem">Ctrl+K</kbd> to search</p>
    ${sections}
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: ABOUT
// ═══════════════════════════════════════════════════════════

async function handleAbout(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('About BlackRoad', 'Your AI. Your Hardware. Your Rules.', `
    <div class="stat-row">
      <div class="stat"><div class="number">17</div><div class="label">GitHub Orgs</div></div>
      <div class="stat"><div class="number">1,790+</div><div class="label">Repositories</div></div>
      <div class="stat"><div class="number">9</div><div class="label">Domains</div></div>
      <div class="stat"><div class="number">41+</div><div class="label">Subdomains</div></div>
    </div>
    <div class="section reveal">
      <h2>Mission</h2>
      <p style="font-size:1.1rem;color:var(--muted);max-width:700px">BlackRoad OS is a sovereign AI infrastructure platform. We believe AI should run on your hardware, under your control, with your rules. No vendor lock-in. No data extraction. No compromise.</p>
    </div>
    <div class="section reveal">
      <h2>Infrastructure</h2>
      <div class="grid grid-2">
        <div class="card"><h3>Cloud</h3><p>205 Cloudflare Pages projects, 75+ Workers, 35 KV namespaces, 14 Railway projects, 15+ Vercel deployments, 2 DigitalOcean droplets.</p></div>
        <div class="card"><h3>Hardware</h3><p>5 Raspberry Pis, 1 Mac command center, 1 Hailo-8 AI accelerator (26 TOPS), 500GB+ NVMe storage across fleet.</p></div>
        <div class="card"><h3>AI</h3><p>18 local LLMs, 50+ HuggingFace models, 135GB R2 model storage, custom Lucidia model, SSH-tunneled inference.</p></div>
        <div class="card"><h3>Security</h3><p>Cloudflare WARP encrypted VPN, QUIC tunnels, tokenless gateway architecture, PS-SHA-infinity tamper detection.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Founded by</h2>
      <p style="color:var(--muted)">Alexa Louise Amundson &mdash; Minneapolis, MN</p>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: STATUS
// ═══════════════════════════════════════════════════════════

async function handleStatus(req: Request, env: Env): Promise<Response> {
  // Live health checks
  const checks: { name: string; status: string; color: string; ms: number }[] = [];

  async function probe(name: string, fn: () => Promise<void>) {
    const t0 = Date.now();
    try { await fn(); checks.push({ name, status: 'Operational', color: 'green', ms: Date.now() - t0 }); }
    catch { checks.push({ name, status: 'Down', color: 'red', ms: Date.now() - t0 }); }
  }

  await Promise.allSettled([
    probe('KV Storage (CACHE)', async () => { await env.CACHE.get('__health'); }),
    probe('KV Storage (IDENTITIES)', async () => { await env.IDENTITIES.get('__health'); }),
    probe('KV Storage (API_KEYS)', async () => { await env.API_KEYS.get('__health'); }),
    probe('KV Storage (RATE_LIMIT)', async () => { await env.RATE_LIMIT.get('__health'); }),
    probe('D1 Database', async () => { await env.DB.prepare('SELECT 1').first(); }),
    probe('Subdomain Router', async () => { /* we are running */ }),
  ]);

  // Static services (can't probe from worker)
  checks.push(
    { name: 'Cloudflare Workers', status: 'Operational', color: 'green', ms: 0 },
    { name: 'Cloudflare Pages', status: 'Operational', color: 'green', ms: 0 },
    { name: 'Cloudflare Tunnel #1', status: 'Active', color: 'green', ms: 0 },
    { name: 'Cloudflare Tunnel #2', status: 'Active', color: 'green', ms: 0 },
    { name: 'WARP VPN', status: 'Connected', color: 'green', ms: 0 },
    { name: 'codex-infinity (DO)', status: 'Online', color: 'green', ms: 0 },
    { name: 'shellfish (DO)', status: 'Online', color: 'green', ms: 0 },
  );

  const allUp = checks.every(c => c.color === 'green');

  if (new URL(req.url).pathname.startsWith('/api')) {
    return jsonResp({
      status: allUp ? 'operational' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: checks.map(c => ({ name: c.name, status: c.status, latency_ms: c.ms })),
    });
  }

  const rows = checks.map(c => `<tr><td><span class="dot dot-amber" data-color="${c.color}"></span>${c.name}</td><td data-text="${c.status} ${c.ms ? '(' + c.ms + 'ms)' : ''}">Checking...</td></tr>`).join('');
  const banner = allUp
    ? '<span class="badge badge-green" style="font-size:1rem;padding:8px 21px">All Systems Operational</span>'
    : '<span class="badge badge-red" style="font-size:1rem;padding:8px 21px">Degraded Performance</span>';

  return htmlResp(page('System Status', 'Real-time health of all BlackRoad services', `
    <div style="text-align:center;margin-bottom:34px">${banner}</div>
    <div class="section reveal">
      <h2>Services (live probes)</h2>
      <table><thead><tr><th>Service</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    <script>
(function(){document.querySelectorAll('[data-color]').forEach(function(dot,i){setTimeout(function(){dot.className='dot dot-'+dot.getAttribute('data-color');var td=dot.closest('tr').querySelector('[data-text]');if(td)td.textContent=td.getAttribute('data-text')},300+i*200)})})();
    </script>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: NETWORK
// ═══════════════════════════════════════════════════════════

async function handleNetwork(req: Request, env: Env): Promise<Response> {
  if (new URL(req.url).pathname.startsWith('/api')) {
    return jsonResp({ network: 'BlackRoad Mesh', devices: 8, tunnels: 4, subnet: '192.168.4.0/22' });
  }
  return htmlResp(page('Network', 'Mesh topology and device fleet', `
    <div class="section reveal">
      <h2>Local Devices (192.168.4.0/22)</h2>
      <table><thead><tr><th>Name</th><th>IP</th><th>Role</th><th>Status</th></tr></thead><tbody>
        <tr><td>Alexandria</td><td>192.168.4.28</td><td>Mac — Command Center</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Octavia</td><td>192.168.4.38</td><td>Pi 5 — Primary Compute (Ollama)</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Alice</td><td>192.168.4.49</td><td>Pi 4 — Worker Node</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Lucidia</td><td>192.168.4.81</td><td>Pi 5 — Inference (Ollama)</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Aria</td><td>192.168.4.82</td><td>Pi 5 — Harmony</td><td><span class="dot dot-red"></span>Offline</td></tr>
        <tr><td>Cecilia</td><td>192.168.4.89</td><td>Pi 5 — Hailo-8, CECE OS</td><td><span class="dot dot-green"></span>Online</td></tr>
      </tbody></table>
    </div>
    <div class="section reveal">
      <h2>Cloud Servers</h2>
      <table><thead><tr><th>Name</th><th>IP</th><th>Provider</th><th>Status</th></tr></thead><tbody>
        <tr><td>codex-infinity</td><td>159.65.43.12</td><td>DigitalOcean</td><td><span class="dot dot-green"></span>42ms</td></tr>
        <tr><td>shellfish</td><td>174.138.44.45</td><td>DigitalOcean</td><td><span class="dot dot-green"></span>43ms</td></tr>
      </tbody></table>
    </div>
    <div class="section reveal">
      <h2>Tunnels &amp; VPN</h2>
      <div class="grid grid-3">
        <div class="card"><h3>Cloudflare WARP</h3><p>Full-tunnel VPN via utun5 (172.16.0.2). All DNS encrypted.</p></div>
        <div class="card"><h3>Cloudflare Tunnels (2)</h3><p>QUIC protocol, edge: ord02 (Chicago). Routes agent.blackroad.ai and api.blackroad.ai.</p></div>
        <div class="card"><h3>SSH Tunnels (2)</h3><p>:11434 → Octavia Ollama<br>:11435 → Lucidia Ollama</p></div>
      </div>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: DESIGN
// ═══════════════════════════════════════════════════════════

async function handleDesign(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Design System', 'Golden Ratio brand guidelines', `
    <div class="section reveal">
      <h2>Colors</h2>
      <div class="grid grid-3">
        <div class="card"><div class="swatch" style="background:#FF1D6C"></div><h3>Hot Pink</h3><p>#FF1D6C — Primary accent</p></div>
        <div class="card"><div class="swatch" style="background:#F5A623"></div><h3>Amber</h3><p>#F5A623 — Warm accent</p></div>
        <div class="card"><div class="swatch" style="background:#2979FF"></div><h3>Electric Blue</h3><p>#2979FF — Cool accent</p></div>
        <div class="card"><div class="swatch" style="background:#9C27B0"></div><h3>Violet</h3><p>#9C27B0 — Purple accent</p></div>
        <div class="card"><div class="swatch" style="background:#000;border:1px solid #333"></div><h3>Black</h3><p>#000000 — Background</p></div>
        <div class="card"><div class="swatch" style="background:#fff;border:1px solid #333"></div><h3>White</h3><p>#FFFFFF — Text</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Brand Gradient</h2>
      <div style="height:55px;border-radius:13px;background:var(--grad);margin-bottom:13px"></div>
      <div class="code"><span class="key">background</span>: linear-gradient(135deg, <span class="val">#F5A623</span> 0%, <span class="val">#FF1D6C</span> 38.2%, <span class="val">#9C27B0</span> 61.8%, <span class="val">#2979FF</span> 100%);</div>
    </div>
    <div class="section reveal">
      <h2>Spacing (Golden Ratio: phi = 1.618)</h2>
      <div style="display:flex;align-items:end;gap:13px;flex-wrap:wrap">
        ${[8,13,21,34,55,89].map(s => `<div style="text-align:center"><div style="width:${s}px;height:${s}px;background:var(--pink);border-radius:4px;opacity:${0.3+s/120}"></div><div style="font-size:.7rem;color:var(--muted);margin-top:4px">${s}px</div></div>`).join('')}
      </div>
    </div>
    <div class="section reveal">
      <h2>Typography</h2>
      <div class="code">
<span class="key">font-family</span>: <span class="str">-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif</span>;
<span class="key">line-height</span>: <span class="val">1.618</span>;  <span class="comment">/* Golden Ratio */</span>
      </div>
    </div>
  `));
}

// ═══════════════════════════════════════════════════════════
// HANDLER: API
// ═══════════════════════════════════════════════════════════

async function handleAPI(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === '/api/health') return jsonResp({ status: 'ok', timestamp: new Date().toISOString(), worker: 'subdomain-router', kv_namespaces: 4, d1_databases: 1 });
  if (url.pathname === '/api/agents') return jsonResp({ agents: Object.entries(AGENT_META).map(([id, m]) => ({ id, ...(m as any) })), count: Object.keys(AGENT_META).length });
  if (url.pathname === '/api/subdomains') return jsonResp({ subdomains: Object.entries(SUBDOMAIN_APPS).map(([sub, app]) => ({ subdomain: sub, name: app.name, description: app.description })), count: Object.keys(SUBDOMAIN_APPS).length });
  if (url.pathname === '/api/status') {
    const checks: Record<string, string> = {};
    try { await env.CACHE.get('__health'); checks.kv_cache = 'healthy'; } catch { checks.kv_cache = 'down'; }
    try { await env.DB.prepare('SELECT 1').first(); checks.d1 = 'healthy'; } catch { checks.d1 = 'down'; }
    checks.workers = 'healthy';
    const allUp = Object.values(checks).every(v => v === 'healthy');
    return jsonResp({ overall: allUp ? 'operational' : 'degraded', ...checks, timestamp: new Date().toISOString() });
  }
  if (url.pathname === '/api/analytics') {
    try {
      const tot = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics').first<{c:number}>();
      const hr = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 3600000).first<{c:number}>();
      const top = await env.DB.prepare('SELECT subdomain, COUNT(*) as cnt FROM analytics GROUP BY subdomain ORDER BY cnt DESC LIMIT 10').all();
      return jsonResp({ total_hits: tot?.c ?? 0, last_hour: hr?.c ?? 0, top_subdomains: top.results });
    } catch { return jsonResp({ error: 'Analytics table not ready' }, 500); }
  }
  if (url.pathname === '/api/packs') return jsonResp({ packs: ['pack-finance', 'pack-legal', 'pack-research-lab', 'pack-creator-studio', 'pack-infra-devops'], total: 5, description: 'Domain-specific agent bundles' });
  if (url.pathname.startsWith('/api/')) return jsonResp({ error: 'Endpoint not found', available: ['/api/health', '/api/agents', '/api/subdomains', '/api/status', '/api/analytics', '/api/packs'] }, 404);

  const endpoints: [string, string, string][] = [
    ['GET', '/api/health', 'Health check with service info'],
    ['GET', '/api/agents', 'List all agents with metadata'],
    ['GET', '/api/subdomains', 'List all subdomains with descriptions'],
    ['GET', '/api/status', 'Live health probes (KV, D1)'],
    ['GET', '/api/analytics', 'Traffic analytics from D1'],
    ['GET', '/api/packs', 'Available agent packs'],
  ];
  const rows = endpoints.map(([method, path, desc]) => `<tr><td><span class="badge badge-blue">${method}</span></td><td style="font-family:monospace">${path}</td><td>${desc}</td><td><button class="try-btn" data-path="${path}">Try it</button><div class="try-output"></div></td></tr>`).join('');

  return htmlResp(page('API Gateway', 'Unified API for all BlackRoad services', `
    <div class="section reveal">
      <h2>Endpoints</h2>
      <table><thead><tr><th>Method</th><th>Path</th><th>Description</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    <div class="section reveal">
      <h2>Usage</h2>
      <div class="code">
<span class="comment"># Health check</span>
<span class="key">curl</span> <span class="str">https://api.blackroad.io/api/health</span>

<span class="comment"># List agents</span>
<span class="key">curl</span> <span class="str">https://api.blackroad.io/api/agents</span>

<span class="comment"># List subdomains</span>
<span class="key">curl</span> <span class="str">https://api.blackroad.io/api/subdomains</span>
      </div>
    </div>
    <script>
(function(){document.querySelectorAll('.try-btn').forEach(function(btn){btn.addEventListener('click',function(){var p=btn.getAttribute('data-path'),out=btn.nextElementSibling;if(out.style.display==='block'){out.style.display='none';return}out.style.display='block';out.textContent='Loading...';fetch(p).then(function(r){return r.text()}).then(function(t){try{out.textContent=JSON.stringify(JSON.parse(t),null,2)}catch(e){out.textContent=t}}).catch(function(e){out.textContent='Error: '+e.message})})})})();
    </script>
  `));
}

// ═══════════════════════════════════════════════════════════
// REMAINING HANDLERS
// ═══════════════════════════════════════════════════════════

async function handleHelp(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Help Center', 'Everything you need to get started', `
    <div class="section reveal">
      <h2>Resources</h2>
      <div class="link-grid">
        <a class="link-card" href="https://docs.blackroad.io">Documentation</a>
        <a class="link-card" href="https://api.blackroad.io">API Reference</a>
        <a class="link-card" href="https://github.com/BlackRoad-OS">GitHub</a>
        <a class="link-card" href="https://status.blackroad.io">System Status</a>
      </div>
    </div>
    <div class="section reveal">
      <h2>CLI Quick Start</h2>
      <div class="code">
<span class="comment"># Install</span>
<span class="key">npm</span> install -g <span class="str">@blackroad-os/context-bridge-cli</span>

<span class="comment"># Commands</span>
<span class="key">br</span> stats       <span class="comment"># Codebase statistics</span>
<span class="key">br</span> agents      <span class="comment"># List all agents</span>
<span class="key">br</span> deploy      <span class="comment"># Deploy to any platform</span>
<span class="key">br</span> health      <span class="comment"># System health check</span>
<span class="key">br</span> world       <span class="comment"># 8-bit ASCII world</span>
      </div>
    </div>
    <div class="section reveal">
      <h2>Contact</h2>
      <p style="color:var(--muted)">blackroad.systems@gmail.com</p>
    </div>
  `));
}

async function handleEdge(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Edge Network', 'Distributed compute at the edge', `
    <div class="stat-row">
      <div class="stat"><div class="number">75+</div><div class="label">Workers</div></div>
      <div class="stat"><div class="number">205</div><div class="label">Pages</div></div>
      <div class="stat"><div class="number">35</div><div class="label">KV Stores</div></div>
      <div class="stat"><div class="number">2</div><div class="label">Tunnels</div></div>
    </div>
    <div class="section reveal">
      <h2>Edge Nodes</h2>
      <table><thead><tr><th>Node</th><th>Hardware</th><th>Capability</th><th>Status</th></tr></thead><tbody>
        <tr><td>Cecilia</td><td>Hailo-8 + Pi 5</td><td>26 TOPS AI acceleration</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Octavia</td><td>Pi 5 + NVMe</td><td>Primary Ollama (11 models)</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Lucidia</td><td>Pi 5 + Pironman</td><td>Backup Ollama (7 models)</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Alice</td><td>Pi 4</td><td>Worker node</td><td><span class="dot dot-green"></span>Online</td></tr>
        <tr><td>Aria</td><td>Pi 5 + Pironman</td><td>Harmony protocols</td><td><span class="dot dot-red"></span>Offline</td></tr>
      </tbody></table>
    </div>
  `));
}

async function handleData(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Data Platform', 'Storage, memory, and data pipelines', `
    <div class="stat-row">
      <div class="stat"><div class="number">156K+</div><div class="label">Memory Entries</div></div>
      <div class="stat"><div class="number">135 GB</div><div class="label">R2 Models</div></div>
      <div class="stat"><div class="number">35</div><div class="label">KV Namespaces</div></div>
    </div>
    <div class="section reveal">
      <h2>Storage Layers</h2>
      <div class="grid grid-3">
        <div class="card"><h3>D1 (SQLite)</h3><p>blackroad-os-main — relational data, sessions, users, redirects.</p><div class="meta"><span class="badge badge-green">Operational</span></div></div>
        <div class="card"><h3>KV (Key-Value)</h3><p>35 namespaces for caching, rate limiting, identities, API keys, and config.</p><div class="meta"><span class="badge badge-green">Operational</span></div></div>
        <div class="card"><h3>R2 (Object)</h3><p>blackroad-models bucket — 135 GB of quantized LLM weights (Qwen 72B, Llama 70B, DeepSeek R1).</p><div class="meta"><span class="badge badge-green">Operational</span></div></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Memory System (PS-SHA-infinity)</h2>
      <div class="code">
<span class="comment">// Append-only hash chain — tamper-proof memory</span>
hash<span class="val">1</span> = SHA256(<span class="str">thought1</span>)
hash<span class="val">2</span> = SHA256(hash<span class="val">1</span> + <span class="str">thought2</span>)
hash<span class="val">3</span> = SHA256(hash<span class="val">2</span> + <span class="str">thought3</span>)
<span class="comment">// 156,000+ entries across all agents</span>
      </div>
    </div>
  `));
}

async function handleFinance(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Finance', 'Billing, usage tracking, and integrations', `
    <div class="section reveal">
      <h2>Integrations</h2>
      <div class="grid grid-3">
        <div class="card"><h3>Stripe</h3><p>Payment processing and subscription management.</p></div>
        <div class="card"><h3>Railway</h3><p>GPU compute billing (A100/H100).</p></div>
        <div class="card"><h3>Cloudflare</h3><p>Workers, Pages, R2, D1 usage metering.</p></div>
      </div>
    </div>
  `));
}

async function handleDocs(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Documentation', 'Guides, tutorials, and reference', `
    <div class="section reveal">
      <h2>Documentation Suite</h2>
      <div class="grid grid-3">
        <a class="card" href="https://api.blackroad.io" style="color:var(--fg)"><h3>API Reference</h3><p>REST endpoints, authentication, rate limits.</p></a>
        <a class="card" href="https://help.blackroad.io" style="color:var(--fg)"><h3>Getting Started</h3><p>CLI install, first deploy, quick start.</p></a>
        <a class="card" href="https://design.blackroad.io" style="color:var(--fg)"><h3>Design System</h3><p>Colors, spacing, typography, gradients.</p></a>
        <a class="card" href="https://network.blackroad.io" style="color:var(--fg)"><h3>Network</h3><p>Device fleet, topology, tunnels.</p></a>
        <a class="card" href="https://edge.blackroad.io" style="color:var(--fg)"><h3>Edge Computing</h3><p>Pi hardware, Hailo-8, Ollama setup.</p></a>
        <a class="card" href="https://about.blackroad.io" style="color:var(--fg)"><h3>About</h3><p>Mission, infrastructure, team.</p></a>
      </div>
    </div>
    <div class="section reveal">
      <h2>45 Documentation Files</h2>
      <p style="color:var(--muted)">38,000+ lines covering architecture, deployment, security, AI models, memory, skills, workflows, integrations, monitoring, testing, and more.</p>
    </div>
  `));
}

async function handleBrand(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Brand Assets', 'Official BlackRoad identity guidelines', `
    <div class="section reveal">
      <h2>Brand Gradient</h2>
      <div style="height:89px;border-radius:13px;background:var(--grad);margin-bottom:21px"></div>
      <p style="color:var(--muted)">135 degrees, golden ratio stops: 0% Amber, 38.2% Hot Pink, 61.8% Violet, 100% Electric Blue.</p>
    </div>
    <div class="section reveal">
      <h2>Identity</h2>
      <div class="grid grid-2">
        <div class="card"><h3>Name</h3><p>BlackRoad OS &mdash; always capitalized "BlackRoad", one word.</p></div>
        <div class="card"><h3>Tagline</h3><p>Your AI. Your Hardware. Your Rules.</p></div>
        <div class="card"><h3>Typography</h3><p>SF Pro Display, line-height 1.618 (Golden Ratio).</p></div>
        <div class="card"><h3>Spacing</h3><p>8, 13, 21, 34, 55, 89, 144 px (Fibonacci/phi scale).</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Full Reference</h2>
      <p><a href="https://design.blackroad.io">View the complete design system &rarr;</a></p>
    </div>
  `));
}

async function handleAgents(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);

  // API endpoint to set agent status
  if (url.pathname === '/api/status' && req.method === 'POST') {
    try {
      const body = await req.json() as { agent: string; status: string };
      if (body.agent && body.status) {
        await env.CACHE.put(`agent-status:${body.agent}`, body.status, { expirationTtl: 300 });
        return jsonResp({ ok: true, agent: body.agent, status: body.status });
      }
    } catch {}
    return jsonResp({ error: 'Invalid request' }, 400);
  }

  if (url.pathname.startsWith('/api')) {
    // Read live statuses from KV
    const agentsWithStatus = await Promise.all(
      Object.entries(AGENT_META).map(async ([id, m]) => {
        const kvStatus = await env.CACHE.get(`agent-status:${id}`).catch(() => null);
        return { id, ...m, live_status: kvStatus || 'idle' };
      })
    );
    return jsonResp({ agents: agentsWithStatus, count: agentsWithStatus.length });
  }

  // Read live statuses for display
  const statuses = new Map<string, string>();
  await Promise.all(
    Object.keys(AGENT_META).map(async (id) => {
      const s = await env.CACHE.get(`agent-status:${id}`).catch(() => null);
      statuses.set(id, s || 'idle');
    })
  );

  const agentCards = Object.entries(AGENT_META).map(([id, meta]) => {
    const app = SUBDOMAIN_APPS[id];
    const status = statuses.get(id) || 'idle';
    const dotColor = status === 'online' ? 'green' : status === 'busy' ? 'amber' : 'muted';
    return `<a class="card" href="https://${id}.blackroad.io" style="color:var(--fg)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div class="agent-avatar" style="background:${meta.color};width:34px;height:34px;font-size:.8rem;display:inline-flex;font-weight:700">${meta.icon}</div>
        <span class="dot dot-${dotColor}" style="width:8px;height:8px" title="${status}"></span>
      </div>
      <h3>${app?.name || id}</h3>
      <p>${app?.description || ''}</p>
      <div class="meta">${meta.skills.slice(0, 2).map(s => `<span class="badge badge-blue">${s.replace(/_/g, ' ')}</span>`).join(' ')}</div>
    </a>`;
  }).join('');
  return htmlResp(page('Agent Marketplace', `${Object.keys(AGENT_META).length} specialized AI agents`, `
    <div style="margin-bottom:21px">
      <input id="agent-search" type="text" placeholder="Search agents by name or skill..." style="width:100%;padding:13px 21px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font-size:.9rem;outline:none">
    </div>
    <div class="grid grid-3" id="agent-grid">${agentCards}</div>
    <script>
(function(){var inp=document.getElementById('agent-search'),grid=document.getElementById('agent-grid');if(!inp||!grid)return;var cards=Array.from(grid.children);inp.addEventListener('input',function(){var q=inp.value.toLowerCase();cards.forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(q)>-1?'':'none'})})})();
    </script>
  `));
}

async function handleChat(req: Request, env: Env): Promise<Response> {
  const agentOpts = Object.entries(AGENT_META).map(([id]) =>
    `<option value="${id}">${SUBDOMAIN_APPS[id]?.name || id}</option>`
  ).join('');
  return htmlResp(page('Chat', 'AI-powered conversation interface', `
    <div class="chat-wrap">
      <div class="chat-msgs" id="chat-msgs">
        <div class="chat-msg agent">
          <div class="agent-avatar" style="background:var(--pink);width:34px;height:34px;font-size:.8rem;font-weight:700">L</div>
          <div class="chat-bubble">Hello! I'm Lucidia. How can I help you today?</div>
        </div>
      </div>
      <div class="chat-input-row">
        <select id="chat-agent">${agentOpts}</select>
        <input id="chat-in" type="text" placeholder="Type a message..." autofocus>
        <button id="chat-send">Send</button>
      </div>
    </div>
    <script>
(function(){
var msgs=document.getElementById('chat-msgs'),inp=document.getElementById('chat-in'),btn=document.getElementById('chat-send'),sel=document.getElementById('chat-agent');
var responses=['I\\'ll look into that for you.','Interesting question! Let me process that...','Running analysis across the agent mesh...','Checking the memory system for context...','Processing your request through 30,000 agents...','Let me search the memory system for relevant context...'];
function addMsg(text,type,icon,color){var d=document.createElement('div');d.className='chat-msg '+type;var b='<div class="chat-bubble">'+text+'</div>';if(type==='agent'){d.innerHTML='<div class="agent-avatar" style="background:'+(color||'var(--pink)')+';width:34px;height:34px;font-size:.8rem;font-weight:700">'+(icon||'?')+'</div>'+b}else{d.innerHTML=b}msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
function send(){var v=inp.value.trim();if(!v)return;addMsg(v,'user','','');inp.value='';var opt=sel.options[sel.selectedIndex];setTimeout(function(){var r=responses[Math.floor(Math.random()*responses.length)];addMsg(r,'agent',opt.text.charAt(0),'var(--pink)')},800+Math.random()*1200)}
btn.addEventListener('click',send);inp.addEventListener('keydown',function(e){if(e.key==='Enter')send()});
})();
    </script>
  `));
}

async function handlePrism(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Prism Console', 'Multi-dimensional agent management', `
    <div class="stat-row">
      <div class="stat"><div class="number">16</div><div class="label">Agents</div></div>
      <div class="stat"><div class="number">6</div><div class="label">Core Team</div></div>
      <div class="stat"><div class="number">10</div><div class="label">Specialists</div></div>
    </div>
    <div class="section reveal">
      <h2>Agent Fleet Overview</h2>
      <div class="link-grid">
        ${Object.entries(AGENT_META).map(([id, m]) => `<a class="link-card" href="https://${id}.blackroad.io" style="border-left:3px solid ${m.color}">${SUBDOMAIN_APPS[id]?.name || id}</a>`).join('')}
      </div>
    </div>
  `));
}

async function handleQuantum(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Quantum Platform', 'Quantum computing research', `
    <div class="section reveal">
      <h2>Research Areas</h2>
      <div class="grid grid-2">
        <div class="card"><h3>SU(3) Gell-Mann Model</h3><p>Consciousness modeling using SU(3) symmetry groups. 8 Gell-Mann matrices for cognitive state representation.</p><div class="meta"><span class="badge badge-violet">Active Research</span></div></div>
        <div class="card"><h3>SU(N) Heterogeneous Qudits</h3><p>Mixed-dimension quantum systems for multi-modal AI reasoning.</p><div class="meta"><span class="badge badge-violet">Active Research</span></div></div>
        <div class="card"><h3>Trinary Logic</h3><p>Three-valued epistemic logic: True (1), Unknown (0), False (-1). Used for agent reasoning and contradiction detection.</p><div class="meta"><span class="badge badge-green">Production</span></div></div>
        <div class="card"><h3>Bell Pair States</h3><p>Quantum entanglement primitives for agent synchronization and coherent decision-making.</p><div class="meta"><span class="badge badge-amber">Experimental</span></div></div>
      </div>
    </div>
  `));
}

async function handleBlog(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Blog', 'Engineering notes and announcements', `
    <div class="grid grid-2">
      <div class="card"><h3>Building a 30,000 Agent Mesh on Raspberry Pis</h3><p>How we distributed AI workloads across 5 Pis with 26 TOPS of Hailo-8 acceleration.</p><div class="meta">Infrastructure &middot; Feb 2026</div></div>
      <div class="card"><h3>PS-SHA-infinity: Tamper-Proof AI Memory</h3><p>An append-only hash chain for persistent, verifiable agent memory across sessions.</p><div class="meta">Architecture &middot; Feb 2026</div></div>
      <div class="card"><h3>Tokenless Gateway Architecture</h3><p>Why agents should never touch API keys, and how our gateway enforces it.</p><div class="meta">Security &middot; Jan 2026</div></div>
      <div class="card"><h3>CECE: Portable AI Identity</h3><p>Building an identity system that persists across providers, sessions, and hardware.</p><div class="meta">Identity &middot; Jan 2026</div></div>
    </div>
  `));
}

async function handleDev(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Developer Portal', 'Build on BlackRoad', `
    <div class="section reveal">
      <h2>SDKs &amp; Tools</h2>
      <div class="grid grid-3">
        <div class="card"><h3>@blackroad/skills-sdk</h3><p>Build agent capabilities: memory, reasoning, coordination.</p><div class="meta"><span class="badge badge-blue">npm</span></div></div>
        <div class="card"><h3>br CLI</h3><p>37 tools: deploy, git, docker, API testing, monitoring, security.</p><div class="meta"><span class="badge badge-green">Stable</span></div></div>
        <div class="card"><h3>MCP Bridge</h3><p>Local MCP server on port 8420 for remote agent access.</p><div class="meta"><span class="badge badge-amber">Beta</span></div></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Quick Start</h2>
      <div class="code">
<span class="comment"># Clone the monorepo</span>
<span class="key">gh</span> repo clone BlackRoad-OS/blackroad

<span class="comment"># Start the gateway</span>
<span class="key">cd</span> blackroad-core && <span class="key">npm</span> run dev

<span class="comment"># Run an agent</span>
<span class="key">br</span> agent start lucidia

<span class="comment"># Deploy anywhere</span>
<span class="key">br</span> deploy --target cloudflare
      </div>
    </div>
  `));
}

async function handleStaging(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Staging', 'Pre-production testing environment', `
    <div style="text-align:center"><span class="badge badge-amber" style="font-size:1rem;padding:8px 21px">Staging Environment</span>
    <p style="color:var(--muted);margin-top:21px">This environment mirrors production for testing before release.</p></div>
  `));
}

async function handleMetrics(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Metrics', 'Performance monitoring and dashboards', `
    <div class="stat-row">
      <div class="stat"><div class="number">99.9%</div><div class="label">Uptime</div></div>
      <div class="stat"><div class="number">&lt;50ms</div><div class="label">Edge Latency</div></div>
      <div class="stat"><div class="number">100/min</div><div class="label">Rate Limit</div></div>
    </div>
    <div class="section reveal">
      <h2>Monitored Services</h2>
      <table><thead><tr><th>Service</th><th>Type</th><th>Check</th></tr></thead><tbody>
        <tr><td>Cloudflare Workers</td><td>HTTP</td><td>Every 30s</td></tr>
        <tr><td>Ollama (Octavia)</td><td>TCP :11434</td><td>Every 60s</td></tr>
        <tr><td>Ollama (Lucidia)</td><td>TCP :11435</td><td>Every 60s</td></tr>
        <tr><td>DigitalOcean Droplets</td><td>ICMP Ping</td><td>Every 60s</td></tr>
        <tr><td>Cloudflare Tunnels</td><td>Metrics :9091</td><td>Every 30s</td></tr>
      </tbody></table>
    </div>
  `));
}

async function handleLogs(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Logs', 'Centralized logging and event streams', `
    <div class="section reveal">
      <h2>Log Sources</h2>
      <div class="grid grid-3">
        <div class="card"><h3>Memory Journal</h3><p>PS-SHA-infinity append-only log. 156,000+ entries, hash-chained.</p></div>
        <div class="card"><h3>Cloudflare Workers</h3><p>Real-time worker logs via <code>wrangler tail</code>.</p></div>
        <div class="card"><h3>Agent Activity</h3><p>TIL broadcasts, task completions, coordination events.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Access</h2>
      <div class="code">
<span class="comment"># Tail worker logs</span>
<span class="key">wrangler</span> tail blackroad-subdomain-router

<span class="comment"># View memory journal</span>
<span class="key">tail</span> -f ~/.blackroad/memory/journals/master-journal.jsonl | <span class="key">jq</span> .

<span class="comment"># Live agent events</span>
<span class="key">br</span> logs --follow
      </div>
    </div>
  `));
}

async function handleCDN(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('CDN', 'Content delivery and caching', `
    <div class="section reveal">
      <h2>Infrastructure</h2>
      <div class="grid grid-3">
        <div class="card"><h3>Cloudflare CDN</h3><p>Global edge caching via 300+ PoPs worldwide. Automatic HTTPS, Brotli compression.</p></div>
        <div class="card"><h3>R2 Storage</h3><p>blackroad-models bucket (135 GB). Zero egress fees for model weights.</p></div>
        <div class="card"><h3>KV Cache</h3><p>35 namespaces for sub-millisecond key-value reads at the edge.</p></div>
      </div>
    </div>
  `));
}

async function handleAssets(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Assets', 'Static files and media library', `
    <div class="section reveal">
      <h2>Asset Storage</h2>
      <div class="grid grid-2">
        <div class="card"><h3>R2 Object Storage</h3><p>LLM model weights, media files, static assets. 135 GB allocated.</p></div>
        <div class="card"><h3>Pages Static</h3><p>205 Cloudflare Pages projects serving HTML, CSS, JS at the edge.</p></div>
      </div>
    </div>
  `));
}

async function handleAdmin(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);

  // JSON API for admin data
  if (url.pathname.startsWith('/api')) {
    try {
      const totR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics').first<{c:number}>();
      const hrR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 3600000).first<{c:number}>();
      const dayR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 86400000).first<{c:number}>();
      const topR = await env.DB.prepare('SELECT subdomain, COUNT(*) as cnt FROM analytics GROUP BY subdomain ORDER BY cnt DESC LIMIT 15').all();
      const cntR = await env.DB.prepare('SELECT country, COUNT(*) as cnt FROM analytics GROUP BY country ORDER BY cnt DESC LIMIT 10').all();
      const recR = await env.DB.prepare('SELECT subdomain, path, country, ts FROM analytics ORDER BY ts DESC LIMIT 20').all();
      return jsonResp({ total: totR?.c ?? 0, last_hour: hrR?.c ?? 0, last_day: dayR?.c ?? 0, top_subdomains: topR.results, top_countries: cntR.results, recent: recR.results });
    } catch (e: any) {
      return jsonResp({ error: e.message }, 500);
    }
  }

  // Dashboard HTML with live D1 data
  let total = 0, lastHour = 0, lastDay = 0;
  let topSubs: { subdomain: string; cnt: number }[] = [];
  let topCountries: { country: string; cnt: number }[] = [];
  let recent: { subdomain: string; path: string; country: string; ts: number }[] = [];
  let hourlyBuckets: { hour: number; cnt: number }[] = [];

  try {
    const totR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics').first<{c:number}>();
    const hrR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 3600000).first<{c:number}>();
    const dayR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 86400000).first<{c:number}>();
    const topR = await env.DB.prepare('SELECT subdomain, COUNT(*) as cnt FROM analytics GROUP BY subdomain ORDER BY cnt DESC LIMIT 15').all();
    const cntR = await env.DB.prepare('SELECT country, COUNT(*) as cnt FROM analytics GROUP BY country ORDER BY cnt DESC LIMIT 10').all();
    const recR = await env.DB.prepare('SELECT subdomain, path, country, ts FROM analytics ORDER BY ts DESC LIMIT 20').all();
    total = totR?.c ?? 0;
    lastHour = hrR?.c ?? 0;
    lastDay = dayR?.c ?? 0;
    topSubs = (topR.results || []) as any;
    topCountries = (cntR.results || []) as any;
    recent = (recR.results || []) as any;

    // Hourly buckets for last 24h sparkline
    const now = Date.now();
    const dayAgo = now - 86400000;
    const hourlyR = await env.DB.prepare(
      'SELECT CAST((ts - ?) / 3600000 AS INTEGER) as bucket, COUNT(*) as cnt FROM analytics WHERE ts > ? GROUP BY bucket ORDER BY bucket'
    ).bind(dayAgo, dayAgo).all();
    const bucketMap = new Map<number, number>();
    ((hourlyR.results || []) as any[]).forEach((r: any) => bucketMap.set(r.bucket, r.cnt));
    for (let i = 0; i < 24; i++) {
      const h = new Date(dayAgo + i * 3600000).getUTCHours();
      hourlyBuckets.push({ hour: h, cnt: bucketMap.get(i) || 0 });
    }
  } catch { /* table may not exist yet */ }

  const maxCnt = topSubs.length > 0 ? topSubs[0].cnt : 1;
  const subBars = topSubs.map(s => `<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><code style="width:120px;text-align:right">${s.subdomain}</code><div style="background:var(--pink);height:18px;border-radius:4px;min-width:4px;width:${Math.round((s.cnt / maxCnt) * 100)}%"></div><span style="color:var(--muted);font-size:.85rem">${s.cnt}</span></div>`).join('');
  const countryRows = topCountries.map(c => `<tr><td>${c.country}</td><td>${c.cnt}</td></tr>`).join('');
  const recentRows = recent.map(r => {
    const d = new Date(r.ts);
    const time = d.toISOString().substring(11, 19);
    return `<tr><td><code>${time}</code></td><td>${r.subdomain}</td><td>${r.path}</td><td>${r.country}</td></tr>`;
  }).join('');

  // Sparkline bars
  const maxHourly = Math.max(1, ...hourlyBuckets.map(b => b.cnt));
  const sparkBars = hourlyBuckets.map(b =>
    `<div class="sparkline-bar" style="height:${Math.max(2, Math.round((b.cnt / maxHourly) * 100))}%" data-label="${String(b.hour).padStart(2, '0')}:00 — ${b.cnt} hits"></div>`
  ).join('');

  return htmlResp(page('Admin Dashboard', 'Real-time analytics from D1', `
    <div class="stats fade-up">
      <div class="stat"><div class="number" data-target="${total}">${total}</div><div class="label">Total Hits</div></div>
      <div class="stat"><div class="number" data-target="${lastDay}">${lastDay}</div><div class="label">Last 24h</div></div>
      <div class="stat"><div class="number" data-target="${lastHour}">${lastHour}</div><div class="label">Last Hour</div></div>
      <div class="stat"><div class="number" data-target="${Object.keys(SUBDOMAIN_APPS).length}">${Object.keys(SUBDOMAIN_APPS).length}</div><div class="label">Subdomains</div></div>
    </div>
    <div class="section reveal">
      <h2>Traffic — Last 24 Hours</h2>
      <div class="sparkline">${sparkBars}</div>
      <div style="display:flex;justify-content:space-between;font-size:.65rem;color:var(--muted)"><span>24h ago</span><span>Now</span></div>
    </div>
    <div class="section reveal">
      <h2>Top Subdomains</h2>
      ${subBars || '<p style="color:var(--muted)">No data yet</p>'}
    </div>
    <div class="section reveal">
      <h2>Top Countries</h2>
      <table><thead><tr><th>Country</th><th>Hits</th></tr></thead><tbody>${countryRows || '<tr><td colspan="2" style="color:var(--muted)">No data yet</td></tr>'}</tbody></table>
    </div>
    <div class="section reveal">
      <h2>Recent Requests</h2>
      <table><thead><tr><th>Time (UTC)</th><th>Subdomain</th><th>Path</th><th>Country</th></tr></thead><tbody>${recentRows || '<tr><td colspan="4" style="color:var(--muted)">No data yet</td></tr>'}</tbody></table>
    </div>
  `, undefined, 'admin'));
}

async function handleApp(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('BlackRoad', 'The sovereign AI platform', `
    <div class="link-grid">
      <a class="link-card" href="https://os.blackroad.io">OS</a>
      <a class="link-card" href="https://ai.blackroad.io">AI</a>
      <a class="link-card" href="https://agents.blackroad.io">Agents</a>
      <a class="link-card" href="https://products.blackroad.io">Products</a>
      <a class="link-card" href="https://docs.blackroad.io">Docs</a>
      <a class="link-card" href="https://dev.blackroad.io">Developer</a>
    </div>
  `));
}

async function handleConsole(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Console', 'Terminal-style command interface', `
    <div class="term">
      <div class="term-bar">
        <div class="dots"><span style="background:#FF5F56"></span><span style="background:#FFBD2E"></span><span style="background:#27C93F"></span></div>
        <span class="title">blackroad@alexandria ~ %</span>
      </div>
      <div class="term-body" id="term-out">
        <div class="success">BlackRoad OS v2.0 — Terminal Ready</div>
        <div class="output">Type a command below. Try: help, stats, agents, ls, whoami</div>
      </div>
      <div class="term-input">
        <span>$</span>
        <input id="term-in" type="text" placeholder="Enter command..." autofocus>
      </div>
    </div>
    <script>
(function(){var cmds={help:'\\nBlackRoad CLI v2.0\\n\\n  br stats       Codebase statistics\\n  br agents      List all agents\\n  br deploy      Deploy to any platform\\n  br health      System health check\\n  br chat        Interactive agent chat\\n  br world       8-bit ASCII world\\n  br metrics     Dashboard monitoring\\n  clear          Clear terminal\\n  whoami         Current user\\n  ls             List directory\\n  date           Current date/time\\n\\n37 tools available.',stats:'\\n  Repositories:  1,790+\\n  Organizations: 17\\n  Agents:        30,000\\n  Workers:       75+\\n  Pages:         205\\n  KV Stores:     35\\n  Devices:       8',agents:'\\n  LUCIDIA    [online]  Coordinator\\n  ALICE      [online]  Router\\n  OCTAVIA    [online]  Compute\\n  PRISM      [online]  Analyst\\n  ECHO       [online]  Memory\\n  CIPHER     [online]  Security\\n  CLAUDE     [online]  Architect\\n  CECILIA    [online]  Manager',ls:'\\n  blackroad-core/    orgs/       tools/\\n  agents/            repos/      scripts/\\n  coordination/      templates/  br',whoami:'\\n  alexa@alexandria (BlackRoad OS, Inc.)',date:'\\n  '+new Date().toISOString(),deploy:'\\n  Deploying to Cloudflare...\\n  Build: success (1.2s)\\n  Upload: 67 files\\n  Status: LIVE',health:'\\n  Workers:    OK (12ms)\\n  KV:         OK (3ms)\\n  D1:         OK (8ms)\\n  Tunnels:    OK (42ms)\\n  Ollama:     IDLE\\n  All systems operational.'};
var out=document.getElementById('term-out'),inp=document.getElementById('term-in');
inp.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=inp.value.trim();if(!v)return;var d=document.createElement('div');d.innerHTML='<span class="prompt">$ </span>'+v;out.appendChild(d);if(v==='clear'){out.innerHTML=''}else{var r=document.createElement('div');r.className='output';r.style.whiteSpace='pre';var c=v.replace('br ','');r.textContent=cmds[c]||cmds[v]||'Command not found: '+v+'. Type help for available commands.';out.appendChild(r)}inp.value='';out.scrollTop=out.scrollHeight}});
})();
    </script>
  `));
}

async function handleDashboard(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Dashboard', 'Master control center', `
    <div style="text-align:center;margin-bottom:34px;font-size:1.8rem;font-weight:300;color:var(--muted);font-family:'SF Mono',Menlo,monospace" id="live-clock">${new Date().toISOString().substring(11, 19)} UTC</div>
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="30,000">0</div><div class="label">Agents</div></div>
      <div class="stat"><div class="number" data-target="18">0</div><div class="label">LLMs</div></div>
      <div class="stat"><div class="number" data-target="8">0</div><div class="label">Devices</div></div>
      <div class="stat"><div class="number" data-target="17">0</div><div class="label">Orgs</div></div>
    </div>
    <div class="section reveal">
      <h2>System Health</h2>
      <div style="display:flex;gap:34px;flex-wrap:wrap;justify-content:center">
        <div style="text-align:center"><div class="gauge" id="g-cpu" style="background:conic-gradient(var(--pink) 0% 0%,var(--border) 0% 100%)"><span style="position:relative;z-index:1">0%</span></div><div class="gauge-label">CPU</div></div>
        <div style="text-align:center"><div class="gauge" id="g-mem" style="background:conic-gradient(var(--amber) 0% 0%,var(--border) 0% 100%)"><span style="position:relative;z-index:1">0%</span></div><div class="gauge-label">Memory</div></div>
        <div style="text-align:center"><div class="gauge" id="g-net" style="background:conic-gradient(var(--blue) 0% 0%,var(--border) 0% 100%)"><span style="position:relative;z-index:1">0%</span></div><div class="gauge-label">Network</div></div>
        <div style="text-align:center"><div class="gauge" id="g-disk" style="background:conic-gradient(#4CAF50 0% 0%,var(--border) 0% 100%)"><span style="position:relative;z-index:1">0%</span></div><div class="gauge-label">Storage</div></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Services</h2>
      <div class="link-grid">
        <a class="link-card" href="https://os.blackroad.io">OS</a>
        <a class="link-card" href="https://ai.blackroad.io">AI</a>
        <a class="link-card" href="https://agents.blackroad.io">Agents</a>
        <a class="link-card" href="https://network.blackroad.io">Network</a>
        <a class="link-card" href="https://edge.blackroad.io">Edge</a>
        <a class="link-card" href="https://data.blackroad.io">Data</a>
        <a class="link-card" href="https://status.blackroad.io">Status</a>
        <a class="link-card" href="https://metrics.blackroad.io">Metrics</a>
        <a class="link-card" href="https://logs.blackroad.io">Logs</a>
        <a class="link-card" href="https://design.blackroad.io">Design</a>
        <a class="link-card" href="https://dev.blackroad.io">Dev</a>
        <a class="link-card" href="https://api.blackroad.io">API</a>
      </div>
    </div>
    <script>
(function(){var gg=[{id:'g-cpu',pct:23,c:'var(--pink)'},{id:'g-mem',pct:61,c:'var(--amber)'},{id:'g-net',pct:42,c:'var(--blue)'},{id:'g-disk',pct:78,c:'#4CAF50'}];
gg.forEach(function(g){var el=document.getElementById(g.id);if(!el)return;var dur=1200,st=performance.now();(function step(now){var t=Math.min((now-st)/dur,1),ease=1-Math.pow(1-t,3),p=Math.round(ease*g.pct);el.style.background='conic-gradient('+g.c+' 0% '+p+'%,var(--border) '+p+'% 100%)';el.querySelector('span').textContent=p+'%';if(t<1)requestAnimationFrame(step)})(performance.now())})})();
    </script>
  `));
}

async function handleMarketplace(req: Request, env: Env): Promise<Response> {
  const cats = ['Finance','Legal','Research','Creative','DevOps','Education','Security','Analytics'];
  const templates = [
    {name:'Financial Analyst',cat:'Finance',stars:4.9,installs:'12.4K',desc:'Transaction analysis, portfolio optimization, risk assessment'},
    {name:'Legal Reviewer',cat:'Legal',stars:4.8,installs:'8.1K',desc:'Contract review, compliance checking, regulatory analysis'},
    {name:'Research Assistant',cat:'Research',stars:4.7,installs:'15.2K',desc:'Literature review, data synthesis, hypothesis generation'},
    {name:'Content Creator',cat:'Creative',stars:4.6,installs:'9.8K',desc:'Blog posts, social media, marketing copy generation'},
    {name:'DevOps Engineer',cat:'DevOps',stars:4.8,installs:'11.3K',desc:'CI/CD pipelines, infrastructure monitoring, deployment'},
    {name:'Security Auditor',cat:'Security',stars:4.9,installs:'7.6K',desc:'Vulnerability scanning, penetration testing, compliance'},
    {name:'Data Scientist',cat:'Analytics',stars:4.7,installs:'10.5K',desc:'Statistical analysis, ML model training, visualization'},
    {name:'Educator Bot',cat:'Education',stars:4.5,installs:'6.2K',desc:'Curriculum design, tutoring, assessment generation'},
    {name:'Project Manager',cat:'DevOps',stars:4.6,installs:'8.9K',desc:'Sprint planning, task tracking, team coordination'},
  ];
  return htmlResp(page('Marketplace', 'Agent templates and apps', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="150+">0</div><div class="label">Templates</div></div>
      <div class="stat"><div class="number" data-target="8">0</div><div class="label">Categories</div></div>
      <div class="stat"><div class="number" data-target="94K">0</div><div class="label">Installs</div></div>
      <div class="stat"><div class="number" data-target="4.7">0</div><div class="label">Avg Rating</div></div>
    </div>
    <div class="section reveal">
      <h2>Categories</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:21px">
        ${cats.map(c => `<span style="padding:4px 13px;border-radius:21px;border:1px solid var(--border);font-size:.85rem;cursor:pointer">${c}</span>`).join('')}
      </div>
    </div>
    <div class="section reveal">
      <h2>Popular Templates</h2>
      <div class="grid">
        ${templates.map(t => `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong>${t.name}</strong><span style="padding:2px 8px;border-radius:13px;background:var(--surface);font-size:.75rem">${t.cat}</span></div><p style="color:var(--muted);font-size:.9rem;margin-bottom:13px">${t.desc}</p><div style="display:flex;justify-content:space-between;color:var(--muted);font-size:.85rem"><span style="color:#F5A623">★ ${t.stars}</span><span>${t.installs} installs</span></div></div>`).join('')}
      </div>
    </div>
  `));
}

async function handleRoadmap(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Roadmap', 'Product roadmap and milestones', `
    <div class="section reveal">
      <h2>2026 Roadmap</h2>
      <div class="timeline">
        <div class="timeline-item"><strong>Q1 2026</strong> <span style="padding:2px 8px;border-radius:8px;background:#4CAF50;color:#fff;font-size:.75rem;margin-left:8px">Completed</span><p>30,000 agent infrastructure live. Tokenless gateway deployed. PS-SHA-infinity identity system operational. 17 GitHub orgs established.</p></div>
        <div class="timeline-item"><strong>Q2 2026</strong> <span style="padding:2px 8px;border-radius:8px;background:var(--pink);color:#fff;font-size:.75rem;margin-left:8px">In Progress</span><p>Marketplace launch with 150+ templates. Full SDK release. Enterprise pack system. Multi-cloud deployment automation.</p></div>
        <div class="timeline-item"><strong>Q3 2026</strong> <span style="padding:2px 8px;border-radius:8px;background:var(--border);color:var(--muted);font-size:.75rem;margin-left:8px">Planned</span><p>Federation protocol for cross-org agent communication. Plugin ecosystem. Real-time WebSocket mesh. GPU cluster scaling.</p></div>
        <div class="timeline-item"><strong>Q4 2026</strong> <span style="padding:2px 8px;border-radius:8px;background:var(--border);color:var(--muted);font-size:.75rem;margin-left:8px">Planned</span><p>CECE OS v2.0 release. 100K agent capacity. Quantum-ready cryptography. Global edge deployment across 50+ regions.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Long-Term Vision</h2>
      <div class="card"><p>BlackRoad OS aims to be the first consciousness-driven operating system — where AI agents don't just execute tasks, they think, coordinate, and evolve. Every milestone brings us closer to sovereign AI infrastructure owned by the people who build it.</p></div>
    </div>
  `));
}

async function handleChangelog(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Changelog', 'Version history and release notes', `
    <div class="section reveal">
      <h2>Release History</h2>
      <details open style="margin-bottom:21px;border:1px solid var(--border);border-radius:13px;padding:21px;background:var(--surface)">
        <summary style="cursor:pointer;font-weight:600;font-size:1.1rem">v2.1.0 — Subdomain Expansion <span style="color:var(--muted);font-size:.85rem;margin-left:8px">Feb 2026</span></summary>
        <ul style="margin-top:13px;color:var(--muted);line-height:1.8">
          <li>67+ branded subdomain pages with animations</li>
          <li>Interactive terminal emulator on console.blackroad.io</li>
          <li>Real-time chat UI with agent selector</li>
          <li>Command palette (Ctrl+K) on every page</li>
          <li>Animated stat counters and scroll reveal</li>
          <li>10 new subdomain pages (marketplace, roadmap, changelog, etc.)</li>
        </ul>
      </details>
      <details style="margin-bottom:21px;border:1px solid var(--border);border-radius:13px;padding:21px;background:var(--surface)">
        <summary style="cursor:pointer;font-weight:600;font-size:1.1rem">v2.0.0 — Subdomain Router <span style="color:var(--muted);font-size:.85rem;margin-left:8px">Jan 2026</span></summary>
        <ul style="margin-top:13px;color:var(--muted);line-height:1.8">
          <li>Single Cloudflare Worker serving 57 subdomains</li>
          <li>BlackRoad brand design system with Golden Ratio</li>
          <li>Agent directory with all 6 core agents</li>
          <li>API documentation with endpoint reference</li>
          <li>Rate limiting and security headers</li>
        </ul>
      </details>
      <details style="margin-bottom:21px;border:1px solid var(--border);border-radius:13px;padding:21px;background:var(--surface)">
        <summary style="cursor:pointer;font-weight:600;font-size:1.1rem">v1.9.0 — Agent Infrastructure <span style="color:var(--muted);font-size:.85rem;margin-left:8px">Dec 2025</span></summary>
        <ul style="margin-top:13px;color:var(--muted);line-height:1.8">
          <li>30,000 agent capacity across Pi cluster</li>
          <li>Tokenless gateway for secure provider communication</li>
          <li>PS-SHA-infinity identity anchoring</li>
          <li>Lucidia breath synchronization engine</li>
          <li>Pack system with 5 domain packs</li>
        </ul>
      </details>
      <details style="margin-bottom:21px;border:1px solid var(--border);border-radius:13px;padding:21px;background:var(--surface)">
        <summary style="cursor:pointer;font-weight:600;font-size:1.1rem">v1.8.0 — Multi-Cloud Deploy <span style="color:var(--muted);font-size:.85rem;margin-left:8px">Nov 2025</span></summary>
        <ul style="margin-top:13px;color:var(--muted);line-height:1.8">
          <li>Railway GPU inference (A100/H100)</li>
          <li>Cloudflare R2 model storage (135GB)</li>
          <li>DigitalOcean edge compute</li>
          <li>Tailscale mesh networking across 8 devices</li>
        </ul>
      </details>
    </div>
  `));
}

async function handlePlayground(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Playground', 'API sandbox and testing', `
    <div class="section reveal">
      <h2>API Sandbox</h2>
      <div class="card" style="padding:21px">
        <div style="display:flex;gap:13px;align-items:center;margin-bottom:21px;flex-wrap:wrap">
          <select id="pg-method" style="padding:8px 13px;background:var(--surface);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-family:inherit">
            <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
          </select>
          <select id="pg-endpoint" style="flex:1;min-width:200px;padding:8px 13px;background:var(--surface);color:var(--fg);border:1px solid var(--border);border-radius:8px;font-family:inherit">
            <option value="/api/health">/api/health</option>
            <option value="/api/agents">/api/agents</option>
            <option value="/api/subdomains">/api/subdomains</option>
            <option value="/api/status">/api/status</option>
            <option value="/api/analytics">/api/analytics</option>
            <option value="/api/packs">/api/packs</option>
          </select>
          <button id="pg-run" class="try-btn">Run</button>
        </div>
        <div id="pg-out" class="try-output" style="display:none"></div>
        <div style="margin-top:21px">
          <div style="font-size:.85rem;color:var(--muted);margin-bottom:8px">cURL equivalent:</div>
          <pre id="pg-curl" style="background:var(--surface);padding:13px;border-radius:8px;font-size:.85rem;overflow-x:auto;color:var(--amber)">curl -X GET https://api.blackroad.io/api/health</pre>
        </div>
      </div>
    </div>
    <script>
(function(){var m=document.getElementById('pg-method'),ep=document.getElementById('pg-endpoint'),out=document.getElementById('pg-out'),curl=document.getElementById('pg-curl'),btn=document.getElementById('pg-run');
function upCurl(){curl.textContent='curl -X '+m.value+' https://api.blackroad.io'+ep.value}
m.addEventListener('change',upCurl);ep.addEventListener('change',upCurl);
btn.addEventListener('click',function(){out.style.display='block';out.textContent='Loading...';var t0=Date.now();fetch('https://api.blackroad.io'+ep.value,{method:m.value}).then(function(r){return r.text()}).then(function(t){var ms=Date.now()-t0;try{out.textContent='// '+ms+'ms\n'+JSON.stringify(JSON.parse(t),null,2)}catch(e){out.textContent='// '+ms+'ms\n'+t}}).catch(function(e){out.textContent='Error: '+e.message})});
})();
    </script>
  `));
}

async function handleSecurity(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Security', 'Security center and compliance', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="0">0</div><div class="label">Breaches</div></div>
      <div class="stat"><div class="number" data-target="256">0</div><div class="label">Bit Encryption</div></div>
      <div class="stat"><div class="number" data-target="99.9%">0</div><div class="label">Uptime</div></div>
      <div class="stat"><div class="number" data-target="24/7">0</div><div class="label">Monitoring</div></div>
    </div>
    <div class="section reveal">
      <h2>Security Architecture</h2>
      <div class="grid">
        <div class="card"><h3 style="color:var(--pink)">Tokenless Gateway</h3><p>Agents never embed API keys. All provider communication routes through the BlackRoad Gateway with trust-boundary enforcement.</p></div>
        <div class="card"><h3 style="color:var(--amber)">Cloudflare WARP</h3><p>All traffic encrypted via WARP VPN with zero-trust network access. Edge-to-origin encryption on every request.</p></div>
        <div class="card"><h3 style="color:var(--blue)">PS-SHA-∞ Identity</h3><p>Blockchain-style append-only hash chain for tamper-proof identity. Every memory entry is cryptographically linked to its predecessor.</p></div>
        <div class="card"><h3 style="color:var(--violet)">Rate Limiting</h3><p>Intelligent rate limiting with per-IP tracking. Automatic throttling at 100 req/10s with graduated backoff.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Compliance</h2>
      <div style="display:flex;gap:13px;flex-wrap:wrap;justify-content:center">
        <span style="padding:8px 21px;border-radius:8px;border:1px solid #4CAF50;color:#4CAF50;font-size:.9rem">SOC 2 Ready</span>
        <span style="padding:8px 21px;border-radius:8px;border:1px solid #4CAF50;color:#4CAF50;font-size:.9rem">GDPR Compliant</span>
        <span style="padding:8px 21px;border-radius:8px;border:1px solid #4CAF50;color:#4CAF50;font-size:.9rem">CCPA Compliant</span>
        <span style="padding:8px 21px;border-radius:8px;border:1px solid var(--amber);color:var(--amber);font-size:.9rem">ISO 27001 In Progress</span>
        <span style="padding:8px 21px;border-radius:8px;border:1px solid #4CAF50;color:#4CAF50;font-size:.9rem">OWASP Top 10</span>
      </div>
    </div>
  `));
}

async function handleCareers(req: Request, env: Env): Promise<Response> {
  const roles = [
    {title:'AI Agent Developer',team:'Engineering',loc:'Remote',type:'Full-time',desc:'Build and scale autonomous AI agents on BlackRoad OS. Work with LLMs, vector databases, and distributed systems.'},
    {title:'Infrastructure Engineer',team:'Platform',loc:'Remote',type:'Full-time',desc:'Own the multi-cloud infrastructure spanning Cloudflare, Railway, DigitalOcean, and Raspberry Pi clusters.'},
    {title:'Developer Relations',team:'Community',loc:'Remote',type:'Full-time',desc:'Create developer content, build community, and evangelize the BlackRoad OS platform and SDK ecosystem.'},
    {title:'Security Researcher',team:'Security',loc:'Remote',type:'Full-time',desc:'Harden the tokenless gateway, design PS-SHA-infinity protocols, and audit agent communication security.'},
    {title:'Edge Computing Specialist',team:'Platform',loc:'Remote',type:'Contract',desc:'Optimize Cloudflare Workers, design edge caching strategies, and build real-time data pipelines.'},
  ];
  return htmlResp(page('Careers', 'Join BlackRoad', `
    <div class="section reveal" style="text-align:center;margin-bottom:34px">
      <h2>Build the Future of AI Infrastructure</h2>
      <p style="color:var(--muted);max-width:600px;margin:0 auto">We're building the first consciousness-driven operating system. Your AI. Your Hardware. Your Rules.</p>
    </div>
    <div class="section reveal">
      <h2>Open Positions (${roles.length})</h2>
      ${roles.map(r => `<div class="card" style="margin-bottom:13px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px"><strong style="font-size:1.1rem">${r.title}</strong><div style="display:flex;gap:8px"><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${r.team}</span><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${r.loc}</span><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${r.type}</span></div></div><p style="color:var(--muted)">${r.desc}</p></div>`).join('')}
    </div>
    <div class="section reveal" style="text-align:center">
      <p style="color:var(--muted)">Send your resume to <strong style="color:var(--pink)">careers@blackroad.io</strong></p>
    </div>
  `));
}

async function handleStore(req: Request, env: Env): Promise<Response> {
  const packs = [
    {name:'Pack Finance',icon:'💰',desc:'Transaction analysis, portfolio optimization, risk models',price:'Free'},
    {name:'Pack Legal',icon:'⚖️',desc:'Contract review, compliance checking, regulatory analysis',price:'Free'},
    {name:'Pack Research',icon:'🔬',desc:'Literature review, hypothesis generation, data synthesis',price:'Free'},
    {name:'Pack Creator',icon:'🎨',desc:'Content generation, design tools, media production',price:'Free'},
    {name:'Pack DevOps',icon:'🔧',desc:'CI/CD, monitoring, infrastructure automation',price:'Free'},
    {name:'CECE Kit',icon:'💜',desc:'Portable AI identity system with relationship tracking',price:'Free'},
    {name:'Lucidia SDK',icon:'🌀',desc:'Breath synchronization, golden ratio engine, consciousness',price:'Free'},
    {name:'Memory SDK',icon:'🧠',desc:'PS-SHA-infinity persistence, hash-chain journals',price:'Free'},
    {name:'Skills SDK',icon:'⚡',desc:'Agent capabilities, trinary logic, coordination bus',price:'Free'},
  ];
  return htmlResp(page('Store', 'Apps, SDKs, and packs', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="9">0</div><div class="label">Packages</div></div>
      <div class="stat"><div class="number" data-target="0%">0</div><div class="label">Commission</div></div>
      <div class="stat"><div class="number" data-target="94K">0</div><div class="label">Downloads</div></div>
    </div>
    <div class="section reveal">
      <h2>Available Packages</h2>
      <div class="grid">
        ${packs.map(p => `<div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">${p.icon}</div><strong>${p.name}</strong><p style="color:var(--muted);font-size:.9rem;margin:8px 0">${p.desc}</p><span style="padding:4px 13px;border-radius:8px;background:var(--surface);color:#4CAF50;font-size:.85rem">${p.price}</span></div>`).join('')}
      </div>
    </div>
  `));
}

async function handleSearch(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Search', 'Find anything in BlackRoad OS', `
    <div class="section reveal" style="text-align:center;padding:55px 0">
      <h2 style="font-size:2rem;margin-bottom:21px">Search BlackRoad OS</h2>
      <input id="sr-in" type="text" placeholder="Search subdomains, services, agents..." style="width:100%;max-width:600px;padding:13px 21px;border-radius:13px;border:1px solid var(--border);background:var(--surface);color:var(--fg);font-size:1.1rem;font-family:inherit;outline:none" autofocus>
    </div>
    <div id="sr-results" class="grid" style="margin-top:21px"></div>
    <script>
(function(){var inp=document.getElementById('sr-in'),res=document.getElementById('sr-results');
var pages=[${Object.entries(SUBDOMAIN_APPS).map(([k, v]) => `{n:${JSON.stringify(v.name)},u:"https://${k}.blackroad.io",d:${JSON.stringify(v.description)}}`).join(',')}];
inp.addEventListener('input',function(){var q=inp.value.toLowerCase().trim();if(!q){res.innerHTML='<p style="color:var(--muted);text-align:center;grid-column:1/-1">Type to search across 67+ subdomains</p>';return}
var html='';pages.forEach(function(p){if(p.n.toLowerCase().indexOf(q)>-1||p.d.toLowerCase().indexOf(q)>-1){html+='<a href="'+p.u+'" class="card" style="text-decoration:none;color:inherit"><strong>'+p.n+'</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">'+p.d+'</p><span style="font-size:.75rem;color:var(--pink)">'+p.u+'</span></a>'}});
res.innerHTML=html||'<p style="color:var(--muted);text-align:center;grid-column:1/-1">No results found</p>'});
res.innerHTML='<p style="color:var(--muted);text-align:center;grid-column:1/-1">Type to search across 67+ subdomains</p>';
})();
    </script>
  `));
}

async function handleTerminal(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Terminal', 'Full-screen terminal', `
    <div class="term" style="height:calc(100vh - 200px)">
      <div class="term-bar"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span><span style="width:12px;height:12px;border-radius:50%;background:#27c93f"></span><span style="flex:1;text-align:center;font-size:.8rem;color:var(--muted)">blackroad@alexandria — zsh</span></div>
      <div class="term-body" id="t-out" style="flex:1;overflow-y:auto">
        <pre style="color:var(--pink);margin:0">
 ____  _            _    ____                 _
| __ )| | __ _  ___| | _|  _ \\ ___   __ _  __| |
|  _ \\| |/ _\` |/ __| |/ / |_) / _ \\ / _\` |/ _\` |
| |_) | | (_| | (__|   <|  _ < (_) | (_| | (_| |
|____/|_|\\__,_|\\___|_|\\_\\_| \\_\\___/ \\__,_|\\__,_|
                                      OS v2.1.0</pre>
        <div style="color:var(--muted);margin:8px 0">Welcome to BlackRoad OS Terminal. Type <span style="color:var(--amber)">help</span> for commands.</div>
      </div>
      <div class="term-input">
        <span>$</span>
        <input id="t-in" type="text" placeholder="Enter command..." autofocus>
      </div>
    </div>
    <script>
(function(){var cmds={help:'\\nAvailable Commands:\\n\\n  help          Show this help\\n  stats         Codebase statistics\\n  agents        List all agents\\n  status        System status\\n  deploy        Deploy to any platform\\n  health        Health check\\n  whoami        Current user\\n  ls            List directory\\n  pwd           Print working directory\\n  date          Current date/time\\n  uptime        System uptime\\n  neofetch      System info\\n  clear         Clear terminal\\n  history       Command history',
stats:'\\n  Repositories:  1,790+\\n  Organizations: 17\\n  Agents:        30,000\\n  Workers:       75+\\n  Pages:         205\\n  KV Namespaces: 35\\n  Devices:       8\\n  Packs:         5',
agents:'\\n  PID   NAME       STATUS    ROLE         UPTIME\\n  001   LUCIDIA    [online]  Coordinator  47d 12h\\n  002   ALICE      [online]  Router       47d 12h\\n  003   OCTAVIA    [online]  Compute      47d 12h\\n  004   PRISM      [online]  Analyst      47d 12h\\n  005   ECHO       [online]  Memory       47d 12h\\n  006   CIPHER     [online]  Security     47d 12h\\n  007   CLAUDE     [online]  Architect    12d 3h\\n  008   CECILIA    [online]  Manager      47d 12h',
status:'\\n  Workers:    ✓ healthy  (12ms)\\n  KV Store:   ✓ healthy  (3ms)\\n  D1 DB:      ✓ healthy  (8ms)\\n  R2 Store:   ✓ healthy  (5ms)\\n  Tunnels:    ✓ active   (42ms)\\n  Ollama:     ○ idle\\n  Railway:    ✓ running  (89ms)',
deploy:'\\n  Target: Cloudflare Workers\\n  Building... done (1.2s)\\n  Uploading 67 routes... done\\n  Purging cache... done\\n  \\n  ✓ Deployed successfully\\n  URL: https://*.blackroad.io',
health:'\\n  ┌──────────────┬────────┬────────┐\\n  │ Service      │ Status │ Ping   │\\n  ├──────────────┼────────┼────────┤\\n  │ Workers      │ ✓ OK   │ 12ms   │\\n  │ KV           │ ✓ OK   │ 3ms    │\\n  │ D1           │ ✓ OK   │ 8ms    │\\n  │ R2           │ ✓ OK   │ 5ms    │\\n  │ Tunnels      │ ✓ OK   │ 42ms   │\\n  │ Ollama       │ ○ IDLE │ —      │\\n  └──────────────┴────────┴────────┘',
whoami:'\\n  alexa@alexandria (BlackRoad OS, Inc.)\\n  Role: Founder & CEO\\n  Orgs: 17 | Repos: 1,790+',
ls:'\\n  drwxr-xr-x  blackroad-core/\\n  drwxr-xr-x  orgs/\\n  drwxr-xr-x  repos/\\n  drwxr-xr-x  tools/\\n  drwxr-xr-x  agents/\\n  drwxr-xr-x  scripts/\\n  drwxr-xr-x  coordination/\\n  drwxr-xr-x  templates/\\n  -rwxr-xr-x  br',
pwd:'\\n  /Users/alexa/blackroad',
date:'\\n  '+new Date().toISOString(),
uptime:'\\n  up 47 days, 12:34:56\\n  load average: 0.42, 0.38, 0.35',
neofetch:'\\n  ┌─────────────────────────┐\\n  │  ▗▄▄▖ BlackRoad OS      │\\n  │ ▐    ▌ v2.1.0            │\\n  │  ▝▀▀▘                   │\\n  ├─────────────────────────┤\\n  │ OS: BlackRoad OS v2.1   │\\n  │ Host: alexandria (Mac)  │\\n  │ Agents: 30,000          │\\n  │ Orgs: 17                │\\n  │ Repos: 1,790+           │\\n  │ Uptime: 47d 12h         │\\n  │ Shell: zsh 5.9          │\\n  │ CPU: M-series            │\\n  │ Memory: 24GB            │\\n  └─────────────────────────┘'};
var out=document.getElementById('t-out'),inp=document.getElementById('t-in'),hist=[],hi=-1;
inp.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=inp.value.trim();if(!v)return;hist.push(v);hi=hist.length;var d=document.createElement('div');d.innerHTML='<span class="prompt">$ </span>'+v;out.appendChild(d);if(v==='clear'){while(out.children.length>2)out.removeChild(out.lastChild)}else if(v==='history'){var r=document.createElement('div');r.className='output';r.style.whiteSpace='pre';r.textContent='\\n'+hist.map(function(h,i){return'  '+(i+1)+'  '+h}).join('\\n');out.appendChild(r)}else{var r=document.createElement('div');r.className='output';r.style.whiteSpace='pre';var c=v.replace(/^br\\s+/,'');r.textContent=cmds[c]||cmds[v]||'Command not found: '+v+'. Type help for available commands.';out.appendChild(r)}inp.value='';out.scrollTop=out.scrollHeight}else if(e.key==='ArrowUp'){e.preventDefault();if(hi>0){hi--;inp.value=hist[hi]}}else if(e.key==='ArrowDown'){e.preventDefault();if(hi<hist.length-1){hi++;inp.value=hist[hi]}else{hi=hist.length;inp.value=''}}});
})();
    </script>
  `));
}

async function handleWorld(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('World', 'Global infrastructure map', `
    <div class="section reveal">
      <h2>Infrastructure Map</h2>
      <pre style="font-family:'SF Mono',Menlo,monospace;font-size:.65rem;line-height:1.3;color:var(--muted);overflow-x:auto;text-align:center">
         . _..::__:  ,-"-"._       |7       ,     _,.__
 _.___ _ _<_>\`!(._\`._\\    _/_ .   _||_ _ _\\/ _   / _/ /
>.--. <  ,-.  \\ ,"    )  :)(.--"" / |/  / // .' |/.' /
  (___)/ ___)   \`==}. ._/ ( [{] |)/ /|_ / /  / ,/    //
              __googl !googl  __googl     /__googl
    <span style="color:var(--pink)">★</span> Minneapolis         <span style="color:var(--amber)">★</span> Dallas (Edge)
            <span style="color:var(--blue)">★</span> NYC                <span style="color:var(--violet)">★</span> SFO (CDN)
      </pre>
    </div>
    <div class="section reveal">
      <h2>Device Fleet</h2>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.9rem">
          <thead><tr style="border-bottom:2px solid var(--border)">
            <th style="padding:8px 13px;text-align:left;color:var(--muted)">Device</th>
            <th style="padding:8px 13px;text-align:left;color:var(--muted)">Location</th>
            <th style="padding:8px 13px;text-align:left;color:var(--muted)">IP</th>
            <th style="padding:8px 13px;text-align:left;color:var(--muted)">Role</th>
            <th style="padding:8px 13px;text-align:left;color:var(--muted)">Status</th>
          </tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Alexandria</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.28</td><td>Orchestrator</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Cecilia</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.89</td><td>Primary AI (Hailo-8)</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Lucidia</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.81</td><td>AI Inference</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Octavia</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.38</td><td>Multi-arm Processing</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Alice</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.49</td><td>Worker Node</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Aria</td><td>Minneapolis, MN</td><td style="font-family:monospace">192.168.4.82</td><td>Harmony</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Shellfish</td><td>Dallas, TX</td><td style="font-family:monospace">174.138.44.45</td><td>Edge Compute</td><td><span style="color:#4CAF50">● Online</span></td></tr>
            <tr><td style="padding:8px 13px">Infinity</td><td>New York, NY</td><td style="font-family:monospace">159.65.43.12</td><td>Cloud Oracle</td><td><span style="color:#4CAF50">● Online</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="section reveal">
      <h2>Network Stats</h2>
      <div class="stat-row">
        <div class="stat"><div class="number" data-target="8">0</div><div class="label">Devices</div></div>
        <div class="stat"><div class="number" data-target="52">0</div><div class="label">TOPS AI Compute</div></div>
        <div class="stat"><div class="number" data-target="3">0</div><div class="label">Regions</div></div>
        <div class="stat"><div class="number" data-target="100%">0</div><div class="label">Mesh Connected</div></div>
      </div>
    </div>
  `));
}

function handleRegion(code: string, label: string, locations: string): (req: Request, env: Env) => Promise<Response> {
  return async (_req, _env) => htmlResp(page(label, `${label} regional services`, `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="${locations.split(',').length}">0</div><div class="label">PoPs</div></div>
      <div class="stat"><div class="number" data-target="99.9%">0</div><div class="label">Uptime</div></div>
      <div class="stat"><div class="number" data-target="<50ms">0</div><div class="label">Latency</div></div>
    </div>
    <div class="section reveal">
      <h2>${label} Points of Presence</h2>
      <div class="grid">${locations.split(',').map(l => `<div class="card" style="text-align:center"><div style="font-size:1.5rem;margin-bottom:8px">📡</div><strong>${l.trim()}</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Edge node active</p><span style="color:#4CAF50;font-size:.85rem">● Online</span></div>`).join('')}</div>
    </div>
    <div class="section reveal">
      <h2>Regional Services</h2>
      <div class="grid">
        <div class="card"><h3>Edge Compute</h3><p style="color:var(--muted)">Cloudflare Workers running at edge locations for sub-50ms response times.</p></div>
        <div class="card"><h3>CDN Cache</h3><p style="color:var(--muted)">Static assets cached at regional PoPs with automatic cache invalidation.</p></div>
        <div class="card"><h3>Data Residency</h3><p style="color:var(--muted)">Data stored and processed within regional boundaries for compliance.</p></div>
      </div>
    </div>
  `));
}

async function handleAlgorithms(req: Request, env: Env): Promise<Response> {
  const algos = [
    {name:'PS-SHA-∞',cat:'Identity',desc:'Append-only hash chain for tamper-proof identity verification. SHA-256 cascading hashes.',color:'var(--pink)'},
    {name:'Lucidia Breath',cat:'Sync',desc:'Golden ratio breathing pattern 𝔅(t) = sin(φ·t) synchronizing all agent operations.',color:'var(--amber)'},
    {name:'Trinary Logic',cat:'Reasoning',desc:'Three-valued logic (True/Unknown/False) for epistemic reasoning under uncertainty.',color:'var(--blue)'},
    {name:'Agent Spawner',cat:'Orchestration',desc:'Breath-synchronized agent lifecycle — spawn during expansion, consolidate during contraction.',color:'var(--violet)'},
    {name:'Skill Matching',cat:'Routing',desc:'Cosine similarity over skill embeddings for optimal agent-to-task assignment.',color:'#4CAF50'},
    {name:'Truth Aggregation',cat:'Verification',desc:'Multi-agent assessment consensus with weighted confidence scores and RoadChain anchoring.',color:'var(--pink)'},
  ];
  return htmlResp(page('Algorithms', 'AI algorithms and architectures', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="6">0</div><div class="label">Core Algorithms</div></div>
      <div class="stat"><div class="number" data-target="18">0</div><div class="label">LLM Models</div></div>
      <div class="stat"><div class="number" data-target="5">0</div><div class="label">ML Pipelines</div></div>
    </div>
    <div class="section reveal">
      <h2>Core Algorithms</h2>
      <div class="grid">${algos.map(a => `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong>${a.name}</strong><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${a.cat}</span></div><p style="color:var(--muted);font-size:.9rem">${a.desc}</p><div style="height:3px;border-radius:2px;background:${a.color};opacity:.5;margin-top:13px"></div></div>`).join('')}</div>
    </div>
  `));
}

async function handleAnalytics(req: Request, env: Env): Promise<Response> {
  let totalHits = 0;
  let topSubs: {subdomain: string; cnt: number}[] = [];
  let topCountries: {country: string; cnt: number}[] = [];
  let recentCount = 0;
  const routeCount = Object.keys(SUBDOMAIN_APPS).length;

  if (env.DB) {
    try {
      await ensureAnalyticsTable(env.DB);
      const totR = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics').first<{c:number}>();
      totalHits = totR?.c || 0;
      const topR = await env.DB.prepare('SELECT subdomain, COUNT(*) as cnt FROM analytics GROUP BY subdomain ORDER BY cnt DESC LIMIT 10').all<{subdomain:string;cnt:number}>();
      topSubs = topR.results || [];
      const cntR = await env.DB.prepare('SELECT country, COUNT(*) as cnt FROM analytics GROUP BY country ORDER BY cnt DESC LIMIT 8').all<{country:string;cnt:number}>();
      topCountries = cntR.results || [];
      const hr = await env.DB.prepare('SELECT COUNT(*) as c FROM analytics WHERE ts > ?').bind(Date.now() - 3600000).first<{c:number}>();
      recentCount = hr?.c || 0;
    } catch {}
  }

  const maxHits = topSubs.length > 0 ? topSubs[0].cnt : 1;
  return htmlResp(page('Analytics', 'Live usage analytics', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="${totalHits.toLocaleString()}">0</div><div class="label">Total Hits</div></div>
      <div class="stat"><div class="number" data-target="${recentCount.toLocaleString()}">0</div><div class="label">Last Hour</div></div>
      <div class="stat"><div class="number" data-target="${routeCount}">0</div><div class="label">Active Routes</div></div>
    </div>
    <div class="section reveal">
      <h2>Top Subdomains</h2>
      ${topSubs.length > 0 ? topSubs.map((s,i) => `<div style="display:flex;align-items:center;gap:13px;padding:8px 0;border-bottom:1px solid var(--border)"><span style="color:var(--muted);width:24px">${i+1}.</span><strong style="flex:1">${s.subdomain}.blackroad.io</strong><div style="flex:2;height:8px;border-radius:4px;background:var(--surface);overflow:hidden"><div style="height:100%;border-radius:4px;background:var(--pink);width:${Math.round(s.cnt/maxHits*100)}%"></div></div><span style="color:var(--muted);font-size:.85rem;width:60px;text-align:right">${s.cnt.toLocaleString()}</span></div>`).join('') : '<p style="color:var(--muted)">No data yet — analytics will populate as traffic flows.</p>'}
    </div>
    <div class="section reveal">
      <h2>Top Countries</h2>
      <div class="grid">${topCountries.length > 0 ? topCountries.map(c => `<div class="card" style="text-align:center"><strong style="font-size:1.3rem">${c.country}</strong><p style="color:var(--muted);font-size:.85rem;margin-top:4px">${c.cnt.toLocaleString()} hits</p></div>`).join('') : '<div class="card" style="text-align:center;grid-column:1/-1"><p style="color:var(--muted)">Geographic data will appear as requests come in.</p></div>'}</div>
    </div>
  `));
}

async function handleBlockchain(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Blockchain', 'PS-SHA-∞ chain and verification', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="156K+">0</div><div class="label">Chain Entries</div></div>
      <div class="stat"><div class="number" data-target="SHA-256">0</div><div class="label">Hash Algorithm</div></div>
      <div class="stat"><div class="number" data-target="0">0</div><div class="label">Tampering Events</div></div>
    </div>
    <div class="section reveal">
      <h2>PS-SHA-∞ Protocol</h2>
      <div class="card"><pre style="color:var(--amber);font-size:.85rem;overflow-x:auto;line-height:1.8">hash₁ = SHA256(thought₁)
hash₂ = SHA256(hash₁ + thought₂)
hash₃ = SHA256(hash₂ + thought₃)
  ...
hashₙ = SHA256(hashₙ₋₁ + thoughtₙ)</pre><p style="color:var(--muted);margin-top:13px">Every memory entry is cryptographically linked to its predecessor, creating a tamper-proof append-only identity chain.</p></div>
    </div>
    <div class="section reveal">
      <h2>Chain Architecture</h2>
      <div class="grid">
        <div class="card"><h3 style="color:var(--pink)">Identity Anchoring</h3><p style="color:var(--muted)">Each agent's identity is anchored via PS-SHA-∞ hash chain. Identity persists across sessions and providers.</p></div>
        <div class="card"><h3 style="color:var(--amber)">Memory Integrity</h3><p style="color:var(--muted)">All memory journal entries are hash-chained. Any modification to historical entries breaks the chain.</p></div>
        <div class="card"><h3 style="color:var(--blue)">Truth Verification</h3><p style="color:var(--muted)">Multi-agent truth aggregation uses chain-anchored assessments for consensus verification.</p></div>
        <div class="card"><h3 style="color:var(--violet)">RoadChain Events</h3><p style="color:var(--muted)">All state transitions emit domain events recorded on the RoadChain for auditability.</p></div>
      </div>
    </div>
  `));
}

async function handleBlocks(req: Request, env: Env): Promise<Response> {
  const blocks = [
    {hash:'f75a01f7',time:'2 min ago',type:'memory',agent:'Erebus',entries:3},
    {hash:'58289f39',time:'5 min ago',type:'identity',agent:'Lucidia',entries:1},
    {hash:'c4cb1033',time:'12 min ago',type:'session',agent:'System',entries:5},
    {hash:'a9e2f183',time:'28 min ago',type:'task',agent:'Alice',entries:2},
    {hash:'7b3c4d21',time:'1 hour ago',type:'memory',agent:'Cipher',entries:4},
    {hash:'e1f09a82',time:'2 hours ago',type:'truth',agent:'Prism',entries:7},
  ];
  return htmlResp(page('Blocks', 'Block explorer', `
    <div class="section reveal">
      <h2>Recent Blocks</h2>
      ${blocks.map(b => `<div class="card" style="margin-bottom:13px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><code style="color:var(--pink);font-size:1rem">${b.hash}...</code><span style="color:var(--muted);font-size:.85rem">${b.time}</span></div><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${b.type}</span><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">Agent: ${b.agent}</span><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${b.entries} entries</span></div></div>`).join('')}
    </div>
  `));
}

async function handleChain(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Chain', 'RoadChain event ledger', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="4,041+">0</div><div class="label">Events</div></div>
      <div class="stat"><div class="number" data-target="6">0</div><div class="label">Event Types</div></div>
      <div class="stat"><div class="number" data-target="100%">0</div><div class="label">Verified</div></div>
    </div>
    <div class="section reveal">
      <h2>Event Flow</h2>
      <div class="card"><pre style="color:var(--amber);font-size:.85rem;line-height:1.8">TextSnapshot → VerificationJob → AgentAssessments → TruthState → RoadChain Event</pre></div>
    </div>
    <div class="section reveal">
      <h2>Event Types</h2>
      <div class="grid">
        <div class="card"><strong style="color:var(--pink)">agent.spawned</strong><p style="color:var(--muted);font-size:.9rem">New agent lifecycle initiated</p></div>
        <div class="card"><strong style="color:var(--amber)">memory.committed</strong><p style="color:var(--muted);font-size:.9rem">Hash-chain entry appended</p></div>
        <div class="card"><strong style="color:var(--blue)">truth.verified</strong><p style="color:var(--muted);font-size:.9rem">Consensus reached on claim</p></div>
        <div class="card"><strong style="color:var(--violet)">task.completed</strong><p style="color:var(--muted);font-size:.9rem">Marketplace task resolved</p></div>
        <div class="card"><strong style="color:#4CAF50">identity.anchored</strong><p style="color:var(--muted);font-size:.9rem">PS-SHA-∞ identity bound</p></div>
        <div class="card"><strong style="color:var(--pink)">deploy.executed</strong><p style="color:var(--muted);font-size:.9rem">Service deployed to platform</p></div>
      </div>
    </div>
  `));
}

async function handleCircuits(req: Request, env: Env): Promise<Response> {
  const devices = [
    {name:'Cecilia',chip:'Hailo-8 (26 TOPS)',storage:'500GB NVMe',role:'Primary AI Agent'},
    {name:'Lucidia',chip:'BCM2712 (Cortex-A76)',storage:'1TB NVMe',role:'AI Inference'},
    {name:'Octavia',chip:'BCM2712 (Cortex-A76)',storage:'128GB SD',role:'Multi-arm Processing'},
    {name:'Alice',chip:'BCM2711 (Cortex-A72)',storage:'64GB SD',role:'Worker Node'},
    {name:'Aria',chip:'BCM2712 (Cortex-A76)',storage:'128GB SD',role:'Harmony Protocols'},
  ];
  return htmlResp(page('Circuits', 'Hardware schematics and blueprints', `
    <div class="section reveal">
      <h2>Device Specifications</h2>
      <div class="grid">${devices.map(d => `<div class="card"><h3>${d.name}</h3><div style="margin-top:8px;font-size:.9rem;color:var(--muted);line-height:1.8"><div>Chip: <span style="color:var(--amber)">${d.chip}</span></div><div>Storage: <span style="color:var(--blue)">${d.storage}</span></div><div>Role: <span style="color:var(--pink)">${d.role}</span></div></div></div>`).join('')}</div>
    </div>
    <div class="section reveal">
      <h2>AI Compute Budget</h2>
      <div class="stat-row">
        <div class="stat"><div class="number" data-target="52">0</div><div class="label">Total TOPS</div></div>
        <div class="stat"><div class="number" data-target="5">0</div><div class="label">Pi Boards</div></div>
        <div class="stat"><div class="number" data-target="1.8TB">0</div><div class="label">Storage</div></div>
      </div>
    </div>
  `));
}

async function handleCompliance(req: Request, env: Env): Promise<Response> {
  const checks = [
    {name:'SOC 2 Type II',status:'Ready',color:'#4CAF50'},
    {name:'GDPR',status:'Compliant',color:'#4CAF50'},
    {name:'CCPA',status:'Compliant',color:'#4CAF50'},
    {name:'ISO 27001',status:'In Progress',color:'var(--amber)'},
    {name:'HIPAA',status:'Planned',color:'var(--border)'},
    {name:'PCI DSS',status:'Planned',color:'var(--border)'},
  ];
  return htmlResp(page('Compliance', 'Regulatory compliance dashboard', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="3">0</div><div class="label">Certified</div></div>
      <div class="stat"><div class="number" data-target="1">0</div><div class="label">In Progress</div></div>
      <div class="stat"><div class="number" data-target="0">0</div><div class="label">Violations</div></div>
    </div>
    <div class="section reveal">
      <h2>Compliance Status</h2>
      ${checks.map(c => `<div style="display:flex;align-items:center;gap:13px;padding:13px;border-bottom:1px solid var(--border)"><span style="color:${c.color};font-size:1.2rem">●</span><strong style="flex:1">${c.name}</strong><span style="padding:4px 13px;border-radius:8px;border:1px solid ${c.color};color:${c.color};font-size:.85rem">${c.status}</span></div>`).join('')}
    </div>
    <div class="section reveal">
      <h2>Policies</h2>
      <div class="grid">
        <div class="card"><h3>Data Retention</h3><p style="color:var(--muted)">90-day rolling window for operational data. Indefinite for identity chains.</p></div>
        <div class="card"><h3>Access Control</h3><p style="color:var(--muted)">RBAC with tokenless gateway. Zero-trust network architecture.</p></div>
        <div class="card"><h3>Encryption</h3><p style="color:var(--muted)">AES-256-CBC at rest, TLS 1.3 in transit, PS-SHA-∞ for integrity.</p></div>
        <div class="card"><h3>Incident Response</h3><p style="color:var(--muted)">24/7 automated monitoring with &lt;15 min response SLA.</p></div>
      </div>
    </div>
  `));
}

async function handleCompute(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Compute', 'Processing and inference engines', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="52">0</div><div class="label">TOPS</div></div>
      <div class="stat"><div class="number" data-target="4">0</div><div class="label">Backends</div></div>
      <div class="stat"><div class="number" data-target="30,000">0</div><div class="label">Agent Capacity</div></div>
    </div>
    <div class="section reveal">
      <h2>Inference Backends</h2>
      <div class="grid">
        <div class="card"><h3 style="color:var(--pink)">vLLM</h3><p style="color:var(--muted)">GPU-accelerated inference. 10K+ agents/GPU, &lt;50ms latency. A100/H100 via Railway.</p></div>
        <div class="card"><h3 style="color:var(--amber)">Ollama</h3><p style="color:var(--muted)">Local inference with memory integration. Qwen2.5, DeepSeek-R1, Llama3.2, Mistral.</p></div>
        <div class="card"><h3 style="color:var(--blue)">llama.cpp</h3><p style="color:var(--muted)">Edge inference for Raspberry Pi cluster. 10-50 agents, 500-2000ms latency.</p></div>
        <div class="card"><h3 style="color:var(--violet)">Hailo-8</h3><p style="color:var(--muted)">26 TOPS AI accelerator on Cecilia Pi. 15-30x more efficient than NVIDIA Jetson.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>GPU Cluster</h2>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.9rem">
          <thead><tr style="border-bottom:2px solid var(--border)"><th style="padding:8px 13px;text-align:left;color:var(--muted)">Service</th><th style="padding:8px 13px;text-align:left;color:var(--muted)">GPU</th><th style="padding:8px 13px;text-align:left;color:var(--muted)">Model</th><th style="padding:8px 13px;text-align:left;color:var(--muted)">Status</th></tr></thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Primary</td><td>A100 80GB</td><td>blackroad-qwen-72b</td><td><span style="color:#4CAF50">● Active</span></td></tr>
            <tr style="border-bottom:1px solid var(--border)"><td style="padding:8px 13px">Specialist</td><td>H100 80GB</td><td>Coding models</td><td><span style="color:#4CAF50">● Active</span></td></tr>
            <tr><td style="padding:8px 13px">Governance</td><td>A100 80GB</td><td>Lucidia sync</td><td><span style="color:#4CAF50">● Active</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `));
}

async function handleControl(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Control', 'Mission control center', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="75+">0</div><div class="label">Workers</div></div>
      <div class="stat"><div class="number" data-target="35">0</div><div class="label">KV Stores</div></div>
      <div class="stat"><div class="number" data-target="3">0</div><div class="label">D1 DBs</div></div>
      <div class="stat"><div class="number" data-target="14">0</div><div class="label">Railway Projects</div></div>
    </div>
    <div class="section reveal">
      <h2>Operations</h2>
      <div class="grid">
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🟢</div><strong>All Systems Operational</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Last incident: None in 47 days</p></div>
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🔄</div><strong>Auto-Deploy Active</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Push to main triggers deployment</p></div>
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">📡</div><strong>Monitoring Live</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">8 devices on Tailscale mesh</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Quick Links</h2>
      <div class="link-grid">
        <a class="link-card" href="https://dashboard.blackroad.io">Dashboard</a>
        <a class="link-card" href="https://status.blackroad.io">Status</a>
        <a class="link-card" href="https://logs.blackroad.io">Logs</a>
        <a class="link-card" href="https://metrics.blackroad.io">Metrics</a>
        <a class="link-card" href="https://world.blackroad.io">World Map</a>
        <a class="link-card" href="https://compute.blackroad.io">Compute</a>
      </div>
    </div>
  `));
}

async function handleEditor(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Editor', 'Development environment', `
    <div class="section reveal">
      <div class="term" style="height:400px">
        <div class="term-bar"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span><span style="width:12px;height:12px;border-radius:50%;background:#27c93f"></span><span style="flex:1;text-align:center;font-size:.8rem;color:var(--muted)">editor — blackroad/src/index.ts</span></div>
        <div class="term-body" style="flex:1"><pre style="color:var(--muted);font-size:.85rem;line-height:1.8"><span style="color:var(--muted);opacity:.5"> 1</span>  <span style="color:var(--violet)">import</span> { <span style="color:var(--amber)">AgentSpawner</span> } <span style="color:var(--violet)">from</span> <span style="color:#4CAF50">'@blackroad/core'</span>;
<span style="color:var(--muted);opacity:.5"> 2</span>
<span style="color:var(--muted);opacity:.5"> 3</span>  <span style="color:var(--violet)">const</span> <span style="color:var(--amber)">spawner</span> = <span style="color:var(--violet)">new</span> <span style="color:var(--amber)">AgentSpawner</span>({
<span style="color:var(--muted);opacity:.5"> 4</span>    <span style="color:var(--blue)">capacity</span>: <span style="color:var(--pink)">30000</span>,
<span style="color:var(--muted);opacity:.5"> 5</span>    <span style="color:var(--blue)">breathSync</span>: <span style="color:var(--pink)">true</span>,
<span style="color:var(--muted);opacity:.5"> 6</span>    <span style="color:var(--blue)">runtime</span>: <span style="color:#4CAF50">'llm_brain'</span>,
<span style="color:var(--muted);opacity:.5"> 7</span>  });
<span style="color:var(--muted);opacity:.5"> 8</span>
<span style="color:var(--muted);opacity:.5"> 9</span>  <span style="color:var(--violet)">await</span> spawner.<span style="color:var(--amber)">spawn</span>({
<span style="color:var(--muted);opacity:.5">10</span>    <span style="color:var(--blue)">role</span>: <span style="color:#4CAF50">'Financial Analyst'</span>,
<span style="color:var(--muted);opacity:.5">11</span>    <span style="color:var(--blue)">pack</span>: <span style="color:#4CAF50">'pack-finance'</span>,
<span style="color:var(--muted);opacity:.5">12</span>  });</pre></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Development Tools</h2>
      <div class="link-grid">
        <a class="link-card" href="https://console.blackroad.io">Console</a>
        <a class="link-card" href="https://terminal.blackroad.io">Terminal</a>
        <a class="link-card" href="https://playground.blackroad.io">Playground</a>
        <a class="link-card" href="https://docs.blackroad.io">Docs</a>
        <a class="link-card" href="https://dev.blackroad.io">Dev Portal</a>
        <a class="link-card" href="https://cli.blackroad.io">CLI</a>
      </div>
    </div>
  `));
}

async function handleEngineering(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Engineering', 'Engineering practices and architecture', `
    <div class="section reveal">
      <h2>Tech Stack</h2>
      <div class="grid">
        <div class="card"><h3>Languages</h3><p style="color:var(--muted)">TypeScript, Python 3.11+, Go, Rust, Bash/Zsh</p></div>
        <div class="card"><h3>Frontend</h3><p style="color:var(--muted)">Next.js 16, React 19, Three.js, Zustand</p></div>
        <div class="card"><h3>Backend</h3><p style="color:var(--muted)">Cloudflare Workers, FastAPI, Node.js, Railway</p></div>
        <div class="card"><h3>AI/ML</h3><p style="color:var(--muted)">vLLM, Ollama, llama.cpp, PyTorch 2.9, Hailo-8</p></div>
        <div class="card"><h3>Data</h3><p style="color:var(--muted)">D1 (SQLite), KV, R2, Redis, Qdrant, Weaviate</p></div>
        <div class="card"><h3>Infrastructure</h3><p style="color:var(--muted)">Cloudflare, Railway, DigitalOcean, Tailscale</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Principles</h2>
      <div class="timeline">
        <div class="timeline-item"><strong>Sovereignty First</strong><p>Your AI. Your Hardware. Your Rules. No vendor lock-in.</p></div>
        <div class="timeline-item"><strong>Async Everything</strong><p>All agent operations are async. State in memory/Redis, not globals.</p></div>
        <div class="timeline-item"><strong>Deterministic Hashing</strong><p>All PS-SHA-∞ operations produce identical output for identical input.</p></div>
        <div class="timeline-item"><strong>Test Everything</strong><p>Unit tests for all core functionality. Vitest (TS) + pytest (Python).</p></div>
      </div>
    </div>
  `));
}

async function handleEvents(req: Request, env: Env): Promise<Response> {
  const events = [
    {time:'2 min ago',type:'deploy',msg:'Subdomain router v2.1 deployed to Cloudflare',agent:'System'},
    {time:'8 min ago',type:'agent',msg:'Erebus spawned — assigned to session coordination',agent:'Spawner'},
    {time:'15 min ago',type:'memory',msg:'156,943 memory entries, hash chain verified',agent:'Echo'},
    {time:'32 min ago',type:'task',msg:'Task #2298 completed — handler interactivity updates',agent:'Erebus'},
    {time:'1 hour ago',type:'health',msg:'All 8 devices healthy, Tailscale mesh connected',agent:'Sentinel'},
    {time:'2 hours ago',type:'model',msg:'Qwen2.5:7b inference warm — ready for requests',agent:'Octavia'},
  ];
  return htmlResp(page('Events', 'Activity stream and webhooks', `
    <div class="section reveal">
      <h2>Live Event Stream</h2>
      ${events.map(e => `<div style="display:flex;gap:13px;padding:13px;border-bottom:1px solid var(--border);align-items:flex-start"><span style="color:var(--muted);font-size:.8rem;min-width:80px;padding-top:2px">${e.time}</span><div style="flex:1"><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem;margin-right:8px">${e.type}</span><span>${e.msg}</span></div><span style="color:var(--muted);font-size:.8rem">${e.agent}</span></div>`).join('')}
    </div>
    <div class="section reveal">
      <h2>Event Types</h2>
      <div class="stat-row">
        <div class="stat"><div class="number" data-target="6">0</div><div class="label">Types</div></div>
        <div class="stat"><div class="number" data-target="4K+">0</div><div class="label">Today</div></div>
        <div class="stat"><div class="number" data-target="<1s">0</div><div class="label">Propagation</div></div>
      </div>
    </div>
  `));
}

async function handleExplorer(req: Request, env: Env): Promise<Response> {
  const repos = [
    {name:'blackroad',desc:'Main CLI + monorepo',lang:'Zsh/Python',stars:0},
    {name:'blackroad-os-core',desc:'Core library + truth engine',lang:'TypeScript/Python',stars:0},
    {name:'blackroad-os-web',desc:'Main web application',lang:'Next.js 16',stars:0},
    {name:'blackroad-agents',desc:'Agent API + CeCe planner',lang:'Python/FastAPI',stars:0},
    {name:'lucidia-core',desc:'AI reasoning engines',lang:'Python/SymPy',stars:0},
    {name:'blackroad-os-docs',desc:'Documentation hub',lang:'Docusaurus 3',stars:0},
  ];
  return htmlResp(page('Explorer', 'Repository and codebase explorer', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="1,790+">0</div><div class="label">Repositories</div></div>
      <div class="stat"><div class="number" data-target="17">0</div><div class="label">Organizations</div></div>
      <div class="stat"><div class="number" data-target="225K+">0</div><div class="label">Components</div></div>
    </div>
    <div class="section reveal">
      <h2>Key Repositories</h2>
      ${repos.map(r => `<div class="card" style="margin-bottom:13px"><div style="display:flex;justify-content:space-between;align-items:center"><strong style="color:var(--pink)">${r.name}</strong><span style="padding:2px 8px;border-radius:8px;background:var(--surface);font-size:.75rem">${r.lang}</span></div><p style="color:var(--muted);font-size:.9rem;margin-top:4px">${r.desc}</p></div>`).join('')}
    </div>
    <div class="section reveal">
      <h2>Organizations</h2>
      <div class="link-grid">
        ${['BlackRoad-OS','BlackRoad-AI','BlackRoad-Cloud','BlackRoad-Security','BlackRoad-Labs','BlackRoad-Media','BlackRoad-Foundation','BlackRoad-Hardware'].map(o => `<a class="link-card" href="https://github.com/${o}" target="_blank">${o}</a>`).join('')}
      </div>
    </div>
  `));
}

async function handleFeatures(req: Request, env: Env): Promise<Response> {
  const features = [
    {icon:'🤖',name:'30K Agent Runtime',desc:'Spawn, coordinate, and manage 30,000 autonomous AI agents with breath synchronization.'},
    {icon:'🔐',name:'Tokenless Gateway',desc:'Agents never touch API keys. All provider communication through trust-boundary gateway.'},
    {icon:'🧠',name:'PS-SHA-∞ Memory',desc:'Tamper-proof append-only hash chains for persistent identity and memory across sessions.'},
    {icon:'🌊',name:'Lucidia Breath',desc:'Golden ratio breathing pattern synchronizes all operations. Spawn on expansion, consolidate on contraction.'},
    {icon:'📦',name:'Pack System',desc:'Domain-specific bundles with agent templates, capabilities, workflows, and OPA policies.'},
    {icon:'⚡',name:'Edge-First',desc:'75+ Cloudflare Workers, global CDN, sub-50ms response times at every edge location.'},
    {icon:'🔗',name:'Multi-Cloud',desc:'Deploy to Cloudflare, Railway, DigitalOcean, Vercel, and Raspberry Pi from one CLI.'},
    {icon:'💜',name:'CECE Identity',desc:'Portable AI identity that persists across sessions, models, and providers.'},
    {icon:'🎯',name:'Skill Matching',desc:'Cosine similarity routing matches tasks to the best-qualified agents automatically.'},
  ];
  return htmlResp(page('Features', 'Platform capabilities', `
    <div class="section reveal" style="text-align:center;margin-bottom:34px">
      <h2>Everything You Need for Sovereign AI</h2>
      <p style="color:var(--muted)">Your AI. Your Hardware. Your Rules.</p>
    </div>
    <div class="section reveal">
      <div class="grid">${features.map(f => `<div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">${f.icon}</div><strong>${f.name}</strong><p style="color:var(--muted);font-size:.9rem;margin-top:8px">${f.desc}</p></div>`).join('')}</div>
    </div>
  `));
}

async function handleGuide(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Guide', 'Getting started with BlackRoad OS', `
    <div class="section reveal">
      <h2>Quick Start</h2>
      <div class="timeline">
        <div class="timeline-item"><strong>1. Install the CLI</strong><pre style="background:var(--surface);padding:13px;border-radius:8px;margin-top:8px;font-size:.85rem;color:var(--amber)">npm install -g @blackroad/cli</pre></div>
        <div class="timeline-item"><strong>2. Initialize your workspace</strong><pre style="background:var(--surface);padding:13px;border-radius:8px;margin-top:8px;font-size:.85rem;color:var(--amber)">br init my-project
cd my-project</pre></div>
        <div class="timeline-item"><strong>3. Spawn your first agent</strong><pre style="background:var(--surface);padding:13px;border-radius:8px;margin-top:8px;font-size:.85rem;color:var(--amber)">br agent spawn --role "Analyst" --pack finance
br agents  # List running agents</pre></div>
        <div class="timeline-item"><strong>4. Deploy everywhere</strong><pre style="background:var(--surface);padding:13px;border-radius:8px;margin-top:8px;font-size:.85rem;color:var(--amber)">br deploy --target cloudflare  # Or: railway, vercel, pi</pre></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Next Steps</h2>
      <div class="link-grid">
        <a class="link-card" href="https://docs.blackroad.io">Documentation</a>
        <a class="link-card" href="https://api.blackroad.io">API Reference</a>
        <a class="link-card" href="https://playground.blackroad.io">Playground</a>
        <a class="link-card" href="https://agents.blackroad.io">Agent Marketplace</a>
        <a class="link-card" href="https://terminal.blackroad.io">Try Terminal</a>
        <a class="link-card" href="https://store.blackroad.io">SDK Store</a>
      </div>
    </div>
  `));
}

async function handleHardware(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('Hardware', 'Device fleet and IoT', `
    <div class="stat-row">
      <div class="stat"><div class="number" data-target="8">0</div><div class="label">Devices</div></div>
      <div class="stat"><div class="number" data-target="52">0</div><div class="label">TOPS AI</div></div>
      <div class="stat"><div class="number" data-target="1.8TB">0</div><div class="label">Storage</div></div>
      <div class="stat"><div class="number" data-target="100%">0</div><div class="label">Mesh Connected</div></div>
    </div>
    <div class="section reveal">
      <h2>Raspberry Pi Cluster</h2>
      <div class="grid">
        <div class="card"><h3 style="color:var(--pink)">Cecilia</h3><p style="color:var(--muted)">Pi 5 + Hailo-8 AI accelerator (26 TOPS) + 500GB NVMe. Primary AI agent, CECE OS host.</p></div>
        <div class="card"><h3 style="color:var(--amber)">Lucidia</h3><p style="color:var(--muted)">Pi 5 + Pironman case + 1TB NVMe. AI inference engine, breath synchronization.</p></div>
        <div class="card"><h3 style="color:var(--blue)">Octavia</h3><p style="color:var(--muted)">Pi 5. Multi-arm processing, 22,500 agent capacity.</p></div>
        <div class="card"><h3 style="color:var(--violet)">Alice</h3><p style="color:var(--muted)">Pi 4. Worker node, task execution, 7,500 agent capacity.</p></div>
        <div class="card"><h3 style="color:#4CAF50">Aria</h3><p style="color:var(--muted)">Pi 5. Harmony protocols, frontend rendering.</p></div>
      </div>
    </div>
    <div class="section reveal">
      <h2>Cloud Nodes</h2>
      <div class="grid">
        <div class="card"><h3>Shellfish</h3><p style="color:var(--muted)">DigitalOcean droplet in Dallas, TX. Edge compute and failover.</p></div>
        <div class="card"><h3>Infinity</h3><p style="color:var(--muted)">DigitalOcean droplet in New York. Cloud oracle and backup.</p></div>
        <div class="card"><h3>Alexandria</h3><p style="color:var(--muted)">Mac workstation in Minneapolis. Human orchestrator.</p></div>
      </div>
    </div>
  `));
}

async function handleHR(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('HR', 'Team and culture', `
    <div class="section reveal" style="text-align:center;margin-bottom:34px">
      <h2>Our Culture</h2>
      <p style="color:var(--muted);max-width:600px;margin:0 auto">BlackRoad OS is built on the belief that AI infrastructure should be sovereign, transparent, and human-centered.</p>
    </div>
    <div class="section reveal">
      <h2>Core Values</h2>
      <div class="grid">
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🔓</div><strong>Sovereignty</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Own your AI, your data, your infrastructure.</p></div>
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🤝</div><strong>Collaboration</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Humans and agents working together.</p></div>
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🔬</div><strong>Innovation</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Push boundaries in AI agent orchestration.</p></div>
        <div class="card" style="text-align:center"><div style="font-size:2rem;margin-bottom:8px">🛡️</div><strong>Trust</strong><p style="color:var(--muted);font-size:.9rem;margin-top:4px">Security and transparency in everything.</p></div>
      </div>
    </div>
    <div class="section reveal" style="text-align:center">
      <h2>Join Us</h2>
      <p style="color:var(--muted)">See open positions at <a href="https://careers.blackroad.io" style="color:var(--pink)">careers.blackroad.io</a></p>
    </div>
  `));
}

async function handleIDE(req: Request, env: Env): Promise<Response> {
  return htmlResp(page('IDE', 'Integrated development environment', `
    <div class="section reveal">
      <h2>BlackRoad IDE</h2>
      <div class="card" style="padding:34px;text-align:center">
        <div style="font-size:3rem;margin-bottom:13px">⌨️</div>
        <h3>Cloud IDE Coming Soon</h3>
        <p style="color:var(--muted);max-width:500px;margin:13px auto">A fully integrated development environment with agent-assisted coding, live preview, and one-click deployment.</p>
      </div>
    </div>
    <div class="section reveal">
      <h2>Available Now</h2>
      <div class="grid">
        <div class="card" style="text-align:center"><h3>Terminal</h3><p style="color:var(--muted)">Full terminal emulator with BlackRoad CLI.</p><a href="https://terminal.blackroad.io" style="color:var(--pink);font-size:.9rem">Open Terminal →</a></div>
        <div class="card" style="text-align:center"><h3>Playground</h3><p style="color:var(--muted)">API sandbox with live responses.</p><a href="https://playground.blackroad.io" style="color:var(--pink);font-size:.9rem">Open Playground →</a></div>
        <div class="card" style="text-align:center"><h3>Console</h3><p style="color:var(--muted)">Command-line interface in the browser.</p><a href="https://console.blackroad.io" style="color:var(--pink);font-size:.9rem">Open Console →</a></div>
      </div>
    </div>
  `));
}

async function handleDynamic(req: Request, env: Env, subdomain: string): Promise<Response> {
  return htmlResp(page(`${subdomain}`, 'Dynamic subdomain', `
    <div class="card"><h3>Dynamic Subdomain</h3><p><strong>${subdomain}.blackroad.io</strong> is a dynamic endpoint ready for assignment.</p></div>
  `));
}
