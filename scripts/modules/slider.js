const MAX_SLIDES = 3;

function createSlider() {
  const sliderElement = document.querySelector('.slider');
  const prevButton = sliderElement.querySelector('.slider-nav__button--left');
  const nextButton = sliderElement.querySelector('.slider-nav__button--right');
  const dots = [...sliderElement.querySelectorAll('.slider-dot')];

  const trackWrapper = sliderElement.querySelector('.slider-track-wrapper');
  const track = sliderElement.querySelector('.slider-track');

  let currentSlideNumber = 0;

  function moveTo(numPx) {
    track.style = `
                   transform: translateX(${numPx}px); 
                   transition: transform  0.6s cubic-bezier(.65, 0, .35, 1);
                  `;
  }

  function handlePrevClick(e) {
    currentSlideNumber--;
    if (currentSlideNumber < 0) {
      currentSlideNumber = MAX_SLIDES - 1;
    }
    moveTo(-(currentSlideNumber)*1052);
  }

  function handleNextClick(e) {
    currentSlideNumber++;
    if (currentSlideNumber >= MAX_SLIDES) currentSlideNumber = 0;
    moveTo(-(currentSlideNumber)*1052);
  }

  function handleDotClick(e) {
    console.log('dot');
  }

  function init() {
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    })
  }

  return {
    init
  };
}

export const slider = createSlider();