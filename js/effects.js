/* ==================================================
   EFFECTS — confetti, balloons, sparkles
================================================== */

// ---------- CONFETTI CANVAS ----------
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const CONFETTI_COLORS = ['#ff7eb6','#ffb8d4','#fceee4','#d4a574','#ffd1e6','#ff4d8d'];
const confettis = [];
const CONFETTI_COUNT = 80;

class Confetti {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : -20;
    this.size = 6 + Math.random() * 8;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.vy = 0.8 + Math.random() * 1.8;
    this.vx = -0.5 + Math.random() * 1;
    this.rot = Math.random() * Math.PI * 2;
    this.vr = (-0.05 + Math.random() * 0.1);
    this.shape = Math.random() > 0.7 ? 'circle' : 'rect';
    this.wobble = Math.random() * Math.PI * 2;
  }
  update() {
    this.wobble += 0.05;
    this.y += this.vy;
    this.x += this.vx + Math.sin(this.wobble) * 0.5;
    this.rot += this.vr;
    if (this.y > H + 20) this.reset();
    if (this.x < -20) this.x = W + 20;
    if (this.x > W + 20) this.x = -20;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    }
    ctx.restore();
  }
}

for (let i = 0; i < CONFETTI_COUNT; i++) confettis.push(new Confetti());

function animateConfetti() {
  ctx.clearRect(0, 0, W, H);
  confettis.forEach(c => { c.update(); c.draw(); });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ---------- BALLOONS ----------
const BALLOON_COLORS = ['#ff7eb6', '#ffb8d4', '#d4a574', '#fceee4', '#c4459c'];

function spawnBalloon() {
  const b = document.createElement('div');
  b.className = 'balloon';
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  b.style.background = `radial-gradient(circle at 30% 30%, #fff8, ${color})`;
  b.style.color = color;
  b.style.left = (5 + Math.random() * 90) + 'vw';
  b.style.bottom = '-100px';
  b.style.width = (38 + Math.random() * 30) + 'px';
  b.style.height = (50 + Math.random() * 36) + 'px';
  const duration = 10 + Math.random() * 8;
  b.style.animationDuration = duration + 's';
  document.body.appendChild(b);
  setTimeout(() => b.remove(), duration * 1000 + 500);
}

// spawn awal
for (let i = 0; i < 6; i++) {
  setTimeout(spawnBalloon, i * 900);
}
// spawn terus tiap 3-5 detik
setInterval(() => {
  if (document.hidden) return;
  spawnBalloon();
}, 3500);

// ---------- CURSOR SPARKLES ----------
let lastSparkle = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSparkle < 60) return;
  lastSparkle = now;
  if (window.innerWidth < 768) return;

  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = e.clientX + 'px';
  s.style.top = e.clientY + 'px';
  s.style.transform = 'translate(-50%,-50%)';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// ---------- 3D TILT on hero cake (subtle) ----------
const cake = document.querySelector('.cake-3d');
if (cake && window.innerWidth > 900) {
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const rect = cake.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / 30;
    const dy = (e.clientY - cy) / 30;
    cake.style.transform = `translateY(0) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  document.querySelector('.hero').addEventListener('mouseleave', () => {
    cake.style.transform = '';
  });
}

// ---------- Prevent dragging images ----------
document.querySelectorAll('img').forEach(img => {
  img.setAttribute('draggable', 'false');
});