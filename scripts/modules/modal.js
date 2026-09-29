import { CARD_CLASSES } from './card.js';
import { createPicture } from './picture.js';
import { formatPrice, calcTotalPrice } from './utils.js';

const MODAL_CLASSES = {
  MODAL: 'modal',
  CARD: 'modal-card',
  CLOSE: 'modal__close',
  CLOSE_TEXT: 'modal__close-text',
  TITLE: 'modal__title',
  DESCRIPTION: 'modal__description',
  GROUPS: 'modal__groups',
  GROUP: 'modal__group',
  GROUP_TITLE: 'modal__group-title',
  OPTIONS: 'modal__options',
  OPTION: 'option',
  OPTION_INPUT: 'option__input',
  OPTION_MARK: 'option__mark',
  OPTION_TEXT: 'option__text',
  HINT: 'modal__hint',
  HINT_ICON: 'modal__hint-icon',
  PRICE: 'modal__price',
  TOTAL: 'modal__total',
  TOTAL_LABEL: 'modal__total-label',
  TOTAL_VALUE: 'modal__total-value',
}

const SCROLL_LOCK_CLASS = 'page--locked';
const MODAL_TITLE_ID = 'modal-title';

const SIZES_TITLE = 'Size';
const ADDITIVES_TITLE = 'Additives';

const TOTAL_LABEL_TEXT = 'Total:';
const HINT_TEXT = 'The total price depends on the selected size and additives. After adding the item, you can review it in My order.';


function createModal() {
  const refs = { 
    dialog: null, title: null, description: null, 
    groups: null,
    totalValue: null,
    pictureWrapper: null 
  };
  let current = null;
  let lastFocused = null;

  function create(data) {
    const dialog = document.createElement('dialog');
    dialog.classList.add(MODAL_CLASSES.MODAL);
    dialog.setAttribute('aria-labelledby', MODAL_TITLE_ID);

    const cardElement = document.createElement('article');
    cardElement.classList.add(CARD_CLASSES.CARD, MODAL_CLASSES.CARD);

    refs.pictureWrapper = document.createElement('div');
    refs.pictureWrapper.classList.add(CARD_CLASSES.PICTURE_WRAPPER);
  
    cardElement.appendChild(refs.pictureWrapper);
    cardElement.appendChild(createContent(data));
    dialog.appendChild(cardElement);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeModal();
    });
    dialog.addEventListener('close', onClose);

    refs.dialog = dialog;
    document.body.appendChild(dialog);
  } 

  function createContent() {

    const content = document.createElement('div');
    content.classList.add(CARD_CLASSES.CONTENT);

    refs.title = document.createElement('h2');
    refs.title.classList.add(CARD_CLASSES.TITLE, MODAL_CLASSES.TITLE);
    refs.title.id = MODAL_TITLE_ID;

    refs.description = document.createElement('p');
    refs.description.classList.add(CARD_CLASSES.DESCRIPTION, MODAL_CLASSES.DESCRIPTION);

    refs.groups = document.createElement('div');
    refs.groups.classList.add(MODAL_CLASSES.GROUPS);
    refs.groups.addEventListener('change', updateTotal);

    content.append(
      refs.title,
      refs.description,
      refs.groups,
      createTotal(),
      createHint(),
      createClose(),
    );

    return content;
  }

  function createTotal() {
    const total = document.createElement('p');
    total.classList.add(MODAL_CLASSES.TOTAL);

    const label = document.createElement('span');
    label.classList.add(MODAL_CLASSES.TOTAL_LABEL);
    label.textContent = TOTAL_LABEL_TEXT;

    refs.totalValue = document.createElement('output');
    refs.totalValue.classList.add(MODAL_CLASSES.TOTAL_VALUE);

    total.append(label, refs.totalValue);
    return total;
  }

  function createHint() {
    // TODO: add svg
    const hint = document.createElement('p');
    hint.classList.add(MODAL_CLASSES.HINT);
    hint.textContent = HINT_TEXT;
    return hint;
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

  function createOption({type, name, value, mark, text, checked = false}) {
    const label = document.createElement('label');
    label.classList.add(MODAL_CLASSES.OPTION);

    const input = document.createElement('input');
    input.classList.add(MODAL_CLASSES.OPTION_INPUT, CARD_CLASSES.VISUALLY_HIDDEN);
    Object.assign(input, { type, name, value, checked });

    const markElement = document.createElement('span');
    markElement.classList.add(MODAL_CLASSES.OPTION_MARK);
    markElement.setAttribute('aria-hidden', 'true');
    markElement.textContent = mark;

    const textElement = document.createElement('span');
    textElement.classList.add(MODAL_CLASSES.OPTION_TEXT);
    textElement.textContent = text;

    label.appendChild(input);
    label.appendChild(markElement);
    label.appendChild(textElement);

    return label;
  }

  function createGroup(title, options) {
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add(MODAL_CLASSES.GROUP);

    const legend = document.createElement('legend');
    legend.classList.add(MODAL_CLASSES.GROUP_TITLE);
    legend.textContent = title;

    const wrap = document.createElement('div');
    wrap.classList.add(MODAL_CLASSES.OPTIONS);
    wrap.append(...options);
  
    fieldset.append(legend, wrap);
    return fieldset;
  }

  function renderGroups(data) {
    const sizes = Object.entries(data.sizes).map(([key, s], i) =>
      createOption({
        type: 'radio', name: 'size', value: key,
        mark: key.toUpperCase(), text: s.size, checked: i === 0,
      }));

    const additives = data.additives.map((a, i) =>
      createOption({
        type: 'checkbox', name: 'additive', value: String(i),
        mark: String(i + 1), text: a.name,
      }));

    refs.groups.replaceChildren(
      createGroup(SIZES_TITLE, sizes),
      createGroup(ADDITIVES_TITLE, additives),
    );
  }

  function updateTotal() {
    const size = refs.groups.querySelector('input[name="size"]:checked').value;
    const selected = new Set(
      [...refs.groups.querySelectorAll('input[name="additive"]:checked')]
        .map((input) => Number(input.value))
    );
    refs.totalValue.textContent = formatPrice(calcTotalPrice(current, size, selected));
  }

  function openModal(data) {
    if (!refs.dialog) create();
    current = data;
    lastFocused = document.activeElement;

    refs.title.textContent = data.name;
    refs.description.textContent = data.description;
    refs.pictureWrapper.replaceChildren(createPicture(data));
    renderGroups(data);
    updateTotal();

    refs.dialog.showModal();
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
  }

  function closeModal() {
    refs.dialog?.close();
  }

  function onClose() {
    document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
    lastFocused?.focus();
  }

  return { open: openModal, close: closeModal };
}

export const modal = createModal();