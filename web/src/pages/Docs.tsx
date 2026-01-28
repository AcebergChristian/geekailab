import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

export default function Docs() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  const [activeSection, setActiveSection] = useState('');

  const scrollTimeoutRef = useRef(null);

  // 文档目录结构
  const docSections = [
    {
      id: 'introduction',
      title: '介绍',
      level: 1,
      children: [
        { id: 'overview', title: '概述', level: 2 },
        { id: 'features', title: '特性', level: 2 },
        { id: 'architecture', title: '架构', level: 2 }
      ]
    },
    {
      id: 'getting-started',
      title: '快速开始',
      level: 1,
      children: [
        { id: 'installation', title: '安装', level: 2 },
        { id: 'configuration', title: '配置', level: 2 },
        { id: 'first-steps', title: '第一步', level: 2 }
      ]
    },
    {
      id: 'api-reference',
      title: 'API参考',
      level: 1,
      children: [
        { id: 'data-parser', title: '数据解析器', level: 2 },
        { id: 'extractor', title: '数据提取器', level: 2 },
        { id: 'processor', title: '数据处理器', level: 2 }
      ]
    },
    {
      id: 'examples',
      title: '示例',
      level: 1,
      children: [
        { id: 'pdf-parsing', title: 'PDF解析示例', level: 2 },
        { id: 'image-recognition', title: '图像识别示例', level: 2 },
        { id: 'data-extraction', title: '数据提取示例', level: 2 }
      ]
    },
    {
      id: 'troubleshooting',
      title: '故障排除',
      level: 1,
      children: [
        { id: 'common-issues', title: '常见问题', level: 2 },
        { id: 'debugging', title: '调试技巧', level: 2 }
      ]
    }
  ];

  // 监听滚动事件，高亮当前活跃的章节
  useEffect(() => {
    const handleScroll = () => {
      // 如果正在进行手动滚动，忽略滚动事件
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 设置一个短暂延迟来更新 activeSection，以避免频繁更新
      scrollTimeoutRef.current = setTimeout(() => {
        const sections = document.querySelectorAll('[data-section]');
        let current = '';

        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top;
          // 调整偏移量，更精确地判断当前激活的章节
          if (window.scrollY >= section.offsetTop - 50) {
            current = section.getAttribute('id') || '';
          }
        });

        setActiveSection(current);
      }, 100); // 100ms 防抖延迟
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 平滑滚动到指定元素
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 在滚动前先设置激活的章节
      setActiveSection(id);

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // 滚动完成后再次确认激活的章节
      setTimeout(() => {
        setActiveSection(id);
      }, 500); // 500ms 是大致的滚动完成时间
    }
  };

  return (
    <div className={`
      min-h-screen
      ${isDark
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100'
        : 'bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900'}
      font-sans antialiased
    `}>


      <div className="pt-40 container mx-auto px-6 py-12">
        <div className="flex">
          {/* 左侧浮动导航栏 */}
          <div
            className={`
              fixed left-6 top-24 bottom-24 w-64 overflow-y-auto z-40
              ${isDark
                ? 'bg-gray-900/50 backdrop-blur-md shadow-lg rounded-xl p-4 opacity-90'
                : 'bg-white/50 backdrop-blur-md shadow-lg rounded-xl p-4 opacity-90'}
            `}
          >
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>文档目录</h3>
            <ul className="space-y-2">
              {docSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full text-left py-2 px-3 rounded-lg transition-colors
                      ${activeSection === section.id
                        ? (isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800')
                        : (isDark ? 'hover:bg-gray-800/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700')}
                    `}
                  >
                    <span className={`
                      ${section.level === 1 ? 'font-bold' : 'font-normal ml-2'}
                      ${section.level === 1 ? 'text-base' : 'text-sm'}
                    `}>
                      {section.title}
                    </span>
                  </button>
                  {section.children && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {section.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => scrollToSection(child.id)}
                            className={`
                              w-full text-left py-1.5 px-3 rounded-lg transition-colors
                              ${activeSection === child.id
                                ? (isDark ? 'bg-emerald-900/30 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                                : (isDark ? 'hover:bg-gray-800/30 text-gray-400' : 'hover:bg-gray-100 text-gray-600')}
                              text-xs
                            `}
                          >
                            {child.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 右侧内容区域 */}
          <div className="ml-72 flex-1 max-w-4xl">
            <div className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                开发者文档
              </h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                详细了解我们的非结构化数据解析和识别提取平台
              </p>
            </div>

            {/* 介绍部分 */}
            <section data-section id="introduction" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-emerald-500">介绍</h2>

              <div data-section id="overview" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">概述</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  我们的平台是一个先进的非结构化数据解析和识别提取系统，利用人工智能技术从各种格式的数据中提取有价值的信息。无论是PDF文档、图像、电子邮件还是其他非结构化数据源，我们的平台都能高效准确地进行处理。
                </p>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  该平台采用了最新的机器学习算法和深度学习模型，能够适应不同行业的数据处理需求，为企业提供智能化的数据解决方案。
                </p>
              </div>

              <div data-section id="features" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">特性</h3>
                <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>多格式支持：支持PDF、图像、文档等多种非结构化数据格式</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>高精度识别：基于深度学习的AI模型，识别准确率高达99.8%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>自动化处理：从数据解析到结构化输出的全流程自动化</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>可扩展架构：支持水平扩展以处理海量数据</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>实时处理：支持流式数据处理和实时分析</span>
                  </li>
                </ul>
              </div>

              <div data-section id="architecture" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">架构</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  平台采用微服务架构，主要包含以下几个核心组件：
                </p>
                <ol className={`pl-5 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="list-decimal"><strong>数据接收层：</strong>负责接收和验证传入的数据</li>
                  <li className="list-decimal"><strong>预处理模块：</strong>对原始数据进行清洗和标准化</li>
                  <li className="list-decimal"><strong>AI解析引擎：</strong>使用深度学习模型进行内容识别和解析</li>
                  <li className="list-decimal"><strong>结构化转换器：</strong>将解析结果转换为结构化数据</li>
                  <li className="list-decimal"><strong>数据输出层：</strong>将处理后的数据存储到目标系统</li>
                </ol>
              </div>
            </section>

            {/* 快速开始部分 */}
            <section data-section id="getting-started" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-emerald-500">快速开始</h2>

              <div data-section id="installation" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">安装</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  要开始使用我们的平台，请按照以下步骤进行安装：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    # 安装SDK<br />
                    npm install @data-ai-engine/parser-sdk<br /><br />

                    # 或使用CDN<br />
                    &lt;script src="https://cdn.dataai.example.com/parser-sdk.js"&gt;&lt;/script&gt;
                  </code>
                </pre>
              </div>

              <div data-section id="configuration" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">配置</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  创建配置文件以设置API密钥和其他参数：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    {`const config = {
  apiKey: 'your-api-key',
  modelType: 'advanced', // 'standard', 'advanced', 'enterprise'
  outputFormat: 'json', // 'json', 'csv', 'xml'
  timeout: 30000, // 请求超时时间（毫秒）
  retryAttempts: 3 // 重试次数
};`}
                  </code>
                </pre>
              </div>

              <div data-section id="first-steps" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">第一步</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  以下是如何使用SDK进行第一个数据解析请求的示例：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    {`import { DataParser } from '@data-ai-engine/parser-sdk';

// 初始化解析器
const parser = new DataParser({
  apiKey: 'your-api-key',
  modelType: 'advanced'
});

// 解析PDF文档
const result = await parser.parseDocument({
  source: 'path/to/document.pdf',
  extractionFields: ['invoice_number', 'date', 'amount']
});

console.log(result);
/* 输出示例:
{
  invoice_number: 'INV-2023-001',
  date: '2023-10-15',
  amount: 1250.00,
  confidence: 0.98
}*/
`}
                  </code>
                </pre>
              </div>
            </section>

            {/* API参考部分 */}
            <section data-section id="api-reference" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-emerald-500">API参考</h2>

              <div data-section id="data-parser" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">数据解析器</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  DataParser类是主要的解析接口，提供以下方法：
                </p>

                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h4 className="font-bold text-lg mb-2">parseDocument(options)</h4>
                  <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    解析文档并提取指定字段
                  </p>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p><strong>参数:</strong></p>
                    <ul className="list-disc pl-5 mt-1">
                      <li><code>source</code>: 文档路径或URL</li>
                      <li><code>extractionFields</code>: 要提取的字段数组</li>
                      <li><code>modelType</code>: 使用的AI模型类型</li>
                    </ul>
                    <p className="mt-2"><strong>返回:</strong> Promise&lt;ParseResult&gt;</p>
                  </div>
                </div>

                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h4 className="font-bold text-lg mb-2">parseImage(options)</h4>
                  <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    解析图像并提取文本内容
                  </p>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p><strong>参数:</strong></p>
                    <ul className="list-disc pl-5 mt-1">
                      <li><code>imageSource</code>: 图像路径或URL</li>
                      <li><code>ocrMode</code>: OCR模式 ('text', 'table', 'layout')</li>
                    </ul>
                    <p className="mt-2"><strong>返回:</strong> Promise&lt;ImageParseResult&gt;</p>
                  </div>
                </div>
              </div>

              <div data-section id="extractor" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">数据提取器</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  数据提取器提供专门的数据提取功能：
                </p>

                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h4 className="font-bold text-lg mb-2">extractStructuredData(data, schema)</h4>
                  <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    根据预定义的模式从非结构化数据中提取结构化信息
                  </p>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p><strong>参数:</strong></p>
                    <ul className="list-disc pl-5 mt-1">
                      <li><code>data</code>: 原始非结构化数据</li>
                      <li><code>schema</code>: 数据提取模式定义</li>
                    </ul>
                    <p className="mt-2"><strong>返回:</strong> StructuredData</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 示例部分 */}
            <section data-section id="examples" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-emerald-500">示例</h2>

              <div data-section id="pdf-parsing" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">PDF解析示例</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  以下是如何解析发票PDF并提取关键信息的示例：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    {`// 发票解析示例
const invoiceSchema = {
  fields: {
    invoiceNumber: { type: 'string', patterns: ['INV-[0-9]+'] },
    date: { type: 'date', patterns: ['\\d{4}-\\d{2}-\\d{2}'] },
    amount: { type: 'number', patterns: ['[0-9]+\\.?[0-9]*'] },
    vendor: { type: 'string', location: 'top_left' }
  }
};

const result = await parser.parseDocument({
  source: './invoices/sample-invoice.pdf',
  schema: invoiceSchema,
  modelType: 'advanced'
});

console.log('解析结果:', result);
`}
                  </code>
                </pre>
              </div>

              <div data-section id="image-recognition" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">图像识别示例</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  使用OCR技术从图像中提取文本：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    {`// 图像OCR示例
const imageResult = await parser.parseImage({
  imageSource: './receipt.jpg',
  ocrMode: 'text',
  language: 'zh' // 支持中文识别
});

// 提取特定区域的文本
const amountBox = imageResult.getRegion({
  x: 200, y: 300, width: 150, height: 50
});
const amount = extractAmount(amountBox.text);

console.log('提取金额:', amount);
`}
                  </code>
                </pre>
              </div>
            </section>

            {/* 故障排除部分 */}
            <section data-section id="troubleshooting" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-emerald-500">故障排除</h2>

              <div data-section id="common-issues" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">常见问题</h3>
                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h4 className="font-bold mb-2">解析精度不理想</h4>
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>原因:</strong> 文档质量差或使用了不适合的模型类型
                  </p>
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>解决方案:</strong>
                  </p>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>提高输入文档的分辨率</li>
                    <li>尝试使用更高级别的AI模型</li>
                    <li>调整解析参数，如置信度阈值</li>
                  </ul>
                </div>

                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h4 className="font-bold mb-2">API请求超时</h4>
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>原因:</strong> 网络连接问题或处理大型文档
                  </p>
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>解决方案:</strong>
                  </p>
                  <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>检查网络连接</li>
                    <li>增加请求超时时间</li>
                    <li>分批处理大型文档</li>
                  </ul>
                </div>
              </div>

              <div data-section id="debugging" className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">调试技巧</h3>
                <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  启用详细日志以帮助调试问题：
                </p>
                <pre className={`
                  p-4 rounded-lg overflow-x-auto mb-4
                  ${isDark
                    ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-100 text-emerald-700 border border-emerald-200'}
                `}>
                  <code>
                    {`// 启用调试日志
parser.setLogLevel('debug');

// 获取详细的处理步骤信息
const result = await parser.parseDocument({
  source: 'document.pdf',
  debug: true // 启用调试模式
});

// 查看处理步骤和置信度
console.log('处理步骤:', result.processingSteps);
console.log('字段置信度:', result.fieldConfidence);
`}
                  </code>
                </pre>
              </div>
            </section>
          </div>
        </div>
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