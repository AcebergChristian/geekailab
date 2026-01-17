import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface Translation {
  [key: string]: string;
}

interface Translations {
  [lang: string]: Translation;
}

// 定义翻译文本
const translations: Translations = {
  en: {
    evaluation: 'Evaluation',
    evaluationSet: 'Evaluation Set',
    relatedExperiments: 'Related Experiments',
    overview: 'Overview',
    accuracy: 'Accuracy',
    consistency: 'Consistency',
    creativity: 'Creativity',
    search: 'Search',
    filter: 'Filter',
    batchOperation: 'Batch Operation',
    experimentList: 'Experiment List',
    id: 'ID',
    experimentName: 'Experiment Name',
    objectType: 'Object Type',
    objectName: 'Object Name',
    status: 'Status',
    score: 'Score',
    operation: 'Operation',
    details: 'Details',
    copy: 'Copy',
    success: 'Success',
    version: 'Version',
    updateTime: 'Update Time',
    createTime: 'Create Time',
    geekmindSystem: 'GeekMind Sys',
    enterGeekmindSystem: 'Enter GeekMind Sys',
    themeToggle: 'Toggle Theme',
    languageToggle: 'Toggle Language',
    GeekmindSystem: 'GeekMind Sys',
    showEmailList: 'Show Email List',
    // 新增AI平台相关词条
    home: 'Home',
    capabilities: 'Capabilities',
    solutions: 'Solutions',
    pricing: 'Pricing',
    geekmindPlatform: 'GeekMind AI Platform',
    platformDescription: 'Comprehensive AI capabilities including large models, intelligent agents, and industry-specific solutions',
    tryNow: 'Try Now',
    learnMore: 'Learn More',
    coreCapabilities: 'Core Capabilities',
    aiSolutions: 'AI Solutions',
    solutionDescription: 'We provide API services, SDK integration, SaaS platforms, and custom solutions to meet diverse business needs.',
    apiService: 'API Service',
    sdkIntegration: 'SDK Integration',
    saasPlatform: 'SaaS Platform',
    customSolution: 'Custom Solution',
    aiPlatformDemo: 'AI Platform Demo',
    aiFeatures: 'AI Features',
    allRightsReserved: 'All Rights Reserved',
    geekmindLLM: 'GeekMind Large Model',
    geekmindLLMDescription: 'Advanced large language model with strong comprehension and generation capabilities',
    geekmindAgent: 'GeekMind Agent',
    geekmindAgentDescription: 'Intelligent agent system with autonomous decision-making and task execution abilities',
    shippingIntelligent: 'Shipping Intelligent Agent',
    shippingIntelligentDescription: 'Industry-specific intelligent solutions designed for shipping and logistics',
    emailParsing: 'Email Parsing',
    emailRecognition: 'Email Recognition',
    emailClassification: 'Email Classification',
    fareExtraction: 'Freight Rate Extraction',
    autoWorkflow: 'Auto Workflow',
    intelligentDecision: 'Intelligent Decision',
    processAutomation: 'Process Automation',
    aiAssistance: 'AI Assistance',
    routeOptimization: 'Route Optimization',
    costAnalysis: 'Cost Analysis',
    logisticsTracking: 'Logistics Tracking',
    supplyChainOptimization: 'Supply Chain Optimization'
  },
  zh: {
    evaluation: '评测',
    evaluationSet: '评测集',
    relatedExperiments: '关联实验',
    overview: '总览',
    accuracy: '正确性',
    consistency: '一致性',
    creativity: '创造性',
    search: '搜索',
    filter: '过滤器',
    batchOperation: '批量操作',
    experimentList: '实验列表',
    id: 'ID',
    experimentName: '实验名称',
    objectType: '评测对象类型',
    objectName: '评测对象',
    status: '状态',
    score: '得分',
    operation: '操作',
    details: '详情',
    copy: '复制',
    success: '成功',
    version: '版本',
    updateTime: '更新时间',
    createTime: '创建时间',
    geekmindSystem: 'GeekMind中台系统',
    enterGeekmindSystem: '进入GeekMind中台系统',
    themeToggle: '切换主题',
    languageToggle: '切换语言',
    GeekmindSystem: 'GeekMind中台',
    showEmailList: '显示邮件列表',
    // 新增AI平台相关词条
    home: '首页',
    capabilities: '能力',
    solutions: '解决方案',
    pricing: '价格',
    geekmindPlatform: '极羽AI平台',
    platformDescription: '综合性AI能力平台，包含大模型、智能体及行业解决方案',
    tryNow: '立即体验',
    learnMore: '了解更多',
    coreCapabilities: '核心能力',
    aiSolutions: 'AI解决方案',
    solutionDescription: '我们提供API服务、SDK集成、SaaS平台和定制化解决方案，满足多样化业务需求。',
    apiService: 'API服务',
    sdkIntegration: 'SDK集成',
    saasPlatform: 'SaaS平台',
    customSolution: '定制解决方案',
    aiPlatformDemo: 'AI平台演示',
    aiFeatures: 'AI功能',
    allRightsReserved: '版权所有',
    geekmindLLM: '极羽大模型',
    geekmindLLMDescription: '先进的大语言模型，具备强大的理解和生成能力',
    geekmindAgent: '极羽Agent',
    geekmindAgentDescription: '智能Agent系统，具有自主决策和任务执行能力',
    shippingIntelligent: '航运智能体',
    shippingIntelligentDescription: '面向航运物流行业的专业智能化解决方案',
    emailParsing: '邮件解析',
    emailRecognition: '邮件识别',
    emailClassification: '邮件分类',
    fareExtraction: '运价提取解析',
    autoWorkflow: 'AI自动化',
    intelligentDecision: '智能决策',
    processAutomation: '流程自动化',
    aiAssistance: 'AI助手',
    routeOptimization: '路径优化',
    costAnalysis: '成本分析',
    logisticsTracking: '物流跟踪',
    supplyChainOptimization: '供应链优化'
  }
};

interface I18nContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType>({
  language: 'zh',
  toggleLanguage: () => {},
  t: (key) => key
});

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'zh' ? 'en' : 'zh');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};