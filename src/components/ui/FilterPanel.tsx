import { ChevronDown, X, Filter, Leaf, AlertTriangle, Warehouse, Package, Sprout } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGreenhouseStore } from '@/store';
import {
  CROP_TYPES,
  ANOMALY_LABELS,
  GROWTH_STAGE_LABELS,
  GrowthStage,
  AnomalyType,
} from '@/types';

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, icon, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-700/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400 -rotate-180" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: 'green' | 'red' | 'blue' | 'amber' | 'purple';
}

function Chip({ active, onClick, children, color = 'green' }: ChipProps) {
  const colorClasses = {
    green: active
      ? 'bg-emerald-600/90 border-emerald-400 text-white'
      : 'bg-slate-800/80 border-slate-600/60 text-slate-300 hover:border-emerald-500/60 hover:text-emerald-300',
    red: active
      ? 'bg-red-600/90 border-red-400 text-white'
      : 'bg-slate-800/80 border-slate-600/60 text-slate-300 hover:border-red-500/60 hover:text-red-300',
    blue: active
      ? 'bg-blue-600/90 border-blue-400 text-white'
      : 'bg-slate-800/80 border-slate-600/60 text-slate-300 hover:border-blue-500/60 hover:text-blue-300',
    amber: active
      ? 'bg-amber-600/90 border-amber-400 text-white'
      : 'bg-slate-800/80 border-slate-600/60 text-slate-300 hover:border-amber-500/60 hover:text-amber-300',
    purple: active
      ? 'bg-purple-600/90 border-purple-400 text-white'
      : 'bg-slate-800/80 border-slate-600/60 text-slate-300 hover:border-purple-500/60 hover:text-purple-300',
  };

  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${colorClasses[color]}`}
    >
      {children}
    </button>
  );
}

export default function FilterPanel() {
  const [collapsed, setCollapsed] = useState(false);

  const filters = useGreenhouseStore((s) => s.filters);
  const racks = useGreenhouseStore((s) => s.racks);
  const batches = useGreenhouseStore((s) => s.batches);
  const filteredTrayIds = useGreenhouseStore((s) => s.filteredTrayIds);
  const trays = useGreenhouseStore((s) => s.trays);
  const totalTrays = trays.length;
  const toggleCropType = useGreenhouseStore((s) => s.toggleCropType);
  const toggleAnomaly = useGreenhouseStore((s) => s.toggleAnomaly);
  const toggleRackId = useGreenhouseStore((s) => s.toggleRackId);
  const toggleBatchId = useGreenhouseStore((s) => s.toggleBatchId);
  const toggleGrowthStage = useGreenhouseStore((s) => s.toggleGrowthStage);
  const clearFilters = useGreenhouseStore((s) => s.clearFilters);

  const filteredCount = useMemo(
    () => (filteredTrayIds.size === 0 ? totalTrays : filteredTrayIds.size),
    [filteredTrayIds, totalTrays]
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.cropTypes.length > 0 ||
      filters.anomalies.length > 0 ||
      filters.rackIds.length > 0 ||
      filters.batchIds.length > 0 ||
      filters.growthStages.length > 0,
    [filters]
  );

  return (
    <div
      className={`
        absolute left-0 top-0 bottom-0 z-30 flex
        transition-all duration-300 ease-out
        ${collapsed ? 'w-12' : 'w-72'}
      `}
    >
      <div
        className={`
          h-full flex flex-col
          bg-slate-950/85 backdrop-blur-xl border-r border-slate-700/50
          shadow-2xl
          ${collapsed ? 'w-12' : 'w-72'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">过滤器</span>
              {hasActiveFilters && (
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                  {filteredCount}/{totalTrays}
                </span>
              )}
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronDown className="w-5 h-5 rotate-90" />
            ) : (
              <ChevronDown className="w-5 h-5 -rotate-90" />
            )}
          </button>
        </div>

        {!collapsed && (
          <>
            {hasActiveFilters && (
              <div className="px-4 py-2 border-b border-slate-700/50">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  清除所有筛选
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <FilterSection title="作物类型" icon={<Leaf className="w-4 h-4 text-emerald-400" />}>
                <div className="flex flex-wrap gap-1.5">
                  {CROP_TYPES.map((crop) => (
                    <Chip
                      key={crop}
                      active={filters.cropTypes.includes(crop)}
                      onClick={() => toggleCropType(crop)}
                      color="green"
                    >
                      {crop}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="异常状态" icon={<AlertTriangle className="w-4 h-4 text-red-400" />}>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(ANOMALY_LABELS) as AnomalyType[]).map((anomaly) => (
                    <Chip
                      key={anomaly}
                      active={filters.anomalies.includes(anomaly)}
                      onClick={() => toggleAnomaly(anomaly)}
                      color="red"
                    >
                      {ANOMALY_LABELS[anomaly]}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="层架" icon={<Warehouse className="w-4 h-4 text-blue-400" />}>
                <div className="flex flex-wrap gap-1.5">
                  {racks.map((rack) => (
                    <Chip
                      key={rack.id}
                      active={filters.rackIds.includes(rack.id)}
                      onClick={() => toggleRackId(rack.id)}
                      color="blue"
                    >
                      {rack.name}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="批次" icon={<Package className="w-4 h-4 text-amber-400" />}>
                <div className="flex flex-wrap gap-1.5">
                  {batches.map((batch) => (
                    <Chip
                      key={batch.id}
                      active={filters.batchIds.includes(batch.id)}
                      onClick={() => toggleBatchId(batch.id)}
                      color="amber"
                    >
                      {batch.id} · {batch.cropType}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="生长阶段" icon={<Sprout className="w-4 h-4 text-purple-400" />}>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(GROWTH_STAGE_LABELS) as GrowthStage[]).map((stage) => (
                    <Chip
                      key={stage}
                      active={filters.growthStages.includes(stage)}
                      onClick={() => toggleGrowthStage(stage)}
                      color="purple"
                    >
                      {GROWTH_STAGE_LABELS[stage]}
                    </Chip>
                  ))}
                </div>
              </FilterSection>
            </div>

            <div className="px-4 py-3 border-t border-slate-700/50 bg-slate-900/50">
              <div className="text-xs text-slate-400">
                当前显示{' '}
                <span className="text-emerald-400 font-bold">{filteredCount}</span> / {totalTrays} 个苗盘
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
