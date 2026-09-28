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