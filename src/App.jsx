import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import AdminPage from './pages/AdminPage';
import LegalPage from './pages/LegalPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projet/:slug" element={<ProjectPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
      </Routes>
    </BrowserRouter>
  );
}
