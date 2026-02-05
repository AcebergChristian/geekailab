import { useThemeContext } from '@/contexts/themeContext';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18nContext } from '@/contexts/i18nContext';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
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
    <div className={` min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* 导航栏 */}
      <nav
        className={`
    sticky top-2 z-50 rounded-lg backdrop-blur-md shadow-md
    w-full px-4
    ${isDark ? 'bg-black/70 border border-gray-800' : 'bg-white/70 border border-gray-200'}
  `}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          <div className="flex justify-between items-center w-full h-16">
            <div className="flex items-center">
              <div
                className={`text-2xl font-bold flex items-center ${isDark ? 'text-purple-400' : 'text-emerald-600'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${isDark ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
                  <span className="font-bold text-white">G</span>
                </div>
                <span>iMail Rates</span>
              </div>
            </div>


            <div className="flex justify-between items-center  min-w-[60%]">
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-12">
                <a href="/" className={`hover:text-emerald-400 transition-colors ${isActive('/') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('home')}</a>
                <a href="/price" className={`hover:text-emerald-400 transition-colors ${isActive('/price') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('pricing')}</a>
                <a href="/docspage" className={`hover:text-emerald-400 transition-colors ${isActive('/docspage') ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{t('docs')}</a>
              </div>

              {/* Theme and Language Switch + CTA Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language switch */}
                <button
                  onClick={toggleLanguage}
                  className={`rounded-full w-12 h-12 flex items-center justify-center ${isDark
                    ? 'bg-gray-800 text-purple-300'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                  aria-label={language === 'zh' ? "Switch to English" : "Switch to Chinese"}
                >
                  <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
                </button>

                {/* Theme switch */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${isDark
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className={`font-medium py-2 px-4 rounded-md transition-colors ${isDark
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  } mr-3`}
                  onClick={() => setShowLoginModal(true)}>
                  {t('tryNow')}
                </button>
                <button
                  onClick={() => setContactModalOpen(true)}
                  className={`font-medium py-2 px-4 rounded-md transition-colors ${isDark
                    ? 'bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-900/20'
                    : 'bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                    }`}
                >
                  {t('联系我们')}
                </button>
              </div>

            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${isDark
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
            className="md:hidden w-full px-4"
          >
            <div
              className={`
        max-w-7xl mx-auto rounded-lg mt-2 px-2 pt-2 pb-4 space-y-1
        ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/95 border-gray-200'}
      `}
            >
              {/* Language and Theme switch */}
              <div className="flex justify-between items-center px-3 py-2">
                <select
                  value={language}
                  onChange={(e) => toggleLanguage()}
                  className={`py-1 pl-3 pr-8 rounded-md ${isDark
                    ? 'bg-gray-800 text-gray-200 border border-gray-700'
                    : 'bg-white text-gray-800 border border-gray-300'
                    } focus:outline-none`}
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${isDark
                    ? 'bg-gray-800 text-yellow-300'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              {/* Navigation links */}
              <a href="/" className={`mb-2 block px-3 py-2 rounded-md text-base font-medium ${isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`} onClick={() => setMobileMenuOpen(false)}>{t('home')}</a>
              <a href="/price" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`} onClick={() => setMobileMenuOpen(false)}>{t('pricing')}</a>
              <a href="/docspage" className={`block px-3 py-2 rounded-md text-base font-medium ${isDark
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`} onClick={() => setMobileMenuOpen(false)}>{t('docs')}</a>

              {/* CTA buttons */}
              <div className="flex space-x-2 mt-4 px-3">
                <button className={`flex-1 font-medium py-2 px-4 rounded-md ${isDark
                  ? 'text-purple-400'
                  : 'text-emerald-600'
                  }`} onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}>
                  {t('登录')}
                </button>
                <button className={`flex-1 font-medium py-2 px-4 rounded-md ${isDark
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`} onClick={() => setMobileMenuOpen(false)}>
                  {t('tryNow')}
                </button>
                <button
                  onClick={() => { setContactModalOpen(true); setMobileMenuOpen(false); }}
                  className={`flex-1 font-medium py-2 px-4 rounded-md ${isDark
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
          <div
            className={`w-full max-w-md rounded-2xl p-8 relative border ${isDark
              ? 'bg-gray-900/90 border-gray-700'
              : 'bg-white/90 border-gray-200'
              }`}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
            <h2
              className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-purple-400' : 'text-emerald-500'
                }`}
            >
              登录 | 注册
            </h2>

            <form className="space-y-4">
              <div>
                <label className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>邮箱</label>
                <input
                  type="email"
                  className={`
        w-full px-4 py-3 rounded-lg border outline-none
        ${isDark
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    }
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
                      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
                    }
      `}
                  placeholder="请输入密码"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 font-bold rounded-lg transition-colors ${isDark
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
              >
                登录
              </button>

              <div className="text-center mt-4">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  还没有账户？
                  <a
                    href=""
                    className={`ml-1 underline-offset-2 ${isDark ? 'text-purple-400 hover:text-purple-300 hover:underline'
                      : 'text-emerald-500 hover:text-emerald-600 hover:underline'
                      }`}
                  >
                    立即注册
                  </a>
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



      {/* CTA Section with AI lab elements */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${isDark
            ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50'
            : 'bg-gradient-to-r from-emerald-100 to-teal-100'
            }`}></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {isDark ? (
              <>
                <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-purple-500 filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-indigo-500 filter blur-3xl opacity-20"></div>
              </>
            ) : (
              <>
                <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-emerald-400 filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-teal-400 filter blur-3xl opacity-20"></div>
              </>
            )}
          </div>

          {/* Circuit board pattern for AI lab feel */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 h80 v80 h-80 z M30 30 h40 v40 h-40 z" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1" />
                <circle cx="30" cy="30" r="5" fill={isDark ? "#ffffff" : "#000000"} />
                <circle cx="70" cy="70" r="5" fill={isDark ? "#ffffff" : "#000000"} />
                <path d="M30 30 h20 v20 h20" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('立即开始提升您的工作效率')}</h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {t('注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${isDark
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
              >
                {t('免费试用14天')} <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setContactModalOpen(true)}
                className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${isDark
                  ? 'bg-transparent border-2 border-purple-400 text-purple-300 hover:text-purple-200 hover:border-purple-300'
                  : 'bg-transparent border-2 border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:border-emerald-600'
                  }`}
              >
                {t('预约演示')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Footer with AI lab elements */}
      <footer className={`py-16 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className={`text-2xl font-bold flex items-center mb-6 ${isDark ? 'text-purple-400' : 'text-emerald-300'
                }`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${isDark ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                  }`}>
                  <span className="font-bold">AI</span>
                </div>
                <span>iMail Rates</span>
              </div>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {t('AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。')}
              </p>
              <div className="flex space-x-4">
                {/* Social media icons with hover effects */}
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDark
                      ? 'bg-gray-800 text-gray-400 hover:bg-purple-900/50 hover:text-purple-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                  >
                    <i className={`fab fa-${social}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('产品')}</h3>
              <ul className="space-y-3">
                <li><a href="#features" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('功能')}</a></li>
                <li><a href="#pricing" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('价格')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('API')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('集成')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('更新日志')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('资源')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('帮助中心')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('文档')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('教程')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('博客')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('案例研究')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('公司')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('关于我们')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('联系我们')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('加入我们')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('隐私政策')}</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                  } transition-colors`}>{t('服务条款')}</a></li>
              </ul>
            </div>
          </div>

          <div className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <p className={`text-sm mb-4 md:mb-0 ${isDark ? 'text-gray-500' : 'text-gray-600'
                }`}>
                &copy; {new Date().getFullYear()} AI FreightParse. {t('保留所有权利。')}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`text-sm ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                }`}>{t('隐私政策')}</a>
              <a href="#" className={`text-sm ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                }`}>{t('服务条款')}</a>
              <a href="#" className={`text-sm ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                }`}>{t('Cookie设置')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;