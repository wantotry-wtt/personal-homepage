"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  sentences: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
}

export function Typewriter({
  sentences,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDelay = 2000,
}: TypewriterProps) {
  const [text, setText] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!sentences || sentences.length === 0) return;

    let timeoutId: NodeJS.Timeout;

    const handleTyping = () => {
      const currentSentence = sentences[sentenceIndex];

      if (isDeleting) {
        setText((prev) => prev.slice(0, -1));
        if (text === '') {
          setIsDeleting(false);
          setSentenceIndex((prev) => (prev + 1) % sentences.length);
        }
      } else {
        setText((prev) => currentSentence.slice(0, prev.length + 1));
        if (text === currentSentence) {
          timeoutId = setTimeout(() => setIsDeleting(true), pauseDelay);
          return; // Wait for pauseDelay before deleting
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    timeoutId = setTimeout(handleTyping, speed);

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, sentenceIndex, sentences, typingSpeed, deletingSpeed, pauseDelay]);

  return (
    <div className="flex items-center text-xl md:text-2xl font-medium text-zinc-800 dark:text-zinc-200 min-h-[40px]">
      <span>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="w-[2px] h-[1.2em] bg-blue-500 ml-1 inline-block"
      />
    </div>
  );
}
