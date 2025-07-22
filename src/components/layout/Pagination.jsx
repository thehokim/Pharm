import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

const Pagination = ({ meta, onPageChange }) => {
  // Извлекаем данные из meta объекта
  const { page: currentPage, totalPages, total, pageSize } = meta;
  
  if (totalPages <= 1) return null;

  // Вычисляем диапазон отображаемых элементов
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  // Генерируем оптимизированный массив страниц (с точками)
  const generatePageNumbers = () => {
    const range = [];
    let dotsAdded = false;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        range.push(i);
        dotsAdded = false;
      } else if (!dotsAdded) {
        range.push("dots");
        dotsAdded = true;
      }
    }
    return range;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center">
      <nav className="flex flex-wrap justify-center gap-2 mt-6 py-4 select-none bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6"
           style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
        
        {/* Информация о показанных элементах */}
        <div className="w-full text-center mb-2">
          <span className="text-gray-400 text-sm">
            <span className="text-cyan-400 font-semibold">{from}–{to}</span> / <span className="text-cyan-400 font-semibold">{total}</span>
          </span>
        </div>

        {/* First Page */}
        <button
          className="p-3 rounded-full bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Первая"
          style={{ 
            boxShadow: currentPage !== 1 ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
          }}
        >
          <ChevronsLeft size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
        </button>
        
        {/* Previous Page */}
        <button
          className="p-3 rounded-full bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Предыдущая"
          style={{ 
            boxShadow: currentPage !== 1 ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
          }}
        >
          <ChevronLeftIcon size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum, i) =>
          pageNum === "dots" ? (
            <span key={i} className="px-4 py-3 text-gray-500 select-none">…</span>
          ) : (
            <button
              key={i}
              className={`px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                pageNum === currentPage
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white border-2 border-cyan-400/50 shadow-lg scale-105"
                  : "bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
              }`}
              onClick={() => onPageChange(pageNum)}
              disabled={pageNum === currentPage}
              style={{
                boxShadow: pageNum === currentPage 
                  ? '0 0 20px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
                  : '0 0 10px rgba(6, 182, 212, 0.2)',
                textShadow: pageNum === currentPage ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next Page */}
        <button
          className="p-3 rounded-full bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Следующая"
          style={{ 
            boxShadow: currentPage !== totalPages ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
          }}
        >
          <ChevronRightIcon size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
        </button>

        {/* Last Page */}
        <button
          className="p-3 rounded-full bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Последняя"
          style={{ 
            boxShadow: currentPage !== totalPages ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
          }}
        >
          <ChevronsRight size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
        </button>

        {/* Page Info */}
        <div className="ml-4 flex items-center">
          <span className="text-gray-400 text-sm select-none">
            <span className="text-cyan-400 font-semibold">{currentPage}</span> / <span className="text-cyan-400 font-semibold">{totalPages}</span>
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;