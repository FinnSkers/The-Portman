"use client";

import React, { useState } from 'react';
import { Metadata } from 'next';
import { CVUploadForm } from '@/components/cv';

export const metadata: Metadata = {
  title: 'Upload CV - Portman',
  description: 'Upload your CV to create a professional portfolio.',
};

export default function CVUploadPage() {
  const [uploadedCvId, setUploadedCvId] = useState<string | null>(null);
  
  const handleCVUploadSuccess = (cvId: string) => {
    setUploadedCvId(cvId);
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">CV Management</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your CV to build your professional portfolio.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!uploadedCvId ? (
            <CVUploadForm onSuccess={handleCVUploadSuccess} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold">CV Successfully Uploaded!</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Your CV has been successfully processed. You can now create your portfolio or upload a new CV.
              </p>
              
              <div className="flex space-x-4">
                <a 
                  href="/dashboard/portfolio"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Portfolio
                </a>
                
                <button 
                  onClick={() => setUploadedCvId(null)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload a New CV
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tips for a Great Portfolio</h2>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-xs text-blue-600 font-medium">1</span>
                </span>
                <span className="text-sm text-gray-600">Upload a recent, detailed CV for best results.</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-xs text-blue-600 font-medium">2</span>
                </span>
                <span className="text-sm text-gray-600">Include relevant skills and measurable achievements.</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-xs text-blue-600 font-medium">3</span>
                </span>
                <span className="text-sm text-gray-600">Make sure your contact information is up to date.</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-xs text-blue-600 font-medium">4</span>
                </span>
                <span className="text-sm text-gray-600">Highlight your professional experience and education.</span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-xs text-blue-600 font-medium">5</span>
                </span>
                <span className="text-sm text-gray-600">Include links to your professional profiles and projects.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
