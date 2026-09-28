import { CARDS_DATA } from "../cards-data.js";
import { card } from "./card.js";
import { withId, getUniqueCategories, getCategoryItems } from "./utils.js";

const CARDS_CLASSES = {
  TABS: 'cards-tabs',
  TABS_ITEM: 'cards-tabs__item',
  TABS_ICON: 'cards-tabs__icon',
  TABS_TEXT: 'cards-tabs__text',
  TABS_CONTENT: 'cards-tabs-content',

  LIST: 'cards-list',
  LIST_ITEM: 'cards-list__item',
  MORE: 'cards-more',
  MORE_ICON: 'cards-more__icon',
  MORE_PATH: 'cards-more__path',
};

const TABS_ARIA_LABEL = 'Menu categories'; 

const ICON_BASE_PATH = 'assets/img/icons';
const ICON_FORMAT = 'svg';

const MOBILE_QUERY = '(max-width: 768px)';
const MOBILE_LIMIT = 4;
const PANEL_ID = 'cards-panel';

const MORE_ICON_SVG = `
  <svg class="${CARDS_CLASSES.MORE_ICON}" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="${CARDS_CLASSES.MORE_PATH}" d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="${CARDS_CLASSES.MORE_PATH}" d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

function createCards() {
  const cardsData = withId(CARDS_DATA);
  const categories = getUniqueCategories(cardsData);
  const mobileMedia = matchMedia(MOBILE_QUERY);

  const state = { category: categories[0], expanded: false };
  const refs = { list: null, more: null };

  function createTabs() {
    const tabs = document.createElement('div');
    tabs.classList.add(CARDS_CLASSES.TABS);
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', TABS_ARIA_LABEL);

    categories.forEach((category) => {
      const tab = createTab(category);
      tabs.appendChild(tab);
    });

    return tabs;
  }

  function createTab(category) {
    const isActive = category === state.category;
    const button = document.createElement('button');
    button.classList.add(CARDS_CLASSES.TABS_ITEM);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.id = `tab-${category}`;
    button.setAttribute('aria-selected', String(isActive));
    button.setAttribute('aria-controls', PANEL_ID);
    button.tabIndex = (isActive) ? 0: -1;

    const img = document.createElement('img');
    img.classList.add(CARDS_CLASSES.TABS_ICON);
    img.setAttribute('aria-hidden', 'true');
    img.src = `${ICON_BASE_PATH}/${category}-tab.${ICON_FORMAT}`;
    img.alt = '';

    const text = document.createElement('span');
    text.classList.add(CARDS_CLASSES.TABS_TEXT);
    text.textContent = category;

    button.appendChild(img);
    button.appendChild(text);
    return button;
  }

  function createListItem(cardData) {
      const li = document.createElement('li');
      li.classList.add(CARDS_CLASSES.LIST_ITEM);
  
      li.appendChild(card.init(cardData));
      return li;
  }

  function renderList() {
    const items = getCategoryItems(cardsData, state.category);
    const limit = getLimit(items.length);
    refs.list.replaceChildren(...items.slice(0, limit).map(createListItem));
    refs.more.hidden = limit >= items.length;
  }

  function getLimit(total) {
    if (!mobileMedia.matches || state.expanded) return total;

    return Math.min(MOBILE_LIMIT, total);
  }

  function createMoreButton() {
    const button = document.createElement('button');
    button.classList.add(CARDS_CLASSES.MORE);
    button.type = 'button';
    button.setAttribute('aria-label', 'Show more items');
    button.innerHTML = MORE_ICON_SVG;
    button.hidden = true;
    
    return button;
  }

  function init() {
    const cardsContainer = document.querySelector('.cards');

    const panel = document.createElement('div');
    panel.classList.add(CARDS_CLASSES.TABS_CONTENT);
    panel.id = PANEL_ID;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${state.category}`);

    refs.list = document.createElement('ul');
    refs.list.classList.add(CARDS_CLASSES.LIST);
    panel.appendChild(refs.list);
    
    refs.more = createMoreButton();
    panel.appendChild(refs.more);

    refs.more.addEventListener('click', () => {
      const prevCount = refs.list.children.length;
      state.expanded = true;
      renderList();
      refs.list.children[prevCount]?.querySelector('button').focus();
    });

    mobileMedia.addEventListener('change', () => {
      state.expanded = false;
      renderList();
    });

    cardsContainer.appendChild(createTabs());
    cardsContainer.appendChild(panel);

    renderList();
  }

  return {
    init,
  };
}

export const cards = createCards();