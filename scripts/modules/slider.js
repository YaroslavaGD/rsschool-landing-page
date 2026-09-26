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

  const slidesCount = dots.length;
  let currentSlideNumber = 0;

  function setTrackPosition(isTransition) {
    track.style.transition = isTransition ? `transform  0.6s cubic-bezier(.65, 0, .35, 1)` : 'none';
    track.style.transform = `translateX(${-(currentSlideNumber) * 100}%)`;
  }

  function goToSlide(index) {
    currentSlideNumber = (index + slidesCount) % slidesCount;
    setTrackPosition(true);
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
    setTrackPosition(false);
  }

  return {
    init
  };
}

export const slider = createSlider();