import {
  DollarSign,
  FileText,
  HandCoins,
  CalendarClock,
} from "lucide-react";

const iconMap = {
  revenue: <DollarSign className="w-5 h-5 text-green-600" />,
  statements: <FileText className="w-5 h-5 text-blue-600" />,
  debt: <HandCoins className="w-5 h-5 text-red-600" />,
  tax: <CalendarClock className="w-5 h-5 text-yellow-500" />,
};

const AccountantStatCard = ({ label, value, delta, type = "revenue" }) => (
  <div className="bg-white rounded-xl p-4 space-y-2">
    <div className="flex justify-between items-center">
      <h2 className="text-sm text-gray-500">{label}</h2>
      {iconMap[type]}
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-400">{delta}</p>
  </div>
);

export default AccountantStatCard;
