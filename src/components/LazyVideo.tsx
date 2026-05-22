import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  isCinemaMode?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, isCinemaMode, className, onClick, ...props }) => {
  // activeSrc drives whether the video element downloads anything.
  // We set it to the real src when visible, and clear it when scrolled away
  // so the browser cancels the download and frees bandwidth for other videos.
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
            setActiveSrc(src);
          } else if (!isCinemaMode) {
            // Cancel the download so this video doesn't compete for bandwidth
            const video = videoRef.current;
            if (video) {
              video.pause();
              video.src = '';
              video.load();
            }
            setActiveSrc(null);
            setIsReady(false);
            setIsBuffering(false);
          }
        });
      },
      {
        // Start loading when 250px from viewport — gives a short head-start
        // without wasting bandwidth on videos the user may never reach
        rootMargin: isCinemaMode ? '0px' : '250px',
        threshold: 0.05,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src, isCinemaMode]);

  // Reset when src prop changes
  useEffect(() => {
    setActiveSrc(null);
    setIsReady(false);
    setIsBuffering(false);
  }, [src]);

  // Play/pause based on whether we have an active src and are ready
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {activeSrc ? (
        <video
          ref={videoRef}
          src={activeSrc}
          className={`${className} transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'} max-h-full max-w-full`}
          onClick={onClick}
          onLoadedData={() => { setIsReady(true); setIsBuffering(false); }}
          onCanPlay={() => { setIsReady(true); setIsBuffering(false); }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onStalled={() => setIsBuffering(true)}
          preload="auto"
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
      ) : null}

      {/* Mute/unmute button — only show when video is playing */}
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

      {/* Loading spinner — shown while buffering */}
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
