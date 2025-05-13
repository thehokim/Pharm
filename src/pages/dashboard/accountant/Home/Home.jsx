import React from "react";
import { Banknote } from "lucide-react";
import AccountantStatCard from "./AccountantStatCard";
import FinanceChart from "./FinanceChart";
import FinanceSummary from "./FinanceSummary";
import RecentStatements from "./RecentStatements";
import TaxCalendar from "./TaxCalendar";

const statData = [
  {
    label: "Общая выручка",
    value: "$45,231.89",
    delta: "+20.1% за месяц",
    type: "revenue",
  },
  {
    label: "Невыполненные выписки",
    value: "12",
    delta: "+3 с вчерашнего дня",
    type: "statements",
  },
  {
    label: "Долги",
    value: "$15,420.00",
    delta: "-2,340 от прошлого месяца",
    type: "debt",
  },
  {
    label: "Ближайшие налоги",
    value: "$8,245.65",
    delta: "Через 15 дней",
    type: "tax",
  },
];

const Home = () => {
  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white rounded-xl p-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Banknote /> Панель управления — Бухгалтерия
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statData.map((stat, idx) => (
          <AccountantStatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FinanceChart />
        <FinanceSummary
          revenue={45231.89}
          expenses={21456.78}
          profit={23775.11}
          profitGrowth="+15.2%"
          clientDebt={15420}
          taxObligation={8245.65}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentStatements />
        <TaxCalendar />
      </div>
    </div>
  );
};

export default Home;
