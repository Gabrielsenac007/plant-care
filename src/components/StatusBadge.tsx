import type { WateringStatus } from '../types';
import { statusConfig } from '../utils/plant';

export const StatusBadge = ({ status, label }: { status: WateringStatus; label?: string }) => {
  const cfg = statusConfig[status];
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
      {label ?? cfg.label}
    </span>
  );
};
