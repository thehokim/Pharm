const WarehouseStatCard = ({ label, value, delta, icon }) => (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h2 className="text-sm text-gray-500">{label}</h2>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">{delta}</p>
      </div>
    </div>
  );
  
  export default WarehouseStatCard;
  