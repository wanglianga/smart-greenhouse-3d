export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'mature' | 'harvest';

export type DiseaseRisk = 'low' | 'medium' | 'high';

export type AnomalyType = 'disease_high' | 'humidity_low' | 'light_low' | 'nutrient_low';

export interface HistoryPoint {
  date: string;
  humidity: number;
  light: number;
  temperature: number;
  nutrient: number;
}

export interface TrayData {
  id: string;
  rackId: string;
  layer: number;
  position: number;
  cropType: string;
  batchId: string;
  growthStage: GrowthStage;
  ageDays: number;
  humidity: number;
  light: number;
  nutrient: number;
  diseaseRisk: DiseaseRisk;
  expectedHarvest: string;
  photoUrls: string[];
  history: HistoryPoint[];
}

export interface RackData {
  id: string;
  name: string;
  positionX: number;
  positionZ: number;
  layers: number;
  traysPerLayer: number;
}

export interface BatchData {
  id: string;
  cropType: string;
  plantDate: string;
}

export interface FilterState {
  cropTypes: string[];
  anomalies: AnomalyType[];
  rackIds: string[];
  batchIds: string[];
  growthStages: GrowthStage[];
}

export interface StoreState {
  racks: RackData[];
  trays: TrayData[];
  batches: BatchData[];
  filters: FilterState;
  selectedTrayId: string | null;
  showTrayDetail: boolean;
  setSelectedTray: (id: string | null) => void;
  setShowTrayDetail: (show: boolean) => void;
  toggleCropType: (crop: string) => void;
  toggleAnomaly: (anomaly: AnomalyType) => void;
  toggleRackId: (rackId: string) => void;
  toggleBatchId: (batchId: string) => void;
  toggleGrowthStage: (stage: GrowthStage) => void;
  clearFilters: () => void;
  getFilteredTrays: () => TrayData[];
  hasAnomaly: (tray: TrayData) => boolean;
  getAnomalies: (tray: TrayData) => AnomalyType[];
}

export const GROWTH_STAGE_LABELS: Record<GrowthStage, string> = {
  seedling: '育苗期',
  vegetative: '营养生长期',
  flowering: '开花期',
  mature: '成熟期',
  harvest: '采收期',
};

export const DISEASE_RISK_LABELS: Record<DiseaseRisk, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
};

export const CROP_TYPES = ['生菜', '番茄', '黄瓜', '草莓', '菠菜', '芹菜', '小白菜', '罗勒'];

export const ANOMALY_LABELS: Record<AnomalyType, string> = {
  disease_high: '病害高风险',
  humidity_low: '湿度过低',
  light_low: '光照不足',
  nutrient_low: '营养液不足',
};
