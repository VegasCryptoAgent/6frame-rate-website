import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  isCinemaMode?: boolean;
}

// Detect touch/mobile once at module level
const IS_MOBILE =
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || window.innerWidth < 768);

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  isCinemaMode,
  className,
  onClick,
  ...props
}) => {
  // undefined  → card view (in the scrolling gallery)
  // false      → detail overlay (user tapped to expand)
  // true       → fullscreen cinema mode
  const isCardView = isCinemaMode === undefined;

  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  // Mobile card view: user must tap Play before we download anything
  const [mobilePlayRequested, setMobilePlayRequested] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Unmute when entering cinema mode
  useEffect(() => {
    if (isCinemaMode) setIsMuted(false);
  }, [isCinemaMode]);

  // IntersectionObserver — handles desktop auto-load + scroll-away cleanup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Desktop: always auto-load
            // Mobile in overlay/cinema: auto-load (user explicitly opened it)
            // Mobile in card view: wait for explicit tap
            if (!IS_MOBILE || !isCardView) {
              setActiveSrc(src);
            }
          } else if (!isCinemaMode) {
            // Scrolled away — cancel download to free bandwidth
            const video = videoRef.current;
            if (video) {
              video.pause();
              video.src = '';
              video.load();
            }
            setActiveSrc(null);
            setIsReady(false);
            setIsBuffering(false);
            // Reset tap state so the play button reappears if user scrolls back
            if (IS_MOBILE && isCardView) setMobilePlayRequested(false);
          }
        });
      },
      {
        rootMargin: isCinemaMode ? '0px' : IS_MOBILE ? '0px' : '250px',
        threshold: 0.05,
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src, isCinemaMode, isCardView]);

  // Mobile tap-to-play: once requested, load the src
  useEffect(() => {
    if (mobilePlayRequested && !activeSrc) {
      setActiveSrc(src);
    }
  }, [mobilePlayRequested, src, activeSrc]);

  // Reset everything when src changes
  useEffect(() => {
    setActiveSrc(null);
    setIsReady(false);
    setIsBuffering(false);
    setMobilePlayRequested(false);
  }, [src]);

  // Play/pause when ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc || !isReady) return;

    video.muted = isMuted;
    if (!isMuted) video.volume = 1;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — stay paused silently
      });
    }
  }, [activeSrc, isReady, isMuted]);

  const handleMobilePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger card expand
    setMobilePlayRequested(true);
  };

  // On mobile in card view, show placeholder until the user taps Play
  const showMobilePlaceholder = IS_MOBILE && isCardView && !mobilePlayRequested;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {/* Video element — only rendered when we have an active src */}
      {activeSrc && (
        <video
          ref={videoRef}
          src={activeSrc}
          className={`${className} transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} max-h-full max-w-full`}
          onClick={onClick}
          onLoadedData={() => { setIsReady(true); setIsBuffering(false); }}
          onCanPlay={() => { setIsReady(true); setIsBuffering(false); }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onStalled={() => setIsBuffering(true)}
          // On mobile in overlay/cinema: metadata only until play starts, then auto
          // On desktop: always auto
          preload={IS_MOBILE ? 'metadata' : 'auto'}
          playsInline
          muted={isMuted}
          loop
          autoPlay
          controlsList="nodownload"
          disableRemotePlayback
          style={{
            pointerEvents: props.onClick ? 'auto' : 'none',
            objectFit: isCinemaMode ? 'contain' : 'cover',
            willChange: 'transform, opacity',
            backgroundColor: 'black',
          }}
          {...props}
        />
      )}

      {/* Mobile card placeholder — shown before user taps Play */}
      {showMobilePlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 gap-4">
          <button
            onClick={handleMobilePlay}
            style={{ touchAction: 'manipulation' }}
            className="w-16 h-16 rounded-full bg-[#ff4d00]/90 border-2 border-white/20 flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
            aria-label="Play video"
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </button>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
            Tap to Preview
          </span>
        </div>
      )}

      {/* Mute/unmute — only show when video is playing */}
      {isReady && !isBuffering && activeSrc && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute bottom-6 left-6 z-50 p-3 bg-black/60 border border-white/10 hover:bg-white hover:text-black transition-all group/volume"
          style={{ touchAction: 'manipulation' }}
          title={isMuted ? 'Unmute' : 'Mute'}
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

      {/* Loading spinner — shown while buffering after a load was triggered */}
      {(!isReady || isBuffering) && activeSrc && (
        <div className="absolute inset-0 w-full h-full bg-black/40 flex items-center justify-center overflow-hidden pointer-events-none">
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
