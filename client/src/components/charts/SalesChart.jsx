import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SalesChart({ data = [] }) {
  // Format tooltip untuk menampilkan nilai dalam format Rupiah
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded shadow-md">
          <p className="text-sm font-semibold text-slate-800">{payload[0].payload.month}</p>
          <p className="text-sm text-blue-600">
            Rp {(payload[0].value || 0).toLocaleString("id-ID")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data.length > 0 ? data : []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ fill: "#2563eb", r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}