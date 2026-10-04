interface Props {
  label: string;
  value: number;
  valueClassName?: string;
}

export const StatCard = ({ label, value, valueClassName = 'text-titles' }: Props) => (
  <div className="rounded-xl border border-bordas bg-primary-background p-3">
    <p className="text-xs text-gray-600">{label}</p>
    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
  </div>
);
