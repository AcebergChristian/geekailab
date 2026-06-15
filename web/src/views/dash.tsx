import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as echarts from 'echarts';
import worldJson from '@/assets/world.json';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

echarts.registerMap('world_map', worldJson as never);

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
}

const chartPalette = ['#d67556', '#b98b7d', '#8c7b73', '#6f655f', '#4d4742'];

const MetricCard = ({ title, value, change, icon }: MetricCardProps) => {
  const positive = change?.startsWith('+');

  return (
    <div className="workspace-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="workspace-muted text-sm">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-app">{value}</p>
          {change && (
            <p className={`mt-2 text-sm ${positive ? 'text-app-accent' : 'text-[#9d7466]'}`}>{change}</p>
          )}
        </div>
        {icon && <div className="text-xl text-app-accent">{icon}</div>}
      </div>
    </div>
  );
};

type GeoPoint = { name: string; value: [number, number, number]; country: string };

const regionCountries = [
  { name: 'United States', value: 120, ports: ['Los Angeles', 'Long Beach', 'New York/New Jersey'] },
  { name: 'Brazil', value: 84, ports: ['Santos', 'Rio de Janeiro', 'Paranagua'] },
  { name: 'United Kingdom', value: 58, ports: ['Felixstowe', 'Southampton', 'London Gateway'] },
  { name: 'Germany', value: 73, ports: ['Hamburg', 'Bremerhaven', 'Wilhelmshaven'] },
  { name: 'China', value: 136, ports: ['Shanghai', 'Ningbo-Zhoushan', 'Shenzhen', 'Qingdao'] },
  { name: 'Japan', value: 92, ports: ['Tokyo', 'Yokohama', 'Osaka'] },
  { name: 'Singapore', value: 150, ports: ['PSA Singapore', 'Tanjong Pagar', 'Pasir Panjang'] },
  { name: 'United Arab Emirates', value: 88, ports: ['Jebel Ali', 'Khalifa Port', 'Port Rashid'] },
  { name: 'Australia', value: 67, ports: ['Sydney', 'Melbourne', 'Brisbane'] },
  { name: 'France', value: 49, ports: ['Le Havre', 'Marseille Fos', 'Dunkirk'] },
  { name: 'India', value: 76, ports: ['Nhava Sheva', 'Mundra', 'Chennai'] },
  { name: 'Korea', value: 71, ports: ['Busan', 'Incheon', 'Gwangyang'] }
];

const portPoints: GeoPoint[] = [
  { name: 'Los Angeles', country: 'United States', value: [-118.2437, 34.0522, 86] },
  { name: 'Long Beach', country: 'United States', value: [-118.1937, 33.7701, 90] },
  { name: 'New York / NJ', country: 'United States', value: [-74.006, 40.7128, 78] },
  { name: 'Santos', country: 'Brazil', value: [-46.3336, -23.9618, 72] },
  { name: 'Hamburg', country: 'Germany', value: [9.9937, 53.5511, 80] },
  { name: 'Felixstowe', country: 'United Kingdom', value: [1.351, 51.958, 65] },
  { name: 'Shanghai', country: 'China', value: [121.4737, 31.2304, 98] },
  { name: 'Ningbo', country: 'China', value: [121.5505, 29.8746, 84] },
  { name: 'Shenzhen', country: 'China', value: [114.0579, 22.5431, 91] },
  { name: 'Tokyo', country: 'Japan', value: [139.6917, 35.6895, 76] },
  { name: 'Singapore', country: 'Singapore', value: [103.8198, 1.3521, 100] },
  { name: 'Jebel Ali', country: 'United Arab Emirates', value: [55.0, 25.0, 88] },
  { name: 'Sydney', country: 'Australia', value: [151.2093, -33.8688, 63] },
  { name: 'Le Havre', country: 'France', value: [0.1079, 49.4944, 57] },
  { name: 'Nhava Sheva', country: 'India', value: [72.9347, 18.9496, 74] },
  { name: 'Busan', country: 'Korea', value: [129.0756, 35.1796, 71] }
];

const RegionalMap: React.FC<{
  onCountryHover: (country: string) => void;
  activeCountry: string;
}> = ({ onCountryHover, activeCountry }) => {
  const { isDark } = useThemeContext();
  const elRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const chart = echarts.init(elRef.current, undefined, { renderer: 'canvas' });
    chartRef.current = chart;

    const countryData = regionCountries.map((country) => ({
      name: country.name,
      value: country.value
    }));

    chart.setOption({
      backgroundColor: 'transparent',
      animationDuration: 900,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'item',
        borderWidth: 0,
        backgroundColor: isDark ? '#202020' : '#fcfcfb',
        textStyle: { color: isDark ? '#f3efe9' : '#201c19' },
        formatter: (params: any) => {
          if (params.seriesType === 'scatter') {
            return `${params.data.country}<br/>${params.name}<br/>Active routes: ${params.data.value[2]}`;
          }
          if (params.name) {
            const country = regionCountries.find((item) => item.name === params.name);
            return `${params.name}<br/>Active routes: ${country?.value ?? params.value ?? 0}`;
          }
          return '';
        }
      },
      geo: {
        map: 'world_map',
        roam: true,
        zoom: 1.06,
        scaleLimit: { min: 0.85, max: 4 },
        itemStyle: {
          areaColor: isDark ? '#222222' : '#f6f4ef',
          borderColor: isDark ? '#434343' : '#d7d0c8',
          borderWidth: 0.8
        },
        emphasis: {
          itemStyle: {
            areaColor: '#d67556',
            borderColor: '#d67556',
            shadowBlur: 18,
            shadowColor: 'rgba(214,117,86,0.24)'
          },
          label: { show: false }
        }
      },
      series: [
        {
          type: 'map',
          map: 'world_map',
          geoIndex: 0,
          data: countryData,
          label: { show: false },
          itemStyle: {
            areaColor: isDark ? '#222222' : '#f6f4ef',
            borderColor: isDark ? '#434343' : '#d7d0c8'
          },
          emphasis: {
            label: { show: false },
            itemStyle: {
              areaColor: '#d67556',
              borderColor: '#d67556'
            }
          }
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: portPoints,
          symbolSize: (val: any[]) => Math.max(8, Math.min(18, (val[2] || 0) / 8)),
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 2.4
          },
          itemStyle: {
            color: '#d67556'
          },
          emphasis: {
            scale: true
          }
        }
      ]
    });

    const handleMouseOver = (params: any) => {
      if (params.seriesType === 'scatter') {
        onCountryHover(params.data.country);
      } else if (params.seriesType === 'map' && params.name) {
        onCountryHover(params.name);
      }
    };

    const handleGlobalOut = () => {
      onCountryHover('Singapore');
    };

    chart.on('mouseover', handleMouseOver);
    chart.on('globalout', handleGlobalOut);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.off('mouseover', handleMouseOver);
      chart.off('globalout', handleGlobalOut);
      chart.dispose();
      chartRef.current = null;
    };
  }, [isDark, onCountryHover]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.resize();
  }, [activeCountry]);

  return <div ref={elRef} className="h-[620px] w-full" />;
};

const GlobalOverview: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const [activeCountry, setActiveCountry] = useState('Singapore');
  const activeCountryInfo = regionCountries.find((item) => item.name === activeCountry) || regionCountries[0];
  const activePorts = portPoints.filter((port) => port.country === activeCountry).slice(0, 3);

  return (
    <div className="workspace-card overflow-hidden p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="workspace-section-title">Global</h3>
          <p className="workspace-muted mt-1 text-sm">Regional world map with hover states and port activity.</p>
        </div>
        <div className="workspace-toolbar inline-flex p-1">
          <button className="workspace-tab workspace-tab-active">Regional</button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="overflow-hidden rounded-[28px] border border-app bg-[#fcfcfb]"
      >
        <RegionalMap activeCountry={activeCountry} onCountryHover={setActiveCountry} />
      </motion.div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs workspace-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d67556]" />
          Active port traffic
        </div>
        <div className="flex items-center gap-2 text-xs workspace-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-[#b98b7d]" />
          Secondary lanes
        </div>
        <div className="ml-auto text-xs workspace-muted">
          {activeCountryInfo.name} - {activeCountryInfo.value} active routes
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {activePorts.map((port) => (
          <div key={port.name} className="workspace-card-subtle px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-app">{port.name}</span>
              <span className="text-xs font-semibold text-app-accent">{port.value[2]} active</span>
            </div>
            <p className="mt-1 text-xs workspace-muted">{activeCountryInfo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dash() {
  useThemeContext();
  const { t } = useI18nContext();

  const metricsData = [
    { id: 1, title: t('totalEmailsProcessed'), value: '1,248', change: '+12%', icon: '📧' },
    { id: 2, title: t('attachmentsExtracted'), value: '3,421', change: '+8%', icon: '📎' },
    { id: 3, title: t('dataQualityScore'), value: '96.4%', change: '+2.1%', icon: '📊' },
    { id: 4, title: t('processingSuccessRate'), value: '98.7%', change: '+0.3%', icon: '✅' }
  ];

  const lineChartData = [
    { day: 'Mon', emails: 120, attachments: 85 },
    { day: 'Tue', emails: 195, attachments: 140 },
    { day: 'Wed', emails: 160, attachments: 110 },
    { day: 'Thu', emails: 210, attachments: 180 },
    { day: 'Fri', emails: 180, attachments: 130 },
    { day: 'Sat', emails: 95, attachments: 60 },
    { day: 'Sun', emails: 70, attachments: 45 }
  ];

  const barChartData = [
    { name: 'PDF', count: 1240 },
    { name: 'Excel', count: 980 },
    { name: 'Word', count: 760 },
    { name: 'CSV', count: 620 },
    { name: 'Image', count: 430 },
    { name: 'Text', count: 320 }
  ];

  const pieChartData = [
    { name: t('customerInquiries'), value: 400 },
    { name: t('supplierUpdates'), value: 300 },
    { name: t('internalReports'), value: 200 },
    { name: t('financialStatements'), value: 150 },
    { name: t('hrDocuments'), value: 80 }
  ];

  const areaChartData = [
    { week: 'W1', quality: 92 },
    { week: 'W2', quality: 94 },
    { week: 'W3', quality: 95 },
    { week: 'W4', quality: 96 },
    { week: 'W5', quality: 94 },
    { week: 'W6', quality: 96 },
    { week: 'W7', quality: 97 }
  ];

  return (
    <div className="workspace-page">
      <div className="mb-8">
        <GlobalOverview t={t} />
      </div>

      <div className="workspace-hero">
        <h1 className="text-3xl font-semibold text-app">{t('dashboard')}</h1>
        <p className="mt-2 workspace-muted">{t('emailAttachmentProcessingPlatform')}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.id} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="workspace-card p-5">
          <h3 className="workspace-section-title mb-4">{t('emailProcessingTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,117,86,0.10)" />
              <XAxis dataKey="day" stroke="#8f867f" />
              <YAxis stroke="#8f867f" />
              <Tooltip contentStyle={{ backgroundColor: '#fcfcfb', borderColor: 'rgba(102,92,84,0.12)', borderRadius: '14px' }} />
              <Line type="monotone" dataKey="emails" stroke="#d67556" strokeWidth={2.2} activeDot={{ r: 6, fill: '#d67556' }} />
              <Line type="monotone" dataKey="attachments" stroke="#8f867f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="workspace-card p-5">
          <h3 className="workspace-section-title mb-4">{t('attachmentFormatDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,117,86,0.10)" />
              <XAxis dataKey="name" stroke="#8f867f" />
              <YAxis stroke="#8f867f" />
              <Tooltip contentStyle={{ backgroundColor: '#fcfcfb', borderColor: 'rgba(102,92,84,0.12)', borderRadius: '14px' }} />
              <Bar dataKey="count" fill="#d67556" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="workspace-card p-5">
          <h3 className="workspace-section-title mb-4">{t('emailSourceDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={84} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieChartData.map((_, index) => (
                  <Cell key={index} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fcfcfb', borderColor: 'rgba(102,92,84,0.12)', borderRadius: '14px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="workspace-card p-5">
          <h3 className="workspace-section-title mb-4">{t('dataQualityTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaChartData}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d67556" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#d67556" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="#8f867f" />
              <YAxis stroke="#8f867f" domain={[90, 100]} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(214,117,86,0.10)" />
              <Tooltip contentStyle={{ backgroundColor: '#fcfcfb', borderColor: 'rgba(102,92,84,0.12)', borderRadius: '14px' }} />
              <Area type="monotone" dataKey="quality" stroke="#d67556" fillOpacity={1} fill="url(#colorQuality)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <Link to="/workbench" className="workspace-button-primary">
          {t('viewDetailedReport')}
        </Link>
      </div>
    </div>
  );
}
