import type { StoredData} from "../types/StoredData";
import type { TimerLog } from "../types/TimerLog";

const KEY = "time-tracker-data";

function getDefault(): StoredData {
  return { username: null, logs: [] };
}

export function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return getDefault();
    const parsed = JSON.parse(raw) as StoredData;
    parsed.logs ??= [];
    return parsed;
  } catch {
    return getDefault();
  }
}

export function saveData(data: StoredData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function saveUsername(name: string): void {
  const data = loadData();
  data.username = name;
  saveData(data);
}

export function addLog(log: TimerLog): void {
  const data = loadData();
  data.logs.push(log);
  saveData(data);
}

export function clearLogs(): void {
  const data = loadData();
  data.logs = [];
  saveData(data);
}