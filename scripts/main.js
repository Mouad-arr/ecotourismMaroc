// Basic site interactions: mobile menu, slider pause, active nav, back-to-top
(function(){
  function qs(sel, el=document){ return el.querySelector(sel) }
  function qsa(sel, el=document){ return Array.from(el.querySelectorAll(sel)) }

  // Mobile navigation toggle
  function initMobileNav(){
    const toggle = qs('.nav-toggle');
    const header = qs('header');
    if(!toggle || !header) return;
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('nav-open');
    });
    // close on escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && header.classList.contains('nav-open')){
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // Pause slider CSS animation on hover
  function initSliderPause(){
    const slider = qs('.slider');
    const slide = qs('.slide');
    if(!slider || !slide) return;
    slider.addEventListener('mouseenter', ()=> slide.classList.add('paused'));
    slider.addEventListener('mouseleave', ()=> slide.classList.remove('paused'));
  }

  // Auto add active class to nav link where href matches page name
  function markActiveNav(){
    const path = location.pathname.split('/').pop() || 'accueil.html';
    qsa('nav.main-nav a').forEach(a=>{
      const href = a.getAttribute('href');
      if(!href) return;
      // consider simple matching rules
      if(path === href || (href.endsWith('accueil.html') && path === '')){
        a.classList.add('active');
      }
    })
  }

  // Back to top button
  function createBackToTop(){
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.title = 'Remonter en haut';
    btn.innerText = '↑';
    btn.setAttribute('aria-label','Retour en haut');
    btn.style.display = 'none';
    document.body.appendChild(btn);

    btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 200) btn.style.display = 'block';
      else btn.style.display = 'none';
    })
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initMobileNav();
    initSliderPause();
    markActiveNav();
    createBackToTop();
  });
})();
