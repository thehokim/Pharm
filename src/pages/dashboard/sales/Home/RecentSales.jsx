import { ReceiptIcon } from "lucide-react";

const RecentSales = ({ sales }) => (
  <div className="bg-white rounded-2xl p-4">
    <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
      <ReceiptIcon className="w-4 h-4" />
      Последние продажи
    </h3>
    <ul className="space-y-2 text-sm">
      {sales.map((sale, i) => (
        <li key={i} className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800">{sale.name}</p>
            <p className="text-gray-500 text-xs">{sale.email}</p>
          </div>
          <p className="font-semibold text-green-600">{sale.amount}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentSales;
