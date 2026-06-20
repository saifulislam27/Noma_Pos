export default function CartItem({
  item,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b">

      <div>
        <h4 className="font-medium">
          {item.name}
        </h4>

        <p className="text-sm text-slate-500">
          Rp {item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">

        <button
          onClick={() => onDecrease(item.id)}
          className="w-7 h-7 bg-slate-200 rounded"
        >
          -
        </button>

        <span>{item.qty}</span>

        <button
          onClick={() => onIncrease(item.id)}
          className="w-7 h-7 bg-blue-600 text-white rounded"
        >
          +
        </button>

      </div>
    </div>
  );
}