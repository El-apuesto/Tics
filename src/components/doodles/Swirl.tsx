import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SwirlProps {
  className?: string;
  color?: string;
}

export function Swirl({ className = '', color = '#2EC3E5' }: SwirlProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const path = pathRef.current!;
      const length = path.getTotalLength();
      
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M 80 20 
           C 60 20, 40 30, 40 50 
           C 40 70, 60 80, 70 70 
           C 75 65, 70 55, 60 55 
           C 50 55, 45 65, 50 75 
           C 55 85, 70 90, 85 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
