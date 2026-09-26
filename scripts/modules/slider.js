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
  const SWIPE_END_PERCENT = 0.2;

  let currentSlideNumber = 0;

  let isDragging = false;
  let startX = 0;
  let currentDeltaPercent = 0;

  function setTrackPosition(isTransition, additionalPercent = 0) {
    track.style.transition = isTransition ? `transform  0.6s cubic-bezier(.65, 0, .35, 1)` : 'none';
    track.style.transform = `translateX(${-(currentSlideNumber) * 100 + additionalPercent}%)`;
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

  function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentDeltaPercent = 0;
  }

  function handleTouchMove(e) {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const deltaPx = currentX - startX;
    const wrappedWidth = trackWrapper.getBoundingClientRect().width;

    currentDeltaPercent = (deltaPx / wrappedWidth) * 100;

    setTrackPosition(false, currentDeltaPercent);
    updateDots();
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    const deltaRatio = currentDeltaPercent / 100;

    if (deltaRatio <= -SWIPE_END_PERCENT) {
      goToSlide(currentSlideNumber + 1);
    } else if (deltaRatio >= SWIPE_END_PERCENT) {
      goToSlide(currentSlideNumber - 1);
    } else {
      setTrackPosition(true);
    }

    currentDeltaPercent = 0;
  }

  function init() {
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    dotsContainer.addEventListener('click', handleDotClick);

    trackWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
    trackWrapper.addEventListener('touchmove', handleTouchMove, { passive: true });
    trackWrapper.addEventListener('touchend', handleTouchEnd);
    trackWrapper.addEventListener('touchcancel', handleTouchEnd);

    updateDots();
    setTrackPosition(false);
  }

  return {
    init
  };
}

export const slider = createSlider();