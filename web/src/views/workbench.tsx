import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { useState, useMemo, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell
} from 'recharts';
import {
  ChevronLeft, Download, MoreHorizontal, RefreshCw, FileText, ExternalLink, FileJson, ArrowRightLeft,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';



import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'



// 邮件数据类型
interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  date: string;
  content: string;
  html_content: string;
  attachments: AttachmentItem[];
  read: boolean;
  starred: boolean;
  folder: string;
}

// 附件数据类型
interface AttachmentItem {
  id: string;
  filename: string;
  file_path: string;
}

// API响应类型
interface EmailApiResponse {
  id: string;
  email_id: string;
  subject: string;
  sender: string;
  receiver: string;
  date: string;
  content: string;
  html_content: string;
  created_time: string;
  attachment_id?: string;
  filename?: string;
  file_path?: string;
}

// 邮件列表项组件
interface EmailListItemProps {
  email: EmailItem;
  isSelected: boolean;
  onClick: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onClick }) => {
  const { isDark } = useThemeContext();

  return (
    <div
      className={cn(
        "p-3 border-b cursor-pointer transition-colors",
        isDark
          ? "border-gray-700 hover:bg-gray-750"
          : "border-gray-200 hover:bg-gray-100",
        isSelected
          ? (isDark ? "bg-gray-750" : "bg-blue-50")
          : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center mb-1">
        <span className={cn("font-medium truncate",
          isDark ? "text-gray-200" : "text-gray-900",
          !email.read && "font-bold"
        )}>
          {email.sender}
        </span>
        {email.starred && (
          <span className="ml-auto text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        )}
      </div>
      <div className={cn("text-sm truncate", isDark ? "text-gray-400" : "text-gray-600")}>
        {email.subject}
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
          {email.date}
        </span>
        {email.attachments.length > 0 && (
          <span className={cn("text-xs flex items-center", isDark ? "text-blue-400" : "text-blue-600")}>
            <PaperClipIcon className="w-3 h-3 mr-1" /> {email.attachments.length}
          </span>
        )}
      </div>
    </div>
  );
};

// 纸夹图标组件
const PaperClipIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
  </svg>
);

// 主组件
const Workbench: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5); // 每页显示5条
  // 富文本
  const [richvalue, setRichValue] = useState('');


  // 添加解析结果视图tab状态
  const [resultViewTab, setResultViewTab] = useState<'json' | 'table'>('json');

  // 使用上下文
  const { theme, toggleTheme, isDark } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();

  // OCR相关状态
  const [ocrFiles, setOcrFiles] = useState<any>(null);
  const [ocrResults, setOcrResults] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 获取邮件数据 - 尝试从API获取，失败则使用模拟数据
  const fetchEmails = async (page: number = 1, size: number = 5) => {
    try {
      setIsLoading(true);
      const skip = (page - 1) * size;
      // 使用相对路径，通过 Vite 代理配置转发到后端
      const response = await fetch(`/api/emails-with-attachments?skip=${skip}&limit=${size}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const apiData = responseData.data || responseData; // 兼容新旧格式
      const total = responseData.total || apiData.length; // 使用后端返回的total

      // 处理API响应数据并转换为组件使用的格式
      const processedEmails = processApiData(apiData);
      setEmails(processedEmails);

      // 使用后端返回的总数计算总页数
      setTotalPages(Math.ceil(total / size));
    } catch (error) {
      console.error('获取邮件数据失败，使用模拟数据:', error);
      // 使用模拟数据作为备选方案
      const mockEmails = getMockEmails();
      setEmails(mockEmails);
      setTotalPages(Math.ceil(mockEmails.length / size));
    } finally {
      setIsLoading(false);
    }
  };

  // 处理API返回的数据
  const processApiData = (apiData: EmailApiResponse[]): EmailItem[] => {
    const emailMap = new Map<string, EmailItem>();

    apiData.forEach(item => {
      if (!emailMap.has(item.email_id)) {
        // 创建新的邮件项
        const newEmail: EmailItem = {
          id: item.email_id,
          sender: item.sender,
          subject: item.subject,
          date: item.date || item.created_time,
          content: item.content || item.html_content || '',
          html_content: item.html_content || '',
          attachments: item.attachment_id ? [{
            id: item.attachment_id,
            filename: item.filename || '',
            file_path: item.file_path || ''
          }] : [],
          read: true, // 默认已读
          starred: false, // 默认未加星标
          folder: 'inbox'
        };
        emailMap.set(item.email_id, newEmail);
      } else {
        // 如果邮件已有，添加附件
        const existingEmail = emailMap.get(item.email_id)!;
        if (item.attachment_id) {
          existingEmail.attachments.push({
            id: item.attachment_id,
            filename: item.filename || '',
            file_path: item.file_path || ''
          });
        }
      }
    });

    return Array.from(emailMap.values()).reverse(); // 按时间倒序排列
  };

  // 获取模拟邮件数据
  const getMockEmails = (): EmailItem[] => [
    {
      id: '1',
      sender: '张三 <zhangsan@example.com>',
      subject: 'Q4季度报告',
      date: '2025-01-10 14:30',
      content: '你好，这是Q4季度的财务报告，请查收。\n\n附件包含详细的数据分析表格。',
      html_content: '<p>你好，这是Q4季度的财务报告，请查收。</p><p>附件包含详细的数据分析表格。</p>',
      attachments: [{ id: '1', filename: 'Q4_report.xlsx', file_path: '/attachments/Q4_report.xlsx' }],
      read: false,
      starred: true,
      folder: 'inbox'
    },
    {
      id: '2',
      sender: '李四 <lisi@company.com>',
      subject: '会议邀请：新产品发布讨论',
      date: '2025-01-10 11:15',
      content: '大家好，\n\n我们将于本周五上午10点举行新产品发布的讨论会议。\n\n请准备相关材料。',
      html_content: '<p>大家好，</p><p>我们将于本周五上午10点举行新产品发布的讨论会议。</p><p>请准备相关材料。</p>',
      attachments: [],
      read: true,
      starred: false,
      folder: 'inbox'
    },
    {
      id: '3',
      sender: '王五 <wangwu@supplier.com>',
      subject: '订单确认及发货通知',
      date: '2025-01-09 16:45',
      content: '尊敬的客户，\n\n您的订单已确认，预计将在3个工作日内发货。\n\n如有任何问题请随时联系我们。',
      html_content: '<p>尊敬的客户，</p><p>您的订单已确认，预计将在3个工作日内发货。</p><p>如有任何问题请随时联系我们。</p>',
      attachments: [{ id: '2', filename: 'order_confirmation.pdf', file_path: '/attachments/order_confirmation.pdf' }],
      read: true,
      starred: false,
      folder: 'inbox'
    },
    {
      id: '4',
      sender: '赵六 <zhaoliu@client.com>',
      subject: '合作意向书',
      date: '2025-01-09 09:20',
      content: '您好，\n\n我们对贵公司的产品非常感兴趣，希望能进一步探讨合作可能性。\n\n期待您的回复。',
      html_content: '<p>您好，</p><p>我们对贵公司的产品非常感兴趣，希望能进一步探讨合作可能性。</p><p>期待您的回复。</p>',
      attachments: [{ id: '3', filename: 'cooperation_proposal.docx', file_path: '/attachments/cooperation_proposal.docx' }],
      read: false,
      starred: true,
      folder: 'inbox'
    },
    {
      id: '5',
      sender: '系统通知 <noreply@system.com>',
      subject: '系统维护通知',
      date: '2025-01-08 18:00',
      content: '为了提升服务质量，系统将于本周末进行维护。\n\n期间可能会有短暂的服务中断，请提前做好安排。',
      html_content: '<p>为了提升服务质量，系统将于本周末进行维护。</p><p>期间可能会有短暂的服务中断，请提前做好安排。</p>',
      attachments: [],
      read: true,
      starred: false,
      folder: 'inbox'
    }
  ];


  // 切换页面
  const handlePageChange = (page: number) => {
    console.log('切换到第', page, '页')
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 重新获取对应页面的数据
      fetchEmails(page, pageSize);
    }
  };

  // 在组件挂载时获取邮件数据
  useEffect(() => {
    fetchEmails(currentPage, pageSize);
  }, []);

  // 当前选中的邮件
  const selectedEmail = useMemo(() => {
    return selectedEmailId ? emails.find(email => email.id === selectedEmailId) : emails[0];
  }, [selectedEmailId, emails]);

  // 解析邮件内容
  const parseContent = async () => {
    if (activeTab === 'inbox') {
      if (!selectedEmail) return;

      setIsParsing(true);

      try {
        const response = await fetch('/api/parse-email-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html_content: selectedEmail.html_content || selectedEmail.content
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setJsonResult(result);
      } catch (error) {
        console.error('解析邮件内容失败:', error);
        // 如果API调用失败，仍然使用模拟数据作为后备
        const mockJsonResult = {
          email_id: selectedEmail.id,
          sender: selectedEmail.sender,
          subject: selectedEmail.subject,
          date: selectedEmail.date,
          content_summary: selectedEmail.content.substring(0, 100) + '...',
          entities: {
            people: ['张三', '李四', '王五'],
            organizations: ['公司A', '供应商B', '客户C'],
            dates: ['2025-01-10', '2025-01-15'],
            amounts: ['100,000元', '50,000元'],
            locations: ['北京', '上海']
          },
          sentiment: 'neutral',
          action_items: ['准备Q4报告', '参加周五会议', '跟进订单状态'],
          attachments_parsed: selectedEmail.attachments.map(att => ({
            name: att.filename,
            type: att.filename.split('.').pop(),
            size: '1.2MB',
            parsed_content: '已解析的附件内容摘要...'
          })),
          processing_time: 0,
          success: false
        };

        setJsonResult(mockJsonResult);
      } finally {
        setIsParsing(false);
      }
    } 
    else if (activeTab === 'rich_text') {
      // 富文本标签页时的处理
      if (!richvalue.trim()) {
        alert(t('pleaseEnterRichText'));
        return;
      }

      setIsParsing(true);

      try {
        const response = await fetch('/api/parse-email-content', {
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
      } catch (error) {
        console.error('解析富文本内容失败:', error);
        // 使用模拟数据作为后备
        const mockJsonResult = {
          content_type: 'rich_text',
          content_summary: richvalue.substring(0, 100) + '...',
          entities: {
            people: ['张三', '李四', '王五'],
            organizations: ['公司A', '供应商B', '客户C'],
            dates: ['2025-01-10', '2025-01-15'],
            amounts: ['100,000元', '50,000元'],
            locations: ['北京', '上海']
          },
          sentiment: 'neutral',
          action_items: ['准备Q4报告', '参加周五会议', '跟进订单状态'],
          processing_time: 0,
          success: false
        };

        setJsonResult(mockJsonResult);
      } finally {
        setIsParsing(false);
      }
    }
    else if (activeTab === 'ocr') {
      // OCR标签页时的处理
      if (!ocrFiles) {
        alert('请先上传文件');
        return;
      }

      setIsParsing(true);

      try {
        // 创建 FormData 对象来发送文件
        const formData = new FormData();
        formData.append('file', ocrFiles);
        console.log('formData', formData);

        const response = await fetch('/api/ocr', {
          method: 'POST',
          // 注意：不要设置 Content-Type，让浏览器自动设置 multipart/form-data
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setJsonResult(result);
      } catch (error) {
        console.error('OCR解析失败:', error);
        // 使用模拟数据作为后备
        const mockJsonResult = {
          content_type: 'ocr_result',
          content_summary: 'OCR解析结果摘要...',
          entities: {
            people: [],
            organizations: [],
            dates: [],
            amounts: [],
            locations: []
          },
          sentiment: 'neutral',
          action_items: [],
          processing_time: 0,
          success: false,
          original_filename: ocrFiles?.name || 'unknown'
        };

        setJsonResult(mockJsonResult);
      } finally {
        setIsParsing(false);
      }

    }
  };


  // 重置功能
  const resetResults = () => {
    setJsonResult(null);
    setResultViewTab('json');
  };






  // 导出JSON数据
  const exportJson = () => {
    if (!jsonResult) return;

    const dataStr = JSON.stringify(jsonResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `parsed_email_${selectedEmail?.id || 'unknown'}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 导出Excel数据
  const exportExcel = () => {
    if (!jsonResult) return;

    let csvContent = '';

    if (jsonResult?.result?.prices && jsonResult.result.prices.length > 0) {
      // 如果存在prices数组，导出表格数据
      const headers = Object.keys(jsonResult.result.prices[0]);
      csvContent = headers.join(',') + '\n';

      jsonResult.result.prices.forEach((priceObj: any) => {
        const values = headers.map(header => {
          const value = priceObj[header];
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
      const headers = Object.keys(jsonResult);
      csvContent = headers.join(',') + '\n';

      const values = headers.map(header => {
        const value = jsonResult[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    }

    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `parsed_data_${selectedEmail?.id || 'unknown'}.csv`;

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




  // 富文本相关
  const [editor, setEditor] = useState<IDomEditor | null>(null) // TS 语法

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setRichValue('')
    }, 1500)
  }, [])

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {

  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])





  // ocr相关




  return (
    <div className={isDark ? "p-6 bg-gray-900 text-gray-100 min-h-screen" : "p-6 bg-gray-50 text-gray-900 min-h-screen"}>
      <div className="max-w-8xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t('GeekAILab')}</h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t('AnylysisWorkbench')}</p>
        </div>

        {/* 顶部Tab导航 */}
        <div className="flex justify-center mb-6">
          <div className={cn("inline-flex rounded-md shadow-sm",
            isDark
              ? "bg-gray-800"
              : "bg-white"
          )}>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'inbox'
                ? (isDark
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-blue-100 text-blue-700 border border-blue-300')
                : (isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100')
                }`}
              onClick={() => setActiveTab('inbox')}
            >
              {t('inbox')}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'richText'
                ? (isDark
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-blue-100 text-blue-700 border border-blue-300')
                : (isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100')
                }`}
              onClick={() => setActiveTab('richText')}
            >
              {t('richText')}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'ocr'
                ? (isDark
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-blue-100 text-blue-700 border border-blue-300')
                : (isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100')
                }`}
              onClick={() => setActiveTab('ocr')}
            >
              OCR
            </button>
          </div>
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
            onClick={resetResults}
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
        <div className={`grid grid-cols-1 ${activeTab === 'inbox' ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-4 h-[calc(100vh-280px)]`}>
          {/* 左侧区域 */}
          <div className={cn("rounded-lg border shadow-sm overflow-hidden flex flex-col",
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}>


            {activeTab === 'inbox' && (
              <div className="flex flex-1 h-full">
                {/* 邮件列表 */}
                <div className={cn("w-1/3 border-r flex flex-col",
                  isDark
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                )}>
                  {/* 邮件列表标题 */}
                  <div className={cn("p-4 border-b",
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  )}>
                    <h3 className="font-medium">{t('emailList')}</h3>
                  </div>

                  {/* 邮件列表 */}
                  <div className="flex flex-col flex-1 h-full overflow-y-auto">
                    <div className="h-[100%] overflow-y-auto">
                      {emails.map(email => (
                        <EmailListItem
                          key={email.id}
                          email={email}
                          isSelected={selectedEmail?.id === email.id}
                          onClick={() => setSelectedEmailId(email.id)}
                        />
                      ))}
                    </div>

                    {/* 分页按钮栏 */}
                    <div className={cn("p-2 border-t flex items-center justify-between mb-0",
                      isDark
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-200 bg-gray-50"
                    )}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={cn("px-3 py-1 rounded text-sm",
                          currentPage === 1
                            ? (isDark ? "text-gray-600" : "text-gray-400")
                            : (isDark
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-200")
                        )}
                      >
                        {t('previous')}
                      </button>

                      <span className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                        {t('page')} {currentPage} {t('of')} {totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={cn("px-3 py-1 rounded text-sm",
                          currentPage === totalPages
                            ? (isDark ? "text-gray-600" : "text-gray-400")
                            : (isDark
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-200")
                        )}
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 邮件详情 */}
                <div className={cn("w-2/3 rounded-lg border shadow-sm overflow-hidden flex flex-col",
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}>
                  <div className={cn("p-4 border-b",
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  )}>
                    <h3 className="font-medium">{t('emailPreview')}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {selectedEmail ? (
                      <>
                        <div className="mb-4">
                          <h2 className={cn("text-lg font-semibold mb-2", isDark ? "text-gray-100" : "text-gray-900")}>
                            {selectedEmail.subject}
                          </h2>
                          <div className={cn("flex justify-between text-sm mb-4",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}>
                            <span>{selectedEmail.sender}</span>
                            <span>{selectedEmail.date}</span>
                          </div>
                        </div>

                        <div
                          className={cn("mb-6",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}
                          dangerouslySetInnerHTML={{ __html: selectedEmail.html_content || selectedEmail.content || '<p>No Content</p>' }}
                        />

                        {selectedEmail.attachments.length > 0 && (
                          <div className="mt-6">
                            <h3 className={cn("font-medium mb-2", isDark ? "text-gray-300" : "text-gray-700")}>
                              {t('attachments')} ({selectedEmail.attachments.length})
                            </h3>
                            <div className="space-y-2">
                              {selectedEmail.attachments.map((att, index) => (
                                <div
                                  key={`${selectedEmail.id}-${att.id}`}
                                  className={cn("flex items-center p-2 rounded border",
                                    isDark
                                      ? "bg-gray-750 border-gray-700 text-gray-300"
                                      : "bg-gray-50 border-gray-200 text-gray-700"
                                  )}
                                >
                                  <FileText size={16} className="mr-2 flex-shrink-0" />
                                  <span className="truncate">{att.filename}</span>
                                  <ExternalLink size={14} className="ml-auto flex-shrink-0" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={cn("flex items-center justify-center h-full",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}>
                        {t('selectEmailToPreview')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'richText' && (
              // 富文本编辑器
              <div className="p-4 h-full flex flex-col flex-1">
                <h3 className="font-medium mb-4">{t('richTextField')}</h3>
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
            )}

            {activeTab === 'ocr' && (
              <div className="flex flex-1 h-full">
                {/* 左侧上传面板 */}
                <div className={cn("w-1/3 border-r flex flex-col",
                  isDark
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                )}>
                  <div className={cn("p-4 border-b",
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  )}>
                    <h3 className="font-medium">OCR 文档解析</h3>
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center mb-6">
                        <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-300'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className={`mt-2 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>拖拽文件到此处或点击上传</h3>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>支持 JPG、PNG、PDF 等格式</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id="file-upload-ocr"
                        onChange={(e) => {

                          if (e.target.files && e.target.files.length > 0) {
                            const newFiles = e.target.files[0];
                            setOcrFiles(newFiles as any);

                            // 为每个新上传的文件创建预览
                            if (newFiles.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                // 可以在这里添加预览逻辑
                              };
                              reader.readAsDataURL(newFiles);
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="file-upload-ocr"
                        className={`relative cursor-pointer rounded-md font-medium ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2`}
                      >
                        <span>选择文件</span>
                      </label>
                    </div>

                    {/* 已上传文件列表 */}
                    <div className="mt-4">
                      <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>已上传文件</h4>


                      {ocrFiles && <div className="space-y-2 max-h-40 overflow-y-auto">
                        <div
                          className={cn("flex items-center p-2 rounded border truncate",
                            isDark
                              ? "bg-gray-750 border-gray-700 text-gray-300"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          )}
                        >
                          <FileText size={16} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{ocrFiles?.name}</span>
                          <span className="ml-auto text-xs opacity-70">{(ocrFiles?.size / 1024).toFixed(1)}KB</span>
                        </div>
                      </div>
                      }



                      <button
                        onClick={() => {
                          setOcrFiles(null);
                          setOcrResults('');
                        }}
                        className={`
                            mt-2 w-full py-2 px-4 rounded-md font-medium
                            ${isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                          `}
                      >
                        清空
                      </button>
                    </div>
                  </div>
                </div>

                {/* 右侧预览面板 */}
                <div className={cn("w-2/3 rounded-lg border shadow-sm overflow-hidden flex flex-col",
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                )}>
                  <div className={cn("p-4 border-b",
                    isDark
                      ? "border-gray-700 bg-gray-750"
                      : "border-gray-200 bg-gray-50"
                  )}>
                    <h3 className="font-medium">预览</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {ocrFiles ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        {ocrFiles && ocrFiles.type.startsWith('image/') ? (
                          // 图片预览
                          <img 
                            src={URL.createObjectURL(ocrFiles)} 
                            alt="Preview" 
                            className="max-w-full max-h-full object-contain rounded border"
                          />
                        ) : ocrFiles.type === 'application/pdf' ? (
                          // PDF预览，使用iframe标签
                          <div className="w-full h-full">
                            <iframe 
                              src={URL.createObjectURL(ocrFiles)} 
                              width="100%" 
                              height="600px"
                              className="rounded border"
                              title="PDF预览"
                            >
                              <p className="text-center p-4">您的浏览器不支持PDF预览，请<a 
                                href={URL.createObjectURL(ocrFiles)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={cn(
                                  "px-4 py-2 rounded-md font-medium",
                                  isDark 
                                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                )}
                              >
                                点击下载
                              </a></p>
                            </iframe>
                          </div>
                        ) : (
                          // 其他文件类型的预览
                          <div className="text-center">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>无法预览此文件类型</p>
                            <p className="text-sm mt-2">{ocrFiles.name}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={cn("flex items-center justify-center h-full",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}>
                        上传文件后将在此处显示预览...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
                      className={`px-3 py-1 text-sm font-medium rounded-t ${resultViewTab === 'json'
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
                      className={`px-3 py-1 text-sm font-medium rounded-t ${resultViewTab === 'table'
                        ? (isDark
                          ? 'bg-gray-800 text-blue-400'
                          : 'bg-white text-blue-600')
                        : (isDark
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-600 hover:text-gray-800')
                        }`}
                      onClick={() => setResultViewTab('table')}
                    >
                      {t('table')}
                    </button>
                  </div>
                </div>
              )}
              <div className={cn("p-4 border-b flex justify-between items-center",
                isDark
                  ? "border-gray-700 bg-gray-750"
                  : "border-gray-200 bg-gray-50"
              )}>
                {/* <h3 className="font-medium">{t('parsedResult')}</h3> */}
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
                  <div className="overflow-auto h-full">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={isDark ? "bg-gray-750" : "bg-gray-50"}>
                        <tr>
                          {jsonResult?.result?.prices && jsonResult.result.prices.length > 0 ? (
                            // 如果存在prices数组，则使用第一个对象的键作为表头
                            Object.keys(jsonResult.result.prices[0]).map((key) => (
                              <th
                                key={key}
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))
                          ) : (
                            // 否则使用jsonResult的键作为表头
                            Object.keys(jsonResult).map((key) => (
                              <th
                                key={key}
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))
                          )}
                        </tr>
                      </thead>
                      <tbody className={cn("divide-y divide-gray-200 dark:divide-gray-700",
                        isDark ? "bg-gray-800" : "bg-white"
                      )}>
                        {jsonResult?.result?.prices && jsonResult.result.prices.length > 0 ? (
                          // 如果存在prices数组，则遍历每一项作为一行
                          jsonResult.result.prices.map((priceObj: any, rowIndex: number) => (
                            <tr key={rowIndex}>
                              {Object.values(priceObj).map((value: any, index) => (
                                <td
                                  key={index}
                                  className="px-3 py-2 whitespace-nowrap text-sm"
                                >
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          // 否则按照原来的方式显示jsonResult
                          <tr>
                            {Object.values(jsonResult).map((value: any, index) => (
                              <td
                                key={index}
                                className="px-3 py-2 whitespace-nowrap text-sm"
                              >
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </td>
                            ))}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className={cn("flex flex-col items-center justify-center h-full text-center",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}>
                  <FileJson size={48} className="mb-3 opacity-50" />
                  <p>{t('parseEmailToSeeResult')}</p>
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

export default Workbench;