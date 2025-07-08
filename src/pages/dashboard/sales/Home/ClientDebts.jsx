import { Combine } from "lucide-react";
import { useTranslation } from "react-i18next";

const ClientDebts = ({ debts }) => {
  const { t } = useTranslation("sales_home");

  return (
    <div className="bg-white rounded-2xl p-4">
      <h3 className="flex items-center gap-1 text-md font-medium text-gray-700 mb-2">
        <Combine className="w-4 h-4" /> {t("client_debts")}
      </h3>
      <ul className="space-y-2 text-sm">
        {debts.map((d, i) => (
          <li key={i} className="flex justify-between items-center p-2 rounded">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-gray-500">
                {t("due")}: {d.due}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-600">
                {Number(d.amount).toLocaleString()} {t("debt_sum")}
              </p>
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                {d.days}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientDebts;
