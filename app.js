// Builds the whole site from window.SITE_DATA (data.js) and window.SITE_CONTENT
// (content.js). Nothing about categories, filters, or recipes is hard-coded here.
//
// One page, many views, picked by the part of the URL after "#":
//   #/                        home (search, region filters, recipe types)
//   #/?q=beef&region=taiwan   home with search results showing
//   #/recipes                 every recipe, with filters
//   #/recipes?kind=noodles    recipes with a filter already on (what the home page links to)
//   #/kind/noodles            old category link; redirects to #/recipes?kind=noodles
//   #/recipe/beef-noodle-soup recipe page (?from=recipes?kind=noodles sets the breadcrumb)
//   #/about, #/contact     (no longer linked from the nav)

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

  // An image in content.js is one of: an Unsplash photo id ("1512058564366-18510be2db19"),
  // a file in this project ("assets/images/lu-rou-fan.jpg") or a full URL, or an object
  // { src, credit, link } for a photo that must be credited.
  function imageSrc(entry) { return entry && typeof entry === "object" ? entry.src : entry; }
  function imageCredit(entry) { return entry && typeof entry === "object" && entry.credit ? entry : null; }

  function photo(src, width) {
    if (/[\/.]/.test(src)) return src; // a project file or a URL: used as written
    return "https://images.unsplash.com/photo-" + src + "?auto=format&fit=crop&w=" + width + "&q=70";
  }

  // A photo with a soft placeholder behind it, which also shows if the photo can't load.
  function thumb(entry, width, alt, className) {
    var box = el("span", { class: "thumb " + (className || "") });
    var src = imageSrc(entry);
    if (src) {
      var img = el("img", { src: photo(src, width), alt: alt || "", loading: "lazy", decoding: "async" });
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

  // The recipes page with one filter already on, e.g. #/recipes?kind=noodles.
  function filteredHash(attrId, valueId) {
    var p = new URLSearchParams();
    p.set(attrId, valueId);
    return hashFor(["recipes"], p);
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
  var headerCleanup = null; // undoes compactHeader() when the view changes

  function render() {
    var route = parseHash();
    var parts = route.parts;
    var path = parts.join("/");
    if (headerCleanup) { headerCleanup(); headerCleanup = null; }
    main.innerHTML = "";

    // A random recipe; replacing the address keeps "back" pointing at the page before.
    if (path === "random") {
      var pick = data.recipes[Math.floor(Math.random() * data.recipes.length)];
      window.location.replace(hashFor(["recipe", slugOf(pick)]));
      return;
    }

    // Old category links (#/kind/noodles) open the recipes page with that filter on.
    if (parts.length === 2 && attrById(parts[0]) && findValue(attrById(parts[0]), parts[1])) {
      window.location.replace(filteredHash(parts[0], parts[1]));
      return;
    }

    if (parts.length === 0) buildHome();
    else if (path === "recipes") buildListing(route.params);
    else if (path === "about") buildAbout();
    else if (path === "contact") buildContact();
    else if (parts[0] === "recipe" && parts.length === 2) buildRecipe(parts[1], route.params);
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

  // A page title: English, then the Chinese in a lighter style.
  function fillTitle(node, en, zh) {
    node.textContent = en;
    if (zh) node.appendChild(el("span", { class: "title-zh", lang: "zh-Hant" }, zh));
  }

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

  // Traditional to Simplified for every character the site's names, labels and recipes
  // use, so either script finds the same recipes. Generated with OpenCC (tw → cn) from the
  // characters in data.js and content.js; regenerate it when recipes add new characters.
  var T2S = {};
  (
   "絲丝紅红燒烧鍋锅雞鸡飯饭餃饺鹹咸滷卤麵面黃黄麗丽餅饼腸肠蘭兰條条蝦虾漿浆馬马來来類类與与湯汤國国灣湾亞亚豬猪鮮鲜純纯鹽盐魯鲁鐘钟許许學学會会醬酱適适顆颗塊块蔥葱綠绿開开讓让濃浓勻匀熱热輕轻還还" +
   "點点濕湿潤润時时邊边壓压變变將将絞绞滿满盤盘約约頭头薑姜歡欢調调處处滾滚撈捞瀝沥乾干轉转鏟铲攪搅後后動动鈴铃這这卻却細细較较澱淀換换沖冲樣样徹彻著着燉炖幾几狀状剝剥殼壳燙烫淨净並并餘余裡里專专" +
   "剛刚蓋盖過过軟软綿绵憊惫緊紧選选擇择間间電电鬆松話话靜静縫缝經经飽饱涼凉鋪铺緣缘捲卷醃腌蠔蚝凍冻撥拨顏颜帶带隻只質质燜焖溫温鎮镇實实備备煙烟響响兩两種种極极內内餡馅張张盡尽擠挤產产對对摺折複复" +
   "個个貼贴裝装進进氣气層层羅罗脫脱續续廚厨紙纸噴喷濺溅遠远製制爾尔彈弹飾饰現现組组擺摆側侧漬渍滲渗當当無无攤摊圓圆翹翘廣广寬宽長长預预鋁铝沒没達达繼继簡简單单錢钱東东議议夾夹廳厅療疗癒愈綜综義义" +
   "臘腊聽听聲声從从驟骤順顺準准屬属撐撑傾倾斬斩檸柠則则葉叶結结參参萊莱搗捣視视補补疊叠週周縱纵檳槟販贩彎弯勁劲訣诀丟丢買买發发濾滤別别藥药紗纱嚐尝應应該该顯显費费離离魚鱼圍围篩筛網网檔档憶忆蘿萝" +
   "蔔卜餛馄飩饨鮑鲍雲云臺台鴨鸭鵝鹅籠笼魷鱿貝贝筍笋麥麦糰团腳脚隨随機机譜谱關关於于們们聯联絡络蕃番哩喱"
  ).match(/../g).forEach(function (pair) { T2S[pair[0]] = pair[1]; });

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
    var aliases = content.searchAliases || {};
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
          if ((aliases[attr.id] || {})[id]) labels.push(aliases[attr.id][id]);
        });
      });
      // Every line of the full recipe's ingredient list, English and Chinese.
      var details = content.details[recipe.name];
      var ingredients = [];
      if (details) details.ingredients.forEach(function (group) {
        group.items.forEach(function (item) { ingredients.push(item[0], item[1]); });
      });
      var entry = { recipe: recipe, names: normalize(names), labels: normalize(labels.join(" ")), ingredients: normalize(ingredients.join(" ")) };
      // Whole Chinese words this recipe is known by (粥, 蛋, 素食): a single character
      // only counts when it is a whole word like these.
      entry.words = (entry.names + " " + entry.labels).split(/\s+/).filter(function (w) { return CJK.test(w); });
      return entry;
    });
  }

  // Chinese is usually typed without spaces: 早餐鸡蛋 is 早餐 + 鸡蛋. Splits a run of
  // Chinese into the longest pieces found in this recipe, left to right. Returns 0 if it
  // can't be covered, 2 if every piece is in the name or a category, 1 if a piece is
  // only in the ingredient list.
  function coverChinese(entry, t) {
    var main = entry.names + " " + entry.labels;
    var level = 2;
    for (var i = 0; i < t.length;) {
      var found = 0;
      for (var j = t.length; j > i; j--) {
        var piece = t.slice(i, j);
        var whole = piece.length > 1 || entry.words.indexOf(piece) !== -1;
        if (!whole) continue;
        if (main.indexOf(piece) !== -1) { found = j; break; }
        if (entry.ingredients.indexOf(piece) !== -1) { found = j; level = 1; break; }
      }
      if (!found) return 0;
      i = found;
    }
    return level;
  }

  // Each word must match somewhere: a name (best), a category, alias or filter label, or a
  // line of the ingredient list (last). Returns [{ recipe, score, byIngredient }], best first;
  // byIngredient is true when some word was only found in the ingredient list.
  function searchScored(query) {
    if (!searchIndex) buildSearchIndex();
    var tokens = normalize(query).split(/\s+/).filter(Boolean).map(function (t) {
      return CJK.test(t) ? t : t.replace(/([a-z])[1-5]/g, "$1"); // "niu2 rou4" works too
    });
    if (!tokens.length) return data.recipes.slice().sort(byName).map(function (r) { return { recipe: r, score: 0, byIngredient: false }; });

    function hit(hay, t) {
      if (hay.indexOf(t) !== -1) return true;
      return t.length > 3 && /s$/.test(t) && hay.indexOf(t.slice(0, -1)) !== -1; // "eggs" → "egg"
    }

    var scored = [];
    searchIndex.forEach(function (entry) {
      var score = 0, byIngredient = false;
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (hit(entry.names, t)) score += 3;
        else if (hit(entry.labels, t)) score += 2;
        else if (hit(entry.ingredients, t)) { score += 1; byIngredient = true; }
        else if (CJK.test(t)) {
          var level = coverChinese(entry, t);
          if (!level) return;
          if (level === 1) byIngredient = true;
          score += level === 2 ? 1.5 : 0.5;
        }
        else return;
      }
      scored.push({ recipe: entry.recipe, score: score, byIngredient: byIngredient });
    });
    scored.sort(function (a, b) {
      return (a.byIngredient - b.byIngredient) || b.score - a.score || byName(a.recipe, b.recipe);
    });
    return scored;
  }

  function search(query) {
    return searchScored(query).map(function (s) { return s.recipe; });
  }

  // ---------- home ----------

  // The home page only leads somewhere: search, a country, or a recipe type all open
  // the recipes page (with that search or filter already applied).
  function buildHome() {
    setPage("home");
    var regionAttr = attrById("region");
    var kindAttr = data.attributes.filter(function (a) { return a.onHome && a.id !== "region"; })[0];

    var hero = el("section", { class: "hero" });
    var card = el("div", { class: "search-card" });
    card.appendChild(el("h1", null, "Find Recipes"));
    card.appendChild(el("p", { class: "search-hint" }, "Search in English, 中文, or pinyin"));
    var form = searchForm("", "home");
    filterSuggestions(form.querySelector("input"));
    card.appendChild(form);
    hero.appendChild(card);

    if (regionAttr) {
      var regions = el("nav", { class: "region-links", "aria-label": "Recipes by region" });
      regionAttr.values.forEach(function (value) {
        var zh = zhOf("region", value[0]);
        var a = el("a", {
          class: "region-link", href: filteredHash(regionAttr.id, value[0]),
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
          class: "category-card", href: filteredHash(kindAttr.id, value[0]),
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

  // Twemoji 🔀, like the flags.
  function shuffleIcon() {
    return el("img", { class: "shuffle-icon", src: "assets/shuffle.svg", alt: "", "aria-hidden": "true", width: "24", height: "24" });
  }

  // A 24×24 stroked icon from SVG path data.
  function lineIcon(className, paths) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) {
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

  // ---------- filter suggestions ----------

  // Filters whose name matches what's typed. Each: { attr, value, rest }, where rest is
  // the query without the words the filter covers ("beef noodles" → Noodles, rest "beef").
  var STOP_WORDS = ["and", "or"];

  function filterMatches(query) {
    var words = String(query || "").split(/\s+/).filter(Boolean);
    var norm = words.map(function (w) { return normalize(w).replace(/\s+/g, ""); });
    if (!norm.join("")) return [];
    var out = [];

    data.attributes.forEach(function (attr) {
      if (attr.tagOnly) return; // labels like Vegetarian are found by search, not offered as filters
      attr.values.forEach(function (value) {
        var zh = zhOf(attr.id, value[0]);
        var enWords = normalize(value[1]).split(/\s+/).filter(function (w) { return w && STOP_WORDS.indexOf(w) === -1; });
        var zhLabel = normalize(zh[0]).replace(/\s+/g, "");
        // Chinese aliases from content.js count as the label too, longest first: 鸡蛋 is Egg.
        var zhNames = [zhLabel].concat(normalize(((content.searchAliases || {})[attr.id] || {})[value[0]] || "")
          .split(/\s+/).filter(function (w) { return CJK.test(w); }))
          .filter(Boolean).sort(function (x, y) { return y.length - x.length; });
        var pinyin = normalize(zh[1]).replace(/\s+/g, "");
        var rest = words.slice();
        var hit = false;

        norm.forEach(function (w, i) {
          if (!w) return;
          if (CJK.test(w)) {
            // 牛肉麵 holds 牛肉 (Beef); 早 starts 早餐 (Breakfast).
            var name = zhNames.filter(function (z) { return w.indexOf(z) !== -1; })[0] || zhLabel;
            var at = name ? w.indexOf(name) : -1;
            if (at !== -1) {
              rest[i] = words[i].slice(0, at) + words[i].slice(at + name.length);
              hit = true;
            } else if (zhLabel && zhLabel.indexOf(w) !== -1) {
              // Part of the label, even one character: 早 or 餐 → 早餐, 饭 → 米飯.
              rest[i] = "";
              hit = true;
            }
            return;
          }
          if (w.length < 2 || STOP_WORDS.indexOf(w) !== -1) return;
          var stem = w.length > 3 ? w.replace(/s$/, "") : w; // "eggs" → "egg"
          if (enWords.some(function (e) { return e.indexOf(stem) === 0; })) {
            rest[i] = "";
            hit = true;
          }
        });

        // Pinyin, spaced or not: "niu rou mian" and "niuroumian" both hold niurou (Beef).
        if (!hit && pinyin.length >= 4) {
          for (var i = 0; i < norm.length && !hit; i++) {
            var run = "";
            for (var j = i; j < norm.length && run.length < pinyin.length; j++) {
              run += norm[j];
              if (run === pinyin) {
                for (var k = i; k <= j; k++) rest[k] = "";
                hit = true;
              }
            }
          }
        }

        if (hit) out.push({ attr: attr, value: value, rest: rest.join(" ").replace(/\s+/g, " ").trim() });
      });
    });
    return out;
  }

  // On the home page: as people type, a dropdown under the search box lists filters that
  // match their words. Picking one opens the recipes page with that filter on (and any
  // other words still searched). The first row searches the typed words as they are, so
  // filters read as a shortcut, not the only way. Enter without a highlighted row searches too.
  var SEARCH_ICON = ["M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14", "M20 20l-4-4"];
  var FILTER_ICON = ["M4 5h16l-6 8v5l-4 2v-7z"];

  function filterSuggestions(input) {
    var field = el("div", { class: "search-field" });
    input.parentNode.insertBefore(field, input);
    field.appendChild(input);
    var list = el("ul", { id: "filter-suggest", class: "filter-suggest", role: "listbox", "aria-label": "Search suggestions" });
    list.hidden = true;
    field.appendChild(list);
    var status = el("p", { class: "visually-hidden", "aria-live": "polite" });
    field.appendChild(status);

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", list.id);
    input.setAttribute("aria-expanded", "false");

    var options = [];
    var active = -1;

    function setActive(i) {
      active = i;
      options.forEach(function (o, j) { o.setAttribute("aria-selected", j === i ? "true" : "false"); });
      if (i === -1) input.removeAttribute("aria-activedescendant");
      else input.setAttribute("aria-activedescendant", options[i].id);
    }

    function close() {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      setActive(-1);
    }

    function update() {
      list.innerHTML = "";
      var found = filterMatches(input.value).map(function (m) {
        var base = m.rest ? search(m.rest) : data.recipes;
        m.count = base.filter(function (r) { return hasValue(r, m.attr, m.value[0]); }).length;
        return m;
      }).filter(function (m) { return m.count > 0; }).slice(0, 6);

      options = [];
      // The plain search row shows whenever something is typed, so a word that matches no
      // filter (garlic, 饭) still shows how many recipes it finds.
      if (input.value.trim()) {
        var query = input.value.trim();
        var qp = new URLSearchParams();
        qp.set("q", query);
        var text = el("span", { class: "suggest-name" });
        text.appendChild(el("span", null, query));
        addOption(hashFor(["recipes"], qp), "search", "Search: " + query, SEARCH_ICON, text,
          "Search all recipes", plural(search(query).length, "recipe"));
      }
      found.forEach(function (m) {
        var p = new URLSearchParams();
        p.set(m.attr.id, m.value[0]);
        if (m.rest) p.set("q", m.rest);
        var name = el("span", { class: "suggest-name" });
        name.appendChild(el("span", null, m.value[1]));
        var zh = zhOf(m.attr.id, m.value[0])[0];
        if (zh) name.appendChild(el("span", { class: "pill-zh", lang: "zh-Hant" }, zh));
        addOption(hashFor(["recipes"], p), "suggested filter", m.attr.label + ": " + m.value[1], FILTER_ICON, name,
          "Filter: " + m.attr.label + (m.rest ? " · “" + m.rest + "”" : ""), plural(m.count, "recipe"));
      });

      setActive(-1);
      list.hidden = options.length === 0;
      input.setAttribute("aria-expanded", options.length ? "true" : "false");
      status.textContent = found.length ? plural(found.length, "filter") + " suggested" : "";
    }

    function addOption(href, logAction, logLabel, iconPaths, name, detail, count) {
      var i = options.length;
      var li = el("li", { role: "presentation" });
      // A link, so the tree test logs it like any other click.
      var a = el("a", {
        id: "filter-suggest-" + i, role: "option", tabindex: "-1", href: href,
        "data-log": logAction, "data-label": logLabel,
      });
      a.appendChild(lineIcon("suggest-icon", iconPaths));
      a.appendChild(name);
      a.appendChild(el("span", { class: "suggest-group" }, detail));
      a.appendChild(el("span", { class: "suggest-count" }, count));
      // Keep focus in the box while the click lands.
      a.addEventListener("mousedown", function (e) { e.preventDefault(); });
      a.addEventListener("mousemove", function () { if (active !== i) setActive(i); });
      li.appendChild(a);
      list.appendChild(li);
      options.push(a);
    }

    input.addEventListener("input", update);
    input.addEventListener("focus", function () { if (input.value.trim()) update(); });
    input.addEventListener("blur", close);
    input.addEventListener("keydown", function (e) {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1 < options.length ? active + 1 : -1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active === -1 ? options.length - 1 : active - 1); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Enter" && active !== -1) { e.preventDefault(); options[active].click(); }
    });
  }

  // ---------- recipes listing ----------

  // Every recipe, with search and filters. Filters can start on from the URL (?kind=noodles).
  function buildListing(params) {
    var recipes = data.recipes.slice().sort(byName);
    var filterAttrs = data.attributes.filter(function (a) { return !a.tagOnly; });
    setPage("recipes", "Recipes");

    // Only show filters that can narrow this list.
    filterAttrs = filterAttrs.filter(function (a) {
      return a.values.some(function (value) {
        var n = recipes.filter(function (r) { return hasValue(r, a, value[0]); }).length;
        return n > 0 && n < recipes.length;
      });
    });

    var crumbs = breadcrumb([{ text: "Home", href: "#/" }, { text: "Recipes" }]);
    main.appendChild(crumbs);
    var head = el("div", { class: "page-head" });
    var h1 = el("h1");
    fillTitle(h1, "Recipes", "全部食譜");
    head.appendChild(h1);
    main.appendChild(head);

    // With exactly one filter on, the page is named for it (like the old category pages):
    // "Noodles 麵食", with Home › Recipes › Noodles. Otherwise it's "Recipes 全部食譜".
    var titleKey = "";
    function retitle(sel) {
      var one = sel.length === 1 && sel[0].ids.length === 1 ? sel[0] : null;
      var key = one ? one.attr.id + ":" + one.ids[0] : "";
      if (key === titleKey) return;
      titleKey = key;
      var en = "Recipes", zh = "全部食譜", trail = [{ text: "Home", href: "#/" }, { text: "Recipes" }];
      if (one) {
        en = findValue(one.attr, one.ids[0])[1];
        zh = zhOf(one.attr.id, one.ids[0])[0];
        trail = [{ text: "Home", href: "#/" }, { text: "Recipes", href: "#/recipes" }, { text: en }];
      }
      setPage("recipes", en);
      fillTitle(h1, en, zh);
      var compact = document.querySelector("#header-context .header-title");
      if (compact) fillTitle(compact, en, zh);
      var next = breadcrumb(trail);
      crumbs.replaceWith(next);
      crumbs = next;
    }

    // The search box narrows the list as you type.
    var query = (params.get("q") || "").trim();
    var form = searchForm(query, "recipes");
    head.appendChild(form);

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
      var scored = query ? searchScored(query).filter(function (s) { return recipes.indexOf(s.recipe) !== -1; }) : [];
      var byIngredient = scored.filter(function (s) { return s.byIngredient; }).map(function (s) { return s.recipe; });
      var base = query ? scored.map(function (s) { return s.recipe; }) : recipes;
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
      // Hidden but still taking its space, so the panel doesn't shift when it appears.
      clear.classList.toggle("is-hidden", sel.length === 0);
      retitle(sel);

      var p = new URLSearchParams();
      if (query) p.set("q", query);
      sel.forEach(function (s) { p.set(s.attr.id, s.ids.join(",")); });
      if (pushUrl) replaceParams(p);
      // Recipe pages link back to this list as it is now (search and filters included).
      var from = hashFor(["recipes"], p).slice(2);

      // Recipes found only through their ingredient list come after the rest, under their own heading.
      var named = shown.filter(function (r) { return byIngredient.indexOf(r) === -1; });
      var used = shown.filter(function (r) { return byIngredient.indexOf(r) !== -1; });
      if (query && named.length && used.length) countEl.textContent = plural(named.length, "recipe") + " matching “" + query + "”, and " + used.length + " more found in their ingredient lists";
      else if (query && used.length) countEl.textContent = plural(used.length, "recipe") + " with “" + query + "” in their ingredient lists";
      else if (query) countEl.textContent = plural(shown.length, "recipe") + " matching “" + query + "”";
      else if (sel.length) countEl.textContent = "Showing " + shown.length + " of " + plural(recipes.length, "recipe");
      else countEl.textContent = plural(recipes.length, "recipe");
      gridHolder.innerHTML = "";
      if (shown.length && query && used.length) {
        if (named.length) gridHolder.appendChild(recipeGrid(named, from));
        var head = el("h2", { class: "results-subhead" });
        head.appendChild(document.createTextNode("Found in the ingredient list "));
        head.appendChild(el("span", { class: "results-subhead-zh", lang: "zh-Hant" }, "食材清單中找到"));
        gridHolder.appendChild(head);
        gridHolder.appendChild(recipeGrid(used, from));
      }
      else if (shown.length) gridHolder.appendChild(recipeGrid(shown, from));
      else gridHolder.appendChild(el("p", { class: "empty" }, query
        ? "No recipes found. Try a dish name, an ingredient, or pinyin (niu rou mian)."
        : "No recipes match these filters."));
    }

    var input = form.querySelector("input");
    var setQuery = function () {
      query = input.value.trim();
      update(true);
      // Searching from the compact header: bring the results back to their top, so the
      // count and first recipes aren't left hidden under the header.
      if (document.body.classList.contains("header-compact")) snapIntoPlace(true);
    };
    input.addEventListener("input", setQuery);
    form.addEventListener("submit", function (e) { e.preventDefault(); setQuery(); });

    // After a filter change, scroll so the filters sit just under the compact header and
    // the results start from the top. Only where the filters stay beside the results,
    // unless anyWidth (searching). 72px matches .header-compact .filters { top } in style.css.
    function snapIntoPlace(anyWidth) {
      if (!anyWidth && !window.matchMedia("(min-width: 961px)").matches) return;
      var target = layout.getBoundingClientRect().top + window.scrollY - 72;
      if (Math.abs(window.scrollY - target) > 1) window.scrollTo({ top: target });
    }

    aside.addEventListener("click", function (e) {
      var btn = e.target.closest("button.toggle");
      if (!btn) return;
      btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") === "true" ? "false" : "true");
      update(true);
      snapIntoPlace();
    });
    clear.addEventListener("click", function () {
      aside.querySelectorAll("button.toggle").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      update(true);
      snapIntoPlace();
    });
    update(false);
    var zhNow = h1.querySelector(".title-zh");
    compactHeader(head, form, h1.firstChild.textContent, zhNow ? zhNow.textContent : "");
  }

  // Once the page heading (trigger) scrolls under the header, the header shrinks, shows the
  // page title, and takes over one control (moving: the recipes search box, or a recipe's
  // language toggle), leaving more of the screen for the page.
  // Wide screens only; on phones the header doesn't stay on screen.
  function compactHeader(trigger, moving, en, zh) {
    var header = document.querySelector(".site-header");
    var slot = document.getElementById("header-context");
    var label = el("p", { class: "header-title" });
    fillTitle(label, en, zh);
    slot.appendChild(label);
    var home = moving.parentNode;
    var after = moving.nextSibling;
    var wide = window.matchMedia("(min-width: 721px)");
    // Measured before shrinking, so the switch point doesn't move as the header changes size.
    var fullHeight = header.offsetHeight;
    var on = false;

    function set(compact) {
      if (compact === on) return;
      on = compact;
      var focused = moving.contains(document.activeElement) ? document.activeElement : null;
      if (compact) {
        home.style.minHeight = home.offsetHeight + "px"; // keep the page from jumping
        slot.appendChild(moving);
      } else {
        home.insertBefore(moving, after);
        home.style.minHeight = "";
      }
      if (focused) focused.focus({ preventScroll: true });
      document.body.classList.toggle("header-compact", compact);
    }

    function check() {
      set(wide.matches && trigger.getBoundingClientRect().bottom < fullHeight);
    }

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    headerCleanup = function () {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      set(false);
      slot.innerHTML = "";
    };
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

    // Breadcrumb: back to the recipes list the reader came from (with its filters),
    // or, opened directly, the recipes list filtered to this recipe's first kind of dish.
    var from = params.get("from") || "";
    var recipesHref = "#/recipes";
    if (/^recipes(\?|$)/.test(from)) recipesHref = "#/" + from;
    else if (kindAttr && valuesOf(recipe, kindAttr).length) recipesHref = filteredHash(kindAttr.id, valuesOf(recipe, kindAttr)[0]);
    var crumbs = [{ text: "Home", href: "#/" }, { text: "Recipes", href: recipesHref }, { text: recipe.name }];

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
    var credit = imageCredit(content.images.recipe[recipe.name]);
    if (credit) hero.appendChild(creditLine("figcaption", credit));
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
    // Diet: the most specific one (a vegan recipe is also tagged vegetarian).
    var dietAttr = attrById("diet");
    var diets = dietAttr ? valuesOf(recipe, dietAttr) : [];
    if (diets.length) {
      var diet = diets[diets.length - 1];
      badge("🌱", findValue(dietAttr, diet)[1], zhOf("diet", diet)[0]);
    }
    article.appendChild(badges);

    // Ingredients and steps, as English/Chinese pairs.
    var body = el("div", { class: "bilingual" });
    if (details) {
      pair(body, "h2", { class: "section-title" }, "Ingredients", "材料");
      details.ingredients.forEach(function (group) {
        pair(body, "h3", { class: "ing-group" }, group.group[0], group.group[1]);
        group.items.forEach(function (item) {
          pair(body, "p", { class: "ingredient" }, item[0], item[1]);
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
    // Labels that aren't filters (Vegetarian) link to a search for that word.
    data.attributes.filter(function (a) { return a.onHome || a.tagOnly; }).forEach(function (attr) {
      valuesOf(recipe, attr).forEach(function (id) {
        var v = findValue(attr, id);
        var href = attr.tagOnly ? hashFor(["recipes"], new URLSearchParams([["q", v[1]]])) : filteredHash(attr.id, id);
        var a = el("a", { class: "pill", href: href, "data-log": "link", "data-label": v[1] });
        a.appendChild(el("span", null, v[1]));
        var zh = zhOf(attr.id, id)[0];
        if (zh) a.appendChild(el("span", { class: "pill-zh", lang: "zh-Hant" }, zh));
        tags.appendChild(a);
      });
    });
    article.appendChild(tags);
    main.appendChild(article);

    compactHeader(h1, toggle, recipe.name, recipe.zh);

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

  // "Photo: <credit>", linked to its source when there is one.
  function creditLine(tag, credit) {
    var node = el(tag, { class: "photo-credit" });
    if (credit.link) node.appendChild(el("a", { href: credit.link, target: "_blank", rel: "noopener" }, credit.credit));
    else node.appendChild(document.createTextNode(credit.credit));
    return node;
  }

  function buildAbout() {
    var section = prose("about", "About", "關於我們", [
      "回憶 (huí yì) means “memories.” Huiyi Kitchen collects the home-style dishes people remember from China, Taiwan, Hong Kong, Singapore and Malaysia: the breakfast from a corner stall, the soup a grandparent made, the dish you ordered every week abroad.",
      "Every recipe is written in both English and Traditional Chinese, so you can cook it yourself or share it with family in the language they read best.",
    ]);

    // Every photo that needs a credit, by what it shows.
    var credits = [];
    var kindAttr = attrById("kind");
    Object.keys(content.images.category || {}).forEach(function (id) {
      var c = imageCredit(content.images.category[id]);
      var v = kindAttr && findValue(kindAttr, id);
      if (c) credits.push({ name: (v ? v[1] : id) + " (recipe type)", credit: c });
    });
    Object.keys(content.images.recipe || {}).forEach(function (name) {
      var c = imageCredit(content.images.recipe[name]);
      if (c) credits.push({ name: name, credit: c });
    });
    if (!credits.length) return;
    section.appendChild(el("h2", { class: "credits-title" }, "Photo credits"));
    var ul = el("ul", { class: "credits" });
    credits.forEach(function (item) {
      var li = el("li");
      li.appendChild(el("span", null, item.name + ": "));
      li.appendChild(creditLine("span", item.credit));
      ul.appendChild(li);
    });
    section.appendChild(ul);
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
    ["category", "recipe"].forEach(function (group) {
      var map = content.images[group] || {};
      Object.keys(map).forEach(function (key) {
        var entry = map[key];
        if (entry && typeof entry === "object" && (!entry.src || !entry.credit)) {
          problems.push("content.js images." + group + ": \"" + key + "\" needs both src and credit");
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
