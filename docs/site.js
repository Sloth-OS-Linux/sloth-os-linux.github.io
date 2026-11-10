document.documentElement.classList.add("js-ready");

/* A card asking for a DistroWatch recommendation: a sloth giving a thumbs-up, bouncing back and forth along the
   bottom of the window until someone presses Recommend (gone for good) or the X (gone for two weeks). It stops
   while the pointer or the keyboard focus is on it, and stays still in the corner with reduced motion. */
(function () {
  var KEY = "sloth-distrowatch";
  var LATER = 14 * 24 * 3600 * 1000;
  var URL = "https://distrowatch.com/dwres.php?resource=links#new";
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
    card.setAttribute("aria-label", "Recommend Sloth OS on DistroWatch");
    card.innerHTML = '<div class="dw-body"><span class="dw-sloth" aria-hidden="true">' +
      '<img src="./assets/sloth-logo.svg" alt=""><span>\u{1F44D}</span></span>' +
      '<button class="dw-x" type="button" aria-label="Close">\u00d7</button>' +
      "<p><strong>Like Sloth OS?</strong>Please help spread the idea: find Sloth OS in DistroWatch\u2019s waiting " +
      "list and press <em>Recommend</em>. It takes ten seconds and means a lot to me.</p>" +
      '<a class="button button-primary" href="' + URL + '" target="_blank" rel="noopener">' +
      "Recommend on DistroWatch \u2197</a></div>";
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
