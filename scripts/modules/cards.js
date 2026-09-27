import { CARDS_DATA } from "../cards-data.js";
import { card } from "./card.js";
import { withCategoryIndex } from "./utils.js";

function createCards() {
  const preparedCardsData = withCategoryIndex(CARDS_DATA);

  function createCard(index) {
    return card.init(preparedCardsData[index]);
  }

  function init() {
    const cardsContainer = document.querySelector('.cards-test');

    const testCard0 = createCard(0);
    const testCard1 = createCard(1);
    const testCard2 = createCard(2);

    cardsContainer.appendChild(testCard0);
    cardsContainer.appendChild(testCard1);
    cardsContainer.appendChild(testCard2);
  }

  return {
    init,
  };
}

export const cards = createCards();