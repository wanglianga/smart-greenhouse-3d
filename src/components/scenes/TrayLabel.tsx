import { Html } from '@react-three/drei';
import { TrayData } from '@/types';
import { useGreenhouseStore } from '@/store';
import { GROWTH_STAGE_LABELS, DISEASE_RISK_LABELS } from '@/types';

interface TrayLabelProps {
  tray: TrayData;
  position: [number, number, number];
}

export default function TrayLabel({ tray, position }: TrayLabelProps) {
  const setSelectedTray = useGreenhouseStore((s) => s.setSelectedTray);
  const getAnomalies = useGreenhouseStore((s) => s.getAnomalies);
  const anomalies = getAnomalies(tray);
  const hasAlert = anomalies.length > 0;

  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        onClick={() => setSelectedTray(tray.id)}
        className={`
          px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
          backdrop-blur-md border shadow-xl
          ${hasAlert
            ? 'bg-red-950/90 border-red-500/70 shadow-red-900/50'
            : 'bg-slate-900/85 border-slate-600/50'
          }
          hover:scale-105 hover:shadow-2xl
        `}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-bold text-sm ${hasAlert ? 'text-red-200' : 'text-white'}`}>
            {tray.cropType}
          </span>
          <span className="text-xs bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300">
            {tray.batchId}
          </span>
        </div>
        <div className="text-xs text-slate-300 space-y-0.5 font-mono">
          <div>龄期: {tray.ageDays}天 ({GROWTH_STAGE_LABELS[tray.growthStage]})</div>
          <div className="flex gap-3">
            <span>💧 {tray.humidity.toFixed(0)}%</span>
            <span>☀️ {(tray.light / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex gap-3">
            <span>🧪 {tray.nutrient.toFixed(1)}</span>
            <span className={
              tray.diseaseRisk === 'high' ? 'text-red-400' :
              tray.diseaseRisk === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
            }>
              ⚠️ {DISEASE_RISK_LABELS[tray.diseaseRisk]}
            </span>
          </div>
        </div>
      </div>
    </Html>
  );
}
