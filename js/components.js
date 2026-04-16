// Shared header & footer injected on every page

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function renderHeader() {
  const page = getCurrentPage();
  const links = [
    { href: 'index.html',       label: 'Accueil',    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
    { href: 'careers.html',     label: 'Carrière',   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' },
    { href: 'products.html',    label: 'Produits',   icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
    { href: 'portfolio.html',   label: 'Portfolio',  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    { href: 'videos.html',      label: 'Vidéos',     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
    { href: 'partenaire.html',  label: 'Partenaires',icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
    { href: 'blog.html',        label: 'Blog',       icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' },
    { href: 'contact.html',     label: 'Contact',    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
  ];

  const revivalSubPages = ['about.html', 'solutions.html'];
  const revivalActive = revivalSubPages.includes(page);

  const revivalDropdown = `
    <div class="nav__dropdown" id="revivalDropdown">
      <button class="nav__link nav__dropdown-trigger${revivalActive ? ' nav__link--active' : ''}" id="revivalTrigger" aria-haspopup="true" aria-expanded="false">
        <span class="nav__link-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </span>
        <span class="nav__link-label">Revival</span>
        <svg class="nav__dropdown-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="nav__dropdown-menu" id="revivalMenu">
        <a href="about.html" class="nav__dropdown-item${page === 'about.html' ? ' active' : ''}">
          <span class="nav__dropdown-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <div>
            <div class="nav__dropdown-item-label">À propos</div>
            <div class="nav__dropdown-item-desc">Notre histoire & équipe</div>
          </div>
        </a>
        <a href="solutions.html" class="nav__dropdown-item${page === 'solutions.html' ? ' active' : ''}">
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

  const navItems = links.map(l =>
    `<a href="${l.href}" class="nav__link${page === l.href ? ' nav__link--active' : ''}">
      <span class="nav__link-icon">${l.icon}</span>
      <span class="nav__link-label">${l.label}</span>
    </a>`
  ).join('');

  document.getElementById('header-placeholder').innerHTML = `
    <header class="header" id="header">
      <div class="container header__inner">
        <a href="index.html" class="logo">
          <img src="logo/logo.png" alt="Revival" class="logo__img" />
        </a>
        <nav class="nav" id="nav" role="navigation" aria-label="Navigation principale">
          <div class="nav__mobile-header">
            <a href="index.html" class="logo">
              <img src="logo/logo.png" alt="Revival" class="logo__img" />
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
            <a href="contact.html" class="nav__cta-btn">Consultation gratuite →</a>
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
    // Fermer si clic ailleurs (desktop)
    document.addEventListener('click', (e) => {
      if (!revivalTrigger.closest('.nav__dropdown').contains(e.target)) {
        revivalMenu.classList.remove('open');
        revivalTrigger.setAttribute('aria-expanded', false);
        revivalTrigger.closest('.nav__dropdown').classList.remove('open');
      }
    });
  }

  // Escape key closes nav
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

  // ── Lang switcher mobile (inside drawer) ──
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
  document.getElementById('footer-placeholder').innerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <a href="index.html" class="logo logo--white">
            <img src="logo/logo.png" alt="TechCorp" class="logo__img logo__img--white" />
          </a>
          <p>Nous concevons et déployons des applications performantes pour accélérer votre croissance.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/share/1MppwEQAU3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/revivalgroup7/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/revival-group-drc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.youtube.com/@RevivalGroupe" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://x.com/groupe85249" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@revivalgroup7" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
            </a>
            <a href="https://whatsapp.com/channel/0029Vb7gYYz8qJ011m0KLj2W" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer__links">
          <div class="footer__col">
            <h5>Services</h5>
            <a href="solutions.html">Applications Web</a>
            <a href="solutions.html">Applications Mobiles</a>
            <a href="solutions.html">Automatisation</a>
            <a href="solutions.html">Conseil & Stratégie</a>
          </div>
          <div class="footer__col">
            <h5>Produits</h5>
            <a href="products.html">WordPress</a>
            <a href="products.html">Laravel</a>
            <a href="products.html">React & Next.js</a>
            <a href="products.html">Modèles HTML</a>
          </div>
          <div class="footer__col">
            <h5>Entreprise</h5>
            <a href="about.html">À propos</a>
            <a href="careers.html">Carrière</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="videos.html">Vidéos</a>
            <a href="blog.html">Blog</a>
            <a href="partenaire.html">Devenir partenaire</a>
            <a href="contact.html">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="container">
          <p>© 2026 Revival. Tous droits réservés.</p>
          <div class="footer__legal">
            <a href="conditions-partenariat.html">Conditions de partenariat</a>
            <a href="politique-confidentialite.html">Politique de confidentialité</a>
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
