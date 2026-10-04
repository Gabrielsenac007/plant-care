import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Category, Plant, PlantRequest } from '../types';
import { getErrorMessage } from '../services/api';
import { categoryService } from '../services/categoryService';
import { plantService } from '../services/plantService';
import { inputCls } from '../utils/ui';
import { ConfirmModal } from '../components/ConfirmModal';
import { Modal } from '../components/Modal';
import { PlantCard } from '../components/PlantCard';
import { PlantForm } from '../components/PlantForm';

export const Plants = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plant | null>(null);
  const [deleting, setDeleting] = useState<Plant | null>(null);

  const load = useCallback(async () => {
    try {
      setPlants(
        await plantService.list({
          name: search.trim() || undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
        }),
      );
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [search, categoryId]);

 
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    categoryService.list().then(setCategories).catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  useEffect(() => {
    if (location.state?.openForm) {
      setEditing(null);
      setFormOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = async (data: PlantRequest) => {
    try {
      if (editing) await plantService.update(editing.id, data);
      else await plantService.create(data);
      toast.success(editing ? 'Planta atualizada!' : 'Planta cadastrada!');
      closeForm();
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await plantService.remove(deleting.id);
      toast.success('Planta excluída.');
      load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`${inputCls} sm:flex-1`}
          placeholder="Buscar por nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={`${inputCls} sm:w-52`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : plants.length === 0 ? (
        <p className="rounded-xl bg-primary-background p-6 text-center text-sm text-gray-500">
          Nenhuma planta encontrada.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <PlantCard key={p.id} plant={p}
              onEdit={(plant) => { setEditing(plant); setFormOpen(true); }}
              onDelete={setDeleting} />
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Editar planta' : 'Nova planta'} onClose={closeForm}>
          <PlantForm initial={editing} categories={categories} onSubmit={handleSave} onCancel={closeForm} />
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title="Excluir planta"
          message={`Tem certeza que deseja excluir "${deleting.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
};
