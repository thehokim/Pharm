import React, { useState } from "react";

const AddManagerModal = ({ onClose, onAdd }) => {
  const [fullName, setFullName] = useState("");

  const handleSave = () => {
    if (!fullName.trim()) {
      alert("Пожалуйста, введите имя и фамилию.");
      return;
    }

    const newManager = {
      fullName,
      profit: 0, // по умолчанию 0 или можно не указывать вовсе
    };

    console.log("Новый менеджер:", newManager);
    if (onAdd) onAdd(newManager);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Добавить менеджера</h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Имя и фамилия"
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-4 py-3 rounded-xl w-full"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddManagerModal;
