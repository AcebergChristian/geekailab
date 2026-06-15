import { useThemeContext } from '@/contexts/themeContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useI18nContext } from '@/contexts/i18nContext';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactModal from '@/components/ContactModal';

const navItems = [
  { path: '/', labelKey: 'home' },
  { path: '/price', labelKey: 'pricing' },
  { path: '/docspage', labelKey: 'docs' }
] as const;

const footerGroups = [
  { title: '产品', items: ['功能', '价格', 'API', '集成', '更新日志'] },
  { title: '资源', items: ['帮助中心', '文档', '教程', '博客', '案例研究'] },
  { title: '公司', items: ['关于我们', '联系我们', '加入我们', '隐私政策', '服务条款'] }
];

const Layout: React.FC = () => {

  const navigate = useNavigate();

  const { isDark, toggleTheme } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-shell">
      <nav className="app-topbar rounded-[28px]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] text-lg font-bold text-app-accent">
              G
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-app-faint">GeekLab</div>
              <div className="text-base font-semibold text-app">iMail Rates</div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-nav-link ${isActive(item.path) ? 'app-nav-link-active' : ''}`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleLanguage}
              className="app-button-secondary h-11 px-4"
              aria-label={language === 'zh' ? 'Switch to English' : 'Switch to Chinese'}
            >
              {language === 'zh' ? '中文' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="app-button-secondary h-11 w-11 px-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="app-button-primary h-11" onClick={() => setShowLoginModal(true)}>
              {t('tryNow')}
            </button>
            <button onClick={() => setContactModalOpen(true)} className="app-button-ghost h-11">
              {t('联系我们')}
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="app-button-secondary h-11 w-11 px-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-app px-4 pb-4 pt-2 md:hidden"
          >
            <div className="app-elevated rounded-[26px] p-3">
              <div className="mb-2 flex items-center gap-2">
                <button onClick={toggleLanguage} className="app-button-secondary flex-1">
                  {language === 'zh' ? '中文' : 'EN'}
                </button>
                <button onClick={toggleTheme} className="app-button-secondary h-11 w-11 px-0">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`app-doc-link ${isActive(item.path) ? 'app-doc-link-active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="app-button-primary flex-1"
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('tryNow')}
                </button>
                <button
                  className="app-button-ghost flex-1"
                  onClick={() => {
                    setContactModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('联系我们')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md">
          <div className="app-card relative w-full max-w-md p-8">
            <button
              onClick={() => setShowLoginModal(false)}
              className="app-button-secondary absolute right-4 top-4 h-10 w-10 px-0"
            >
              <X size={16} />
            </button>
            <div className="mb-6">
              <div className="app-accent-chip mb-4">Account</div>
              <h2 className="text-3xl font-semibold text-app">登录 | 注册</h2>
              <p className="mt-2 text-sm text-app-soft">保持当前逻辑不变，仅更新视觉层。</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-app-soft">邮箱</label>
                <input type="email" className="app-input" placeholder="请输入邮箱地址" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-app-soft">密码</label>
                <input type="password" className="app-input" placeholder="请输入密码" />
              </div>
              <button type="submit" className="app-button-primary h-12 w-full justify-center rounded-2xl">
                登录
              </button>
              <p className="text-center text-sm text-app-soft">
                还没有账户？
                <a href="" className="ml-1 font-medium text-app-accent hover:opacity-80">
                  立即注册
                </a>
              </p>
            </form>
          </div>
        </div>
      )}

      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />

      <main className="mx-auto max-w-[1600px]">
        <Outlet />
      </main>

      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="app-card px-8 py-14 sm:px-12">
            <div className="text-center">
              <div className="app-accent-chip mb-5">Workspace Ready</div>
              <h2 className="mx-auto max-w-3xl text-3xl font-semibold text-app md:text-5xl">
                {t('立即开始提升您的工作效率')}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-app-soft">
                {t('注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。')}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <motion.button className="app-button-primary h-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/system/workbench')}
                >
                  {t('免费试用14天')} <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContactModalOpen(true)}
                  className="app-button-ghost h-12"
                >
                  {t('预约演示')}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-app bg-[color:var(--bg-panel)]/80 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-soft)] text-sm font-bold text-app-accent">
                  AI
                </div>
                <div>
                  <div className="text-sm font-semibold text-app">iMail Rates</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-app-faint">GeekLab</div>
                </div>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-7 text-app-soft">
                {t('AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。')}
              </p>
              <div className="mt-6 flex gap-3">
                {['X', 'in', 'GH'].map((social) => (
                  <a key={social} href="#" className="app-button-secondary h-10 w-10 px-0 text-xs font-semibold">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-app-faint">{t(group.title)}</h3>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <a key={item} href="#" className="block text-sm text-app-soft hover:text-app-accent">
                      {t(item)}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-app pt-6 text-sm text-app-faint md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} AI FreightParse. {t('保留所有权利。')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-app-accent">{t('隐私政策')}</a>
              <a href="#" className="hover:text-app-accent">{t('服务条款')}</a>
              <a href="#" className="hover:text-app-accent">{t('Cookie设置')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
