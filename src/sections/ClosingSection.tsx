import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Mail, MessageCircle } from 'lucide-react';
import { emailAddress } from '@/data/siteData';

gsap.registerPlugin(ScrollTrigger);

export function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      const polaroids = polaroidsRef.current?.querySelectorAll('.polaroid');
      if (polaroids) {
        polaroids.forEach((polaroid, i) => {
          const directions = [
            { x: '-30vw', y: '-20vh', rotate: -15 },
            { x: '30vw', y: '-15vh', rotate: 12 },
            { x: '0', y: '30vh', rotate: 8 },
          ];
          const dir = directions[i % 3];

          scrollTl.fromTo(
            polaroid,
            { x: dir.x, y: dir.y, rotate: dir.rotate, opacity: 0, scale: 0.8 },
            { x: 0, y: 0, rotate: i === 0 ? -3 : i === 1 ? 4 : -2, opacity: 1, scale: 1, ease: 'power2.out' },
            i * 0.05
          );
        });
      }

      const contentItems = contentRef.current?.querySelectorAll('.animate-item');
      if (contentItems && contentItems.length > 0) {
        scrollTl.fromTo(
          contentItems,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
          0.1
        );
      }

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      if (polaroids) {
        scrollTl.fromTo(
          polaroids,
          { opacity: 1 },
          { opacity: 0.3, ease: 'power2.in' },
          0.7
        );
      }

      scrollTl.fromTo(
        contentRef.current,
        { opacity: 1 },
        { opacity: 0.3, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: MessageCircle, label: 'TikTok', href: '#' },
    { icon: Mail, label: 'Email', href: `mailto:${emailAddress}` },
  ];

  return (
    <section
      ref={sectionRef}
      id="closing"
      className="section-pinned bg-background flex items-center justify-center z-60"
    >

      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-20 gap-8 lg:gap-16">
        {/* Left side - Polaroids */}
        <div ref={polaroidsRef} className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px]">
          {/* Polaroid 1 */}
          <div className="polaroid absolute left-[5%] top-[10%] w-[140px] lg:w-[180px] transform -rotate-3">
            <img
              src="/closing_01.jpg"
              alt="Performance"
              className="aspect-[4/5] object-cover"
            />
          </div>

          {/* Polaroid 2 */}
          <div className="polaroid absolute right-[10%] top-[5%] w-[130px] lg:w-[160px] transform rotate-4">
            <img
              src="/closing_02.jpg"
              alt="Backstage"
              className="aspect-[4/5] object-cover"
            />
          </div>

          {/* Polaroid 3 */}
          <div className="polaroid absolute left-[20%] bottom-[5%] w-[120px] lg:w-[150px] transform -rotate-2">
            <img
              src="/closing_03.jpg"
              alt="Crowd"
              className="aspect-[4/5] object-cover"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div ref={contentRef} className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 max-w-xl">
          <h2 className="animate-item font-display font-black text-4xl lg:text-5xl tracking-tight mb-4">
            THANKS FOR <span className="text-primary">STOPPING BY.</span>
          </h2>

          <p className="animate-item text-lg text-muted-foreground mb-8">
            Follow the tour, grab some merch, or just say hey.
          </p>

          {/* Social Links */}
          <div className="animate-item flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-all"
              >
                <link.icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{link.label}</span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="animate-item">
            <Button
              className="btn-primary"
              onClick={() => window.location.href = `mailto:${emailAddress}`}
            >
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
