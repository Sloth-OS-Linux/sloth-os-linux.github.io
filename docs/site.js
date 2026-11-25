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
   tour (the pages one after the other while it is in view, until someone picks one), pictures that open larger, and
   sections that fade in as they come into view, the cards of a row one after the other. Without JavaScript the
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

    // --- the Sloth Center tour: the open page's line fills up in 7 s, then the next page opens; it waits while the
    // pointer or the focus is on it or it is out of view, and stops for good once someone picks a page
    var tour = document.querySelector("[data-tour]");
    if (tour) {
      var tabs = Array.prototype.slice.call(tour.querySelectorAll("[role=tab]"));
      var list = tour.querySelector("[role=tablist]");
      var title = tour.querySelector("[data-tour-title]");
      var auto = !still, inView = false, held = false, chosen = 0;
      function play() {
        tour.classList.toggle("is-playing", auto && inView && !held && !document.hidden);
      }
      function select(i, byUser) {
        chosen = i;
        tabs.forEach(function (t, j) {
          var on = j === i;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          panel.classList.toggle("is-active", on);
          panel.setAttribute("aria-hidden", on ? "false" : "true");
          if (on) { var img = panel.querySelector("img"); if (img) img.loading = "eager"; }
        });
        title.textContent = tabs[i].querySelector(".tour-name").firstChild.textContent;
        tour.style.setProperty("--glow", tabs[i].getAttribute("data-glow"));
        // on a narrow screen the pages are a row: the open one is brought into it (sideways only)
        if (list.scrollWidth > list.clientWidth) {
          var left = tabs[i].offsetLeft - (list.clientWidth - tabs[i].offsetWidth) / 2;
          list.scrollTo({ left: Math.max(0, left), behavior: still ? "auto" : "smooth" });
        }
        if (byUser) { auto = false; tour.classList.add("is-manual"); play(); }
      }
      tabs.forEach(function (tab, i) {
        if (i > 0) document.getElementById(tab.getAttribute("aria-controls")).setAttribute("aria-hidden", "true");
        tab.addEventListener("click", function () { select(i, true); });
        tab.addEventListener("keydown", function (e) {
          var n = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
          var to = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : n ? (i + n + tabs.length) % tabs.length : -1;
          if (to < 0) return;
          e.preventDefault();
          select(to, true);
          tabs[to].focus();
        });
        tab.querySelector(".tour-bar i").addEventListener("animationend", function () {
          if (auto && chosen === i) select((i + 1) % tabs.length, false);
        });
      });
      tour.style.setProperty("--glow", tabs[0].getAttribute("data-glow"));
      tour.addEventListener("mouseenter", function () { held = true; play(); });
      tour.addEventListener("mouseleave", function () { held = false; play(); });
      tour.addEventListener("focusin", function () { held = true; play(); });
      tour.addEventListener("focusout", function () { held = false; play(); });
      document.addEventListener("visibilitychange", play);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          play();
        }, { threshold: 0.4 }).observe(tour);
      }
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

    // --- sections fade in as they come into view; the cards of a grid one after the other. Once in, an item drops
    // the fading classes, so its own hover movement is quick again
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || still) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    items.forEach(function (el) {
      var row = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
      var n = row.indexOf(el);
      if (row.length > 1 && n > 0) el.style.transitionDelay = Math.min(n, 5) * 80 + "ms";
    });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add("is-visible");
        seen.unobserve(el);
        setTimeout(function () {
          el.style.transitionDelay = "";
          // the flow card keeps is-visible: its steps' ticks hang on it
          if (!el.classList.contains("flow-card")) el.classList.remove("reveal", "is-visible");
        }, 1300);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { seen.observe(el); });
  });
})();

/* The finish: the header darkens and shows how far down the page is, the menu lights the section in view, cards
   carry a light that follows the mouse, and the desktop picture leans toward the pointer. Mouse only for the last
   two; nothing of this with reduced motion except the reading line. */
(function () {
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mouse = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn();
  }
  ready(function () {
    var header = document.querySelector(".site-header");
    if (header) {
      var line = document.createElement("span");
      line.className = "scroll-progress";
      line.setAttribute("aria-hidden", "true");
      header.appendChild(line);
      var waiting = false;
      var update = function () {
        waiting = false;
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        line.style.transform = "scaleX(" + (max > 0 ? Math.min(1, doc.scrollTop / max) : 0).toFixed(4) + ")";
        header.classList.toggle("is-scrolled", doc.scrollTop > 10);
      };
      window.addEventListener("scroll", function () {
        if (!waiting) { waiting = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) {
        var s = document.getElementById(a.getAttribute("href").slice(1));
        if (s) byId[s.id] = a;
      });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (e.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("is-current", l === a); });
          } else {
            a.classList.remove("is-current");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(byId).forEach(function (id) { spy.observe(document.getElementById(id)); });
    }

    if (!mouse || still) return;
    document.querySelectorAll(".feature-card,.new-card,.req-card,.guide-card").forEach(function (card) {
      card.classList.add("spot");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
        card.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
      });
    });
    var lean = document.querySelector(".layout-show");
    if (lean) {
      lean.addEventListener("pointermove", function (e) {
        var r = lean.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        lean.style.transform = "perspective(1400px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg)";
        lean.style.setProperty("--gx", ((x + 0.5) * 100).toFixed(1) + "%");
        lean.style.setProperty("--gy", ((y + 0.5) * 100).toFixed(1) + "%");
      });
      lean.addEventListener("pointerleave", function () { lean.style.transform = ""; });
    }
  });
})();

/* "Will it run?" on the website: the same game list as Sloth Center → Games (games-index.json of the Sloth OS
   knowledge repository: ProtonDB reports, AreWeAntiCheatYet, the Sloth OS team's tests), the same search order and
   the same verdicts (sloth_common/game_check.py, sloth_center/games.py). The list (about 400 kB) is downloaded only
   when the search comes near the screen or someone types; the shared settings (knowledge.json) along with it. */
(function () {
  var root = document.querySelector("[data-game-check]");
  if (!root) return;
  var BASE = "https://raw.githubusercontent.com/Sloth-OS-Linux/sloth-os-knowledge/main/";
  var LIMIT = 8;
  var BADGES = {
    great: ["Runs well", "great"], ok: ["Runs, but may have issues", "ok"], poor: ["Often doesn’t start", "poor"],
    blocked: ["Blocked by its makers", "bad"], broken: ["Its anti-cheat blocks it", "bad"],
    tested: ["Tested by Sloth OS", "tested"], unknown: ["Too few reports", "unknown"],
  };
  var TESTED = {
    works: "The Sloth OS team tried it: it works.",
    issues: "The Sloth OS team tried it: it works, with some issues.",
    no: "The Sloth OS team tried it: it didn’t work.",
  };
  var GPUS = { amd: "AMD", nvidia: "NVIDIA", intel: "Intel" };
  var ALTERNATIVES = { roblox: "Sober" };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];

  var input = root.querySelector("input");
  var results = root.querySelector(".gc-results");
  var detail = root.querySelector(".gc-detail");
  var empty = detail.innerHTML;
  var games = null, keys = [], names = [], known = {}, loading = null;
  var found = [], active = -1, timer = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // for searching: lower case, no accents, no ™ ® or punctuation ("Tom Clancy's" = "tom clancys"), as game_check
  function normalize(text) {
    return String(text).normalize("NFKD").replace(/[^\x00-\x7f]/g, "").toLowerCase()
      .replace(/['`]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function load() {
    if (loading) return loading;
    root.classList.add("is-loading");
    var index = fetch(BASE + "games-index.json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
    var shared = fetch(BASE + "knowledge.json").then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; });
    loading = Promise.all([index, shared]).then(function (got) {
      games = got[0].games || {};
      keys = Object.keys(games);
      names = keys.map(function (k) { return normalize(games[k].n || ""); });
      var g = got[1].games || {};
      Object.keys(g).forEach(function (k) {
        if (!/^umu-\d+$/.test(k)) return;
        var players = 0, last = "";
        Object.keys(g[k]).forEach(function (gpu) {
          var e = g[k][gpu] || {};
          players = Math.max(players, e.reports || 0);
          if (e.last && e.last > last) last = e.last;
        });
        known[k.slice(4)] = { players: players, last: last };
      });
      // a setting reported not to work anymore on Sloth OS machines (on any graphics card) is not mentioned: the
      // reports carry the hash of "sloth-v1|steam|<appid>" (knowledge.steam_key)
      var disputed = got[1].disputed || {};
      if (Object.keys(disputed).length && window.crypto && crypto.subtle) {
        Object.keys(known).forEach(function (appid) {
          crypto.subtle.digest("SHA-256", new TextEncoder().encode("sloth-v1|steam|" + appid)).then(function (d) {
            var hex = Array.prototype.map.call(new Uint8Array(d), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
            if (disputed[hex]) known[appid].disputed = true;
          });
        });
      }
      root.classList.remove("is-loading");
      root.classList.add("is-ready");
      var count = root.querySelector("[data-gc-count]");
      if (count) count.textContent = keys.length.toLocaleString("en-US");
      if (input.value) run();
    }).catch(function () {
      loading = null;
      root.classList.remove("is-loading");
      detail.innerHTML = '<div class="gc-msg"><b>The game list could not be loaded right now.</b>Please try again ' +
        "a little later. Sloth Center → Games → Will it run? has the same list, offline too.</div>";
    });
    return loading;
  }

  // the exact name first, then the names starting with it, then the ones with every word; more reports first
  function search(query) {
    var q = normalize(query);
    if (q.length < 2) return [];
    var words = q.split(" "), out = [];
    for (var i = 0; i < keys.length; i++) {
      var name = names[i], rank;
      if (name === q) rank = 0;
      else if (name.lastIndexOf(q, 0) === 0) rank = 1;
      else {
        var parts = name.split(" ");
        var all = words.every(function (w) {
          return parts.some(function (p) { return p.lastIndexOf(w, 0) === 0; });
        });
        if (!all) continue;
        rank = 2;
      }
      out.push([rank, -(games[keys[i]].t || 0), name, keys[i]]);
    }
    out.sort(function (a, b) {
      return a[0] - b[0] || a[1] - b[1] || (a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0);
    });
    return out.slice(0, LIMIT).map(function (r) { return verdict(r[3], games[r[3]]); });
  }

  function verdict(key, e) {
    var alt = ALTERNATIVES[normalize(e.n || "")] || "";
    var badge = alt && (e.a === "denied" || e.a === "broken") ? "alternative"
      : e.a === "denied" ? "blocked" : e.a === "broken" ? "broken" : e.st ? "tested" : e.r || "unknown";
    var appid = key.indexOf("steam:") === 0 ? key.slice(6) : "";
    return {
      key: key, appid: appid, name: e.n || "", badge: badge, alt: alt, publisher: e.p || "", tested: e.st || "",
      works: e.t ? e.w || 0 : -1, reports: e.t || 0, native: !!e.l, anticheat: e.ac || [],
      gpus: Object.keys(e.g || {}).filter(function (g) { return GPUS[g]; }).map(function (g) { return [GPUS[g], e.g[g]]; }),
      known: appid && known[appid] ? known[appid] : null,
      sources: (e.t ? ["ProtonDB"] : []).concat(e.a ? ["AreWeAntiCheatYet"] : [], e.st ? ["Sloth OS"] : []),
    };
  }

  function look(v) {
    if (v.badge === "alternative") return { text: "Runs with " + v.alt, cls: "great" };
    var b = BADGES[v.badge] || BADGES.unknown;
    return { text: b[0], cls: b[1] };
  }

  function monthText(last) {
    var m = /^(\d{4})-(\d{2})/.exec(last || "");
    return m && +m[2] >= 1 && +m[2] <= 12 ? MONTHS[+m[2] - 1] + " " + m[1] : "";
  }

  function lines(v) {
    var out = [];
    if (v.badge === "alternative") {
      out.push("Its Windows version is blocked on Linux, but " + v.alt + ", a community app made for Linux, runs it. " +
        "Sloth Welcome and Discover can install it.");
    }
    if (v.badge === "blocked") {
      out.push(v.publisher
        ? "Not Sloth OS’s fault: " + v.publisher + " doesn’t allow the game on Linux. If you’d like to " +
          "play it here, tell " + v.publisher + ". 🦥"
        : "Not Sloth OS’s fault: the game’s makers don’t allow it on Linux. If you’d like to play " +
          "it here, tell them. 🦥");
    } else if (v.badge === "broken") {
      out.push("Its anti-cheat doesn’t work on Linux, so it can’t be played (or only offline).");
    }
    if (v.tested) out.push(TESTED[v.tested] || TESTED.works);
    if (v.known && !v.known.disputed) {
      var month = monthText(v.known.last);
      out.push(v.known.players && month
        ? "A setting that worked for " + v.known.players + " other players is known (last confirmed: " + month +
          "). Sloth OS uses it by itself if the game doesn’t start."
        : "A setting that worked for other players is known: Sloth OS uses it by itself.");
    }
    return out;
  }

  function list() {
    results.innerHTML = found.map(function (v, i) {
      var l = look(v);
      return '<li role="option" id="gc-opt-' + i + '" class="gc-' + l.cls + '" aria-selected="' + (i === active) +
        '" style="animation-delay:' + i * 30 + 'ms"><span class="gc-dot"></span><span class="gc-n">' + esc(v.name) +
        '</span><span class="gc-m">' + esc(l.text) + "</span></li>";
    }).join("");
    input.setAttribute("aria-expanded", found.length ? "true" : "false");
    if (active >= 0) input.setAttribute("aria-activedescendant", "gc-opt-" + active);
    else input.removeAttribute("aria-activedescendant");
  }

  function pick(i) {
    active = i;
    Array.prototype.forEach.call(results.children, function (li, j) {
      li.setAttribute("aria-selected", j === i ? "true" : "false");
      if (j === i && li.scrollIntoView && results.scrollHeight > results.clientHeight) li.scrollIntoView({ block: "nearest" });
    });
    if (i >= 0) input.setAttribute("aria-activedescendant", "gc-opt-" + i);
    show(found[i]);
  }

  function show(v) {
    var l = look(v);
    var ring = v.works >= 0
      ? '<div class="gc-ring" style="--gc-p:0" data-p="' + v.works + '" role="img" aria-label="' + v.works +
        '% of the players say it works"><b>' + v.works + '%</b><small>say it<br>works</small></div>'
      : "";
    var sub = v.reports ? v.reports.toLocaleString("en-US") + " player reports" : "No player reports yet";
    if (v.appid) sub += " · Steam";
    var gpus = v.gpus.length ? '<div class="gc-gpus" aria-label="By graphics card">' + v.gpus.map(function (g) {
      return '<div class="gc-gpu"><span>' + g[0] + '</span><span class="gc-track"><i data-w="' + g[1] + '"></i></span><b>' +
        g[1] + "%</b></div>";
    }).join("") + "</div>" : "";
    var tags = [];
    if (v.native) tags.push("Has its own Linux version");
    if (v.anticheat.length) tags.push("Anti-cheat: " + v.anticheat.join(", "));
    var links = [];
    if (v.appid) {
      links.push('<a href="https://www.protondb.com/app/' + v.appid + '" rel="noopener">ProtonDB ↗</a>');
      links.push('<a href="https://store.steampowered.com/app/' + v.appid + '/" rel="noopener">Steam ↗</a>');
    }
    detail.innerHTML = '<article class="gc-card gc-' + l.cls + '"><div class="gc-head"><div><span class="gc-badge"><i></i>' +
      esc(l.text) + "</span><h3>" + esc(v.name) + '</h3><p class="gc-sub">' + sub + "</p></div>" + ring + "</div>" + gpus +
      '<ul class="gc-lines">' + lines(v).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
      (tags.length ? '<div class="gc-tags">' + tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      '<div class="gc-foot"><p>Source: ' + v.sources.join(", ") + "</p><span>" + links.join("") + "</span></div></article>";
    // the ring and the bars fill up from zero
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var r = detail.querySelector(".gc-ring");
        if (r) r.style.setProperty("--gc-p", r.getAttribute("data-p"));
        detail.querySelectorAll(".gc-track i").forEach(function (b) { b.style.width = b.getAttribute("data-w") + "%"; });
      });
    });
  }

  function run() {
    var q = input.value;
    if (!games) { if (q.trim()) load(); return; }
    found = search(q);
    active = found.length ? 0 : -1;
    list();
    if (found.length) show(found[0]);
    else if (normalize(q).length < 2) { detail.innerHTML = empty; reCount(); }
    else detail.innerHTML = '<div class="gc-msg"><b>No game found for “' + esc(q.trim()) + '”.</b>Try its name ' +
      "as the store writes it. The list only has games that players reported on, so a very new or little-known " +
      "game may be missing.</div>";
  }

  function reCount() {
    var count = root.querySelector("[data-gc-count]");
    if (count && games) count.textContent = keys.length.toLocaleString("en-US");
  }

  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(run, 90);
  });
  input.addEventListener("focus", load);
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!found.length) return;
      e.preventDefault();
      pick((active + (e.key === "ArrowDown" ? 1 : -1) + found.length) % found.length);
    } else if (e.key === "Escape" && input.value) {
      e.preventDefault();
      input.value = "";
      run();
    }
  });
  results.addEventListener("click", function (e) {
    var li = e.target.closest("li");
    if (li) pick(Array.prototype.indexOf.call(results.children, li));
  });
  root.querySelectorAll(".gc-try button").forEach(function (b) {
    b.addEventListener("click", function () {
      input.value = b.textContent;
      load().then(run);
    });
  });
  // "/" anywhere on the page jumps to the search, as on many sites
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.preventDefault();
    input.focus({ preventScroll: true });
    root.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  // the list starts loading when the search comes near the screen, so it is ready by the time someone types
  if ("IntersectionObserver" in window) {
    var near = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { near.disconnect(); load(); }
    }, { rootMargin: "400px 0px" });
    near.observe(root);
  }
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
