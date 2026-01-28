import { useThemeContext } from '@/contexts/themeContext';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// 主组件
const Layout: React.FC = () => {

  const { isDark } = useThemeContext();

  // 控制登录模态框的显示和隐藏
  const [showLoginModal, setShowLoginModal] = useState(false);

  const location = useLocation();  // 添加这一行

  // 根据当前路径判断哪个链接是激活状态
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* 导航栏 */}
      <nav className={`
        w-1/2 fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        ${isDark
          ? 'bg-gray-900/50'
          : 'bg-white/80'}
        rounded-2xl px-6 py-4 shadow-lg
        backdrop-blur-sm transition-all duration-200 ease-in
      `}>
        <div className="flex items-center justify-between space-x-6 pl-12">
          <div className="hidden md:flex space-x-10">
            <a href="/" className={`hover:text-emerald-400 transition-colors ${isActive('/') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>首页</a>
            <a href="/price" className={`hover:text-emerald-400 transition-colors ${isActive('/price') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>价格</a>
            <a href="/docspage" className={`hover:text-emerald-400 transition-colors ${isActive('/docspage') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>文档</a>
          </div>
          <button className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${isDark
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
          `}
            onClick={() => setShowLoginModal(true)}
          >
            登录
          </button>
        </div>
      </nav>

      {/* 登录模态框 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`
            w-full max-w-md rounded-2xl p-8 relative
            ${isDark
              ? 'bg-gray-900/90 border-none'
              : 'bg-white/90 border-none'}
          `}>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">登录 | 注册</h2>
            <form className="space-y-4">
              <div>
                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>邮箱</label>
                <input
                  type="email"
                  className={`
                    w-full px-4 py-3 rounded-lg border outline-none
                    ${isDark
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'}
                  `}
                  placeholder="请输入邮箱地址"
                />
              </div>
              <div>
                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>密码</label>
                <input
                  type="password"
                  className={`
                    w-full px-4 py-3 rounded-lg border outline-none
                    ${isDark
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'}
                  `}
                  placeholder="请输入密码"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
              >
                登录
              </button>
              <div className="text-center mt-4">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  还没有账户？
                  <a href="" className="text-emerald-400 hover:underline">立即注册</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}




      {/* 主内容区 */}
      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;