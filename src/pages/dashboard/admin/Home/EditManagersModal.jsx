import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const EditManagersModal = ({ managers = [], onClose, onSave }) => {
  const [editedManagers, setEditedManagers] = useState(managers);

  const handleChange = (index, value) => {
    const updated = [...editedManagers];
    updated[index].fullName = value;
    setEditedManagers(updated);
  };

  const handleDelete = (index) => {
    const updated = [...editedManagers];
    updated.splice(index, 1);
    setEditedManagers(updated);
  };

  const handleSave = () => {
    console.log("Сохранённые менеджеры:", editedManagers);
    if (onSave) onSave(editedManagers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-lg space-y-2">
        <h2 className="text-lg font-semibold">Редактировать менеджеров</h2>

        <div className="max-h-[60vh] overflow-y-auto">
          {editedManagers.map((manager, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded px-2 py-2"
            >
              <input
                type="text"
                value={manager.fullName}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Имя Фамилия Отчество"
                className="w-full px-4 py-3 border border-gray-100 rounded-xl"
              />
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
                title="Удалить"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-gray-500 px-4 py-3 border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-xl w-full"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="text-white px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl w-full"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditManagersModal;
