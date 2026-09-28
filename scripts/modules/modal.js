import { CARD_CLASSES } from './card.js';

const MODAL_CLASSES = {
  MODAL: 'modal',
  CARD: 'modal-card',
  CLOSE: 'modal__close',
  CLOSE_TEXT: 'modal__close-text',
  TITLE: 'modal__title',
  DESCRIPTION: 'modal__description',
  PRICE: 'modal__price',
}

const SCROLL_LOCK_CLASS = 'page--locked';
const MODAL_TITLE_ID = 'modal-title';
const IMAGE_BASE_PATH = 'assets/img/menu';
const IMAGE_FORMATS = ['empty', 'webp', 'jpg'];
const IMAGE_MIME_TYPES = {
  empty: '',
  webp: 'image/webp',
  jpg: 'image/jpeg',
};
const IMAGE_SMALL_SUFFIX = '340';

const PRICE_HINT_TEXT = 'Price: ';
const PRICE_CURRENCY = '$';

function createModal() {
  const refs = { dialog: null, title: null, description: null, price: null, priceNumber: null, pictureWrapper: null };
  let lastFocused = null;

  function create(data) {
    const dialog = document.createElement('dialog');
    dialog.classList.add(MODAL_CLASSES.MODAL);
    dialog.setAttribute('aria-labelledby', MODAL_TITLE_ID);

    const cardElement = document.createElement('article');
    cardElement.classList.add(CARD_CLASSES.CARD);
    cardElement.classList.add(MODAL_CLASSES.CARD);

    const pictureWrapper = createPictureWrapper(data);
    const content = createContent(data);

    refs.pictureWrapper = pictureWrapper;

    cardElement.appendChild(pictureWrapper);
    cardElement.appendChild(content);
    dialog.appendChild(cardElement);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeModal();
    });

    dialog.addEventListener('close', onClose);
    refs.dialog = dialog;
    document.body.appendChild(dialog);
  } 

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
        if (format === 'empty') {
          source.media = '(max-width: 680px)';
          source.srcset = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          return source;
        }

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
      const idDescription = `${generateId('desc')}`;
      const idPrice = `${generateId('price')}`;
  
      const content = document.createElement('div');
      content.classList.add(CARD_CLASSES.CONTENT);
  
      const title = createTitle(data, idDescription, idPrice);
      const description = createDescription(data, idDescription);
      const price = createPrice(data, idPrice);
      const close = createClose();

      refs.title = title;
      refs.description = description;
  
      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(price);
      content.appendChild(close);
  
      return content;
    }
  
    function createTitle(data) {
      const { name } = data;
      const title = document.createElement('h2');
      title.classList.add(CARD_CLASSES.TITLE);
      title.classList.add(MODAL_CLASSES.TITLE);
      title.id = MODAL_TITLE_ID;
      title.textContent = name ? name : '';

      return title;
    }

    function createDescription(data, idDescription) {
      const { description } = data;

      const descriptionElement = document.createElement('p');
      descriptionElement.classList.add(CARD_CLASSES.DESCRIPTION);
      descriptionElement.classList.add(MODAL_CLASSES.DESCRIPTION);
      descriptionElement.id = `${idDescription}`;
      descriptionElement.textContent = description ? description : '';

      return descriptionElement;
    }

    function createPrice(data, idPrice) {
      const { price } = data;
  
      const priceElement = document.createElement('p');
      priceElement.classList.add(CARD_CLASSES.PRICE);
      priceElement.classList.add(MODAL_CLASSES.PRICE);
      priceElement.id = `${idPrice}`;
  
      const priceHint = document.createElement('span');
      priceHint.classList.add(CARD_CLASSES.VISUALLY_HIDDEN);
      priceHint.textContent = PRICE_HINT_TEXT;
  
      const priceNumber = document.createElement('span');
      priceNumber.textContent = `${PRICE_CURRENCY}${(price) ? price: ''}`;

      refs.priceNumber = priceNumber;
  
      priceElement.appendChild(priceHint);
      priceElement.appendChild(priceNumber);
  
      return priceElement;
    }

    function createClose() {
      const close = document.createElement('button');
      close.classList.add(MODAL_CLASSES.CLOSE);
      close.type = 'button';

      const textClose = document.createElement('span');
      textClose.classList.add(MODAL_CLASSES.CLOSE_TEXT);
      textClose.textContent = 'Close';

      close.appendChild(textClose);
      close.addEventListener('click', closeModal);

      return close;
    }

    function openModal(data) {
      lastFocused = document.activeElement;
      refs.title.textContent = data.name;
      refs.description.textContent = data.description;
      refs.priceNumber.textContent = `${PRICE_CURRENCY}${data.price}`;
      updatePicture(data);

      refs.dialog.showModal();
      document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    }

    function updatePicture(data) {
      refs.pictureWrapper.replaceChildren(createPicture(data));
    }

    function closeModal() {
      refs.dialog.close();
    }

    function onClose() {
      document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      lastFocused?.focus();
    }

    function generateId(name) {
      return `modal-${name}`;
    }

    function generateImageBasePath(data) {
      const { id } = data;
      return `${IMAGE_BASE_PATH}/${id}`;
    }

    create({});

    return { open: openModal, close: closeModal };
}

export const modal = createModal();