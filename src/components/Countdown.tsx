import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownProps {
  targetDateStr?: string; // ISO format or string representation
  lang?: 'en' | 'hi' | 'mix';
}

export default function Countdown({ targetDateStr = '2027-02-22T11:00:00', lang = 'mix' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const items = [
    { label: 'Days', value: timeLeft.days, hindi: 'दिन' },
    { label: 'Hours', value: timeLeft.hours, hindi: 'घंटे' },
    { label: 'Minutes', value: timeLeft.minutes, hindi: 'मिनट' },
    { label: 'Seconds', value: timeLeft.seconds, hindi: 'सेकंड' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.88 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="py-8 px-4 flex flex-col items-center justify-center text-center"
    >
      <motion.p
        variants={itemVariants}
        className="text-saffron font-wedding-devanagari text-xs md:text-sm uppercase tracking-widest mb-1.5 font-bold"
      >
        {lang === 'mix'
          ? 'शुभ विवाह उत्सव उलटी गिनती / Auspicious Countdown'
          : lang === 'en'
            ? 'Auspicious Marriage Countdown'
            : 'शुभ विवाह उत्सव उलटी गिनती'
        }
      </motion.p>

      <motion.h3
        variants={itemVariants}
        className="text-wedding-maroon font-wedding-display text-xl md:text-2xl font-extrabold tracking-wide"
      >
        {lang === 'mix'
          ? 'पावन परिणय बेला... (Tying the Knot In...)'
          : lang === 'en'
            ? 'Tying the Knot In...'
            : 'पावन परिणय बेला...'
        }
      </motion.h3>

      <motion.div
        variants={itemVariants}
        className="w-16 h-1 bg-gradient-to-r from-transparent via-royal-gold to-transparent my-3"
      />

      {timeLeft.isOver ? (
        <motion.div
          variants={itemVariants}
          className="text-wedding-crimson font-wedding-devanagari text-xl font-bold mt-4"
        >
          {lang === 'mix'
            ? 'शुभ विवाह की हार्दिक शुभकामनाएं! 🎉 (Happy Shubh Vivah!)'
            : lang === 'en'
              ? 'Heartiest Congratulations on Shubh Vivah! 🎉'
              : 'शुभ विवाह की हार्दिक शुभकामनाएं! 🎉'
          }
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-4 gap-1.5 md:gap-4 mt-4 max-w-xl w-full"
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.05, boxShadow: '0px 12px 24px rgba(139,28,45,0.12)' }}
              whileTap={{ scale: 0.96 }}
              className="relative bg-white/85 backdrop-blur-sm border border-royal-gold/30 rounded-xl py-2 px-1 md:p-4 flex flex-col items-center justify-center shadow-md overflow-hidden group hover:border-royal-gold transition-all duration-300 cursor-default"
            >
              {/* Corner Traditional Accents */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-wedding-maroon" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-wedding-maroon" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-wedding-maroon" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-wedding-maroon" />

              <span className="text-2xl md:text-3xl font-bold text-wedding-crimson font-wedding-display">
                {String(item.value).padStart(2, '0')}
              </span>

              <span className="text-[9px] md:text-xs font-bold text-royal-gold uppercase tracking-wider mt-1 block">
                {lang === 'mix' ? (
                  <span className="block text-center text-[9px] leading-tight">
                    <span className="block font-wedding-devanagari text-wedding-maroon font-bold">{item.hindi}</span>
                    <span className="block text-[8px] text-gray-400 font-semibold">{item.label}</span>
                  </span>
                ) : lang === 'en' ? (
                  item.label
                ) : (
                  item.hindi
                )}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
