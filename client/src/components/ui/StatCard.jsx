export default function StatCard({ title, value, icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition ${
        onClick ? "cursor-pointer hover:bg-blue-50" : ""
      }`}
    >
      
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold text-slate-800">
          {value}
        </h2>
      </div>

      <div className="text-3xl">
        {icon}
      </div>

    </div>
  );
}