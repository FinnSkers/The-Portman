"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioTemplateCard } from '@/components/portfolio/PortfolioTemplateCard';
import { AnimatedButton } from '@/components/ui';

const PORTFOLIO_TEMPLATES = [
  {
    id: 'template1',
    title: 'Professional',
    imageSrc: '/images/templates/professional.jpg',
    description: 'A clean, professional template perfect for corporate jobs.',
    tags: ['Minimal', 'Corporate', 'Clean'],
  },
  {
    id: 'template2',
    title: 'Creative',
    imageSrc: '/images/templates/creative.jpg',
    description: 'Show off your creative skills with this vibrant design.',
    tags: ['Colorful', 'Modern', 'Designer'],
  },
  {
    id: 'template3',
    title: 'Developer',
    imageSrc: '/images/templates/developer.jpg',
    description: 'Highlight your coding projects and technical skills.',
    tags: ['Code', 'Technical', 'Dark Mode'],
  },
  {
    id: 'template4',
    title: 'Executive',
    imageSrc: '/images/templates/executive.jpg',
    description: 'Sophisticated layout for senior professionals.',
    tags: ['Elegant', 'Leadership', 'Premium'],
  },
  {
    id: 'template5',
    title: 'Startup',
    imageSrc: '/images/templates/startup.jpg',
    description: 'Modern and innovative look for entrepreneurs.',
    tags: ['Dynamic', 'Bold', 'Innovative'],
  },
  {
    id: 'template6',
    title: 'Academic',
    imageSrc: '/images/templates/academic.jpg',
    description: 'Perfect for researchers, professors, and scholars.',
    tags: ['Research', 'Publications', 'Formal'],
  },
];

interface PortfolioTemplateSelectorProps {
  onSelect: (templateId: string) => void;
  defaultSelected?: string;
}

export const PortfolioTemplateSelector: React.FC<PortfolioTemplateSelectorProps> = ({
  onSelect,
  defaultSelected,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(defaultSelected || '');
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Choose a Template</h2>
        <p className="text-gray-600 mt-1">
          Select a template that best represents your professional style.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_TEMPLATES.map((template) => (
          <PortfolioTemplateCard
            key={template.id}
            title={template.title}
            imageSrc={template.imageSrc}
            description={template.description}
            tags={template.tags}
            isSelected={selectedTemplate === template.id}
            onSelect={() => handleTemplateSelect(template.id)}
          />
        ))}
      </div>
      
      <div className="flex justify-end">
        <AnimatedButton
          onClick={handleConfirm}
          disabled={!selectedTemplate}
          variant="primary"
          animationVariant="pulse"
        >
          Continue with {selectedTemplate ? PORTFOLIO_TEMPLATES.find(t => t.id === selectedTemplate)?.title : 'Selected'} Template
        </AnimatedButton>
      </div>
    </div>
  );
};
