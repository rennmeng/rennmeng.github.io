/* ==========================================================================
   PQC-Huanglab — shared site scripts (single file for all pages)
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * Site configuration
   *
   * gaMeasurementId — Google Analytics 4 (optional, full visit analytics)
   *   1. Create a property for this site at https://analytics.google.com
   *   2. Paste its measurement ID below, e.g. 'G-XXXXXXXXXX'
   *   3. Leave the value empty ('') to keep GA disabled.
   *
   * visitCounter — public page-view counter shown in the footer,
   *   powered by the busuanzi service (no registration needed).
   * ---------------------------------------------------------------- */
  var SITE = {
    gaMeasurementId: '',
    visitCounter: true
  };

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* ---------- Mobile navigation (hamburger) ---------- */
  function initNav() {
    var button = document.getElementById('hamburger');
    var nav = document.getElementById('site-nav');
    if (!button || !nav) return;

    button.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the panel after tapping a link (mobile)
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Highlight the current page in the menu ---------- */
  function initActiveNav() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = document.querySelectorAll('.nav-list a');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').toLowerCase();
      if (href === page) {
        links[i].classList.add('active');
      }
    }
  }

  /* ---------- Homepage hero slider (crossfade) ---------- */
  function initHeroSlider() {
    var slider = document.getElementById('heroSlider');
    if (!slider) return;

    var slides = slider.querySelectorAll('.hero-slide');
    var dotsWrap = slider.querySelector('.hero-dots');
    var prevBtn = slider.querySelector('.hero-arrow.prev');
    var nextBtn = slider.querySelector('.hero-arrow.next');
    if (!slides.length || !dotsWrap) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;
    var timer = null;

    // Build one dot per slide
    for (var i = 0; i < slides.length; i++) {
      (function (index) {
        var dot = document.createElement('button');
        dot.className = 'hero-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        dot.addEventListener('click', function () {
          goTo(index);
          restart();
        });
        dotsWrap.appendChild(dot);
      })(i);
    }

    var dots = dotsWrap.querySelectorAll('.hero-dot');

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function start() {
      if (!reduced) {
        timer = setInterval(function () { goTo(current + 1); }, 6000);
      }
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function restart() {
      stop();
      start();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(current - 1);
        restart();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(current + 1);
        restart();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    goTo(0);
    start();
  }

  /* ---------- Scroll-reveal animations ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  }

  /* ---------- Floating buttons: back to top / go to bottom ---------- */
  function initBackToTop() {
    var up = document.getElementById('backToTop');
    var down = document.getElementById('goToBottom');
    if (!up && !down) return;

    function nearBottom() {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
    }

    function toggle() {
      if (up) up.classList.toggle('show', window.scrollY > 400);
      if (down) down.classList.toggle('show', !nearBottom());
    }
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    if (up) {
      up.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    if (down) {
      down.addEventListener('click', function () {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      });
    }
  }

  /* ---------- Footer year ---------- */
  function initFooter() {
    var year = document.getElementById('footer-year');
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  /* ---------- Google Analytics 4 (optional) ---------- */
  function loadAnalytics() {
    if (!SITE.gaMeasurementId) return;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + SITE.gaMeasurementId;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', SITE.gaMeasurementId);
  }

  /* ---------- Public visit counter (busuanzi, shown in the footer) ----------
     The busuanzi service can be slow or hang, so its script is only
     requested AFTER the page has fully loaded, with one silent retry.
     If numbers never arrive the counter simply stays hidden. */
  function loadVisitCounter() {
    var slot = document.getElementById('visitStats');
    if (!slot || !SITE.visitCounter) return;

    var injected = null;
    var attempts = 0;
    var MAX_ATTEMPTS = 2;

    function hasNumbers() {
      var pv = document.getElementById('busuanzi_value_site_pv');
      return !!(pv && /\d/.test(pv.textContent));
    }

    function stop() {
      if (injected && injected.parentNode) injected.parentNode.removeChild(injected);
    }

    function finish() {
      stop();
      slot.hidden = !hasNumbers();
    }

    function poll(checksLeft) {
      if (hasNumbers()) {
        stop();
        slot.hidden = false;
        return;
      }
      if (checksLeft <= 0) {
        if (attempts < MAX_ATTEMPTS) inject(); else finish();
        return;
      }
      setTimeout(function () { poll(checksLeft - 1); }, 500);
    }

    function inject() {
      attempts += 1;
      stop();
      injected = document.createElement('script');
      injected.async = true;
      injected.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
        + (attempts > 1 ? '?retry=' + Date.now() : '');
      injected.onerror = function () {
        if (attempts < MAX_ATTEMPTS) inject(); else finish();
      };
      document.head.appendChild(injected);
      poll(24); // 24 × 500 ms = 12 s per attempt
    }

    if (document.readyState === 'complete') {
      inject();
    } else {
      window.addEventListener('load', inject);
    }
  }

  /* ---------- Content lists (rendered from assets/js/site-data.js) ---------- */
  function getSiteData() {
    var data = window.SITE_DATA || {};
    return {
      news: Array.isArray(data.news) ? data.news : [],
      life: Array.isArray(data.life) ? data.life : []
    };
  }

  function byNewestFirst(items) {
    return items.slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function isExternal(url) {
    return /^https?:/i.test(url || '');
  }

  /* Attach a stable type + id to every item so list pages and the
     detail page agree on URLs (item.id wins when the author set one). */
  function decorate(items, type) {
    return byNewestFirst(items).map(function (item, i) {
      var copy = {};
      for (var key in item) { copy[key] = item[key]; }
      copy._type = type;
      copy._id = item.id || (type + '-' + (item.date || 'undated') + '-' + i);
      return copy;
    });
  }

  function detailHref(item) {
    return './detail.html?id=' + encodeURIComponent(item._id);
  }

  function fillPanelList(id, items, moreHref) {
    var list = document.getElementById(id);
    if (!list) return;
    list.innerHTML = '';

    if (!items.length) {
      var emptyLi = document.createElement('li');
      var empty = document.createElement('span');
      empty.className = 'panel-empty';
      empty.textContent = 'Coming soon.';
      emptyLi.appendChild(empty);
      list.appendChild(emptyLi);
      return;
    }

    items.forEach(function (item) {
      var li = document.createElement('li');

      var chip = document.createElement('span');
      chip.className = 'news-chip';
      chip.textContent = item.date || '';
      li.appendChild(chip);

      var link = document.createElement('a');
      link.textContent = item.title || '';
      link.href = detailHref(item);
      li.appendChild(link);

      list.appendChild(li);
    });
  }

  function fillTimeline(id, items) {
    var list = document.getElementById(id);
    if (!list) return;
    list.innerHTML = '';

    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'timeline-item reveal';

      var date = document.createElement('div');
      date.className = 'timeline-date';
      date.textContent = item.date || '';
      li.appendChild(date);

      var body = document.createElement('div');
      body.className = 'timeline-body';

      var heading = document.createElement('h3');
      var titleLink = document.createElement('a');
      titleLink.textContent = item.title || '';
      titleLink.href = detailHref(item);
      titleLink.style.color = 'inherit';
      titleLink.style.textDecoration = 'none';
      heading.appendChild(titleLink);
      body.appendChild(heading);

      if (item.text) {
        var p = document.createElement('p');
        p.textContent = item.text;
        body.appendChild(p);
      }

      if (item.image) {
        var img = document.createElement('img');
        img.className = 'timeline-photo';
        img.src = item.image;
        img.alt = item.title || 'Photo';
        img.loading = 'lazy';
        body.appendChild(img);
      }

      if (item.link) {
        var a = document.createElement('a');
        a.className = 'btn-mini';
        a.textContent = 'Details →';
        a.href = item.link;
        if (isExternal(item.link)) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
        body.appendChild(a);
      }

      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function renderContent() {
    var data = getSiteData();
    var news = decorate(data.news, 'news');
    var life = decorate(data.life, 'life');
    fillPanelList('homeNewsList', news.slice(0, 3), './news.html');
    fillPanelList('homeLifeList', life.slice(0, 3), './life.html');
    fillTimeline('newsTimeline', news);
    fillTimeline('lifeTimeline', life);
  }

  /* ---------- Event detail page (detail.html?id=...) ---------- */
  function initDetailPage() {
    var wrap = document.getElementById('detailWrap');
    if (!wrap) return;

    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('id') || '';

    var data = getSiteData();
    var all = decorate(data.news, 'news').concat(decorate(data.life, 'life'));
    var item = null;
    for (var i = 0; i < all.length; i++) {
      if (all[i]._id === wanted) { item = all[i]; break; }
    }

    var missing = document.getElementById('detailMissing');
    var content = document.getElementById('detailContent');

    if (!item) {
      if (missing) missing.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    var backLink = document.getElementById('detailBack');
    if (backLink) {
      backLink.href = item._type === 'life' ? './life.html' : './news.html';
      backLink.textContent = item._type === 'life' ? '← Back to Group Life' : '← Back to News';
    }

    if (content) content.hidden = false;

    var date = document.getElementById('detailDate');
    if (date) date.textContent = item.date || '';

    var type = document.getElementById('detailType');
    if (type) type.textContent = item._type === 'life' ? 'Group Life' : 'News';

    var title = document.getElementById('detailTitle');
    if (title) title.textContent = item.title || '';

    var cover = document.getElementById('detailCover');
    if (cover) {
      if (item.image) {
        cover.src = item.image;
        cover.alt = item.title || '';
        cover.hidden = false;
      } else {
        cover.hidden = true;
      }
    }

    var body = document.getElementById('detailBody');
    if (body) {
      body.innerHTML = '';
      var paragraphs = Array.isArray(item.body) ? item.body : (item.body ? [item.body] : (item.text ? [item.text] : []));
      paragraphs.forEach(function (text) {
        var p = document.createElement('p');
        p.textContent = text;
        body.appendChild(p);
      });
      if (item.link && !isExternal(item.link)) {
        var file = document.createElement('p');
        var a = document.createElement('a');
        a.className = 'btn-mini';
        a.href = item.link;
        a.textContent = 'Open attachment →';
        file.appendChild(a);
        body.appendChild(file);
      }
    }

    var linkBtn = document.getElementById('detailLink');
    if (linkBtn) {
      if (item.link && isExternal(item.link)) {
        linkBtn.href = item.link;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener';
        linkBtn.hidden = false;
      } else {
        linkBtn.hidden = true;
      }
    }

    document.title = (item.title || 'News') + ' · PQC-Huanglab';
  }

  /* ---------- Contact page map tabs (Baidu / Google) ---------- */
  function initMapTabs() {
    var tabs = document.querySelectorAll('.map-tab');
    var frame = document.getElementById('contactMap');
    if (!tabs.length || !frame) return;

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        if (this.classList.contains('is-active')) return;
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove('is-active');
        }
        this.classList.add('is-active');
        frame.src = this.getAttribute('data-map-src');
      });
    }
  }

  /* ---------- Lightbox (click a compressed image to view the original) ---------- */
  function initLightbox() {
    var overlay = null;
    var overlayImg = null;

    function closeLightbox() {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function ensureOverlay() {
      if (overlay) return;
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlayImg = document.createElement('img');
      overlayImg.alt = '';
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'lightbox-close';
      close.setAttribute('aria-label', 'Close image preview');
      close.innerHTML = '&times;';
      overlay.appendChild(overlayImg);
      overlay.appendChild(close);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', closeLightbox);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    }

    // Any <img data-full="..."> opens the lightbox with the original file.
    document.addEventListener('click', function (e) {
      var img = e.target.closest ? e.target.closest('img[data-full]') : null;
      if (!img) return;
      e.preventDefault();
      ensureOverlay();
      overlayImg.src = img.getAttribute('data-full');
      overlayImg.alt = img.alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  /* ---------- Boot ---------- */
  ready(function () {
    renderContent();
    initDetailPage();
    initNav();
    initActiveNav();
    initHeroSlider();
    initReveal();
    initBackToTop();
    initFooter();
    initMapTabs();
    initLightbox();
    loadAnalytics();
    loadVisitCounter();
  });
})();
