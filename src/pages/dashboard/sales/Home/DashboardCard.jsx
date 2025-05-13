const DashboardCard = ({ icon, title, value, sub, subColor }) => (
    <div className="bg-white rounded-2xl p-4 space-y-2">
      <h3 className="flex items-center text-sm text-gray-500 gap-1">
        {icon} {title}
      </h3>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      <p className={`text-xs ${subColor}`}>{sub}</p>
    </div>
  );
  
  export default DashboardCard;
  