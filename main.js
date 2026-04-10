// ═══════════════════════════════════════
// MAIN.JS — Animations style egenslab
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── TOP BAR CLOSE ──
  const topbar = document.getElementById('topbar');
  const topbarClose = document.getElementById('topbarClose');
  if (topbar && topbarClose) {
    topbarClose.addEventListener('click', () => {
      topbar.classList.add('hidden');
      document.body.classList.add('topbar-hidden');
      const header = document.getElementById('header');
      if (header) header.style.top = '0';
    });
  }

  // ── HERO SLIDER (yoyo) ──
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDotsEl = document.getElementById('heroSliderDots');
  let heroCurrent = 0;
  let heroDir = 1; // 1 = forward, -1 = backward
  let heroTimer = null;

  function heroGoTo(next) {
    heroSlides[heroCurrent].classList.remove('active');
    heroDotsEl && heroDotsEl.querySelectorAll('.hs-dot').forEach((d, i) => d.classList.toggle('active', i === next));
    heroCurrent = next;
    heroSlides[heroCurrent].classList.add('active');
  }

  function heroYoyo() {
    let next = heroCurrent + heroDir;
    if (next >= heroSlides.length) {
      heroDir = -1;
      next = heroCurrent + heroDir;
    } else if (next < 0) {
      heroDir = 1;
      next = heroCurrent + heroDir;
    }
    heroGoTo(next);
  }

  function heroResetTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(heroYoyo, 3500);
  }

  if (heroSlides.length) {
    document.getElementById('hsPrev') && document.getElementById('hsPrev').addEventListener('click', () => { heroDir = -1; heroYoyo(); heroResetTimer(); });
    document.getElementById('hsNext') && document.getElementById('hsNext').addEventListener('click', () => { heroDir = 1; heroYoyo(); heroResetTimer(); });
    heroDotsEl && heroDotsEl.querySelectorAll('.hs-dot').forEach(dot => {
      dot.addEventListener('click', () => { heroGoTo(+dot.dataset.idx); heroResetTimer(); });
    });
    heroResetTimer();
  }

  // ── COUNTER ANIMATION ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ── BAR CHART ANIMATION ──
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
  }, { threshold: 0.5 });
  document.querySelectorAll('.bar').forEach(bar => {
    bar.style.animationPlayState = 'paused';
    barObserver.observe(bar);
  });

  // ── SCROLL REVEAL — fade-up ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

  // ── STAGGER CHILDREN — cards, list items ──
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const children = e.target.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
          child.classList.add('visible');
        });
        staggerObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

  // ── SPLIT TEXT ANIMATION — titres mot par mot ──
  function splitWords(el) {
    const text = el.textContent;
    const words = text.split(' ');
    el.innerHTML = words.map((w, i) =>
      `<span class="word-wrap"><span class="word" style="transition-delay:${i * 0.07}s">${w}</span></span>`
    ).join(' ');
  }

  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.word').forEach(w => w.classList.add('word--visible'));
        splitObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.split-text').forEach(el => {
    splitWords(el);
    splitObserver.observe(el);
  });

  // ── PARALLAX SECTIONS ──
  function handleParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }
  window.addEventListener('scroll', handleParallax, { passive: true });
  handleParallax();

  // ── SECTION ENTRANCE — chaque section ──
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('section--visible');
        sectionObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });
  document.querySelectorAll('section, .clients-section').forEach(s => {
    s.classList.add('section--animate');
    sectionObserver.observe(s);
  });

  // ── NUMBER TICKER (grands chiffres) ──
  const tickerObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.ticked) {
        e.target.dataset.ticked = '1';
        const target = parseInt(e.target.dataset.target, 10);
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          e.target.textContent = Math.floor(ease * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.ticker').forEach(el => tickerObserver.observe(el));

  // ── PORTFOLIO CAROUSEL ──
  (function () {
    const track = document.getElementById('pfTrack');
    if (!track) return;
    const cards = track.querySelectorAll('.pf-carousel-card:not([aria-hidden])');
    const allCards = track.querySelectorAll('.pf-carousel-card');
    const dotsEl = document.getElementById('pfDots');
    const prevBtn = document.getElementById('pfPrev');
    const nextBtn = document.getElementById('pfNext');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;
    const cardWidth = () => cards[0].offsetWidth + 24; // gap 24px

    // Build dots
    if (dotsEl) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'pf-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Projet ${i + 1}`);
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsEl.appendChild(dot);
      });
    }

    function updateDots(idx) {
      dotsEl && dotsEl.querySelectorAll('.pf-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * cardWidth()}px)`;
      updateDots(current);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 3800);
    }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', resetAuto);

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });

    resetAuto();
  })();

  // ── INDUSTRIES 3D SLIDER ──
  const indPanels = document.querySelectorAll('.ind-panel');
  const indDotsContainer = document.getElementById('indDots');
  let indCurrent = 0;
  let indTimer = null;

  // build dots
  if (indDotsContainer) {
    indPanels.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'ind-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => indGoTo(i));
      indDotsContainer.appendChild(dot);
    });
  }

  function indGoTo(next) {
    if (next === indCurrent) return;
    const prev = indCurrent;
    indCurrent = (next + indPanels.length) % indPanels.length;

    indPanels[prev].classList.remove('active');
    indPanels[prev].classList.add('slide-out');
    setTimeout(() => indPanels[prev].classList.remove('slide-out'), 600);

    indPanels[indCurrent].classList.add('active');
    indPanels[indCurrent].querySelectorAll('.counter').forEach(el => { delete el.dataset.counted; animateCounter(el); });

    document.querySelectorAll('.ind-dot').forEach((d, i) => d.classList.toggle('active', i === indCurrent));
    indResetTimer();
  }

  function indResetTimer() {
    clearInterval(indTimer);
    indTimer = setInterval(() => indGoTo(indCurrent + 1), 4500);
  }

  document.getElementById('indNext') && document.getElementById('indNext').addEventListener('click', () => indGoTo(indCurrent + 1));
  document.getElementById('indPrev') && document.getElementById('indPrev').addEventListener('click', () => indGoTo(indCurrent - 1));
  indResetTimer();

  // ── SERVICES ACCORDION ──
  document.querySelectorAll('.svc-item__head').forEach(head => {
    head.addEventListener('click', () => {
      const item = head.closest('.svc-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.svc-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ── TESTIMONIALS SLIDER ──
  const cards = document.querySelectorAll('.testi-card');
  const dotsContainer = document.getElementById('testiDots');
  let current = 0;
  if (cards.length && dotsContainer) {
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    function goTo(idx) {
      cards[current].classList.remove('active');
      dotsContainer.children[current].classList.remove('active');
      current = (idx + cards.length) % cards.length;
      cards[current].classList.add('active');
      dotsContainer.children[current].classList.add('active');
    }
    cards[0].classList.add('active');
    document.getElementById('testiPrev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('testiNext')?.addEventListener('click', () => goTo(current + 1));
    setInterval(() => goTo(current + 1), 5000);
  }

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── TYPEWRITER — hero title (loop non-stop) ──
  (function () {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;

    // Build a flat sequence of typed steps from the DOM tree
    // Each step: { kind:'char'|'open'|'close', val, tag, attrs }
    function buildSteps(node) {
      const steps = [];
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent.split('').forEach(ch => steps.push({ kind: 'char', val: ch }));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Capture tag + all attributes
          const attrs = Array.from(child.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
          steps.push({ kind: 'open', tag: child.tagName.toLowerCase(), attrs });
          buildSteps(child).forEach(s => steps.push(s));
          steps.push({ kind: 'close', tag: child.tagName.toLowerCase() });
        }
      });
      return steps;
    }

    // Parse original HTML once
    const parser = document.createElement('div');
    parser.innerHTML = heroTitle.innerHTML;
    const steps = buildSteps(parser);

    const SPEED_TYPE  = 35;   // ms per char
    const PAUSE_END   = 1200; // ms pause at end before erasing
    const SPEED_ERASE = 18;   // ms per char erase
    const PAUSE_START = 400;  // ms pause before restarting

    // We rebuild innerHTML each frame using a virtual cursor index
    function renderAt(count) {
      // Replay steps up to `count` chars typed
      let html = '';
      let typed = 0;
      const stack = []; // open tags stack
      for (let s = 0; s < steps.length; s++) {
        const step = steps[s];
        if (step.kind === 'open') {
          const tag = step.attrs ? `<${step.tag} ${step.attrs}>` : `<${step.tag}>`;
          html += tag;
          stack.push(step.tag);
        } else if (step.kind === 'close') {
          html += `</${step.tag}>`;
          stack.pop();
        } else {
          // char
          if (typed >= count) {
            // Close any open tags cleanly
            for (let k = stack.length - 1; k >= 0; k--) html += `</${stack[k]}>`;
            break;
          }
          html += step.val === '<' ? '&lt;' : step.val === '>' ? '&gt;' : step.val === '&' ? '&amp;' : step.val;
          typed++;
        }
      }
      heroTitle.innerHTML = html;
    }

    const totalChars = steps.filter(s => s.kind === 'char').length;
    let current = 0;
    let direction = 1; // 1 = typing, -1 = erasing
    let timer;

    function tick() {
      renderAt(current);

      if (direction === 1) {
        if (current < totalChars) {
          current++;
          timer = setTimeout(tick, SPEED_TYPE);
        } else {
          // Pause at end then erase
          timer = setTimeout(() => { direction = -1; tick(); }, PAUSE_END);
        }
      } else {
        if (current > 0) {
          current--;
          timer = setTimeout(tick, SPEED_ERASE);
        } else {
          // Pause then retype
          timer = setTimeout(() => { direction = 1; tick(); }, PAUSE_START);
        }
      }
    }

    setTimeout(tick, PAUSE_START);
  })();

  // ── HERO TILT ──
  const mockupWrap = document.querySelector('.hero__mockup-wrap');
  if (mockupWrap) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rx = ((e.clientY - cy) / cy) * 4;
      const ry = ((e.clientX - cx) / cx) * -4;
      mockupWrap.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    document.addEventListener('mouseleave', () => {
      mockupWrap.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  // ── CURSOR GLOW (style egenslab) ──
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ── SMOOTH HOVER LIFT on cards ──
  document.querySelectorAll('.card, .product-card, .value-card, .team-card, .perk-card, .job-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.willChange = 'transform');
    card.addEventListener('mouseleave', () => card.style.willChange = 'auto');
  });

});
