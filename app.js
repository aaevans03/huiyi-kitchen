// Builds the whole site from window.SITE_DATA (data.js) and window.SITE_CONTENT
// (content.js). Nothing about categories, filters, or recipes is hard-coded here.
//
// One page, many views, picked by the part of the URL after "#":
//   #/                        home (search, region filters, recipe types)
//   #/?q=beef&region=taiwan   home with search results showing
//   #/recipes                 every recipe, with filters
//   #/kind/noodles            one category (any attribute shown on the home page)
//   #/recipe/beef-noodle-soup recipe page (?from=kind:noodles sets the breadcrumb)
//   #/about, #/contact

(function () {
  "use strict";

  var data = window.SITE_DATA || { attributes: [], recipes: [], tasks: [] };
  var content = window.SITE_CONTENT || { images: { category: {}, recipe: {} }, labelsZh: {}, search: {}, details: {} };
  var main = document.getElementById("main");
  var LANG_KEY = "huiyi.lang";

  // ---------- helpers ----------

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
    if (text != null) node.textContent = text;
    return node;
  }

  function attrById(id) {
    for (var i = 0; i < data.attributes.length; i++) if (data.attributes[i].id === id) return data.attributes[i];
    return null;
  }

  function valuesOf(recipe, attr) {
    var v = recipe[attr.id];
    return Array.isArray(v) ? v : [];
  }

  function findValue(attr, valueId) {
    for (var i = 0; i < attr.values.length; i++) {
      if (attr.values[i][0] === valueId) return attr.values[i];
    }
    return null;
  }

  function hasValue(recipe, attr, valueId) { return valuesOf(recipe, attr).indexOf(valueId) !== -1; }

  // [Chinese, pinyin, flags] for an attribute value, or blanks.
  function zhOf(attrId, valueId) {
    var group = content.labelsZh[attrId] || {};
    return group[valueId] || ["", "", []];
  }

  function byName(a, b) { return a.name.localeCompare(b.name); }

  function slugOf(recipe) {
    return recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function recipeBySlug(slug) {
    for (var i = 0; i < data.recipes.length; i++) if (slugOf(data.recipes[i]) === slug) return data.recipes[i];
    return null;
  }

  function photo(id, width) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=70";
  }

  // A photo with a soft placeholder behind it, which also shows if the photo can't load.
  function thumb(id, width, alt, className) {
    var box = el("span", { class: "thumb " + (className || "") });
    if (id) {
      var img = el("img", { src: photo(id, width), alt: alt || "", loading: "lazy", decoding: "async" });
      img.addEventListener("error", function () { img.remove(); });
      box.appendChild(img);
    }
    return box;
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function storageGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ } }

  // ---------- routing ----------

  function parseHash() {
    var raw = window.location.hash.replace(/^#/, "") || "/";
    var q = raw.indexOf("?");
    var path = q === -1 ? raw : raw.slice(0, q);
    var params = new URLSearchParams(q === -1 ? "" : raw.slice(q + 1));
    var parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    return { parts: parts, params: params };
  }

  function hashFor(parts, params) {
    var path = "#/" + parts.map(encodeURIComponent).join("/");
    var s = params ? params.toString() : "";
    return path + (s ? "?" + s : "");
  }

  // Updates the address bar for in-view changes (search, filters) without a new history entry.
  function replaceParams(params) {
    var route = parseHash();
    window.history.replaceState(null, "", hashFor(route.parts, params));
  }

  function setPage(name, title) {
    document.body.setAttribute("data-page", name);
    document.title = title ? title + " | 回憶廚房 Huiyi Kitchen" : "回憶廚房 Huiyi Kitchen";
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      var on = a.getAttribute("data-nav") === name;
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  var lastPath = null;

  function render() {
    var route = parseHash();
    var parts = route.parts;
    var path = parts.join("/");
    main.innerHTML = "";

    // A random recipe; replacing the address keeps "back" pointing at the page before.
    if (path === "random") {
      var pick = data.recipes[Math.floor(Math.random() * data.recipes.length)];
      window.location.replace(hashFor(["recipe", slugOf(pick)]));
      return;
    }

    if (parts.length === 0) buildHome();
    else if (path === "recipes") buildListing(null, route.params);
    else if (path === "about") buildAbout();
    else if (path === "contact") buildContact();
    else if (parts[0] === "recipe" && parts.length === 2) buildRecipe(parts[1], route.params);
    else if (parts.length === 2 && attrById(parts[0]) && attrById(parts[0]).onHome) buildListing({ attr: attrById(parts[0]), valueId: parts[1] }, route.params);
    else buildNotFound();

    // A new view starts at the top; staying on the same view (e.g. back from a filter) doesn't jump.
    if (path !== lastPath) {
      window.scrollTo(0, 0);
      if (lastPath !== null) main.focus({ preventScroll: true });
    }
    lastPath = path;
    // Pages with a search box start with it focused, so people can just type.
    var box = main.querySelector("input[type=search]");
    if (box) {
      box.focus({ preventScroll: true });
      box.setSelectionRange(box.value.length, box.value.length);
    }
    if (window.TreeTest && window.TreeTest.routeChanged) window.TreeTest.routeChanged();
  }

  // ---------- shared pieces ----------

  // crumbs: [{ text, href? }]; the last one is the current page.
  function breadcrumb(crumbs) {
    var nav = el("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" });
    var ol = el("ol");
    crumbs.forEach(function (crumb, i) {
      var li = el("li");
      if (crumb.href && i < crumbs.length - 1) {
        li.appendChild(el("a", { href: crumb.href, "data-log": "link", "data-label": crumb.text }, crumb.text));
      } else {
        li.appendChild(el("span", { "aria-current": "page" }, crumb.text));
      }
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    return nav;
  }

  function cardLabel(recipe) {
    var label = el("span", { class: "card-label" });
    label.appendChild(el("span", { class: "en" }, recipe.name));
    label.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, recipe.zh));
    return label;
  }

  // During a tree test, recipe cards are buttons the participant selects; otherwise links.
  function recipeCard(recipe, from) {
    var li = el("li");
    var image = thumb(content.images.recipe[recipe.name], 600, "");
    if (window.TreeTest && window.TreeTest.cardsClickable()) {
      var chosen = window.TreeTest.selectedName() === recipe.name;
      var btn = el("button", {
        type: "button", class: "recipe-card card" + (chosen ? " selected" : ""),
        "data-name": recipe.name, "aria-pressed": chosen ? "true" : "false",
      });
      btn.appendChild(image);
      btn.appendChild(cardLabel(recipe));
      li.appendChild(btn);
    } else {
      var params = new URLSearchParams();
      if (from) params.set("from", from);
      var a = el("a", {
        class: "recipe-card", href: hashFor(["recipe", slugOf(recipe)], params),
        "data-log": "link", "data-label": recipe.name,
      });
      a.appendChild(image);
      a.appendChild(cardLabel(recipe));
      li.appendChild(a);
    }
    return li;
  }

  function recipeGrid(recipes, from) {
    var ul = el("ul", { class: "recipe-grid" });
    recipes.forEach(function (r) { ul.appendChild(recipeCard(r, from)); });
    return ul;
  }

  // ---------- search ----------

  // Traditional to simplified for the characters our names and labels use, so either
  // script finds the same recipes.
  var T2S = {};
  ("麵面雞鸡豬猪魚鱼湯汤飯饭灣湾國国馬马亞亚鮮鲜類类與与燒烧絲丝鍋锅餃饺滷卤魯鲁黃黄麗丽餅饼腸肠蝦虾條条" +
   "漿浆來来蘭兰蔥葱薑姜醬酱鹹咸鹽盐蕃番哩喱燉炖蘿萝蔔卜醃腌熱热涼凉餛馄飩饨鮑鲍雲云臺台鴨鸭鵝鹅籠笼" +
   "魷鱿蠔蚝貝贝葉叶筍笋麥麦廚厨憶忆淨净煙烟糰团腳脚檸柠")
    .match(/../g).forEach(function (pair) { T2S[pair[0]] = pair[1]; });

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "") // pinyin tone marks, accents
      .replace(/[一-鿿]/g, function (c) { return T2S[c] || c; })
      .replace(/[’'()（）／/,，、.。]/g, " ");
  }

  var CJK = /[㐀-鿿]/;
  var searchIndex = null;

  function buildSearchIndex() {
    searchIndex = data.recipes.map(function (recipe) {
      var extra = content.search[recipe.name] || {};
      var pinyin = extra.pinyin || "";
      var names = [recipe.name, recipe.zh, pinyin, pinyin.replace(/\s+/g, ""), extra.also || ""].join(" ");
      var labels = [];
      data.attributes.forEach(function (attr) {
        valuesOf(recipe, attr).forEach(function (id) {
          var v = findValue(attr, id);
          var zh = zhOf(attr.id, id);
          if (v) labels.push(v[1], zh[0], zh[1], (zh[1] || "").replace(/\s+/g, ""));
        });
      });
      return { recipe: recipe, names: normalize(names), labels: normalize(labels.join(" ")) };
    });
  }

  // Each word must match somewhere. Name matches rank above category/ingredient matches.
  function search(query) {
    if (!searchIndex) buildSearchIndex();
    var tokens = normalize(query).split(/\s+/).filter(Boolean).map(function (t) {
      return CJK.test(t) ? t : t.replace(/([a-z])[1-5]/g, "$1"); // "niu2 rou4" works too
    });
    if (!tokens.length) return data.recipes.slice().sort(byName);

    function hit(hay, t) {
      if (hay.indexOf(t) !== -1) return true;
      return t.length > 3 && /s$/.test(t) && hay.indexOf(t.slice(0, -1)) !== -1; // "eggs" → "egg"
    }

    var scored = [];
    searchIndex.forEach(function (entry) {
      var score = 0;
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (hit(entry.names, t)) score += 3;
        else if (hit(entry.labels, t)) score += 2;
        // Chinese typed without spaces, like 台灣牛肉: every character appears somewhere.
        else if (CJK.test(t) && t.split("").every(function (c) { return (entry.names + entry.labels).indexOf(c) !== -1; })) score += 1;
        else return;
      }
      scored.push({ recipe: entry.recipe, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score || byName(a.recipe, b.recipe); });
    return scored.map(function (s) { return s.recipe; });
  }

  // ---------- home ----------

  // The home page only leads somewhere: search goes to the recipes page, a country
  // goes to that region's page, a recipe type goes to its category page.
  function buildHome() {
    setPage("home");
    var regionAttr = attrById("region");
    var kindAttr = data.attributes.filter(function (a) { return a.onHome && a.id !== "region"; })[0];

    var hero = el("section", { class: "hero" });
    var card = el("div", { class: "search-card" });
    card.appendChild(el("h1", null, "Find Recipes"));
    card.appendChild(el("p", { class: "search-hint" }, "Search in English, 中文, or pinyin"));
    card.appendChild(searchForm("", "home"));
    hero.appendChild(card);

    if (regionAttr) {
      var regions = el("nav", { class: "region-links", "aria-label": "Recipes by region" });
      regionAttr.values.forEach(function (value) {
        var zh = zhOf("region", value[0]);
        var a = el("a", {
          class: "region-link", href: hashFor([regionAttr.id, value[0]]),
          "data-log": "link", "data-label": value[1],
        });
        if (zh[2] && zh[2].length) {
          var flags = el("span", { class: "flags", "aria-hidden": "true" });
          zh[2].forEach(function (code) {
            flags.appendChild(el("img", { src: "assets/flags/" + code + ".svg", alt: "", width: "36", height: "36" }));
          });
          a.appendChild(flags);
        }
        var names = el("span", { class: "region-names" });
        // "Singapore/Malaysia" may wrap after the slash on narrow screens.
        var en = el("span", { class: "en" });
        value[1].split("/").forEach(function (part, i) {
          if (i > 0) { en.appendChild(document.createTextNode("/")); en.appendChild(el("wbr")); }
          en.appendChild(document.createTextNode(part));
        });
        names.appendChild(en);
        if (zh[0]) names.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, zh[0]));
        a.appendChild(names);
        regions.appendChild(a);
      });
      var random = el("a", { class: "region-link random-link", href: "#/random", "data-log": "link", "data-label": "Random recipe" });
      random.appendChild(shuffleIcon());
      var rnames = el("span", { class: "region-names" });
      rnames.appendChild(el("span", { class: "en" }, "Random recipe"));
      rnames.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, "隨機食譜"));
      random.appendChild(rnames);
      regions.appendChild(random);
      hero.appendChild(regions);
    }
    main.appendChild(hero);

    if (kindAttr) {
      var browse = el("section", { class: "browse", "aria-labelledby": "browse-title" });
      browse.appendChild(el("h2", { id: "browse-title", class: "section-title" }, "Browse by Recipe Type"));
      var grid = el("ul", { class: "category-grid" });
      kindAttr.values.forEach(function (value) {
        var zh = zhOf(kindAttr.id, value[0]);
        var li = el("li");
        var a = el("a", {
          class: "category-card", href: hashFor([kindAttr.id, value[0]]),
          "data-log": "link", "data-label": value[1],
        });
        a.appendChild(thumb(content.images.category[value[0]], 700, ""));
        var strip = el("span", { class: "card-label" });
        strip.appendChild(el("span", { class: "en" }, value[1]));
        if (zh[0]) strip.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, zh[0]));
        a.appendChild(strip);
        li.appendChild(a);
        grid.appendChild(li);
      });
      browse.appendChild(grid);
      main.appendChild(browse);
    }
  }

  function shuffleIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "shuffle-icon");
    svg.setAttribute("aria-hidden", "true");
    ["M16 3h5v5", "M4 20 21 3", "M21 16v5h-5", "M15 15l6 6", "M4 4l5 5"].forEach(function (d) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });
    return svg;
  }

  // Search box. On the home page, searching opens the recipes page; on the recipes
  // page (where = "recipes") the page filters as you type, so the caller handles it.
  function searchForm(query, where) {
    var form = el("form", { class: "search-form" + (where === "home" ? "" : " search-form-compact"), role: "search" });
    var id = "search-" + where;
    form.appendChild(el("label", { for: id, class: "visually-hidden" }, "Search recipes"));
    var narrow = window.matchMedia("(max-width: 720px)").matches;
    var input = el("input", {
      type: "search", id: id, name: "q", autocomplete: "off",
      placeholder: narrow || where !== "home" ? "Dishes, ingredients, keywords…" : "Search ingredients, dishes, or keywords…",
    });
    input.value = query;
    var submit = el("button", { type: "submit", class: "btn-primary", "data-log": "search", "data-label": "Search: " + query }, "Search");
    form.appendChild(input);
    form.appendChild(submit);
    input.addEventListener("input", function () {
      submit.setAttribute("data-label", "Search: " + input.value.trim());
    });
    if (where === "home") {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var p = new URLSearchParams();
        if (input.value.trim()) p.set("q", input.value.trim());
        window.location.hash = hashFor(["recipes"], p);
      });
    }
    return form;
  }

  // ---------- listing (one category, or every recipe) ----------

  // category: { attr, valueId } or null for every recipe.
  function buildListing(category, params) {
    var recipes, title, zhTitle = "", from = null, filterAttrs;

    if (category) {
      var value = findValue(category.attr, category.valueId);
      if (!value) { buildNotFound(); return; }
      title = value[1];
      zhTitle = zhOf(category.attr.id, value[0])[0];
      from = category.attr.id + ":" + value[0];
      recipes = data.recipes.filter(function (r) { return hasValue(r, category.attr, value[0]); });
      filterAttrs = data.attributes.filter(function (a) { return a.asFilter && a.id !== category.attr.id; });
      setPage("category", title);
    } else {
      title = "Recipes";
      zhTitle = "全部食譜";
      from = "recipes";
      recipes = data.recipes.slice();
      filterAttrs = data.attributes.slice();
      setPage("recipes", title);
    }
    recipes.sort(byName);

    // Only show filters that can narrow this list.
    filterAttrs = filterAttrs.filter(function (a) {
      return a.values.some(function (value) {
        var n = recipes.filter(function (r) { return hasValue(r, a, value[0]); }).length;
        return n > 0 && n < recipes.length;
      });
    });

    main.appendChild(breadcrumb([{ text: "Home", href: "#/" }, { text: title }]));
    var head = el("div", { class: "page-head" });
    var h1 = el("h1", null, title);
    if (zhTitle) h1.appendChild(el("span", { class: "title-zh", lang: "zh-Hant" }, zhTitle));
    head.appendChild(h1);
    main.appendChild(head);

    // Only the recipes page has a search box; it narrows the list as you type.
    var query = category ? "" : (params.get("q") || "").trim();
    var form = null;
    if (!category) {
      form = searchForm(query, "recipes");
      head.appendChild(form);
    }

    var layout = el("div", { class: "listing" + (filterAttrs.length ? "" : " no-filters") });
    var aside = el("aside", { class: "filters", "aria-labelledby": "filters-title" });
    var asideHead = el("div", { class: "filters-head" });
    asideHead.appendChild(el("h2", { id: "filters-title" }, "Filters"));
    var clear = el("button", { type: "button", class: "btn-link", id: "clear-filters", "data-log": "clear filters", "data-label": "Clear filters" }, "Clear all");
    asideHead.appendChild(clear);
    aside.appendChild(asideHead);

    filterAttrs.forEach(function (attr) {
      var picked = (params.get(attr.id) || "").split(",");
      var group = el("div", { class: "filter-group", role: "group", "aria-labelledby": "fg-" + attr.id });
      group.appendChild(el("h3", { id: "fg-" + attr.id }, attr.label));
      var pills = el("div", { class: "pill-row" });
      attr.values.forEach(function (value) {
        var on = picked.indexOf(value[0]) !== -1;
        var btn = el("button", {
          type: "button", class: "pill toggle", "aria-pressed": on ? "true" : "false",
          "data-attr": attr.id, "data-value": value[0], "data-label": attr.label + ": " + value[1],
        });
        btn.appendChild(el("span", null, value[1]));
        btn.appendChild(el("span", { class: "count" }));
        pills.appendChild(btn);
      });
      group.appendChild(pills);
      aside.appendChild(group);
    });
    if (filterAttrs.length) layout.appendChild(aside);

    var section = el("section", { class: "listing-results", "aria-label": "Recipes" });
    var countEl = el("p", { class: "result-count", "aria-live": "polite" });
    var gridHolder = el("div");
    section.appendChild(countEl);
    section.appendChild(gridHolder);
    layout.appendChild(section);
    main.appendChild(layout);

    function selected() {
      return filterAttrs.map(function (attr) {
        var on = aside.querySelectorAll("button.toggle[data-attr='" + attr.id + "'][aria-pressed='true']");
        return { attr: attr, ids: Array.prototype.map.call(on, function (b) { return b.getAttribute("data-value"); }) };
      }).filter(function (s) { return s.ids.length > 0; });
    }

    // Within a filter: match any. Across filters: match all.
    function matches(recipe, s) {
      return s.ids.some(function (id) { return hasValue(recipe, s.attr, id); });
    }

    function update(pushUrl) {
      var sel = selected();
      // Searching keeps the best matches first; otherwise A to Z.
      var base = query ? search(query).filter(function (r) { return recipes.indexOf(r) !== -1; }) : recipes;
      var shown = base.filter(function (r) { return sel.every(function (s) { return matches(r, s); }); });

      // Count beside each option: what would match if it were on, given the other filters.
      filterAttrs.forEach(function (attr) {
        var others = sel.filter(function (s) { return s.attr !== attr; });
        var pool = base.filter(function (r) { return others.every(function (s) { return matches(r, s); }); });
        attr.values.forEach(function (value) {
          var n = pool.filter(function (r) { return hasValue(r, attr, value[0]); }).length;
          var btn = aside.querySelector("button.toggle[data-attr='" + attr.id + "'][data-value='" + value[0] + "']");
          btn.querySelector(".count").textContent = n;
          btn.classList.toggle("is-empty", n === 0 && btn.getAttribute("aria-pressed") !== "true");
        });
      });
      clear.hidden = sel.length === 0;

      if (pushUrl) {
        var p = new URLSearchParams();
        if (query) p.set("q", query);
        sel.forEach(function (s) { p.set(s.attr.id, s.ids.join(",")); });
        replaceParams(p);
      }

      if (query) countEl.textContent = plural(shown.length, "recipe") + " matching “" + query + "”";
      else if (sel.length) countEl.textContent = "Showing " + shown.length + " of " + plural(recipes.length, "recipe");
      else countEl.textContent = plural(recipes.length, "recipe");
      gridHolder.innerHTML = "";
      if (shown.length) gridHolder.appendChild(recipeGrid(shown, from));
      else gridHolder.appendChild(el("p", { class: "empty" }, query
        ? "No recipes found. Try a dish name, an ingredient, or pinyin (niu rou mian)."
        : "No recipes match these filters."));
    }

    if (form) {
      var input = form.querySelector("input");
      var setQuery = function () {
        query = input.value.trim();
        update(true);
      };
      input.addEventListener("input", setQuery);
      form.addEventListener("submit", function (e) { e.preventDefault(); setQuery(); });
    }

    aside.addEventListener("click", function (e) {
      var btn = e.target.closest("button.toggle");
      if (!btn) return;
      btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") === "true" ? "false" : "true");
      update(true);
    });
    clear.addEventListener("click", function () {
      aside.querySelectorAll("button.toggle").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      update(true);
    });
    update(false);
  }

  // ---------- recipe ----------

  function currentLang() {
    var saved = storageGet(LANG_KEY);
    return saved === "en" || saved === "zh" || saved === "both" ? saved : "both";
  }

  // Two matching cells, English then Chinese, so "Both" can line them up in two columns.
  function pair(container, tag, attrs, en, zh) {
    var a = el(tag, attrs);
    a.classList.add("en");
    var b = el(tag, attrs);
    b.classList.add("zh");
    b.setAttribute("lang", "zh-Hant");
    if (typeof en === "function") { en(a); zh(b); } else { a.textContent = en; b.textContent = zh; }
    container.appendChild(a);
    container.appendChild(b);
  }

  function buildRecipe(slug, params) {
    var recipe = recipeBySlug(slug);
    if (!recipe) { buildNotFound(); return; }
    setPage("recipe", recipe.name);
    var details = content.details[recipe.name] || null;
    var kindAttr = attrById("kind");
    var regionAttr = attrById("region");

    // Breadcrumb: the category the reader came from, or the recipe's first kind of dish.
    var crumbs = [{ text: "Home", href: "#/" }];
    if (params.get("from") === "recipes") crumbs.push({ text: "Recipes", href: "#/recipes" });
    var from = (params.get("from") || "").split(":");
    var fromAttr = attrById(from[0]);
    var fromValue = fromAttr && hasValue(recipe, fromAttr, from[1]) ? findValue(fromAttr, from[1]) : null;
    if (!fromValue && crumbs.length === 1 && kindAttr && valuesOf(recipe, kindAttr).length) {
      fromAttr = kindAttr;
      fromValue = findValue(kindAttr, valuesOf(recipe, kindAttr)[0]);
    }
    if (fromValue) crumbs.push({ text: fromValue[1], href: hashFor([fromAttr.id, fromValue[0]]) });
    crumbs.push({ text: recipe.name });

    var article = el("article", { class: "recipe lang-" + currentLang() });

    var top = el("div", { class: "recipe-top" });
    top.appendChild(breadcrumb(crumbs));
    var toggle = el("div", { class: "lang-toggle", role: "group", "aria-label": "Recipe language" });
    [["en", "EN"], ["both", "Both"], ["zh", "中文"]].forEach(function (opt) {
      var b = el("button", {
        type: "button", "data-lang": opt[0], "aria-pressed": currentLang() === opt[0] ? "true" : "false",
        "data-log": "language", "data-label": "Language: " + opt[1],
      }, opt[1]);
      toggle.appendChild(b);
    });
    top.appendChild(toggle);
    article.appendChild(top);

    var h1 = el("h1", { class: "recipe-title" });
    h1.appendChild(el("span", { class: "en" }, recipe.name));
    h1.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, recipe.zh));
    article.appendChild(h1);

    if (details && details.intro) {
      var intro = el("div", { class: "recipe-intro" });
      pair(intro, "p", null, details.intro[0], details.intro[1]);
      article.appendChild(intro);
    }

    var hero = el("figure", { class: "recipe-hero" });
    hero.appendChild(thumb(content.images.recipe[recipe.name], 1600, recipe.name + " " + recipe.zh, "hero-img"));
    article.appendChild(hero);

    // Quick facts
    var badges = el("ul", { class: "badges", "aria-label": "Recipe facts" });
    function badge(icon, en, zh) {
      var li = el("li", { class: "badge" });
      li.appendChild(el("span", { class: "badge-icon", "aria-hidden": "true" }, icon));
      li.appendChild(el("span", { class: "en" }, en));
      li.appendChild(el("span", { class: "zh", lang: "zh-Hant" }, zh));
      badges.appendChild(li);
    }
    var meta = details && details.meta;
    if (meta) {
      badge("⏱", "Prep " + meta.prep[0] + " · Cook " + meta.cook[0], "準備 " + meta.prep[1] + " · 烹調 " + meta.cook[1]);
      badge("🍜", "Serves " + meta.servings, meta.servings + " 人份");
      badge("🌶", "Spice: " + meta.spice[0], "辣度：" + meta.spice[1]);
    }
    var origins = meta && meta.origin ? [meta.origin] : valuesOf(recipe, regionAttr);
    if (origins.length) {
      badge("📍",
        "Origin: " + origins.map(function (id) { return findValue(regionAttr, id)[1]; }).join(", "),
        "產地：" + origins.map(function (id) { return zhOf("region", id)[0]; }).join("、"));
    }
    article.appendChild(badges);

    // Ingredients and steps, as English/Chinese pairs.
    var body = el("div", { class: "bilingual" });
    if (details) {
      pair(body, "h2", { class: "section-title" }, "Ingredients", "材料");
      var key = 0;
      details.ingredients.forEach(function (group) {
        pair(body, "h3", { class: "ing-group" }, group.group[0], group.group[1]);
        group.items.forEach(function (item) {
          var k = "ing-" + (key++);
          function fill(text) {
            return function (label) {
              label.appendChild(el("input", { type: "checkbox", "data-key": k }));
              label.appendChild(el("span", null, text));
            };
          }
          pair(body, "label", { class: "ingredient" }, fill(item[0]), fill(item[1]));
        });
      });
      pair(body, "h2", { class: "section-title steps-title" }, "Steps", "步驟");
      details.steps.forEach(function (step, i) {
        function fill(text) {
          return function (box) {
            box.appendChild(el("span", { class: "step-num", "aria-hidden": "true" }, String(i + 1)));
            box.appendChild(el("p", null, text));
          };
        }
        pair(body, "div", { class: "step" }, fill(step[0]), fill(step[1]));
      });
    } else {
      pair(body, "p", { class: "coming-soon" },
        "The full recipe for " + recipe.name + " is coming soon.",
        recipe.zh + "的完整食譜即將推出。");
    }
    article.appendChild(body);

    // Where else this recipe lives.
    var tags = el("div", { class: "recipe-tags" });
    tags.appendChild(el("h2", { class: "visually-hidden" }, "Find similar recipes"));
    data.attributes.filter(function (a) { return a.onHome; }).forEach(function (attr) {
      valuesOf(recipe, attr).forEach(function (id) {
        var v = findValue(attr, id);
        var a = el("a", { class: "pill", href: hashFor([attr.id, id]), "data-log": "link", "data-label": v[1] });
        a.appendChild(el("span", null, v[1]));
        var zh = zhOf(attr.id, id)[0];
        if (zh) a.appendChild(el("span", { class: "pill-zh", lang: "zh-Hant" }, zh));
        tags.appendChild(a);
      });
    });
    article.appendChild(tags);
    main.appendChild(article);

    toggle.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (!b) return;
      var lang = b.getAttribute("data-lang");
      storageSet(LANG_KEY, lang);
      article.className = "recipe lang-" + lang;
      toggle.querySelectorAll("button").forEach(function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
    });
    // An ingredient checked in one language is checked in the other too.
    body.addEventListener("change", function (e) {
      var k = e.target.getAttribute("data-key");
      if (!k) return;
      body.querySelectorAll("input[data-key='" + k + "']").forEach(function (box) { box.checked = e.target.checked; });
    });
  }

  // ---------- simple pages ----------

  function prose(pageName, title, zh, paragraphs) {
    setPage(pageName, title);
    main.appendChild(breadcrumb([{ text: "Home", href: "#/" }, { text: title }]));
    var section = el("section", { class: "prose" });
    var h1 = el("h1", null, title);
    if (zh) h1.appendChild(el("span", { class: "title-zh", lang: "zh-Hant" }, zh));
    section.appendChild(h1);
    paragraphs.forEach(function (p) { section.appendChild(el("p", null, p)); });
    main.appendChild(section);
    return section;
  }

  function buildAbout() {
    prose("about", "About", "關於我們", [
      "回憶 (huí yì) means “memories.” Huiyi Kitchen collects the home-style dishes people remember from China, Taiwan, Hong Kong, Singapore and Malaysia: the breakfast from a corner stall, the soup a grandparent made, the dish you ordered every week abroad.",
      "Every recipe is written in both English and Traditional Chinese, so you can cook it yourself or share it with family in the language they read best.",
    ]);
  }

  function buildContact() {
    prose("contact", "Contact", "聯絡我們", [
      "Have a family recipe to share, or found a mistake in one of ours? We'd love to hear from you.",
      "A contact form is coming soon.",
    ]);
  }

  function buildNotFound() {
    var section = prose("notfound", "Page not found", "", ["We couldn't find that page."]);
    var p = el("p");
    p.appendChild(el("a", { href: "#/", class: "btn-primary" }, "Back to Home"));
    section.appendChild(p);
  }

  // ---------- data validation (shown as a visible banner) ----------

  function validate() {
    var problems = [];
    var names = {};
    data.recipes.forEach(function (recipe, i) {
      var name = recipe.name || "(recipe #" + (i + 1) + " has no name)";
      if (names[name]) problems.push(name + ": listed more than once");
      names[name] = true;
      if (!recipe.zh) problems.push(name + ": missing Chinese name");
      data.attributes.forEach(function (attr) {
        if (!Array.isArray(recipe[attr.id])) {
          problems.push(name + ": \"" + attr.label + "\" should be a list, like [] or [\"value\"]");
          return;
        }
        if (attr.required && recipe[attr.id].length === 0) {
          problems.push(name + ": needs at least one \"" + attr.label + "\" value");
        }
        recipe[attr.id].forEach(function (v) {
          if (!findValue(attr, v)) problems.push(name + ": \"" + v + "\" is not a valid \"" + attr.label + "\" value");
        });
      });
      Object.keys(recipe).forEach(function (key) {
        if (key === "name" || key === "zh") return;
        if (!data.attributes.some(function (a) { return a.id === key; })) {
          problems.push(name + ": unknown attribute \"" + key + "\"");
        }
      });
    });
    ["recipe", "details", "search"].forEach(function (section) {
      var map = section === "recipe" ? content.images.recipe : content[section];
      Object.keys(map || {}).forEach(function (name) {
        if (!names[name]) problems.push("content.js " + section + ": \"" + name + "\" is not a recipe in data.js");
      });
    });

    var buttons = [];
    data.attributes.filter(function (a) { return a.onHome; }).forEach(function (attr) {
      attr.values.forEach(function (v) { buttons.push(v[1]); });
    });
    var taskIds = {};
    (data.tasks || []).forEach(function (task, i) {
      var label = "Task " + (task.id != null && task.id !== "" ? task.id : "#" + (i + 1));
      if (task.id == null || task.id === "") problems.push(label + ": has no id");
      else if (taskIds[task.id]) problems.push(label + ": id used more than once");
      taskIds[task.id] = true;
      if (!task.text) problems.push(label + ": has no text");
      var targets = Array.isArray(task.targets) ? task.targets : [];
      if (!targets.length) problems.push(label + ": needs a list of at least one target recipe");
      targets.forEach(function (t) {
        if (!names[t]) problems.push(label + ": target \"" + t + "\" is not a recipe");
      });
      if (task.paths != null) {
        if (!Array.isArray(task.paths)) problems.push(label + ": paths should be a list of lists");
        else task.paths.forEach(function (path, j) {
          var pl = label + " path #" + (j + 1);
          if (!Array.isArray(path) || path.length < 2) { problems.push(pl + ": needs at least two labels"); return; }
          if (buttons.indexOf(path[0]) === -1) problems.push(pl + ": starts with \"" + path[0] + "\", which is not a home-page button");
          if (!names[path[path.length - 1]]) problems.push(pl + ": ends with \"" + path[path.length - 1] + "\", which is not a recipe");
        });
      }
      if (task.predictedFirstClick && buttons.indexOf(task.predictedFirstClick) === -1) {
        problems.push(label + ": predicted first click \"" + task.predictedFirstClick + "\" is not a home-page button");
      }
    });
    return problems;
  }

  function showProblems(problems) {
    if (!problems.length) return;
    var box = el("div", { class: "problems", role: "alert" });
    box.appendChild(el("p", null, "Data problems in data.js / content.js (" + problems.length + "):"));
    var list = el("ul");
    problems.forEach(function (p) { list.appendChild(el("li", null, p)); });
    box.appendChild(list);
    document.getElementById("problems").appendChild(box);
  }

  // ---------- start ----------

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
    var results = window.TreeTest && window.TreeTest.isResultsPage();
    if (results) {
      // Leaving the results page (header links) loads the normal site.
      window.addEventListener("hashchange", function () { window.location.reload(); });
    } else {
      render();
      window.addEventListener("hashchange", render);
    }
    if (window.TreeTest) window.TreeTest.init();
    showProblems(validate());
  });

  window.HuiyiApp = { render: render };
})();
