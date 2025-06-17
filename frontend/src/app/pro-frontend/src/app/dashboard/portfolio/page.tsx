"use client";

import React, { useState } from 'react';
import { Metadata } from 'next';
import { PortfolioTemplateSelector } from '@/components/portfolio';
import { AnimatedButton } from '@/components/ui';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Portfolio - Portman',
  description: 'Create and customize your professional portfolio.',
};

export default function PortfolioPage() {
  const [stage, setStage] = useState<'select' | 'customize' | 'publish'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStage('customize');
  };
  
  const handlePublishPortfolio = () => {
    // In a real application, this would communicate with the backend API
    setStage('publish');
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Portfolio Builder</h1>
        <p className="text-gray-600 mt-2">
          Create a beautiful professional portfolio to showcase your skills and experience.
        </p>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                stage === 'select' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                1
              </div>
              <span className={`text-sm mt-1 ${stage === 'select' ? 'text-gray-800' : 'text-gray-500'}`}>
                Select
              </span>
            </div>
            
            {/* Line between steps */}
            <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                stage === 'customize' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                2
              </div>
              <span className={`text-sm mt-1 ${stage === 'customize' ? 'text-gray-800' : 'text-gray-500'}`}>
                Customize
              </span>
            </div>
            
            {/* Line between steps */}
            <div className="flex-1 h-0.5 mx-2 bg-gray-200"></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                stage === 'publish' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                3
              </div>
              <span className={`text-sm mt-1 ${stage === 'publish' ? 'text-gray-800' : 'text-gray-500'}`}>
                Publish
              </span>
            </div>
          </div>
        </div>
        
        {/* Content based on stage */}
        {stage === 'select' && (
          <PortfolioTemplateSelector onSelect={handleTemplateSelect} />
        )}
        
        {stage === 'customize' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Customize Your Portfolio</h2>
              <p className="text-gray-600 mt-1">
                Personalize your portfolio with your information and preferences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-100 rounded-lg p-4 flex items-center justify-center aspect-video">
                <p className="text-gray-500 text-center">
                  Portfolio preview placeholder<br />
                  (This would show a live preview of the portfolio)
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Layout Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="layout-1" 
                        name="layout" 
                        checked 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="layout-1" className="ml-2 text-sm text-gray-700">Standard</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="layout-2" 
                        name="layout" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="layout-2" className="ml-2 text-sm text-gray-700">Sidebar</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="layout-3" 
                        name="layout" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="layout-3" className="ml-2 text-sm text-gray-700">Cards</label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Color Theme</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600 cursor-pointer"></div>
                    <div className="h-6 w-6 rounded-full bg-green-600 cursor-pointer"></div>
                    <div className="h-6 w-6 rounded-full bg-purple-600 cursor-pointer"></div>
                    <div className="h-6 w-6 rounded-full bg-red-600 cursor-pointer"></div>
                    <div className="h-6 w-6 rounded-full bg-gray-800 cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Sections</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="section-1" 
                          checked 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="section-1" className="ml-2 text-sm text-gray-700">About Me</label>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="section-2" 
                          checked 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="section-2" className="ml-2 text-sm text-gray-700">Experience</label>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="section-3" 
                          checked 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="section-3" className="ml-2 text-sm text-gray-700">Education</label>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="section-4" 
                          checked 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="section-4" className="ml-2 text-sm text-gray-700">Skills</label>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="section-5" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="section-5" className="ml-2 text-sm text-gray-700">Projects</label>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <AnimatedButton
                onClick={() => setStage('select')}
                variant="outline"
                animationVariant="none"
              >
                Back to Templates
              </AnimatedButton>
              
              <AnimatedButton
                onClick={handlePublishPortfolio}
                variant="primary"
                animationVariant="pulse"
              >
                Publish Portfolio
              </AnimatedButton>
            </div>
          </div>
        )}
        
        {stage === 'publish' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Portfolio Published!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your professional portfolio is now live and ready to share.
            </p>
            
            <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 mb-6 flex items-center">
              <input 
                type="text" 
                value="https://portman.com/johndoe" 
                readOnly 
                className="flex-1 text-sm bg-transparent focus:outline-none"
              />
              <button className="ml-2 p-1 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href="#"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Share on Twitter
              </a>
              <a 
                href="#"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Share on LinkedIn
              </a>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Link
              </button>
            </div>
            
            <div className="mt-10">
              <AnimatedButton
                onClick={() => setStage('customize')}
                variant="outline"
                animationVariant="none"
              >
                Edit Portfolio
              </AnimatedButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
