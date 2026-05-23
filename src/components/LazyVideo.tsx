import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  isCinemaMode?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  isCinemaMode,
  className,
  onClick,
  ...props
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Unmute when entering cinema mode
  useEffect(() => {
    if (isCinemaMode) setIsMuted(false);
  }, [isCinemaMode]);

  // Load immediately when in overlay or cinema mode (user explicitly opened it)
  useEffect(() => {
    if (isCinemaMode !== undefined) {
      setShouldLoad(true);
    }
  }, [isCinemaMode, src]);

  // Use IntersectionObserver for card-view auto-loading
  useEffect(() => {
    if (isCinemaMode !== undefined) return; // overlay/cinema handle their own loading

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
          } else {
            // Cancel download when scrolled away to save bandwidth
            const video = videoRef.current;
            if (video) {
              video.pause();
              video.src = '';
              video.load();
            }
            setShouldLoad(false);
            setIsReady(false);
            setIsBuffering(false);
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src, isCinemaMode]);

  // Reset when src changes
  useEffect(() => {
    setShouldLoad(false);
    setIsReady(false);
    setIsBuffering(false);
    if (isCinemaMode !== undefined) {
      setShouldLoad(true);
    }
  }, [src]);

  // Fix muted attribute for iOS Safari (React doesn't always set it in DOM)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) video.volume = 1;
  }, [isMuted, shouldLoad, isReady]);

  // Play when ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !isReady) return;
    video.muted = isMuted;
    video.play().catch(() => {});
  }, [shouldLoad, isReady, isMuted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          className={`${className} transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'} max-h-full max-w-full`}
          onClick={onClick}
          onLoadedData={() => { setIsReady(true); setIsBuffering(false); }}
          onCanPlay={() => { setIsReady(true); setIsBuffering(false); }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => { setIsBuffering(false); setIsReady(true); }}
          onStalled={() => setIsBuffering(true)}
          preload="auto"
          playsInline
          muted
          loop
          autoPlay
          controlsList="nodownload"
          disableRemotePlayback
          style={{
            pointerEvents: onClick ? 'auto' : 'none',
            objectFit: isCinemaMode ? 'contain' : 'cover',
            willChange: 'opacity',
            backgroundColor: 'black',
          }}
          {...props}
        />
      )}

      {/* Mute/unmute — only show when playing */}
      {isReady && !isBuffering && shouldLoad && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const video = videoRef.current;
            if (video) {
              video.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="absolute bottom-4 left-4 z-50 p-3 bg-black/60 border border-white/10 hover:bg-white hover:text-black transition-all"
          style={{ touchAction: 'manipulation' }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted
            ? <VolumeX size={14} />
            : <Volume2 size={14} className="text-[#ff4d00]" />
          }
        </button>
      )}

      {/* Loading spinner */}
      {shouldLoad && (!isReady || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
          <div className="relative w-12 h-12 border border-white/10 flex items-center justify-center">
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
