import { useState } from 'react';
import { Pencil, Sprout, Trash2 } from 'lucide-react';
import type { Plant } from '../types';
import { formatShort } from '../utils/date';
import { StatusBadge } from './StatusBadge';

interface Props {
  plant: Plant;
  onEdit: (p: Plant) => void;
  onDelete: (p: Plant) => void;
}

export const PlantCard = ({ plant, onEdit, onDelete }: Props) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-bordas bg-white">
      <div className="flex h-28 items-center justify-center bg-secundary-background text-primary-button">
        {plant.imageUrl && !imgError ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Sprout size={36} />
        )}
      </div>
      <div className="space-y-2 p-3 text-sm">
        <div>
          <h3 className="font-bold text-titles">{plant.name}</h3>
          <p className="text-gray-500">{plant.species || 'Espécie não informada'}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <StatusBadge status={plant.wateringStatus} />
          <span>Próxima: {formatShort(plant.nextWatering)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{[plant.location, plant.categoryName].filter(Boolean).join(' · ')}</span>
          <span className="flex gap-2 text-primary-button">
            <button onClick={() => onEdit(plant)} aria-label={`Editar ${plant.name}`}><Pencil size={15} /></button>
            <button onClick={() => onDelete(plant)} aria-label={`Excluir ${plant.name}`}><Trash2 size={15} /></button>
          </span>
        </div>
      </div>
    </article>
  );
};
