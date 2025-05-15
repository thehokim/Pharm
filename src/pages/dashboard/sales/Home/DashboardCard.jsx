const DashboardCard = ({ icon, title, value, sub, subColor }) => (
  <div className="bg-white rounded-2xl p-4 duration-300 space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <div className="p-2 rounded-full bg-gray-100 text-gray-600">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className={`text-sm font-medium ${subColor}`}>{sub}</p>
  </div>
);

export default DashboardCard;
