export default function CartSummary({
  total,
  onCheckout,
}) {
  return (
    <div className="mt-auto pt-4">

      <div className="flex justify-between mb-4">

        <span className="font-medium">
          Total
        </span>

        <span className="font-bold text-2xl text-blue-600">
          Rp {total.toLocaleString()}
        </span>

      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
      >
        Checkout
      </button>

    </div>
  );
}