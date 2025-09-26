function KpiCard({ title, value, delta, color }) {
  return (
    <div className="bg-white p-4 rounded-lg card-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        </div>
        {/* <div className="text-sm text-gray-600">{delta}</div> */}
      </div>
      {/* <div className="mt-3 text-xs text-gray-400">Compared to last month</div> */}
    </div>
  );
}

export default KpiCard;