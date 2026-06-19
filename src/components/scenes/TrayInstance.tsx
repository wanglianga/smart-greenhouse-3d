import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TrayData } from '@/types';
import { useGreenhouseStore } from '@/store';

interface TrayInstanceProps {
  tray: TrayData;
  position: [number, number, number];
  visible: boolean;
  isSelected: boolean;
  dimmed: boolean;
}

export default function TrayInstance({ tray, position, visible, isSelected, dimmed }: TrayInstanceProps) {
  const alertRef = useRef<THREE.Mesh>(null);
  const setSelectedTray = useGreenhouseStore((s) => s.setSelectedTray);
  const getAnomalies = useGreenhouseStore((s) => s.getAnomalies);

  const anomalies = getAnomalies(tray);
  const hasAlert = anomalies.length > 0;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (alertRef.current && hasAlert) {
      const mat = alertRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.3 + Math.sin(t * 4) * 0.3;
    }
  });

  const plantColor = useMemo(() => {
    const stageColors: Record<string, string> = {
      seedling: '#86efac',
      vegetative: '#22c55e',
      flowering: '#f9a8d4',
      mature: '#16a34a',
      harvest: '#fbbf24',
    };
    return stageColors[tray.growthStage] || '#22c55e';
  }, [tray.growthStage]);

  const plantHeight = useMemo(() => {
    const heights: Record<string, number> = {
      seedling: 0.08,
      vegetative: 0.18,
      flowering: 0.25,
      mature: 0.3,
      harvest: 0.2,
    };
    return heights[tray.growthStage] || 0.15;
  }, [tray.growthStage]);

  if (!visible && !dimmed) return null;

  return (
    <group position={position}>
      {/* 苗盘底座 */}
      <mesh
        position={[0, 0.02, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTray(tray.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[0.85, 0.04, 1.1]} />
        <meshStandardMaterial
          color={isSelected ? '#06b6d4' : '#1e293b'}
          metalness={0.3}
          roughness={0.7}
          emissive={isSelected ? '#0891b2' : '#000000'}
          emissiveIntensity={isSelected ? 0.6 : 0}
          transparent
          opacity={dimmed ? 0.3 : 1}
        />
      </mesh>

      {/* 植物 - 使用实例化模拟多株植物 */}
      {!dimmed && (
        <group position={[0, 0.04, 0]}>
          {Array.from({ length: 4 }).map((_, i) =>
            Array.from({ length: 5 }).map((_, j) => (
              <mesh
                key={`plant-${i}-${j}`}
                position={[
                  -0.3 + i * 0.2,
                  plantHeight / 2,
                  -0.45 + j * 0.2,
                ]}
              >
                <cylinderGeometry
                  args={[0.02, 0.04, plantHeight, 6]}
                />
                <meshStandardMaterial
                  color={plantColor}
                  transparent
                  opacity={0.85}
                  emissive={plantColor}
                  emissiveIntensity={hasAlert ? 0 : 0.05}
                />
              </mesh>
            ))
          )}
          {/* 顶部叶丛 */}
          {Array.from({ length: 3 }).map((_, i) =>
            Array.from({ length: 4 }).map((_, j) => (
              <mesh
                key={`leaf-${i}-${j}`}
                position={[
                  -0.25 + i * 0.25,
                  plantHeight + 0.02,
                  -0.35 + j * 0.23,
                ]}
                rotation={[Math.PI / 4, i * 0.5, j * 0.3]}
              >
                <sphereGeometry args={[0.08, 8, 6]} />
                <meshStandardMaterial
                  color={plantColor}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* 告警光晕 */}
      {hasAlert && !dimmed && (
        <mesh ref={alertRef} position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial
            color={tray.diseaseRisk === 'high' ? '#ef4444' : '#f59e0b'}
            emissive={tray.diseaseRisk === 'high' ? '#ef4444' : '#f59e0b'}
            emissiveIntensity={1.5}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* 选中指示器 */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.65, 32]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 苗盘数据标签 */}
      {!dimmed && (
        <Html
          position={[0, plantHeight + 0.4, 0]}
          center
          distanceFactor={12}
          zIndexRange={[100, 0]}
          occlude={false}
        >
          <div
            className={`
              px-2 py-1 rounded text-xs font-mono whitespace-nowrap cursor-pointer
              border transition-all duration-200
              ${hasAlert
                ? 'bg-red-950/90 border-red-500/70 text-red-200 shadow-lg shadow-red-900/50'
                : 'bg-slate-900/85 border-slate-600/50 text-slate-200'
              }
              ${isSelected ? 'ring-2 ring-cyan-400 scale-110' : ''}
              hover:scale-105
            `}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTray(tray.id);
            }}
          >
            <div className="font-bold text-[11px] mb-0.5">
              {tray.cropType} · {tray.ageDays}天
            </div>
            <div className="flex gap-2 text-[10px] opacity-90">
              <span>💧{tray.humidity.toFixed(0)}%</span>
              <span>☀️{Math.round(tray.light / 1000)}k</span>
              <span>🧪{tray.nutrient.toFixed(1)}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
