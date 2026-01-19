import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import Dash from "@/views/dash";
import Workbench from "@/views/workbench";
import Saijia from "@/views/saijia";

import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { ThemeProvider } from '@/contexts/themeContext';
import { I18nProvider } from '@/contexts/i18nContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthContext.Provider
          value={{ isAuthenticated, setIsAuthenticated, logout }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Layout><Dash /></Layout>} />
            <Route path="/workbench" element={<Layout><Workbench /></Layout>} />
            <Route path="/saijia" element={<Layout><Saijia /></Layout>} />
            <Route path="/dataset" element={<Layout><div className="text-center text-xl">Dataset View - Coming Soon</div></Layout>} />
            <Route path="/experiment" element={<Layout><div className="text-center text-xl">Experiment View - Coming Soon</div></Layout>} />
            <Route path="/chart" element={<Layout><div className="text-center text-xl">Chart View - Coming Soon</div></Layout>} />
            <Route path="/grid" element={<Layout><div className="text-center text-xl">Grid View - Coming Soon</div></Layout>} />
            <Route path="/layout" element={<Navigate to="/dashboard" replace />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          </Routes>
        </AuthContext.Provider>
      </I18nProvider>
    </ThemeProvider>
  );
}