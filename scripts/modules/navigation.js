const MOBILE_QUERY = '(max-width: 768px)';

function createNavigation() {
  const page = document.querySelector('.page');
  const navButton = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const mobileMedia = matchMedia(MOBILE_QUERY);

  let isOpen = false;

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;

    navButton.classList.toggle('burger--open', open);
    navButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('nav--open', open);
    nav.toggleAttribute('inert', !open);
    page.classList.toggle('page--clip', open);
  }

  function toggle() {
    setOpen(!isOpen);
  }

  function close() {
    setOpen(false);
  }

  function handleButtonClick(e) {
    e.stopPropagation();
    toggle();
  }

  function handleNavClick(e) {
    if (mobileMedia.matches && e.target.closest('.nav__link')) {
      close();
    }
  }

  function handleOutsideClick(e) {
    if (isOpen && !nav.contains(e.target) && e.target !== navButton) {
      close();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  }

  function handleMediaChange(e) {
    if (!e.matches) {
      close();
    }
  }

  function init() {
    navButton.addEventListener('click', handleButtonClick);
    nav.addEventListener('click', handleNavClick);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
    mobileMedia.addEventListener('change', handleMediaChange);
  }

  return {
    init,
    open: () => setOpen(true),
    close,
    toggle
  };
}

export const nav = createNavigation();