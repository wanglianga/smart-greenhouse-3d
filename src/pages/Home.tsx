import GreenhouseScene from '@/components/scenes/GreenhouseScene';
import FilterPanel from '@/components/ui/FilterPanel';
import TrayDetailModal from '@/components/ui/TrayDetailModal';
import StatusBar from '@/components/ui/StatusBar';
import { Sprout } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* 顶部标题栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-3 bg-gradient-to-b from-slate-950/95 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/50">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">智慧温室三维监控系统</h1>
              <p className="text-xs text-slate-400">Smart Greenhouse 3D Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300">系统运行正常</span>
            </div>
          </div>
        </div>
      </div>

      {/* 过滤器面板 */}
      <FilterPanel />

      {/* 3D 场景 */}
      <div className="absolute inset-0">
        <GreenhouseScene />
      </div>

      {/* 底部状态栏 */}
      <StatusBar />

      {/* 苗盘详情弹窗 */}
      <TrayDetailModal />

      {/* 操作提示 */}
      <div className="absolute top-20 right-6 z-20 p-3 rounded-xl bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 max-w-xs">
        <h3 className="text-xs font-semibold text-slate-300 mb-2">操作指南</h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>🖱️ 左键拖动 · 旋转视角</li>
          <li>🖱️ 右键拖动 · 平移场景</li>
          <li>🖱️ 滚轮 · 缩放视图</li>
          <li>📍 点击苗盘 · 查看详情</li>
          <li>🔍 使用左侧过滤器 · 筛选苗盘</li>
        </ul>
      </div>
    </div>
  );
}
