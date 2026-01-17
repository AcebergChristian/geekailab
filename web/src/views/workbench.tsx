import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Cell
} from 'recharts';
import { 
  ChevronLeft, ChevronDown, Search, Filter, Download, Settings, 
  MoreHorizontal, RefreshCw, User, Bell, Menu, Grid, PieChart,
  FileText, CheckCircle2, BarChart2, LayoutDashboard, Moon, Sun,
  Mail, Eye, Send, Archive, Trash2, ExternalLink, FileJson, ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/contexts/themeContext';
import { useI18nContext } from '@/contexts/i18nContext';

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
  const [showMailList, setShowMailList] = useState<boolean>(true);
  const [jsonResult, setJsonResult] = useState<any>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5); // 每页显示5条
  

  // 使用上下文
  const { theme, toggleTheme, isDark } = useThemeContext();
  const { language, toggleLanguage, t } = useI18nContext();

  // 计算当前页面的邮件
  const currentEmails = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return emails.slice(startIndex, startIndex + pageSize);
  }, [emails, currentPage, pageSize]);
  
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
      attachments: [{id: '1', filename: 'Q4_report.xlsx', file_path: '/attachments/Q4_report.xlsx'}],
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
      attachments: [{id: '2', filename: 'order_confirmation.pdf', file_path: '/attachments/order_confirmation.pdf'}],
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
      attachments: [{id: '3', filename: 'cooperation_proposal.docx', file_path: '/attachments/cooperation_proposal.docx'}],
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
  const parseEmailContent = async () => {
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
  };

  // 导出JSON数据
  const exportJson = () => {
    if (!jsonResult) return;
    
    const dataStr = JSON.stringify(jsonResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `parsed_email_${selectedEmail?.id || 'unknown'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={isDark ? "p-6 bg-gray-900 text-gray-100" : "p-6 bg-gray-50 text-gray-900"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('workbench')}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t('emailProcessingWorkbench')}</p>
      </div>


      {/* 主工作区 */}
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
        {/* 左侧邮件列表 */}
        {showMailList && (
          <div className={cn("lg:w-1/4 flex-shrink-0 rounded-lg border shadow-sm overflow-hidden",
            isDark 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          )}>
            <div className={cn("p-4 border-b",
              isDark 
                ? "border-gray-700 bg-gray-750" 
                : "border-gray-200 bg-gray-50"
            )}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{t('inbox')}</h3>
                <div className="flex space-x-2">
                    
                    {/* 加载状态指示器 */}
                    {isLoading && (
                      <div className={cn("flex justify-center items-center py-1",
                        isDark ? "text-gray-400" : "text-gray-600"
                      )}>
                        <RefreshCw className="animate-spin mr-2" size={20} />
                        {t('loadingEmails')}
                      </div>
                    )}

                  <button 
                    onClick={() => fetchEmails()}
                    className={cn("p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700", 
                      isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}
                    title={t('refresh')}
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button 
                    onClick={() => setShowMailList(false)}
                    className={cn("p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700", 
                      isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-100px)]">
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
            <div className={cn("mb-0 p-3 border-t flex items-center justify-between",
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
        )}

        {/* 邮件列表隐藏时的按钮 */}
        {!showMailList && (
          <button
            onClick={() => setShowMailList(true)}
            className={cn("p-4 mb-4 lg:mb-0 rounded-lg border shadow-sm flex items-center justify-center",
              isDark 
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750" 
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            )}
          >
            <span>{t('showEmailList')}</span>
          </button>
        )}

        {/* 中间邮件预览区 */}
        <div className={cn("lg:w-2/4 flex-shrink-0 rounded-lg border shadow-sm overflow-hidden flex flex-col",
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        )}>
          <div className={cn("p-4 border-b flex justify-between items-center",
            isDark 
              ? "border-gray-700 bg-gray-750" 
              : "border-gray-200 bg-gray-50"
          )}>
            <h3 className="font-medium">{t('emailPreview')}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={parseEmailContent}
                disabled={isParsing}
                className={cn("px-3 py-1.5 text-sm rounded-md flex items-center",
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
              <button className={cn("p-2 rounded-md",
                isDark 
                  ? "hover:bg-gray-700 text-gray-400" 
                  : "hover:bg-gray-200 text-gray-600"
              )}>
                <MoreHorizontal size={16} />
              </button>
            </div>
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

        {/* 右侧JSON结果区 */}
<div className={cn("lg:w-1/4 flex-shrink-0 rounded-lg border shadow-sm overflow-hidden flex flex-col",
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
            <div className="flex space-x-2">
              {jsonResult && !isParsing && (
                <button 
                  onClick={exportJson}
                  className={cn("p-2 rounded-md",
                    isDark 
                      ? "hover:bg-gray-700 text-gray-400" 
                      : "hover:bg-gray-200 text-gray-600"
                  )}
                  title={t('export')}
                >
                  <Download size={16} />
                </button>
              )}
              <button className={cn("p-2 rounded-md",
                isDark 
                  ? "hover:bg-gray-700 text-gray-400" 
                  : "hover:bg-gray-200 text-gray-600"
              )}>
                <MoreHorizontal size={16} />
              </button>
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
              <pre className={cn("text-xs whitespace-pre-wrap break-all max-h-full overflow-auto",
                isDark ? "text-green-400" : "text-green-700"
              )}>
                {JSON.stringify(jsonResult, null, 2)}
              </pre>
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
  );
};

export default Workbench;