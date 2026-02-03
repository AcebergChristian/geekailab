import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';





// 顶部定义在组件外或组件内 return 之前

type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: string; content: string; note?: string };

type DocChildSection = {
  id: string;
  title: string;
  blocks: DocBlock[];
};

type DocSection = {
  id: string;
  title: string;
  children: DocChildSection[];
};

const docSections: DocSection[] = [
  {
    id: 'introduction',
    title: '介绍',
    children: [
      {
        id: 'overview',
        title: '概述',
        blocks: [
          {
            type: 'paragraph',
            text:
              'AI 运价解析系统可以从船司邮件、Excel、PDF 等非结构化内容中，自动识别航线、港口、箱型、币种、价格、有效期等关键信息，并整理成结构化数据，方便你后续导入报价系统或 BI。'
          },
          {
            type: 'paragraph',
            text:
              '你不需要从一开始就集成 API 或 SDK，只要先在控制台上传/转发运价邮件，就可以看到解析效果；等到规则稳定后，再按需对接系统。'
          }
        ]
      },
      {
        id: 'features',
        title: '能力一览',
        blocks: [
          {
            type: 'list',
            items: [
              '多渠道接入：支持邮件转发、文件上传（Excel / PDF / 图片）等方式提交运价',
              '智能字段识别：自动识别 POL / POD / 船司 / 箱型 / 币种 / 价格 / 有效期等字段',
              '结构化输出：统一输出为 JSON 结构，方便你直接写入数据库或内部系统',
              '规则可配置：支持按客户、船司、航线配置不同解析策略和清洗规则',
              '质量监控：记录每次解析耗时、成功标记，便于后续排查与优化'
            ]
          }
        ]
      },
      {
        id: 'architecture',
        title: '整体流程（轻量版）',
        blocks: [
          {
            type: 'list',
            items: [
              '1. 运价接收：通过邮箱或上传入口接收原始运价文件',
              '2. 文档预处理：自动去噪、版式分析、表格区域定位',
              '3. 字段识别：根据模型和规则，提取航线、价格等业务字段',
              '4. 结果结构化：将结果整理为统一 JSON 结构返回',
              '5. 后续处理：你可以把 JSON 写入自有系统，或在控制台中导出 Excel'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'getting-started',
    title: '快速开始',
    children: [
      {
        id: 'installation',
        title: '开通与登录',
        blocks: [
          {
            type: 'list',
            items: [
              '1. 联系我们开通账号，获取 Web 控制台入口',
              '2. 登录后，在「运价解析」页面选择【上传文件】或【配置邮箱转发】',
              '3. 上传一批典型的运价邮件或 Excel，几分钟内即可看到解析结果'
            ]
          }
        ]
      },
      {
        id: 'configuration',
        title: '配置解析模板（可选）',
        blocks: [
          {
            type: 'paragraph',
            text:
              '对于格式比较固定的船司或客户，你可以在控制台中为某些邮件来源配置「解析模板」，包括：字段别名、固定币种、默认航线分组等，从而让解析结果更贴近你的业务口径。'
          }
        ]
      },
      {
        id: 'first-steps',
        title: '查看解析结果',
        blocks: [
          {
            type: 'paragraph',
            text:
              '每条解析任务都会生成一份结构化结果，你可以在页面上直接查看，也可以通过 API 拉取。一个典型的响应结构大致如下：'
          },
          {
            type: 'code',
            language: 'json',
            content: `{
  "result": {
    "prices": [
      {
        "POL": "Hai Phong",
        "POLCode": null,
        "POD": "Rotterdam",
        "PODCode": null,
        "PDL": "",
        "VIA": "",
        "VIACode": "",
        "Shipper": "ONE",
        "Dock": "",
        "SailingSchedule": "",
        "Voyaga": "",
        "Currency": "USD",
        "F20GP": 915,
        "F40GP": 0,
        "F40HQ": 1465,
        "F45HQ": 0,
        "F40NOR": 0,
        "F40HR": 0,
        "StartTime": "",
        "OverTime": "2024-10-15",
        "Remark": "FREE TIME: 5 Dem & 5 Det"
      }
      // ... 更多价格行
    ],
    "surcharge_items": [],
    "other_remarks": []
  },
  "processing_time": 42.43,
  "success": true
}`
          },
          {
            type: 'list',
            items: [
              'result.prices：每一行代表一条运价，包含起运港 / 目的港 / 船司 / 各箱型价格 / 有效期等字段',
              'result.surcharge_items：附加费信息（如战险、旺季附加费等），默认为空数组，后续会逐步补全',
              'result.other_remarks：无法结构化但仍有价值的备注信息，会以文本形式集中放在这里',
              'processing_time：单次解析耗时（毫秒），用于监控性能',
              'success：是否解析成功的标记'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'api-reference',
    title: 'API 及集成方式',
    children: [
      {
        id: 'data-parser',
        title: '通过 HTTP 提交运价',
        blocks: [
          {
            type: 'paragraph',
            text:
              '当你准备把解析能力集成到自己的系统时，可以通过一个简单的 HTTP 接口提交文件或邮件内容，并拿到上面示例的 JSON 结果。下面是一个最简示例（仅示意，具体路径与鉴权请参考正式 API 文档）：'
          },
          {
            type: 'code',
            language: 'bash',
            content: `curl -X POST "https://api.example.com/v1/rate/parse" \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -F "file=@rate-sheet.xlsx"`,
            note: '返回值就是前文展示的 JSON 结构，你可以直接写入数据库或传给内部服务。'
          }
        ]
      },
      {
        id: 'extractor',
        title: '结果落库与二次处理建议',
        blocks: [
          {
            type: 'list',
            items: [
              '落库时建议保留原始解析 JSON，以便后续规则调整或重算',
              '将 result.prices 拆分成运价表，单独维护 surcharge_items 作为附加费表',
              '对 OverTime 建议同时存储为日期字段和字符串字段，方便排序与展示'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'examples',
    title: '典型使用场景',
    children: [
      {
        id: 'pdf-parsing',
        title: '从船司邮件到报价系统',
        blocks: [
          {
            type: 'list',
            items: [
              '业务同事将船司运价邮件统一转发到系统专用邮箱',
              '系统自动触发解析任务，产出 JSON 结果',
              '后端服务按字段映射，将价格写入内部报价系统',
              '销售在 CRM 或报价工具里直接检索、复用最新运价'
            ]
          }
        ]
      },
      {
        id: 'image-recognition',
        title: '处理拍照或截图的运价',
        blocks: [
          {
            type: 'paragraph',
            text:
              '对于拍照或截图形式的运价，系统会先做 OCR 识别，再走同样的字段提取流程。你看到的最终结果，字段结构与普通邮件/Excel 一致，只是 processing_time 可能略长一些。'
          }
        ]
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: '故障排除',
    children: [
      {
        id: 'common-issues',
        title: '常见问题',
        blocks: [
          {
            type: 'list',
            items: [
              '解析结果为空：优先检查文件是否为图片扫描件、内容是否过于模糊',
              '字段错位：在控制台中为该客户/船司配置专用模板，可以显著提升准确率',
              '有效期未识别：注意原文中是否存在多种日期格式，必要时可联系支持团队加规则'
            ]
          }
        ]
      },
      {
        id: 'debugging',
        title: '如何反馈解析问题',
        blocks: [
          {
            type: 'paragraph',
            text:
              '如果你发现某些运价解析效果不理想，建议在控制台中直接选择「反馈样本」，系统会自动连同原文与解析结果一并上报，便于我们快速复现和优化。'
          }
        ]
      }
    ]
  }
];



export default function Docs() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  const [activeSection, setActiveSection] = useState('');

  const scrollTimeoutRef = useRef(null);


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
          if (window.scrollY >= section.offsetTop - 200) {
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






  // 从顶部的 docSections 推导出导航用的大纲
const docOutline = docSections.map(section => ({
  id: section.id,
  title: section.title,
  level: 1,
  children: section.children.map(child => ({
    id: child.id,
    title: child.title,
    level: 2,
  })),
}));

  return (
    <div className={`
      min-h-screen
      ${isDark
        ? 'bg-gray-900 text-gray-100'
        : 'bg-white text-gray-900'}
      font-sans antialiased
    `}>


      <div className="pt-40 container mx-auto px-6 py-12">
        <div className="flex">
          {/* 左侧浮动导航栏 */}
          <div
            className={`
              fixed left-6 top-24 bottom-24 w-64 overflow-y-auto z-40
              ${isDark
                ? 'bg-gray-800/80 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700'
                : 'bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-200'}
            `}
          >
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>文档目录</h3>
            <ul className="space-y-2">
              {docOutline.map(section => (
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
                      {section.children.map(child => (
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
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                开发者文档
              </h1>
              <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                详细了解我们的非结构化数据解析和识别提取平台
              </p>
            </div>
            {docSections.map(section => (
              <section
                key={section.id}
                data-section
                id={section.id}
                className="mb-16"
              >
                <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>
                  {section.title}
                </h2>

                {section.children.map(child => (
                  <div
                    key={child.id}
                    data-section
                    id={child.id}
                    className="mb-10"
                  >
                    <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {child.title}
                    </h3>

                    {child.blocks.map((block, idx) => {
                      if (block.type === 'paragraph') {
                        return (
                          <p
                            key={idx}
                            className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}
                          >
                            {block.text}
                          </p>
                        );
                      }

                      if (block.type === 'list') {
                        return (
                          <ul
                            key={idx}
                            className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                              }`}
                          >
                            {block.items.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-emerald-500 mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      if (block.type === 'code') {
                        return (
                          <div key={idx} className="mb-4">
                            <pre
                              className={`
                      p-4 rounded-lg overflow-x-auto
                      ${isDark
                                  ? 'bg-gray-900 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-gray-100 text-emerald-700 border border-emerald-200'
                                }
                    `}
                            >
                              <code>{block.content}</code>
                            </pre>
                            {block.note && (
                              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {block.note}
                              </p>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                ))}
              </section>
            ))}





          </div>




        </div>
      </div>



    </div>
  );
}