// Sklandus fade-in/fade-out, kai scrollini (kaip Framer/royaltemplate)
// Fade out einančios sekcijos, fade in naujos

const sections = document.querySelectorAll('.cover-section');
const windowH = window.innerHeight;

window.addEventListener('scroll', () => {
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const content = section.querySelector('.cover-content');
    // Kuo toliau nuo centro, tuo labiau išblukęs
    let opacity = 1 - Math.abs(rect.top + rect.height/2 - windowH/2) / (windowH/1.1);
    opacity = Math.max(0, Math.min(1, opacity));
    content.style.opacity = opacity;
    content.style.transform = `translateY(${(1-opacity)*60}px)`;
  });
});
