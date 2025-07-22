import { LogOut } from "lucide-react";

// Пример использования компонента
const LogoutButton = ({ handleLogout }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <button
        onClick={handleLogout}
        className="relative flex w-full items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30 hover:border-red-400 hover:text-red-300 hover:scale-105 transition-all duration-200 group overflow-hidden"
        style={{ 
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
          // Убеждаемся что кнопка всегда кликабельна
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1
        }}
        // Дополнительные обработчики для уверенности
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Анимированный фон - НЕ блокирует клики */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ 
            pointerEvents: 'none', // ВАЖНО: не блокирует клики
            zIndex: -1 // Помещаем под контент
          }}
        ></div>
        
        {/* Дополнительный декоративный слой */}
        <div 
          className="absolute inset-0 bg-red-400/5 opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ 
            pointerEvents: 'none', // ВАЖНО: не блокирует клики
            zIndex: -1
          }}
        ></div>
        
        {/* Иконка и текст */}
        <LogOut 
          className="relative w-5 h-5" 
          style={{ 
            filter: 'drop-shadow(0 0 8px currentColor)',
            pointerEvents: 'none', // Иконка не блокирует клики
            zIndex: 2
          }} 
        />
        
        {/* Невидимый слой для максимальной кликабельности */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            cursor: 'pointer',
            zIndex: 10,
            background: 'transparent'
          }}
          onClick={handleLogout}
        />
      </button>
    </div>
  );
};

export default LogoutButton;