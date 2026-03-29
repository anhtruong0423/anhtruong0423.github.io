/* ==========================================
   CHAPTERS — Scene Transitions & Scroll Animations
   ========================================== */

/**
 * Chapter Transition Manager
 * Handles GSAP-based scroll animations for each chapter
 */
class ChapterManager {
  constructor() {
    this.chapters = document.querySelectorAll('.chapter');
    this.init();
  }

  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: use IntersectionObserver if GSAP isn't loaded
      this.initFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.initChapters();
    this.initSkills();
    this.initCredits();
  }

  initChapters() {
    this.chapters.forEach((chapter, index) => {
      const header = chapter.querySelector('.chapter__header');
      const polaroid = chapter.querySelector('.polaroid');
      const info = chapter.querySelector('.chapter__info');
      const annotation = chapter.querySelector('.chapter__annotation');
      const isReversed = chapter.classList.contains('chapter--reverse');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter,
          start: 'top 75%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        },
      });

      // Chapter number + title
      if (header) {
        tl.from(header.querySelector('.chapter__number'), {
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
        });
        tl.from(header.querySelector('.chapter__title'), {
          y: 30,
          opacity: 0,
          duration: 0.5,
        }, '-=0.3');
        tl.from(header.querySelector('.chapter__genre'), {
          y: 20,
          opacity: 0,
          duration: 0.4,
        }, '-=0.2');
      }

      // Polaroid
      if (polaroid) {
        tl.from(polaroid, {
          x: isReversed ? 80 : -80,
          rotation: isReversed ? 15 : -15,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.3');
      }

      // Info
      if (info) {
        const children = info.children;
        tl.from(children, {
          x: isReversed ? -40 : 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }, '-=0.4');
      }

      // Annotation
      if (annotation) {
        tl.from(annotation, {
          scale: 0,
          rotation: -20,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
        }, '-=0.2');
      }
    });
  }

  initSkills() {
    const skillCards = document.querySelectorAll('.skill-card');
    const skillSection = document.querySelector('.behind-scenes');

    if (!skillSection || skillCards.length === 0) return;

    // Header animation
    const header = skillSection.querySelector('.behind-scenes__header');
    if (header) {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
      });
    }

    // Skill cards
    skillCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'back.out(1.5)',
        onComplete: () => {
          // Animate skill bar fill
          const fill = card.querySelector('.skill-card__fill');
          if (fill) {
            const percent = fill.getAttribute('data-percent');
            fill.style.width = percent + '%';
          }
        },
      });
    });
  }

  initCredits() {
    const creditsSection = document.querySelector('.credits');
    if (!creditsSection) return;

    const blocks = creditsSection.querySelectorAll('.credits__block');
    const label = creditsSection.querySelector('.credits__label');

    if (label) {
      gsap.from(label, {
        scrollTrigger: {
          trigger: creditsSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
      });
    }

    blocks.forEach((block, i) => {
      gsap.from(block, {
        scrollTrigger: {
          trigger: creditsSection,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: (i + 1) * 0.2,
        ease: 'power2.out',
        onComplete: () => block.classList.add('credits__block--visible'),
      });
    });

    // Post-credit scene
    const postCredit = document.getElementById('post-credit');
    if (postCredit) {
      gsap.from(postCredit, {
        scrollTrigger: {
          trigger: postCredit,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        onComplete: () => postCredit.classList.add('post-credit--visible'),
      });
    }
  }

  /**
   * Fallback for when GSAP isn't loaded
   */
  initFallback() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-in').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('fade-in--visible');
              }, i * 150);
            });

            // Skill bars
            entry.target.querySelectorAll('.skill-card__fill').forEach((fill) => {
              const percent = fill.getAttribute('data-percent');
              fill.style.width = percent + '%';
            });

            // Credits
            entry.target.querySelectorAll('.credits__block').forEach((block, i) => {
              setTimeout(() => {
                block.classList.add('credits__block--visible');
              }, i * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.section').forEach((section) => {
      observer.observe(section);
    });
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure GSAP is loaded
  setTimeout(() => {
    new ChapterManager();
  }, 100);
});
