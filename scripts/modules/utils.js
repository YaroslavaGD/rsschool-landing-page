export const withCategoryIndex = function(cardsData) {
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