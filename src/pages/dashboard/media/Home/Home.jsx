import React from "react";

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Медиа панель управления
        </h1>
        <p className="text-gray-600">
          Добро пожаловать в панель управления медиа контентом. Здесь вы можете управлять изображениями, видео и документами.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Изображения</h3>
          <p className="text-gray-600">Управление изображениями и фотографиями</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Видео</h3>
          <p className="text-gray-600">Управление видео контентом</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Документы</h3>
          <p className="text-gray-600">Управление документами и файлами</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 