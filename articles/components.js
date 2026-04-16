// components.js — version pour le sous-dossier articles/
// Tous les chemins sont préfixés par ../

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function renderHeader() {
  const page = getCurrentPage();
  const base = '../';

  const links = [
    { href: base + 'index.html',       label: 'Accueil',     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { href: base + 'careers.html',     label: 'Carrière',    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { href: base + 'products.html',    label: 'Produits',    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
    { href: base + 'portfolio.html',   label: 'Portfolio',   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { href: base + 'videos.html',      label: 'Vidéos',      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
    { href: base + 'partenaire.html',  label: 'Partenaires', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { href: base + 'blog.html',        label: 'Blog',        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
    { href: base + 'contact.html',     label: 'Contact',     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  ];

  // Les pages articles sont toutes dans articles/, aucune n'est about/solutions
  const revivalActive = false;

  const revivalDropdown = `
    <div class="nav__dropdown" id="revivalDropdown">
      <button class="nav__link nav__dropdown-trigger" id="revivalTrigger" aria-haspopup="true" aria-expanded="false">
        <span class="nav__link-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </span>
        <span class="nav__link-label">Revival</span>
        <svg class="nav__dropdown-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="nav__dropdown-menu" id="revivalMenu">
        <a href="${base}about.html" class="nav__dropdown-item">
          <span class="nav__dropdown-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <div>
            <div class="nav__dropdown-item-label">À propos</div>
            <div class="nav__dropdown-item-desc">Notre histoire & équipe</div>
          </div>
        </a>
        <a href="${base}solutions.html" class="nav__dropdown-item">
          <span class="nav__dropdown-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </span>
          <div>
            <div class="nav__dropdown-item-label">Solutions</div>
            <div class="nav__dropdown-item-desc">Nos services & offres</div>
          </div>
        </a>
      </div>
    </div>`;

  // Blog est toujours "actif" pour les pages articles (on est dans le blog)
  const navItems = links.map(l => {
    const isActive = l.href === base + 'blog.html';
    return `<a href="${l.href}" class="nav__link${isActive ? ' nav__link--active' : ''}">
      <span class="nav__link-icon">${l.icon}</span>
      <span class="nav__link-label">${l.label}</span>
    </a>`;
  }).join('');

  document.getElementById('header-placeholder').innerHTML = `
    <header class="header" id="header">
      <div class="container header__inner">
        <a href="${base}index.html" class="logo">
          <img src="${base}logo/logo.png" alt="Revival" class="logo__img" />
        </a>
        <nav class="nav" id="nav" role="navigation" aria-label="Navigation principale">
          <div class="nav__mobile-header">
            <a href="${base}index.html" class="logo">
              <img src="${base}logo/logo.png" alt="Revival" class="logo__img" />
            </a>
            <button class="nav__close" id="navClose" aria-label="Fermer le menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="nav__links-group">
            ${navItems.split('</a>')[0]}</a>
            ${revivalDropdown}
            ${navItems.split('</a>').slice(1).join('</a>')}
          </div>
          <div class="nav__mobile-footer">
            <div class="lang-switcher" id="langSwitcher">
              <button class="lang-btn" id="langBtn" aria-haspopup="true" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span id="langCurrent">FR</span>
                <svg class="lang-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="lang-dropdown" id="langDropdown">
                <button class="lang-option lang-option--active" data-lang="fr">
                  <span class="lang-flag">🇫🇷</span> Français
                </button>
                <button class="lang-option" data-lang="en">
                  <span class="lang-flag">🇬🇧</span> English
                </button>
              </div>
            </div>
            <a href="${base}contact.html" class="nav__cta-btn">Consultation gratuite →</a>
          </div>
        </nav>
        <div class="header__right">
          <div class="lang-switcher lang-switcher--desktop" id="langSwitcherDesktop">
            <button class="lang-btn" id="langBtnDesktop" aria-haspopup="true" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span id="langCurrentDesktop">FR</span>
              <svg class="lang-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="lang-dropdown" id="langDropdownDesktop">
              <button class="lang-option lang-option--active" data-lang="fr">
                <span class="lang-flag">🇫🇷</span> Français
              </button>
              <button class="lang-option" data-lang="en">
                <span class="lang-flag">🇬🇧</span> English
              </button>
            </div>
          </div>
          <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="nav-overlay" id="navOverlay"></div>`;

  // sticky
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  // burger + overlay
  const burger   = document.getElementById('burger');
  const nav      = document.getElementById('nav');
  const overlay  = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  function openNav() {
    nav.classList.add('open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    nav.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => nav.classList.contains('open') ? closeNav() : openNav());
  navClose && navClose.addEventListener('click', closeNav);
  overlay && overlay.addEventListener('click', closeNav);

  nav.querySelectorAll('.nav__link:not(.nav__dropdown-trigger)').forEach(l => l.addEventListener('click', closeNav));
  nav.querySelectorAll('.nav__dropdown-item').forEach(l => l.addEventListener('click', closeNav));

  // ── Revival dropdown ──
  const revivalTrigger = document.getElementById('revivalTrigger');
  const revivalMenu    = document.getElementById('revivalMenu');
  if (revivalTrigger && revivalMenu) {
    revivalTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = revivalMenu.classList.toggle('open');
      revivalTrigger.setAttribute('aria-expanded', open);
      revivalTrigger.closest('.nav__dropdown').classList.toggle('open', open);
    });
    document.addEventListener('click', (e) => {
      if (!revivalTrigger.closest('.nav__dropdown').contains(e.target)) {
        revivalMenu.classList.remove('open');
        revivalTrigger.setAttribute('aria-expanded', false);
        revivalTrigger.closest('.nav__dropdown').classList.remove('open');
      }
    });
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // ── Lang switcher mobile ──
  const langBtn      = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langCurrent  = document.getElementById('langCurrent');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langDropdown.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', open);
    });
    langDropdown.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.querySelectorAll('.lang-option').forEach(o => o.classList.remove('lang-option--active'));
        opt.classList.add('lang-option--active');
        langCurrent.textContent = opt.dataset.lang.toUpperCase();
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Lang switcher desktop ──
  const langBtnD      = document.getElementById('langBtnDesktop');
  const langDropdownD = document.getElementById('langDropdownDesktop');
  const langCurrentD  = document.getElementById('langCurrentDesktop');

  if (langBtnD && langDropdownD) {
    langBtnD.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = langDropdownD.classList.toggle('open');
      langBtnD.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      langDropdownD.classList.remove('open');
      langBtnD.setAttribute('aria-expanded', false);
    });
    langDropdownD.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdownD.querySelectorAll('.lang-option').forEach(o => o.classList.remove('lang-option--active'));
        opt.classList.add('lang-option--active');
        langCurrentD.textContent = opt.dataset.lang.toUpperCase();
        langDropdownD.classList.remove('open');
        langBtnD.setAttribute('aria-expanded', false);
      });
    });
  }
}

function renderFooter() {
  const base = '../';
  document.getElementById('footer-placeholder').innerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <a href="${base}index.html" class="logo logo--white">
            <img src="${base}logo/logo.png" alt="Revival" class="logo__img logo__img--white" />
          </a>
          <p>Nous concevons et déployons des applications performantes pour accélérer votre croissance.</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter / X">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>
        <div class="footer__links">
          <div class="footer__col">
            <h5>Services</h5>
            <a href="${base}solutions.html">Applications Web</a>
            <a href="${base}solutions.html">Applications Mobiles</a>
            <a href="${base}solutions.html">Automatisation</a>
            <a href="${base}solutions.html">Conseil & Stratégie</a>
          </div>
          <div class="footer__col">
            <h5>Produits</h5>
            <a href="${base}products.html">WordPress</a>
            <a href="${base}products.html">Laravel</a>
            <a href="${base}products.html">React & Next.js</a>
            <a href="${base}products.html">Modèles HTML</a>
          </div>
          <div class="footer__col">
            <h5>Entreprise</h5>
            <a href="${base}about.html">À propos</a>
            <a href="${base}careers.html">Carrière</a>
            <a href="${base}portfolio.html">Portfolio</a>
            <a href="${base}videos.html">Vidéos</a>
            <a href="${base}blog.html">Blog</a>
            <a href="${base}partenaire.html">Devenir partenaire</a>
            <a href="${base}contact.html">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          <p>© 2026 Revival. Tous droits réservés.</p>
          <div class="footer__legal">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>`;
}

function renderScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderScrollTop();
  initAnimations();
});
