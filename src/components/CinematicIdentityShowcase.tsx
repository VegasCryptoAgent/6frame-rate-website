import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'motion/react';
import { ArrowLeft, Hexagon, Zap, Target, Layers, Share2, Check } from 'lucide-react';
import Marquee from './Marquee.tsx';
import LazyVideo from './LazyVideo.tsx';
import { Video, subscribeToVideos, testConnection } from '../services/videoService';

const GH = "https://github.com/VegasCryptoAgent/6frame-rate-website/releases/download/video-assets-v1";

const DEFAULT_VIDEOS: Video[] = [
  {
    id: '1',
    showcaseId: 'cinematic-identity',
    title: "6Frame Reel",
    code: "6F-SR",
    url: `${GH}/Let.Them.See.You.mp4`,
    order: 1,
    description: "The definitive 6Frame showreel, showcasing our range of cinematic capabilities across various projects.",
    duration: "1:20"
  },
  {
    id: '2',
    showcaseId: 'cinematic-identity',
    title: "1810 Series Intro Credits",
    code: "AF-775",
    url: `${GH}/6Frame.Pitch.Deck.mp4`,
    order: 2,
    description: "Elegant and sophisticated intro credits for the 1810 Series, using abstract visuals to set a premium tone.",
    duration: "0:45"
  },
  {
    id: '3',
    showcaseId: 'cinematic-identity',
    title: "Pitch Deck",
    code: "PD-3",
    url: `${GH}/Pitch.Deck.3.mp4`,
    order: 3,
    description: "A dynamic pitch deck presentation video, designed to captivate audiences and convey complex ideas simply.",
    duration: "1:00"
  },
  {
    id: '4',
    showcaseId: 'cinematic-identity',
    title: "Pearl Harbor",
    code: "PH-04",
    url: `${GH}/Pearl.Harbor.mp4`,
    order: 4,
    description: "Cinematic recreation project focusing on historical atmosphere and high-fidelity rendering.",
    duration: "0:15"
  },
  {
    id: '5',
    showcaseId: 'cinematic-identity',
    title: "Full House Parody",
    code: "NP-05",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/Full%20House%20Parody.mp4?alt=media&token=bc2ce68e-f383-452f-8a48-b78af3efa1d4",
    order: 5,
    description: "A creative parody project, blending retro TV aesthetics with modern motion graphics precision.",
    duration: "0:30"
  },
  {
    id: '6',
    showcaseId: 'cinematic-identity',
    title: "Manifest Nueve Commercial",
    code: "NP-06",
    url: `${GH}/Manifest.Nueve.Commercial.mp4`,
    order: 6,
    description: "Brand commercial for Manifest Nueve, showcasing high-concept visuals and meticulous art direction.",
    duration: "0:45"
  },
  {
    id: '7',
    showcaseId: 'cinematic-identity',
    title: "Eden Festival",
    code: "NP-07",
    url: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0374515011.firebasestorage.app/o/New%20Eden%20Festival%20.mp4?alt=media&token=6cc35bc8-4497-411c-a669-7a0714b04d12",
    order: 7,
    description: "Vibrant and energetic promo for the Eden Festival, capturing the spirit of live experience through motion.",
    duration: "0:25"
  }
];

interface IdentityCardProps {
  video: Video;
  index: number;
  onSelect: (video: Video) => void;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ video, index, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [copied, setCopied] = useState(false);
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(video.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }

    // Try to use native share if available (best for texting on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `6Frame: ${video.title}`,
          text: `Check out this ${video.title} cinematic identity from 6Frame!`,
          url: video.url,
        });
      } catch (err) {
        console.log('Share aborted or failed', err);
      }
    } else {
      // Fallback to SMS
      const smsBody = `Check out this video from 6Frame: ${video.url}`;
      window.location.href = `sms:?body=${encodeURIComponent(smsBody)}`;
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center p-[4vw] overflow-hidden ${index % 2 === 0 ? 'bg-[#F5F0E8]' : 'bg-white'}`}
    >
      <motion.div 
        animate={{ 
          scale: isInView ? 1.1 : 1,
          opacity: isInView ? 0.05 : 0
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-black font-black text-[30vw] uppercase tracking-tighter"
      >
        {video.title.split(' ')[0]}
      </motion.div>

      <div className={`relative z-10 w-full max-w-7xl flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-4 lg:gap-[6vw]`}>
        <div className="w-full lg:w-[50%] group relative z-20">
          <div 
            onClick={(e) => {
              console.log("Expanding identity:", video.title);
              onSelect(video);
            }}
            className="cursor-pointer"
          >
            <div className="absolute -inset-8 border border-black/5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
            <div className="aspect-video w-full overflow-hidden bg-black relative shadow-2xl">
              <LazyVideo 
                src={video.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain transition-all duration-[1.5s]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
                 <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-md text-black px-8 py-4 text-xs font-black uppercase tracking-widest">
                      View Identity Specs
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Share Button on Card */}
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={handleShare}
              className="p-4 bg-white/80 backdrop-blur-md border border-black/10 hover:bg-black hover:text-white transition-all flex items-center gap-3 group/share shadow-lg"
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

        <div className="w-full lg:w-[45%] space-y-4 md:space-y-8 text-black">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#ff4d00]" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-[#ff4d00]">Identity Level 0{index + 1}</span>
          </div>
          
          <h3 className="text-[clamp(1.1rem,10vw,8rem)] xl:text-[clamp(2.2rem,3vw,3.5rem)] font-black uppercase leading-[0.8] tracking-tighter">
            {video.title.split(' ')[0]}
            <br />
            <span className="italic block pl-12 text-[#ff4d00]">{video.title.split(' ')[1]}</span>
          </h3>

          <p className="text-black/60 font-medium text-lg leading-relaxed max-w-[30ch]">
            {video.description || "A complete overhaul of the visual DNA. We don't just create logos, we define how your brand breathes in a digital world."}
          </p>

          <div className="pt-8 flex gap-12 border-t border-black/10">
             <div>
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Render Time</span>
               <p className="text-sm font-black">480 hrs / 4K</p>
             </div>
             <div>
               <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Complexity</span>
               <p className="text-sm font-black">Grade A++</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CinematicIdentityShowcase() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>(DEFAULT_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    testConnection();

    // Subscribe to videos from Firebase
    const unsubscribe = subscribeToVideos('cinematic-identity', (fetchedVideos) => {
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
          text: `Check out this cinematic identity: ${selectedVideo.title}`,
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
    <div ref={containerRef} className="bg-[#F5F0E8] text-black selection:bg-black selection:text-white">
      {/* Video Detail Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[200] bg-white backdrop-blur-2xl transition-colors duration-700 ${isCinemaMode ? 'bg-black overflow-hidden' : 'overflow-y-auto'}`}
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
                  <div className="bg-white/80 backdrop-blur-md px-6 py-2 border border-black/10 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60">
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
                          className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#ff4d00] hover:text-white transition-all shadow-xl"
                        >
                          Exit Cinema Mode _ [ESC]
                        </button>
                        <div className="text-[10px] font-mono tracking-widest opacity-40 uppercase text-white hidden sm:block">
                          {selectedVideo.title} // BRAND DNA UNIT
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
                    <div className="flex justify-between items-center text-black shrink-0">
                      <span className="font-mono text-[#ff4d00] tracking-[0.5em] text-xs uppercase">Identity.Specs</span>
                      <div className="flex gap-4">
                        <button 
                          onClick={handleDetailShare}
                          className="flex items-center gap-3 p-4 rounded-full border border-black/10 hover:bg-black hover:text-white transition-all uppercase text-[10px] tracking-widest font-bold"
                        >
                          {detailCopied ? (
                            <>
                              <Check size={14} className="text-green-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={14} />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedVideo(null);
                            setIsCinemaMode(false);
                          }}
                          className="p-4 rounded-full border border-black/10 hover:bg-black/5 transition-colors uppercase text-[10px] tracking-widest font-bold font-black"
                        >
                          Close _ [ESC]
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 flex-grow items-center">
                      <div className="lg:w-2/3 max-h-[60vh] overflow-hidden">
                        <div 
                          onClick={() => setIsCinemaMode(true)}
                          className="relative group cursor-pointer overflow-hidden aspect-video shadow-2xl bg-black hover:outline hover:outline-4 hover:outline-[#ff4d00]/20"
                        >
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
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-opacity">
                            <div className="bg-white px-8 py-4 text-[10px] font-black tracking-widest uppercase text-black">
                              Expand Cinema Mode
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md text-black text-[10px] font-mono border border-black/10">
                            REF: {selectedVideo.code} // ID: {selectedVideo.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between space-y-12 lg:w-1/3">
                        <div className="space-y-8">
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black">
                            {selectedVideo.title}
                          </h2>
                          <p className="text-black/60 text-lg leading-relaxed font-medium">
                            {selectedVideo.description || "A complete overhaul of the visual DNA. We don't just create logos, we define how your brand breathes in a digital world."}
                          </p>

                          <div className="grid grid-cols-1 gap-6 pt-12 border-t border-black/10">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Duration</span>
                              <span className="text-sm font-black">{realDuration || selectedVideo.duration || "1:20"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Identity Code</span>
                              <span className="text-sm font-black">{selectedVideo.code}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Grade</span>
                              <span className="text-sm font-black italic">Experimental</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <button 
                            onClick={() => setIsCinemaMode(true)}
                            className="w-full p-5 border-2 border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-none flex items-center justify-center gap-3"
                          >
                            <Zap size={18} />
                            Enter Cinema Mode
                          </button>
                          <button 
                            onClick={() => navigate('/contact')}
                            className="w-full p-8 bg-black text-white text-xl font-black uppercase tracking-widest hover:bg-[#ff4d00] transition-all rounded-none"
                          >
                            Request Brand Evolution
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

      {/* HUD UI */}
      <div className="fixed inset-0 pointer-events-none z-[100] p-8 border-[0.5vw] border-black/5">
        <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 text-[8px] font-mono tracking-widest uppercase">
          <div className="flex gap-2">
            <span className="opacity-30">Status:</span>
            <span className="text-[#ff4d00] animate-pulse">Scanning DNA</span>
          </div>
          <span>Ref: 6F_IDENTITY_SYSTEM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="fixed top-12 left-12 z-[102]">
        <motion.button 
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={() => navigate('/')}
          className="w-16 h-16 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-xl group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform duration-300" />
        </motion.button>
      </nav>

      {/* Hero */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-white">
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <Hexagon size={64} className="text-[#ff4d00] animate-[spin_10s_linear_infinite]" />
          </motion.div>
          <h1 className="text-[clamp(1.1rem,12vw,14rem)] font-black uppercase leading-[0.75] tracking-tighter">
            Cinematic
            <br />
            <span className="text-[#ff4d00] inline-block pr-[0.3em] -mr-[0.3em]">Identity</span>
          </h1>
          <p className="mt-12 text-[10px] uppercase tracking-[1em] font-bold opacity-30">
            Total Brand Evolution
          </p>
        </motion.div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 grid grid-cols-12 h-full w-full pointer-events-none opacity-[0.03]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full" />
          ))}
        </div>
      </section>

      {/* Content */}
      <main>
        {videos.map((video, index) => (
          <IdentityCard key={video.id} video={video} index={index} onSelect={setSelectedVideo} />
        ))}
      </main>

      {/* Final Call */}
      <section className="h-screen flex flex-col items-center justify-center p-8 bg-black text-white relative">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-center space-y-12"
        >
          <h2 className="text-[clamp(1.1rem,10vw,12rem)] font-black uppercase leading-tight tracking-[calc(-0.05em)]">
            Evolve <br />
            <span className="text-[#ff4d00]">Now</span>
          </h2>
          <button 
            onClick={() => navigate('/contact')}
            className="px-16 py-8 border-2 border-[#ff4d00] text-[#ff4d00] hover:bg-[#ff4d00] hover:text-black transition-all text-xl font-black uppercase tracking-widest rounded-none"
          >
            Start Evolution
          </button>
        </motion.div>
        

        <div className="absolute bottom-12 flex gap-24 text-[10px] uppercase tracking-[0.5em] font-bold opacity-30 md:hidden lg:flex">
          <span>Vision 03</span>
          <span>Las Vegas / Los Angeles</span>
          <span>Built for the future</span>
        </div>
      </section>
    </div>
  );
}
