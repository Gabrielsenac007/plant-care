import { Modal } from './Modal';
import { btnOutline, btnPrimary } from '../utils/ui';

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ title, message, confirmLabel = 'Excluir', onConfirm, onCancel }: Props) => (
  <Modal title={title} onClose={onCancel}>
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-5 flex justify-end gap-2">
      <button className={btnOutline} onClick={onCancel}>Cancelar</button>
      <button className={btnPrimary} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </Modal>
);
