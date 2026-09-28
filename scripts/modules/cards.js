import { CARDS_DATA } from "../cards-data.js";
import { card } from "./card.js";
import { withCategoryIndex } from "./utils.js";

const CARDS_CLASSES = {
  LIST: 'cards-list',
  LIST_ITEM: 'cards-list__item',
  TABS_CONTENT: 'cards-tabs-content',
  MORE: 'cards-more',
  MORE_ICON: 'cards-mode__icon',
  MORE_PATH: 'cards-more__path',
};

function createCards() {
  const preparedCardsData = withCategoryIndex(CARDS_DATA);

  function init() {
    const cardsContainer = document.querySelector('.cards-test');

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