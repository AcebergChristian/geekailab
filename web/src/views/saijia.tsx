import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { useState, useEffect } from 'react';
import { Download, MoreHorizontal, RefreshCw, FileJson, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

import { Editor } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// 主组件
const Saijia: React.FC = () => {
  // 状态管理
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  // 添加解析结果视图tab状态
  const [resultViewTab, setResultViewTab] = useState<'json' | 'form'>('json');

  // 富文本
  const [richvalue, setRichValue] = useState('');


  // 使用上下文
  const { isDark } = useThemeContext();
  const { t } = useI18nContext();

  // 富文本相关
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setRichValue('')
    }, 1500)
  }, [])

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  // 解析富文本内容
  // 解析富文本内容
  const parseContent = async () => {
    if (!richvalue.trim()) {
      alert(t('pleaseEnterRichText'));
      return;
    }

    setIsParsing(true);

    try {
      const response = await fetch('/api/parse-saijia-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html_content: richvalue
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setJsonResult(result);
      // 自动切换到表格视图
      setResultViewTab('form'); 
    } catch (error) {
      console.error('解析内容失败:', error);
      // 使用模拟数据作为后备
      const mockJsonResult = {
        result: {
          "POL": "",
          "POD": "",
          "transport_mode": "AIR",
          "orders": [
            {
              "order_no": "NO GOI RM2512039B",
              "delivery_note": "",
              "store_code_or_whs_code": "3994",
              "brand": "ZARA",
              "country": "KOREA"
            }
          ]
        },
        processing_time: 0,
        success: false
      };

      setJsonResult(mockJsonResult);
      setResultViewTab('form');
    } finally {
      setIsParsing(false);
    }
  };

  // 导出JSON数据
  const exportJson = () => {
    if (!jsonResult) return;

    const dataStr = JSON.stringify(jsonResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `parsed_saijia_content.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 导出Excel数据
  const exportExcel = () => {
    if (!jsonResult) return;
    
    let csvContent = '';
    
    // 获取真正的结果数据
    const actualResult = typeof jsonResult.result === 'string' ? JSON.parse(jsonResult.result) : jsonResult.result;
    
    if (actualResult?.orders && actualResult.orders.length > 0) {
      // 如果存在orders数组，导出表格数据
      const headers = Object.keys(actualResult.orders[0]);
      csvContent = headers.join(',') + '\n';
      
      actualResult.orders.forEach((order: any) => {
        const values = headers.map((header: string) => {
          const value = order[header];
          // 处理包含逗号或引号的值
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += values.join(',') + '\n';
      });
    } else {
      // 否则导出jsonResult的基本结构
      const headers = Object.keys(actualResult || jsonResult);
      csvContent = headers.join(',') + '\n';
      
      const values = headers.map((header: string) => {
        const value = actualResult ? actualResult[header] : jsonResult[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    }
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `parsed_saijia_content.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 根据当前视图选择导出方法
  const handleExport = () => {
    if (resultViewTab === 'json') {
      exportJson();
    } else {
      exportExcel();
    }
  };

  return (
    <div className={isDark ? "p-6 bg-gray-900 text-gray-100 min-h-screen" : "p-6 bg-gray-50 text-gray-900 min-h-screen"}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t('saijiaParser')}</h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t('contentAnalysisWorkbench')}</p>
        </div>

        {/* 控制按钮区 */}
        <div className="flex justify-center mb-6 space-x-3">
          <button 
            onClick={parseContent}
            disabled={isParsing}
            className={cn("px-4 py-2 text-sm rounded-md flex items-center",
              isDark 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            {isParsing ? (
              <>
                <RefreshCw className="animate-spin mr-2" size={14} />
                {t('parsing')}
              </>
            ) : (
              <>
                <ArrowRightLeft size={14} className="mr-2" />
                {t('parse')}
              </>
            )}
          </button>
          
          <button 
            onClick={() => setResultViewTab('json')}
            className={cn("px-4 py-2 text-sm rounded-md flex items-center",
              isDark 
                ? "bg-gray-600 hover:bg-gray-700 text-white" 
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            )}
          >
            <RotateCcw size={14} className="mr-2" />
            {t('reset')}
          </button>
        </div>

        {/* 主工作区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)]">
          {/* 左侧富文本编辑器 */}
          <div className={cn("rounded-lg border shadow-sm overflow-hidden flex flex-col",
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          )}>
            <div className={cn("p-4 border-b",
              isDark 
                ? "border-gray-700 bg-gray-750" 
                : "border-gray-200 bg-gray-50"
            )}>
              <h3 className="font-medium">{t('richTextField')}</h3>
            </div>
            <div className="p-4 h-full flex flex-col flex-1">
              <div
                className="flex-1 h-500 min-h-[500px]"
                >
                <Editor
                  defaultConfig={editorConfig}
                  value={richvalue}
                  onCreated={setEditor}
                  onChange={(editor) => setRichValue(editor.getHtml())}
                  mode="default"
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 右侧解析结果区 */}
          <div className={cn("rounded-lg border shadow-sm overflow-hidden flex flex-col",
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          )}>
            <div className={cn("p-4 border-b flex justify-between items-center",
              isDark 
                ? "border-gray-700 bg-gray-750" 
                : "border-gray-200 bg-gray-50"
            )}>
              <h3 className="font-medium">{t('parsedResult')}</h3>
              {/* 结果视图Tab导航 */}
              {jsonResult && !isParsing && (
                <div className={cn("p-2 border-b",
                  isDark 
                    ? "border-gray-700 bg-gray-750" 
                    : "border-gray-200 bg-gray-50"
                )}>
                  <div className="flex">
                    <button
                      className={`px-3 py-1 text-sm font-medium rounded-t ${
                        resultViewTab === 'json'
                          ? (isDark 
                              ? 'bg-gray-800 text-blue-400' 
                              : 'bg-white text-blue-600')
                          : (isDark 
                              ? 'text-gray-400 hover:text-gray-200' 
                              : 'text-gray-600 hover:text-gray-800')
                      }`}
                      onClick={() => setResultViewTab('json')}
                    >
                      JSON
                    </button>
                    <button
                      className={`px-3 py-1 text-sm font-medium rounded-t ${
                        resultViewTab === 'form'
                          ? (isDark 
                              ? 'bg-gray-800 text-blue-400' 
                              : 'bg-white text-blue-600')
                          : (isDark 
                              ? 'text-gray-400 hover:text-gray-200' 
                              : 'text-gray-600 hover:text-gray-800')
                      }`}
                      onClick={() => setResultViewTab('form')}
                    >
                      {t('form')}
                    </button>
                  </div>
                </div>
              )}
              <div className="flex space-x-2">
                {jsonResult && !isParsing && (
                  <button 
                    onClick={handleExport}
                    className={cn("p-2 rounded-md",
                      isDark 
                        ? "hover:bg-gray-700 text-gray-400" 
                        : "hover:bg-gray-200 text-gray-600"
                    )}
                    title={resultViewTab === 'json' ? t('exportJson') : t('exportExcel')}
                  >
                    <Download size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isParsing ? (
                <div className={cn("flex items-center justify-center h-full",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin mb-3" size={32} />
                    <p>{t('parsing')}</p>
                  </div>
                </div>
              ) : jsonResult ? (
                resultViewTab === 'json' ? (
                  <pre className={cn("text-xs whitespace-pre-wrap break-all max-h-full overflow-auto",
                    isDark ? "text-green-400" : "text-green-700"
                  )}>
                    {JSON.stringify(jsonResult, null, 2)}
                  </pre>
                ) : (
                  // Form/表格视图
                  <div className="overflow-auto h-full">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Basic Info:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="font-medium">POL:</span> 
                          <span className="ml-2">{typeof jsonResult.result === 'string' ? JSON.parse(jsonResult.result).POL : jsonResult.result?.POL || ''}</span>
                        </div>
                        <div>
                          <span className="font-medium">POD:</span> 
                          <span className="ml-2">{typeof jsonResult.result === 'string' ? JSON.parse(jsonResult.result).POD : jsonResult.result?.POD || ''}</span>
                        </div>
                        <div>
                          <span className="font-medium">Transport Mode:</span> 
                          <span className="ml-2">{typeof jsonResult.result === 'string' ? JSON.parse(jsonResult.result).transport_mode : jsonResult.result?.transport_mode || ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Orders:</h4>
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={isDark ? "bg-gray-750" : "bg-gray-50"}>
                          <tr>
                            {["order_no", "delivery_note", "store_code_or_whs_code", "brand", "country"].map((header) => (
                              <th 
                                key={header}
                                scope="col" 
                                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={cn("divide-y divide-gray-200 dark:divide-gray-700",
                          isDark ? "bg-gray-800" : "bg-white"
                        )}>
                          {(typeof jsonResult.result === 'string' ? JSON.parse(jsonResult.result).orders : jsonResult.result?.orders || []).map((order: any, rowIndex: number) => (
                            <tr key={rowIndex}>
                              {["order_no", "delivery_note", "store_code_or_whs_code", "brand", "country"].map((field, fieldIndex) => (
                                <td 
                                  key={fieldIndex}
                                  className="px-3 py-2 whitespace-nowrap text-sm"
                                >
                                  {String(order[field] || '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <p>Processing Time: {jsonResult.processing_time}s</p>
                      <p>Success: {jsonResult.success ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                )
              ) : (
                <div className={cn("flex flex-col items-center justify-center h-full text-center",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  <FileJson size={48} className="mb-3 opacity-50" />
                  <p>{t('parseContentToSeeResult')}</p>
                  <p className="text-sm mt-1">{t('clickParseButton')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saijia;