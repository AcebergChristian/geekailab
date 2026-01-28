import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Docs from "@/pages/Docs";
import Price from "@/pages/Price";
import Layout from "@/pages/Layout";
import System from "@/pages/System";
import Dash from "@/views/dash";
import Workbench from "@/views/workbench";
import Saijia from "@/views/saijia";
import Dataset from "@/views/dataset";

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
            <Route path="/" element={<Layout /> }>
              <Route index element={<Home />} />
              <Route path="docspage" element={<Docs />} />
              <Route path="price" element={<Price />} />
            </Route>
            
            <Route path="/system" element={<System /> }>
              <Route path="dashboard" element={<Dash />} />
              <Route path="workbench" element={<Workbench />} />
              <Route path="saijia" element={<Saijia />} />
              <Route path="dataset" element={<Dataset />} />
              <Route path="experiment" element={<div className="text-center text-xl">Experiment View - Coming Soon</div>} />
              <Route path="chart" element={<div className="text-center text-xl">Chart View - Coming Soon</div>} />
              <Route path="grid" element={<div className="text-center text-xl">Grid View - Coming Soon</div>} />
            </Route>
            
            <Route path="/dashboard" element={<Navigate to="/system/dashboard" replace />} />
            <Route path="/workbench" element={<Navigate to="/system/workbench" replace />} />
            <Route path="/saijia" element={<Navigate to="/system/saijia" replace />} />
            <Route path="/dataset" element={<Navigate to="/system/dataset" replace />} />
            <Route path="/experiment" element={<Navigate to="/system/experiment" replace />} />
            <Route path="/chart" element={<Navigate to="/system/chart" replace />} />
            <Route path="/grid" element={<Navigate to="/system/grid" replace />} />
            
            <Route path="/layout" element={<Navigate to="/system/dashboard" replace />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
            
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthContext.Provider>
      </I18nProvider>
    </ThemeProvider>
  );
}