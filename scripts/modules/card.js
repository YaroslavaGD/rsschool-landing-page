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
const IMAGE_BASE_PATH = 'assets/img/menu';
const IMAGE_FORMATS = ['webp', 'jpg'];
const IMAGE_MIME_TYPES = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
};
const IMAGE_SMALL_SUFFIX = '340';

const PRICE_HINT_TEXT = 'Price: ';
const PRICE_CURRENCY = '$';

function createCard() {
  
  function createPictureWrapper(data) {
    const pictureWrapper = document.createElement('div');
    pictureWrapper.classList.add(CARD_CLASSES.PICTURE_WRAPPER);

    const picture = createPicture(data);
    pictureWrapper.appendChild(picture);

    return pictureWrapper;
  }

  function createPicture(data) {
    const basePath = generateImageBasePath(data);

    const picture = document.createElement('picture');
    picture.classList.add(CARD_CLASSES.PICTURE);

    const createSource = (format) => {
      const source = document.createElement('source');
      source.srcset = `
        ${basePath}-${IMAGE_SMALL_SUFFIX}.${format} 1x, 
        ${basePath}.${format} 2x
      `;
      source.type = IMAGE_MIME_TYPES[format];
      return source;
    };

    IMAGE_FORMATS.forEach((format) => {
      picture.appendChild(createSource(format));
    });

    const fallbackFormat = IMAGE_FORMATS[IMAGE_FORMATS.length - 1]; //jpg
    const img = document.createElement('img');
    img.classList.add(CARD_CLASSES.IMG);
    img.src = `${basePath}-${IMAGE_SMALL_SUFFIX}.${fallbackFormat}`;
    img.alt = '';
    img.loading = 'lazy';

    picture.appendChild(img);

    return picture;
  }

  function createContent(data) {
    const idDescription = `${generateId(data, 'desc')}`;
    const idPrice = `${generateId(data, 'price')}`;

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

  function generateId(data, name) {
    const { category, categoryIndex } = data;
    return `${category}-${categoryIndex}-${name}`;
  }

  function generateImageBasePath(data) {
    const { category, categoryIndex } = data;
    return `${IMAGE_BASE_PATH}/${category}-${categoryIndex}`;
  }

  function init(data) {
    const cardElement = document.createElement('article');
    cardElement.classList.add(CARD_CLASSES.CARD);

    const pictureWrapper = createPictureWrapper(data);
    const content = createContent(data);

    cardElement.appendChild(pictureWrapper);
    cardElement.appendChild(content);

    return cardElement;
  }

  return {
    init,
  };
}

export const card = createCard();