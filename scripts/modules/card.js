const CARD_CLASSES = {
  CARD: 'card',
  PICTURE_WRAPPER: 'card__picture-wrapper',
  PICTURE: 'card__picture',
  IMG: 'card__img',
  CONTENT: 'card__content',
  TITLE: 'card__title',
  BUTTON: 'card__button',
  DESCRIPTION: 'card__description',
  PRICE: 'card__price',
  VISUALLY_HIDDEN: 'visually-hidden'
}

const PRICE_HINT_TEXT = 'Price: ';
const PRICE_CURRENCY = '$';

function createCard() {
  const cardElement = document.createElement('article');
  cardElement.classList.add(CARD_CLASSES.CARD);

  function createPictureWrapper(data) {
    const pictureWrapper = document.createElement('div');
    pictureWrapper.classList.add(CARD_CLASSES.PICTURE_WRAPPER);

    return pictureWrapper;
  }

  function createContent(data, index) {

    const idDescription = `${generateId(data, index, 'desc')}`;
    const idPrice = `${generateId(data, index, 'price')}`;

    const content = document.createElement('div');
    content.classList.add(CARD_CLASSES.CONTENT);

    const title = createTitle(data, idDescription, idPrice);
    const description = createDescription(data, idDescription);
    const price = createPrice(data, idPrice);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(price);

    return content;
  }

  function createTitle(data, idDescription, idPrice) {
    const title = document.createElement('h2');
    title.classList.add(CARD_CLASSES.TITLE);

    const button = createButton(data, idDescription, idPrice);
    title.appendChild(button);

    return title;
  }

  function createButton(data, idDescription, idPrice) {
    const { name } = data;

    const button = document.createElement('button');
    button.classList.add(CARD_CLASSES.BUTTON);
    button.type = 'button';
    button.ariaHasPopup = 'dialog';
    button.setAttribute('aria-describedby', `${idDescription} ${idPrice}`);
    button.textContent = name;

    return button;
  }

  function createDescription(data, idDescription) {
    const { description } = data;

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add(CARD_CLASSES.DESCRIPTION);
    descriptionElement.id = `${idDescription}`;
    descriptionElement.textContent = description;

    return descriptionElement;
  }

  function createPrice(data, idPrice) {
    const { price } = data;

    const priceElement = document.createElement('p');
    priceElement.classList.add(CARD_CLASSES.PRICE);
    priceElement.id = `${idPrice}`;

    const priceHint = document.createElement('span');
    priceHint.classList.add(CARD_CLASSES.VISUALLY_HIDDEN);
    priceHint.textContent = PRICE_HINT_TEXT;

    const priceNumber = document.createElement('span');
    priceNumber.textContent = `${PRICE_CURRENCY}${price}`;

    priceElement.appendChild(priceHint);
    priceElement.appendChild(priceNumber);

    return priceElement;
  }

  function generateId(data, index, name) {
    const { category } = data;
    return `${category}-${index + 1}-${name}`;
  }

  function init(data, index) {
    const cardElement = document.createElement('article');
    cardElement.classList.add(CARD_CLASSES.CARD);

    const pictureWrapper = createPictureWrapper(data);
    const content = createContent(data, index);

    cardElement.appendChild(pictureWrapper);
    cardElement.appendChild(content);

    return cardElement;
  }

  return {
    init,
  };
}

export const card = createCard();