window.addEventListener("DOMContentLoaded", () => {
  // ====== Palette mode ======
  const themeToggle = document.getElementById("theme-toggle");
  const paletteMap = [
    ["--bg-dark-1", "--bg-light-1"],
    ["--bg-dark-2", "--bg-light-2"],
    ["--bg-dark-3", "--bg-light-3"],
    ["--text-dark", "--text-light"],
    ["--text-dark-2", "--text-light-2"],
    ["--text-dark-muted", "--text-light-muted"]
  ];
  let darkDefaults = {};

  function saveDarkDefaults() {
    paletteMap.forEach(([darkVar]) => {
      darkDefaults[darkVar] = getComputedStyle(document.documentElement).getPropertyValue(darkVar);
    });
  }
  function applyMode(isDark) {
    paletteMap.forEach(([darkVar, lightVar]) => {
      const value = isDark ? darkDefaults[darkVar]
                           : getComputedStyle(document.documentElement).getPropertyValue(lightVar);
      document.documentElement.style.setProperty(darkVar, value);
    });
  }

  saveDarkDefaults();
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  themeToggle.checked = systemPrefersDark;
  applyMode(systemPrefersDark);

  themeToggle.addEventListener("change", () => {
    applyMode(themeToggle.checked);
  });





(function(){
  const rail   = document.getElementById('custom-scrollbar');
  const thumb  = document.getElementById('custom-thumb');

  if(!rail || !thumb) return;

  function updateThumb(){
    const doc   = document.documentElement;
    const body  = document.body;

    const scrollH   = Math.max(
      body.scrollHeight, body.offsetHeight,
      doc.clientHeight, doc.scrollHeight, doc.offsetHeight
    );
    const viewH     = window.innerHeight;
    const trackH    = rail.getBoundingClientRect().height;

    // taille du thumb proportionnelle
    const ratio     = Math.min(1, viewH / scrollH);
    const thumbH    = Math.max(32, Math.round(trackH * ratio)); // min 32px pour rester visible

    // position du thumb
    const maxScroll = scrollH - viewH;
    const y         = (maxScroll > 0)
      ? ((window.scrollY / maxScroll) * (trackH - thumbH))
      : 0;

    thumb.style.height = thumbH + 'px';
    thumb.style.transform = `translateY(${y}px)`;
  }

  // maj au scroll / resize / load
  window.addEventListener('scroll',  updateThumb, {passive:true});
  window.addEventListener('resize',  updateThumb);
  window.addEventListener('load',    updateThumb);
  updateThumb();
})();



});
(function(){
  const isIOS = () =>
    /iP(hone|od|ad)/.test(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

  function enableFullscreenOnTap(){
    // n’activer que si on est en mobile (<=639px)
    if (!window.matchMedia('(max-width: 639px)').matches) return;

    const wrappers = document.querySelectorAll('.video-wrapper');

    function onFsChange(){
      const fsEl =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      if (!fsEl) {
        wrappers.forEach(w => {
          const c = w.querySelector('.tap-catcher');
          if (c) {
            c.style.pointerEvents = '';
            c.style.display = '';
            w.classList.remove('is-fs');
          }
        });
      }
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('msfullscreenchange', onFsChange);

    wrappers.forEach(wrap => {
      const iframe = wrap.querySelector('.video-iframe');
      if (!iframe) return;

      let catcher = wrap.querySelector('.tap-catcher');
      if (!catcher) {
        catcher = document.createElement('button');
        catcher.type = 'button';
        catcher.className = 'tap-catcher';
        catcher.setAttribute('aria-label', 'Lire en plein écran');
        wrap.appendChild(catcher);
      }

      catcher.addEventListener('click', async () => {
        try {
          if (isIOS()) {
            catcher.style.display = 'none';
            window.open(iframe.src, '_blank');
            return;
          }

          wrap.classList.add('is-fs');
          catcher.style.pointerEvents = 'none';
          catcher.style.display = 'none';

          if (wrap.requestFullscreen) await wrap.requestFullscreen();
          else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
          else if (wrap.msRequestFullscreen) wrap.msRequestFullscreen();

        } catch (e) {
          window.open(iframe.src, '_blank');
        }
      }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableFullscreenOnTap);
  } else {
    enableFullscreenOnTap();
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");

  // toutes les images de tes carousels
  document.querySelectorAll(".main-slider img, .thumb-slider img").forEach(img => {
    img.addEventListener("click", () => {
      lbImg.src = img.src;
      lb.hidden = false;
    });
  });

  // fermer en cliquant n'importe où
  lb.addEventListener("click", () => {
    lb.hidden = true;
    lbImg.src = "";
  });
});


