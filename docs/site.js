document.documentElement.classList.add("js-ready");

/* A small card in the bottom-right corner asking for a DistroWatch recommendation. It bounces in like a polka-dot
   ball, hops again now and then, and goes away for good with Recommend, or for two weeks with the X. */
(function () {
  var KEY = "sloth-distrowatch";
  var LATER = 14 * 24 * 3600 * 1000;
  var URL = "https://distrowatch.com/dwres.php?resource=links#new";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private window: shown again next time */ } }
  var seen = get();
  if (seen === "done" || (seen && Date.now() - Number(seen) < LATER)) return;

  var css = "" +
    ".dw-card{position:fixed;right:20px;bottom:20px;z-index:50;width:min(320px,calc(100vw - 32px));box-sizing:border-box;" +
    "padding:16px 16px 16px 72px;border:1px solid var(--line,rgba(227,229,232,.12));border-radius:18px;" +
    "background:var(--panel,#2b2d31);color:var(--ink,#e3e5e8);box-shadow:0 18px 40px rgba(0,0,0,.45);" +
    "font-size:.86rem;line-height:1.45;transform-origin:50% 100%;opacity:0;pointer-events:none}" +
    ".dw-card.dw-in{opacity:1;pointer-events:auto;animation:dw-drop 1.6s cubic-bezier(.3,0,.3,1) both}" +
    ".dw-card.dw-hop{animation:dw-hop 1.1s ease both}" +
    ".dw-ball{position:absolute;left:16px;top:16px;width:42px;height:42px;border-radius:50%;" +
    "background:radial-gradient(circle at 30% 28%,rgba(255,255,255,.55) 0 12%,transparent 13%)," +
    "radial-gradient(circle,#fff 0 22%,transparent 24%) 0 0/14px 14px," +
    "radial-gradient(circle,#fff 0 22%,transparent 24%) 7px 7px/14px 14px,#d6283a;" +
    "box-shadow:inset -5px -6px 10px rgba(0,0,0,.28)}" +
    ".dw-card p{margin:0 0 .7rem;color:var(--ink,#e3e5e8)}" +
    ".dw-card strong{display:block;margin-bottom:.2rem;font-size:.95rem}" +
    ".dw-card .button{margin:0;width:100%;white-space:nowrap;padding:.7rem 1rem}" +
    ".dw-x{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;border-radius:50%;background:transparent;" +
    "color:var(--muted,#9aa0a7);font-size:20px;line-height:1;cursor:pointer}" +
    ".dw-x:hover,.dw-x:focus-visible{background:rgba(255,255,255,.08);color:var(--ink,#e3e5e8)}" +
    "@keyframes dw-drop{0%{transform:translateY(-70vh)}30%{transform:translateY(0) scale(1.06,.9)}" +
    "42%{transform:translateY(-90px) scale(.97,1.03)}54%{transform:translateY(0) scale(1.04,.94)}" +
    "64%{transform:translateY(-40px)}74%{transform:translateY(0) scale(1.02,.97)}82%{transform:translateY(-14px)}" +
    "90%,100%{transform:none}}" +
    "@keyframes dw-hop{0%,100%{transform:none}15%{transform:scale(1.04,.94)}35%{transform:translateY(-36px) scale(.98,1.03)}" +
    "55%{transform:scale(1.03,.95)}70%{transform:translateY(-12px)}85%{transform:none}}" +
    "@media(max-width:600px){.dw-card{right:16px;bottom:16px;padding:12px 12px 12px 58px;font-size:.8rem}" +
    ".dw-ball{left:12px;top:12px;width:34px;height:34px}}" +
    "@media(prefers-reduced-motion:reduce){.dw-card.dw-in,.dw-card.dw-hop{animation:none}}";

  function show() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    var card = document.createElement("aside");
    card.className = "dw-card";
    card.setAttribute("aria-label", "Recommend Sloth OS on DistroWatch");
    card.innerHTML = '<span class="dw-ball" aria-hidden="true"></span>' +
      '<button class="dw-x" type="button" aria-label="Close">×</button>' +
      "<p><strong>Like Sloth OS?</strong>Please help spread the idea: find Sloth OS in DistroWatch’s waiting " +
      "list and press <em>Recommend</em>. It takes ten seconds and means a lot to me.</p>" +
      '<a class="button button-primary" href="' + URL + '" target="_blank" rel="noopener">Recommend on DistroWatch ↗</a>';
    document.body.appendChild(card);
    var timer;
    function close(value) {
      set(value);
      clearInterval(timer);
      card.remove();
    }
    card.querySelector(".dw-x").addEventListener("click", function () { close(String(Date.now())); });
    card.querySelector("a").addEventListener("click", function () { close("done"); });
    card.addEventListener("animationend", function () { card.classList.remove("dw-hop"); });
    requestAnimationFrame(function () { card.classList.add("dw-in"); });
    timer = setInterval(function () {  // a hop every 20 seconds, while the page is in view
      if (document.hidden) return;
      card.classList.remove("dw-in");
      card.style.opacity = "1";
      card.style.pointerEvents = "auto";
      void card.offsetWidth;
      card.classList.add("dw-hop");
    }, 20000);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(show, 3000); });
  } else {
    setTimeout(show, 3000);
  }
})();
