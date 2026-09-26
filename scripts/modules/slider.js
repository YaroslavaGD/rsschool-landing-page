function createSlider() {
  const sliderElement = document.querySelector('.slider');
  if (!sliderElement) {
    return {
      init() {}
    }
  }

  const prevButton = sliderElement.querySelector('.slider-nav__button--left');
  const nextButton = sliderElement.querySelector('.slider-nav__button--right');
  const dotsContainer = sliderElement.querySelector('.slider-dots');
  const dots = [...sliderElement.querySelectorAll('.slider-dot')];
  const track = sliderElement.querySelector('.slider-track');
  const trackWrapper = sliderElement.querySelector('.slider-track-wrapper');

  const slidesCount = dots.length;
  let currentSlideNumber = 0;

  function getSlideWidth() {
    return trackWrapper.getBoundingClientRect().width;
  }

  function goToSlide(index) {
    currentSlideNumber = (index + slidesCount) % slidesCount;

    track.style.transform = `translateX(${-(currentSlideNumber) * getSlideWidth()}px)`;
    track.style.transition = `transform  0.6s cubic-bezier(.65, 0, .35, 1)`;

    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      const isActive = index === currentSlideNumber;
      dot.setAttribute('aria-current', String(isActive));
    });
  }

  function handlePrevClick() {
    goToSlide(currentSlideNumber - 1);
  }

  function handleNextClick() { 
    goToSlide(currentSlideNumber + 1);
  }

  function handleDotClick(e) {
    const dot = e.target.closest('.slider-dot');
    if (!dot) return;

    goToSlide(Number(dot.dataset.slide));
  }

  function init() {
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    dotsContainer.addEventListener('click', handleDotClick);

    updateDots();
  }

  return {
    init
  };
}

export const slider = createSlider();