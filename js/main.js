/* ==========================================
   MAIN — Entry Point, Navigation, Scroll Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initOpeningAnimations();
  initSmoothScroll();
  initScrollProgress();
  initVideoLightbox();
  initMusicToggle();
});

/**
 * Navigation — show/hide on scroll, active chapter tracking
 */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const links = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('.section');
  let lastScrollY = 0;
  let ticking = false;

  // Show nav after scrolling past opening
  function updateNav() {
    const scrollY = window.scrollY;
    const openingHeight = document.getElementById('opening')?.offsetHeight || window.innerHeight;

    // Show/hide nav
    if (scrollY > openingHeight * 0.5) {
      nav.classList.add('nav--visible');
    } else {
      nav.classList.remove('nav--visible');
    }

    // Update active chapter
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
}

/**
 * Opening section animations (after countdown)
 */
function initOpeningAnimations() {
  // Wait for countdown to finish
  const checkCountdown = setInterval(() => {
    const overlay = document.getElementById('countdown-overlay');
    if (!overlay || overlay.style.display === 'none' || overlay.classList.contains('countdown-overlay--hidden')) {
      clearInterval(checkCountdown);
      animateOpening();
    }
  }, 200);

  // Fallback: animate after 5 seconds regardless
  setTimeout(() => {
    clearInterval(checkCountdown);
    animateOpening();
  }, 5000);
}

function animateOpening() {
  const elements = document.querySelectorAll('.opening__anim');

  if (typeof gsap !== 'undefined') {
    gsap.to(elements, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    });
  } else {
    // Fallback
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all 0.6s ease';
      }, i * 150);
    });
  }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        const offset = 80; // Nav height
        const targetPosition = targetEl.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * Scroll progress indicator (optional — visual film reel progress)
 */
function initScrollProgress() {
  // Create progress bar
  const progress = document.createElement('div');
  progress.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--coral), var(--sunset), var(--lavender), var(--mint));
    z-index: 10000;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(progress);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress);
  });
}

/**
 * Video Lightbox (Chapter 2)
 */
function initVideoLightbox() {
  const lightbox = document.getElementById('videoLightbox');
  const lightboxIframe = document.getElementById('lightboxIframe');
  const closeBtn = document.getElementById('closeLightbox');
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');

  if (!lightbox || !lightboxIframe) return;

  function openLightbox(videoUrl) {
    if (videoUrl) {
      lightboxIframe.src = videoUrl;
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  }

  function closeLightboxHandler() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // restore scrolling
    
    // Clear iframe src to stop video playing in background 
    // after transition is mostly done
    setTimeout(() => {
      lightboxIframe.src = '';
    }, 400); 
  }

  videoThumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const url = thumb.getAttribute('data-video-url');
      openLightbox(url);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightboxHandler);
  }

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightboxHandler();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightboxHandler();
    }
  });
}

/**
 * Background Music Toggle & Autoplay
 */
function initMusicToggle() {
  const music = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle');
  
  if (!music || !toggleBtn) return;
  
  // Set initial volume
  music.volume = 0.5;

  // Function to update UI to playing state
  const setPlayingState = () => {
    toggleBtn.classList.add('playing');
    toggleBtn.querySelector('.music-icon').textContent = '⏸️';
  };

  // Function to update UI to paused state
  const setPausedState = () => {
    toggleBtn.classList.remove('playing');
    toggleBtn.querySelector('.music-icon').textContent = '🎵';
  };

  // Attempt to autoplay
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started successfully
      setPlayingState();
    }).catch((error) => {
      // Autoplay was prevented by browser policy
      console.warn("Autoplay prevented by browser. User interaction needed.");
      setPausedState();
      
      // Add a one-time click listener to the body to start music on first interaction
      const playOnInteraction = () => {
        music.play().then(() => {
          setPlayingState();
        }).catch(err => console.log(err));
        document.body.removeEventListener('click', playOnInteraction);
        document.body.removeEventListener('touchstart', playOnInteraction);
      };
      
      document.body.addEventListener('click', playOnInteraction, { once: true });
      document.body.addEventListener('touchstart', playOnInteraction, { once: true });
    });
  }
  
  // Toggle button click event
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the body interaction listener
    
    if (music.paused) {
      music.play().then(() => {
        setPlayingState();
      }).catch((err) => {
        console.warn("Play prevented: ", err);
      });
    } else {
      music.pause();
      setPausedState();
    }
  });
}
