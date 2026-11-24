import {useEffect, useRef} from 'react';

const selector = '.section-top, .impact, .project, .experience-layout, .skill-card, .education-grid article, .contact';

/** Reveal below-fold content once, without adding scroll-driven React renders. */
export function useScrollReveal(dependency: string, paused: boolean) {
  const revealed = useRef(new WeakSet<Element>());
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const showAll = () => elements.forEach(element => {
      element.classList.remove('reveal-pending');
      element.style.removeProperty('--reveal-delay');
    });
    if (paused || preference.matches || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        revealed.current.add(entry.target);
        observer.unobserve(entry.target);
      });
    }, {threshold: 0, rootMargin: '0px 0px -35px 0px'});
    const viewportHeight = window.innerHeight;
    const positions = elements.map(element => ({element, bounds: element.getBoundingClientRect()}));
    positions.forEach(({element, bounds}) => {
      element.classList.add('scroll-reveal');
      // Keep content already on screen (including deep links) visible immediately.
      if (revealed.current.has(element) || bounds.top < viewportHeight) return;
      const siblings = element.parentElement?.children;
      const index = siblings ? Array.from(siblings).indexOf(element) : 0;
      element.style.setProperty('--reveal-delay', `${Math.min(index % 2, 1) * 90}ms`);
      element.classList.add('reveal-pending');
      observer.observe(element);
    });
    const handlePreference = () => { if (preference.matches) {showAll(); observer.disconnect();} };
    preference.addEventListener('change', handlePreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', handlePreference);
      showAll();
    };
  }, [dependency, paused]);
}
