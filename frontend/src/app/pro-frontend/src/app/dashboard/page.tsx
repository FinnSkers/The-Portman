"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedButton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCV } from '@/hooks/useCV';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function DashboardPage() {
  const { useCurrentUser } = useAuth();
  const { useUserCVs } = useCV();
  const { useUserPortfolios } = usePortfolio();

  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: cvs = [], isLoading: cvsLoading } = useUserCVs();
  const { data: portfolios = [], isLoading: portfoliosLoading } = useUserPortfolios();

  const latestCV = cvs[0];
  const latestPortfolio = portfolios[0];
  const completedCVs = cvs.filter(cv => cv.status === 'completed').length;
  const publishedPortfolios = portfolios.filter(p => p.status === 'published').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.header variants={itemVariants} className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-gray-100">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute top-16 right-16 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
          </div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Professional'}! 👋
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Ready to take your career to the next level? Let&apos;s enhance your professional presence with AI-powered insights.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">CVs Uploaded</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{cvs.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{completedCVs} processed</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Portfolios</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{portfolios.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{publishedPortfolios} published</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Profile Score</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {latestCV?.analysis?.overall_score ? Math.round(latestCV.analysis.overall_score) : '--'}
                  <span className="text-lg text-gray-500">/100</span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${latestCV?.analysis?.overall_score || 0}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Views</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {portfolios.reduce((total, p) => total + (p.view_count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">This month</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CV Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">CV Management</h2>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            {!cvsLoading && cvs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Your First CV</h3>
                <p className="text-gray-500 mb-6">Get started by uploading your CV and let our AI analyze your professional profile.</p>
                <Link href="/dashboard/cv">
                  <AnimatedButton variant="primary" animationVariant="bounce">
                    Upload CV
                  </AnimatedButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {latestCV && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{latestCV.original_filename}</h4>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(latestCV.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        latestCV.status === 'completed' ? 'bg-green-100 text-green-800' :
                        latestCV.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        latestCV.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {latestCV.status}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Link href="/dashboard/cv" className="flex-1">
                    <AnimatedButton variant="primary" className="w-full" animationVariant="pulse">
                      {cvs.length === 0 ? 'Upload CV' : 'Manage CVs'}
                    </AnimatedButton>
                  </Link>
                  {latestCV && (
                    <Link href={`/dashboard/cv/${latestCV.id}/analysis`}>
                      <AnimatedButton variant="secondary" animationVariant="bounce">
                        View Analysis
                      </AnimatedButton>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Portfolio Builder</h2>
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            
            {!portfoliosLoading && portfolios.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Create Your Portfolio</h3>
                <p className="text-gray-500 mb-6">Transform your CV into a stunning portfolio website that showcases your professional brand.</p>
                <Link href="/dashboard/portfolio">
                  <AnimatedButton 
                    variant="primary" 
                    animationVariant="bounce"
                    disabled={cvs.length === 0}
                    className={cvs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {cvs.length === 0 ? 'Upload CV First' : 'Create Portfolio'}
                  </AnimatedButton>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {latestPortfolio && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{latestPortfolio.title}</h4>
                        <p className="text-sm text-gray-500">
                          {latestPortfolio.view_count?.toLocaleString() || 0} views
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        latestPortfolio.status === 'published' ? 'bg-green-100 text-green-800' :
                        latestPortfolio.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {latestPortfolio.status}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Link href="/dashboard/portfolio" className="flex-1">
                    <AnimatedButton variant="primary" className="w-full" animationVariant="pulse">
                      {portfolios.length === 0 ? 'Create Portfolio' : 'Manage Portfolios'}
                    </AnimatedButton>
                  </Link>
                  {latestPortfolio && latestPortfolio.status === 'published' && (
                    <a 
                      href={`https://${latestPortfolio.custom_domain || `portman.app/${latestPortfolio.slug}`}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <AnimatedButton variant="secondary" animationVariant="bounce">
                        View Live
                      </AnimatedButton>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      {(cvs.length > 0 || portfolios.length > 0) && (
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {/* Show recent CV uploads and portfolio updates */}
              {cvs.slice(0, 3).map((cv) => (
                <div key={cv.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">CV uploaded: {cv.original_filename}</p>
                      <p className="text-sm text-gray-500">{new Date(cv.upload_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cv.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cv.status}
                  </span>
                </div>
              ))}
              
              {portfolios.slice(0, 2).map((portfolio) => (
                <div key={portfolio.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Portfolio: {portfolio.title}</p>
                      <p className="text-sm text-gray-500">Last updated {new Date(portfolio.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    portfolio.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {portfolio.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <span className="text-gray-500 font-medium">2</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400">Customize your portfolio</h3>
              <p className="text-gray-400 mt-1">
                Choose from our beautiful templates and customize your professional portfolio.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <span className="text-gray-500 font-medium">3</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400">Publish and share</h3>
              <p className="text-gray-400 mt-1">
                Publish your portfolio and share it with potential employers or clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
