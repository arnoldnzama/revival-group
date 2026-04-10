// Shared header & footer injected on every page

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function renderHeader() {
  const page = getCurrentPage();
  const links = [
    { href: 'index.html',     label: 'Accueil' },
    { href: 'solutions.html', label: 'Solutions' },
    { href: 'about.html',     label: 'À propos' },
    { href: 'careers.html',   label: 'Carrière' },
    { href: 'products.html',  label: 'Produits' },
    { href: 'portfolio.html', label: 'Portfolio' },
    { href: 'contact.html',   label: 'Contact' },
  ];

  const navItems = links.map(l =>
    `<a href="${l.href}" class="nav__link${page === l.href ? ' nav__link--active' : ''}">${l.label}</a>`
  ).join('');

  document.getElementById('header-placeholder').innerHTML = `
    <header class="header" id="header">
      <div class="container header__inner">
        <a href="index.html" class="logo">
          <img src="logo/logo.png" alt="TechCorp" class="logo__img" />
        </a>
        <nav class="nav" id="nav">
          <div class="nav__mobile-logo">
            <a href="index.html" class="logo">
              <img src="logo/logo.png" alt="Revival" class="logo__img" />
            </a>
          </div>
          ${navItems}
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
        </nav>
        <button class="burger" id="burger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;

  // sticky + burger
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });
  nav.querySelectorAll('.nav__link').forEach(l =>
    l.addEventListener('click', () => { nav.classList.remove('open'); burger.classList.remove('active'); })
  );
  // lang switcher
  const langBtn      = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langCurrent  = document.getElementById('langCurrent');

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = langDropdown.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', () => {
    langDropdown.classList.remove('open');
    langBtn.setAttribute('aria-expanded', false);
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
            <a href="contact.html">Contact</a>
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
