/* Femme Fatale — reading page controls (progress, font size, night mode) */
(function () {
  "use strict";

  var body = document.body;
  var root = document.documentElement;

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
    return null;
  }

  /* ----- theme ----- */
  var theme = store("ff-theme") === "dark" ? "dark" : "light";
  body.setAttribute("data-theme", theme);

  var themeBtn = document.querySelector(".theme-toggle");
  function paintTheme() {
    if (themeBtn) {
      themeBtn.textContent = body.getAttribute("data-theme") === "dark" ? "☀" : "☾";
      themeBtn.setAttribute(
        "aria-label",
        body.getAttribute("data-theme") === "dark" ? "الوضع النهاري" : "الوضع الليلي"
      );
    }
  }
  paintTheme();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      store("ff-theme", next);
      paintTheme();
    });
  }

  /* ----- font size ----- */
  var size = parseInt(store("ff-size"), 10);
  if (!size || size < 15 || size > 28) size = 19;
  root.style.setProperty("--read-size", size + "px");

  function setSize(n) {
    size = Math.max(15, Math.min(28, n));
    root.style.setProperty("--read-size", size + "px");
    store("ff-size", String(size));
  }

  var up = document.querySelector(".fs-up");
  var down = document.querySelector(".fs-down");
  if (up) up.addEventListener("click", function () { setSize(size + 1); });
  if (down) down.addEventListener("click", function () { setSize(size - 1); });

  /* ----- progress bar ----- */
  var bar = document.querySelector(".read-progress span");
  var page = document.querySelector(".read-page");

  function progress() {
    if (!bar || !page) return;
    var rect = page.getBoundingClientRect();
    var total = rect.height - window.innerHeight * 0.6;
    var done = -rect.top + window.innerHeight * 0.2;
    var pct = Math.max(0, Math.min(1, done / Math.max(total, 1)));
    bar.style.width = (pct * 100).toFixed(1) + "%";
  }
  progress();
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);
})();
