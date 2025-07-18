import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";

const Pagination = ({ page, pageSize, total, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Вычисляем диапазон отображаемых элементов
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Генерируем массив кнопок пагинации
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`h-10 w-10 rounded-full ${
          i === page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => onPageChange(i)}
        disabled={i === page}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <div className="text-xs text-gray-500 mb-1">
        Показано {from}–{to} из {total}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          className="px-2 py-1 rounded"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeftIcon />
        </button>
        {pages}
        <button
          className="px-2 py-1"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
