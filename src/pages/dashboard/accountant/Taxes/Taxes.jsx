import React, { useEffect, useState } from "react";
import { Landmark, Search as SearchIcon, Plus } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";
import TaxModal from "./TaxModal";

export default function Taxes() {
  const { t } = useTranslation("acc_tax");
  const [search, setSearch] = useState("");
  const [taxes, setTaxes] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // модалка
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [percentage, setPercentage] = useState("");
  const [amount, setAmount] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tax-types?format=json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTaxTypes(res.data))
      .catch((e) => console.error("Ошибка загрузки типов налогов:", e));
    fetchTaxes();
    // eslint-disable-next-line
  }, [token]);

  const fetchTaxes = () => {
    axios
      .get(`${BASE_URL}/api/tax-obligations?format=json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTaxes(res.data))
      .catch((e) =>
        console.error("Ошибка загрузки налоговых обязательств:", e)
      );
  };

  const openModal = () => {
    setSelectedTypeId("");
    setPercentage("");
    setAmount("");
    setModalOpen(true);
  };

  // ======= AUTO GEN FIELDS =======
  function getAutoMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`; // "2025-07"
  }

  function getAutoDueDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`; // "07-07-2025"
  }

  const handleSubmit = () => {
    if (!selectedTypeId || !amount) {
      alert("Выберите тип и введите сумму");
      return;
    }
    axios
      .post(
        `${BASE_URL}/api/tax-obligations`,
        {
          tax_type_id: selectedTypeId,
          percentage,
          amount,
          month: getAutoMonth(), // авто месяц "YYYY-MM"
          due_date: getAutoDueDate(), // авто дата "DD-MM-YYYY"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setModalOpen(false);
        fetchTaxes();
      })
      .catch((e) => {
        console.error("Ошибка создания обязательства:", e);
        alert("Не удалось добавить налог");
      });
  };

  // фильтрация
  const filtered = taxes.filter((t) =>
    [t.type_name, String(t.amount), t.status].some((v) =>
      (v || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 bg-gray-50 p-6 min-h-screen">
      <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-indigo-50">
            <Landmark className=" text-indigo-700" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {t("tax_obligations")}
          </h2>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md relative">
          <button
            onClick={openModal}
            className="flex items-center gap-1 px-2 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition"
          >
            <Plus size={24} />
          </button>
          <div className="w-full relative">
          <SearchIcon
            className="absolute left-3 top-[calc(50%-10px)] text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:border-indigo-500 outline-none transition"
          />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl overflow-x-auto shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl">ID</th>
              <th className="px-6 py-4">{t("type")}</th>
              <th className="px-6 py-4">{t("percentage")}</th>
              <th className="px-6 py-4">{t("amount")}</th>
              <th className="px-6 py-4">{t("due_date")}</th>
              <th className="px-6 py-4 rounded-tr-xl">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium">{t.id}</td>
                  <td className="px-6 py-4">{t.type_name}</td>
                  <td className="px-6 py-4">{t.percentage}%</td>
                  <td className="px-6 py-4">{t.amount}</td>
                  <td className="px-6 py-4">{t.due_date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        t.status === t("urgent")
                          ? "bg-red-100 text-red-600"
                          : (t.status || "").toLowerCase().includes("дней")
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  {t("not_found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <TaxModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        taxTypes={taxTypes}
        selectedTypeId={selectedTypeId}
        setSelectedTypeId={setSelectedTypeId}
        percentage={percentage}
        setPercentage={setPercentage}
        amount={amount}
        setAmount={setAmount}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
