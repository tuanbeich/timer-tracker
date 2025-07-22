import { formatHMS, toDateString } from "./utils";
import { toggleTheme, updateThemeToggle } from "./functions/theme";
import { loadData, saveUsername, addLog, clearLogs as clearStoredLogs } from "./functions/storage";
import type { TimerState} from "./types/TimerState";
import type { TimerLog } from "./types/TimerLog";

// ---- Elements ----
const timerDisplay = document.getElementById("timer-display") as HTMLDivElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const pauseBtn = document.getElementById("pause-btn") as HTMLButtonElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const themeToggleBtn = document.getElementById("theme-toggle") as HTMLButtonElement;
const clearLogsBtn = document.getElementById("clear-logs") as HTMLButtonElement;
const logBody = document.getElementById("log-body") as HTMLTableSectionElement;
const filterDateInput = document.getElementById("filter-date") as HTMLInputElement;
const filterClearBtn = document.getElementById("filter-clear") as HTMLButtonElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;
const usernameInput = document.getElementById("username-input") as HTMLInputElement;
const taskInput = document.getElementById("task-input") as HTMLInputElement;
const profileName = document.getElementById("profile-name") as HTMLElement;

// ---- Timer State ----
let state: TimerState = {
  isRunning: false,
  startTimestamp: null,
  elapsedMs: 0,
};
let intervalId: number | null = null;
let logs: TimerLog[] = [];

// ---- Init ----
init();

function init(): void {
  const stored = loadData();
  logs = stored.logs ?? [];
  if (stored.username) {
    profileName.textContent = stored.username;
    usernameInput.value = stored.username;
  }

  renderLogs();
  attachEvents();
  renderTimer(0);
}

function attachEvents(): void {
  startBtn.addEventListener("click", handleStart);
  pauseBtn.addEventListener("click", handlePause);
  resetBtn.addEventListener("click", handleReset);
  themeToggleBtn.addEventListener("click", () => {
    toggleTheme();
    updateThemeToggle(themeToggleBtn);
  });
  clearLogsBtn.addEventListener("click", () => {
    clearStoredLogs();
    logs = [];
    renderLogs();
  });
  filterDateInput.addEventListener("change", renderLogs);
  filterClearBtn.addEventListener("click", () => {
    filterDateInput.value = "";
    renderLogs();
  });
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = usernameInput.value.trim();
    if (!name) return;
    profileName.textContent = name;
    saveUsername(name);
  });
}

// ---- Timer Control Handlers ----
function handleStart(): void {
  if (state.isRunning) return; // already running
  state.isRunning = true;
  state.startTimestamp = performance.now();
  startTicking();
  updateButtons();
}

function handlePause(): void {
  if (!state.isRunning) return;
  stopTicking();
  const now = performance.now();
  if (state.startTimestamp !== null) {
    state.elapsedMs += now - state.startTimestamp;
  }
  state.isRunning = false;
  state.startTimestamp = null;
  updateButtons();
}

function handleReset(): void {
  // If we had a running or paused session with non-zero time, log it.
  const total = getElapsedMs();
  if (total > 0) {
    const end = new Date();
    const start = new Date(end.getTime() - total);
    const log: TimerLog = {
      id: logs.length + 1,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationMs: total,
    };
    logs.push(log);
    addLog(log);
  }

  stopTicking();
  state = { isRunning: false, startTimestamp: null, elapsedMs: 0 };
  renderTimer(0);
  renderLogs();
  updateButtons();
}

// ---- Interval Ticking ----
function startTicking(): void {
  stopTicking();
  intervalId = window.setInterval(() => {
    renderTimer(getElapsedMs());
  }, 250); // update 4x/sec for smoothness
}

function stopTicking(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function getElapsedMs(): number {
  if (!state.isRunning || state.startTimestamp === null) return state.elapsedMs;
  const now = performance.now();
  return state.elapsedMs + (now - state.startTimestamp);
}

function renderTimer(ms: number): void {
  timerDisplay.textContent = formatHMS(ms);
}

function updateButtons(): void {
  if (state.isRunning) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false; // allow reset to log & clear time
  }
}

// ---- Logs ----
function renderLogs(): void {
  const selectedDate = filterDateInput.value; // YYYY-MM-DD or ""
  const filtered = selectedDate
    ? logs.filter((l) => toDateString(l.startTime) === selectedDate)
    : logs;

  logBody.innerHTML = "";
  filtered.forEach((log, idx) => {
    const tr = document.createElement("tr");

    const tdIdx = document.createElement("td");
    tdIdx.textContent = String(idx + 1);

    const tdStart = document.createElement("td");
    tdStart.textContent = new Date(log.startTime).toLocaleString();

    const tdEnd = document.createElement("td");
    tdEnd.textContent = new Date(log.endTime).toLocaleString();

    const tdDur = document.createElement("td");
    tdDur.textContent = formatHMS(log.durationMs);

    tr.append(tdIdx, tdStart, tdEnd, tdDur);
    logBody.appendChild(tr);
  });
}

// ---- Expose for debugging (optional) ----
// @ts-expect-error debugging
window.__TIME_TRACKER_DEBUG__ = { state, logs };