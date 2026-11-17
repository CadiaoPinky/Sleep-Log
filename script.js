const STORAGE_KEY = "sleepLogEntries";
const THEME_KEY = "sleepLogTheme";

const bedtimeInput = document.getElementById("bedtime");
const wakeInput = document.getElementById("wake");
const previewEl = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const messageEl = document.getElementById("message");
const listEl = document.getElementById("logList");
const emptyNote = document.getElementById("emptyNote");
const averageValue = document.getElementById("averageValue");
const averageNote = document.getElementById("averageNote");
const themeBtn = document.getElementById("themeBtn");
const confirmDialog = document.getElementById("confirmDialog");
const confirmDetail = document.getElementById("confirmDetail");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let pendingDeleteId = null;
let storageWorks = true;
try {
  localStorage.setItem("__test", "1");
  localStorage.removeItem("__test");
} catch (e) {
  storageWorks = false;
}
let fallback = {};
try {
  const parsed = JSON.parse(window.name);
  if (parsed && typeof parsed === "object") fallback = parsed;
} catch (e) { /* ignore */ }

function storageGet(key) {
  if (storageWorks) {
    try { return localStorage.getItem(key); } catch (e) { /* fall through */ }
  }
  return key in fallback ? fallback[key] : null;
}

function storageSet(key, value) {
  if (storageWorks) {
    try { localStorage.setItem(key, value); return; } catch (e) { storageWorks = false; }
  }
  fallback[key] = value;
  try { window.name = JSON.stringify(fallback); } catch (e) { /* ignore */ }
}

if (!storageWorks) {
  const warn = document.getElementById("storageWarning");
  if (warn) warn.hidden = false;
}

let entries = loadEntries();

function loadEntries() {
  try {
    return JSON.parse(storageGet(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries() {
  storageSet(STORAGE_KEY, JSON.stringify(entries));
}

function toInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) +
    "T" + pad(date.getHours()) + ":" + pad(date.getMinutes())
  );
}

function formatHours(hours) {
  const total = Math.round(hours * 60);
  return Math.floor(total / 60) + "h " + (total % 60) + "m";
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function durationHours(bedtime, wake) {
  return (new Date(wake) - new Date(bedtime)) / 3600000;
}

function isValidDuration(hours) {
  return hours > 0 && hours < 24;
}

function renderAverage() {
  if (entries.length === 0) {
    averageValue.textContent = "No data yet";
    averageValue.classList.add("empty-state");
    averageNote.textContent = "Log a night to see your average.";
    return;
  }
  const total = entries.reduce((sum, e) => sum + e.hours, 0);
  averageValue.textContent = formatHours(total / entries.length);
  averageValue.classList.remove("empty-state");
  averageNote.textContent =
    "Based on " + entries.length + (entries.length === 1 ? " night" : " nights");
}

function renderList() {
  listEl.innerHTML = "";
  const sorted = [...entries].sort((a, b) => new Date(b.bedtime) - new Date(a.bedtime));

  emptyNote.hidden = sorted.length > 0;

  sorted.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "log";

    const hours = document.createElement("div");
    hours.className = "log-hours";
    hours.textContent = formatHours(entry.hours);

    const times = document.createElement("div");
    times.className = "log-times";
    const bed = document.createElement("div");
    bed.textContent = "Bed: " + formatDate(entry.bedtime);
    const wake = document.createElement("div");
    wake.className = "wake";
    wake.textContent = "Woke: " + formatDate(entry.wake);
    times.append(bed, wake);

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", () => askDelete(entry));

    li.append(hours, times, del);
    listEl.appendChild(li);
  });
}

function renderPreview() {
  const hours = durationHours(bedtimeInput.value, wakeInput.value);
  if (!bedtimeInput.value || !wakeInput.value) {
    previewEl.textContent = "";
    previewEl.classList.remove("error");
  } else if (isValidDuration(hours)) {
    previewEl.textContent = "Duration: " + formatHours(hours);
    previewEl.classList.remove("error");
  } else {
    previewEl.textContent = "Wake time must be after bedtime, within 24 hours.";
    previewEl.classList.add("error");
  }
}

function render() {
  renderAverage();
  renderList();
  renderPreview();
}

function askDelete(entry) {
  pendingDeleteId = entry.id;
  const summary = formatHours(entry.hours) + " on " + formatDate(entry.bedtime);

  if (typeof confirmDialog.showModal === "function") {
    confirmDetail.textContent = summary;
    confirmDialog.showModal();
  } else if (window.confirm("Are you sure you want to delete this?\n" + summary)) {
    deletePending();
  } else {
    pendingDeleteId = null;
  }
}

function deletePending() {
  if (pendingDeleteId === null) return;
  entries = entries.filter((e) => e.id !== pendingDeleteId);
  pendingDeleteId = null;
  saveEntries();
  render();
}

confirmYes.addEventListener("click", () => {
  confirmDialog.close();
  deletePending();
});

confirmNo.addEventListener("click", () => {
  pendingDeleteId = null;
  confirmDialog.close();
});

confirmDialog.addEventListener("cancel", () => {
  pendingDeleteId = null;
});


confirmDialog.addEventListener("click", (event) => {
  if (event.target === confirmDialog) {
    pendingDeleteId = null;
    confirmDialog.close();
  }
});


function showMessage(text, isError) {
  messageEl.textContent = text;
  messageEl.classList.toggle("error", !!isError);
  setTimeout(() => (messageEl.textContent = ""), 3000);
}

saveBtn.addEventListener("click", () => {
  if (!bedtimeInput.value || !wakeInput.value) {
    showMessage("Choose both your bedtime and wake time.", true);
    return;
  }

  const hours = durationHours(bedtimeInput.value, wakeInput.value);
  if (!isValidDuration(hours)) {
    showMessage("Wake time must be after bedtime, within 24 hours.", true);
    return;
  }

  entries.push({
    id: Date.now(),
    bedtime: new Date(bedtimeInput.value).toISOString(),
    wake: new Date(wakeInput.value).toISOString(),
    hours: hours,
  });
  saveEntries();

  bedtimeInput.value = "";
  wakeInput.value = "";

  render();
  showMessage("Sleep logged!", false);
});

bedtimeInput.addEventListener("input", renderPreview);
wakeInput.addEventListener("input", renderPreview);


function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#862a7a" : "#e4f2fc");
  themeBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function initTheme() {
  const saved = storageGet(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

themeBtn.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  storageSet(THEME_KEY, next);
});

(function setDefaults() {
  const now = new Date();
  const bed = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 0);
  const wake = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0);
  bedtimeInput.value = toInputValue(bed);
  wakeInput.value = toInputValue(wake);
})();

initTheme();
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      console.warn("Service worker registration failed");
    });
  });
}
