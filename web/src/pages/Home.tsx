import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

export default function Home() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  // 用于切换标签页
  const [activeTab, setActiveTab] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 统一风格的颜色类辅助函数
  const titleGradient = isDark
    ? 'bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
    : 'text-gray-900';

  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const accentText = isDark ? 'text-emerald-400' : 'text-gray-900'; // light 模式标题不用绿色
  const cardBg = isDark ? 'bg-gray-950/80 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md';
  const cardBorder = isDark ? 'border-emerald-500/30' : 'border-emerald-600/30';
  const hoverBorder = isDark ? 'hover:border-emerald-500/60' : 'hover:border-emerald-600/50';
  const shadowStrong = isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-300/50';

  return (
    <div className={`
      min-h-screen
      ${isDark
        ? 'bg-gradient-to-b from-black via-gray-950 to-black'
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'}
      ${textPrimary} font-sans antialiased
    `}>


      {/* Hero */}
      <header className="relative">
        {isDark && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_70%,#10b98133,transparent_40%)]" />
        )}
        <div className="container mx-auto px-6 pt-40 pb-32 text-center relative z-10">
          <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight ${titleGradient}`}>
            Geek AI LAB
          </h1>
          <br />
          <br />
          <h5 className={`text-gray-500 text-3xl md:text-3xl font-extrabold mb-6 tracking-tight`}>
            Geek 人工智能 实验室
          </h5>
          <p className={`text-xl md:text-2xl max-w-4xl mx-auto mb-12 opacity-90 ${textSecondary}`}>
            解析 · 提取 · 结构化 · 智能识别 · 数据自动化
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/system/dashboard"
              className={`
                px-12 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 
                hover:from-emerald-600 hover:to-teal-600 
                text-white font-bold text-lg rounded-xl 
                shadow-2xl shadow-emerald-950/40 transition-all hover:scale-105
              `}
            >
              开始分析
            </a>
            <Link
              to="/docspage"
              className={`
                px-12 py-6 font-bold text-lg rounded-xl border-2 transition-all
                ${isDark
                  ? 'border-emerald-500/70 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-400'
                  : 'border-gray-400 text-gray-800 hover:bg-gray-200 hover:border-gray-500'}
              `}
            >
              了解更多
            </Link>
          </div>
        </div>
      </header>

      {/* Editor / Quest 展示区 → 改成类似 RepoWiki 风格容器 */}
      <section className="container mx-auto px-6 py-20">
        <div className={`
          rounded-3xl overflow-hidden border ${cardBorder} ${shadowStrong} ${cardBg}
        `}>
          <div className="flex flex-col md:flex-row">
            {/* 左侧文字 */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
              {activeTab === 0 && (
                <div>
                  <h2 className={`text-4xl md:text-5xl font-bold mb-8 text-center md:text-left ${titleGradient}`}>
                    智能数据解析平台
                  </h2>
                  <p className={`text-xl text-center md:text-left mb-10 max-w-4xl opacity-90 ${textSecondary}`}>
                    先进的AI算法驱动，从非结构化数据中自动识别关键信息，实现精准提取和结构化处理
                  </p>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <h2 className={`text-4xl md:text-5xl font-bold mb-8 text-center md:text-left ${titleGradient}`}>
                    数据提取与结构化
                  </h2>
                  <p className={`text-xl text-center md:text-left mb-10 max-w-4xl opacity-90 ${textSecondary}`}>
                    从复杂数据源中精准提取结构化信息，实现数据自动化处理
                  </p>
                </div>
              )}


              <div className="mt-auto">
                <div className="flex justify-center md:justify-start space-x-4 mb-4">
                  {['运价解析', '数据提取'].map((tab, index) => (
                    <button
                      key={index}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === index
                        ? isDark
                          ? 'bg-emerald-800/70 text-emerald-100 border border-emerald-500/50'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : isDark
                          ? 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <p className={`text-sm text-center md:text-left opacity-80 ${textMuted}`}>
                  {activeTab === 0 && '基于深度学习的内容识别与OCR技术'}
                  {activeTab === 1 && '从复杂数据源中精准提取结构化信息'}
                </p>
              </div>
            </div>

            {/* 右侧图片区域 */}
            {/* 右侧图片区域 */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
              <div className="w-full relative aspect-video rounded-2xl overflow-hidden bg-black border border-emerald-500/30">
                <div className={`absolute inset-0 flex items-center justify-center ${activeTab === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                  >
                    <source
                      src="https://media.istockphoto.com/id/2175395840/video/computer-screen-showing-a-mail-application-receiving-a-large-amount-of-incoming-mail.mp4?s=mp4-640x640-is&k=20&c=pWItrSMIPj6-VKWYcS01v_pT2axjf59VIyIj8aNFqQI="
                      type="video/mp4"
                    />
                    您的浏览器不支持视频播放
                  </video>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center ${activeTab === 1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <img
                    src="https://gbres.dfcfw.com/Files/iimage/20250707/87B01BB5FA7630D92A10A17D274DD19A_w5824h3264.jpg"
                    alt="数据提取界面"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心能力 */}
      <section className="container mx-auto px-6 py-24 border-t border-emerald-900/30">
        <h2 className={`text-5xl font-bold text-center mb-16 ${titleGradient}`}>
          释放AI数据处理潜能
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { title: "智能识别引擎", desc: "基于深度学习的图像、文本识别技术，准确率高达99%，支持多种数据格式", placeholder: "识别引擎" },
            { title: "数据结构化", desc: "将非结构化数据转换为结构化格式，便于存储、查询和分析", placeholder: "数据结构化" },
            { title: "自动化处理", desc: "从数据采集到入库的全流程自动化，大幅提升数据处理效率", placeholder: "自动化流程" }
          ].map((item, i) => (
            <div
              key={i}
              className={`
                rounded-2xl p-8 border ${cardBorder} ${hoverBorder} transition-all duration-300 ${shadowStrong} ${cardBg}
              `}
            >
              <h3 className={`text-3xl font-bold mb-4 ${accentText}`}>{item.title}</h3>
              <p className={`mb-6 opacity-90 ${textSecondary}`}>{item.desc}</p>
              <div className="aspect-video rounded-xl bg-black flex items-center justify-center border border-emerald-500/30">
                <p className="text-emerald-400/50 font-mono text-lg">{item.placeholder}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 统计区 */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { num: "10M+", label: "已处理数据量", color: "emerald-400" },
            { num: "99.8%", label: "识别准确率", color: "teal-400" },
            { num: "1000+", label: "支持的数据格式", color: "cyan-400" }
          ].map((stat, i) => (
            <div key={i}>
              <p className={`text-6xl font-extrabold ${isDark ? stat.color : 'text-gray-900'}`}>{stat.num}</p>
              <p className={`text-xl mt-4 opacity-90 ${textSecondary}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 下载 / 服务方式 */}
      <section className="container mx-auto px-6 py-24 border-t border-emerald-900/30">
        <h2 className={`text-5xl font-bold text-center mb-16 ${titleGradient}`}>
          智能解析，数据赋能
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-8lg mx-auto">
          {[
            { title: "企业版应用", desc: "为大规模数据处理设计的企业级解决方案", btn: "立即试用", bg: "from-emerald-700 to-teal-700" },
            { title: "API 接口服务", desc: "轻松集成到现有系统中", btn: "复制命令", code: "curl -fsSL https://dataai.example.com/install | bash" },
            { title: "云服务", desc: "按需付费，弹性扩展", btn: "云端体验", bg: "from-cyan-700 to-teal-700" }
          ].map((item, i) => (
            <div
              key={i}
              className={`
                rounded-2xl p-10 text-center border ${cardBorder} hover:border-emerald-500/50 transition-all ${cardBg} ${shadowStrong}
              `}
            >
              <h3 className={`text-2xl font-bold mb-6 ${accentText}`}>{item.title}</h3>
              <p className={`mb-8 ${textSecondary}`}>{item.desc}</p>
              {item.code ? (
                <>
                  <code className="block mb-6 bg-black/70 p-4 rounded font-mono text-emerald-300/90 border border-emerald-900/50">
                    {item.code}
                  </code>
                  <a href="" className="text-emerald-400 hover:underline">复制命令</a>
                </>
              ) : (
                <a
                  href=""
                  className={`
                    inline-block px-8 py-4 text-white rounded-lg font-semibold transition-all hover:scale-105
                    bg-gradient-to-r ${item.bg}
                  `}
                >
                  {item.btn}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 社区反馈 */}
      <section className="container mx-auto px-6 py-20">
        <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-emerald-400' : 'text-gray-900'}`}>
          来自用户的真实反馈
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "数据分析师张伟", role: "金融行业", text: "智能识别功能极大提升了我们处理合同文档的效率，以前需要一周的工作现在一天就能完成。" },
            { name: "技术负责人李明", role: "互联网公司", text: "AI数据提取准确率超出预期，大大减少了人工审核成本。" },
            { name: "项目经理王静", role: "咨询公司", text: "自动结构化功能让我们能够快速处理大量报告，为决策提供了强有力的数据支撑。" }
          ].map((item, i) => (
            <div
              key={i}
              className={`
                rounded-2xl p-8 border ${cardBorder} ${cardBg} ${shadowStrong}
              `}
            >
              <p className={`italic mb-6 opacity-90 ${textSecondary}`}>"{item.text}"</p>
              <p className={`font-bold ${accentText}`}>{item.name}</p>
              <p className={`text-sm opacity-70 ${textMuted}`}>{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20 border-t border-emerald-900/30">
        <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-emerald-300' : 'text-gray-900'}`}>常见问题</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { q: "如何开始使用？", a: "注册账号 → 上传数据 → 选择处理模型 → 查看结果并导出" },
            { q: "支持哪些数据类型？", a: "PDF文档、图片、表格、网页、视频等多种非结构化数据格式" },
            { q: "数据安全如何保障？", a: "采用端到端加密，数据仅在本地处理，确保客户数据安全" },
            { q: "定价方式是怎样的？", a: "按处理数据量计费 + 专业版订阅 + 企业定制方案" }
          ].map((item, i) => (
            <details
              key={i}
              className={`rounded-xl p-6 border ${cardBorder} ${cardBg}`}
            >
              <summary className={`text-xl font-bold cursor-pointer ${accentText}`}>
                {item.q}
              </summary>
              <p className={`mt-4 opacity-90 ${textSecondary}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className={`
        py-12 mt-20 text-center border-t border-emerald-900/40
        ${isDark ? 'bg-black/90' : 'bg-gray-50/90'}
      `}>
        <div className="container mx-auto px-6">
          <p className={`text-2xl font-bold mb-4 ${isDark ? 'text-emerald-400' : 'text-gray-900'}`}>
            Geek AI LAB
          </p>
          <p className={`opacity-70 mb-6 ${textSecondary}`}>智能解析，数据赋能</p>
          <p className={`text-sm opacity-60 ${textMuted}`}>
            © 2025 极羽科技有限公司 沪ICP备999号
          </p>
        </div>
      </footer>
    </div>
  );
}