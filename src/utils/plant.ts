import type { Plant, PlantRequest, WateringStatus } from '../types';

export const statusConfig: Record<WateringStatus, { label: string; className: string }> = {
  UPCOMING: { label: 'Em dia', className: 'bg-secundary-background text-titles' },
  DUE_TODAY: { label: 'Regar hoje', className: 'bg-amber-100 text-amber-800' },
  OVERDUE: { label: 'Atrasada', className: 'bg-red-100 text-red-800' },
  NOT_SET: { label: 'Sem data', className: 'bg-gray-100 text-gray-600' },
};

export const toRequest = (p: Plant): PlantRequest => ({
  name: p.name,
  species: p.species,
  location: p.location,
  wateringFrequency: p.wateringFrequency,
  lastWatering: p.lastWatering,
  sunlight: p.sunlight,
  notes: p.notes,
  imageUrl: p.imageUrl,
  categoryId: p.categoryId,
});
