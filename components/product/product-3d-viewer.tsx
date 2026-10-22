'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei'
import { useLang } from '@/contexts/lang-context'

interface Product3dViewerProps {
  modelPath: string
}

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--color-bg-muted)' }}>
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-steel)', borderTopColor: 'transparent' }}
        />
        <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>Загрузка 3D...</p>
      </div>
    </div>
  )
}

export function Product3dViewer({ modelPath }: Product3dViewerProps) {
  const { tr } = useLang()

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ height: 280, background: 'var(--color-bg-subtle)' }}
    >
      <p
        className="absolute top-2 left-3 z-10 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--color-text-secondary)', backdropFilter: 'blur(4px)' }}
      >
        3D · тяни для поворота
      </p>

      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [2, 2, 4], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <Model path={modelPath} />
          <OrbitControls
            enablePan={false}
            minDistance={1}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={1}
          />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  )
}
