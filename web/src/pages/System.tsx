import React from 'react';
import {
  Grid, PieChart, FileText, BarChart2, LayoutDashboard, Moon, Sun, Database, BarChart3,
  ArrowLeftSquareIcon, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const System: React.FC = () => {
  const { toggleTheme, isDark } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard'), path: '/system/dashboard' },
    { id: 'workbench', icon: <BarChart3 size={18} />, label: t('workbench'), path: '/system/workbench' },
    { id: 'saijia', icon: <BarChart2 size={18} />, label: t('evaluation'), path: '/system/saijia' },
    { id: 'dataset', icon: <Database size={18} />, label: t('dataset'), path: '/system/dataset' },
    { id: 'experiment', icon: <FileText size={18} />, label: t('experiment'), path: '/system/experiment' },
    { id: 'chart', icon: <PieChart size={18} />, label: t('chart'), path: '/system/chart' },
    { id: 'grid', icon: <Grid size={18} />, label: t('grid'), path: '/system/grid' }
  ];

  const activeTab = menuItems.find((item) => location.pathname === item.path)?.id || 'dashboard';

  return (
    <div className="workspace-shell flex h-screen overflow-hidden">
      <aside className="workspace-sidebar hidden h-screen w-[140px] shrink-0 flex-col overflow-hidden px-2 py-4 md:flex">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-3 px-2 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] font-semibold text-app-accent">
            G
          </div>
          <div>
            <div className="text-sm font-semibold text-app">GeekLab</div>
            <div className="workspace-muted text-xs uppercase tracking-[0.18em]">System</div>
          </div>
        </button>

        <div className="mb-3 px-2 workspace-sidebar-title">Workspace</div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn('workspace-nav-item w-full', activeTab === item.id && 'workspace-nav-item-active')}
            >
              <span className="opacity-90">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-6">
          <div className="px-2 workspace-sidebar-title">Preferences</div>
          <button onClick={toggleTheme} className="workspace-nav-item w-full">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{t('themeToggle')}</span>
          </button>
          <button onClick={toggleLanguage} className="workspace-nav-item w-full">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-md border border-app text-[10px] font-semibold">
              {language.toUpperCase()}
            </span>
            <span>{t('languageToggle')}</span>
          </button>
          <button className="workspace-nav-item w-full">
            <Settings size={18} />
            <span>{t('设置')}</span>
          </button>
          <button onClick={() => navigate('/')} className="workspace-nav-item w-full">
            <ArrowLeftSquareIcon size={18} />
            <span>{t('返回首页')}</span>
          </button>
        </div>
      </aside>

      <main className="workspace-main h-screen flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default System;
