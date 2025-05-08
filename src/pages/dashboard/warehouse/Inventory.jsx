import React from "react";

const inventoryData = [
  {
    name: "Парацетамол 500мг",
    code: "PRC-500",
    quantity: 120,
    status: "В наличии",
  },
  {
    name: "Амоксициллин 250мг",
    code: "AMX-250",
    quantity: 25,
    status: "Мало",
  },
  {
    name: "Ибупрофен 400мг",
    code: "IBP-400",
    quantity: 0,
    status: "Нет в наличии",
  },
  {
    name: "Цетиризин 10мг",
    code: "CTR-10",
    quantity: 42,
    status: "Истекает",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "В наличии":
      return "bg-green-100 text-green-700";
    case "Мало":
      return "bg-yellow-100 text-yellow-700";
    case "Нет в наличии":
      return "bg-gray-200 text-gray-700";
    case "Истекает":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const Inventory = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Инвентарь</h2>
      <p className="text-gray-600">Актуальный список товаров на складе.</p>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Код</th>
              <th className="px-4 py-2 text-left">Остаток</th>
              <th className="px-4 py-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.quantity} шт</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
