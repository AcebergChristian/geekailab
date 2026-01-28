import React, { useState } from 'react';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

// 定义数据类型
interface DataType {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'processed' | 'processing' | 'pending';
  processedDate: string;
}

interface ParseResult {
  id: string;
  original: string;
  extracted: string;
  confidence: number;
  fields: Array<{ name: string; value: string }>;
}

const Dataset: React.FC = () => {
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();
  
  const [selectedDataType, setSelectedDataType] = useState<string>('all');
  
  // 模拟不同类型的数据
  const dataTypes: DataType[] = [
    { id: '1', name: '船运报价单', type: 'PDF', size: '2.4MB', status: 'processed', processedDate: '2024-12-01' },
    { id: '2', name: '货柜清单', type: 'Excel', size: '1.1MB', status: 'processed', processedDate: '2024-12-01' },
    { id: '3', name: '货运合同', type: 'PDF', size: '3.7MB', status: 'processing', processedDate: '2024-12-01' },
    { id: '4', name: '邮件附件', type: 'Image', size: '0.8MB', status: 'pending', processedDate: '-' },
    { id: '5', name: '提单样本', type: 'PDF', size: '1.9MB', status: 'processed', processedDate: '2024-11-30' },
    { id: '6', name: '运费通知', type: 'Text', size: '0.3MB', status: 'processed', processedDate: '2024-11-29' },
  ];
  
  // 模拟解析结果
  const parseResults: ParseResult[] = [
    {
      id: '1',
      original: 'Original: USD 2,850/FEU to Shanghai, effective Dec 1st\nNew Offer: USD 2,750/FEU to Shanghai, effective Dec 15th',
      extracted: 'USD 2,750/FEU to Shanghai, effective Dec 15th',
      confidence: 98.5,
      fields: [
        { name: 'Currency', value: 'USD' },
        { name: 'Rate', value: '2,750/FEU' },
        { name: 'Destination', value: 'Shanghai' },
        { name: 'Effective Date', value: 'Dec 15th' },
        { name: 'Previous Rate', value: '2,850/FEU' }
      ]
    },
    {
      id: '2',
      original: 'Container Type: 40ft HC\nQuantity: 15 units\nOrigin: Busan\nDestination: Long Beach\nRate: $3,200/40ft',
      extracted: '40ft HC, 15 units, Busan to Long Beach, $3,200/40ft',
      confidence: 96.2,
      fields: [
        { name: 'Container Type', value: '40ft HC' },
        { name: 'Quantity', value: '15 units' },
        { name: 'Origin', value: 'Busan' },
        { name: 'Destination', value: 'Long Beach' },
        { name: 'Rate', value: '$3,200/40ft' }
      ]
    },
    {
      id: '3',
      original: 'Subject: Urgent - Freight Rate Update for Asia-Europe Routes\nPlease note that rates for all Asia-Europe routes will increase by 15% starting Jan 1st.',
      extracted: 'Asia-Europe routes rate increase by 15%, effective Jan 1st',
      confidence: 94.7,
      fields: [
        { name: 'Route', value: 'Asia-Europe' },
        { name: 'Change', value: 'Increase 15%' },
        { name: 'Effective Date', value: 'Jan 1st' },
        { name: 'Priority', value: 'Urgent' }
      ]
    }
  ];

  // 过滤数据类型
  const filteredDataTypes = selectedDataType === 'all' 
    ? dataTypes 
    : dataTypes.filter(dt => dt.type === selectedDataType);

  // 状态颜色映射
  const statusColors = {
    processed: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
    processing: isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
    pending: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">数据集管理</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            展示我们能够解析的各种非结构化数据类型，特别是船货运运价相关文档
          </p>
        </div>

        {/* 数据类型筛选 */}
        <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedDataType === 'all'
                  ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')
              }`}
              onClick={() => setSelectedDataType('all')}
            >
              全部 ({dataTypes.length})
            </button>
            {['PDF', 'Excel', 'Image', 'Text'].map(type => {
              const count = dataTypes.filter(dt => dt.type === type).length;
              return (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedDataType === type
                      ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                      : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')
                  }`}
                  onClick={() => setSelectedDataType(type)}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 数据列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDataTypes.map((dataType) => (
            <div
              key={dataType.id}
              className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow p-5`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{dataType.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {dataType.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {dataType.size}
                    </span>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[dataType.status]}`}>
                  {dataType.status === 'processed' ? '已处理' : 
                   dataType.status === 'processing' ? '处理中' : '待处理'}
                </span>
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                处理日期: {dataType.processedDate !== '-' ? dataType.processedDate : '待定'}
              </div>
            </div>
          ))}
        </div>

        {/* 解析结果展示 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">解析结果示例</h2>
          
          <div className="space-y-8">
            {parseResults.map((result) => (
              <div key={result.id} className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow`}>
                <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">数据项 #{result.id}</h3>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        置信度: {result.confidence}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}>
                        已提取
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* 原始数据 */}
                  <div className={`p-5 border-r ${isDark ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${isDark ? 'bg-red-500' : 'bg-red-400'}`}></span>
                      原始数据
                    </h4>
                    <div className={`p-4 rounded ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                      <p className={`whitespace-pre-line text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {result.original}
                      </p>
                    </div>
                  </div>
                  
                  {/* 解析结果 */}
                  <div className="p-5">
                    <h4 className="font-medium mb-3 flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`}></span>
                      解析结果
                    </h4>
                    <div className={`p-4 rounded ${isDark ? 'bg-blue-900/20 border border-blue-800/50' : 'bg-blue-50 border border-blue-200'}`}>
                      <p className={`whitespace-pre-line text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        {result.extracted}
                      </p>
                    </div>
                    
                    {/* 提取的字段 */}
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">提取字段</h5>
                      <div className="space-y-2">
                        {result.fields.map((field, index) => (
                          <div key={index} className="flex">
                            <span className={`w-32 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {field.name}:
                            </span>
                            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                              {field.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部说明 */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className="font-semibold mb-3">支持的数据格式</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'PDF文档', types: 'PDF, PDF扫描件' },
              { name: '电子表格', types: 'Excel, CSV, Google Sheets' },
              { name: '图像文件', types: 'JPG, PNG, TIFF, GIF' },
              { name: '文本文件', types: 'TXT, RTF, DOC, DOCX' }
            ].map((format, index) => (
              <div key={index} className={`p-4 rounded ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                <div className="font-medium">{format.name}</div>
                <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {format.types}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;