import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import GreenhouseRack from './GreenhouseRack';
import GreenhouseEnvironment from './GreenhouseEnvironment';
import { useGreenhouseStore } from '@/store';

export default function GreenhouseScene() {
  const racks = useGreenhouseStore((s) => s.racks);

  return (
    <Canvas
      shadows
      camera={{ position: [18, 16, 22], fov: 45 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      style={{ background: 'linear-gradient(180deg, #0a1a12 0%, #0a2e1a 100%)' }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#0a1f14']} />
        <fog attach="fog" args={['#0a1f14', 25, 60]} />

        <ambientLight intensity={0.35} color="#8fd6a8" />
        <directionalLight
          position={[12, 22, 12]}
          intensity={0.7}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#66ffaa" distance={40} decay={1.5} />
        <pointLight position={[-12, 6, -8]} intensity={0.3} color="#88ccaa" distance={25} />
        <pointLight position={[12, 6, 8]} intensity={0.3} color="#88ccaa" distance={25} />

        <GreenhouseEnvironment />

        {racks.map((rack) => (
          <GreenhouseRack key={rack.id} rack={rack} />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 3, 0]}
          enableDamping
          dampingFactor={0.08}
        />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            mipmapBlur
            radius={0.8}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
