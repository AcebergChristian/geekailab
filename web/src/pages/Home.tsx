import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle, BarChart3, Clock, Shield, Users, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ContactModal from '@/components/ContactModal';
import { useI18nContext } from '@/contexts/i18nContext';
import { useThemeContext } from '@/contexts/themeContext';
import { X } from 'lucide-react';
import ailabbg from '@/assets/ailabbg.png'



// Mock data for charts
const efficiencyData = [
  { name: 'Jan', traditional: 30, withAI: 75 },
  { name: 'Feb', traditional: 35, withAI: 82 },
  { name: 'Mar', traditional: 32, withAI: 80 },
  { name: 'Apr', traditional: 38, withAI: 85 },
  { name: 'May', traditional: 42, withAI: 88 },
  { name: 'Jun', traditional: 40, withAI: 90 },
];

// Terminal preview component for AI lab feel
const TerminalPreview = () => {
  const { isDark } = useThemeContext();
  const accentColor = isDark ? 'text-purple-400' : 'text-emerald-500';




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-300'} shadow-xl overflow-hidden`}
    >
      <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} px-4 py-2 flex items-center`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className={`mx-auto text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-Freight-Parser Terminal
        </div>
      </div>
      <div className="p-5 font-mono text-sm">
        <div className="mb-2">
          <span className={accentColor}>$</span> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>freight-parser analyze latest-email.txt</span>
        </div>
        <div className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className={accentColor}>✓</span> Email loaded successfully
        </div>
        <div className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className={accentColor}>✓</span> Detecting carrier: <span className="font-bold">Maersk</span>
        </div>
        <div className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className={accentColor}>✓</span> Extracting rates from 35航线...
        </div>
        <div className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className={accentColor}>✓</span> Found 12 rate entries
        </div>
        <div className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className={accentColor}>✓</span> Processing complete in 2.4s
        </div>
        <div className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between mb-1">
            <span>航线</span>
            <span>港口</span>
            <span>价格</span>
            <span>有效期</span>
          </div>
          <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'} my-1`}></div>
          <div className="flex justify-between text-xs mb-1">
            <span>AE1</span>
            <span>CNHKG-AESGH</span>
            <span className="font-bold">USD 1,250</span>
            <span>2026-03-31</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>AE2</span>
            <span>CNSHA-AEDXB</span>
            <span className="font-bold">USD 1,420</span>
            <span>2026-03-31</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>...</span>
            <span>...</span>
            <span>...</span>
            <span>...</span>
          </div>
        </div>
        <div className="mt-3">
          <span className={accentColor}>$</span> <span className={isDark ? 'text-gray-300' : 'text-gray-700'}><span className="animate-pulse">▌</span></span>
        </div>
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const { isDark } = useThemeContext();
  const [contactModalOpen, setContactModalOpen] = useState(false);


  const { t } = useI18nContext();

    // 视频弹窗状态
const [isOpen, setIsOpen] = useState(false);
const [videoUrl, setVideoUrl] = useState<string>('');

// 打开视频（这里直接用你给的固定 URL）
const openVideo = () => {
  setVideoUrl('https://geekfiles.oss-cn-shanghai.aliyuncs.com/rms/6f759fa6c95d470a9314f52a7f01c2b9.mp4');
  setIsOpen(true);
};

// 关闭视频
const onClose = () => {
  setIsOpen(false);
  setVideoUrl('');
};

  // Features data
  const features = [
    {
      title: t('智能邮件解析'),
      description: t('自动识别并提取船司发送的运价邮件中的关键信息，包括航线、港口、价格、有效期等。'),
      icon: <BarChart3 className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
    },
    {
      title: t('实时数据更新'),
      description: t('解析结果实时更新，确保您获取到最新的运价信息，不错过任何市场变化。'),
      icon: <Clock className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
    },
    {
      title: t('安全可靠'),
      description: t('采用先进的加密技术保护您的邮件数据，确保信息安全不泄露。'),
      icon: <Shield className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
    },
    {
      title: t('团队协作'),
      description: t('支持多人共享和协作，提高团队工作效率，减少沟通成本。'),
      icon: <Users className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
    },
    {
      title: t('多语言支持'),
      description: t('支持解析多种语言的运价邮件，满足全球化业务需求。'),
      icon: <Globe className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
    },
  ];

  // Customer testimonials
  const testimonials = [
    {
      name: "李明",
      company: "环球物流有限公司",
      quote: "使用这款AI解析工具后，我们处理运价邮件的效率提高了80%，节省了大量人力成本。",
      avatar: "ML"
    },
    {
      name: "张华",
      company: "远洋国际货代",
      quote: "以前需要几个小时才能处理完的邮件，现在只需要几分钟，准确性也大大提高。",
      avatar: "ZH"
    },
    {
      name: "王芳",
      company: "全球供应链管理",
      quote: "这个工具彻底改变了我们的工作方式，让我们能够更快地响应客户需求。",
      avatar: "WF"
    },
    {
      name: "赵强",
      company: "东方海运",
      quote: "AI解析功能非常准确，即使是复杂的运价表格也能完美识别，极大地提高了我们的工作效率。",
      avatar: "ZQ"
    },
    {
      name: "刘静",
      company: "国际货运代理",
      quote: "团队协作功能让我们的沟通更加顺畅，数据共享非常便捷，推荐给所有货代同行。",
      avatar: "LJ"
    },
    {
      name: "陈明",
      company: "全球集装箱运输",
      quote: "系统界面简洁直观，上手非常快，技术支持也很专业，是我们日常工作中不可或缺的工具。",
      avatar: "CM"
    }
  ];

  // How it works steps
  const howItWorks = [
    {
      step: "1",
      title: t('连接您的邮箱'),
      description: t('安全授权我们的系统访问您的运价邮件，所有数据均经过加密处理。')
    },
    {
      step: "2",
      title: t('AI自动解析'),
      description: t('我们的AI系统会自动识别并提取邮件中的运价信息，结构化呈现给您。')
    },
    {
      step: "3",
      title: t('查看和使用'),
      description: t('在直观的界面中查看解析结果，进行比较、分析和决策。')
    },
    {
      step: "4", title: t('团队协作'),
      description: t('与团队成员共享解析结果，提高整体工作效率。')
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-purple-950 text-white' : 'bg-gradient-to-br from-white to-green-50 text-gray-900'} overflow-x-hidden transition-colors duration-300`}>





{/* Video Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        {/* <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://geekfiles.oss-cn-shanghai.aliyuncs.com/rms/6f759fa6c95d470a9314f52a7f01c2b9.mp4" type="video/mp4" />
        </video> */}
        
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://media.istockphoto.com/id/2120176755/zh/%E7%85%A7%E7%89%87/men-who-use-websites-or-ai-software-technology-to-help-and-support-tasks-for-chatbots-ai-chat.jpg?s=2048x2048&w=is&k=20&c=jvXXWzMv6iaiTNimKAfgHVZ6Zhdl63XbiyfZsY-k97g=" 
          alt="" />
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url(${ailabbg})`
          }}
        ></div>
      </section>




      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${isDark
              ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30'
              : 'bg-gradient-to-r from-emerald-100/50 to-teal-100/50'
            }`}></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {isDark ? (
              <>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 filter blur-3xl"></div>
                <div className="absolute top-2/3 right-1/4 w-72 h-72 rounded-full bg-indigo-500 filter blur-3xl"></div>
              </>
            ) : (
              <>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-400 filter blur-3xl"></div>
                <div className="absolute top-2/3 right-1/4 w-72 h-72 rounded-full bg-teal-400 filter blur-3xl"></div>
              </>
            )}
          </div>

          {/* Grid background for AI lab feel */}
          <div className="absolute inset-0 opacity-10">
            <div className={`h-full w-full grid grid-cols-12 gap-4 ${isDark
                ? 'bg-grid-pattern-dark'
                : 'bg-grid-pattern-light'
              }`}></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-6 ${isDark
                  ? 'bg-purple-900/50 text-purple-300'
                  : 'bg-emerald-100 text-emerald-800'
                }`}>
                {t('AI驱动的运价解析解决方案')}
              </span>
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300'
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800'
                }`}>
                <div dangerouslySetInnerHTML={{ __html: t('智能解析邮件运价<br />提升货代工作效率') }} />
              </h1>
              <p className={`text-xl mb-10 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                {t('告别手动处理繁琐的运价邮件，让AI自动识别、提取和结构化船司发送的运价信息，为您节省80%的时间，提高工作效率和准确性。')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
                  onClick={openVideo}
                  className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${isDark
                      ? 'bg-transparent border-2 border-purple-400 text-purple-300 hover:text-purple-200 hover:border-purple-300'
                      : 'bg-transparent border-2 border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:border-emerald-600'
                    }`}
                >
                  {t('观看演示')}
                </motion.button>
              </div>

              {/* Trust indicators */}
              <div className="mt-16">
                <p className={`text-sm uppercase tracking-wider mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>{t('受到行业领先企业的信任')}</p>
                <div className="flex flex-wrap justify-start gap-8 md:gap-16">
                  {['中远海运', '马士基', '地中海航运', '达飞轮船', '赫伯罗特'].map((company, index) => (
                    <div key={index} className={`font-medium tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      {company}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Terminal Preview for AI lab feel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <TerminalPreview />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with AI lab elements */}
      <section id="features" className={`py-24 ${isDark ? 'bg-gray-900/50' : 'bg-white/70'
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
              }`}>{t('强大功能，提升效率')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {t('我们的AI邮件运价解析系统集成了多项先进技术，为您提供全方位的解决方案')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-xl border relative overflow-hidden transition-all ${isDark
                    ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                    : 'bg-white border-gray-200 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-300/20'
                  }`}
              >
                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10 ${isDark ? 'bg-purple-500' : 'bg-emerald-400'
                  }`}></div>

                <div className={`mb-6 inline-block p-3 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-emerald-100'
                  }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Chart */}
      <section id="benefits" className="py-24 relative">
        {/* Decorative elements for AI lab feel */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full opacity-10 blur-xl bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full opacity-10 blur-xl bg-gradient-to-r from-emerald-500 to-teal-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('提升效率，降低成本')}</h2>
              <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                {t('使用我们的AI邮件运价解析系统，您的团队可以:')}
              </p>

              <ul className="space-y-4">
                {[
                  t('节省80%的邮件处理时间'),
                  t('减少95%的人为错误'),
                  t('提高团队协作效率'),
                  t('更快地响应客户询价'),
                  t('更好地把握市场行情')
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <CheckCircle className={`h-6 w-6 mr-3 flex-shrink-0 mt-1 ${isDark ? 'text-purple-400' : 'text-emerald-500'
                      }`} />
                    <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8">
                <button className={`font-semibold py-2.5 px-6 rounded-md flex items-center ${isDark
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}>
                  {t('了解更多')} <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`p-6 rounded-xl border relative overflow-hidden ${isDark
                  ? 'bg-gray-800/80 border-gray-700'
                  : 'bg-white border-gray-200'
                }`}
            >
              {/* Technical circuit board pattern overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'ffffff' : '000000'}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>

              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('传统方式 vs AI解析效率对比')}</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={efficiencyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#e5e7eb"} />
                    <XAxis dataKey="name" stroke={isDark ? "#aaa" : "#6b7280"} />
                    <YAxis stroke={isDark ? "#aaa" : "#6b7280"} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#333' : '#fff',
                        border: isDark ? '1px solid #555' : '1px solid #e5e7eb',
                        borderRadius: '4px',
                      }}
                      itemStyle={{ color: isDark ? '#fff' : '#111' }}
                      labelStyle={{ color: isDark ? '#aaa' : '#6b7280' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="traditional"
                      name={t('传统方式')}
                      stroke={isDark ? "#8884d8" : "#6b7280"}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="withAI"
                      name={t('AI解析')}
                      stroke={isDark ? "#a855f7" : "#10b981"}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className={`text-sm mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {t('数据显示，使用AI解析可以显著提高邮件处理效率')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-24 ${isDark ? 'bg-gray-900/50' : 'bg-white/70'
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
              }`}>{t('简单四步，轻松上手')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {t('我们的系统设计简洁直观，只需几个简单步骤，即可开始享受AI带来的效率提升')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line for desktop with AI style */}
            <div className={`hidden lg:block absolute left-1/2 top-12 bottom-12 w-0.5 transform -translate-x-1/2 ${isDark ? 'bg-gradient-to-b from-purple-500/80 to-transparent' : 'bg-gradient-to-b from-emerald-500/80 to-transparent'
              }`}></div>

            <div className="space-y-12 lg:space-y-0">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 text-right' : 'lg:pl-16 text-left'}`}>
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                      }`}>{item.title}</h3>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>{item.description}</p>
                  </div>

                  <div className={`flex-shrink-0 z-10 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold my-6 ${isDark ? 'bg-purple-600' : 'bg-emerald-500'
                    }`}>
                    {item.step}
                  </div>

                  <div className="lg:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with AI lab elements - Horizontal Scrolling */}
      <section id="testimonials" className={`py-24 overflow-hidden ${isDark ? 'bg-gray-900/30' : 'bg-white/50'
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
              }`}>{t('客户的声音')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {t('听听我们的客户如何评价AI邮件运价解析系统')}
            </p>
          </motion.div>

          {/* Horizontal Scrolling Testimonials */}
          <div className="relative">
            <div className={`flex whitespace-nowrap overflow-hidden py-8 scroll-container ${isDark ? 'bg-gray-900/50' : 'bg-white/70'
              } rounded-xl  ${isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
              {/* Animation keyframes */}
              <style>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .scroll-container > div {
                  animation: scroll 20s linear infinite;
                  display: flex;
                  gap: 30px;
                  min-width: 100%;
                }
                .scroll-container > div:hover {
                  animation-play-state: paused;
                }
              `}</style>

              {/* Duplicate testimonials for continuous scrolling */}
              <div>
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`inline-block flex-shrink-0 w-80 md:w-96 p-6 rounded-xl border relative transition-all ${isDark
                        ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                        : 'bg-white border-gray-200 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-300/20'
                      }`}
                  >
                    {/* Technical pattern in background */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                      <div className="absolute top-10 right-10 text-9xl font-bold opacity-5">"</div>
                    </div>

                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400 fill-current inline-block" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className={`mb-5 break-words whitespace-normal italic ${isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${isDark ? 'bg-purple-600' : 'bg-emerald-500'
                        }`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                          }`}>{testimonial.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>{testimonial.company}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      

      

      {/* Add global styles for AI lab patterns */}
      <style>{`
        .bg-grid-pattern-dark {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .bg-grid-pattern-light {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>


      {/* 观看视频 */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
              aria-label="关闭视频"
            >
              <X size={24} />
            </button>
            
            {/* Video container */}
            <div className="aspect-video bg-black">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Video loading error:', e);
                }}
              >
                您的浏览器不支持视频播放。
              </video>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>


      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </div>
  );
};

export default Home;