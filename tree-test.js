// Tree-test harness.
//   index.html?test     starts a session: moderator enters the participant's name,
//                       then tasks run one at a time in a random order for each participant
//   index.html?results  the moderator's results page: sessions, CSV/JSON download, clear
// Every click during a task is logged. Results are kept in this browser's localStorage
// (they survive reloads and restarts). A session belongs to the tab it was started in
// (sessionStorage); other tabs show the normal site. app.js calls TreeTest.init().

(function () {
  "use strict";

  var data = window.SITE_DATA || { recipes: [], tasks: [] };
  var tasks = data.tasks || [];
  var KEY = "recipeTreeTest.v1";
  var TAB_KEY = "recipeTreeTest.tab";
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

  function taskById(id) {
    for (var i = 0; i < tasks.length; i++) if (String(tasks[i].id) === String(id)) return tasks[i];
    return null;
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

  function saveSession() {
    var state = loadState();
    var found = false;
    state.sessions = state.sessions.map(function (s) {
      if (s.id === session.id) { found = true; return session; }
      return s;
    });
    if (!found) state.sessions.push(session);
    state.nextId = Math.max(state.nextId, parseInt(session.id.slice(1), 10) + 1);
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; }
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

  function closeDialog() {
    var dlg = document.getElementById("tt-dialog");
    if (dlg) dlg.remove();
  }

  // ---------- session flow ----------

  function showStart() {
    if (!tasks.length) {
      openDialog(function (dlg) {
        dlg.appendChild(el("h2", null, "No tasks yet"));
        dlg.appendChild(el("p", null, "Add tasks to data.js (see the comment at the top), then reload."));
      });
      return;
    }
    openDialog(function (dlg) {
      dlg.appendChild(el("h2", null, "Participant"));
      dlg.appendChild(el("p", null, "Moderator: enter the participant's name, then start."));
      var label = el("label", { for: "tt-name" }, "Participant name");
      var input = el("input", { type: "text", id: "tt-name", autocomplete: "off" });
      var start = el("button", { type: "button" }, "Start");
      function go() {
        var name = clean(input.value);
        if (!name) { input.focus(); return; }
        startSession(name);
      }
      start.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      dlg.appendChild(label);
      dlg.appendChild(input);
      dlg.appendChild(start);
    });
  }

  function startSession(name) {
    var state = loadState();
    session = {
      id: "P" + state.nextId,
      name: name,
      started: Date.now(),
      status: "in progress",
      order: shuffle(tasks.map(function (t) { return String(t.id); })),
      pos: 0,
      current: null,
      awaitingNext: false,
      done: [],
    };
    saveSession();
    setTabSession(session.id);
    closeDialog();
    startTask();
  }

  // Begins the current task from the home page.
  function startTask() {
    session.current = { start: Date.now(), events: [] };
    session.awaitingNext = false;
    saveSession();
    var onPlainHome = document.body.getAttribute("data-page") === "home" && !window.location.search;
    if (onPlainHome) {
      renderBar();
    } else if (document.body.getAttribute("data-page") === "home") {
      window.history.replaceState(null, "", "index.html");
      renderBar();
    } else {
      window.location.replace("index.html");
    }
  }

  function renderBar() {
    closeDialog();
    var old = document.getElementById("tt-bar");
    if (old) old.remove();
    var task = taskById(session.order[session.pos]);
    document.body.classList.add("tt-active");
    var bar = el("div", { class: "tt-bar", id: "tt-bar" });
    bar.appendChild(el("p", { class: "tt-task" }, "Task " + (session.pos + 1) + " of " + session.order.length + ": " + task.text));
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

  // selected: recipe name, or null if the participant gave up.
  function finishTask(selected) {
    var task = taskById(session.order[session.pos]);
    var cur = session.current;
    var targets = task.targets || [];
    var outcome = selected == null ? "gave up" : (targets.indexOf(selected) !== -1 ? "found" : "wrong recipe");
    var first = cur.events.length ? cur.events[0].label : "";
    session.done.push({
      taskId: String(task.id),
      position: session.pos + 1,
      text: task.text,
      targets: targets,
      predictedFirstClick: task.predictedFirstClick || "",
      paths: task.paths || [],
      outcome: outcome,
      selected: selected || "",
      seconds: secs(Date.now() - cur.start),
      firstClick: first,
      events: cur.events,
    });
    session.current = null;
    session.awaitingNext = true;
    saveSession();
    showResult();
  }

  function showResult() {
    removeBar();
    var last = session.done[session.done.length - 1];
    var isLast = session.pos + 1 >= session.order.length;
    openDialog(function (dlg) {
      dlg.appendChild(el("p", null, last.selected ? "You selected " + last.selected + "." : "You gave up on this task."));
      var next = el("button", { type: "button", id: "tt-next" }, isLast ? "Finish" : "Next task");
      next.addEventListener("click", function () {
        session.pos++;
        session.awaitingNext = false;
        if (session.pos >= session.order.length) endSession("complete");
        else { closeDialog(); startTask(); }
      });
      dlg.appendChild(next);
    });
  }

  function endSession(status) {
    session.status = status;
    session.current = null;
    session.awaitingNext = false;
    saveSession();
    setTabSession(null);
    removeBar();
    openDialog(function (dlg) {
      dlg.appendChild(el("h2", null, status === "complete" ? "Thank you" : "Session ended"));
      dlg.appendChild(el("p", null, "This session is finished. Please let the moderator know."));
    });
    session = null;
  }

  // ---------- click logging ----------

  function pageName() {
    var q = new URLSearchParams(window.location.search);
    q.delete("test");
    var file = window.location.pathname.split("/").pop() || "index.html";
    var s = q.toString();
    return file + (s ? "?" + s : "");
  }

  function describe(node) {
    if (node.matches("button.card")) return { action: "card", label: node.getAttribute("data-name") };
    if (node.id === "clear-filters") return { action: "clear filters", label: "Clear filters" };
    if (node.matches("button.toggle")) {
      // This runs before the page toggles the button, so aria-pressed is still the old state.
      return { action: node.getAttribute("aria-pressed") === "true" ? "filter off" : "filter on", label: node.getAttribute("data-label") };
    }
    if (node.matches("a")) return { action: "link", label: clean(node.textContent) };
    return null;
  }

  function onClick(e) {
    if (!session || !session.current) return;
    var node = e.target.closest("a, button, input");
    if (!node || node.closest("#tt-bar") || node.closest("dialog")) return;
    var info = describe(node);
    if (!info) return;
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
    if (info.action === "card") {
      e.preventDefault();
      finishTask(info.label);
    }
  }

  // ---------- results (moderator) ----------

  var COLUMNS = [
    "participant", "name", "session_start", "session_status",
    "task_position", "task_id", "task_text", "targets", "outcome", "selected",
    "task_seconds", "task_clicks", "expected_paths", "predicted_first_click", "first_click", "first_click_matches_prediction",
    "click_number", "action", "label", "page", "seconds_since_task_start", "seconds_since_previous",
  ];

  function rows() {
    var out = [];
    loadState().sessions.forEach(function (s) {
      s.done.forEach(function (t) {
        var base = {
          participant: s.id, name: s.name, session_start: formatDateTime(s.started), session_status: s.status,
          task_position: t.position, task_id: t.taskId, task_text: t.text, targets: t.targets.join(" | "),
          outcome: t.outcome, selected: t.selected, task_seconds: t.seconds, task_clicks: t.events.length,
          expected_paths: (t.paths || []).map(function (p) { return p.join(" > "); }).join(" | "),
          predicted_first_click: t.predictedFirstClick, first_click: t.firstClick,
          first_click_matches_prediction: t.predictedFirstClick ? (t.firstClick === t.predictedFirstClick ? "yes" : "no") : "",
        };
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

  function buildResults() {
    document.title = "Tree test results | " + data.siteName;
    document.getElementById("site-name").textContent = data.siteName;
    document.getElementById("breadcrumb").textContent = "Tree test results";
    var main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(el("h1", null, "Tree test results"));
    var state = loadState();
    if (!storageOk) main.appendChild(el("p", { class: "problems", role: "alert" }, "This browser isn't letting the page save results."));

    var actions = el("div", { class: "tt-actions" });
    var csv = el("button", { type: "button", id: "tt-csv" }, "Download CSV");
    csv.addEventListener("click", function () {
      var lines = [COLUMNS.join(",")];
      rows().forEach(function (r) { lines.push(COLUMNS.map(function (c) { return csvCell(r[c]); }).join(",")); });
      download("tree-test-results.csv", "text/csv", lines.join("\n") + "\n");
    });
    var json = el("button", { type: "button", id: "tt-json" }, "Download JSON");
    json.addEventListener("click", function () {
      download("tree-test-results.json", "application/json", JSON.stringify(loadState().sessions, null, 2));
    });
    var clear = el("button", { type: "button", id: "tt-clear" }, "Clear all results");
    var confirmBox = el("span");
    clear.addEventListener("click", function () {
      confirmBox.innerHTML = "";
      confirmBox.appendChild(document.createTextNode("Delete all saved sessions? "));
      var yes = el("button", { type: "button" }, "Yes, delete");
      var no = el("button", { type: "button" }, "Cancel");
      yes.addEventListener("click", function () {
        try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
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

    if (!state.sessions.length) { main.appendChild(el("p", null, "No sessions saved yet.")); return; }

    var table = el("table", { class: "tt-table" });
    var head = el("tr");
    ["Participant", "Name", "Started", "Status", "Tasks done", "Found"].forEach(function (h) { head.appendChild(el("th", null, h)); });
    table.appendChild(head);
    state.sessions.forEach(function (s) {
      var tr = el("tr");
      var found = s.done.filter(function (t) { return t.outcome === "found"; }).length;
      [s.id, s.name, formatDateTime(s.started), s.status, s.done.length + " of " + s.order.length, found].forEach(function (v) {
        tr.appendChild(el("td", null, v));
      });
      table.appendChild(tr);
    });
    main.appendChild(table);

    state.sessions.forEach(function (s) {
      main.appendChild(el("h2", null, s.id + " " + s.name));
      var t = el("table", { class: "tt-table" });
      var h = el("tr");
      ["#", "Task", "Outcome", "Selected", "Seconds", "Clicks", "First click", "Path"].forEach(function (c) { h.appendChild(el("th", null, c)); });
      t.appendChild(h);
      s.done.forEach(function (d) {
        var tr = el("tr");
        [d.position, d.text, d.outcome, d.selected, d.seconds, d.events.length, d.firstClick,
         d.events.map(function (ev) { return ev.label; }).join(" > ")].forEach(function (v) { tr.appendChild(el("td", null, v)); });
        t.appendChild(tr);
      });
      main.appendChild(t);
    });
  }

  // ---------- public ----------

  window.TreeTest = {
    init: function () {
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
        if (session.awaitingNext) showResult();
        else {
          if (!session.current) session.current = { start: Date.now(), events: [] };
          renderBar();
        }
      } else if (params.has("test")) {
        showStart();
      }
    },
    cardsClickable: function () {
      return mode !== "results" && (!!session || !!findActiveSession()) && !(session && session.awaitingNext);
    },
  };
})();
