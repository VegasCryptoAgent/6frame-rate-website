import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  isCinemaMode?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, isCinemaMode, className, onClick, ...props }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Auto-unmute when in cinema mode (since user interaction just happened via click)
  useEffect(() => {
    if (isCinemaMode) {
      setIsMuted(false);
    }
  }, [isCinemaMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin: isCinemaMode ? '0px' : '50px', // Minimal margin to prioritize active video
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isCinemaMode]);

  // Manage internal ready state based on src
  useEffect(() => {
    setIsReady(false);
    setIsBuffering(false);
  }, [src]);

  // Handle Playback and Resilience
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !isReady) return;

    if (isVisible) {
      // Sync video mute state with component state
      video.muted = isMuted;
      
      if (!isMuted) {
        video.volume = 1;
      }
      
      // Ensure we have a high priority for loading when visible
      if (video.getAttribute('preload') !== 'auto') {
        video.setAttribute('preload', 'auto');
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback for autoplay blocks
        });
      }
    } else if (!isCinemaMode) {
      // Only pause if NOT in cinema mode to avoid flickering during transitions
      // or if the user scrolls away
      video.pause();
    }
  }, [isVisible, shouldLoad, isReady, src, props.autoPlay, isCinemaMode]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }} 
    >
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          className={`${className} transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'} max-h-full max-w-full`}
          onClick={onClick}
          onLoadedData={() => setIsReady(true)}
          onCanPlay={() => setIsReady(true)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onStalled={() => setIsBuffering(true)}
          preload={isVisible ? "auto" : "none"}
          playsInline
          muted={isMuted}
          loop
          autoPlay={props.autoPlay}
          controlsList="nodownload"
          disableRemotePlayback
          style={{ 
            pointerEvents: props.onClick ? 'auto' : 'none',
            objectFit: isCinemaMode ? 'contain' : 'cover',
            willChange: 'transform, opacity',
            backgroundColor: 'black'
          }}
          {...props}
        />
      ) : null}
      {isReady && !isBuffering && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-6 left-6 z-50 p-3 bg-black/60 border border-white/10 hover:bg-white hover:text-black transition-all group/volume"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <div className="flex items-center gap-3">
              <VolumeX size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/volume:block">Sound Off</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Volume2 size={14} className="text-[#ff4d00]" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/volume:block">Audio Active</span>
            </div>
          )}
        </button>
      )}
      {(!isReady || isBuffering) && shouldLoad && (
        <div 
          className="absolute inset-0 w-full h-full bg-black/40 flex items-center justify-center overflow-hidden transition-opacity duration-300 pointer-events-none"
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
