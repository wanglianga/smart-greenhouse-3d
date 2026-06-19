import { Leaf, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useGreenhouseStore } from '@/store';

export default function StatusBar() {
  const trays = useGreenhouseStore((s) => s.trays);
  const getAnomalies = useGreenhouseStore((s) => s.getAnomalies);

  const totalTrays = trays.length;
  const anomalyTrays = trays.filter((t) => getAnomalies(t).length > 0).length;
  const normalTrays = totalTrays - anomalyTrays;
  const highRiskTrays = trays.filter((t) => t.diseaseRisk === 'high').length;

  const currentTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 bg-slate-950/85 backdrop-blur-xl border-t border-slate-700/50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">总苗盘</span>
            <span className="text-sm font-bold text-white font-mono">{totalTrays}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">正常</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{normalTrays}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">异常</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{anomalyTrays}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-slate-400">高风险</span>
            <span className="text-sm font-bold text-red-400 font-mono">{highRiskTrays}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {currentTime}
        </div>
      </div>
    </div>
  );
}
