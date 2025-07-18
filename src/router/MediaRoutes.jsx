import React from "react";
import { Routes, Route } from "react-router-dom";
import MediaSidebar from "../components/layout/MediaSidebar";
import MediaProducts from "../pages/dashboard/media/MediaProducts";
import Settings from "../pages/dashboard/media/Settings/Settings";

const MediaRoutes = () => {
  return (
    <div className="flex">
      <MediaSidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Routes>
          <Route path="" element={<MediaProducts />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default MediaRoutes; 