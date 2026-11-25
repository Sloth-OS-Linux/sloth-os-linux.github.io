document.documentElement.classList.add("js-ready");

/* A card asking for a rating on DistroWatch (Sloth OS has its own page there since November 2026): a sloth giving a
   thumbs-up, bouncing back and forth along the bottom of the window until someone presses Rate (gone for good) or
   the X (gone for two weeks). It stops while the pointer or the keyboard focus is on it, and stays still in the corner
   with reduced motion. Its own key: who pressed the earlier "Recommend" card sees this one once too. */
(function () {
  var KEY = "sloth-distrowatch-rate";
  var LATER = 14 * 24 * 3600 * 1000;
  var URL = "https://distrowatch.com/dwres.php?resource=ratings&distro=sloth";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private window: shown again next time */ } }
  var seen = get();
  if (seen === "done" || (seen && Date.now() - Number(seen) < LATER)) return;

  var css = "" +
    ".dw-card{position:fixed;left:16px;bottom:16px;z-index:50;width:min(320px,calc(100vw - 32px));opacity:0;" +
    "pointer-events:none}" +
    ".dw-card.dw-in{opacity:1;pointer-events:auto;animation:dw-roam 16s ease-in-out .9s infinite alternate}" +
    ".dw-body{position:relative;box-sizing:border-box;padding:16px 16px 16px 76px;border:1px solid " +
    "var(--line,rgba(227,229,232,.12));border-radius:18px;background:var(--panel,#2b2d31);color:var(--ink,#e3e5e8);" +
    "box-shadow:0 18px 40px rgba(0,0,0,.45);font-size:.86rem;line-height:1.45;transform-origin:50% 100%}" +
    ".dw-in .dw-body{animation:dw-drop .9s cubic-bezier(.3,0,.3,1) both,dw-bounce 1.1s ease-in-out .9s infinite}" +
    ".dw-card:hover,.dw-card:focus-within,.dw-card:hover .dw-body,.dw-card:focus-within .dw-body" +
    "{animation-play-state:paused}" +
    ".dw-sloth{position:absolute;left:12px;top:14px;width:52px;height:52px}" +
    ".dw-sloth img{width:100%;height:100%;display:block}" +
    ".dw-sloth span{position:absolute;right:-8px;bottom:-6px;font-size:24px;line-height:1;transform-origin:30% 90%;" +
    "animation:dw-like 1.1s ease-in-out infinite}" +
    ".dw-body p{margin:0 0 .7rem;color:var(--ink,#e3e5e8)}" +
    ".dw-body strong{display:block;margin-bottom:.2rem;font-size:.95rem}" +
    ".dw-body .button{margin:0;width:100%;white-space:nowrap;padding:.7rem 1rem}" +
    ".dw-x{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;" +
    "color:var(--muted,#9aa0a7);font-size:20px;line-height:1;cursor:pointer}" +
    ".dw-x:hover,.dw-x:focus-visible{background:rgba(255,255,255,.08);color:var(--ink,#e3e5e8)}" +
    "@keyframes dw-roam{from{transform:none}to{transform:translateX(calc(100vw - 100% - 48px))}}" +
    "@keyframes dw-drop{0%{transform:translateY(-70vh)}70%{transform:translateY(0) scale(1.06,.9)}" +
    "100%{transform:none}}" +
    "@keyframes dw-bounce{0%,100%{transform:scale(1.05,.92)}12%{transform:none}" +
    "50%{transform:translateY(-70px) scale(.97,1.03);animation-timing-function:ease-in}88%{transform:none}}" +
    "@keyframes dw-like{0%,100%{transform:rotate(0)}50%{transform:rotate(-18deg) scale(1.15)}}" +
    "@media(max-width:600px){.dw-body{padding:12px 12px 12px 64px;font-size:.8rem}" +
    ".dw-sloth{left:10px;top:12px;width:42px;height:42px}" +
    ".dw-in .dw-body{animation:dw-drop .9s cubic-bezier(.3,0,.3,1) both,dw-bounce 1.6s ease-in-out .9s infinite}}" +
    "@media(prefers-reduced-motion:reduce){.dw-card{left:auto;right:16px}" +
    ".dw-card.dw-in,.dw-in .dw-body,.dw-sloth span{animation:none}}";

  function show() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    var card = document.createElement("aside");
    card.className = "dw-card";
    card.setAttribute("aria-label", "Rate Sloth OS on DistroWatch");
    card.innerHTML = '<div class="dw-body"><span class="dw-sloth" aria-hidden="true">' +
      '<img src="./assets/sloth-logo.svg" alt=""><span>\u{1F44D}</span></span>' +
      '<button class="dw-x" type="button" aria-label="Close">\u00d7</button>' +
      "<p><strong>Sloth OS is on DistroWatch!</strong>If you like it, please give it a rating and a few words " +
      "there. It helps others decide whether to try it, and it means a lot to me.</p>" +
      '<a class="button button-primary" href="' + URL + '" target="_blank" rel="noopener">' +
      "Rate Sloth OS on DistroWatch \u2197</a></div>";
    document.body.appendChild(card);
    function close(value) {
      set(value);
      card.remove();
    }
    card.querySelector(".dw-x").addEventListener("click", function () { close(String(Date.now())); });
    card.querySelector("a").addEventListener("click", function () { close("done"); });
    requestAnimationFrame(function () { card.classList.add("dw-in"); });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(show, 3000); });
  } else {
    setTimeout(show, 3000);
  }
})();

/* The home page (Sloth OS 2.0): the taskbar layouts one after the other with buttons to pick one, the Sloth Center
   tour's tabs, pictures that open larger, and sections that fade in as they come into view. Without JavaScript the
   first layout and every tour picture simply show; with reduced motion nothing moves by itself. */
(function () {
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }
  ready(function () {
    // --- the layouts
    var show = document.querySelector("[data-layout-show]");
    if (show) {
      var imgs = Array.prototype.slice.call(show.querySelectorAll(".layout-screen img"));
      var chips = show.querySelector("[data-layout-chips]");
      var current = 0, timer = null, paused = false;
      var buttons = imgs.map(function (img, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = img.getAttribute("data-name");
        b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        b.addEventListener("click", function () { go(i); stop(); });
        chips.appendChild(b);
        return b;
      });
      function go(i) {
        imgs[current].classList.remove("is-active");
        buttons[current].setAttribute("aria-pressed", "false");
        current = i;
        imgs[i].loading = "eager";
        imgs[i].classList.add("is-active");
        buttons[i].setAttribute("aria-pressed", "true");
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function start() {
        if (still || timer) return;
        timer = setInterval(function () { if (!paused && !document.hidden) go((current + 1) % imgs.length); }, 3200);
      }
      show.addEventListener("mouseenter", function () { paused = true; });
      show.addEventListener("mouseleave", function () { paused = false; });
      show.addEventListener("focusin", function () { paused = true; });
      show.addEventListener("focusout", function () { paused = false; });
      // the next pictures load while the first one shows
      setTimeout(function () { imgs.forEach(function (img) { img.loading = "eager"; }); }, 1500);
      start();
    }

    // --- the tour's tabs (arrow keys move between them, as in a desktop app)
    var tour = document.querySelector("[data-tour]");
    if (tour) {
      var tabs = Array.prototype.slice.call(tour.querySelectorAll("[role=tab]"));
      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { select(tab); });
        tab.addEventListener("keydown", function (e) {
          var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!n) return;
          e.preventDefault();
          var next = tabs[(i + n + tabs.length) % tabs.length];
          select(next);
          next.focus();
        });
      });
    }

    // --- "moving in": the picture turns into the finished one now and then
    var pair = document.querySelector(".new-shot-pair");
    if (pair && !still) setInterval(function () { pair.classList.toggle("show-after"); }, 3500);

    // --- pictures that open larger
    var box = document.querySelector(".lightbox");
    if (box && typeof box.showModal === "function") {
      var big = box.querySelector("img");
      document.querySelectorAll("[data-zoom]").forEach(function (el) {
        el.addEventListener("click", function () {
          var img = el.querySelector("img");
          big.src = el.getAttribute("data-zoom");
          big.alt = img ? img.alt : "";
          box.showModal();
        });
      });
      box.addEventListener("click", function () { box.close(); });
    }

    // --- sections fade in as they come into view
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || still) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); seen.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { seen.observe(el); });
  });
})();

/* Counters: the downloads (SourceForge's public download statistics, read live; stats.json, written by the Pages
   workflow every day, if SourceForge does not answer) and the visitors (the knowledge Worker counts each visitor once a day, without a cookie: privacy.html).
   A line in every footer, and the download count next to the download buttons ([data-downloads]). Nothing shows
   if a number cannot be had. The browser remembers only the day it was counted (localStorage), to ask for the
   number instead of counting again. */
(function () {
  var API = "https://sloth-os-knowledge.slothos.workers.dev";
  var KEY = "sloth-visit-day";
  var day = new Date().toISOString().slice(0, 10);
  var counted = false;
  try { counted = localStorage.getItem(KEY) === day; } catch (e) { /* private window: counted once a day anyway */ }
  function fmt(n) { return Number(n).toLocaleString("en-US"); }
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }
  var visits = fetch(API + (counted ? "/v1/visits" : "/v1/visit"), counted ? {} : { method: "POST" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (d && !counted) { try { localStorage.setItem(KEY, day); } catch (e) { /* see above */ } }
      return d && d.visits > 0 ? d.visits : null;
    })
    .catch(function () { return null; });
  // the downloads: SourceForge's public statistics, through the knowledge service (it asks SourceForge and keeps the
  // answer 10 minutes; the visitor's browser never talks to SourceForge), so the number matches SourceForge's own
  // page; stats.json (written daily by the Pages workflow) if that fails
  function fromFile() {
    return fetch("./stats.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d && d.downloads > 0 ? d.downloads : null; })
      .catch(function () { return null; });
  }
  var downloads = Promise.race([
    fetch(API + "/v1/downloads").then(function (r) { return r.ok ? r.json() : null; }),
    new Promise(function (resolve) { setTimeout(function () { resolve(null); }, 4000); })
  ]).then(function (d) { return d && d.downloads > 0 ? d.downloads : fromFile(); })
    .catch(fromFile);
  /* The visitor number on a hand tally counter: the wheels roll up from 0000 to it, then the plunger clicks.
     Pressing it clicks again (it does not count anyone: the service counts each visitor once a day). */
  function tally(spot, count) {
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var digits = String(count).split("");
    while (digits.length < 4) digits.unshift("0");
    var label = fmt(count) + (count === 1 ? " visitor" : " visitors");
    var strip = "";
    for (var d = 0; d <= 9; d++) strip += '<span class="tally-digit">' + d + "</span>";
    var wheels = digits.map(function () {
      return '<span class="tally-wheel"><span class="tally-strip">' + strip + "</span></span>";
    }).join("");
    spot.innerHTML = '<div class="tally" role="button" tabindex="0" aria-label="' + label + '">' +
      '<span class="tally-ring"></span><span class="tally-plunger"></span>' +
      '<span class="tally-body"><span class="tally-window" aria-hidden="true">' + wheels + "</span>" +
      '<span class="tally-knob"></span><span class="tally-screw s1"></span><span class="tally-screw s2"></span>' +
      "</span></div>" + '<p class="tally-caption">' + label + " so far</p>";
    spot.hidden = false;
    var counter = spot.querySelector(".tally");
    // wider for a five- or six-digit number, so the reset knob stays clear of the window
    spot.querySelector(".tally-body").style.width = (80 + 24 * digits.length) + "px";
    var strips = spot.querySelectorAll(".tally-strip");
    function click() {
      counter.classList.add("is-pressed");
      setTimeout(function () { counter.classList.remove("is-pressed"); }, 140);
    }
    function roll() {
      Array.prototype.forEach.call(strips, function (s, i) {
        s.style.transitionDelay = still ? "0s" : (i * 0.12) + "s";
        s.style.transform = "translateY(" + (-34 * Number(digits[i])) + "px)";
      });
      if (!still) setTimeout(click, 1500 + strips.length * 120);
    }
    // the wheels roll when the counter comes into view: at once if it is on the screen already, otherwise when a
    // quarter of it shows; in any case after 5 s, so the number never stays at 0000 (a fading section can keep the
    // observer from firing)
    var rolled = false;
    function rollOnce() { if (!rolled) { rolled = true; roll(); } }
    var box = counter.getBoundingClientRect();
    if (still || !("IntersectionObserver" in window) || (box.top < window.innerHeight && box.bottom > 0)) {
      setTimeout(rollOnce, still ? 0 : 400);
    } else {
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { seen.disconnect(); setTimeout(rollOnce, 150); }
      }, { threshold: 0.25 });
      seen.observe(counter);
      setTimeout(function () { seen.disconnect(); rollOnce(); }, 5000);
    }
    function press() {
      click();
      if (still) return;
      counter.classList.remove("is-shaking");
      void counter.offsetWidth;
      counter.classList.add("is-shaking");
    }
    counter.addEventListener("click", press);
    counter.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); press(); }
    });
  }

  Promise.all([downloads, visits]).then(function (n) {
    ready(function () {
      var parts = [];
      if (n[0]) parts.push(fmt(n[0]) + (n[0] === 1 ? " download" : " downloads"));
      if (n[1]) parts.push(fmt(n[1]) + (n[1] === 1 ? " visitor" : " visitors"));
      if (parts.length) {
        var line = document.createElement("span");
        line.className = "site-stats";
        line.textContent = parts.join(" \u00b7 ");
        var footer = document.querySelector(".footer-inner nav");
        if (footer) footer.parentNode.insertBefore(line, footer);
      }
      if (n[1]) {
        Array.prototype.forEach.call(document.querySelectorAll("[data-visitors]"), function (el) {
          tally(el, n[1]);
        });
      }
      if (n[0]) {
        Array.prototype.forEach.call(document.querySelectorAll("[data-downloads]"), function (el) {
          el.textContent = "Downloaded " + fmt(n[0]) + " times so far";
          el.hidden = false;
        });
      }
    });
  });
})();
