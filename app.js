// Builds every page from window.SITE_DATA (data.js). Nothing about categories,
// filters, or recipes is hard-coded here.

(function () {
  "use strict";

  var data = window.SITE_DATA || { attributes: [], recipes: [], tasks: [] };

  // ---------- helpers ----------

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
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

  function byName(a, b) { return a.name.localeCompare(b.name); }

  // Placeholder photo (horizontal), then English on one line and Chinese on the next.
  function fillLabel(node, recipe) {
    node.appendChild(el("span", { class: "card-image", "aria-hidden": "true" }));
    node.appendChild(el("span", { class: "en" }, recipe.name));
    node.appendChild(el("span", { class: "zh" }, recipe.zh));
  }

  // ---------- header ----------

  // crumbs: [{ text, href? }]; the last one is the current page.
  function buildHeader(crumbs) {
    document.getElementById("site-name").textContent = data.siteName;
    var nav = document.getElementById("breadcrumb");
    nav.innerHTML = "";
    crumbs.forEach(function (crumb, i) {
      if (i > 0) nav.appendChild(document.createTextNode(" > "));
      if (crumb.href) nav.appendChild(el("a", { href: crumb.href }, crumb.text));
      else nav.appendChild(document.createTextNode(crumb.text));
    });
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
    box.appendChild(el("p", null, "Data problems in data.js (" + problems.length + "):"));
    var list = el("ul");
    problems.forEach(function (p) { list.appendChild(el("li", null, p)); });
    box.appendChild(list);
    var main = document.querySelector("main");
    main.insertBefore(box, main.firstChild);
  }

  // ---------- home page ----------

  function buildHome() {
    buildHeader([{ text: "Home" }]);
    var container = document.getElementById("schemes");
    data.attributes.filter(function (a) { return a.onHome; }).forEach(function (attr) {
      var section = el("section");
      section.appendChild(el("h2", null, attr.label));
      var list = el("ul", { class: "category-buttons" });
      attr.values.forEach(function (value) {
        var li = el("li");
        var href = "category.html?" + encodeURIComponent(attr.id) + "=" + encodeURIComponent(value[0]);
        li.appendChild(el("a", { href: href, class: "button" }, value[1]));
        list.appendChild(li);
      });
      section.appendChild(list);
      container.appendChild(section);
    });
  }

  // ---------- category page ----------

  // Reads ?attributeId=valueId from the URL.
  function currentCategory() {
    var params = new URLSearchParams(window.location.search);
    for (var i = 0; i < data.attributes.length; i++) {
      var attr = data.attributes[i];
      if (attr.onHome && params.has(attr.id)) {
        var value = findValue(attr, params.get(attr.id));
        if (value) return { attr: attr, value: value };
      }
    }
    return null;
  }

  function buildCategory() {
    var main = document.querySelector("main");
    var category = currentCategory();

    if (!category) {
      document.title = "Not found | " + data.siteName;
      buildHeader([{ text: "Home", href: "index.html" }, { text: "Not found" }]);
      main.innerHTML = "";
      main.appendChild(el("h1", null, "Category not found"));
      var p = el("p");
      p.appendChild(document.createTextNode("Go back to "));
      p.appendChild(el("a", { href: "index.html" }, "Home"));
      p.appendChild(document.createTextNode(" and choose a category."));
      main.appendChild(p);
      return;
    }

    var label = category.value[1];
    document.title = label + " | " + data.siteName;
    document.getElementById("page-title").textContent = label;
    buildHeader([
      { text: "Home", href: "index.html" },
      { text: category.attr.label },
      { text: label },
    ]);

    var inCategory = data.recipes.filter(function (r) {
      return valuesOf(r, category.attr).indexOf(category.value[0]) !== -1;
    }).sort(byName);

    // Filters: every filter attribute except the one this page is organized by,
    // and any that can't narrow this page's list.
    var filterAttrs = data.attributes.filter(function (a) {
      if (!a.asFilter || a.id === category.attr.id) return false;
      return a.values.some(function (value) {
        var n = inCategory.filter(function (r) { return valuesOf(r, a).indexOf(value[0]) !== -1; }).length;
        return n > 0 && n < inCategory.length;
      });
    });

    var filterBox = document.querySelector(".filters");
    if (filterAttrs.length === 0) filterBox.hidden = true;

    // Each filter option is a toggle button; black = selected.
    var form = document.getElementById("filters");
    filterAttrs.forEach(function (attr) {
      var group = el("div", { class: "filter-group", role: "group", "aria-label": attr.label });
      group.appendChild(el("span", { class: "filter-name" }, attr.label));
      attr.values.forEach(function (value) {
        var btn = el("button", {
          type: "button", class: "toggle", "aria-pressed": "false",
          "data-attr": attr.id, "data-value": value[0],
          "data-label": attr.label + ": " + value[1],
        });
        btn.appendChild(document.createTextNode(value[1] + " "));
        btn.appendChild(el("span", { class: "count" }));
        group.appendChild(btn);
      });
      form.appendChild(group);
    });
    var clear = el("button", { type: "button", id: "clear-filters" }, "Clear filters");
    form.appendChild(clear);

    var countEl = document.getElementById("result-count");
    var grid = document.getElementById("cards");

    function render() {
      // Within a filter: match any. Across filters: match all.
      var selected = filterAttrs.map(function (attr) {
        var on = form.querySelectorAll("button.toggle[data-attr='" + attr.id + "'][aria-pressed='true']");
        return { attr: attr, ids: Array.prototype.map.call(on, function (b) { return b.getAttribute("data-value"); }) };
      }).filter(function (s) { return s.ids.length > 0; });

      function matches(recipe, s) {
        var vals = valuesOf(recipe, s.attr);
        return s.ids.some(function (id) { return vals.indexOf(id) !== -1; });
      }

      var shown = inCategory.filter(function (r) {
        return selected.every(function (s) { return matches(r, s); });
      });

      // Count beside each option: what would match if it were checked, given the other filters.
      filterAttrs.forEach(function (attr) {
        var others = selected.filter(function (s) { return s.attr !== attr; });
        var pool = inCategory.filter(function (r) {
          return others.every(function (s) { return matches(r, s); });
        });
        attr.values.forEach(function (value) {
          var n = pool.filter(function (r) { return valuesOf(r, attr).indexOf(value[0]) !== -1; }).length;
          form.querySelector("button.toggle[data-attr='" + attr.id + "'][data-value='" + value[0] + "'] .count").textContent = "(" + n + ")";
        });
      });

      // During a tree test, cards are buttons the participant can click.
      var clickable = window.TreeTest && window.TreeTest.cardsClickable();
      grid.innerHTML = "";
      shown.forEach(function (recipe) {
        if (clickable) {
          var slot = el("li", { class: "card-slot" });
          var btn = el("button", { type: "button", class: "card", "data-name": recipe.name });
          fillLabel(btn, recipe);
          slot.appendChild(btn);
          grid.appendChild(slot);
        } else {
          var li = el("li", { class: "card" });
          fillLabel(li, recipe);
          grid.appendChild(li);
        }
      });
      countEl.textContent = "Showing " + shown.length + " of " + inCategory.length +
        (inCategory.length === 1 ? " recipe" : " recipes");
    }

    form.addEventListener("click", function (e) {
      var btn = e.target.closest("button.toggle");
      if (!btn) return;
      btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") === "true" ? "false" : "true");
      render();
    });
    clear.addEventListener("click", function () {
      form.querySelectorAll("button.toggle").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      render();
    });
    render();
  }

  // ---------- start ----------

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    document.title = data.siteName;
    if (page === "home") buildHome();
    if (page === "category") buildCategory();
    if (window.TreeTest) window.TreeTest.init();
    showProblems(validate());
  });
})();
