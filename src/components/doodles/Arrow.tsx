import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ArrowProps {
  className?: string;
  color?: string;
  direction?: 'right' | 'left' | 'up' | 'down';
}

export function Arrow({ className = '', color = '#2EC3E5', direction = 'right' }: ArrowProps) {
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
        duration: 1,
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

  const getPath = () => {
    switch (direction) {
      case 'left':
        return 'M 90 50 L 20 50 M 30 35 L 10 50 L 30 65';
      case 'up':
        return 'M 50 90 L 50 20 M 35 30 L 50 10 L 65 30';
      case 'down':
        return 'M 50 10 L 50 80 M 35 70 L 50 90 L 65 70';
      default:
        return 'M 10 50 L 80 50 M 70 35 L 90 50 L 70 65';
    }
  };

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
        d={getPath()}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
