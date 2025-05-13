import { BarChart3Icon, Bell } from "lucide-react";

const DashboardHeader = () => (
  <div className="flex items-center justify-between bg-white p-4 rounded-xl">
    <div className="flex items-center space-x-2">
      <BarChart3Icon />
      <h2 className="text-2xl font-semibold text-gray-800">Фармацевтическая панель</h2>
    </div>
    <div className="flex items-center space-x-2">
      <button className="bg-gray-200 rounded-full p-2.5">
        <Bell className="w-5 h-5" />
      </button>
      <button className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold text-gray-800">
        AD
      </button>
    </div>
  </div>
);

export default DashboardHeader;
