export function getHistory() {
    return JSON.parse(localStorage.getItem("scanHistory") || "[]");
}
export function saveHistory(data) {
    const history = getHistory();
    history.unshift(data);
    if (history.length > 100) {
        history.pop();
    }
    localStorage.setItem("scanHistory", JSON.stringify(history));
}
export function clearHistory() {
    localStorage.removeItem("scanHistory");
}
