"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import { uploadCV, parseCV } from '@/lib/api'

function AnimatedSphere({ isProcessing }: { isProcessing: boolean }) {
  return (
    <Float
      speed={isProcessing ? 2.5 : 1.4}
      rotationIntensity={isProcessing ? 3 : 1}
      floatIntensity={isProcessing ? 4 : 2}
    >
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color={isProcessing ? '#f59e42' : '#3b82f6'}
          attach="material"
          distort={isProcessing ? 0.6 : 0.3}
          speed={isProcessing ? 3 : 1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

function Scene({ isProcessing }: { isProcessing: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <AnimatedSphere isProcessing={isProcessing} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function ThreeDScene() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  // Handle file input
  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setError('')
    try {
      const uploadRes = await uploadCV(file)
      const filename = uploadRes.filename
      if (!filename) throw new Error('No filename returned from upload')
      const parsed = await parseCV(filename)
      // Store parsed data in sessionStorage for results page
      sessionStorage.setItem('parsedCV', JSON.stringify(parsed))
      window.location.href = '/results'
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload or parsing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle click on sphere - trigger file input
  const handleSphereClick = () => {
    if (inputRef.current) inputRef.current.click()
  }

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }
  return (
    <div
      className={`h-full w-full flex items-center justify-center relative cursor-pointer select-none ${dragActive ? 'ring-4 ring-blue-400/70 ring-offset-2' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onClick={handleSphereClick}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Suspense fallback={null}>
          <Scene isProcessing={isProcessing} />
        </Suspense>
      </Canvas>
      {/* Animated overlays */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 rounded-xl px-6 py-4 text-white text-lg animate-pulse shadow-xl">
            Processing CV...
          </div>
        </div>
      )}
      {error && !isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/80 rounded-xl px-6 py-4 text-white text-lg shadow-xl">
            {error}
          </div>
        </div>
      )}
      {dragActive && !isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-500/20 rounded-3xl px-8 py-6 text-white text-lg font-semibold animate-fade-in shadow-2xl border-2 border-blue-400">
            Drop your CV to upload
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-white/80 pointer-events-none drop-shadow-lg">
        Drag & drop your CV here, or click the sphere to upload
      </div>
    </div>
  )
}
