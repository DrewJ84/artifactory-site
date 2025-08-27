(function () {
  const mq = window.matchMedia('(max-width: 768px)');

  // paima būtent iš inline style="", jei nėra — grįžta į computed
  function getBg(el){
    const grab = s => {
      const m = s && s !== 'none' ? s.match(/url\(["']?(.+?)["']?\)/) : null;
      return m ? m[1] : '';
    };
    return grab(el.style.backgroundImage) || grab(getComputedStyle(el).backgroundImage);
  }

  function guessMobile(path){
    return path ? path.replace(/(\.[a-z0-9]+)(\?.*)?$/i, '-mobile$1$2') : '';
  }

  function preload(url){
    return new Promise((ok, bad) => {
      if (!url) return bad('empty');
      const i = new Image();
      i.onload = () => ok(url);
      i.onerror = bad;
      i.src = url;
    });
  }

  function targetFor(el){
    const desktop = el.dataset.bgDesktop || getBg(el);
    const mobile  = el.dataset.bgMobile  || guessMobile(desktop);
    const want    = mq.matches ? (mobile || desktop) : desktop;
    return { desktop, want };
  }

  function swap(el){
    const { desktop, want } = targetFor(el);
    const current = getBg(el);
    if (!want || current === want) return;               // nieko nekeičiam

    // PRELOAD — jokių „juodų ekranų“
    preload(want)
      .then(() => {
        el.style.backgroundImage = `url("${want}")`;     // nekeičiam kitų inline stilių
      })
      .catch(() => {                                     // jei mobile 404 — grįžtam į desktop
        if (desktop && current !== desktop) {
          el.style.backgroundImage = `url("${desktop}")`;
        }
      });
  }

  function applyAll(){ document.querySelectorAll('.slide-inner--image').forEach(swap); }

  (document.readyState === 'loading') ? 
    document.addEventListener('DOMContentLoaded', applyAll) : applyAll();

  mq.addEventListener ? mq.addEventListener('change', applyAll) : mq.addListener(applyAll);
  window.addEventListener('orientationchange', applyAll);
  window.addEventListener('resize', (function (fn, ms){ let t; return ()=>{ clearTimeout(t); t=setTimeout(fn, ms); };})(applyAll, 120));
})();