export const withId = function(cardsData) {
  const counters = {};

  return cardsData.map((item) => {
    const { category } = item;
    counters[category] = (counters[category] || 0) + 1;

    return {
      ...item,
      id: `${item.category}-${counters[item.category]}`, // starts from 1
    };
  });
};

export const getItemId = ({ category, categoryIndex }) => `${category}-${categoryIndex}`;

export const getUniqueCategories = function(cardsData) {
  return [...new Set(cardsData.map((item) => item.category))];
}

export const getCategoryItems = function(cardsData, category) {
  return cardsData.filter((item) => item.category === category );
}

const toCents = (value) => Math.round(parseFloat(value) * 100);

export const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

export function calcTotalPrice(cardData, sizeKey, selectedAdditives) {
  const {price, sizes, additives} = cardData;

  const base = toCents(price);
  const size = toCents(sizes[sizeKey]['add-price']);
  const extra = additives
    .filter((additive) => selectedAdditives.has(additive.name))
    .reduce((sum, additive) => sum + toCents(additive['add-price']), 0);
  
  return base + size + extra;
}