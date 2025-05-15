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
  <div className="bg-white rounded-2xl p-4 duration-300 space-y-3">
    <div className="flex justify-between items-center">
      <h2 className="text-sm text-gray-600 font-medium">{label}</h2>
      <div className="p-2 rounded-full bg-gray-100 border border-gray-200">
        {iconMap[type]}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-400">{delta}</p>
  </div>
);


export default AccountantStatCard;
