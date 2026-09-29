import { CARD_CLASSES } from "./card.js";

const IMAGE_BASE_PATH = 'assets/img/menu';
const IMAGE_FORMATS = ['webp', 'jpg'];
const IMAGE_MIME_TYPES = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
};
const IMAGE_SMALL_SUFFIX = '340';
export const createPictureWrapper = function (data) {
  const pictureWrapper = document.createElement('div');
  pictureWrapper.classList.add(CARD_CLASSES.PICTURE_WRAPPER);

  const picture = createPicture(data);
  pictureWrapper.appendChild(picture);

  return pictureWrapper;
}

export const createPicture = function (data) {
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

function generateImageBasePath(data) {
  const { id } = data;
  return `${IMAGE_BASE_PATH}/${id}`;
}