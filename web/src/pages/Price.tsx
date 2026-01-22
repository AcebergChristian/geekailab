import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

export default function Price() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  const [emailCount, setEmailCount] = useState(200);
  const [emailTypes, setEmailTypes] = useState(5);
  const [pdfCount, setPdfCount] = useState(100);
  const [imageCount, setImageCount] = useState(50);
  const [modelType, setModelType] = useState('standard');

  // 计算价格
  const calculatePrice = () => {
    let basePrice = 0;
    
    // 邮件处理费用
    if (emailCount <= 20) {
      basePrice += 0;
    } else if (emailCount <= 200) {
      basePrice += (emailCount - 20) * 0.01;
    } else {
      basePrice += 90 + (emailCount - 200) * 0.005;
    }
    
    // 邮件类型费用
    basePrice += emailTypes * 10;
    
    // PDF处理费用
    basePrice += pdfCount * 0.1;
    
    // 图片处理费用
    basePrice += imageCount * 0.05;
    
    // 模型类型系数
    if (modelType === 'advanced') {
      basePrice *= 1.5;
    } else if (modelType === 'enterprise') {
      basePrice *= 2.0;
    }
    
    return Math.max(basePrice, 0).toFixed(2);
  };

  // 平台版本信息
  const plans = [
    {
      name: "个人版",
      price: "免费",
      features: [
        "每日处理1000封邮件",
        "基础文本解析",
        "标准AI模型",
        "每月100页PDF",
        "50张图片"
      ],
      button: "免费试用",
      highlight: false
    },
    {
      name: "Teams版",
      price: "¥99",
      period: "/月",
      features: [
        "每日处理10000封邮件",
        "高级文本解析",
        "进阶AI模型",
        "每月1000页PDF",
        "500张图片",
        "API访问权限"
      ],
      button: "立即购买",
      highlight: true
    },
    {
      name: "企业版",
      price: "定制",
      features: [
        "无限制邮件处理",
        "企业级安全",
        "专属AI模型",
        "无限PDF处理",
        "无限图片处理",
        "专属技术支持",
        "定制化开发"
      ],
      button: "联系销售",
      highlight: false
    }
  ];

  return (
    <div className={`
      min-h-screen
      ${isDark 
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100' 
        : 'bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900'}
      font-sans antialiased
    `}>
      {/* 导航栏 */}
      <nav className={`
        w-1/2 fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        ${isDark 
          ? 'bg-gray-900/70 backdrop-blur-md' 
          : 'bg-white/80 backdrop-blur-md'}
        rounded-2xl px-6 py-4 shadow-lg
      `}>
        <div className="flex items-center justify-between space-x-6 pl-12">
          <div className="hidden md:flex space-x-10">
            <a href="/" className={`hover:text-emerald-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>首页</a>
            <a href="/price" className={`hover:text-emerald-400 transition-colors ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'}`}>价格</a>
            <a href="/docs" className={`hover:text-emerald-400 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>文档</a>
          </div>
          <button className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${isDark 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
          `}>
            登录
          </button>
        </div>
      </nav>

      <div className="pt-40 container mx-auto px-6 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            价格计划
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            选择适合您的计划，灵活计算数据处理费用
          </p>
        </div>

        {/* 平台版本 */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`
                  rounded-2xl p-8 border
                  ${plan.highlight 
                    ? (isDark 
                      ? 'border-emerald-500 bg-gray-900/60 shadow-xl shadow-emerald-900/20' 
                      : 'border-emerald-600 bg-white shadow-xl shadow-emerald-200/30')
                    : (isDark 
                      ? 'border-emerald-500/30 bg-gray-900/50' 
                      : 'border-gray-300 bg-white')}
                  transition-all hover:scale-105 relative overflow-hidden
                `}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 h-1"></div>
                )}
                <h2 className={`text-2xl font-bold mb-4 ${plan.highlight ? 'text-emerald-400' : isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {plan.name}
                </h2>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-colors
                    ${plan.highlight 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                      : isDark 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-emerald-500/30' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'}
                  `}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 价格计算器 */}
        <section className="max-w-4xl mx-auto">
          <div className={`
            rounded-3xl p-8 md:p-12 border
            ${isDark 
              ? 'border-emerald-500/30 bg-gray-900/70 backdrop-blur-md' 
              : 'border-emerald-500/30 bg-white/80 backdrop-blur-md'}
            shadow-2xl shadow-emerald-950/20
          `}>
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
              价格计算器
            </h2>
            <p className="text-center mb-10 opacity-90">
              输入您的使用量，计算个性化价格
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    每日邮件处理数量
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={emailCount}
                    onChange={(e) => setEmailCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>0</span>
                    <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {emailCount.toLocaleString()} 封/天
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>1000</span>
                  </div>
                </div>
                
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    邮件内容类型数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={emailTypes}
                    onChange={(e) => setEmailTypes(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className={`
                      w-full px-4 py-3 rounded-lg border outline-none
                      ${isDark 
                        ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'}
                    `}
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    PDF文档数量 (每月)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={pdfCount}
                    onChange={(e) => setPdfCount(Math.min(10000, Math.max(0, Number(e.target.value))))}
                    className={`
                      w-full px-4 py-3 rounded-lg border outline-none
                      ${isDark 
                        ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'}
                    `}
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    图片数量 (每月)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={imageCount}
                    onChange={(e) => setImageCount(Math.min(10000, Math.max(0, Number(e.target.value))))}
                    className={`
                      w-full px-4 py-3 rounded-lg border outline-none
                      ${isDark 
                        ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-emerald-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'}
                    `}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    AI模型类型
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'standard', label: '标准模型', description: '适用于常规数据解析' },
                      { value: 'advanced', label: '进阶模型', description: '更高精度，复杂场景适用' },
                      { value: 'enterprise', label: '企业模型', description: '最高精度，自定义训练' }
                    ].map((model) => (
                      <label 
                        key={model.value}
                        className={`
                          flex items-center p-4 rounded-lg border cursor-pointer
                          ${modelType === model.value 
                            ? (isDark 
                              ? 'border-emerald-500 bg-emerald-950/20' 
                              : 'border-emerald-500 bg-emerald-50')
                            : (isDark 
                              ? 'border-gray-700 hover:border-emerald-500/50' 
                              : 'border-gray-300 hover:border-emerald-500/50')}
                        `}
                      >
                        <input
                          type="radio"
                          name="modelType"
                          value={model.value}
                          checked={modelType === model.value}
                          onChange={(e) => setModelType(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                            {model.label}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {model.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className={`
                  p-6 rounded-xl border
                  ${isDark 
                    ? 'border-emerald-500/50 bg-gray-900' 
                    : 'border-emerald-500/50 bg-emerald-50'}
                `}>
                  <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    预估价格
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-500 mb-2">
                      ¥{calculatePrice()}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      /月
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>邮件处理:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                        ¥{(emailCount > 1000 ? (emailCount <= 10000 ? (emailCount - 1000) * 0.01 : 90 + (emailCount - 10000) * 0.005) : 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>邮件类型:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                        ¥{(emailTypes * 10).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>PDF处理:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                        ¥{(pdfCount * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>图片处理:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                        ¥{(imageCount * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-emerald-500/30">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>模型系数:</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-800'}>
                        {modelType === 'standard' ? '1.0x' : modelType === 'advanced' ? '1.5x' : '2.0x'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className={`
                  w-full py-4 rounded-xl font-bold text-lg transition-colors
                  ${isDark 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'}
                `}>
                  立即购买
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* 页脚 */}
      <footer className={`
        py-12 mt-20 text-center border-t border-emerald-900/50
        ${isDark ? 'bg-black/80' : 'bg-gray-100/80'}
      `}>
        <div className="container mx-auto px-6">
          <p className="text-2xl font-bold mb-4 text-emerald-400">Geek AI Lab</p>
          <p className="opacity-70 mb-6">智能解析，数据赋能</p>
          <p className="text-sm opacity-60">© 2025 极羽科技有限公司 沪ICP备999号</p>
        </div>
      </footer>
    </div>
  );
}