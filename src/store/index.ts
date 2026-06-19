import { create } from 'zustand';
import { StoreState, AnomalyType, TrayData, GrowthStage } from '@/types';
import { generateRacks, generateBatches, generateTrays } from '@/data/mockData';

const initialRacks = generateRacks();
const initialBatches = generateBatches();
const initialTrays = generateTrays(initialRacks, initialBatches);

export const useGreenhouseStore = create<StoreState>((set, get) => ({
  racks: initialRacks,
  trays: initialTrays,
  batches: initialBatches,
  filters: {
    cropTypes: [],
    anomalies: [],
    rackIds: [],
    batchIds: [],
    growthStages: [],
  },
  selectedTrayId: null,
  showTrayDetail: false,

  setSelectedTray: (id) => set({ selectedTrayId: id, showTrayDetail: id !== null }),
  setShowTrayDetail: (show) => set({ showTrayDetail: show }),

  toggleCropType: (crop) =>
    set((state) => {
      const exists = state.filters.cropTypes.includes(crop);
      return {
        filters: {
          ...state.filters,
          cropTypes: exists
            ? state.filters.cropTypes.filter((c) => c !== crop)
            : [...state.filters.cropTypes, crop],
        },
      };
    }),

  toggleAnomaly: (anomaly) =>
    set((state) => {
      const exists = state.filters.anomalies.includes(anomaly);
      return {
        filters: {
          ...state.filters,
          anomalies: exists
            ? state.filters.anomalies.filter((a) => a !== anomaly)
            : [...state.filters.anomalies, anomaly],
        },
      };
    }),

  toggleRackId: (rackId) =>
    set((state) => {
      const exists = state.filters.rackIds.includes(rackId);
      return {
        filters: {
          ...state.filters,
          rackIds: exists
            ? state.filters.rackIds.filter((r) => r !== rackId)
            : [...state.filters.rackIds, rackId],
        },
      };
    }),

  toggleBatchId: (batchId) =>
    set((state) => {
      const exists = state.filters.batchIds.includes(batchId);
      return {
        filters: {
          ...state.filters,
          batchIds: exists
            ? state.filters.batchIds.filter((b) => b !== batchId)
            : [...state.filters.batchIds, batchId],
        },
      };
    }),

  toggleGrowthStage: (stage) =>
    set((state) => {
      const exists = state.filters.growthStages.includes(stage);
      return {
        filters: {
          ...state.filters,
          growthStages: exists
            ? state.filters.growthStages.filter((s) => s !== stage)
            : [...state.filters.growthStages, stage],
        },
      };
    }),

  clearFilters: () =>
    set({
      filters: {
        cropTypes: [],
        anomalies: [],
        rackIds: [],
        batchIds: [],
        growthStages: [],
      },
    }),

  getAnomalies: (tray: TrayData): AnomalyType[] => {
    const anomalies: AnomalyType[] = [];
    if (tray.diseaseRisk === 'high') anomalies.push('disease_high');
    if (tray.humidity < 55) anomalies.push('humidity_low');
    if (tray.light < 10000) anomalies.push('light_low');
    if (tray.nutrient < 1.2) anomalies.push('nutrient_low');
    return anomalies;
  },

  hasAnomaly: (tray: TrayData): boolean => {
    return get().getAnomalies(tray).length > 0;
  },

  getFilteredTrays: (): TrayData[] => {
    const { trays, filters, getAnomalies } = get();
    return trays.filter((tray) => {
      if (filters.cropTypes.length > 0 && !filters.cropTypes.includes(tray.cropType)) {
        return false;
      }
      if (filters.rackIds.length > 0 && !filters.rackIds.includes(tray.rackId)) {
        return false;
      }
      if (filters.batchIds.length > 0 && !filters.batchIds.includes(tray.batchId)) {
        return false;
      }
      if (filters.growthStages.length > 0 && !filters.growthStages.includes(tray.growthStage as GrowthStage)) {
        return false;
      }
      if (filters.anomalies.length > 0) {
        const trayAnomalies = getAnomalies(tray);
        const hasMatch = filters.anomalies.some((a) => trayAnomalies.includes(a));
        if (!hasMatch) return false;
      }
      return true;
    });
  },
}));
