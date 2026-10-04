import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Category, Plant, PlantRequest } from '../types';
import { todayISO } from '../utils/date';
import { btnOutline, btnPrimary, inputCls } from '../utils/ui';

interface Props {
  initial: Plant | null;
  categories: Category[];
  onSubmit: (data: PlantRequest) => Promise<void>;
  onCancel: () => void;
}

const Field = ({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) => (
  <label className={`block text-xs text-gray-600 ${full ? 'col-span-2' : ''}`}>
    <span className="mb-1 block">{label}</span>
    {children}
  </label>
);

export const PlantForm = ({ initial, categories, onSubmit, onCancel }: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    species: initial?.species ?? '',
    location: initial?.location ?? '',
    wateringFrequency: String(initial?.wateringFrequency ?? 7),
    lastWatering: initial?.lastWatering ?? '',
    sunlight: initial?.sunlight ?? '',
    notes: initial?.notes ?? '',
    imageUrl: initial?.imageUrl ?? '',
    categoryId: initial ? String(initial.categoryId) : '',
  });

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        species: form.species.trim() || null,
        location: form.location.trim() || null,
        wateringFrequency: Number(form.wateringFrequency),
        lastWatering: form.lastWatering || null,
        sunlight: form.sunlight.trim() || null,
        notes: form.notes.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        categoryId: Number(form.categoryId),
      });
    } finally {
      setSaving(false);
    }
  };

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-600">
        Antes de cadastrar uma planta, crie pelo menos uma{' '}
        <Link to="/center/categories" className="font-semibold text-primary-button underline" onClick={onCancel}>
          categoria
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <Field label="Nome *"><input required className={inputCls} value={form.name} onChange={set('name')} placeholder="Monstera" /></Field>
      <Field label="Espécie"><input className={inputCls} value={form.species} onChange={set('species')} placeholder="Monstera deliciosa" /></Field>
      <Field label="Categoria *">
        <select required className={inputCls} value={form.categoryId} onChange={set('categoryId')}>
          <option value="">Selecione</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Local"><input className={inputCls} value={form.location} onChange={set('location')} placeholder="Sala" /></Field>
      <Field label="Regar a cada (dias) *">
        <input required type="number" min={1} max={365} className={inputCls} value={form.wateringFrequency} onChange={set('wateringFrequency')} />
      </Field>
      <Field label="Última rega">
        <input type="date" max={todayISO()} className={inputCls} value={form.lastWatering} onChange={set('lastWatering')} />
      </Field>
      <Field label="Iluminação" full><input className={inputCls} value={form.sunlight} onChange={set('sunlight')} placeholder="Luz indireta" /></Field>
      <Field label="URL da imagem" full><input className={inputCls} value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." /></Field>
      <Field label="Observações" full><textarea rows={2} className={inputCls} value={form.notes} onChange={set('notes')} /></Field>
      <div className="col-span-2 flex justify-end gap-2 pt-1">
        <button type="button" className={btnOutline} onClick={onCancel}>Cancelar</button>
        <button type="submit" className={btnPrimary} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  );
};
