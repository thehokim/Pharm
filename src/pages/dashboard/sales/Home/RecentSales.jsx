import { ReceiptIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const RecentSales = ({ sales }) => {
  const { t } = useTranslation("sales_home");

  return (
    <div className="bg-white rounded-2xl p-4">
      <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
        <ReceiptIcon className="w-4 h-4" />
        {t("recent_sales")}
      </h3>
      <ul className="space-y-2 text-sm">
        {sales.map((sale, i) => (
          <li key={i} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{sale.name}</p>
              <p className="text-gray-500 text-xs">{sale.email}</p>
            </div>
            <p className="font-semibold text-green-600">
              {Number(sale.amount).toLocaleString()} {t("sum")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSales;
