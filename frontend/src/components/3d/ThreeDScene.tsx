"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { Suspense } from 'react'

function AnimatedSphere() {
  return (
    <Float
      speed={1.4}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <AnimatedSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function ThreeDScene() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
