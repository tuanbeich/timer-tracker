export interface TimerState {
  isRunning: boolean;
  startTimestamp: number | null;
  elapsedMs: number;            
}