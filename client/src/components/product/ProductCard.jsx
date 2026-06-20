export default function ProductCard({
  product,
  onAdd,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-slate-200">

      <div className="h-36 bg-slate-100 flex items-center justify-center">
        <span className="text-5xl">
          📦
        </span>
      </div>

      <div className="p-4">

        <h3 className="font-semibold text-slate-800">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500">
          Stok: {product.stock}
        </p>

        <p className="text-lg font-bold text-blue-600 mt-2">
          Rp {product.price.toLocaleString()}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
        >
          Tambah
        </button>

      </div>
    </div>
  );
}