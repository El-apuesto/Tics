import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StarburstProps {
  className?: string;
  color?: string;
}

export function Starburst({ className = '', color = '#2EC3E5' }: StarburstProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      pathRefs.current.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: SVGPathElement | null, index: number) => {
    if (el) pathRefs.current[index] = el;
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center circle */}
      <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="2.5" fill="none" />
      
      {/* Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 50 + Math.cos(angle) * 15;
        const y1 = 50 + Math.sin(angle) * 15;
        const x2 = 50 + Math.cos(angle) * 45;
        const y2 = 50 + Math.sin(angle) * 45;
        
        return (
          <path
            key={i}
            ref={(el) => addToRefs(el, i)}
            d={`M ${x1} ${y1} L ${x2} ${y2}`}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Small stars around */}
      <path
        ref={(el) => addToRefs(el, 12)}
        d="M 10 20 L 12 15 L 14 20 L 19 22 L 14 24 L 12 29 L 10 24 L 5 22 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        ref={(el) => addToRefs(el, 13)}
        d="M 80 15 L 82 10 L 84 15 L 89 17 L 84 19 L 82 24 L 80 19 L 75 17 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        ref={(el) => addToRefs(el, 14)}
        d="M 85 75 L 87 70 L 89 75 L 94 77 L 89 79 L 87 84 L 85 79 L 80 77 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
