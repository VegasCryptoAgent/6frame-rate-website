import React, { useEffect, useRef, useState } from 'react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, className, onClick, ...props }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            // Once we start loading, keep it loaded for smoother mobile experience
            // Only stop if the memory is a huge issue, but for these reels we want consistency
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '600px', // Preload ahead of scroll
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }
  }, [shouldLoad]);

  useEffect(() => {
    if (shouldLoad && isReady && videoRef.current && props.autoPlay) {
      // Browsers require muted for autoplay
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
        });
      }
    }
  }, [shouldLoad, isReady, props.autoPlay]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          className={`${className} transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClick}
          onLoadedData={() => setIsReady(true)}
          onCanPlay={() => setIsReady(true)}
          onCanPlayThrough={() => setIsReady(true)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onStalled={() => setIsBuffering(true)}
          preload="auto"
          playsInline
          muted
          loop
          autoPlay={props.autoPlay}
          {...props}
        />
      ) : null}
      {(!isReady || isBuffering) && (
        <div 
          className="absolute inset-0 w-full h-full bg-black/40 flex items-center justify-center overflow-hidden backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none"
        >
          <div className="relative z-10 w-12 h-12 border border-white/10 flex items-center justify-center">
            <div className="w-1 h-1 bg-white animate-ping" />
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/40" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/40" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
