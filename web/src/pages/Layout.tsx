import { useThemeContext } from '@/contexts/themeContext';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18nContext } from '@/contexts/i18nContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactModal from '@/components/ContactModal';

// 主组件
const Layout: React.FC = () => {

  const { isDark, toggleTheme } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();
  
  // 控制登录模态框的显示和隐藏
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const location = useLocation();

  // 根据当前路径判断哪个链接是激活状态
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* 导航栏 */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md ${isDark ? 'bg-black/70 border-gray-800' : 'bg-white/70 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className={`text-2xl font-bold flex items-center ${isDark ? 'text-purple-400' : 'text-emerald-600'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${isDark ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
                  <span className="font-bold text-white">G</span>
                </div>
                <span>Geek AI LAB</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="/" className={`hover:text-emerald-400 transition-colors ${isActive('/') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('home')}</a>
              <a href="/price" className={`hover:text-emerald-400 transition-colors ${isActive('/price') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('pricing')}</a>
              <a href="/docspage" className={`hover:text-emerald-400 transition-colors ${isActive('/docspage') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('docs')}</a>
            </div>
            
            {/* Theme and Language Switch + CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language switch */}
              <div className="relative">
                <select 
                  value={language}
                  onChange={(e) => toggleLanguage()}
                  className={`appearance-none py-1.5 pl-3 pr-8 rounded-md ${
                    isDark 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                      : 'bg-white text-gray-800 border border-gray-300'
                  } focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-emerald-500'}`}
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Theme switch */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
               <button className={`${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-emerald-600 hover:text-emerald-700'} font-medium`} onClick={() => setShowLoginModal(true)}>
                 {t('登录')}
               </button>
               <button className={`font-medium py-2 px-4 rounded-md transition-colors ${
                 isDark 
                   ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                   : 'bg-emerald-500 hover:bg-emerald-600 text-white'
               } mr-3`}>
                 {t('tryNow')}
               </button>
               <button 
                 onClick={() => setContactModalOpen(true)}
                 className={`font-medium py-2 px-4 rounded-md transition-colors ${
                   isDark 
                     ? 'bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-900/20' 
                     : 'bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                 }`}
               >
                 {t('联系我们')}
               </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } focus:outline-none`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className={`px-2 pt-2 pb-3 space-y-1 ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/95 border-gray-200'} border-t`}>
              {/* Language and Theme switch */}
              <div className="flex justify-between items-center px-3 py-2">
                <select 
                  value={language}
                  onChange={(e) => toggleLanguage()}
                  className={`py-1 pl-3 pr-8 rounded-md ${
                    isDark 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                      : 'bg-white text-gray-800 border border-gray-300'
                  } focus:outline-none`}
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${
                    isDark 
                      ? 'bg-gray-800 text-yellow-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              
              {/* Navigation links */}
              <a href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`} onClick={() => setMobileMenuOpen(false)}>{t('home')}</a>
              <a href="/price" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`} onClick={() => setMobileMenuOpen(false)}>{t('pricing')}</a>
              <a href="/docspage" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`} onClick={() => setMobileMenuOpen(false)}>{t('docs')}</a>
              
              {/* CTA buttons */}
              <div className="flex space-x-2 mt-4 px-3">
               <button className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'text-purple-400' 
                     : 'text-emerald-600'
                 }`} onClick={() => {setShowLoginModal(true); setMobileMenuOpen(false);}}>
                 {t('登录')}
               </button>
               <button className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                     : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                 }`} onClick={() => setMobileMenuOpen(false)}>
                 {t('tryNow')}
               </button>
               <button 
                 onClick={() => {setContactModalOpen(true); setMobileMenuOpen(false);}}
                 className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'bg-transparent border border-purple-400 text-purple-300' 
                     : 'bg-transparent border border-emerald-500 text-emerald-700'
                 }`}
               >
                 {t('联系我们')}
               </button>
              </div>
            </div>
          </motion.div>
        )}
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

      {/* 联系我们模态框 */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />


      {/* 主内容区 */}
      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;