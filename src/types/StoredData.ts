import { TimerLog } from "./TimerLog";

export interface StoredData {
  username: string | null;
  logs: TimerLog[];
}