import React, { useState } from 'react';
import { 
  ChevronDown, Search, Filter, Download, Settings, 
  MoreHorizontal, RefreshCw, User, Bell, Menu, Grid, PieChart,
  FileText, BarChart2, LayoutDashboard, Moon, Sun, Home, Users, Database, BarChart3,
  ArrowLeftSquareIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

// 侧边栏按钮组件
interface SidebarButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, active, onClick }) => {
  return (
    <button 
      className={cn(
        'flex items-center justify-center w-10 h-10 mb-2 rounded-md transition-colors',
        active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

// 菜单项接口
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

// 主组件
const System: React.FC = () => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // 使用上下文
  const { theme, toggleTheme, isDark } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();
  
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: t('dashboard'), path: '/system/dashboard' },
    { id: 'workbench', icon: <BarChart3 size={20} />, label: t('workbench'), path: '/system/workbench' },
    { id: 'saijia', icon: <BarChart2 size={20} />, label: t('evaluation'), path: '/system/saijia' },
    { id: 'dataset', icon: <Database size={20} />, label: t('dataset'), path: '/system/dataset' },
    { id: 'experiment', icon: <FileText size={20} />, label: t('experiment'), path: '/system/experiment' },
    { id: 'chart', icon: <PieChart size={20} />, label: t('chart'), path: '/system/chart' },
    { id: 'grid', icon: <Grid size={20} />, label: t('grid'), path: '/system/grid' },
  ];

  // 获取当前激活的菜单项
  const activeTab = menuItems.find(item => location.pathname === item.path)?.id || 'dashboard';

  // 处理菜单点击
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("flex h-screen", isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900")}>
      {/* 左侧边栏 */}
      <aside className={cn("fixed left-0 top-0 h-full w-14 border-r py-4 px-2 hidden md:flex flex-col", 
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
        {menuItems.map(item => (
          <SidebarButton 
            key={item.id} 
            icon={item.icon} 
            active={activeTab === item.id}
            onClick={() => {
              handleMenuClick(item.path);
            }}
          />
        ))}
        
        <div className="mt-auto">
          <button 
            onClick={toggleTheme}
            className={cn(
              'flex items-center justify-center w-10 h-10 mb-2 rounded-md transition-colors',
              isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            )}
            title={t('themeToggle')}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={toggleLanguage}
            className={cn(
              'flex items-center justify-center w-10 h-10 mb-2 rounded-md transition-colors',
              isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            )}
            title={t('languageToggle')}
          >
            {language.toUpperCase()}
          </button>
          <SidebarButton icon={<Settings size={20} />} />
          <SidebarButton
            onClick={() => {
              navigate('/');
            }}
            icon={<ArrowLeftSquareIcon size={20} />} />
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 md:ml-14 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default System;