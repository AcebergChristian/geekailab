import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

export default function Home() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  // 更新国际化内容以包含AI平台功能
  const aiCapabilities = [
    {
      title: t('geekmindLLM'),
      description: t('geekmindLLMDescription'),
      features: [t('emailParsing'), t('emailRecognition'), t('emailClassification'), t('fareExtraction')]
    },
    {
      title: t('geekmindAgent'),
      description: t('geekmindAgentDescription'),
      features: [t('autoWorkflow'), t('intelligentDecision'), t('processAutomation'), t('aiAssistance')]
    },
    {
      title: t('shippingIntelligent'),
      description: t('shippingIntelligentDescription'),
      features: [t('routeOptimization'), t('costAnalysis'), t('logisticsTracking'), t('supplyChainOptimization')]
    }
  ];

  return (
    <div className={isDark ? "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100" : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"}>
      {/* 头部导航 */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">GeekMind AI Platform</div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-blue-500 transition-colors">{t('home')}</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">{t('capabilities')}</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">{t('solutions')}</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">{t('pricing')}</a></li>
          </ul>
        </nav>
      </header>

      {/* 主要展示区域 */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">{t('geekmindPlatform')}</h1>
          <p className={isDark ? "text-xl text-gray-300 mb-10 max-w-2xl mx-auto" : "text-xl text-gray-600 mb-10 max-w-2xl mx-auto"}>
            {t('platformDescription')}
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              {t('tryNow')}
            </Link>
            <Link 
              to="/layout" 
              className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              {t('learnMore')}
            </Link>
          </div>
        </section>

        {/* 核心AI能力展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('coreCapabilities')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiCapabilities.map((capability, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 shadow-lg transform transition-transform hover:scale-105 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                <p className={isDark ? "text-gray-300 mb-4" : "text-gray-600 mb-4"}>{capability.description}</p>
                <ul className="space-y-2">
                  {capability.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 轮播图区域 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('solutions')}</h2>
          <div className={`rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'} p-8`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">{t('aiSolutions')}</h3>
                <p className={isDark ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}>
                  {t('solutionDescription')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('apiService')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('sdkIntegration')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('saasPlatform')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{t('customSolution')}</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className={`aspect-video rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                  <div className="text-center rounded-lg">
                      <video autoPlay loop muted playsInline className="max-w-full h-auto rounded-lg">
                        <source src="https://media.istockphoto.com/id/2175395840/video/computer-screen-showing-a-mail-application-receiving-a-large-amount-of-incoming-mail.mp4?s=mp4-640x640-is&k=20&c=pWItrSMIPj6-VKWYcS01v_pT2axjf59VIyIj8aNFqQI=" type="video/mp4" />
                      </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能矩阵 */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">{t('aiFeatures')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              t('emailParsing'),
              t('emailRecognition'), 
              t('emailClassification'),
              t('fareExtraction'),
              t('autoWorkflow'),
              t('intelligentDecision'),
              t('processAutomation'),
              t('aiAssistance')
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-4 text-center ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow transition-colors cursor-pointer`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 mb-2">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <p>{feature}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className={`py-8 mt-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-24xl">
          <p>GeekMind AI</p>
        </div>
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 GeekMind AI Platform. {t('allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
}