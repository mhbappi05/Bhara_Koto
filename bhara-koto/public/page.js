// Shared by About, Contact and Privacy pages: Bangla/English switch.
(function () {
  var body = document.body;
  var bn = document.getElementById("bn");
  var en = document.getElementById("en");
  var buttons = document.querySelectorAll("[data-set-lang]");
  var links = document.querySelectorAll("a[data-base]");
  var titles = { bn: body.getAttribute("data-title-bn"), en: body.getAttribute("data-title-en") };

  function setLang(lang) {
    bn.hidden = lang !== "bn";
    en.hidden = lang !== "en";
    document.documentElement.lang = lang;
    if (titles[lang]) document.title = titles[lang];
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-set-lang") === lang));
    }
    // keep the chosen language when moving between these pages
    for (var j = 0; j < links.length; j++) {
      var base = links[j].getAttribute("data-base");
      links[j].setAttribute("href", lang === "en" && base !== "/" ? base + "?lang=en" : base);
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
      var lang = e.currentTarget.getAttribute("data-set-lang");
      setLang(lang);
      try {
        history.replaceState(null, "", lang === "en" ? "?lang=en" : location.pathname);
      } catch (err) {
        /* ignore */
      }
    });
  }

  var wanted = "bn";
  try {
    wanted = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "bn";
  } catch (err) {
    /* ignore */
  }
  setLang(wanted);

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
