import { theme } from './modules/theme.js';
import { nav } from './modules/navigation.js';
import { slider } from './modules/slider.js';

const themeSwitch = document.querySelector('.theme-switch');

function installTheme(currentTheme) {
  themeSwitch.setAttribute('aria-checked', String(currentTheme === 'dark'));
}

installTheme(theme.get());
theme.addEventListener('change', (e) => installTheme(e.detail.theme));
themeSwitch.addEventListener('click', () => theme.toggle());

nav.init();
slider.init();