import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UnderlineProps {
  className?: string;
  color?: string;
  width?: number;
}

export function Underline({ className = '', color = '#2EC3E5', width = 200 }: UnderlineProps) {
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
        duration: 0.8,
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
      viewBox={`0 0 ${width} 20`}
      className={`${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: `${width}px`, height: '20px' }}
    >
      <path
        ref={pathRef}
        d={`M 5 15 Q ${width / 4} 5, ${width / 2} 12 T ${width - 5} 10`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
