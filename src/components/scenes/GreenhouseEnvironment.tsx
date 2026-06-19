import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GreenhouseEnvironment() {
  const fanRef = useRef<THREE.Group>(null);
  const railCarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (fanRef.current) {
      fanRef.current.rotation.z = t * 4;
    }
    if (railCarRef.current) {
      railCarRef.current.position.x = Math.sin(t * 0.3) * 10;
    }
  });

  return (
    <group>
      {/* 温室地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial color="#1a2e22" roughness={0.9} />
      </mesh>

      {/* 地面网格线 */}
      <gridHelper args={[50, 50, '#1f4030', '#163326']} position={[0, 0.01, 0]} />

      {/* 采收通道标记 */}
      {[-5, 5].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[40, 1.5]} />
          <meshStandardMaterial color="#2a4a35" emissive="#1a3a25" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* 温室屋顶结构线 */}
      {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
        <line key={`roof-x-${i}`}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geo) => {
              const positions = new Float32Array([
                x, 12, -18,
                x, 10, -18,
                x, 10, 18,
                x, 12, 18,
              ]);
              geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
              geo.setIndex([0, 1, 1, 2, 2, 3]);
            }}
          />
          <lineBasicMaterial attach="material" color="#2d5a3d" />
        </line>
      ))}

      {[-18, 18].map((z, i) => (
        <line key={`roof-z-${i}`}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geo) => {
              const positions = new Float32Array([
                -16, 10, z,
                -16, 12, z,
                16, 12, z,
                16, 10, z,
              ]);
              geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
              geo.setIndex([0, 1, 1, 2, 2, 3]);
            }}
          />
          <lineBasicMaterial attach="material" color="#2d5a3d" />
        </line>
      ))}

      {/* 风机 */}
      {[-14, 14].map((x, i) => (
        <group key={`fan-${i}`} position={[x, 6, -17]}>
          <mesh>
            <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          <group ref={i === 0 ? fanRef : undefined}>
            {[0, 1, 2].map((j) => (
              <mesh key={j} rotation={[0, 0, (j * Math.PI * 2) / 3]} position={[0.5, 0, 0.2]}>
                <boxGeometry args={[0.8, 0.15, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.5} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* 轨道车 */}
      <group ref={railCarRef} position={[0, 0.3, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2, 0.8, 1.2]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1, 0.5, 0.8]} />
          <meshStandardMaterial color="#2563eb" metalness={0.4} />
        </mesh>
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={`w-${i}`} position={[x, 0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        ))}
        <pointLight position={[0, 0.5, 0.6]} intensity={0.5} color="#fbbf24" distance={4} />
      </group>

      {/* 轨道 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[40, 0.4]} />
        <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
