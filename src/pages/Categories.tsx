import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '../types';
import { getErrorMessage } from '../services/api';
import { categoryService } from '../services/categoryService';
import { btnPrimary, inputCls } from '../utils/ui';
import { ConfirmModal } from '../components/ConfirmModal';

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deleting, setDeleting] = useState<Category | null>(null);

  const load = useCallback(async () => {
    try {
      setCategories(await categoryService.list());
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await categoryService.create(name.trim());
      setName('');
      toast.success('Categoria criada!');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSaveEdit = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await categoryService.update(id, editName.trim());
      setEditingId(null);
      toast.success('Categoria atualizada!');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const tryDelete = (c: Category) => {
    if (c.plantCount > 0) toast.error('Esta categoria possui plantas e não pode ser excluída.');
    else setDeleting(c);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await categoryService.remove(deleting.id);
      toast.success('Categoria excluída.');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input className={inputCls} placeholder="Nome da nova categoria" value={name}
          onChange={(e) => setName(e.target.value)} />
        <button type="submit" className={btnPrimary}>Adicionar</button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando...</p>
      ) : categories.length === 0 ? (
        <p className="rounded-xl bg-primary-background p-6 text-center text-sm text-gray-500">
          Nenhuma categoria cadastrada.
        </p>
      ) : (
        <ul className="rounded-2xl border border-bordas bg-white px-4">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-3 border-t border-bordas py-3 text-sm first:border-t-0">
              {editingId === c.id ? (
                <>
                  <input autoFocus className={inputCls} value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(c.id)} />
                  <button onClick={() => handleSaveEdit(c.id)} aria-label="Salvar" className="text-primary-button"><Check size={18} /></button>
                  <button onClick={() => setEditingId(null)} aria-label="Cancelar" className="text-gray-500"><X size={18} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-semibold text-titles">{c.name}</span>
                  <span className="rounded-full bg-primary-background px-2.5 py-0.5 text-xs text-gray-600">
                    {c.plantCount} {c.plantCount === 1 ? 'planta' : 'plantas'}
                  </span>
                  <button onClick={() => { setEditingId(c.id); setEditName(c.name); }}
                    aria-label={`Editar ${c.name}`} className="text-primary-button"><Pencil size={16} /></button>
                  <button onClick={() => tryDelete(c)} aria-label={`Excluir ${c.name}`}
                    className={c.plantCount > 0 ? 'text-gray-300' : 'text-red-600'}><Trash2 size={16} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <ConfirmModal
          title="Excluir categoria"
          message={`Tem certeza que deseja excluir "${deleting.name}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
};
