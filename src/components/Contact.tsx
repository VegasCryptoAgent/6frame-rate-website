import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Calendar, Clock, Globe, ChevronRight, Check } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    vibe: '',
    budget: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const nextStep = () => setStep(s => s + 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff4d00] selection:text-black font-sans overflow-x-hidden">
      {/* Permanent HUD UI */}
      <div className="fixed inset-0 pointer-events-none z-[100] border border-white/5">
        <div className="absolute top-8 right-8 text-[8px] font-mono tracking-widest text-[#ff4d00]">
          SIGNAL_STRENGTH: 0.98
          <br />
          LOC: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-8 z-[110]">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Abort Transmission</span>
        </button>
      </nav>

      {/* Dynamic Header */}
      <section className="relative pt-24 md:pt-40 pb-12 px-[6vw]">
        <div className="relative z-10 space-y-4">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[#ff4d00] font-mono text-[10px] tracking-[0.8em] block uppercase mb-4">
              Phase {step} // {step === 3 ? 'Authorization' : 'System Diagnostic'}
            </span>
            <h1 className="text-[clamp(1.5rem,8vw,10rem)] md:text-[clamp(3.5rem,8vw,10rem)] font-black uppercase leading-[0.8] tracking-tighter">
              {step === 1 && <>Target <span className="text-white/20 italic">Acquisition</span></>}
              {step === 2 && <>DNA <span className="text-white/20 italic">Profiling</span></>}
              {step === 3 && <>Final <span className="text-white/20 italic">Execution</span></>}
            </h1>
          </motion.div>
        </div>
      </section>

      <main className={`px-[6vw] ${step === 3 ? 'pb-0' : 'pb-32'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Form Content */}
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 block">Identifier Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ENTER NAME..."
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 md:py-6 text-xl md:text-4xl font-black focus:outline-none focus:border-[#ff4d00] transition-colors placeholder:text-white/5 uppercase"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 block">Digital Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ENTER EMAIL..."
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 md:py-6 text-xl md:text-4xl font-black focus:outline-none focus:border-[#ff4d00] transition-colors placeholder:text-white/5 uppercase"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={!formData.name || !formData.email}
                    onClick={nextStep}
                    className="flex items-center gap-6 group text-xl font-black uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Next Sequence 
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-black transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl space-y-16"
                >
                  <div className="space-y-8">
                    <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 block">Primary Objective</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {['Motion Logo', 'Cinematic Identity', 'Theatrical Trailer'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setFormData(prev => ({ ...prev, project: p }))}
                          style={{ touchAction: 'manipulation' }}
                          className={`p-5 md:p-10 border-2 text-left transition-all relative overflow-hidden group ${formData.project === p ? 'border-[#ff4d00] bg-[#ff4d00]/10' : 'border-white/10 hover:border-white/40'}`}
                        >
                          <span className={`text-xl font-black uppercase tracking-tight block ${formData.project === p ? 'text-[#ff4d00]' : 'text-white/60'}`}>{p}</span>
                          {formData.project === p && <Check className="absolute top-4 right-4 text-[#ff4d00]" size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <label className="text-[10px] uppercase tracking-[0.4em] text-white/40 block">Aesthetic DNA</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Brutalist', 'Ethereal', 'Technical', 'Cinematic'].map((v) => (
                        <button
                          key={v}
                          onClick={() => setFormData(prev => ({ ...prev, vibe: v }))}
                          style={{ touchAction: 'manipulation' }}
                          className={`py-4 px-4 md:px-6 border font-bold uppercase text-[10px] tracking-widest transition-all ${formData.vibe === v ? 'bg-white text-black border-white' : 'border-white/10 hover:bg-white/5'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={!formData.project || !formData.vibe}
                    onClick={nextStep}
                    className="flex items-center gap-6 group text-xl font-black uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    Unlock Booking 
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-black transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-12"
                >
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
                    {/* Summary Card */}
                    <div className="w-full lg:w-1/3 bg-white/[0.03] border border-white/10 p-6 md:p-12 space-y-8">
                       <div className="space-y-2">
                         <span className="text-[10px] uppercase tracking-widest text-white/30">Client_Profile</span>
                         <p className="text-2xl font-black uppercase">{formData.name}</p>
                       </div>
                       <div className="space-y-2">
                         <span className="text-[10px] uppercase tracking-widest text-white/30">Objective</span>
                         <p className="text-2xl font-black uppercase text-[#ff4d00]">{formData.project}</p>
                       </div>
                       <div className="pt-8 border-t border-white/10 space-y-6">
                          <p className="text-sm italic text-white/40 leading-relaxed">
                            Diagnostic complete. Your profile aligns with our current production queue. Please select a time slot for your extraction brief.
                          </p>
                          <div className="flex gap-4">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[8px] font-mono tracking-widest uppercase text-green-500">Booking Node Active</span>
                          </div>
                       </div>
                    </div>

                    {/* Success / Redirect Action */}
                    <div className="w-full lg:w-2/3 flex flex-col items-center justify-center border border-[#ff4d00]/30 bg-[#ff4d00]/5 p-8 md:p-20 text-center space-y-12">
                      <div className="space-y-4">
                        <h3 className="text-5xl font-black uppercase tracking-tighter">Transmission <span className="italic text-white/40">Verified</span></h3>
                        <p className="max-w-[40ch] text-white/60 mx-auto">
                          Your profile has been encrypted and sent to our tactical unit. Finalize your appointment on our secure booking server.
                        </p>
                      </div>
                      
                      <button 
                         onClick={() => window.open(`https://calendly.com/6framestudio?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.project)}&a2=${encodeURIComponent(formData.vibe)}`, '_blank')}
                         className="group flex flex-col items-center gap-6"
                      >
                         <div className="w-32 h-32 rounded-full border-2 border-[#ff4d00] flex items-center justify-center group-hover:bg-[#ff4d00] group-hover:text-black transition-all duration-500">
                           <Calendar size={40} className="group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-xs font-black uppercase tracking-[0.5em] text-[#ff4d00]">Open Secure Calendar</span>
                      </button>

                      <div className="pt-12 flex gap-4 items-center justify-center text-[10px] uppercase font-mono tracking-widest text-white/20">
                         <div className="w-2 h-2 rounded-full bg-green-500" />
                         <span>DIRECT_LINK_READY_FOR_HANDOFF</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

    </div>
  );
}

