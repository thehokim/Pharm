import { FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../utils/auth";

const RecentStatements = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Берем только последние 5 транзакций
        const recentTransactions = (data.data || data || []).slice(0, 5);
        
        setTransactions(recentTransactions);
      } catch (err) {
        console.error("Ошибка загрузки транзакций:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'обработано':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'ожидает':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'ошибка':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Последние выписки
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Последние выписки
        </h3>
        <div className="flex justify-center items-center h-32 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Последние выписки
      </h3>

      <ul className="text-sm space-y-3">
        {transactions.length > 0 ? (
          transactions.map((transaction, i) => (
            <li
              key={transaction.id || i}
              className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {transaction.bank_name || transaction.bank || `Транзакция #${transaction.id}`}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(transaction.created_at || transaction.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatAmount(transaction.amount)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}
                >
                  {transaction.status || 'Неизвестно'}
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            Нет транзакций для отображения
          </li>
        )}
      </ul>
    </div>
  );
};

export default RecentStatements;
