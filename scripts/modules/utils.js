export const withCategoryIndex = function(cardsData) {
  const counters = {};

  return cardsData.map((item) => {
    const { category } = item;
    counters[category] = (counters[category] || 0) + 1;

    return {
      ...item,
      categoryIndex: counters[category], // starts from 1
    };
  });
};