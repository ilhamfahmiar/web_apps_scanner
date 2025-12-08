import { ScanData } from "../types/ScanData";

export function getHistory(): ScanData[] {
  return JSON.parse(localStorage.getItem("scanHistory") || "[]");
}

export function saveHistory(data: ScanData): void {
  const history = getHistory();
  history.unshift(data);

  if (history.length > 100) {
    history.pop();
  }

  localStorage.setItem("scanHistory", JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem("scanHistory");
}
