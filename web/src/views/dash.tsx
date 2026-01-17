import { Link } from 'react-router-dom';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';


// 指标卡片类型
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  color?: string;
}

// 指标卡片组件
const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color = 'blue' }) => {
  const { isDark } = useThemeContext();
  
  return (
    <div className={isDark 
      ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow" 
      : "bg-white border border-gray-200 rounded-lg p-4 shadow"
    }>
      <div className="flex items-center justify-between">
        <div>
          <p className={isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>{title}</p>
          <p className={isDark ? "text-2xl font-bold text-white mt-1" : "text-2xl font-bold text-gray-900 mt-1"}>{value}</p>
          {change && (
            <p className={change.startsWith('+') 
              ? "text-green-500 text-sm mt-1" 
              : "text-red-500 text-sm mt-1"
            }>
              {change}
            </p>
          )}
        </div>
        {icon && <div className={`text-${color}-500`}>{icon}</div>}
      </div>
    </div>
  );
};

// 邮件类型颜色映射
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];



// 引入地图相关的类型和组件
interface MapData {
  country: string;
  value: number;
  color: string;
}

// 地图组件
const WorldMap: React.FC<{ data: MapData[]; t: (key: string) => string }> = ({ data, t }) => {
  const { isDark } = useThemeContext();
  
  // 模拟国家数据
  const countries = [
    { id: 'USA', name: 'United States', value: 120 },
    { id: 'CHN', name: 'China', value: 95 },
    { id: 'DEU', name: 'Germany', value: 75 },
    { id: 'JPN', name: 'Japan', value: 68 },
    { id: 'GBR', name: 'United Kingdom', value: 55 },
    { id: 'FRA', name: 'France', value: 50 },
    { id: 'IND', name: 'India', value: 45 },
    { id: 'BRA', name: 'Brazil', value: 40 },
    { id: 'CAN', name: 'Canada', value: 35 },
    { id: 'AUS', name: 'Australia', value: 30 },
  ];
  
  // 计算颜色值
  const maxValue = Math.max(...countries.map(c => c.value));
  
  return (
    <div className={isDark 
      ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow h-full" 
      : "bg-white border border-gray-200 rounded-lg p-4 shadow h-full"
    }>
      <h3 className="text-lg font-semibold mb-4">{t('geographicDistribution')}</h3>
      <div className="flex flex-col items-center">
        <svg 
          viewBox="0 0 800 400" 
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 简化的世界地图轮廓 */}
          <g stroke={isDark ? "#4b5563" : "#d1d5db"} strokeWidth="0.5" fill={isDark ? "#374151" : "#f3f4f6"}>
            {/* 北美洲 */}
            <path d="M100,150 L150,130 L200,140 L220,180 L200,220 L150,230 L100,200 Z" />
            {/* 南美洲 */}
            <path d="M180,250 L220,270 L200,320 L160,330 L140,280 Z" />
            {/* 欧洲 */}
            <path d="M300,120 L350,110 L380,130 L370,160 L330,170 L300,150 Z" />
            {/* 非洲 */}
            <path d="M320,200 L380,190 L400,250 L350,280 L300,260 L290,220 Z" />
            {/* 亚洲 */}
            <path d="M400,100 L550,80 L600,120 L580,180 L500,200 L420,180 L400,150 Z" />
            {/* 澳大利亚 */}
            <path d="M600,280 L650,270 L670,300 L640,320 L600,310 Z" />
          </g>
          
          {/* 根据数据着色国家 */}
          {countries.map((country, index) => {
            const intensity = country.value / maxValue;
            const colorValue = Math.floor(50 + intensity * 200); // 生成颜色值
            const fillColor = isDark 
              ? `rgb(${Math.max(0, 200 - colorValue)}, ${Math.min(200, colorValue)}, 100)` 
              : `rgb(100, ${Math.min(200, colorValue)}, ${Math.max(0, 200 - colorValue)})`;
            
            return (
              <g key={country.id}>
                {/* 在相应位置显示代表国家的小圆点 */}
                <circle 
                  cx={100 + index * 60} 
                  cy={100 + (index % 3) * 80} 
                  r={8 + country.value / 10} 
                  fill={fillColor} 
                  stroke={isDark ? "#1f2937" : "#ffffff"} 
                  strokeWidth="1"
                  title={`${country.name}: ${country.value}`}
                />
                <text 
                  x={100 + index * 60} 
                  y={100 + (index % 3) * 80 + 25} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill={isDark ? "#9ca3af" : "#6b7280"}
                >
                  {country.name}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="mt-4 w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>{t('low')}</span>
            <span>{t('high')}</span>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default function Dash() {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();
  
  // 模拟指标数据
  const metricsData = [
    { id: 1, title: t('totalEmailsProcessed'), value: '1,248', change: '+12%', icon: '📧', color: 'blue' },
    { id: 2, title: t('attachmentsExtracted'), value: '3,421', change: '+8%', icon: '📎', color: 'green' },
    { id: 3, title: t('dataQualityScore'), value: '96.4%', change: '+2.1%', icon: '📊', color: 'purple' },
    { id: 4, title: t('processingSuccessRate'), value: '98.7%', change: '+0.3%', icon: '✅', color: 'teal' },
  ];

  // 模拟折线图数据 - 邮件处理趋势
  const lineChartData = [
    { day: 'Mon', emails: 120, attachments: 85 },
    { day: 'Tue', emails: 195, attachments: 140 },
    { day: 'Wed', emails: 160, attachments: 110 },
    { day: 'Thu', emails: 210, attachments: 180 },
    { day: 'Fri', emails: 180, attachments: 130 },
    { day: 'Sat', emails: 95, attachments: 60 },
    { day: 'Sun', emails: 70, attachments: 45 },
  ];

  // 模拟柱状图数据 - 不同格式附件数量
  const barChartData = [
    { name: 'PDF', count: 1240 },
    { name: 'Excel', count: 980 },
    { name: 'Word', count: 760 },
    { name: 'CSV', count: 620 },
    { name: 'Image', count: 430 },
    { name: 'Text', count: 320 },
  ];

  // 模拟饼图数据 - 邮件来源分布
  const pieChartData = [
    { name: t('customerInquiries'), value: 400 },
    { name: t('supplierUpdates'), value: 300 },
    { name: t('internalReports'), value: 200 },
    { name: t('financialStatements'), value: 150 },
    { name: t('hrDocuments'), value: 80 },
  ];

  // 模拟面积图数据 - 数据质量趋势
  const areaChartData = [
    { week: 'W1', quality: 92 },
    { week: 'W2', quality: 94 },
    { week: 'W3', quality: 95 },
    { week: 'W4', quality: 96 },
    { week: 'W5', quality: 94 },
    { week: 'W6', quality: 96 },
    { week: 'W7', quality: 97 },
  ];

  return (
    <div className={isDark ? "p-4 bg-gray-900 text-gray-100" : "p-4 bg-gray-50 text-gray-900"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t('emailAttachmentProcessingPlatform')}</p>
      </div>

      {/* 指标卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricsData.map(metric => (
          <MetricCard 
            key={metric.id}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 折线图 - 邮件处理趋势 */}
        <div className={isDark 
          ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow" 
          : "bg-white border border-gray-200 rounded-lg p-4 shadow"
        }>
          <h3 className="text-lg font-semibold mb-4">{t('emailProcessingTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4b5563" : "#e5e7eb"} />
              <XAxis dataKey="day" stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <Tooltip 
                contentStyle={isDark 
                  ? { backgroundColor: '#374151', borderColor: '#4b5563' } 
                  : { backgroundColor: 'white', borderColor: '#e5e7eb' }
                } 
              />
              <Line 
                type="monotone" 
                dataKey="emails" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="attachments" 
                stroke="#10b981" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 柱状图 - 附件格式分布 */}
        <div className={isDark 
          ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow" 
          : "bg-white border border-gray-200 rounded-lg p-4 shadow"
        }>
          <h3 className="text-lg font-semibold mb-4">{t('attachmentFormatDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4b5563" : "#e5e7eb"} />
              <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <Tooltip 
                contentStyle={isDark 
                  ? { backgroundColor: '#374151', borderColor: '#4b5563' } 
                  : { backgroundColor: 'white', borderColor: '#e5e7eb' }
                } 
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 饼图 - 邮件来源分布 */}
        <div className={isDark 
          ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow" 
          : "bg-white border border-gray-200 rounded-lg p-4 shadow"
        }>
          <h3 className="text-lg font-semibold mb-4">{t('emailSourceDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={isDark 
                  ? { backgroundColor: '#374151', borderColor: '#4b5563' } 
                  : { backgroundColor: 'white', borderColor: '#e5e7eb' }
                } 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 面积图 - 数据质量趋势 */}
        <div className={isDark 
          ? "bg-gray-800 border border-gray-700 rounded-lg p-4 shadow" 
          : "bg-white border border-gray-200 rounded-lg p-4 shadow"
        }>
          <h3 className="text-lg font-semibold mb-4">{t('dataQualityTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} domain={[90, 100]} />
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4b5563" : "#e5e7eb"} />
              <Tooltip 
                contentStyle={isDark 
                  ? { backgroundColor: '#374151', borderColor: '#4b5563' } 
                  : { backgroundColor: 'white', borderColor: '#e5e7eb' }
                } 
              />
              <Area 
                type="monotone" 
                dataKey="quality" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorQuality)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 地图区域 */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <WorldMap data={[
            { country: 'USA', value: 120, color: '#ef4444' },
            { country: 'CHN', value: 95, color: '#3b82f6' },
            { country: 'DEU', value: 75, color: '#10b981' },
            { country: 'JPN', value: 68, color: '#f59e0b' },
            { country: 'GBR', value: 55, color: '#8b5cf6' },
          ]} t={t} />
        </div>

      {/* 底部操作按钮 */}
      <div className="flex justify-end">
        <Link 
          to="/workbench" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('viewDetailedReport')}
        </Link>
      </div>
    </div>
  );
}
