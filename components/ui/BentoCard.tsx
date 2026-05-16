"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, AtSign, Link as LinkIcon, FileText, BarChart2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BentoCardProps {
  title: string;
  description?: string;
  type: 'project' | 'article' | 'social' | 'stats';
  link?: string;
  size: 'small' | 'medium' | 'large';
  className?: string;
}

export function BentoCard({ title, description, type, link, size, className }: BentoCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'project': return <LinkIcon className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'social': return <AtSign className="w-5 h-5" />;
      case 'stats': return <BarChart2 className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1 md:col-span-1 md:row-span-2',
    large: 'col-span-2 row-span-2',
  };

  const CardContent = () => (
    <div className="flex flex-col h-full p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
          {getIcon()}
        </div>
        {link && (
          <div className="p-1.5 rounded-full bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const containerClasses = twMerge(
    clsx(
      'group relative overflow-hidden rounded-3xl glass hover:glass-hover transition-all duration-300 cursor-pointer',
      sizeClasses[size],
      className
    )
  );

  if (link) {
    return (
      <motion.a
        href={link}
        target={link.startsWith('http') ? '_blank' : '_self'}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        className={containerClasses}
      >
        <CardContent />
      </motion.a>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      className={containerClasses}
    >
      <CardContent />
    </motion.div>
  );
}
