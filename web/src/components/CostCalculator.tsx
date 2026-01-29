import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Building, User, ArrowRight, CheckCircle, DollarSign } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

interface CostCalculatorProps {
  language: 'zh' | 'en';
}

const CostCalculator: React.FC<CostCalculatorProps> = ({ language }) => {
  const { isDark } = useTheme();
  const [calculatorType, setCalculatorType] = useState<'personal' | 'enterprise'>('personal');
  
  // 个人用户计算器状态
  const [monthlyEmails, setMonthlyEmails] = useState<number>(5);
  const [ratesPerEmail, setRatesPerEmail] = useState<number>(50);
  const [usageFrequency, setUsageFrequency] = useState<'high' | 'medium' | 'low'>('high');
  
  // 企业方案计算器状态
  const [dailyEmails, setDailyEmails] = useState<string>('10-50');
  const [autoPush, setAutoPush] = useState<boolean>(true);
  const [historyStorage, setHistoryStorage] = useState<boolean>(false);
  
  // 计算结果状态
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalRates, setTotalRates] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [enterprisePlan, setEnterprisePlan] = useState<string>('标准企业方案');
  const [enterpriseCostRange, setEnterpriseCostRange] = useState<string>('¥3万-¥8万/年');
  
  // 翻译辅助函数
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'zh': {
        '标准版本成本计算器': '标准版本成本计算器',
        '企业级接入方案评估器': '企业级接入方案评估器',
        '每月运价邮件数量': '每月运价邮件数量',
        '每封邮件平均包含运价条数': '每封邮件平均包含运价条数',
        '使用频率': '使用频率',
        '高频（每天）': '高频（每天）',
        '中频（每周）': '中频（每周）',
        '低频（每月）': '低频（每月）',
        '预计每月成本': '预计每月成本',
        '预计解析运价': '预计解析运价',
        '预计消耗': '预计消耗',
        '仅对成功识别并结构化输出的运价条数计费，失败解析、空结果不计费': '仅对成功识别并结构化输出的运价条数计费，失败解析、空结果不计费',
        '每日处理运价邮件量': '每日处理运价邮件量',
        '10封以内': '10封以内',
        '10-50封': '10-50封',
        '50-200封': '50-200封',
        '200封以上': '200封以上',
        '是否需要自动推送解析结果': '是否需要自动推送解析结果',
        '推送至内部系统或业务平台': '推送至内部系统或业务平台',
        '是否需要历史数据留存与查询': '是否需要历史数据留存与查询',
        '复杂度评级': '复杂度评级',
        '标准企业方案': '标准企业方案',
        '参考投入区间': '参考投入区间',
        '成本对比参考（以常见使用场景估算）': '成本对比参考（以常见使用场景估算）',
        '人工整理运价': '人工整理运价',
        '1人×每日2-4小时': '1人×每日2-4小时',
        'AI自动解析': 'AI自动解析',
        '全自动处理，仅需人工校验': '全自动处理，仅需人工校验',
        '实际效果与节省成本因使用规模而异': '实际效果与节省成本因使用规模而异',
        '获取接入方案建议（2分钟）': '获取接入方案建议（2分钟）',
        '实际项目费用以需求评估结果为准': '实际项目费用以需求评估结果为准',
        '个人用户': '个人用户',
        '企业方案': '企业方案',
        '条/月': '条/月'
      },
      'en': {
        '标准版本成本计算器': 'Standard Version Cost Calculator',
        '企业级接入方案评估器': 'Enterprise Integration Plan Evaluator',
        '每月运价邮件数量': 'Monthly Freight Rate Emails',
        '每封邮件平均包含运价条数': 'Average Freight Rates per Email',
        '使用频率': 'Usage Frequency',
        '高频（每天）': 'High Frequency (Daily)',
        '中频（每周）': 'Medium Frequency (Weekly)',
        '低频（每月）': 'Low Frequency (Monthly)',
        '预计每月成本': 'Estimated Monthly Cost',
        '预计解析运价': 'Estimated Parsed Rates',
        '预计消耗': 'Estimated Consumption',
        '仅对成功识别并结构化输出的运价条数计费，失败解析、空结果不计费': 'Only charges for successfully recognized and structured freight rates, no charges for failed parsing or empty results',
        '每日处理运价邮件量': 'Daily Freight Rate Emails Processed',
        '10封以内': 'Less than 10',
        '10-50封': '10-50',
        '50-200封': '50-200',
        '200封以上': 'More than 200',
        '是否需要自动推送解析结果': 'Need Auto-Push of Parsing Results?',
        '推送至内部系统或业务平台': 'Push to internal systems or business platforms',
        '是否需要历史数据留存与查询': 'Need Historical Data Storage and Query?',
        '复杂度评级': 'Complexity Rating',
        '标准企业方案': 'Standard Enterprise Plan',
        '参考投入区间': 'Reference Investment Range',
        '成本对比参考（以常见使用场景估算）': 'Cost Comparison Reference (Estimated based on common usage scenarios)',
        '人工整理运价': 'Manual Freight Rate Arrangement',
        '1人×每日2-4小时': '1 person × 2-4 hours per day',
        'AI自动解析': 'AI Auto-Parsing',
        '全自动处理，仅需人工校验': 'Fully automated processing, only requires manual verification',
        '实际效果与节省成本因使用规模而异': 'Actual results and cost savings vary with usage scale',
        '获取接入方案建议（2分钟）': 'Get Integration Plan Suggestion (2 minutes)',
        '实际项目费用以需求评估结果为准': 'Actual project costs are subject to demand assessment results',
        '个人用户': 'Personal User',
        '企业方案': 'Enterprise Plan',
        '条/月': 'items/month'
      }
    };
    
    return translations[language][key] || key;
  };
  
  // 计算个人用户成本
  useEffect(() => {
    if (calculatorType === 'personal') {
      // 计算总运价条数
      const calculatedRates = monthlyEmails * ratesPerEmail;
      setTotalRates(calculatedRates);
      
      // 根据频率调整信用点消耗系数
      let creditCoefficient = 1;
      switch (usageFrequency) {
        case 'high':
          creditCoefficient = 1.15;
          break;
        case 'medium':
          creditCoefficient = 1.05;
          break;
        case 'low':
          creditCoefficient = 1.0;
          break;
      }
      
      // 计算信用点消耗
      const calculatedCredits = Math.round(calculatedRates * creditCoefficient);
      setTotalCredits(calculatedCredits);
      
      // 计算成本 (假设1 credit = 0.01元)
      const calculatedCost = calculatedCredits * 0.01;
      setTotalCost(calculatedCost);
    }
  }, [monthlyEmails, ratesPerEmail, usageFrequency, calculatorType]);
  
  // 计算企业方案成本区间
  useEffect(() => {
    if (calculatorType === 'enterprise') {
      // 根据邮件数量、自动推送和历史存储需求确定方案和成本区间
      let plan = '标准企业方案';
      let costRange = '¥3万-¥8万/年';
      
      if (dailyEmails === '200封以上') {
        plan = '大型企业方案';
        costRange = '¥15万-¥30万/年';
      } else if (dailyEmails === '50-200封') {
        plan = '高级企业方案';
        costRange = '¥8万-¥15万/年';
      } else if (dailyEmails === '10-50封' && autoPush && historyStorage) {
        plan = '增强企业方案';
        costRange = '¥5万-¥10万/年';
      }
      
      setEnterprisePlan(plan);
      setEnterpriseCostRange(costRange);
    }
  }, [dailyEmails, autoPush, historyStorage, calculatorType]);
  
  // 处理获取企业方案建议
  const handleGetEnterpriseSuggestion = () => {
    toast.success('正在准备您的企业方案建议，请稍候...');
    // 模拟API调用延迟
    setTimeout(() => {
      toast.success('企业方案建议已生成，请查收邮件！');
    }, 2000);
  };
  
  return (
    <div className={`py-16 ${isDark ? 'bg-gray-900/80' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>解析成本计算器</h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            计算您使用AI邮件运价解析系统的成本，选择最适合您的方案
          </p>
        </motion.div>
        
        {/* 计算器类型切换 */}
        <div className={`flex max-w-md mx-auto mb-12 p-1 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setCalculatorType('personal')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all ${
              calculatorType === 'personal' 
                ? (isDark ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white')
                : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
            }`}
          >
            <User className="mr-2 h-5 w-5" />
            <span>{t('个人用户')}</span>
          </button>
          <button
            onClick={() => setCalculatorType('enterprise')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all ${
              calculatorType === 'enterprise' 
                ? (isDark ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white')
                : (isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
            }`}
          >
            <Building className="mr-2 h-5 w-5" />
            <span>{t('企业方案')}</span>
          </button>
        </div>
        
        {/* 个人用户成本计算器 */}
        {calculatorType === 'personal' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`p-8 rounded-xl border max-w-3xl mx-auto ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center mb-6">
              <BarChart3 className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('标准版本成本计算器')}</h3>
            </div>
            
            <div className="space-y-8">
              {/* 每月运价邮件数量 */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('每月运价邮件数量')}</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={monthlyEmails}
                    onChange={(e) => setMonthlyEmails(parseInt(e.target.value))}
                    className={`w-full h-2 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    } rounded-lg appearance-none cursor-pointer accent-${isDark ? 'purple-500' : 'emerald-500'}`}
                  />
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={monthlyEmails}
                    onChange={(e) => setMonthlyEmails(parseInt(e.target.value) || 1)}
                    className={`ml-4 w-16 p-2 rounded-md border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>例如: 200封</p>
              </div>
              
              {/* 每封邮件平均包含运价条数 */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('每封邮件平均包含运价条数')}</label>
                <input
                  type="number"
                  min="1"
                  value={ratesPerEmail}
                  onChange={(e) => setRatesPerEmail(parseInt(e.target.value) || 1)}
                  className={`w-full p-3 rounded-md border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>例如: 8条</p>
              </div>
              
              {/* 使用频率 */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('使用频率')}</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="high"
                      checked={usageFrequency === 'high'}
                      onChange={(e) => setUsageFrequency(e.target.value as 'high' | 'medium' | 'low')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('高频（每天）')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="medium"
                      checked={usageFrequency === 'medium'}
                      onChange={(e) => setUsageFrequency(e.target.value as 'high' | 'medium' | 'low')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('中频（每周）')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value="low"
                      checked={usageFrequency === 'low'}
                      onChange={(e) => setUsageFrequency(e.target.value as 'high' | 'medium' | 'low')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('低频（每月）')}</span>
                  </label>
                </div>
              </div>
              
              {/* 分隔线 */}
              <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              
              {/* 计算结果 */}
              <div>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('预计每月成本')}</h4>
                <div className="flex items-baseline mb-6">
                  <span className={`text-4xl font-bold mr-1 ${
                    isDark ? 'text-purple-400' : 'text-emerald-500'
                  }`}>¥</span>
                  <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {totalCost.toFixed(2)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('预计解析运价')}</p>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {totalRates} {t('条/月')}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('预计消耗')}</p>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {totalCredits} credits
                    </p>
                  </div>
                </div>
                
                <div className={`mt-6 p-3 rounded-lg text-sm flex items-start ${
                  isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{t('仅对成功识别并结构化输出的运价条数计费，失败解析、空结果不计费')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 企业级接入方案评估器 */}
        {calculatorType === 'enterprise' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`p-8 rounded-xl border max-w-3xl mx-auto ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center mb-6">
              <Building className={`h-6 w-6 mr-2 ${isDark ? 'text-purple-400' : 'text-emerald-500'}`} />
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('企业级接入方案评估器')}</h3>
            </div>
            
            <div className="space-y-8">
              {/* 每日处理运价邮件量 */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('每日处理运价邮件量')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['10封以内', '10-50封', '50-200封', '200封以上'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDailyEmails(range)}
                      className={`py-3 px-4 rounded-md border transition-all ${
                        dailyEmails === range
                          ? (isDark 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-300' 
                            : 'bg-emerald-500/10 border-emerald-400 text-emerald-700')
                          : (isDark 
                            ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100')
                      }`}
                    >
                      {t(range)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 是否需要自动推送解析结果 */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('是否需要自动推送解析结果')}</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="autoPush"
                      value="true"
                      checked={autoPush}
                      onChange={(e) => setAutoPush(e.target.value === 'true')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>是</span>
                  </label>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} ml-6`}>{t('推送至内部系统或业务平台')}</p>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="autoPush"
                      value="false"
                      checked={!autoPush}
                      onChange={(e) => setAutoPush(e.target.value === 'true')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>否</span>
                  </label>
                </div>
              </div>
              
              {/* 是否需要历史数据留存与查询 */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{t('是否需要历史数据留存与查询')}</label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="historyStorage"
                      value="true"
                      checked={historyStorage}
                      onChange={(e) => setHistoryStorage(e.target.value === 'true')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>是</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="historyStorage"
                      value="false"
                      checked={!historyStorage}
                      onChange={(e) => setHistoryStorage(e.target.value === 'true')}
                      className={`h-4 w-4 ${
                        isDark ? 'text-purple-500' : 'text-emerald-500'
                      }`}
                    />
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>否</span>
                  </label>
                </div>
              </div>
              
              {/* 分隔线 */}
              <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              
              {/* 复杂度评级和参考投入区间 */}
              <div>
                <div className="mb-4">
                  <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('复杂度评级')}</h4>
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-purple-400' : 'text-emerald-600'
                  }`}>{enterprisePlan}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('参考投入区间')}</h4>
                  <div className="flex items-baseline">
                    <DollarSign className={`h-5 w-5 mr-1 ${
                      isDark ? 'text-purple-400' : 'text-emerald-600'
                    }`} />
                    <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {enterpriseCostRange}
                    </span>
                  </div>
                </div>
                
                {/* 成本对比参考 */}
                <div className={`p-5 rounded-lg mb-6 ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <h5 className={`text-md font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('成本对比参考（以常见使用场景估算）')}
                  </h5>
                  <div className="space-y-4">
                    <div>
                      <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('人工整理运价')}:
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('1人×每日2-4小时')}
                      </p>
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('AI自动解析')}:
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('全自动处理，仅需人工校验')}
                      </p>
                    </div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {t('实际效果与节省成本因使用规模而异')}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleGetEnterpriseSuggestion}
                  className={`w-full py-3 px-6 rounded-md font-semibold flex items-center justify-center transition-colors ${
                    isDark 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {t('获取接入方案建议（2分钟）')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <p className={`text-xs text-center mt-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {t('实际项目费用以需求评估结果为准')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CostCalculator;