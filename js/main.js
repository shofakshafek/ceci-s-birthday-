/* ==================================================
   MAIN — loader, nav, reveal, lightbox, player
================================================== */

// ---------- LOADER ----------
const loader = document.getElementById('loader');
const loadBar = document.getElementById('loadBar');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    loadBar.style.width = '100%';
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 400);
  } else {
    loadBar.style.width = progress + '%';
  }
}, 180);
document.body.style.overflow = 'hidden';

// ---------- CURSOR ----------
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

function animateCursor() {
  cx += (mx - cx) * 0.18;
  cy += (my - cy) * 0.18;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// cursor hover effect on interactive
document.querySelectorAll('a, button, .g-item, .doa-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ---------- SCROLL REVEAL ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- SMOOTH SCROLL FOR NAV ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.getElementById('scrollBtn').addEventListener('click', () => {
  document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
});

// ---------- AGE COUNTER (auto increment) ----------
(function autoAge() {
  const el = document.getElementById('ageText');
  const birthDate = new Date('2011-10-10');
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;
  el.textContent = age + ' tahun';
})();

// ---------- MUSIC PLAYER ----------
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const player = document.getElementById('player');

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => {
      player.classList.add('playing');
    }).catch(() => {
      alert('Taruh file "lagu.mp3" di folder yang sama ya 🎵');
    });
  } else {
    audio.pause();
    player.classList.remove('playing');
  }
});

// autoplay on first click anywhere
let firstClick = true;
document.addEventListener('click', () => {
  if (firstClick && audio.paused) {
    audio.volume = 0.6;
    audio.play().then(() => {
      player.classList.add('playing');
    }).catch(()=>{});
  }
  firstClick = false;
}, { once: false });

// ---------- LIGHTBOX ----------
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const gItems = Array.from(document.querySelectorAll('.g-item img'));
let lbIndex = 0;

gItems.forEach((img, i) => {
  img.addEventListener('click', () => {
    lbIndex = i;
    lbImg.src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLB() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function showLB(dir) {
  lbIndex = (lbIndex + dir + gItems.length) % gItems.length;
  lbImg.src = gItems[lbIndex].src;
}
lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', () => showLB(-1));
lbNext.addEventListener('click', () => showLB(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') showLB(-1);
  if (e.key === 'ArrowRight') showLB(1);
});