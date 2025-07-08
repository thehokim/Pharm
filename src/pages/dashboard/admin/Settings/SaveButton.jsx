import React from "react";
import { Save } from "lucide-react";

const SaveButton = ({ onClick }) => (
  <div className="flex justify-end">
    <button
      onClick={onClick}
      className="bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-2xl px-4 py-4 text-lg font-semibold flex items-center gap-2  transition"
    >
      <Save size={20} />
      
    </button>
  </div>
);

export default SaveButton;
