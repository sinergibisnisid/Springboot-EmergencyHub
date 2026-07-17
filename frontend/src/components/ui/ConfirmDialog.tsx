interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor?: 'warning' | 'danger' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

const buttonColors = {
  warning: 'bg-[var(--color-warning)] text-[var(--color-text-inverse)]',
  danger: 'bg-[var(--color-critical)] text-white',
  success: 'bg-[var(--color-brand)] text-white',
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmColor = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] p-6 shadow-2xl animate-slide-up">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">{description}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]
              hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg ${buttonColors[confirmColor]}
              hover:opacity-90 transition-opacity cursor-pointer`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
