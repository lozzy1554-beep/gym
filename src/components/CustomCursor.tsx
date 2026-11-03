import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor
 * Premium animated custom cursor for Titan Gym.
 * - Desktop only (pointer: fine).
 * - Thin red circular outline (32px) + center solid red dot (6px).
 * - Smooth lerp trailing animation via requestAnimationFrame (0 React re-renders on move).
 * - Subtle red glow around outer circle.
 * - Expands smoothly over interactive elements (buttons, links, inputs).
 * - pointer-events: none (never blocks clicks, selection, or scrolling).
 * - Respects prefers-reduced-motion and touch devices.
 */
export const CustomCursor: React.FC = () => {
  const outerCircleRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Enabled state determines if desktop fine pointer & allowed
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // 1. Accessibility & Device Checks
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkEnabled = () => {
      // Must have a fine pointer (mouse/trackpad), not touch-only
      const isFinePointer = finePointerQuery.matches;
      setIsEnabled(isFinePointer);
      return isFinePointer;
    };

    if (!checkEnabled()) {
      return;
    }

    const finePointerListener = (e: MediaQueryListEvent) => {
      setIsEnabled(e.matches);
    };

    try {
      finePointerQuery.addEventListener('change', finePointerListener);
    } catch {
      finePointerQuery.addListener(finePointerListener);
    }

    // Add CSS class to body to hide native cursor on desktop
    document.body.classList.add('titan-custom-cursor-active');

    // 2. High-performance RAF state without triggering React renders
    let mouseX = -100;
    let mouseY = -100;
    let outerX = -100;
    let outerY = -100;
    let innerX = -100;
    let innerY = -100;
    let isVisible = false;
    let isHovering = false;
    let isMouseDown = false;
    let rafId: number | null = null;

    // Check if prefers reduced motion
    const prefersReducedMotion = reducedMotionQuery.matches;
    // Outer circle trailing speed: 0.16 for sleek delay, 1.0 for instant if reduced motion
    const outerLerp = prefersReducedMotion ? 1.0 : 0.16;
    const innerLerp = prefersReducedMotion ? 1.0 : 0.75;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        outerX = mouseX;
        outerY = mouseY;
        innerX = mouseX;
        innerY = mouseY;
        if (outerCircleRef.current) outerCircleRef.current.style.opacity = '1';
        if (innerDotRef.current) innerDotRef.current.style.opacity = '1';
      if (arrowRef.current) arrowRef.current.style.opacity = '1';
        if (arrowRef.current) arrowRef.current.style.opacity = '1';
      }
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (outerCircleRef.current) outerCircleRef.current.style.opacity = '1';
      if (innerDotRef.current) innerDotRef.current.style.opacity = '1';
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (outerCircleRef.current) outerCircleRef.current.style.opacity = '0';
      if (innerDotRef.current) innerDotRef.current.style.opacity = '0';
      if (arrowRef.current) arrowRef.current.style.opacity = '0';
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Detect if hovering over clickable / interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], label, [tabindex="0"], summary, .cursor-pointer'
      );
      isHovering = Boolean(interactive);
    };

    // 3. Animation loop using requestAnimationFrame
    const renderLoop = () => {
      if (isVisible) {
        // Linear interpolation for smooth trailing
        outerX += (mouseX - outerX) * outerLerp;
        outerY += (mouseY - outerY) * outerLerp;

        innerX += (mouseX - innerX) * innerLerp;
        innerY += (mouseY - innerY) * innerLerp;

        if (outerCircleRef.current) {
          // Scale based on hover or active press
          let scale = isHovering ? 1.6 : 1;
          if (isMouseDown) scale *= 0.85;

          // Outer circle radius is 16px (32px diameter / 2)
          outerCircleRef.current.style.transform = `translate3d(${outerX - 16}px, ${outerY - 16}px, 0) scale(${scale})`;
          
          if (isHovering) {
            outerCircleRef.current.style.borderColor = '#FF3344';
            outerCircleRef.current.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            outerCircleRef.current.style.boxShadow = '0 0 18px rgba(239, 68, 68, 0.65), inset 0 0 6px rgba(239, 68, 68, 0.25)';
          } else {
            outerCircleRef.current.style.borderColor = 'rgba(239, 68, 68, 0.85)';
            outerCircleRef.current.style.backgroundColor = 'transparent';
            outerCircleRef.current.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.45)';
          }
        }

        if (arrowRef.current) {
          arrowRef.current.style.transform = `translate3d(${mouseX - 1}px, ${mouseY - 1}px, 0)`;
        }

        if (innerDotRef.current) {
          // Center dot radius is 3px (6px diameter / 2)
          const dotScale = isMouseDown ? 0.7 : 1;
          innerDotRef.current.style.transform = `translate3d(${innerX - 3}px, ${innerY - 3}px, 0) scale(${dotScale})`;
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseenter', onMouseEnter, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      document.body.classList.remove('titan-custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);

      try {
        finePointerQuery.removeEventListener('change', finePointerListener);
      } catch {
        finePointerQuery.removeListener(finePointerListener);
      }

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Bottom layer: smooth trailing red ring */}
      <div
        ref={outerCircleRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] w-8 h-8 rounded-full border border-red-500 will-change-transform transition-[border-color,background-color,box-shadow] duration-200 ease-out"
        style={{
          opacity: 0,
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.45)',
        }}
      />

      {/* Middle layer: direct red dot */}
      <div
        ref={innerDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[10002] w-1.5 h-1.5 rounded-full bg-red-500 will-change-transform shadow-[0_0_6px_rgba(239,68,68,0.9)]"
        style={{
          opacity: 0,
        }}
      />
      {/* Top layer: visible mouse arrow, anchored at the pointer tip */}
      <svg
        ref={arrowRef}
        aria-hidden="true"
        viewBox="0 0 24 32"
        className="pointer-events-none fixed top-0 left-0 z-[10003] w-5 h-7 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
        style={{ opacity: 0 }}
      >
        <path d="M2 1 L2 25 L8.2 19.2 L12.2 29.5 L16.1 27.8 L12.1 17.7 L21 17.2 Z" fill="#fff" stroke="#17191f" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default CustomCursor;
