const THEME_KEY = 'theme';
const THEMES = ['light', 'dark'];

function getTheme(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeTheme(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function createThemeSwitcher() {
  const target = new EventTarget();

  let currentTheme = THEMES.includes(getTheme(THEME_KEY)) ? getTheme(THEME_KEY) : document.documentElement.getAttribute('data-theme') || 'light';

  function set(theme, { persist = true } = {}) {
    if (!THEMES.includes(theme) || theme === currentTheme) return;

    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    if (persist) safeTheme(THEME_KEY, theme);

    target.dispatchEvent(new CustomEvent('change', { detail: { theme } }));
  }

  function toggle() {
    set(currentTheme === 'dark' ? 'light' : 'dark');
  }

  function get() {
    return currentTheme;
  }

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (getTheme(THEME_KEY)) return;

    set(e.matches ? 'dark' : 'light', { persist: false });
  });

  return {
    get,
    set,
    toggle,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
  };
}

export const theme = createThemeSwitcher();