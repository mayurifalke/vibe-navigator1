// src/routes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import SearchPage from "./components/SearchPage";
// import NotFoundPage from "./pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;
