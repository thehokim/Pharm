import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
} from "recharts";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Кастомный тултип в фармацевтическом стиле
const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation();
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border-2 border-emerald-400/50 rounded-2xl p-4 text-sm shadow-2xl"
           style={{ 
             boxShadow: '0 0 30px #10b98130, 0 0 60px #10b98120',
             background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))'
           }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"
               style={{ boxShadow: '0 0 8px #10b981' }}></div>
          <p className="text-emerald-400 font-semibold"
             style={{ textShadow: '0 0 10px #10b98150' }}>
            {label}
          </p>
        </div>
        <p className="text-white font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
          {t("monthly.income")}: 
          <span className="text-emerald-400 font-bold"
                style={{ textShadow: '0 0 8px #10b981' }}>
            {payload[0].value.toLocaleString()} {t("home.soum")}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Неоновые цвета для баров в фармацевтическом стиле
const getBarColor = (value, min, max) => {
  if (value === max) return "#10b981"; // Ярко-зеленый для максимума (здоровье)
  if (value === min) return "#ef4444";  // Красный для минимума (опасность)
  return "#06b6d4"; // Циан для обычных значений (медицинский синий)
};

// Получить неоновое свечение для бара
const getBarGlow = (value, min, max) => {
  if (value === max) return "0 0 15px #10b981, 0 0 30px #10b98150";
  if (value === min) return "0 0 15px #ef4444, 0 0 30px #ef444450";
  return "0 0 10px #06b6d4, 0 0 20px #06b6d450";
};

const MonthlyChart = ({ data }) => {
  const { t } = useTranslation("home");
  const amounts = data.map((item) => item.amount);
  const max = Math.max(...amounts, 0);
  const min = Math.min(...amounts, 0);

  return (
    <div className="relative bg-gray-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 col-span-2 overflow-hidden"
         style={{ boxShadow: '0 0 30px #10b98115, 0 0 60px #10b98110' }}>
      
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        {/* Заголовок с фармацевтическими иконками */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
            <div className="relative bg-gray-800 border-2 border-emerald-400 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Activity className="text-emerald-400 w-5 h-5" 
                         style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                <BarChart3 className="text-cyan-400 w-5 h-5" 
                           style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
              </div>
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white"
                  style={{ textShadow: '0 0 15px #10b98150' }}>
              {t("monthly.title")}
            </span>
            <p className="text-emerald-400 text-sm mt-1">
              {t("pharma_sales_dynamics")}
            </p>
          </div>
        </div>

        {/* График с неоновыми эффектами */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, bottom: 10, left: -40, right: 20 }}
              barCategoryGap={10}
            >
              <XAxis
                type="number"
                tickFormatter={(val) => val.toLocaleString()}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                style={{ filter: 'drop-shadow(0 0 5px #06b6d450)' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={90}
                interval={0}
                style={{ filter: 'drop-shadow(0 0 5px #10b98150)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                radius={[0, 8, 8, 0]}
                barSize={26}
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.amount, min, max)}
                    style={{
                      filter: `drop-shadow(${getBarGlow(entry.amount, min, max)})`,
                    }}
                  />
                ))}
                <LabelList
                  dataKey="amount"
                  position="insideRight"
                  formatter={(val) => `${val.toLocaleString()}`}
                  fill="#ffffff"
                  fontSize={11}
                  style={{ 
                    fontWeight: 700,
                    textShadow: '0 0 8px rgba(0,0,0,0.8)'
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Неоновая сетка-подложка */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent"></div>
          </div>
        </div>

        {/* Индикаторы статистики */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"
                   style={{ boxShadow: '0 0 10px #10b981' }}></div>
              <span className="text-gray-400 text-sm">{t("maximum")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"
                   style={{ boxShadow: '0 0 10px #06b6d4' }}></div>
              <span className="text-gray-400 text-sm">{t("normal")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"
                   style={{ boxShadow: '0 0 10px #ef4444' }}></div>
              <span className="text-gray-400 text-sm">{t("minimum")}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-xs">{t("total_income_period")}</p>
            <p className="text-emerald-400 font-bold text-lg"
               style={{ textShadow: '0 0 10px #10b98150' }}>
              {amounts.reduce((sum, val) => sum + val, 0).toLocaleString()} {t("home.soum")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;