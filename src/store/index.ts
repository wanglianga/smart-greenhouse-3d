import { create } from 'zustand';
import { StoreState, AnomalyType, TrayData, GrowthStage, RackData, BatchData } from '@/types';
import { generateRacks, generateBatches, generateTrays } from '@/data/mockData';

function calcAnomalies(tray: TrayData): AnomalyType[] {
  const anomalies: AnomalyType[] = [];
  if (tray.diseaseRisk === 'high') anomalies.push('disease_high');
  if (tray.humidity < 55) anomalies.push('humidity_low');
  if (tray.light < 10000) anomalies.push('light_low');
  if (tray.nutrient < 1.2) anomalies.push('nutrient_low');
  return anomalies;
}

function buildTraysByRack(trays: TrayData[]): Record<string, TrayData[]> {
  const map: Record<string, TrayData[]> = {};
  for (const tray of trays) {
    if (!map[tray.rackId]) map[tray.rackId] = [];
    map[tray.rackId].push(tray);
  }
  return map;
}

function buildFilteredIds(
  trays: TrayData[],
  filters: StoreState['filters']
): Set<string> {
  const hasAnyFilter =
    filters.cropTypes.length > 0 ||
    filters.anomalies.length > 0 ||
    filters.rackIds.length > 0 ||
    filters.batchIds.length > 0 ||
    filters.growthStages.length > 0;

  if (!hasAnyFilter) {
    return new Set();
  }

  const ids = new Set<string>();
  for (const tray of trays) {
    if (filters.cropTypes.length > 0 && !filters.cropTypes.includes(tray.cropType)) {
      continue;
    }
    if (filters.rackIds.length > 0 && !filters.rackIds.includes(tray.rackId)) {
      continue;
    }
    if (filters.batchIds.length > 0 && !filters.batchIds.includes(tray.batchId)) {
      continue;
    }
    if (
      filters.growthStages.length > 0 &&
      !filters.growthStages.includes(tray.growthStage as GrowthStage)
    ) {
      continue;
    }
    if (filters.anomalies.length > 0) {
      const trayAnomalies = calcAnomalies(tray);
      const hasMatch = filters.anomalies.some((a) => trayAnomalies.includes(a));
      if (!hasMatch) continue;
    }
    ids.add(tray.id);
  }
  return ids;
}

const initialRacks = generateRacks();
const initialBatches = generateBatches();
const initialTrays = generateTrays(initialRacks, initialBatches);
const initialFilters: StoreState['filters'] = {
  cropTypes: [],
  anomalies: [],
  rackIds: [],
  batchIds: [],
  growthStages: [],
};

export interface ExtendedStore extends StoreState {
  traysByRackId: Record<string, TrayData[]>;
  filteredTrayIds: Set<string>;
  _cachedFilterKey: string;
}

function buildFilterKey(f: StoreState['filters']): string {
  return [
    f.cropTypes.join('|'),
    f.anomalies.join('|'),
    f.rackIds.join('|'),
    f.batchIds.join('|'),
    f.growthStages.join('|'),
  ].join('__');
}

export const useGreenhouseStore = create<ExtendedStore>()((set, get) => ({
  racks: initialRacks,
  trays: initialTrays,
  batches: initialBatches,
  filters: initialFilters,
  selectedTrayId: null,
  showTrayDetail: false,
  traysByRackId: buildTraysByRack(initialTrays),
  filteredTrayIds: new Set(),
  _cachedFilterKey: buildFilterKey(initialFilters),

  setSelectedTray: (id) => set({ selectedTrayId: id, showTrayDetail: id !== null }),
  setShowTrayDetail: (show) => set({ showTrayDetail: show }),

  toggleCropType: (crop) =>
    set((state) => {
      const exists = state.filters.cropTypes.includes(crop);
      const newFilters = {
        ...state.filters,
        cropTypes: exists
          ? state.filters.cropTypes.filter((c) => c !== crop)
          : [...state.filters.cropTypes, crop],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: buildFilteredIds(state.trays, newFilters),
        _cachedFilterKey: key,
      };
    }),

  toggleAnomaly: (anomaly) =>
    set((state) => {
      const exists = state.filters.anomalies.includes(anomaly);
      const newFilters = {
        ...state.filters,
        anomalies: exists
          ? state.filters.anomalies.filter((a) => a !== anomaly)
          : [...state.filters.anomalies, anomaly],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: buildFilteredIds(state.trays, newFilters),
        _cachedFilterKey: key,
      };
    }),

  toggleRackId: (rackId) =>
    set((state) => {
      const exists = state.filters.rackIds.includes(rackId);
      const newFilters = {
        ...state.filters,
        rackIds: exists
          ? state.filters.rackIds.filter((r) => r !== rackId)
          : [...state.filters.rackIds, rackId],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: buildFilteredIds(state.trays, newFilters),
        _cachedFilterKey: key,
      };
    }),

  toggleBatchId: (batchId) =>
    set((state) => {
      const exists = state.filters.batchIds.includes(batchId);
      const newFilters = {
        ...state.filters,
        batchIds: exists
          ? state.filters.batchIds.filter((b) => b !== batchId)
          : [...state.filters.batchIds, batchId],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: buildFilteredIds(state.trays, newFilters),
        _cachedFilterKey: key,
      };
    }),

  toggleGrowthStage: (stage) =>
    set((state) => {
      const exists = state.filters.growthStages.includes(stage);
      const newFilters = {
        ...state.filters,
        growthStages: exists
          ? state.filters.growthStages.filter((s) => s !== stage)
          : [...state.filters.growthStages, stage],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: buildFilteredIds(state.trays, newFilters),
        _cachedFilterKey: key,
      };
    }),

  clearFilters: () =>
    set((state) => {
      const newFilters: StoreState['filters'] = {
        cropTypes: [],
        anomalies: [],
        rackIds: [],
        batchIds: [],
        growthStages: [],
      };
      const key = buildFilterKey(newFilters);
      if (key === state._cachedFilterKey) {
        return { filters: newFilters };
      }
      return {
        filters: newFilters,
        filteredTrayIds: new Set(),
        _cachedFilterKey: key,
      };
    }),

  getAnomalies: calcAnomalies,

  hasAnomaly: (tray: TrayData): boolean => {
    return calcAnomalies(tray).length > 0;
  },

  getFilteredTrays: (): TrayData[] => {
    const { trays, filteredTrayIds } = get();
    if (filteredTrayIds.size === 0) return trays;
    return trays.filter((t) => filteredTrayIds.has(t.id));
  },
}));

export { calcAnomalies };
