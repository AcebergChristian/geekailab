import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  country: string;
  budget: string;
  needs: string[];
  message: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    position: '',
    country: '',
    budget: '',
    needs: [],
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(item => item !== need)
        : [...prev.needs, need]
    }));
  };

  const validateForm = () => {
    const { name, company, email, phone, country, budget, needs } = formData;
    
    if (!name || !company || !email || !phone || !country || !budget || needs.length === 0) {
      toast.error('请填写所有必填字段');
      return false;
    }
    
    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // 模拟API提交
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // 重置表单（可选）
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  const needsOptions = [
    '文档自动化处理',
    '邮件智能识别分类',
    '邮件智能转发',
    '数据结构化',
    '单据数据处理',
    '表格数据提取'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-4xl max-h-[90vh] rounded-xl ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            } border shadow-2xl`}
            onClick={e => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <div className="flex justify-end p-2">
              <button 
                onClick={onClose}
                className={`p-2 rounded-full ${
                  isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-colors`}
                aria-label="关闭"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-4 py-8 md:px-8 md:py-6">
              {!isSubmitted ? (
                <>
                  <h2 className={`text-2xl md:text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>预约演示</h2>
                  <p className={`mb-8 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>填写以下信息，我们的专家将与您联系并安排产品演示</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>姓名 *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="请输入您的姓名"
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>公司名称 *</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="请输入公司名称"
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>工作邮箱 *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name@company.com"
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>联系电话 *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+86 138 0013 8000"
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>职位</label>
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            placeholder="例如：IT经理、运营总监"
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>国家 *</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded-md border ${
                              isDark 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 ${
                              isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                            }`}
                            required
                          >
                            <option value="">请选择国家</option>
                            <option value="china">中国</option>
                            <option value="hongkong">中国香港</option>
                            <option value="taiwan">中国台湾</option>
                            <option value="singapore">新加坡</option>
                            <option value="malaysia">马来西亚</option>
                            <option value="other">其他</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>项目预算 *</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md border ${
                            isDark 
                              ? 'bg-gray-800 border-gray-700 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 ${
                            isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                          }`}
                          required
                        >
                          <option value="">请选择预算范围</option>
                          <option value="-10">10,000元以下</option>
                          <option value="10-50">10,000-50,000元</option>
                          <option value="50-100">50,000-100,000元</option>
                          <option value="100-500">100,000-500,000元</option>
                          <option value="500+">500,000元以上</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>我们可以帮您什么？请选择所有适用的选项 *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {needsOptions.map((need) => (
                            <div key={need} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`need-${need}`}
                                checked={formData.needs.includes(need)}
                                onChange={() => handleCheckboxChange(need)}
                                className={`mr-2 h-4 w-4 rounded ${
                                  isDark 
                                    ? 'text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-500' 
                                    : 'text-emerald-500 bg-gray-100 border-gray-300 focus:ring-emerald-500'
                                }`}
                              />
                              <label
                                htmlFor={`need-${need}`}
                                className={`text-sm ${
                                  isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}
                              >
                                {need}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>补充说明</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="请告诉我们您对产品的具体需求或关注点..."
                          rows={4}
                          className={`w-full px-4 py-2 rounded-md border ${
                            isDark 
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:ring-2 ${
                            isDark ? 'focus:ring-purple-500 focus:border-transparent' : 'focus:ring-emerald-500 focus:border-transparent'
                          }`}
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full font-semibold py-3 px-6 rounded-md transition-colors ${
                          isDark 
                            ? 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-purple-700 disabled:cursor-not-allowed' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-emerald-700 disabled:cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? '提交中...' : '提交预约申请'}
                      </button>
                    </form>
                    
                    <div className="space-y-8">
                      <div className={`p-5 rounded-lg ${
                        isDark ? 'bg-purple-900/30' : 'bg-emerald-50'
                      }`}>
                        <h3 className={`text-lg font-semibold mb-3 ${
                          isDark ? 'text-purple-300' : 'text-emerald-800'
                        }`}>获取个性化演示</h3>
                        <p className={`${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>我们的解决方案专家将为您展示如何通过AI技术提升您的业务效率</p>
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          被世界知名的航运业客户信赖
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {['COCOS', 'Maersk', 'Evergreen', 'APL', 'ONE', 'HMM'].map((company) => (
                            <div key={company} className={`p-3 text-center rounded-md ${
                              isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {company}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold mb-4 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>为什么选择我们的演示？</h3>
                        <ul className="space-y-3">
                          {[
                            { title: '个性化解决方案', desc: '根据您的业务需求定制演示内容' },
                            { title: '专业团队支持', desc: '资深技术专家为您答疑解惑' },
                            { title: '实时互动体验', desc: '现场操作演示，直观感受产品价值' }
                          ].map((item, index) => (
                            <li key={index} className="flex">
                              <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${
                                isDark ? 'text-purple-400' : 'text-emerald-500'
                              }`} />
                              <div>
                                <p className={`font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>{item.title}</p>
                                <p className={`text-sm ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>{item.desc}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
                    isDark ? 'bg-purple-900/30' : 'bg-emerald-100'
                  }`}>
                    <CheckCircle className={`h-10 w-10 ${
                      isDark ? 'text-purple-400' : 'text-emerald-500'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>预约申请已提交</h3>
                  <p className={`mb-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>感谢您的预约，我们的专家将在24小时内与您联系</p>
                  <button
                    onClick={onClose}
                    className={`font-semibold py-2 px-6 rounded-md transition-colors ${
                      isDark 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    关闭
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;