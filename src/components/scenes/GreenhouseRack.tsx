import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { RackData, TrayData } from '@/types';
import { useGreenhouseStore } from '@/store';
import TrayInstance from './TrayInstance';
import TrayLabel from './TrayLabel';

interface GreenhouseRackProps {
  rack: RackData;
}

export default function GreenhouseRack({ rack }: GreenhouseRackProps) {
  const lightRefs = useRef<THREE.PointLight[]>([]);
  const sensorRefs = useRef<THREE.Mesh[]>([]);

  const trays = useGreenhouseStore((s) => s.trays.filter((t) => t.rackId === rack.id));
  const filteredIds = useGreenhouseStore((s) =>
    new Set(s.getFilteredTrays().map((t) => t.id))
  );
  const selectedTrayId = useGreenhouseStore((s) => s.selectedTrayId);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    lightRefs.current.forEach((light, i) => {
      if (light) {
        light.intensity = 1.5 + Math.sin(t * 1.5 + i) * 0.3;
      }
    });
    sensorRefs.current.forEach((sensor, i) => {
      if (sensor) {
        const mat = sensor.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(t * 3 + i * 0.5) * 0.5;
      }
    });
  });

  const rackWidth = 6;
  const rackDepth = 1.5;
  const layerHeight = 1.8;
  const totalHeight = rack.layers * layerHeight + 0.5;

  const trayPositions = useMemo(() => {
    const positions: { tray: TrayData; pos: [number, number, number] }[] = [];
    const trayWidth = (rackWidth - 0.4) / rack.traysPerLayer;
    for (const tray of trays) {
      const y = (tray.layer - 1) * layerHeight + 0.4;
      const x = -rackWidth / 2 + 0.2 + trayWidth / 2 + tray.position * trayWidth;
      const z = 0;
      positions.push({ tray, pos: [x, y, z] });
    }
    return positions;
  }, [trays, rackWidth, layerHeight, rack.traysPerLayer]);

  return (
    <group position={[rack.positionX, 0, rack.positionZ]}>
      {/* 层架立柱 */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`col-${sx}-${sz}`}
            position={[sx * (rackWidth / 2 - 0.1), totalHeight / 2, sz * (rackDepth / 2 - 0.1)]}
            castShadow
          >
            <boxGeometry args={[0.12, totalHeight, 0.12]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* 层板与补光灯 */}
      {Array.from({ length: rack.layers }).map((_, i) => {
        const y = (i + 1) * layerHeight;
        return (
          <group key={`layer-${i}`}>
            {/* 层板 */}
            <mesh position={[0, y - 0.05, 0]} receiveShadow castShadow>
              <boxGeometry args={[rackWidth, 0.1, rackDepth]} />
              <meshStandardMaterial
                color="#64748b"
                metalness={0.5}
                roughness={0.6}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* 补光灯条 */}
            {[-1, 0, 1].map((lx) => (
              <mesh key={`light-bar-${i}-${lx}`} position={[lx * 1.5, y - 0.15, 0]}>
                <boxGeometry args={[1.2, 0.08, 0.1]} />
                <meshStandardMaterial
                  color="#fff4d6"
                  emissive="#ffd89b"
                  emissiveIntensity={1.5}
                />
              </mesh>
            ))}

            {/* 补光灯光源 */}
            {[-1, 0, 1].map((lx, li) => (
              <pointLight
                key={`light-${i}-${lx}`}
                ref={(el) => {
                  if (el) lightRefs.current[i * 3 + li] = el;
                }}
                position={[lx * 1.5, y - 0.2, 0]}
                intensity={1.5}
                color="#ffd89b"
                distance={3}
                decay={2}
              />
            ))}

            {/* 滴灌管 */}
            <mesh position={[0, y - 0.25, -rackDepth / 2 + 0.1]}>
              <cylinderGeometry args={[0.03, 0.03, rackWidth, 8]} />
              <meshStandardMaterial
                color="#1e3a5f"
                metalness={0.3}
                transparent
                opacity={0.7}
              />
              <mesh rotation={[Math.PI / 2, 0, 0]} />
            </mesh>
            {Array.from({ length: rack.traysPerLayer }).map((_, ti) => {
              const tx = -rackWidth / 2 + 0.2 + (rackWidth - 0.4) / rack.traysPerLayer / 2 +
                ti * (rackWidth - 0.4) / rack.traysPerLayer;
              return (
                <mesh
                  key={`drip-${i}-${ti}`}
                  position={[tx, y - 0.25, -rackDepth / 2 + 0.1]}
                >
                  <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
                  <meshStandardMaterial color="#2563eb" transparent opacity={0.6} />
                </mesh>
              );
            })}

            {/* 传感器 */}
            <mesh
              ref={(el) => {
                if (el) sensorRefs.current[i] = el;
              }}
              position={[rackWidth / 2 - 0.3, y - 0.2, rackDepth / 2 - 0.1]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color="#059669"
                emissive="#10b981"
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* 苗盘（使用实例化渲染优化） */}
      {trayPositions.map(({ tray, pos }) => {
        const isFiltered = filteredIds.has(tray.id);
        const isSelected = selectedTrayId === tray.id;
        return (
          <TrayInstance
            key={tray.id}
            tray={tray}
            position={pos}
            visible={filteredIds.size === 0 || isFiltered}
            isSelected={isSelected}
            dimmed={filteredIds.size > 0 && !isFiltered}
          />
        );
      })}

      {/* 层架名称标签 */}
      <Html
        position={[0, totalHeight + 0.5, 0]}
        center
        distanceFactor={15}
        zIndexRange={[50, 0]}
      >
        <div className="px-3 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-emerald-300 text-sm font-bold whitespace-nowrap border border-emerald-600/50">
          {rack.name}
        </div>
      </Html>
    </group>
  );
}
