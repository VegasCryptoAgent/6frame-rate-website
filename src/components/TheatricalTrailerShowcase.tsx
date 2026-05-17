import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'motion/react';
import { ArrowLeft, Film, Play, Scissors, MonitorPlay, Zap, Share2, Check } from 'lucide-react';
import Marquee from './Marquee.tsx';
import LazyVideo from './LazyVideo.tsx';
import { Video, subscribeToVideos, testConnection } from '../services/videoService';

const DEFAULT_VIDEOS: Video[] = [
  {
    id: '1',
    showcaseId: 'theatrical-trailer',
    title: "El Patron",
    code: "6F-SR",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/El%20Patron.mp4?alt=media&token=944d79e2-2092-4519-b2f1-06966c7bb7bc",
    order: 1,
    description: "A dark and gritty trailer for 'El Patron', highlighting the intense atmosphere and cinematic sound design.",
    duration: "2:15"
  },
  {
    id: '2',
    showcaseId: 'theatrical-trailer',
    title: "Par 4 the Course",
    code: "AF-775",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/Tiger%20Woods.mp4?alt=media&token=0cdf0a55-389b-450f-8833-6f96994c15a7",
    order: 2,
    description: "A High-Energy sports satire spoof of the latest trails and tribulations of Tiger Woods.",
    duration: "0:45"
  },
  {
    id: '3',
    showcaseId: 'theatrical-trailer',
    title: "Inner - Music Video",
    code: "NP-03",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/Inner%20Music%20Video.mp4?alt=media&token=ec1fcd18-ed7c-488e-b961-ae7d32801e16",
    order: 3,
    description: "Visually stunning music video for 'Inner', utilizing surreal imagery and rhythmic editing to complement the track.",
    duration: "3:40"
  },
  {
    id: '4',
    showcaseId: 'theatrical-trailer',
    title: "The 27 Protocol",
    code: "NP-04",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/The%2027%20Protocol%20.mp4?alt=media&token=5181a1fd-5b85-4708-b4a7-4caef2e14541",
    order: 4,
    description: "Sci-fi thriller trailer 'The 27 Protocol', using advanced VFX and a pulsing soundtrack to build suspense.",
    duration: "1:50"
  },
  {
    id: '5',
    showcaseId: 'theatrical-trailer',
    title: "The Thorn Recordings",
    code: "PX-05",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/The%20Thorn%20Recordings.mp4?alt=media&token=88cf7cec-fe70-47c8-a2de-b810d426cc82",
    order: 5,
    description: "Upcoming cinematic production. Placeholder for future theatrical trailer integration.",
    duration: "TBD"
  }
];

interface TrailerCardProps {
  video: Video;
  index: number;
  onSelect: (video: Video) => void;
}

const TrailerCard: React.FC<TrailerCardProps> = ({ video, index, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(video.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `6Frame: ${video.title}`,
          text: `Check out this theatrical trailer: ${video.title}`,
          url: video.url,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      const smsBody = `Check out this video from 6Frame: ${video.url}`;
      window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center p-[6vw] overflow-hidden bg-black"
    >
      {/* Background Cinematic Text */}
      <motion.div 
        animate={{ 
          scale: isInView ? 1.2 : 0.8,
          opacity: isInView ? 0.03 : 0
        }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-white font-black text-[40vw] uppercase tracking-tighter"
      >
        {video.title.split(' ')[0]}
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-4 md:gap-[4vw]">
        <div 
          onClick={(e) => {
            console.log("Expanding trailer:", video.title);
            onSelect(video);
          }}
          className="w-full relative group cursor-pointer z-20"
        >
          <div className="aspect-video w-full overflow-hidden bg-black relative border border-white/5 group-hover:border-white/20 transition-colors duration-500">
            {video.url ? (
              <LazyVideo 
                src={video.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain transition-all duration-[2s]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] space-y-6">
                <div className="w-20 h-20 border border-white/10 flex items-center justify-center">
                  <Play size={32} className="text-white/20" />
                </div>
                <div className="flex flex-col items-center gap-2">
                   <span className="text-xs font-mono tracking-[0.5em] uppercase text-white/40">Status // Pending</span>
                   <span className="text-sm font-black uppercase tracking-[0.2em] text-[#ff4d00]">Incoming Production</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-white/0 group-hover:bg-white/5 transition-colors duration-500">
               <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500">
                  <div className="bg-black/80 backdrop-blur-xl border border-white/20 px-10 py-5">
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
                      {video.url ? "Full Screen Experience" : "Development Phase"}
                    </span>
                  </div>
               </div>
            </div>
          </div>

          {/* Share Button on Card */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={handleShare}
              className="p-4 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-3 group/share shadow-lg"
              title="Share Video"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/share:opacity-100 transition-opacity">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-between items-end gap-4 md:gap-8 text-white">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-4 text-white/40">
              <Film size={14} className="text-[#ff4d00]" />
              <span className="font-mono text-xs tracking-[0.5em] uppercase">Production Cut 0{index + 1}</span>
            </div>
            <h3 className="text-[clamp(1.1rem,10vw,12rem)] xl:text-[clamp(2.2rem,3.5vw,5rem)] font-black uppercase leading-[0.75] tracking-tighter italic">
              {video.title}
            </h3>
          </div>
          
          <div className="flex gap-12 pb-4">
             <div className="text-right">
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block">Mastering</span>
               <p className="text-sm font-black italic">Dolby Vision</p>
             </div>
             <div className="text-right">
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 block">Audio</span>
               <p className="text-sm font-black italic">Atmos 7.1.4</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TheatricalTrailerShowcase() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>(DEFAULT_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    testConnection();

    // Subscribe to videos from Firebase
    const unsubscribe = subscribeToVideos('theatrical-trailer', (fetchedVideos) => {
      if (fetchedVideos.length > 0) {
        setVideos(fetchedVideos.map(v => ({
          ...DEFAULT_VIDEOS.find(dv => dv.id === v.id || dv.order === v.order),
          ...v
        })));
      }
    });

    return () => unsubscribe();
  }, []);

  const [realDuration, setRealDuration] = useState<string | null>(null);

  // Manage internal ready state based on src
  useEffect(() => {
    setRealDuration(null);
  }, [selectedVideo]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [detailCopied, setDetailCopied] = useState(false);

  const handleDetailShare = async () => {
    if (!selectedVideo) return;
    
    try {
      await navigator.clipboard.writeText(selectedVideo.url);
      setDetailCopied(true);
      setTimeout(() => setDetailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `6Frame: ${selectedVideo.title}`,
          text: `Check out this theatrical trailer: ${selectedVideo.title}`,
          url: selectedVideo.url,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      const smsBody = `Check out this video from 6Frame: ${selectedVideo.url}`;
      window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCinemaMode) {
          setIsCinemaMode(false);
        } else {
          setSelectedVideo(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCinemaMode]);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-[#ff4d00] selection:text-white pb-32">
      {/* Video Detail Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[200] bg-black backdrop-blur-3xl transition-colors duration-700 ${isCinemaMode ? 'bg-black overflow-hidden' : 'overflow-y-auto'}`}
          >
            {/* Cinema Mode Close Overlay Component */}
            <AnimatePresence>
              {isCinemaMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-8 left-0 right-0 z-[211] flex justify-center pointer-events-none"
                >
                  <div className="bg-black/60 backdrop-blur-md px-6 py-2 border border-white/10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/60 font-mono italic">
                    Cinema Mode Active // Esc to Exit
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`min-h-[100dvh] flex flex-col transition-all duration-700 ${isCinemaMode ? 'h-[100dvh] overflow-hidden' : 'p-[4vw]'}`}>
              <AnimatePresence mode="wait">
                {isCinemaMode ? (
                  <motion.div
                    key="cinema-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[210] bg-black flex items-center justify-center p-4 lg:p-12"
                  >
                    <div className="w-full h-full max-w-7xl mx-auto relative group">
                      <LazyVideo 
                        src={selectedVideo.url}
                        autoPlay
                        loop
                        playsInline
                        isCinemaMode={true}
                        className="w-full h-full"
                        onLoadedMetadata={(e) => {
                          const video = e.currentTarget;
                          setRealDuration(formatDuration(video.duration));
                        }}
                      />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <button 
                          onClick={() => setIsCinemaMode(false)}
                          className="px-6 py-3 bg-[#ff4d00] text-black text-[10px] uppercase tracking-widest font-black hover:bg-white transition-all shadow-2xl"
                        >
                          Exit Cinema Mode _ [ESC]
                        </button>
                        <div className="text-[10px] font-mono tracking-widest opacity-40 uppercase text-white hidden sm:block">
                          {selectedVideo.title} // MASTER THEATRICAL CUT
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-7xl mx-auto flex flex-col gap-8 flex-grow"
                  >
                    <div className="flex justify-between items-center text-white/60 shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#ff4d00] animate-pulse" />
                        <span className="font-mono tracking-[0.6em] text-[10px] uppercase italic">Master.Override // Production_Mode</span>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleDetailShare}
                          className="flex items-center gap-3 p-4 border border-white/10 bg-white/5 hover:bg-[#ff4d00] hover:text-black transition-all uppercase text-[10px] tracking-widest font-black"
                        >
                          {detailCopied ? (
                            <>
                              <Check size={14} className="text-green-600" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={14} />
                              <span>SHARE</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedVideo(null);
                            setIsCinemaMode(false);
                          }}
                          className="p-4 border border-white/5 bg-white/5 hover:bg-white/10 transition-colors uppercase text-[10px] tracking-[0.3em] font-black"
                        >
                          CLOSE_SYSTEM
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 flex-grow items-center">
                      <div className="lg:w-3/4 max-h-[60vh] overflow-hidden">
                        <div 
                          onClick={() => selectedVideo.url && setIsCinemaMode(true)}
                          className={`bg-[#050505] relative group cursor-pointer overflow-hidden aspect-[21/9] border border-white/5 ${selectedVideo.url ? 'hover:border-[#ff4d00]/40' : 'cursor-default'} shadow-2xl`}
                        >
                          {selectedVideo.url ? (
                            <LazyVideo 
                              src={selectedVideo.url}
                              autoPlay
                              loop
                              playsInline
                              isCinemaMode={false}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                              onLoadedMetadata={(e) => {
                                const video = e.currentTarget;
                                setRealDuration(formatDuration(video.duration));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                              <div className="w-12 h-12 border border-white/5 flex items-center justify-center">
                                <Play size={20} className="text-white/10" />
                              </div>
                              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/20">Data Stream Off / TBD</span>
                            </div>
                          )}
                          
                          {selectedVideo.url && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center transition-opacity">
                              <div className="bg-[#ff4d00] p-6 text-black">
                                <span className="text-[10px] font-black tracking-widest uppercase">Launch Cinematic Mode</span>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 text-[8px] font-mono opacity-50 uppercase">23.976 FPS // 4:4:4</div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-end space-y-12 lg:w-1/4">
                        <div className="space-y-8">
                          <div className="space-y-2">
                             <span className="text-[#ff4d00] font-black italic uppercase text-xs tracking-widest">Theatrical Cut</span>
                             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[calc(-0.05em)] leading-none italic">
                              {selectedVideo.title}
                            </h2>
                          </div>
                          
                          <p className="text-white/50 text-base leading-relaxed font-mono uppercase tracking-tight">
                            {selectedVideo.description || "A cinematic journey through high-fidelity visuals and immersive soundscapes. Engineered for the silver screen."}
                          </p>

                          <div className="space-y-4 pt-12 border-t border-white/10">
                             <div className="flex justify-between font-mono text-[10px] opacity-40">
                                <span>RUNTIME</span>
                                <span>{realDuration || selectedVideo.duration || "2:15"}</span>
                             </div>
                             <div className="flex justify-between font-mono text-[10px] opacity-40">
                                <span>LOCATION</span>
                                <span>{selectedVideo.code}</span>
                             </div>
                             <div className="flex justify-between font-mono text-[10px] opacity-40">
                                <span>BITRATE</span>
                                <span>MASTER_RAW</span>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {selectedVideo.url && (
                            <button 
                              onClick={() => setIsCinemaMode(true)}
                              className="w-full p-5 border border-white/20 text-white text-sm font-black uppercase tracking-widest hover:border-[#ff4d00] hover:text-[#ff4d00] transition-all rounded-none flex items-center justify-center gap-3 italic"
                            >
                              <Zap size={18} />
                              Launch Cinematic View
                            </button>
                          )}
                          <button 
                            onClick={() => navigate('/contact')}
                            className="w-full p-8 border border-[#ff4d00] text-[#ff4d00] text-lg font-black uppercase tracking-widest hover:bg-[#ff4d00] hover:text-black transition-all italic"
                          >
                            Book Production
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI Hud Layout */}
      <div className="fixed inset-0 pointer-events-none z-[100] p-12 border border-white/5">
        {/* Viewfinder Corners */}
        <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-12 right-12 w-8 h-8 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-12 right-12 w-8 h-8 border-b-2 border-r-2 border-white/10" />
        
        {/* Rec Dot */}
        <div className="absolute top-12 right-24 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">REC</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-12 left-24 z-[102]">
        <motion.button 
          whileHover={{ scale: 1.1, x: -5 }}
          onClick={() => navigate('/')}
          className="w-16 h-16 rounded-sm bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
        >
          <ArrowLeft size={24} />
        </motion.button>
      </nav>

      {/* Hero Section */}
      <section className="h-[120vh] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] z-10" />
        
        <div className="relative z-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <span className="text-[10px] uppercase tracking-[1.5em] text-[#ff4d00] font-black italic block mb-12">The Apex Experience</span>
            <h1 className="text-[12vw] md:text-[16vw] font-black uppercase leading-[0.7] tracking-tighter italic">
              Theatrical
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-transparent inline-block pr-[0.3em] -mr-[0.3em]">Trailer</span>
            </h1>
          </motion.div>
          
          <div className="flex justify-center gap-8 pt-12">
            {[MonitorPlay, Scissors, Play].map((Icon, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.2, y: 0 }}
                transition={{ delay: 1 + (i * 0.2) }}
                className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full"
              >
                <Icon size={20} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ambient Moving Elements */}
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[pan_5s_linear_infinite]" />
      </section>

      {/* Main Content */}
      <main className="space-y-[10vh]">
        {videos.map((video, index) => (
          <TrailerCard key={video.id} video={video} index={index} onSelect={setSelectedVideo} />
        ))}
      </main>

      {/* CTA Final */}
      <section className="mt-32 px-[6vw]">
        <div className="relative bg-[#111] overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-1000" />
          <div className="relative z-10 p-[10vw] text-center space-y-12">
            <h2 className="text-[clamp(1.1rem,10vw,14rem)] md:text-[clamp(3.5rem,10vw,14rem)] font-black uppercase leading-[0.8] tracking-tighter italic">
              Direct Your
              <br />
              Narrative
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <button 
                onClick={() => navigate('/contact')}
                className="w-full md:w-auto px-16 py-6 border-2 border-white text-white hover:bg-white hover:text-black transition-all text-xl font-black uppercase tracking-widest italic"
              >
                Assemble Team
              </button>
              <div className="text-left font-mono text-[9px] uppercase tracking-widest opacity-40">
                // AVAILABILITY: LIMITED
                <br />
                // ENGAGEMENT: Q4 OPEN
                <br />
                // LOCATION: LAS VEGAS / LOS ANGELES
              </div>
            </div>
          </div>
        </div>

      </section>

      <footer className="mt-32 p-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
        <div className="flex gap-12 text-[9px] font-mono tracking-widest uppercase italic">
          <span>THX Ready</span>
          <span>IMAX Enhanced</span>
        </div>
        <span className="text-[9px] font-mono tracking-[0.8em] uppercase">Built by 6Frame // 2026</span>
      </footer>
    </div>
  );
}
