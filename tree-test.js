// Test harness for two studies: a tree test and a talk-aloud test.
//   index.html?test     starts a session: moderator picks the test and enters the participant's
//                       name, then tasks run one at a time in a random order for each participant
//                       (?test=tree or ?test=talk skips the picker)
//   index.html?results  the moderator's results page: a switch between the two tests,
//                       sessions, CSV/JSON download, clear
// Tree test: the participant selects a recipe card and submits it.
// Talk-aloud: the site works normally; the participant clicks "I'm done" and the harness
// records and scores where they ended up. The moderator can mark each task on the results page.
// Every click during a task is logged. Results are kept in this browser's localStorage
// (they survive reloads and restarts). A session belongs to the tab it was started in
// (sessionStorage); other tabs show the normal site. app.js calls TreeTest.init().

(function () {
  "use strict";

  var data = window.SITE_DATA || { recipes: [], tasks: [], talkAloudTasks: [] };
  var STUDIES = {
    tree: { name: "Tree test", tasks: data.tasks || [] },
    talk: { name: "Talk-aloud test", tasks: data.talkAloudTasks || [] },
  };
  var KEY = "recipeTreeTest.v1";
  var TAB_KEY = "recipeTreeTest.tab";
  var RESULTS_KEY = "recipeTreeTest.resultsStudy";
  var LANG_KEY = "huiyi.lang"; // the recipe language setting in app.js
  var params = new URLSearchParams(window.location.search);
  var mode = params.has("results") ? "results" : "site";
  var session = null;
  var storageOk = true;

  // ---------- helpers ----------

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function formatDateTime(ms) {
    var d = new Date(ms);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function secs(ms) { return Math.round(ms / 100) / 10; }
  function clean(text) { return String(text).replace(/\s+/g, " ").trim(); }

  // Sessions saved before the talk-aloud test existed are tree tests.
  function studyOf(s) { return s && s.study === "talk" ? "talk" : "tree"; }
  function isTalk() { return studyOf(session) === "talk"; }

  function taskById(id) {
    var tasks = STUDIES[studyOf(session)].tasks;
    for (var i = 0; i < tasks.length; i++) if (String(tasks[i].id) === String(id)) return tasks[i];
    return null;
  }

  function slugOf(recipe) {
    return recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // ---------- storage ----------

  function loadState() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && Array.isArray(s.sessions)) return s;
      }
    } catch (e) { storageOk = false; }
    return { nextId: 1, sessions: [] };
  }

  function saveState(state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; }
  }

  function saveSession() {
    var state = loadState();
    var found = false;
    state.sessions = state.sessions.map(function (s) {
      if (s.id === session.id) { found = true; return session; }
      return s;
    });
    if (!found) state.sessions.push(session);
    state.nextId = Math.max(state.nextId, parseInt(session.id.slice(1), 10) + 1);
    saveState(state);
  }

  function tabSessionId() {
    try { return window.sessionStorage.getItem(TAB_KEY); } catch (e) { return null; }
  }
  function setTabSession(id) {
    try {
      if (id) window.sessionStorage.setItem(TAB_KEY, id);
      else window.sessionStorage.removeItem(TAB_KEY);
    } catch (e) { /* ignore */ }
  }

  function findActiveSession() {
    var id = tabSessionId();
    if (!id) return null;
    var state = loadState();
    for (var i = 0; i < state.sessions.length; i++) {
      if (state.sessions[i].id === id && state.sessions[i].status === "in progress") return state.sessions[i];
    }
    return null;
  }

  function setLang(lang) {
    try {
      if (lang) window.localStorage.setItem(LANG_KEY, lang);
      else window.localStorage.removeItem(LANG_KEY);
    } catch (e) { /* ignore */ }
  }
  function currentLang() {
    var saved = null;
    try { saved = window.localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    return saved === "en" || saved === "zh" || saved === "both" ? saved : "both";
  }

  // ---------- dialogs ----------

  function openDialog(build) {
    var old = document.getElementById("tt-dialog");
    if (old) old.remove();
    var dlg = el("dialog", { class: "tt-modal", id: "tt-dialog" });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); });
    build(dlg);
    document.body.appendChild(dlg);
    dlg.showModal();
    return dlg;
  }

  // An X in the corner that closes the screen and brings back the "Run test" button.
  function addCloseButton(dlg) {
    var x = el("button", { type: "button", class: "tt-close", id: "tt-close", "aria-label": "Close" }, "X");
    x.addEventListener("click", function () {
      closeDialog();
      showRunButton();
    });
    dlg.appendChild(x);
  }

  function closeDialog() {
    var dlg = document.getElementById("tt-dialog");
    if (dlg) dlg.remove();
  }

  // ---------- session flow ----------

  // Button in the corner of the regular site that opens the test picker.
  function showRunButton() {
    if (document.getElementById("tt-run")) return;
    var btn = el("button", { type: "button", id: "tt-run", class: "tt-run" }, "Run test");
    btn.addEventListener("click", function () {
      btn.remove();
      showPicker();
    });
    document.body.appendChild(btn);
  }

  function showPicker() {
    openDialog(function (dlg) {
      addCloseButton(dlg);
      dlg.appendChild(el("h2", null, "Which test?"));
      dlg.appendChild(el("p", null, "Moderator: choose the study to run."));
      var row = el("div", { class: "tt-choices" });
      Object.keys(STUDIES).forEach(function (id) {
        var b = el("button", { type: "button", id: "tt-pick-" + id, class: "tt-choice" }, STUDIES[id].name);
        b.appendChild(el("span", null, STUDIES[id].tasks.length + " tasks"));
        b.addEventListener("click", function () { showStart(id); });
        row.appendChild(b);
      });
      dlg.appendChild(row);
    });
  }

  function showStart(study) {
    var tasks = STUDIES[study].tasks;
    if (!tasks.length) {
      openDialog(function (dlg) {
        addCloseButton(dlg);
        dlg.appendChild(el("h2", null, "No tasks yet"));
        dlg.appendChild(el("p", null, "Add tasks to data.js (see the comment at the top), then reload."));
      });
      return;
    }
    openDialog(function (dlg) {
      addCloseButton(dlg);
      dlg.appendChild(el("h2", null, "Before you start"));
      if (study === "talk") {
        dlg.appendChild(el("p", null, "You'll be given " + tasks.length + " tasks on this website, one at a time."));
        dlg.appendChild(el("p", null, "Use the site the way you normally would, and please think out loud as you go: what you're looking for, what you expect to happen, and anything that surprises or confuses you."));
        dlg.appendChild(el("p", null, "When you think you've finished a task, click \"I'm done\" at the bottom of the screen. If you get stuck, click \"I give up\". That helps us too."));
      } else {
        dlg.appendChild(el("p", null, "You'll be asked to find " + tasks.length + " recipes on this website, one at a time."));
        dlg.appendChild(el("p", null, "Click around the way you normally would. When you find the recipe, click its card, and press submit."));
        dlg.appendChild(el("p", null, "If you can't find it, click \"I give up\" at the bottom of the screen. That helps us too."));
      }
      dlg.appendChild(el("p", null, "We're testing the website, not you."));
      var label = el("label", { for: "tt-name" }, "Moderator: participant name");
      var input = el("input", { type: "text", id: "tt-name", autocomplete: "off" });
      var start = el("button", { type: "button" }, "Start");
      function go() {
        var name = clean(input.value);
        if (!name) { input.focus(); return; }
        startSession(study, name);
      }
      start.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      dlg.appendChild(label);
      dlg.appendChild(input);
      dlg.appendChild(start);
    });
  }

  function startSession(study, name) {
    var state = loadState();
    session = {
      id: "P" + state.nextId,
      study: study,
      name: name,
      started: Date.now(),
      status: "in progress",
      order: shuffle(STUDIES[study].tasks.map(function (t) { return String(t.id); })),
      pos: 0,
      current: null,
      awaitingStart: false,
      done: [],
    };
    saveSession();
    setTabSession(session.id);
    closeDialog();
    startTask();
  }

  // Gets the home page ready for the current task, then shows the task popup.
  // The task clock starts only after the participant confirms (beginTask).
  function startTask() {
    session.current = null;
    session.awaitingStart = true;
    saveSession();
    // Talk-aloud tasks start with recipes in English, so finding the language switch is part of the task.
    if (isTalk()) setLang("en");
    // Each task starts from a fresh home page (no search, filters, or other view).
    var hash = window.location.hash;
    if (!window.location.search && (!hash || hash === "#" || hash === "#/")) {
      showIntro();
    } else {
      window.location.replace(window.location.pathname);
    }
  }

  function showIntro() {
    var task = taskById(session.order[session.pos]);
    openDialog(function (dlg) {
      dlg.appendChild(el("h2", null, "Task " + (session.pos + 1) + " of " + session.order.length));
      dlg.appendChild(el("p", null, task.text));
      var go = el("button", { type: "button", id: "tt-begin" }, "Start task");
      go.addEventListener("click", beginTask);
      dlg.appendChild(go);
    });
  }

  function beginTask() {
    session.current = { start: Date.now(), events: [], selected: null, selectedPage: "" };
    session.awaitingStart = false;
    saveSession();
    renderBar();
  }

  function renderBar() {
    closeDialog();
    var old = document.getElementById("tt-bar");
    if (old) old.remove();
    var task = taskById(session.order[session.pos]);
    document.body.classList.add("tt-active");
    var bar = el("div", { class: "tt-bar", id: "tt-bar" });
    bar.appendChild(el("p", { class: "tt-task" }, "Task " + (session.pos + 1) + " of " + session.order.length + ": " + task.text));
    if (isTalk()) {
      var done = el("button", { type: "button", id: "tt-done", class: "tt-submit" }, "I'm done");
      done.addEventListener("click", function () { finishTask("done"); });
      bar.appendChild(done);
    } else {
      var submit = el("button", { type: "button", id: "tt-submit", class: "tt-submit" }, "Submit and continue");
      submit.hidden = !session.current.selected;
      submit.addEventListener("click", function () { finishTask(session.current.selected); });
      bar.appendChild(submit);
    }
    var giveUp = el("button", { type: "button", id: "tt-give-up" }, "I give up");
    giveUp.addEventListener("click", function () { finishTask(null); });
    var end = el("button", { type: "button", id: "tt-end" }, "End session");
    end.addEventListener("click", function () {
      if (window.confirm("End this session early? Results so far are kept.")) endSession("ended early");
    });
    bar.appendChild(giveUp);
    bar.appendChild(end);
    document.body.appendChild(bar);
  }

  function removeBar() {
    var bar = document.getElementById("tt-bar");
    if (bar) bar.remove();
    document.body.classList.remove("tt-active");
  }

  // Where a talk-aloud participant ended up: the view, its recipe (on a recipe page),
  // the language setting, and the recipe cards on screen.
  function endState() {
    var page = pageName();
    var m = /^#\/recipe\/([^?]+)/.exec(page);
    var recipe = "";
    if (m) {
      var slug = decodeURIComponent(m[1]);
      data.recipes.forEach(function (r) { if (slugOf(r) === slug) recipe = r.name; });
    }
    var showing = [];
    document.querySelectorAll("main .recipe-card").forEach(function (c) {
      var name = c.getAttribute("data-label") || c.getAttribute("data-name");
      if (name && showing.indexOf(name) === -1) showing.push(name);
    });
    return { page: page, recipe: recipe, lang: currentLang(), showing: showing };
  }

  // Returns { outcome, note } for a talk-aloud task from where the participant ended up.
  function score(task, end) {
    var s = task.score;
    if (!s) return { outcome: "not scored", note: end.recipe ? "Ended on " + end.recipe : "Ended on " + end.page };
    if (s.recipe) {
      if (!end.recipe) return { outcome: "fail", note: "Not on a recipe page (" + end.page + ")" };
      if (s.recipe.indexOf(end.recipe) === -1) return { outcome: "fail", note: "Wrong recipe: " + end.recipe };
      if (s.lang && end.lang !== s.lang) return { outcome: "fail", note: "Right recipe, but language was " + end.lang };
      return { outcome: "success", note: end.recipe + (s.lang ? " in " + end.lang : "") };
    }
    if (s.showing) {
      var attr = s.showing[0], value = s.showing[1];
      var want = data.recipes.filter(function (r) { return (r[attr] || []).indexOf(value) !== -1; }).map(function (r) { return r.name; });
      var hits = want.filter(function (n) { return end.showing.indexOf(n) !== -1; }).length;
      var extra = end.showing.length - hits;
      var note = "Showing " + end.showing.length + " recipes: " + hits + " of " + want.length + " " + value + (extra ? ", " + extra + " others" : "");
      return { outcome: hits === want.length && extra === 0 ? "success" : "fail", note: note };
    }
    return { outcome: "not scored", note: "" };
  }

  // Tree test: selected is the recipe name, or null if the participant gave up.
  // Talk-aloud: "done", or null if the participant gave up.
  function finishTask(selected) {
    var task = taskById(session.order[session.pos]);
    var cur = session.current;
    var first = cur.events.length ? cur.events[0].label : "";
    var result = {
      taskId: String(task.id),
      position: session.pos + 1,
      text: task.text,
      seconds: secs(Date.now() - cur.start),
      firstClick: first,
      events: cur.events,
    };
    if (isTalk()) {
      var end = endState();
      var scored = selected == null ? { outcome: "gave up", note: "" } : score(task, end);
      result.outcome = scored.outcome;
      result.scoreNote = scored.note;
      result.endPage = end.page;
      result.endRecipe = end.recipe;
      result.endLang = end.lang;
      result.endShowing = end.showing;
      result.moderatorOutcome = "";
      result.moderatorNotes = "";
    } else {
      var targets = task.targets || [];
      result.targets = targets;
      result.predictedFirstClick = task.predictedFirstClick || "";
      result.paths = task.paths || [];
      result.outcome = selected == null ? "gave up" : (targets.indexOf(selected) !== -1 ? "found" : "wrong recipe");
      result.selected = selected || "";
    }
    session.done.push(result);
    session.current = null;
    session.pos++;
    if (session.pos >= session.order.length) {
      endSession("complete");
    } else {
      saveSession();
      startTask();
    }
  }

  function endSession(status) {
    var talk = isTalk();
    session.status = status;
    session.current = null;
    saveSession();
    setTabSession(null);
    removeBar();
    // Back to the site's default recipe language for whoever uses the browser next.
    if (talk) setLang(null);
    openDialog(function (dlg) {
      dlg.appendChild(el("h2", null, status === "complete" ? "Thank you" : "Session ended"));
      dlg.appendChild(el("p", null, "This session is finished. Please let the moderator know."));
      var again = el("button", { type: "button", id: "tt-new-participant" }, "Start next participant");
      again.addEventListener("click", function () { showStart(talk ? "talk" : "tree"); });
      dlg.appendChild(again);
    });
    session = null;
  }

  // ---------- click logging ----------

  // The view, e.g. "#/kind/noodles?ingredient=beef" (the site is one page; views live after the #).
  function pageName() {
    return window.location.hash || "#/";
  }

  // The view without its search or filter settings. A selection only counts on the view it was made on.
  function viewName() {
    return pageName().split("?")[0];
  }

  function describe(node) {
    if (node.matches("button.card")) return { action: "card", label: node.getAttribute("data-name") };
    // app.js marks what to log: data-log is the action, data-label the label.
    if (node.hasAttribute("data-log")) {
      var action = node.getAttribute("data-log");
      if (action === "toggle") action = node.getAttribute("aria-pressed") === "true" ? "filter off" : "filter on";
      return { action: action, label: node.getAttribute("data-label") || clean(node.textContent) };
    }
    if (node.id === "clear-filters") return { action: "clear filters", label: "Clear filters" };
    if (node.matches("button.toggle")) {
      // This runs before the page toggles the button, so aria-pressed is still the old state.
      return { action: node.getAttribute("aria-pressed") === "true" ? "filter off" : "filter on", label: node.getAttribute("data-label") };
    }
    if (node.matches("a")) return { action: "link", label: clean(node.textContent) };
    return null;
  }

  // Shows which card is selected and whether the submit button is available.
  function refreshSelection() {
    var chosen = session && session.current ? session.current.selected : null;
    document.querySelectorAll("button.card").forEach(function (b) {
      var on = b.getAttribute("data-name") === chosen;
      b.classList.toggle("selected", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var submit = document.getElementById("tt-submit");
    if (submit) submit.hidden = !chosen;
  }

  function onClick(e) {
    if (!session || !session.current) return;
    var node = e.target.closest("a, button, input");
    if (!node || node.closest("#tt-bar") || node.closest("dialog")) return;
    var info = describe(node);
    if (!info) return;
    // Clicking the selected card again is logged as a deselect.
    var recipe = info.action === "card" ? info.label : null;
    if (recipe && session.current.selected === recipe) info = { action: "deselect", label: "Deselect " + recipe };
    var now = Date.now();
    var ev = session.current.events;
    ev.push({
      n: ev.length + 1,
      action: info.action,
      label: info.label,
      page: pageName(),
      sinceStart: secs(now - session.current.start),
      sincePrev: secs(now - (ev.length ? ev[ev.length - 1].at : session.current.start)),
      at: now,
    });
    saveSession();
    if (recipe) {
      e.preventDefault();
      var cur = session.current;
      cur.selected = info.action === "deselect" ? null : recipe;
      cur.selectedPage = viewName();
      saveSession();
      refreshSelection();
    }
  }

  // ---------- results (moderator) ----------

  var CLICK_COLUMNS = ["click_number", "action", "label", "page", "seconds_since_task_start", "seconds_since_previous"];
  var COLUMNS = {
    tree: [
      "participant", "name", "session_start", "session_status",
      "task_position", "task_id", "task_text", "targets", "outcome", "selected",
      "task_seconds", "task_clicks", "expected_paths", "predicted_first_click", "first_click", "first_click_matches_prediction",
    ].concat(CLICK_COLUMNS),
    talk: [
      "participant", "name", "session_start", "session_status",
      "task_position", "task_id", "task_text", "auto_outcome", "auto_note", "moderator_outcome", "moderator_notes",
      "task_seconds", "task_clicks", "first_click", "end_page", "end_recipe", "end_language", "end_showing",
    ].concat(CLICK_COLUMNS),
  };

  function sessionsFor(study) {
    return loadState().sessions.filter(function (s) { return studyOf(s) === study; });
  }

  function taskRow(study, s, t) {
    var row = {
      participant: s.id, name: s.name, session_start: formatDateTime(s.started), session_status: s.status,
      task_position: t.position, task_id: t.taskId, task_text: t.text,
      task_seconds: t.seconds, task_clicks: t.events.length, first_click: t.firstClick,
    };
    if (study === "talk") {
      row.auto_outcome = t.outcome; row.auto_note = t.scoreNote || "";
      row.moderator_outcome = t.moderatorOutcome || ""; row.moderator_notes = t.moderatorNotes || "";
      row.end_page = t.endPage || ""; row.end_recipe = t.endRecipe || ""; row.end_language = t.endLang || "";
      row.end_showing = (t.endShowing || []).join(" | ");
    } else {
      row.targets = (t.targets || []).join(" | "); row.outcome = t.outcome; row.selected = t.selected;
      row.expected_paths = (t.paths || []).map(function (p) { return p.join(" > "); }).join(" | ");
      row.predicted_first_click = t.predictedFirstClick;
      row.first_click_matches_prediction = t.predictedFirstClick ? (t.firstClick === t.predictedFirstClick ? "yes" : "no") : "";
    }
    return row;
  }

  function rows(study) {
    var out = [];
    sessionsFor(study).forEach(function (s) {
      s.done.forEach(function (t) {
        var base = taskRow(study, s, t);
        if (!t.events.length) out.push(base);
        t.events.forEach(function (ev) {
          var row = {};
          Object.keys(base).forEach(function (k) { row[k] = base[k]; });
          row.click_number = ev.n; row.action = ev.action; row.label = ev.label; row.page = ev.page;
          row.seconds_since_task_start = ev.sinceStart; row.seconds_since_previous = ev.sincePrev;
          out.push(row);
        });
      });
    });
    return out;
  }

  function csvCell(v) {
    var s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function download(filename, type, text) {
    var url = URL.createObjectURL(new Blob([text], { type: type }));
    var link = el("a", { href: url, download: filename });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function resultsStudy() {
    var saved = null;
    try { saved = window.sessionStorage.getItem(RESULTS_KEY); } catch (e) { /* ignore */ }
    return saved === "talk" ? "talk" : "tree";
  }

  // Saves a moderator's mark or note on one talk-aloud task straight into storage.
  function saveMark(sessionId, taskIndex, field, value) {
    var state = loadState();
    state.sessions.forEach(function (s) {
      if (s.id === sessionId && s.done[taskIndex]) s.done[taskIndex][field] = value;
    });
    saveState(state);
  }

  function markSelect(s, i) {
    var sel = el("select", { "aria-label": "Moderator mark for " + s.name + ", task " + s.done[i].position });
    [["", "—"], ["success", "Success"], ["partial", "Partial"], ["fail", "Fail"]].forEach(function (o) {
      var opt = el("option", { value: o[0] }, o[1]);
      if ((s.done[i].moderatorOutcome || "") === o[0]) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", function () {
      s.done[i].moderatorOutcome = sel.value;
      saveMark(s.id, i, "moderatorOutcome", sel.value);
    });
    return sel;
  }

  function notesInput(s, i) {
    var input = el("input", { type: "text", class: "tt-notes", "aria-label": "Moderator notes for " + s.name + ", task " + s.done[i].position });
    input.value = s.done[i].moderatorNotes || "";
    input.addEventListener("change", function () {
      s.done[i].moderatorNotes = input.value;
      saveMark(s.id, i, "moderatorNotes", input.value);
    });
    return input;
  }

  // One task attempt as a table row. Cells are text, or an element (the moderator's controls).
  function attemptCells(study, s, i, withName) {
    var d = s.done[i];
    var path = d.events.map(function (ev) { return ev.label; }).join(" > ");
    var cells = [d.position];
    if (withName) cells.push(s.name);
    cells.push(d.text);
    if (study === "talk") {
      var end = d.endRecipe || d.endPage || "";
      if (d.endLang) end += " (" + d.endLang + ")";
      cells = cells.concat([d.outcome, d.scoreNote || "", markSelect(s, i), notesInput(s, i), d.seconds, d.events.length, d.firstClick, end, path]);
    } else {
      cells = cells.concat([d.outcome, d.selected, d.seconds, d.events.length, d.firstClick, path]);
    }
    return cells;
  }

  function attemptHeaders(study, withName) {
    var h = ["#"];
    if (withName) h.push("Participant");
    h.push("Task");
    return h.concat(study === "talk"
      ? ["Auto outcome", "Why", "Moderator mark", "Notes", "Seconds", "Clicks", "First click", "Ended on", "Path"]
      : ["Outcome", "Selected", "Seconds", "Clicks", "First click", "Path"]);
  }

  function attemptTable(study, list, withName) {
    var t = el("table", { class: "tt-table" });
    var h = el("tr");
    attemptHeaders(study, withName).forEach(function (c) { h.appendChild(el("th", null, c)); });
    t.appendChild(h);
    list.forEach(function (a) {
      var tr = el("tr");
      attemptCells(study, a.s, a.i, withName).forEach(function (v) {
        var td = el("td");
        if (v instanceof Node) td.appendChild(v); else td.textContent = v == null ? "" : v;
        tr.appendChild(td);
      });
      t.appendChild(tr);
    });
    return t;
  }

  function buildResults() {
    var study = resultsStudy();
    document.title = "Test results | " + data.siteName;
    document.body.setAttribute("data-page", "results");
    var main = document.querySelector("main");
    main.innerHTML = "";
    main.className = "tt-results";
    main.appendChild(el("h1", null, "Test results"));

    // The switch between the two studies' results.
    var tabs = el("div", { class: "tt-switch", role: "group", "aria-label": "Which test" });
    Object.keys(STUDIES).forEach(function (id) {
      var b = el("button", { type: "button", id: "tt-show-" + id, "aria-pressed": id === study ? "true" : "false" }, STUDIES[id].name);
      b.addEventListener("click", function () {
        try { window.sessionStorage.setItem(RESULTS_KEY, id); } catch (e) { /* ignore */ }
        buildResults();
      });
      tabs.appendChild(b);
    });
    main.appendChild(tabs);

    var sessions = sessionsFor(study);
    if (!storageOk) main.appendChild(el("p", { class: "problems", role: "alert" }, "This browser isn't letting the page save results."));

    var file = study === "talk" ? "talk-aloud-results" : "tree-test-results";
    var actions = el("div", { class: "tt-actions" });
    var csv = el("button", { type: "button", id: "tt-csv" }, "Download CSV");
    csv.addEventListener("click", function () {
      var cols = COLUMNS[study];
      var lines = [cols.join(",")];
      rows(study).forEach(function (r) { lines.push(cols.map(function (c) { return csvCell(r[c]); }).join(",")); });
      download(file + ".csv", "text/csv", lines.join("\n") + "\n");
    });
    var json = el("button", { type: "button", id: "tt-json" }, "Download JSON");
    json.addEventListener("click", function () {
      download(file + ".json", "application/json", JSON.stringify(sessionsFor(study), null, 2));
    });
    var clear = el("button", { type: "button", id: "tt-clear" }, "Clear " + STUDIES[study].name.toLowerCase() + " results");
    var confirmBox = el("span");
    clear.addEventListener("click", function () {
      confirmBox.innerHTML = "";
      confirmBox.appendChild(document.createTextNode("Delete all saved " + STUDIES[study].name.toLowerCase() + " sessions? "));
      var yes = el("button", { type: "button" }, "Yes, delete");
      var no = el("button", { type: "button" }, "Cancel");
      yes.addEventListener("click", function () {
        var state = loadState();
        state.sessions = state.sessions.filter(function (s) { return studyOf(s) !== study; });
        saveState(state);
        setTabSession(null);
        buildResults();
      });
      no.addEventListener("click", function () { confirmBox.innerHTML = ""; });
      confirmBox.appendChild(yes);
      confirmBox.appendChild(document.createTextNode(" "));
      confirmBox.appendChild(no);
    });
    actions.appendChild(csv); actions.appendChild(json); actions.appendChild(clear); actions.appendChild(confirmBox);
    main.appendChild(actions);

    if (!sessions.length) { main.appendChild(el("p", null, "No " + STUDIES[study].name.toLowerCase() + " sessions saved yet.")); return; }

    var goodOutcome = study === "talk" ? "success" : "found";
    var table = el("table", { class: "tt-table" });
    var head = el("tr");
    ["Participant", "Name", "Started", "Status", "Tasks done", study === "talk" ? "Auto success" : "Found"].forEach(function (h) { head.appendChild(el("th", null, h)); });
    table.appendChild(head);
    sessions.forEach(function (s) {
      var tr = el("tr");
      var good = s.done.filter(function (t) { return t.outcome === goodOutcome; }).length;
      [s.id, s.name, formatDateTime(s.started), s.status, s.done.length + " of " + s.order.length, good].forEach(function (v) {
        tr.appendChild(el("td", null, v));
      });
      table.appendChild(tr);
    });
    main.appendChild(table);

    // By task: every participant's attempt at the same task, so patterns are easy to compare.
    var attempts = [];
    var taskText = {};
    sessions.forEach(function (s) {
      s.done.forEach(function (d, i) {
        attempts.push({ s: s, i: i, d: d });
        taskText[d.taskId] = d.text;
      });
    });
    var taskIds = Object.keys(taskText).sort(function (a, b) { return a - b || (a < b ? -1 : a > b ? 1 : 0); });
    var filterLabel = el("label", { for: "tt-task-filter" }, "Organize by: ");
    var filter = el("select", { id: "tt-task-filter" });
    filter.appendChild(el("option", { value: "" }, "All tasks (by participant)"));
    taskIds.forEach(function (id) { filter.appendChild(el("option", { value: id }, "Task " + id + ": " + taskText[id])); });
    var byTask = el("div", { id: "tt-by-task" });
    var byParticipant = el("div", { id: "tt-by-participant" });
    function drawByTask() {
      byTask.innerHTML = "";
      // "All tasks" keeps the per-participant layout; a single task shows every participant's attempt at it.
      byParticipant.hidden = !!filter.value;
      if (!filter.value) return;
      var shown = attempts.filter(function (a) { return String(a.d.taskId) === filter.value; });
      if (!shown.length) { byTask.appendChild(el("p", null, "No attempts for this task yet.")); return; }
      byTask.appendChild(attemptTable(study, shown, true));
    }
    filter.addEventListener("change", drawByTask);
    var filterBox = el("p", { class: "tt-filter" });
    filterBox.appendChild(filterLabel);
    filterBox.appendChild(filter);
    main.appendChild(filterBox);
    main.appendChild(byTask);
    main.appendChild(byParticipant);
    drawByTask();

    sessions.forEach(function (s) {
      byParticipant.appendChild(el("h2", null, s.id + " " + s.name));
      byParticipant.appendChild(attemptTable(study, s.done.map(function (d, i) { return { s: s, i: i }; }), false));
    });
  }

  // ---------- public ----------

  window.TreeTest = {
    init: function () {
      var picked = params.get("test");
      // Hide ?test and ?results from the address bar once they've been read.
      if (params.has("test") || params.has("results")) {
        var rest = new URLSearchParams(window.location.search);
        rest.delete("test");
        rest.delete("results");
        var q = rest.toString();
        window.history.replaceState(null, "", window.location.pathname + (q ? "?" + q : "") + window.location.hash);
      }
      if (mode === "results") {
        // Opening results releases this tab from any session.
        setTabSession(null);
        buildResults();
        return;
      }
      session = findActiveSession();
      document.addEventListener("click", onClick, true);
      if (session) {
        if (session.awaitingStart) { startTask(); return; }
        if (!session.current) session.current = { start: Date.now(), events: [], selected: null, selectedPage: "" };
        // A selection only counts on the page it was made on.
        if (session.current.selected && session.current.selectedPage !== viewName()) session.current.selected = null;
        renderBar();
        refreshSelection();
      } else if (params.has("test")) {
        if (STUDIES[picked]) showStart(picked);
        else showPicker();
      } else {
        showRunButton();
      }
    },
    isResultsPage: function () {
      return mode === "results";
    },
    // app.js calls this after drawing a view.
    routeChanged: function () {
      if (!session || !session.current) return;
      if (session.current.selected && session.current.selectedPage !== viewName()) {
        session.current.selected = null;
        saveSession();
      }
      refreshSelection();
    },
    // Only the tree test turns recipe cards into selectable buttons; the talk-aloud test uses the normal site.
    cardsClickable: function () {
      var active = session || findActiveSession();
      return mode !== "results" && !!active && studyOf(active) === "tree" && !(session && session.awaitingStart);
    },
    selectedName: function () {
      return session && session.current ? session.current.selected : null;
    },
  };
})();
