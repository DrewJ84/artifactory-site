// Background image reveal, header always pinned
const slides = document.querySelectorAll('.slide');
const bg = document.querySelector('.background');
const slideContents = document.querySelectorAll('.slide-content');

function updateBg() {
  let activeIdx = 0;
  slides.forEach((slide, idx) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.5) activeIdx = idx;
  });
  const bgUrl = slides[activeIdx].dataset.bg;
  bg.style.backgroundImage = `url(${bgUrl})`;
  // Fade-in/out for content
  slides.forEach((slide, idx) => {
    const content = slideContents[idx];
    const rect = slide.getBoundingClientRect();
    // fade out when leaving center
    let opacity = 1 - Math.abs(rect.top + rect.height/2 - window.innerHeight/2) / (window.innerHeight/1.2);
    opacity = Math.max(0, Math.min(1, opacity));
    content.style.opacity = opacity;
    content.style.transform = `translateY(${(1-opacity)*80}px)`;
  });
}

window.addEventListener('scroll', updateBg);
window.addEventListener('resize', updateBg);
window.addEventListener('DOMContentLoaded', updateBg);
