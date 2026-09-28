import { CARDS_DATA } from "../cards-data.js";
import { card } from "./card.js";
import { withCategoryIndex } from "./utils.js";

const CARDS_CLASSES = {
  TABS: 'cards-tabs',
  TABS_ITEM: 'cards-tabs__item',
  TABS_ICON: 'cards-tabs__icon',
  TABS_TEXT: 'cards-tabs__text',

  LIST: 'cards-list',
  LIST_ITEM: 'cards-list__item',
  TABS_CONTENT: 'cards-tabs-content',
  MORE: 'cards-more',
  MORE_ICON: 'cards-more__icon',
  MORE_PATH: 'cards-more__path',
};

const TABS_ARIA_LABEL = 'Menu categories'; 

const ICON_BASE_PATH = 'assets/img/icons';
const ICON_FORMAT = 'svg';

function getUniqueCategories(cardsData) {
  return [...new Set(cardsData.map((item) => item.category))];
}

function createCards() {
  const preparedCardsData = withCategoryIndex(CARDS_DATA);

  function createTabs(cardsData) {
    const tabs = document.createElement('div');
    tabs.classList.add(CARDS_CLASSES.TABS);
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', TABS_ARIA_LABEL);

    const categories = getUniqueCategories(cardsData);
    categories.forEach((category, index) => {
      const tab = createTab(category, index);
      tabs.appendChild(tab);
    });

    return tabs;
  }

  function createTab(category, index) {
    const button = document.createElement('button');
    button.classList.add(CARDS_CLASSES.TABS_ITEM);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.id = `tab-${category}`;
    button.setAttribute('aria-selected', String(index === 0));
    button.setAttribute('aria-controls', `panel-${category}`);
    button.tabIndex = (index === 0) ? 0: -1;

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

  function init() {
    const cardsContainer = document.querySelector('.cards-test');

    const tabs = createTabs(preparedCardsData);
    cardsContainer.appendChild(tabs);

    const list = document.createElement('ul');
    list.classList.add(CARDS_CLASSES.LIST);

    preparedCardsData.filter(cardData => cardData.category === 'coffee').forEach(cardData => {
      const li = document.createElement('li');
      li.classList.add(CARDS_CLASSES.LIST_ITEM);

      const cardElement = card.init(cardData);
      li.appendChild(cardElement);

      list.appendChild(li);
    });

    cardsContainer.appendChild(list);
  }

  return {
    init,
  };
}

export const cards = createCards();