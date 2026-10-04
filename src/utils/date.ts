
export const todayISO = () => new Date().toLocaleDateString('en-CA');

export const formatShort = (iso: string | null) => {
  if (!iso) return '—';
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};

export const daysLate = (iso: string | null) => {
  if (!iso) return 0;
  const [y, m, d] = iso.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((now.getTime() - due.getTime()) / 86400000));
};
