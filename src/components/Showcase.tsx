import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Box, Activity, ShieldCheck, CornerRightDown, Share2, Check } from 'lucide-react';
import Marquee from './Marquee.tsx';
import LazyVideo from './LazyVideo.tsx';
import { Video, subscribeToVideos, testConnection } from '../services/videoService';

const GH = "https://6frame-videos.lvbretteam.workers.dev";

const DEFAULT_VIDEOS: Video[] = [
  {
    id: '1',
    showcaseId: 'premium-motion',
    title: "JMI Entertainment Logo",
    code: "6F-SR",
    url: `${GH}/Upscale.JMI.Logo.mp4`,
    order: 1,
    description: "A cinematic logo reveal for JMI Entertainment — built with dynamic lighting rigs, layered particle systems, and premium material textures that demand attention from the first frame.",
    duration: "0:12"
  },
  {
    id: '2',
    showcaseId: 'premium-motion',
    title: "1810 Series Promo",
    code: "AF-775",
    url: `${GH}/1810.Short.Commercial.mp4`,
    order: 2,
    description: "A high-energy promotional spot for the 1810 Series — razor-sharp motion graphics, luxury pacing, and technical precision woven together into a short-form commercial built to convert.",
    duration: "0:30"
  },
  {
    id: '3',
    showcaseId: 'premium-motion',
    title: "IndeRoc Logo",
    code: "PD-3",
    url: `${GH}/IndeRoc.Logo.mp4`,
    order: 3,
    description: "A bold logo reveal for IndeRoc — raw, organic textures collide with structured composition to create a brand mark that hits hard and stays in your memory long after the screen goes dark.",
    duration: "0:08"
  },
  {
    id: '4',
    showcaseId: 'premium-motion',
    title: "6Frame Projector Logo",
    code: "JMI-EN",
    url: `${GH}/FilmProjector.Commercial.mp4`,
    order: 4,
    description: "The 6Frame Studio projector logo — a cinematic identity piece that fuses vintage film culture with modern motion design. Every frame engineered to feel like the start of something legendary.",
    duration: "0:15"
  },
  {
    id: '5',
    showcaseId: 'premium-motion',
    title: "6Frame Batman Commercial",
    code: "NP-05",
    url: `${GH}/6Frame.Batman.Commercial.mp4`,
    order: 5,
    description: "6Frame takes on Gotham — a full-scale Batman commercial built with advanced 3D motion techniques, dramatic lighting, and iconic character-driven storytelling at a cinematic level.",
    duration: "0:45"
  },
  {
    id: '6',
    showcaseId: 'premium-motion',
    title: "6Frame Commercial",
    code: "NP-06",
    url: `${GH}/6Frame.Commercial.New.mp4`,
    order: 6,
    description: "A flagship 6Frame Studio commercial — polished production from concept to final render, demonstrating our signature blend of high-end visual effects and results-driven brand storytelling.",
    duration: "1:00"
  },
  {
    id: '7',
    showcaseId: 'premium-motion',
    title: "Be Afraid. Be Very Afraid.",
    code: "NP-07",
    url: `${GH}/Be.Afraid.mp4`,
    order: 7,
    description: "A visceral motion piece designed to stop the scroll dead. Tension-driven visual language, aggressive pacing, and a sound design that makes the audience feel something before they even know why.",
    duration: "0:10"
  },
  {
    id: '8',
    showcaseId: 'premium-motion',
    title: "6Frame Studio Logo",
    code: "NP-08",
    url: `${GH}/6Frame.Commercial.v2.mp4`,
    order: 8,
    description: "The official 6Frame Studio brand mark in motion — a distillation of everything we stand for. Precision, impact, and a visual identity forged to represent the highest tier of motion design.",
    duration: "0:12"
  },
  {
    id: '9',
    showcaseId: 'premium-motion',
    title: "Tesla F*ck Around and Find Out",
    code: "NP-09",
    url: `${GH}/Tesla.mp4`,
    order: 9,
    description: "A no-holds-barred Tesla commercial with an attitude to match. Kinetic energy, bold type, and a message that lands like a punch — proof that the best brand films don't ask for permission.",
    duration: "0:50"
  },
  {
    id: '10',
    showcaseId: 'premium-motion',
    title: "1810 Series Commercial",
    code: "NP-10",
    url: `${GH}/6Frame.Sizzle.Reel.mp4`,
    order: 10,
    description: "A full production commercial for the 1810 Series — luxury pacing, immersive sound design, and motion graphics engineered to position the brand at the intersection of art and commerce.",
    duration: "0:40"
  },
  {
    id: '11',
    showcaseId: 'premium-motion',
    title: "1810 Series Intro",
    code: "NP-11",
    url: `${GH}/6Frame.Opening.Scene.mp4`,
    order: 11,
    description: "The opening sequence for the 1810 Series — a cinematic title card that sets the tone before a single word of dialogue is spoken. Atmosphere, tension, and brand identity locked in from frame one.",
    duration: "0:35"
  },
  {
    id: '12',
    showcaseId: 'premium-motion',
    title: "6Frame Director Commercial",
    code: "NP-12",
    url: `${GH}/6Frame.Director.Commercial.mp4`,
    order: 12,
    description: "A director's cut commercial from 6Frame Studio — uncompromised creative vision, premium production value, and the kind of visual storytelling that only comes from a team operating at the absolute top of its craft.",
    duration: "1:00"
  },
  {
    id: '13',
    showcaseId: 'premium-motion',
    title: "6Frame Superman Commercial",
    code: "NP-13",
    url: `${GH}/6Frame.Superman.Commercial.mp4`,
    order: 13,
    description: "6Frame brings the Man of Steel to life — a Superman commercial built on complex character animation, epic environmental design, and a cinematic scope that puts studio-grade production in your hands.",
    duration: "0:45"
  }
];

interface VideoCardProps {
  video: Video;
  index: number;
  onSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index, onSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
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
          text: `Check out this motion design project: ${video.title}`,
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
      className={`relative min-h-screen flex items-center justify-center p-[4vw] overflow-hidden ${index % 2 === 0 ? 'bg-[#000]' : 'bg-[#050505]'}`}
    >
      {/* Background Big Text */}
      <motion.div 
        style={{ x: index % 2 === 0 ? '-20%' : '20%' }}
        animate={{ x: isInView ? (index % 2 === 0 ? '10%' : '-10%') : (index % 2 === 0 ? '-20%' : '20%') }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none whitespace-nowrap overflow-hidden select-none"
      >
        <span className="text-[30vw] font-black text-white/[0.02] uppercase tracking-tighter italic">
          {video.title.split(' ')[0]}
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center gap-4 lg:gap-[4vw]">
        {/* The Frame */}
        <div
          onClick={(e) => {
            console.log("Expanding project:", video.title);
            onSelect(video);
          }}
          style={{ touchAction: 'manipulation' }}
          className="relative w-full lg:w-[50%] aspect-video group cursor-pointer z-20"
        >
          {/* Animated Borders */}
          <div className="absolute -inset-4 border border-white/5 group-hover:border-white/20 transition-colors duration-700" />
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/40" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/40" />
          
          {/* Video Container */}
          <div className="w-full h-full overflow-hidden bg-black relative">
             <LazyVideo 
                src={video.url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain transition-all duration-[2s]"
              />
          </div>
          
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 flex items-center justify-center transition-colors duration-500">
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
               <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20">
                  <span className="text-xs font-black tracking-widest uppercase">Expand Project</span>
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

        {/* Content */}
        <div className="w-full lg:w-[45%] space-y-4 md:space-y-8">
          <div className="space-y-2 md:space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span className="text-white/60 font-mono text-sm tracking-[0.5em] block uppercase">
                Sequence.0{index + 1}
              </span>
              <div className="h-[1px] flex-grow bg-white/20" />
            </motion.div>
            <h3 className="text-[clamp(1rem,8vw,10rem)] xl:text-[clamp(2.2rem,3.2vw,3.8rem)] font-black uppercase leading-[0.8] tracking-tighter">
              {video.title.split(' ')[0]}
              <br />
              <span className="text-white/20 italic">{video.title.split(' ')[1]}</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity size={10} className="text-[#ff4d00]" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">Visual Specs</span>
              </div>
              <p className="text-xs uppercase font-bold">120 FPS // HDR10+</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-[#ff4d00]" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">Art Direction</span>
              </div>
              <p className="text-xs uppercase font-bold">Hyper-Realistic</p>
            </div>
          </div>

          <motion.div
            whileHover={{ x: 10 }}
            onClick={(e) => {
              console.log("Extracting brief:", video.title);
              onSelect(video);
            }}
            style={{ touchAction: 'manipulation' }}
            className="inline-flex items-center gap-4 text-[#ff4d00] cursor-pointer group z-20"
          >
            <div className="w-12 h-12 rounded-full border border-[#ff4d00]/30 flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-black transition-all">
              <CornerRightDown size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.4em]">Extract Brief</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Showcase() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>(DEFAULT_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 15]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const progressWidth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

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
          text: `Check out this motion design: ${selectedVideo.title}`,
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
  useEffect(() => {
    window.scrollTo(0, 0);
    testConnection();

    const unsubscribe = subscribeToVideos('premium-motion', (fetchedVideos) => {
      if (fetchedVideos.length > 0) {
        setVideos(fetchedVideos.map(v => {
          const defaultVideo = DEFAULT_VIDEOS.find(dv => dv.id === v.id || dv.order === v.order);
          return {
            ...defaultVideo,
            ...v,
            url: defaultVideo?.url ?? v.url,
          };
        }));
      }
    });

    return () => {
      unsubscribe();
      setIsCinemaMode(false);
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-[#ff4d00] selection:text-black font-sans">
      {/* Video Detail Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl transition-colors duration-700 ${isCinemaMode ? 'bg-black overflow-hidden' : 'overflow-y-auto'}`}
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
                  <div className="bg-black/60 backdrop-blur-md px-6 py-2 border border-white/10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/60">
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
                      
                      {/* Back button and info in Cinema Mode */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <button 
                          onClick={() => setIsCinemaMode(false)}
                          className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
                        >
                          Exit Cinema Mode _ [ESC]
                        </button>
                        <div className="text-[10px] font-mono tracking-widest opacity-40 uppercase hidden sm:block">
                          {selectedVideo.title} // 4K STICKY REEL
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
                    <div className="flex flex-wrap justify-between items-center gap-4 shrink-0">
                      <span className="font-mono text-[#ff4d00] tracking-[0.5em] text-xs uppercase">Project.Details</span>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={handleDetailShare}
                          className="flex items-center gap-3 p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all uppercase text-[10px] tracking-widest font-bold"
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
                          className="p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors uppercase text-[10px] tracking-widest font-bold"
                        >
                          Close _ [ESC]
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 flex-grow">
                      <div className="lg:w-2/3 max-h-[40vh] md:max-h-[60vh] overflow-hidden">
                        <div 
                          onClick={() => setIsCinemaMode(true)}
                          className="bg-black relative group cursor-pointer overflow-hidden aspect-video border border-white/5 hover:border-[#ff4d00]/50 shadow-2xl"
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
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-black tracking-widest uppercase">Expand Cinema Mode</span>
                            </div>
                          </div>
                          <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono">
                            SRC: {selectedVideo.code} // {realDuration || selectedVideo.duration}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between space-y-12 lg:w-1/3">
                        <div className="space-y-8">
                          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
                            {selectedVideo.title}
                          </h2>
                          <p className="text-white/60 text-lg leading-relaxed font-medium">
                            {selectedVideo.description || "A masterclass in technical motion design. This project pushed the boundaries of visual fidelity and artistic direction."}
                          </p>

                          <div className="grid grid-cols-1 gap-6 pt-12 border-t border-white/5">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Duration</span>
                              <span className="text-sm font-black italic">{realDuration || selectedVideo.duration || "0:30"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Asset Code</span>
                              <span className="text-sm font-black italic">{selectedVideo.code}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest opacity-40">Resolution</span>
                              <span className="text-sm font-black italic">4K UHD</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <button 
                            onClick={() => setIsCinemaMode(true)}
                            className="w-full p-5 border-2 border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-none flex items-center justify-center gap-3"
                          >
                            <Zap size={18} />
                            Enter Cinema Mode
                          </button>
                          <button 
                            onClick={() => navigate('/contact')}
                            className="w-full p-8 bg-[#ff4d00] text-black text-xl font-black uppercase tracking-widest hover:bg-white transition-all rounded-none"
                          >
                            Inquire About This Service
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

      {/* Permanent Frame UI */}
      <div className="fixed inset-0 pointer-events-none z-[100] border-[1vw] border-black border-opacity-50">
        <div className="absolute top-[2vw] left-[2vw] flex gap-4">
           <div className="w-1 h-1 bg-white animate-pulse" />
           <div className="w-1 h-1 bg-[#ff4d00] animate-pulse delay-100" />
           <div className="w-1 h-1 bg-white/40 animate-pulse delay-200" />
        </div>
        <div className="absolute top-[2vw] right-[2vw] text-[8px] font-mono tracking-widest vertical-rl">
          6FRAME_SYSTEM_v4.0.2 // STABLE
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        style={{ scaleX: progressWidth }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#ff4d00] origin-left z-[101]"
      />

      {/* Navigation */}
      <nav className="fixed top-4 left-4 md:top-12 md:left-12 z-[102]">
        <button
          onClick={() => navigate('/')}
          style={{ touchAction: 'manipulation' }}
          className="group relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-[#ff4d00] transition-colors duration-500 overflow-hidden"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>
      </nav>

      {/* Hero: The Gate */}
      <section className="relative h-[200vh] overflow-hidden">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] aspect-square border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] aspect-square border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          <motion.div 
            style={{ scale: logoScale }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            <motion.div style={{ opacity: logoOpacity }} className="text-center">
               <span className="text-[10px] uppercase tracking-[1em] text-[#ff4d00] font-black block mb-8">Premium Package</span>
               <h1 className="text-[12vw] md:text-[15vw] font-black uppercase leading-none tracking-tighter">
                Premium
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 italic inline-block pb-2 pr-[0.3em] -mr-[0.3em]">Motion</span>
               </h1>
            </motion.div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1 }}
             className="absolute bottom-12 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#ff4d00] to-transparent animate-bounce" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40">Initialize Scroll</span>
          </motion.div>
        </div>
      </section>

      {/* Main Content Gallery */}
      <main className="relative z-10">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} onSelect={setSelectedVideo} />
        ))}
      </main>

      {/* Closing: The Terminal */}
      <section className="relative min-h-screen bg-[#ff4d00] text-black p-[6vw] flex flex-col justify-between overflow-hidden">
        {/* Huge BG Text */}
        <div className="absolute -bottom-20 -left-20 text-[40vw] font-black opacity-10 select-none pointer-events-none">
          END
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <h2 className="text-[clamp(1rem,10vw,12rem)] md:text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-[0.8] tracking-tighter">
              READY TO
              <br />
              <span className="italic">ASCEND?</span>
            </h2>
            <p className="max-w-[40ch] text-lg md:text-xl font-bold uppercase tracking-tight">
              We only accept projects that challenge the status quo. If your brand is ready for this level of intensity, let's talk.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contact')}
            className="bg-black text-white px-[4vw] py-[2vw] text-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-none"
          >
            Initiate Contact
          </motion.button>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-black/20">
          {[
            { label: "Hardware", value: "A6000 Ada" },
            { label: "Pipeline", value: "ACES 1.2" },
            { label: "Studio", value: "Las Vegas / Los Angeles" },
            { label: "Enc", value: "HEVC / AV1" }
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-black opacity-40">{item.label}</span>
              <p className="text-sm font-bold uppercase">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footnote */}
      <footer className="p-8 text-center text-[8px] font-mono tracking-[0.8em] opacity-40 uppercase">
        Designed for the absolute 0.1% // No Compromises // 6Frame Studio
      </footer>
    </div>
  );
}
