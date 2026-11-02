import gsap from 'gsap';

/**
 * Animate the Home Page Hero Section with a choreographed staggered reveal
 */
export const animateHero = (containerRef) => {
  if (!containerRef?.current) return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', {
      opacity: 0,
      scale: 0.85,
      y: -15,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      .from(
        '.hero-title',
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
        },
        '-=0.3'
      )
      .from(
        '.hero-subtitle',
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.5'
      )
      .from(
        '.hero-search-card',
        {
          opacity: 0,
          y: 35,
          scale: 0.97,
          duration: 0.8,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
        },
        '-=0.4'
      )
      .from(
        '.hero-area-tag',
        {
          opacity: 0,
          y: 12,
          scale: 0.9,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.4'
      );
  }, containerRef);

  return () => ctx.revert();
};

/**
 * Animate any card grid with a staggered lift-in reveal
 */
export const animateStaggerCards = (selector = '.gsap-card', containerRef = null) => {
  const scope = containerRef?.current || document;
  const elements = scope.querySelectorAll(selector);
  if (!elements || elements.length === 0) return;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
      scale: 0.98,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'transform',
    }
  );
};

/**
 * Animate single container fading and sliding in
 */
export const animateFadeInUp = (elementRef, options = {}) => {
  if (!elementRef?.current) return;
  const { y = 25, duration = 0.6, delay = 0, ease = 'power2.out' } = options;

  return gsap.fromTo(
    elementRef.current,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      clearProps: 'transform',
    }
  );
};

/**
 * Animate numbers counting up on metrics/dashboard
 */
export const animateNumberCount = (elementRef, endValue, duration = 1.2) => {
  if (!elementRef?.current || typeof endValue !== 'number') return;
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      if (elementRef.current) {
        elementRef.current.innerText = Math.round(obj.val).toLocaleString('en-IN');
      }
    },
  });
};

/**
 * Magnetic / micro hover effect for buttons & interactive elements
 */
export const setupCardHover = (element) => {
  if (!element) return;
  const onEnter = () => {
    gsap.to(element, {
      y: -5,
      boxShadow: '0 12px 28px rgba(10, 7, 51, 0.12)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };
  const onLeave = () => {
    gsap.to(element, {
      y: 0,
      boxShadow: 'var(--shadow-card)',
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mouseenter', onEnter);
  element.addEventListener('mouseleave', onLeave);

  return () => {
    element.removeEventListener('mouseenter', onEnter);
    element.removeEventListener('mouseleave', onLeave);
  };
};

export default {
  animateHero,
  animateStaggerCards,
  animateFadeInUp,
  animateNumberCount,
  setupCardHover,
};
