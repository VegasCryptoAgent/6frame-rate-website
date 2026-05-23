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
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Unmute when entering cinema mode
  useEffect(() => {
    if (isCinemaMode) setIsMuted(false);
  }, [isCinemaMode]);

  // Fix iOS Safari muted attribute
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) video.volume = 1;
  }, [isMuted, isReady]);

  // Reset ready state on src change
  useEffect(() => {
    setIsReady(false);
    setIsBuffering(false);
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.play().catch(() => {});
    }
  }, [src]);

  const isCard = isCinemaMode === undefined;

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
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
        preload={isCard ? 'metadata' : 'auto'}
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

      {/* Mute/unmute — only show when playing */}
      {isReady && !isBuffering && (
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
      {(!isReady || isBuffering) && (
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
