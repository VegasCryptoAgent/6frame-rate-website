import { motion } from 'motion/react';
import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 20,
  direction = 'left',
  className = ''
}) => {
  const xTranslation = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div
      className={`relative overflow-hidden w-[100vw] -mx-[4vw] py-6 border-y cursor-pointer ${className}`}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: xTranslation }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ pointerEvents: 'none' }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="flex items-center px-6 text-[clamp(2rem,6vw,8rem)] font-black uppercase italic tracking-tighter leading-none"
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
