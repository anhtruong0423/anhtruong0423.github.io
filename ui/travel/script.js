// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const interactiveElements = document.querySelectorAll('a, button, .dest-card, .editorial-item');

const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

if (!isTouchDevice()) {
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  });

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });

  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      cursor.style.display = 'none';
    }
  });

  document.addEventListener('mouseover', () => {
    cursor.style.display = 'block';
  });
} else {
  cursor.style.display = 'none';
}

// ----------------------------------------------------
// Horizontal Scroll Dragging & Parallax Effect
const scrollContainer = document.querySelector('.horizontal-scroll');
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  scrollContainer.style.scrollSnapType = 'none';
  scrollContainer.classList.add('active');
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener('mouseleave', () => {
  isDown = false;
  scrollContainer.style.scrollSnapType = 'x mandatory';
  scrollContainer.classList.remove('active');
});

scrollContainer.addEventListener('mouseup', () => {
  isDown = false;
  scrollContainer.style.scrollSnapType = 'x mandatory';
  scrollContainer.classList.remove('active');
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

// Horizontal Parallax for Images
const destCards = document.querySelectorAll('.dest-card');
scrollContainer.addEventListener('scroll', () => {
  if (isTouchDevice()) return; // Disable parallax on heavy touch devices optionally
  destCards.forEach(card => {
    const cardLeft = card.getBoundingClientRect().left;
    const scrollCenter = window.innerWidth / 2;
    const distFromCenter = cardLeft + card.offsetWidth/2 - scrollCenter;
    
    const img = card.querySelector('img');
    const moveX = distFromCenter * -0.15;
    // apply gentle parallax using transform
    img.style.transform = `translateX(${moveX}px) scale(1.05)`;
  });
});


// ----------------------------------------------------
// Staggered Text Reveal Animation
const revealText = document.querySelector('.reveal-text');
if(revealText) {
  const htmlContent = revealText.innerHTML;
  const lines = htmlContent.split('<br>');
  revealText.innerHTML = '';
  
  lines.forEach((line, index) => {
    const lineWrapper = document.createElement('div');
    lineWrapper.style.overflow = 'hidden';
    lineWrapper.style.display = 'block';
    
    const words = line.split(' ');
    words.forEach((word, wordIdx) => {
      if(word.trim() === '') return;
      const span = document.createElement('span');
      span.className = 'word';
      span.innerHTML = word + (wordIdx < words.length - 1 ? '&nbsp;' : '');
      // Calculate stagger: line wait + word wait
      span.style.transitionDelay = `${(index * 0.15) + (wordIdx * 0.08)}s`;
      lineWrapper.appendChild(span);
    });
    
    revealText.appendChild(lineWrapper);
  });
  
  setTimeout(() => {
    revealText.classList.add('active');
  }, 200);
}

// ----------------------------------------------------
// Magnetic Button Hover Effect
const magneticButtons = document.querySelectorAll('.magnetic--item');
magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const position = btn.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;
    
    // Smooth pull towards the cursor
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
    
    const span = btn.querySelector('span');
    if(span) {
      span.style.transform = `translate(${x * 0.1}px, ${y * 0.15}px)`;
      span.style.display = 'inline-block';
      span.style.transition = 'none';
    }
  });
  
  btn.addEventListener('mouseleave', function(e) {
    btn.style.transform = 'translate(0px, 0px)';
    const span = btn.querySelector('span');
    if(span) {
      span.style.transform = 'translate(0px, 0px)';
      span.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
  });
});

// ----------------------------------------------------
// Simple fade-in animation using IntersectionObserver
const fadeElements = document.querySelectorAll('.section-title, .section-desc, .text-block');

const appearOptions = {
  threshold: 0,
  rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    entry.target.style.opacity = 1;
    entry.target.style.transform = "translateY(0)";
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);

fadeElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
  appearOnScroll.observe(el);
});

// Scroll to explore
document.getElementById('exploreBtn').addEventListener('click', () => {
  document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
});
