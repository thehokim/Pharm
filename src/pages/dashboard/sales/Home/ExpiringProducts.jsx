import { Pill } from "lucide-react";

const ExpiringProducts = ({ products }) => (
  <div className="bg-white rounded-2xl p-4">
    <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
      <Pill className="w-4 h-4" />
      Истекающие товары
    </h3>
    <ul className="space-y-2 text-sm">
      {products.map((p, i) => (
        <li key={i} className="flex justify-between items-center p-2 rounded">
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-gray-500">
              Истекает: {p.exp} ({p.left})
            </p>
          </div>
          <div className="text-right">
            <p>{p.stock} в наличии</p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                p.level === "Критично"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {p.level}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ExpiringProducts;
