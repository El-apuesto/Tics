import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, ExternalLink, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { useVideos, useShows } from '@/hooks/useSiteData';
import { getNextThreeShows } from '@/utils/showUtils';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoGalleryRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);
  const { videos } = useVideos();
  const { shows } = useShows();
  const nextTwoShows = getNextThreeShows(shows).slice(0, 2);

  // Use API videos or fallback to static clips if no videos available
  const videoClips = videos.length > 0 ? videos.map(v => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    videoUrl: v.embedUrl || v.url || '/video_reel.jpg',
  })) : [
    {
      id: '1',
      title: 'Club Performance',
      thumbnail: '/video_reel.jpg',
      videoUrl: '/video_reel.jpg',
    },
    {
      id: '2',
      title: 'Virtual Show',
      thumbnail: '/closing_01.jpg',
      videoUrl: '/closing_01.jpg',
    },
    {
      id: '3',
      title: 'Backstage Moments',
      thumbnail: '/closing_02.jpg',
      videoUrl: '/closing_02.jpg',
    },
    {
      id: '4',
      title: 'Crowd Reactions',
      thumbnail: '/closing_03.jpg',
      videoUrl: '/closing_03.jpg',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ delay: 0.2 });

      // Video gallery entrance
      loadTl.fromTo(
        videoGalleryRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      // Blurb entrance
      loadTl.fromTo(
        blurbRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%', // Increased from 130% to accommodate sneak peek
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%): Hold position (already animated on load)
      // SETTLE (30-70%): Static
      // EXIT (70-100%): Elements exit

      scrollTl.fromTo(
        videoGalleryRef.current,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0.3, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        blurbRef.current,
        { y: 0, opacity: 1 },
        { y: '5vh', opacity: 0.3, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate videos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videoClips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned bg-background flex flex-col z-10"
    >

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-12 lg:py-16">
        
        {/* Video Gallery - Main Feature */}
        <div
          ref={videoGalleryRef}
          className="relative w-full max-w-5xl mb-4"
        >
          {/* Video Container: crop top 4% and bottom 4% so container hugs speaker */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black">
            {/* Inner crop wrapper - shows middle 92% of content */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute left-0 right-0 w-full transition-opacity duration-1000"
                style={{ height: '108.7%', top: '-4.35%' }}
              >
                {videoClips.map((clip, index) => (
                  <div
                    key={clip.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === activeVideo ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                {/* Video overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Video Indicators */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {videoClips.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveVideo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeVideo ? 'bg-primary w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Bottom Overlay - Intro Blurb */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-20">
              <div className="max-w-3xl">
                <p className="text-white text-lg lg:text-xl font-bold leading-relaxed mb-4">
                  Hello Humans! my name is Zachariah Tippett but, you can call me Tourette&apos;s and I have Tourette&apos;s Syndrome
                </p>
                
                {/* Links Row */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://www.google.com/search?q=Zachariah+Tippett"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Google Me
                  </a>
                  
                  <span className="text-white/40">|</span>
                  
                  <button
                    onClick={scrollToAbout}
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all"
                  >
                    Read More
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sound Enable Prompt */}
            {!soundEnabled && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                <button
                  onClick={() => setSoundEnabled(true)}
                  className="flex flex-col items-center gap-3 bg-black/70 hover:bg-black/90 px-6 py-4 rounded-xl transition-colors"
                >
                  <Volume2 className="w-8 h-8 text-primary" />
                  <span className="text-white font-semibold text-sm">Tap to Enable Sound</span>
                </button>
              </div>
            )}
          </div>

          {/* Upcoming shows - 2 widgets, responsive positioning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-2xl mx-auto">
            {nextTwoShows.map((show) => (
              <a
                key={show.id}
                href={show.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{show.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {show.venue}
                  </h4>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{show.location}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
