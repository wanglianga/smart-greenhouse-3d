import { X, Calendar, Droplets, Sun, FlaskConical, AlertTriangle, Leaf, Sprout } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useGreenhouseStore } from '@/store';
import { GROWTH_STAGE_LABELS, DISEASE_RISK_LABELS, ANOMALY_LABELS } from '@/types';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: 'normal' | 'warning' | 'danger';
}

function MetricCard({ icon, label, value, status = 'normal' }: MetricCardProps) {
  const statusColors = {
    normal: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-950/30 text-amber-300',
    danger: 'border-red-500/30 bg-red-950/30 text-red-300',
  };
  return (
    <div className={`p-3 rounded-lg border ${statusColors[status]}`}>
      <div className="flex items-center gap-1.5 mb-1 text-xs opacity-80">
        {icon}
        {label}
      </div>
      <div className="text-lg font-bold font-mono">{value}</div>
    </div>
  );
}

export default function TrayDetailModal() {
  const { selectedTrayId, trays, showTrayDetail, setShowTrayDetail, setSelectedTray, getAnomalies } = useGreenhouseStore();
  const tray = trays.find((t) => t.id === selectedTrayId);

  if (!tray || !showTrayDetail) return null;

  const anomalies = getAnomalies(tray);

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['湿度(%)', '光照(klux)', '温度(°C)', '营养液(ms/cm)'],
      textStyle: { color: '#94a3b8', fontSize: 11 },
      top: 0,
    },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: tray.history.map((h) => h.date.slice(5)),
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: '湿度(%)',
        type: 'line',
        smooth: true,
        data: tray.history.map((h) => h.humidity),
        lineStyle: { color: '#06b6d4', width: 2 },
        itemStyle: { color: '#06b6d4' },
        areaStyle: { color: 'rgba(6, 182, 212, 0.15)' },
      },
      {
        name: '光照(klux)',
        type: 'line',
        smooth: true,
        data: tray.history.map((h) => Math.round(h.light / 1000)),
        lineStyle: { color: '#fbbf24', width: 2 },
        itemStyle: { color: '#fbbf24' },
      },
      {
        name: '温度(°C)',
        type: 'line',
        smooth: true,
        data: tray.history.map((h) => h.temperature),
        lineStyle: { color: '#f87171', width: 2 },
        itemStyle: { color: '#f87171' },
      },
      {
        name: '营养液(ms/cm)',
        type: 'line',
        smooth: true,
        data: tray.history.map((h) => h.nutrient),
        lineStyle: { color: '#a78bfa', width: 2 },
        itemStyle: { color: '#a78bfa' },
      },
    ],
  };

  const getHumidityStatus = () => tray.humidity < 55 ? 'warning' : tray.humidity > 90 ? 'danger' : 'normal';
  const getLightStatus = () => tray.light < 10000 ? 'warning' : 'normal';
  const getNutrientStatus = () => tray.nutrient < 1.2 ? 'warning' : tray.nutrient > 2.8 ? 'danger' : 'normal';
  const getDiseaseStatus = () => tray.diseaseRisk === 'high' ? 'danger' : tray.diseaseRisk === 'medium' ? 'warning' : 'normal';

  const handleClose = () => {
    setShowTrayDetail(false);
    setSelectedTray(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl
          bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 shadow-2xl
          animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-start justify-between p-5 border-b border-slate-700/50 bg-gradient-to-r from-emerald-950/50 to-slate-900/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{tray.cropType}</h2>
              <span className="px-2 py-0.5 bg-slate-700/60 rounded text-xs text-slate-300 font-mono">
                {tray.id}
              </span>
              <span className="px-2 py-0.5 bg-emerald-700/40 rounded text-xs text-emerald-300 font-mono">
                {tray.batchId}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Sprout className="w-4 h-4" />
                {GROWTH_STAGE_LABELS[tray.growthStage]} · {tray.ageDays}天
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                预计采收: {tray.expectedHarvest}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {anomalies.length > 0 && (
          <div className="mx-5 mt-4 p-3 rounded-lg border border-red-500/40 bg-red-950/40">
            <div className="flex items-center gap-2 text-red-300 text-sm font-medium mb-2">
              <AlertTriangle className="w-4 h-4" />
              检测到 {anomalies.length} 个异常
            </div>
            <div className="flex flex-wrap gap-2">
              {anomalies.map((a) => (
                <span key={a} className="px-2 py-0.5 bg-red-900/60 rounded text-xs text-red-200">
                  {ANOMALY_LABELS[a]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 内容区 */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 指标卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <MetricCard
              icon={<Droplets className="w-3.5 h-3.5" />}
              label="湿度"
              value={`${tray.humidity.toFixed(1)}%`}
              status={getHumidityStatus()}
            />
            <MetricCard
              icon={<Sun className="w-3.5 h-3.5" />}
              label="光照"
              value={`${(tray.light / 1000).toFixed(1)}k lux`}
              status={getLightStatus()}
            />
            <MetricCard
              icon={<FlaskConical className="w-3.5 h-3.5" />}
              label="营养液"
              value={`${tray.nutrient.toFixed(2)} ms/cm`}
              status={getNutrientStatus()}
            />
            <MetricCard
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
              label="病害风险"
              value={DISEASE_RISK_LABELS[tray.diseaseRisk]}
              status={getDiseaseStatus()}
            />
          </div>

          {/* 照片占位 */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              作物照片
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-emerald-900/60 to-slate-800/60
                    border border-emerald-700/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <Leaf className="w-8 h-8 text-emerald-500/40 mx-auto mb-1" />
                    <span className="text-xs text-emerald-400/50">
                      {tray.cropType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 历史曲线 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">历史数据曲线</h3>
            <div className="h-64 rounded-lg bg-slate-950/60 border border-slate-800 p-2">
              <ReactECharts
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
