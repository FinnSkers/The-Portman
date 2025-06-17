"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TemplateCardProps {
  image: string;
  name: string;
  description: string;
  features: string[];
}

const templates: TemplateCardProps[] = [
  {
    image: '/placeholder',
    name: 'Minimal',
    description: 'Clean and minimalist design with focus on content',
    features: ['Light & dark mode', 'Interactive skills charts', 'Timeline view']
  },
  {
    image: '/placeholder',
    name: 'Creative',
    description: 'Vibrant design for creative professionals',
    features: ['Custom color palette', 'Portfolio gallery', 'Unique layout']
  },
  {
    image: '/placeholder',
    name: 'Professional',
    description: 'Corporate-style design for business professionals',
    features: ['Company logo integration', 'Testimonials section', 'PDF download']
  },
  {
    image: '/placeholder',
    name: 'Modern',
    description: 'Contemporary design with bold typography',
    features: ['Animated sections', 'Contact form', 'Social media integration']
  },
  {
    image: '/placeholder',
    name: 'Tech',
    description: 'Perfect for developers and tech professionals',
    features: ['Code snippets', 'GitHub integration', 'Skills radar chart']
  },
];

export const PortfolioTemplates: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
    return (
    <section id="portfolios" ref={ref} className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            Beautiful Portfolio Templates
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            Choose from our collection of professionally designed templates, each customized with your CV data and ready to impress.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8 } }
          }}
          className="relative"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="py-8"
          >
            {templates.map((template, index) => (              <SwiperSlide key={index}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full border border-gray-700">
                  <div className="h-48 bg-gray-700">
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <span className="text-lg text-gray-300">{template.name} Template Preview</span>
                      {/* Replace with actual image: */}
                      {/* <Image
                        src={template.image}
                        alt={`${template.name} Template`}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                      <span className="bg-blue-600 text-blue-100 text-xs px-2 py-1 rounded-full">Popular</span>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{template.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-300">
                            <svg className="w-4 h-4 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Preview Template
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};
