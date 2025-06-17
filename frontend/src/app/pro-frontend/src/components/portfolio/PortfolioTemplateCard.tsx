"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui';

interface PortfolioTemplateCardProps {
  title: string;
  imageSrc: string;
  description: string;
  tags: string[];
  isSelected?: boolean;
  onSelect: () => void;
}

export const PortfolioTemplateCard: React.FC<PortfolioTemplateCardProps> = ({
  title,
  imageSrc,
  description,
  tags,
  isSelected = false,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        rounded-lg overflow-hidden shadow-md bg-white transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
      onClick={onSelect}
    >
      <div className="aspect-w-16 aspect-h-9 relative bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          {/* Replace with actual image: */}
          {/* <Image src={imageSrc} alt={title} fill className="object-cover" /> */}
          <p>Template preview image placeholder</p>
        </div>
        
        {isSelected && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
