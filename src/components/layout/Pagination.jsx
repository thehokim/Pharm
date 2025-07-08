import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Генерим массив кнопок пагинации
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`mx-1 px-3 py-1 rounded-lg ${
          i === page ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => onPageChange(i)}
        disabled={i === page}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 py-3">
      <button
        className="px-2 py-1 rounded bg-gray-200"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        {"<"}
      </button>
      {pages}
      <button
        className="px-2 py-1 rounded bg-gray-200"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
