const slides = document.querySelectorAll('.slide');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
let current = 0;

function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
}
next.onclick = () => {
  current = (current + 1) % slides.length;
  showSlide(current);
};
prev.onclick = () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
};
showSlide(current);
