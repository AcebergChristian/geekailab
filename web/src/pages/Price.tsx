import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CostCalculator from '@/components/CostCalculator';

export default function Price() {
  const { isDark } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();



  return (
    <div className={`
      min-h-screen
      ${isDark
        ? 'text-gray-100 bg-gray-900'
        : 'text-gray-900 bg-white'}
      font-sans antialiased
    `}>

      <div className="pt-20 container mx-auto px-6 py-12">


        {/* Pricing Section */}
        <section id="pricing" className={`py-24 ${isDark ? 'bg-gray-800/50' : 'bg-white/70'
          }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('选择适合您的方案')}</h2>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-700'
                }`}>
                {t('灵活的定价方案，满足不同规模企业的需求')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`p-8 rounded-xl border transition-all ${isDark
                  ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50'
                  : 'bg-white border-gray-200 hover:border-emerald-400/50'
                  }`}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>{t('入门版')}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('适合小型团队和个人使用')}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>¥999</span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析500封邮件')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('基础解析功能')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('最多5个用户')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('邮件支持')}</span>
                  </li>
                </ul>
                <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${isDark
                  ? 'bg-transparent border border-purple-500 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                  : 'bg-transparent border border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}>
                  {t('选择套餐')}
                </button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`p-8 rounded-xl border relative transition-all ${isDark
                  ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-500/50'
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400/50'
                  }`}
              >
                <div className={`absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg ${isDark ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                  {t('最受欢迎')}
                </div>
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>{t('专业版')}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('适合中型企业使用')}</p></div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>¥2999</span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析2000封邮件')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('所有高级解析功能')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('最多20个用户')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('优先邮件和电话支持')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('数据导出功能')}</span>
                  </li>
                </ul>
                <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${isDark
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}>
                  {t('选择套餐')}
                </button>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`p-8 rounded-xl border transition-all ${isDark
                  ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50'
                  : 'bg-white border-gray-200 hover:border-emerald-400/50'
                  }`}
              >
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>{t('企业版')}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('适合大型企业和团队使用')}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>¥9999</span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析10000封邮件')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('所有高级功能+定制开发')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('无限用户')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('24/7专属技术支持')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('API集成')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('专属客户经理')}</span>
                  </li>
                </ul>
                <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${isDark
                  ? 'bg-transparent border border-purple-500 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                  : 'bg-transparent border border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}>
                  {t('联系销售')}
                </button>
              </motion.div>
            </div>
          </div>
        </section>



        {/* 价格计算器 */}
        {/* Cost Calculator Section */}
        <CostCalculator language={language} />
      </div>

    </div>
  );
}