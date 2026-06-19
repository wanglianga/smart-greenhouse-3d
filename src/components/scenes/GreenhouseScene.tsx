import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
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
      gl={{ antialias: true, alpha: false }}
      style={{ background: 'linear-gradient(180deg, #0a1a12 0%, #0a2e1a 100%)' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} color="#4a7c59" />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.6}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 8, 0]} intensity={0.4} color="#88ffaa" distance={30} />

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
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 3, 0]}
        />

        <Environment preset="city" />

        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
