import React, { useMemo } from "react";
import ReactECharts from 'echarts-for-react';
import { Activity, TrendingUp, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Неоновые цвета для баров в фармацевтическом стиле
const getBarColor = (value, min, max) => {
  if (value === max) return "#10b981"; // Ярко-зеленый для максимума (здоровье)
  if (value === min) return "#ef4444";  // Красный для минимума (опасность)
  return "#06b6d4"; // Циан для обычных значений (медицинский синий)
};

const MonthlyChart = ({ data }) => {
  const { t } = useTranslation("home");
  const amounts = data.map((item) => item.amount);
  const max = Math.max(...amounts, 0);
  const min = Math.min(...amounts, 0);

  const chartOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      grid: {
        left: 120,
        right: 60,
        top: 20,
        bottom: 20,
        containLabel: false
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 12,
          fontWeight: 500,
          formatter: (value) => value.toLocaleString()
        },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#e2e8f0',
          fontSize: 11,
          fontWeight: 600,
          width: 100,
          overflow: 'truncate'
        }
      },
      series: [{
        type: 'bar',
        data: data.map(item => ({
          value: item.amount,
          itemStyle: {
            color: getBarColor(item.amount, min, max),
            borderRadius: [0, 8, 8, 0],
            shadowColor: getBarColor(item.amount, min, max),
            shadowBlur: item.amount === max ? 15 : item.amount === min ? 15 : 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        })),
        barWidth: 26,
        label: {
          show: true,
          position: 'insideRight',
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 700,
          formatter: (params) => params.value.toLocaleString(),
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowBlur: 8
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 16,
        padding: 16,
        textStyle: {
          color: '#10b981',
          fontSize: 14
        },
        formatter: (params) => {
          const data = params[0];
          return `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981;"></div>
              <span style="color: #10b981; font-weight: 600; text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);">${data.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span style="color: #10b981; font-weight: 500;">${t("monthly.income")}: </span>
              <span style="color: #10b981; font-weight: 700; text-shadow: 0 0 8px #10b981;">${data.value.toLocaleString()} ${t("home.soum")}</span>
            </div>
          `;
        },
        extraCssText: `
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.2);
          backdrop-filter: blur(12px);
        `
      }
    };
  }, [data, max, min, t]);

  return (
    <div 
      className="relative bg-gray-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 col-span-2 overflow-hidden"
      style={{ 
        boxShadow: '0 0 30px #10b98115, 0 0 60px #10b98110',
      }}
    >
      
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
          <ReactECharts
            option={chartOption}
            style={{ height: '380px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
          
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