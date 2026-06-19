import { TrayData, RackData, BatchData, GrowthStage, DiseaseRisk, HistoryPoint } from '@/types';

const GROWTH_STAGES: GrowthStage[] = ['seedling', 'vegetative', 'flowering', 'mature', 'harvest'];
const DISEASE_RISKS: DiseaseRisk[] = ['low', 'low', 'low', 'medium', 'high'];
const CROP_TYPES = ['生菜', '番茄', '黄瓜', '草莓', '菠菜', '芹菜', '小白菜', '罗勒'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function generateHistory(days: number): HistoryPoint[] {
  const history: HistoryPoint[] = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = addDays(today, -i);
    history.push({
      date: formatDate(date),
      humidity: randomFloat(55, 85),
      light: randomInt(8000, 25000),
      temperature: randomFloat(18, 28),
      nutrient: randomFloat(1.2, 2.8),
    });
  }
  return history;
}

export function generateRacks(): RackData[] {
  const racks: RackData[] = [];
  const rackCount = 6;
  const rows = 2;
  const cols = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `R-${String(r * cols + c + 1).padStart(2, '0')}`;
      racks.push({
        id,
        name: `${r * cols + c + 1}号层架`,
        positionX: (c - 1) * 8,
        positionZ: (r - 0.5) * 10,
        layers: 4,
        traysPerLayer: 6,
      });
    }
  }
  return racks;
}

export function generateBatches(): BatchData[] {
  const batches: BatchData[] = [];
  const today = new Date();
  for (let i = 0; i < 8; i++) {
    batches.push({
      id: `B${String(i + 1).padStart(3, '0')}`,
      cropType: CROP_TYPES[i % CROP_TYPES.length],
      plantDate: formatDate(addDays(today, -randomInt(5, 40))),
    });
  }
  return batches;
}

export function generateTrays(racks: RackData[], batches: BatchData[]): TrayData[] {
  const trays: TrayData[] = [];
  const today = new Date();

  for (const rack of racks) {
    for (let layer = 1; layer <= rack.layers; layer++) {
      for (let pos = 0; pos < rack.traysPerLayer; pos++) {
        const batch = randomChoice(batches);
        const growthStage: GrowthStage = GROWTH_STAGES[randomInt(0, 4)];
        const ageDays = randomInt(3, 55);
        const humidity = randomFloat(40, 95);
        const light = randomInt(3000, 30000);
        const nutrient = randomFloat(0.6, 3.2);
        const diseaseRisk: DiseaseRisk = DISEASE_RISKS[randomInt(0, 4)];

        trays.push({
          id: `${rack.id}-L${layer}-P${String(pos + 1).padStart(2, '0')}`,
          rackId: rack.id,
          layer,
          position: pos,
          cropType: batch.cropType,
          batchId: batch.id,
          growthStage,
          ageDays,
          humidity,
          light,
          nutrient,
          diseaseRisk,
          expectedHarvest: formatDate(addDays(today, randomInt(3, 25))),
          photoUrls: [],
          history: generateHistory(randomInt(7, 30)),
        });
      }
    }
  }
  return trays;
}
