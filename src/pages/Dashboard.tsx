import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, Droplets, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Dashboard as DashboardData, Plant } from '../types';
import { getErrorMessage } from '../services/api';
import { plantService } from '../services/plantService';
import { daysLate, todayISO } from '../utils/date';
import { toRequest } from '../utils/plant';
import { btnOutline } from '../utils/ui';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

interface RowProps {
  plant: Plant;
  onWatered: (p: Plant) => void;
}

const Row = ({ plant, onWatered }: RowProps) => (
  <li className="flex items-center gap-3 border-t border-bordas py-2 text-sm first:border-t-0">
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-secundary-background text-primary-button">
      <Sprout size={18} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate font-semibold text-titles">{plant.name}</p>
      <p className="truncate text-xs text-gray-500">{plant.location || plant.categoryName}</p>
    </div>
    {plant.wateringStatus === 'OVERDUE' && (
      <StatusBadge status="OVERDUE" label={`${daysLate(plant.nextWatering)} d`} />
    )}
    <button className={btnOutline} onClick={() => onWatered(plant)}>Reguei</button>
  </li>
);

const Section = ({ icon, title, plants, empty, onWatered }: {
  icon: ReactNode; title: string; plants: Plant[]; empty: string; onWatered: (p: Plant) => void;
}) => (
  <section>
    <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-titles">
      <span className="text-details">{icon}</span>
      {title}
    </h2>
    {plants.length === 0 ? (
      <p className="rounded-xl bg-primary-background p-4 text-sm text-gray-500">{empty}</p>
    ) : (
      <ul>{plants.map((p) => <Row key={p.id} plant={p} onWatered={onWatered} />)}</ul>
    )}
  </section>
);

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setData(await plantService.dashboard());
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleWatered = async (plant: Plant) => {
    try {
      await plantService.update(plant.id, { ...toRequest(plant), lastWatering: todayISO() });
      toast.success(`${plant.name} regada!`);
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Carregando...</p>;
  if (!data) return <p className="text-sm text-gray-500">Não foi possível carregar o painel.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Plantas" value={data.totalPlants} />
        <StatCard label="Regar hoje" value={data.plantsToWaterToday} valueClassName="text-amber-700" />
        <StatCard label="Atrasadas" value={data.overduePlants} valueClassName="text-red-700" />
        <StatCard label="Categorias" value={data.totalCategories} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Section icon={<Droplets size={16} />} title="Regar hoje" plants={data.wateringToday}
          empty="Nenhuma planta para regar hoje." onWatered={handleWatered} />
        <Section icon={<AlertCircle size={16} />} title="Atrasadas" plants={data.overdue}
          empty="Tudo em dia por aqui." onWatered={handleWatered} />
      </div>
    </div>
  );
};
