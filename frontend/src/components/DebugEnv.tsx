'use client';

export default function DebugEnv() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  console.log('API URL:', apiUrl);
  console.log('Base URL:', baseUrl);
  console.log('All env vars:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  });

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'yellow', 
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <div><strong>API URL:</strong> {apiUrl}</div>
      <div><strong>Base URL:</strong> {baseUrl}</div>
      <div><strong>API ENV:</strong> {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</div>
      <div><strong>BASE ENV:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'undefined'}</div>
    </div>
  );
}
