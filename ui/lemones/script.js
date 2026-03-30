/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 2200);
});

/* ===== NAV ===== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => navMenu.classList.remove('show-menu')));

/* ===== SCROLL HEADER ===== */
window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scroll-header', scrollY >= 50);
    document.getElementById('scroll-up').classList.toggle('show-scroll', scrollY >= 350);
});

/* ===== ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    sections.forEach(s => {
        const link = document.querySelector(`.nav__link[href*="${s.id}"]`);
        if (link) {
            const inView = scrollY > s.offsetTop - 100 && scrollY <= s.offsetTop + s.offsetHeight;
            link.classList.toggle('active-link', inView);
        }
    });
});

/* ===== PRODUCT FILTER ===== */
document.querySelectorAll('.fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.pcard').forEach(card => {
            const show = f === 'all' || card.dataset.category === f;
            card.style.display = show ? '' : 'none';
            if (show) card.style.animation = 'fadeUp .5s ease forwards';
        });
    });
});

/* ===== WISHLIST ===== */
document.querySelectorAll('.pcard__heart').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        btn.querySelector('i').className = btn.classList.contains('active') ? 'bx bxs-heart' : 'bx bx-heart';
    });
});

/* ===== ADD TO CART ===== */
let cartN = 0;
const cartEl = document.getElementById('cart-count');
document.querySelectorAll('.pcard__add').forEach(btn => {
    btn.addEventListener('click', () => {
        cartN++;
        cartEl.textContent = cartN;
        cartEl.style.transform = 'scale(1.6)';
        setTimeout(() => cartEl.style.transform = 'scale(1)', 250);
        
        const card = btn.closest('.pcard');
        card.style.boxShadow = '0 12px 40px rgba(250,204,21,.5)';
        btn.innerHTML = '<i class="bx bx-check"></i> Đã thêm!';
        setTimeout(() => {
            card.style.boxShadow = '';
            btn.innerHTML = '<i class="bx bx-cart-add"></i> Thêm giỏ';
        }, 1200);
    });
});

/* ===== COUNTDOWN ===== */
let total = 23*3600 + 59*60 + 45;
setInterval(() => {
    if (total <= 0) return;
    total--;
    document.getElementById('t-h').textContent = String(Math.floor(total/3600)).padStart(2,'0');
    document.getElementById('t-m').textContent = String(Math.floor((total%3600)/60)).padStart(2,'0');
    document.getElementById('t-s').textContent = String(total%60).padStart(2,'0');
}, 1000);

/* ===== SCROLL REVEAL ===== */
const sr = ScrollReveal({ distance:'50px', duration:1500, delay:200 });

sr.reveal('.hero__tag', { origin:'top' });
sr.reveal('.hero__title', { origin:'left', delay:300 });
sr.reveal('.hero__desc', { origin:'left', delay:400 });
sr.reveal('.hero__cta', { origin:'bottom', delay:500 });
sr.reveal('.hero__lemon-big', { origin:'right', delay:400, distance:'80px' });
sr.reveal('.hero__mini', { interval:200, origin:'right' });

sr.reveal('.bento__card', { interval:200, origin:'bottom' });
sr.reveal('.pcard', { interval:150, origin:'bottom' });
sr.reveal('.flash__left > *', { interval:150, origin:'left' });
sr.reveal('.about__media', { origin:'left' });
sr.reveal('.about__text > *', { interval:150, origin:'right' });
sr.reveal('.gallery__item', { interval:100, origin:'bottom' });
sr.reveal('.nl__box', { origin:'bottom' });
sr.reveal('.ft__col', { interval:150, origin:'bottom' });

/* Keyframe injection */
const s = document.createElement('style');
s.textContent = `@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(s);
