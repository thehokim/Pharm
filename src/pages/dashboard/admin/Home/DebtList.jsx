import React, { useState } from "react";
import { AlertTriangle, Clock, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const DebtList = ({ debts }) => {
  const { t } = useTranslation("home");
  const [showAll, setShowAll] = useState(false);
  const visibleDebts = showAll ? debts : debts.slice(0, 5);

  // Определение критичности долга по дням
  const getDebtSeverity = (days) => {
    if (days > 20) return { color: "#ef4444", glow: "0 0 15px #ef4444", level: "critical" };
    if (days > 10) return { color: "#f59e0b", glow: "0 0 12px #f59e0b", level: "warning" };
    return { color: "#06b6d4", glow: "0 0 10px #06b6d4", level: "normal" };
  };

  return (
    <div className="relative bg-gray-900/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 overflow-hidden"
         style={{ boxShadow: '0 0 30px #ef444415, 0 0 60px #ef444410' }}>
      
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-red-400/10 rounded-full blur-3xl -translate-y-14 translate-x-14"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>
      
      <div className="relative z-10">
        {/* Заголовок с предупреждающими иконками */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-md opacity-50"></div>
            <div className="relative bg-gray-800 border-2 border-amber-400 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <CreditCard className="text-amber-400 w-5 h-5" 
                            style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
              </div>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white"
                  style={{ textShadow: '0 0 15px #ef444450' }}>
              {t("debtList.title")}
            </span>
            <p className="text-amber-400 text-sm mt-1">
              {t("critical_debts")}
            </p>
          </div>
        </div>

        {/* Список долгов */}
        <div className="space-y-3">
          {visibleDebts.map((debt, i) => {
            const severity = getDebtSeverity(debt.days);
            return (
              <div key={i} 
                   className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 transition-all duration-300 hover:border-opacity-80 hover:bg-gray-800/60 group"
                   style={{ 
                     borderColor: `${severity.color}40`,
                     boxShadow: `0 0 0 1px ${severity.color}20`
                   }}>
                
                {/* Индикатор критичности */}
                <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl transition-all duration-300 group-hover:w-3"
                     style={{ 
                       backgroundColor: severity.color,
                       boxShadow: severity.glow
                     }}></div>
                
                <div className="flex justify-between items-center ml-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-white text-sm"
                         style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
                        {debt.name}
                      </p>
                      {severity.level === 'critical' && (
                        <AlertTriangle className="w-4 h-4 text-red-400" 
                                      style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" style={{ color: severity.color }} />
                      <p className="text-xs text-gray-400">
                        {t("debtList.overdue", { days: debt.days })}
                      </p>
                      
                      {/* Бейдж критичности */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                        severity.level === 'critical' ? 'bg-red-900/30 text-red-400 border-red-400/30' :
                        severity.level === 'warning' ? 'bg-amber-900/30 text-amber-400 border-amber-400/30' :
                        'bg-cyan-900/30 text-cyan-400 border-cyan-400/30'
                      }`}
                            style={{ boxShadow: `0 0 8px ${severity.color}30` }}>
                        {severity.level === 'critical' ? t("critical") : 
                         severity.level === 'warning' ? t("attention") : t("normal_level")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-lg text-white whitespace-nowrap"
                       style={{ 
                         color: severity.color,
                         textShadow: `0 0 10px ${severity.color}50`,
                         filter: `drop-shadow(0 0 8px ${severity.color})`
                       }}>
                      {debt.sum} {t("home.soum")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Кнопка показать больше/меньше */}
        {debts.length > 5 && (
          <div className="mt-6">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="relative w-full bg-gray-800/50 backdrop-blur-sm border-2 border-red-400/30 text-red-400 font-medium rounded-2xl px-6 py-4 transition-all duration-300 hover:border-red-400/50 hover:bg-gray-800/70 hover:scale-[1.02] group overflow-hidden"
              style={{ boxShadow: '0 0 20px #ef444420' }}
            >
              {/* Неоновый эффект при hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-transparent to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-2">
                <span style={{ textShadow: '0 0 8px #ef444450' }}>
                  {showAll ? t("debtList.showLess") : t("debtList.showMore")}
                </span>
                {showAll ? (
                  <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                             style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                ) : (
                  <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                               style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                )}
              </div>
            </button>
          </div>
        )}

        {/* Статистика долгов */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"
                   style={{ boxShadow: '0 0 10px #ef4444' }}></div>
              <span className="text-gray-400 text-sm">{t("critical")} ({debts.filter(d => d.days > 20).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"
                   style={{ boxShadow: '0 0 10px #f59e0b' }}></div>
              <span className="text-gray-400 text-sm">{t("attention")} ({debts.filter(d => d.days > 10 && d.days <= 20).length})</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-xs">{t("total_debts")}</p>
            <p className="text-red-400 font-bold text-lg"
               style={{ textShadow: '0 0 10px #ef444450' }}>
              {debts.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtList;