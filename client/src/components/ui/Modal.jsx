export default function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl w-full max-w-md p-6">

        <div className="flex justify-between mb-4">

          <h2 className="font-bold text-xl">
            {title}
          </h2>

          <button
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}