export function toggleTheme(): void {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
}

/** Sync aria-pressed state */
export function updateThemeToggle(btn: HTMLButtonElement): void {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  btn.setAttribute("aria-pressed", String(isDark));
}