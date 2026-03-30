/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ON LINK CLICK ===============*/
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

/*=============== CHANGE BACKGROUND HEADER ON SCROLL ===============*/
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}
window.addEventListener('scroll', scrollHeader);

/*=============== SHOW SCROLL UP ===============*/
function scrollUp() {
    const scrollUpBtn = document.getElementById('scroll-up');
    if (this.scrollY >= 350) {
        scrollUpBtn.classList.add('show-scroll');
    } else {
        scrollUpBtn.classList.remove('show-scroll');
    }
}
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*=============== PRODUCT FILTER TABS ===============*/
const productTabs = document.querySelectorAll('.products__tab');
const productCards = document.querySelectorAll('.product__card');

productTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active from all tabs
        productTabs.forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = '';
                // Add re-appear animation
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/*=============== WISHLIST TOGGLE ===============*/
const wishlistBtns = document.querySelectorAll('.product__wishlist');
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        if (btn.classList.contains('active')) {
            icon.className = 'bx bxs-heart';
        } else {
            icon.className = 'bx bx-heart';
        }
    });
});

/*=============== CART BADGE ANIMATION ===============*/
const addToCartBtns = document.querySelectorAll('.product__btn');
const cartBadge = document.querySelector('.nav__shop-badge');
let cartCount = 2;

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        cartBadge.textContent = cartCount;
        
        // Bounce animation on badge
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartBadge.style.transform = 'scale(1)';
        }, 200);
        
        // Button feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bx bx-check"></i> Đã thêm!';
        btn.style.background = 'linear-gradient(135deg, #7fdbaf, #4ecdc4)';
        btn.style.color = '#fff';
        btn.style.borderColor = '#7fdbaf';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1500);
    });
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    distance: '60px',
    duration: 2000,
    delay: 300,
});

// Hero
sr.reveal('.home__subtitle', { origin: 'top', delay: 200 });
sr.reveal('.home__title', { origin: 'left', delay: 400 });
sr.reveal('.home__description', { origin: 'left', delay: 500 });
sr.reveal('.home__btns', { origin: 'left', delay: 600 });
sr.reveal('.home__stats', { origin: 'bottom', delay: 700 });
sr.reveal('.home__images', { origin: 'right', delay: 500 });

// Categories
sr.reveal('.category__card', { interval: 150, origin: 'bottom' });

// Products
sr.reveal('.products__tabs', { origin: 'top' });
sr.reveal('.product__card', { interval: 150, origin: 'bottom' });

// About
sr.reveal('.about__images', { origin: 'left' });
sr.reveal('.about__data', { origin: 'right' });
sr.reveal('.about__feature', { interval: 150, origin: 'right' });

// Testimonials
sr.reveal('.testimonial__card', { interval: 200, origin: 'bottom' });

// Newsletter
sr.reveal('.newsletter__container', { origin: 'bottom' });

// Footer
sr.reveal('.footer__content', { interval: 150, origin: 'bottom' });

/*=============== ADD FADE-IN-UP KEYFRAME ===============*/
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
