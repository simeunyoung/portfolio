// Theme toggle
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
if (themeIcon) themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
if (themeBtn) themeBtn.addEventListener('click', () => {
  const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', n);
  localStorage.setItem('theme', n);
  if (themeIcon) themeIcon.className = n === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Sidebar & mobile behaviour
const sb = document.getElementById('sidebar');
const mainEl = document.getElementById('main');
const overlay = document.getElementById('sbOverlay');
const sbToggle = document.getElementById('sbToggle');
const mob = () => window.innerWidth <= 768;
let mobileOpen = false;

function applyMobile(){
  if(!mob()) return;
  sb.classList.toggle('mobile-on', mobileOpen);
  sb.classList.toggle('closed', !mobileOpen);
  overlay.classList.toggle('on', mobileOpen);
}

if (sbToggle) sbToggle.addEventListener('click', () => { if (mob()) { mobileOpen = !mobileOpen; applyMobile(); } });
if (overlay) overlay.addEventListener('click', () => { mobileOpen = false; applyMobile(); });

document.querySelectorAll('.nav-item').forEach(i => i.addEventListener('click', () => { if (mob()) { mobileOpen = false; applyMobile(); } }));

window.addEventListener('resize', () => {
  if (!mob()){
    sb.classList.remove('mobile-on','closed');
    overlay.classList.remove('on');
    if (mainEl) mainEl.style.marginLeft = 'var(--sw)';
  } else {
    if (mainEl) mainEl.style.marginLeft = '0';
    applyMobile();
  }
}, {passive:true});

if (mob()){
  if (mainEl) mainEl.style.marginLeft = '0';
  if (sb) sb.classList.add('closed');
}

// Nav group open/close: click to toggle group (close others)
document.querySelectorAll('.nav-grp').forEach(grp => {
  const hdr = grp.querySelector('.nav-grp-hdr');
  if (!hdr) return;
  hdr.addEventListener('click', () => {
    const isOpen = grp.classList.contains('open');
    // close all
    document.querySelectorAll('.nav-grp.open').forEach(g => g.classList.remove('open'));
    if (!isOpen) grp.classList.add('open');
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, {passive:true});
  scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// Progress bar
const pb = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  if(!pb) return;
  const s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
  pb.style.transform = `scaleX(${h>0?s/h:0})`;
}, {passive:true});

// Fade-in observer
const fobs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); fobs.unobserve(e.target); } });
}, {threshold: 0.08});
document.querySelectorAll('.fi').forEach(el => fobs.observe(el));

// Active nav based on sections
const nitems = document.querySelectorAll('.nav-item');
const allTargets = document.querySelectorAll('section[id]');
const nobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      const id = e.target.id;
      nitems.forEach(i => {
        i.classList.remove('active');
        if (i.getAttribute('href') === '#'+id) i.classList.add('active');
      });
    }
  });
}, {rootMargin: '-35% 0px -55% 0px'});
allTargets.forEach(s => nobs.observe(s));
