'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX - 4}px`;
        dotRef.current.style.top = `${e.clientY - 4}px`;
        dotRef.current.style.opacity = '1';
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX - 16}px`;
        ringRef.current.style.top = `${e.clientY - 16}px`;
        ringRef.current.style.opacity = '0.15';
      }
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[99999] hidden lg:block transition-opacity duration-300"
        style={{ left: 0, top: 0, opacity: 0 }}
      >
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow),0_0_20px_var(--accent-glow)]" />
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[99998] hidden lg:block transition-all duration-150 ease-out"
        style={{ left: 0, top: 0, opacity: 0 }}
      >
        <div
          className="w-8 h-8 rounded-full border border-[var(--accent)]"
          style={{ boxShadow: '0 0 20px var(--accent-glow)' }}
        />
      </div>
    </>
  );
}
