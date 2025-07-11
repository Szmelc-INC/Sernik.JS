(async () => {
  // ─── 🔧 CONFIGURATION ─────────────────────────────────────
  const DATA_SOURCES = {
    global: '/config.json',
    team: '/data/team.json',
    projects: '/data/projects.json'
    // Add more like: faq: '/data/faq.json'
  };

  const TEMPLATES = [
    { selector: '#head', file: '/template/head.html', processHead: true },
    { selector: '#footer', file: '/template/footer.html' }
    // Add more: { selector: '#nav', file: '/template/nav.html' }
  ];
  // ─────────────────────────────────────────────────────────

  const config = {};

  // Load all JSON sources into `config`
  for (const [key, url] of Object.entries(DATA_SOURCES)) {
    try {
      const data = await fetch(url).then(r => r.json());
      config[key] = data;
      if (key === 'global' && typeof data === 'object') {
        Object.assign(config, data); // flatten global keys for easy ${title}
      }
      console.log(`[✓] Loaded ${key}: ${url}`);
    } catch (err) {
      console.warn(`[!] Failed to load ${key} from ${url}`, err);
    }
  }

  // Access deep config values like team[0].name or global.title
  function getDeepValue(path) {
    if (path in config) return config[path]; // fast flat check
    try {
      return path.split('.').reduce((acc, key) => {
        const match = key.match(/(.*?)\[(\d+)\]/);
        if (match) {
          const [, arrKey, index] = match;
          return acc?.[arrKey]?.[parseInt(index)];
        }
        return acc?.[key];
      }, config);
    } catch {
      return `[?${path}]`;
    }
  }

  // Replace ${key} → value in strings
  const applyVars = str =>
    str.replace(/\$\{(.*?)\}/g, (_, key) => getDeepValue(key) ?? `[?${key}]`);

  // Inject template into selector (handles <head> assets)
  async function injectTemplate({ selector, file, processHead = false }) {
    const target = document.querySelector(selector);
    if (!target) return;

    const raw = await fetch(file).then(r => r.text());
    const html = applyVars(raw);

    if (processHead) {
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Reconstruct <link> and <script> so they work
      temp.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = link.href;
        document.head.appendChild(l);
      });

      temp.querySelectorAll('script[src]').forEach(script => {
        const s = document.createElement('script');
        s.src = script.src;
        s.defer = script.defer || false;
        document.head.appendChild(s);
      });

      temp.childNodes.forEach(node => {
        if (node.tagName && !['SCRIPT', 'LINK'].includes(node.tagName)) {
          document.head.appendChild(node);
        }
      });
    } else {
      target.innerHTML = html;
    }

    console.log(`[+] Injected: ${file} → ${selector}`);
  }

  // Replace ${...} in all text nodes and element attributes
  function replaceVarsInDOM() {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes('${')) {
        node.nodeValue = applyVars(node.nodeValue);
      }
    }

    document.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(attr => {
        if (attr.value.includes('${')) {
          el.setAttribute(attr.name, applyVars(attr.value));
        }
      });
    });

    console.log(`[✓] DOM placeholder replacement complete`);
  }

  // ─── 🚀 Execute ──────────────────────────────────────────
  for (const tpl of TEMPLATES) {
    await injectTemplate(tpl);
  }

  replaceVarsInDOM();
})();
