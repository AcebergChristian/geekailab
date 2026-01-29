import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle, BarChart3, Clock, Shield, Users, Globe, Menu, X, Sun, Moon, Terminal, Code, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/useTheme';
import ContactModal from '@/components/ContactModal';
import CostCalculator from '@/components/CostCalculator';

// 国际化支持 - 翻译字典
const translations = {
  'zh': {
    '智能邮件解析': '智能邮件解析',
    '实时数据更新': '实时数据更新',
    '安全可靠': '安全可靠',
    '团队协作': '团队协作',
    '多语言支持': '多语言支持',
    '提升效率，降低成本': '提升效率，降低成本',
    '简单四步，轻松上手': '简单四步，轻松上手',
    '客户的声音': '客户的声音',
    '选择适合您的方案': '选择适合您的方案',
    '立即开始提升您的工作效率': '立即开始提升您的工作效率',
    '功能': '功能',
    '优势': '优势',
    '使用流程': '使用流程',
    '客户评价': '客户评价',
    '价格': '价格',
    '登录': '登录',
    '免费试用': '免费试用',
    '欢迎使用AI邮件运价解析系统': '欢迎使用AI邮件运价解析系统',
    '强大功能，提升效率': '强大功能，提升效率',
    '连接您的邮箱': '连接您的邮箱',
    'AI自动解析': 'AI自动解析',
    '查看和使用': '查看和使用',
    '入门版': '入门版',
    '专业版': '专业版',
    '企业版': '企业版',
    '免费试用14天': '免费试用14天',
    '观看演示': '观看演示',
    '预约演示': '预约演示',
    '探索AI实验室': '探索AI实验室',
    'AI驱动的运价解析解决方案': 'AI驱动的运价解析解决方案',
    '智能解析邮件运价<br />提升货代工作效率': '智能解析邮件运价<br />提升货代工作效率',
    '告别手动处理繁琐的运价邮件，让AI自动识别、提取和结构化船司发送的运价信息，为您节省80%的时间，提高工作效率和准确性。': '告别手动处理繁琐的运价邮件，让AI自动识别、提取和结构化船司发送的运价信息，为您节省80%的时间，提高工作效率和准确性。',
    '受到行业领先企业的信任': '受到行业领先企业的信任',
    '我们的AI邮件运价解析系统集成了多项先进技术，为您提供全方位的解决方案': '我们的AI邮件运价解析系统集成了多项先进技术，为您提供全方位的解决方案',
    '自动识别并提取船司发送的运价邮件中的关键信息，包括航线、港口、价格、有效期等。': '自动识别并提取船司发送的运价邮件中的关键信息，包括航线、港口、价格、有效期等。',
    '解析结果实时更新，确保您获取到最新的运价信息，不错过任何市场变化。': '解析结果实时更新，确保您获取到最新的运价信息，不错过任何市场变化。',
    '采用先进的加密技术保护您的邮件数据，确保信息安全不泄露。': '采用先进的加密技术保护您的邮件数据，确保信息安全不泄露。',
    '支持多人共享和协作，提高团队工作效率，减少沟通成本。': '支持多人共享和协作，提高团队工作效率，减少沟通成本。',
    '支持解析多种语言的运价邮件，满足全球化业务需求。': '支持解析多种语言的运价邮件，满足全球化业务需求。',
    '使用我们的AI邮件运价解析系统，您的团队可以:': '使用我们的AI邮件运价解析系统，您的团队可以:',
    '节省80%的邮件处理时间': '节省80%的邮件处理时间',
    '减少95%的人为错误': '减少95%的人为错误',
    '提高团队协作效率': '提高团队协作效率',
    '更快地响应客户询价': '更快地响应客户询价',
    '更好地把握市场行情': '更好地把握市场行情',
    '了解更多': '了解更多',
    '传统方式 vs AI解析效率对比': '传统方式 vs AI解析效率对比',
    '数据显示，使用AI解析可以显著提高邮件处理效率': '数据显示，使用AI解析可以显著提高邮件处理效率',
    '传统方式': '传统方式',
    'AI解析': 'AI解析',
    '我们的系统设计简洁直观，只需几个简单步骤，即可开始享受AI带来的效率提升': '我们的系统设计简洁直观，只需几个简单步骤，即可开始享受AI带来的效率提升',
    '安全授权我们的系统访问您的运价邮件，所有数据均经过加密处理。': '安全授权我们的系统访问您的运价邮件，所有数据均经过加密处理。',
    '我们的AI系统会自动识别并提取邮件中的运价信息，结构化呈现给您。': '我们的AI系统会自动识别并提取邮件中的运价信息，结构化呈现给您。',
    '在直观的界面中查看解析结果，进行比较、分析和决策。': '在直观的界面中查看解析结果，进行比较、分析和决策。',
    '与团队成员共享解析结果，提高整体工作效率。': '与团队成员共享解析结果，提高整体工作效率。',
    '听听我们的客户如何评价AI邮件运价解析系统': '听听我们的客户如何评价AI邮件运价解析系统',
    '灵活的定价方案，满足不同规模企业的需求': '灵活的定价方案，满足不同规模企业的需求',
    '适合小型团队和个人使用': '适合小型团队和个人使用',
    '适合中型企业使用': '适合中型企业使用',
    '适合大型企业和团队使用': '适合大型企业和团队使用',
    '每月解析500封邮件': '每月解析500封邮件',
    '基础解析功能': '基础解析功能',
    '最多5个用户': '最多5个用户',
    '邮件支持': '邮件支持',
    '最受欢迎': '最受欢迎',
    '每月解析2000封邮件': '每月解析2000封邮件',
    '所有高级解析功能': '所有高级解析功能',
    '最多20个用户': '最多20个用户',
    '优先邮件和电话支持': '优先邮件和电话支持',
    '数据导出功能': '数据导出功能',
    '每月解析10000封邮件': '每月解析10000封邮件',
    '所有高级功能+定制开发': '所有高级功能+定制开发',
    '无限用户': '无限用户',
    '24/7专属技术支持': '24/7专属技术支持',
    'API集成': 'API集成',
    '专属客户经理': '专属客户经理',
    '选择套餐': '选择套餐',
    '联系销售': '联系销售',
    '注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。': '注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。',
    'AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。': 'AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。',
    '产品': '产品',
    '资源': '资源',
    '公司': '公司',
    'API': 'API',
    '集成': '集成',
    '更新日志': '更新日志',
    '帮助中心': '帮助中心',
    '文档': '文档',
    '教程': '教程',
    '博客': '博客',
    '案例研究': '案例研究',
    '关于我们': '关于我们',
    '联系我们': '联系我们',
    '加入我们': '加入我们',
    '隐私政策': '隐私政策',
    '服务条款': '服务条款',
    'Cookie设置': 'Cookie设置',
    '保留所有权利。': '保留所有权利。',
  },
  'en': {
    '智能邮件解析': 'Smart Email Parsing',
    '实时数据更新': 'Real-time Data Updates',
    '安全可靠': 'Secure & Reliable',
    '团队协作': 'Team Collaboration',
    '多语言支持': 'Multilingual Support',
    '提升效率，降低成本': 'Boost Efficiency, Reduce Costs',
    '简单四步，轻松上手': 'Simple 4-Step Process',
    '客户的声音': 'Customer Testimonials',
    '选择适合您的方案': 'Choose Your Plan',
    '立即开始提升您的工作效率': 'Start Boosting Your Efficiency Today',
    '功能': 'Features',
    '优势': 'Benefits',
    '使用流程': 'How It Works',
    '客户评价': 'Testimonials',
    '价格': 'Pricing',
    '登录': 'Sign In',
    '免费试用': 'Free Trial',
    '欢迎使用AI邮件运价解析系统': 'Welcome to AI Freight Parser',
    '强大功能，提升效率': 'Powerful Features for Enhanced Efficiency',
    '连接您的邮箱': 'Connect Your Email',
    'AI自动解析': 'AI Auto-Parsing',
    '查看和使用': 'View & Utilize',
    '入门版': 'Starter',
    '专业版': 'Professional',
    '企业版': 'Enterprise',
    '免费试用14天': '14-Day Free Trial',
    '观看演示': 'Watch Demo',
    '预约演示': 'Book Demo',
    '探索AI实验室': 'Explore AI Lab',
    'AI驱动的运价解析解决方案': 'AI-Powered Freight Rate Parsing Solution',
    '智能解析邮件运价<br />提升货代工作效率': 'Intelligent Email Freight Rate Parsing<br />Enhance Forwarder Productivity',
    '告别手动处理繁琐的运价邮件，让AI自动识别、提取和结构化船司发送的运价信息，为您节省80%的时间，提高工作效率和准确性。': 'Say goodbye to manual processing of complex freight rate emails. Let AI automatically identify, extract, and structure rate information from carriers, saving you 80% of time and improving efficiency and accuracy.',
    '受到行业领先企业的信任': 'Trusted by Leading Companies',
    '我们的AI邮件运价解析系统集成了多项先进技术，为您提供全方位的解决方案': 'Our AI email freight rate parsing system integrates multiple advanced technologies to provide you with a comprehensive solution',
    '自动识别并提取船司发送的运价邮件中的关键信息，包括航线、港口、价格、有效期等。': 'Automatically identify and extract key information from carrier rate emails, including routes, ports, prices, validity periods, etc.',
    '解析结果实时更新，确保您获取到最新的运价信息，不错过任何市场变化。': 'Parsing results are updated in real-time to ensure you get the latest rate information and don\'t miss any market changes.',
    '采用先进的加密技术保护您的邮件数据，确保信息安全不泄露。': 'Advanced encryption technology protects your email data and ensures information security.',
    '支持多人共享和协作，提高团队工作效率，减少沟通成本。': 'Support multi-user sharing and collaboration to improve team efficiency and reduce communication costs.',
    '支持解析多种语言的运价邮件，满足全球化业务需求。': 'Support parsing of freight rate emails in multiple languages to meet global business needs.',
    '使用我们的AI邮件运价解析系统，您的团队可以:': 'With our AI email freight rate parsing system, your team can:',
    '节省80%的邮件处理时间': 'Save 80% of email processing time',
    '减少95%的人为错误': 'Reduce 95% of human errors',
    '提高团队协作效率': 'Improve team collaboration efficiency',
    '更快地响应客户询价': 'Respond to customer inquiries faster',
    '更好地把握市场行情': 'Better grasp market trends',
    '了解更多': 'Learn More',
    '传统方式 vs AI解析效率对比': 'Traditional vs AI Parsing Efficiency',
    '数据显示，使用AI解析可以显著提高邮件处理效率': 'Data shows that AI parsing can significantly improve email processing efficiency',
    '传统方式': 'Traditional',
    'AI解析': 'AI Parsing',
    '我们的系统设计简洁直观，只需几个简单步骤，即可开始享受AI带来的效率提升': 'Our system is designed to be simple and intuitive. With just a few simple steps, you can start enjoying the efficiency improvement brought by AI',
    '安全授权我们的系统访问您的运价邮件，所有数据均经过加密处理。': 'Securely authorize our system to access your freight rate emails, all data is encrypted.',
    '我们的AI系统会自动识别并提取邮件中的运价信息，结构化呈现给您。': 'Our AI system will automatically identify and extract rate information from emails and present it to you in a structured way.',
    '在直观的界面中查看解析结果，进行比较、分析和决策。': 'View parsing results in an intuitive interface for comparison, analysis and decision-making.',
    '与团队成员共享解析结果，提高整体工作效率。': 'Share parsing results with team members to improve overall work efficiency.',
    '听听我们的客户如何评价AI邮件运价解析系统': 'Hear what our customers say about AI email freight rate parsing system',
    '灵活的定价方案，满足不同规模企业的需求': 'Flexible pricing plans to meet the needs of businesses of different sizes',
    '适合小型团队和个人使用': 'Suitable for small teams and individuals',
    '适合中型企业使用': 'Suitable for medium-sized enterprises',
    '适合大型企业和团队使用': 'Suitable for large enterprises and teams',
    '每月解析500封邮件': 'Parse 500 emails per month',
    '基础解析功能': 'Basic parsing features',
    '最多5个用户': 'Up to 5 users',
    '邮件支持': 'Email support',
    '最受欢迎': 'Most Popular',
    '每月解析2000封邮件': 'Parse 2000 emails per month',
    '所有高级解析功能': 'All advanced parsing features',
    '最多20个用户': 'Up to 20 users',
    '优先邮件和电话支持': 'Priority email and phone support',
    '数据导出功能': 'Data export functionality',
    '每月解析10000封邮件': 'Parse 10000 emails per month',
    '所有高级功能+定制开发': 'All advanced features + custom development',
    '无限用户': 'Unlimited users',
    '24/7专属技术支持': '24/7 dedicated technical support',
    'API集成': 'API integration',
    '专属客户经理': 'Dedicated account manager',
    '选择套餐': 'Select Plan',
    '联系销售': 'Contact Sales',
    '注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。': 'Sign up for a 14-day free trial with no credit card required to experience how AI-driven email freight rate parsing system can transform your workflow.',
    'AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。': 'AI-driven email freight rate parsing system providing efficient and accurate rate information processing solutions for freight forwarders.',
    '产品': 'Product',
    '资源': 'Resources',
    '公司': 'Company',
    'API': 'API',
    '集成': 'Integrations',
    '更新日志': 'Changelog',
    '帮助中心': 'Help Center',
    '文档': 'Documentation',
    '教程': 'Tutorials',
    '博客': 'Blog',
    '案例研究': 'Case Studies',
    '关于我们': 'About Us',
    '联系我们': 'Contact Us',
    '加入我们': 'Join Us',
    '隐私政策': 'Privacy Policy',
    '服务条款': 'Terms of Service',
    'Cookie设置': 'Cookie Settings',
    '保留所有权利。': 'All rights reserved.',
  }
};

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
  const { theme, isDark } = useTheme();
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

const EmailFreightParser: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Get translated text
  const t = (key: string) => translations[language][key] || key;

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
      step: "4",title: t('团队协作'),
      description: t('与团队成员共享解析结果，提高整体工作效率。')
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 to-purple-950 text-white' : 'bg-gradient-to-br from-white to-green-50 text-gray-900'} overflow-x-hidden transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md ${isDark ? 'bg-black/70 border-gray-800' : 'bg-white/70 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-2xl font-bold flex items-center ${isDark ? 'text-purple-400' : 'text-emerald-600'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${isDark ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
                  <span className="font-bold">AI</span>
                </div>
                <span>FreightParse</span>
              </motion.div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>{t('功能')}</a>
              <a href="#benefits" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>{t('优势')}</a>
              <a href="#how-it-works" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>{t('使用流程')}</a>
              <a href="#testimonials" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>{t('客户评价')}</a>
              <a href="#pricing" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>{t('价格')}</a>
            </div>
            
            {/* Theme and Language Switch + CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language switch */}
              <div className="relative">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
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
              
               <button className={`${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-emerald-600 hover:text-emerald-700'} font-medium`}>
                 {t('登录')}
               </button>
               <button className={`font-medium py-2 px-4 rounded-md transition-colors ${
                 isDark 
                   ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                   : 'bg-emerald-500 hover:bg-emerald-600 text-white'
               } mr-3`}>
                 {t('免费试用')}
               </button>
               <button 
                 onClick={() => setContactModalOpen(true)}
                 className={`font-medium py-2 px-4 rounded-md transition-colors ${
                   isDark 
                     ? 'bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-900/20' 
                     : 'bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                 }`}
               >
                 立即联系
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
                  onChange={(e) => setLanguage(e.target.value as 'zh' | 'en')}
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
              <a href="#features" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>{t('功能')}</a>
              <a href="#benefits" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>{t('优势')}</a>
              <a href="#how-it-works" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>{t('使用流程')}</a>
              <a href="#testimonials" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>{t('客户评价')}</a>
              <a href="#pricing" className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>{t('价格')}</a>
              
              {/* CTA buttons */}
              <div className="flex space-x-2 mt-4 px-3">
               <button className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'text-purple-400' 
                     : 'text-emerald-600'
                 }`}>
                 {t('登录')}
               </button>
               <button className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                     : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                 }`}>
                 {t('免费试用')}
               </button>
               <button 
                 onClick={() => setContactModalOpen(true)}
                 className={`flex-1 font-medium py-2 px-4 rounded-md ${
                   isDark 
                     ? 'bg-transparent border border-purple-400 text-purple-300' 
                     : 'bg-transparent border border-emerald-500 text-emerald-700'
                 }`}
               >
                 立即联系
               </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${
            isDark 
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
            <div className={`h-full w-full grid grid-cols-12 gap-4 ${
              isDark 
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
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-6 ${
                isDark 
                  ? 'bg-purple-900/50 text-purple-300' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {t('AI驱动的运价解析解决方案')}
              </span>
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
                isDark 
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-emerald-800'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: t('智能解析邮件运价<br />提升货代工作效率') }} />
              </h1>
              <p className={`text-xl mb-10 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('告别手动处理繁琐的运价邮件，让AI自动识别、提取和结构化船司发送的运价信息，为您节省80%的时间，提高工作效率和准确性。')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${
                    isDark 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {t('免费试用14天')} <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${
                    isDark 
                      ? 'bg-transparent border-2 border-purple-400 text-purple-300 hover:text-purple-200 hover:border-purple-300' 
                      : 'bg-transparent border-2 border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:border-emerald-600'
                  }`}
                >
                  {t('观看演示')}
                </motion.button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-16">
                <p className={`text-sm uppercase tracking-wider mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{t('受到行业领先企业的信任')}</p>
                <div className="flex flex-wrap justify-start gap-8 md:gap-16">
                  {['中远海运', '马士基', '地中海航运', '达飞轮船', '赫伯罗特'].map((company, index) => (
                    <div key={index} className={`font-medium tracking-wide ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
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
      <section id="features" className={`py-24 ${
        isDark ? 'bg-gray-900/50' : 'bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('强大功能，提升效率')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
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
                className={`p-8 rounded-xl border relative overflow-hidden transition-all ${
                  isDark 
                    ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10' 
                    : 'bg-white border-gray-200 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-300/20'
                }`}
              >
                {/* Decorative corner element */}
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full opacity-10 ${
                  isDark ? 'bg-purple-500' : 'bg-emerald-400'
                }`}></div>
                
                <div className={`mb-6 inline-block p-3 rounded-lg ${
                  isDark ? 'bg-purple-900/30' : 'bg-emerald-100'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
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
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('提升效率，降低成本')}</h2>
              <p className={`text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
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
                    <CheckCircle className={`h-6 w-6 mr-3 flex-shrink-0 mt-1 ${
                      isDark ? 'text-purple-400' : 'text-emerald-500'
                    }`} />
                    <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8">
                <button className={`font-semibold py-2.5 px-6 rounded-md flex items-center ${
                  isDark 
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
              className={`p-6 rounded-xl border relative overflow-hidden ${
                isDark 
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
              
              <h3 className={`text-xl font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
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
              <p className={`text-sm mt-4 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('数据显示，使用AI解析可以显著提高邮件处理效率')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className={`py-24 ${
        isDark ? 'bg-gray-900/50' : 'bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('简单四步，轻松上手')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('我们的系统设计简洁直观，只需几个简单步骤，即可开始享受AI带来的效率提升')}
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connecting line for desktop with AI style */}
            <div className={`hidden lg:block absolute left-1/2 top-12 bottom-12 w-0.5 transform -translate-x-1/2 ${
              isDark ? 'bg-gradient-to-b from-purple-500/80 to-transparent' : 'bg-gradient-to-b from-emerald-500/80 to-transparent'
            }`}></div>
            
            <div className="space-y-12 lg:space-y-0">
              {howItWorks.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 text-right' : 'lg:pl-16 text-left'}`}>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{item.title}</h3>
                    <p className={`${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{item.description}</p>
                  </div>
                  
                  <div className={`flex-shrink-0 z-10 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold my-6 ${
                    isDark ? 'bg-purple-600' : 'bg-emerald-500'
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
      <section id="testimonials" className={`py-24 overflow-hidden ${
        isDark ? 'bg-gray-900/30' : 'bg-white/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('客户的声音')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('听听我们的客户如何评价AI邮件运价解析系统')}
            </p>
          </motion.div>
          
          {/* Horizontal Scrolling Testimonials */}
          <div className="relative">
            <div className={`flex whitespace-nowrap overflow-hidden py-8 scroll-container ${
              isDark ? 'bg-gray-900/50' : 'bg-white/70'
            } rounded-xl border ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              {/* Animation keyframes */}
              <style jsx>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .scroll-container > div {
                  animation: scroll 40s linear infinite;
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
                    className={`inline-block flex-shrink-0 w-80 md:w-96 p-6 rounded-xl border relative transition-all ${
                      isDark 
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
                    <p className={`mb-5 italic ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        isDark ? 'bg-purple-600' : 'bg-emerald-500'
                      }`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>{testimonial.name}</p>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
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
      
      {/* Pricing Section */}
      <section id="pricing" className={`py-24 ${
        isDark ? 'bg-gray-900/50' : 'bg-white/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('选择适合您的方案')}</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
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
              className={`p-8 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50' 
                  : 'bg-white border-gray-200 hover:border-emerald-400/50'
              }`}
            >
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('入门版')}</h3>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{t('适合小型团队和个人使用')}</p>
              </div>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>¥999</span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析500封邮件')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('基础解析功能')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('最多5个用户')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('邮件支持')}</span>
                </li>
              </ul>
              <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${
                isDark 
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
              className={`p-8 rounded-xl border relative transition-all ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border-purple-500/50' 
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400/50'
              }`}
            >
              <div className={`absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg ${
                isDark ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {t('最受欢迎')}
              </div>
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('专业版')}</h3>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{t('适合中型企业使用')}</p></div>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>¥2999</span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析2000封邮件')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('所有高级解析功能')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('最多20个用户')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('优先邮件和电话支持')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('数据导出功能')}</span>
                </li>
              </ul>
              <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${
                isDark 
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
              className={`p-8 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 hover:border-purple-500/50' 
                  : 'bg-white border-gray-200 hover:border-emerald-400/50'
              }`}
            >
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{t('企业版')}</h3>
                <p className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>{t('适合大型企业和团队使用')}</p>
              </div>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>¥9999</span>
                <span className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('每月解析10000封邮件')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('所有高级功能+定制开发')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('无限用户')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('24/7专属技术支持')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('API集成')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('专属客户经理')}</span>
                </li>
              </ul>
              <button className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${
                isDark 
                  ? 'bg-transparent border border-purple-500 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' 
                  : 'bg-transparent border border-emerald-500 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}>
                {t('联系销售')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with AI lab elements */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${
            isDark 
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
                <path d="M10 10 h80 v80 h-80 z M30 30 h40 v40 h-40 z" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1"/>
                <circle cx="30" cy="30" r="5" fill={isDark ? "#ffffff" : "#000000"} />
                <circle cx="70" cy="70" r="5" fill={isDark ? "#ffffff" : "#000000"} />
                <path d="M30 30 h20 v20 h20" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1"/>
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
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('立即开始提升您的工作效率')}</h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('注册即可免费试用14天，无需信用卡，体验AI驱动的邮件运价解析系统如何改变您的工作方式。')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${
                  isDark 
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
                className={`font-semibold py-3 px-8 rounded-md text-lg flex items-center justify-center ${
                  isDark 
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
      <footer className={`py-16 border-t ${
        isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className={`text-2xl font-bold flex items-center mb-6 ${
                isDark ? 'text-purple-400' : 'text-emerald-600'
              }`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                  isDark ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                }`}>
                  <span className="font-bold">AI</span>
                </div>
                <span>FreightParse</span>
              </div>
              <p className={`mb-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('AI驱动的邮件运价解析系统，为货代企业提供高效、准确的运价信息处理解决方案。')}
              </p>
              <div className="flex space-x-4">
                {/* Social media icons with hover effects */}
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className={`p-2 rounded-full transition-colors ${
                      isDark 
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
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('产品')}</h3>
              <ul className="space-y-3">
                <li><a href="#features" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('功能')}</a></li>
                <li><a href="#pricing" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('价格')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('API')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('集成')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('更新日志')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('资源')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('帮助中心')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('文档')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('教程')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('博客')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('案例研究')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('公司')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('关于我们')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('联系我们')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('加入我们')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('隐私政策')}</a></li>
                <li><a href="#" className={`${
                  isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-emerald-600'
                } transition-colors`}>{t('服务条款')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <p className={`text-sm mb-4 md:mb-0 ${
                isDark ? 'text-gray-500' : 'text-gray-600'
              }`}>
                &copy; {new Date().getFullYear()} AI FreightParse. {t('保留所有权利。')}
              </p>
              <button 
                onClick={() => setContactModalOpen(true)}
                className={`font-medium py-2 px-4 rounded-md transition-colors text-sm ${
                  isDark 
                    ? 'bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-900/20' 
                    : 'bg-transparent border border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                立即联系
              </button>
            </div>
            <div className="flex space-x-6">
              <a href="#" className={`text-sm ${
                isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}>{t('隐私政策')}</a>
              <a href="#" className={`text-sm ${
                isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}>{t('服务条款')}</a>
              <a href="#" className={`text-sm ${
                isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}>{t('Cookie设置')}</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add global styles for AI lab patterns */}
      <style jsx global>{`
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
      
       {/* Cost Calculator Section */}
      <CostCalculator language={language} />
      
      {/* Contact Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </div>
  );
};

export default EmailFreightParser;