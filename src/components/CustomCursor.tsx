import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;
    let visible = false;

    const place = (element: HTMLDivElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const animate = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      place(ring, ringX, ringY);
      frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      place(dot, targetX, targetY);

      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
        place(ring, ringX, ringY);
        ring.classList.add('is-visible');
        dot.classList.add('is-visible');
        frame = window.requestAnimationFrame(animate);
      }
    };

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest('a, button, [role="button"], input, select, textarea, label'));

    const onPointerOver = (event: PointerEvent) => {
      if (isInteractive(event.target)) ring.classList.add('is-hovering');
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!isInteractive(event.relatedTarget)) ring.classList.remove('is-hovering');
    };

    const onPointerLeave = () => {
      visible = false;
      ring.classList.remove('is-visible', 'is-hovering');
      dot.classList.remove('is-visible');
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    window.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
