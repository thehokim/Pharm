import React, { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../utils/auth";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    axios
      .get(`${BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("Ошибка загрузки выписок:", err));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Выберите файл для загрузки");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post(`${BASE_URL}/api/transactions/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSelectedFile(null);
        fetchTransactions();
      })
      .catch((err) => {
        console.error("Ошибка при загрузке файла:", err);
        alert("Не удалось загрузить файл");
      });
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen p-4">
      {/* Header с кнопкой загрузки */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Выписки
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="block"
          />
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Загрузить
          </button>
        </div>
      </div>

      {/* Таблица выписок */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Банк</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Сумма</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4 rounded-tr-xl">Файл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length ? (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium">{tx.id}</td>
                  <td className="px-6 py-4">{tx.bank}</td>
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className="px-6 py-4">{tx.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        tx.status === "Обработано"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.fileUrl ? (
                      <a
                        href={tx.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Скачать
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Нет выписок
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;


//is_active:boolean