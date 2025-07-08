import React, { useState } from "react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const AddManagerModal = ({ onClose, onAdd }) => {
  const { t } = useTranslation("home");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      alert(t("addManagerModal.fillAll"));
      return;
    }

    const newManager = {
      full_name: fullName,
      username,
      role: "sales",
      password,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newManager),
      });

      if (!res.ok) throw new Error(t("addManagerModal.error"));

      const data = await res.json();
      if (onAdd) onAdd({ fullName: data.full_name, profit: 0 });
      onClose();
    } catch (err) {
      alert(t("addManagerModal.error") + ": " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">{t("addManagerModal.title")}</h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t("addManagerModal.fullName")}
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("addManagerModal.username")}
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("addManagerModal.password")}
          className="w-full border border-gray-100 px-3 py-3 rounded-xl"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-50 border border-gray-100 hover:bg-gray-100 px-4 py-3 rounded-xl w-full"
          >
            {t("addManagerModal.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
          >
            {t("addManagerModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddManagerModal;
