#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
邮件和附件查询API接口
"""

from openai import AzureOpenAI
from config import LLM_CONFIG

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
# import sqlite3
from typing import List, Optional
import os
import time


from utils.html_parser import HtmlTableParser


import pysqlite3
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

# 现在可以使用 sqlite3
import sqlite3
conn = sqlite3.connect(':memory:')


app = FastAPI(title="邮件和附件查询API")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. API 路由必须放在 Mount 之前
@app.get("/api/health")
def health_check():
    return {"status": "ok"}



# 2. 静态文件配置
# 首先定义所有API路由，然后再挂载静态文件

# 检查多个可能的前端构建输出路径
possible_paths = [
    os.path.join(os.path.dirname(__file__), "dist", "static")
]

frontend_dist_path = None
for path in possible_paths:
    if os.path.exists(path) and os.path.exists(os.path.join(path, "index.html")):
        frontend_dist_path = path
        print(f"找到前端构建目录: {path}")
        break

# 定义SPA静态文件类
class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        # 如果是API请求，返回404让FastAPI处理
        if path.startswith('api/'):
            from starlette.responses import Response
            return Response(status_code=404)
        
        try:
            response = await super().get_response(path, scope)
            # 如果请求的文件不存在 (404) 或者是HTML文档请求，且不是API请求，则返回 index.html
            if response.status_code == 404 or path.find('.') == -1:  # 没有扩展名的路径通常表示前端路由
                # 检查是否为页面导航请求（而不是资源文件请求）
                headers = scope.get('headers', [])
                accept_header = ''
                for header_name, header_value in headers:
                    if header_name.decode('utf-8').lower() == 'accept':
                        accept_header = header_value.decode('utf-8')
                        break
                
                # 如果接受HTML响应或者路径没有文件扩展名，则返回index.html
                if 'text/html' in accept_header or path.find('.') == -1:
                    if path != '/' and not path.startswith('api/'):
                        if frontend_dist_path:
                            return FileResponse(os.path.join(frontend_dist_path, "index.html"))
            
            return response
        except:
            # 出现异常时也返回 index.html
            if frontend_dist_path:
                return FileResponse(os.path.join(frontend_dist_path, "index.html"))
            else:
                from starlette.responses import Response
                return Response(status_code=404)









def main_parse(html_content):

    """
    主运行方法 - 邮件运价解析系统
    处理邮件拆楼、表格解析、聚类和LLM处理
    """
    import json
    import os
    import time

    from config import PATH_CONFIG, LOGGING_CONFIG
    from utils.table_classifier import TableClassifier
    from core.executor import Executor
    from utils.mail_processor import MailProcessor


    from utils.cluster import process_html_to_tables, llm_process

    import logging

    # 配置日志
    logging.basicConfig(**LOGGING_CONFIG)
    logger = logging.getLogger(__name__)
    
    logger.info("开始处理邮件数据...")
    
    # 初始化处理器
    mail_processor = MailProcessor()
    table_classifier = TableClassifier()
    executor = Executor()
    
    try:
        start_time = time.time()
        # 1. 拆楼处理 - 获取第一层邮件内容
        cleaned_html = mail_processor.truncate_html_if_needed(html_content)
        
        # 2. HTML解析 - 提取并打平表格为行列表（使用utils.cluster.py中的方法）
        parsed_tables = process_html_to_tables(cleaned_html)
        
        # 3. 使用LLM进行聚类处理
        llm_process_result = json.loads(llm_process(parsed_tables)).get('tables', '')
        # with open('llm_process_result_MSC.json', 'w', encoding='utf-8') as f:
        #     json.dump(llm_process_result, f, ensure_ascii=False, indent=2)

        # 4. 表格分类 - 识别价格、附加费、备注表格
        classified_sections = table_classifier.classify_tables(llm_process_result)
        print('classified_sections==========>', classified_sections)
        
        # 5. 执行LLM处理 - 直接批量处理表格数据，每批50行
        result = executor.execute_without_cartesian_check(classified_sections)

        # 6. 对最终结果进行笛卡尔积展开
        expanded_result = {
            "prices": [],
            "surcharge_items": [],
            "other_remarks": []
        }
        
        # 展开价格数据
        for price_item in result.get("prices", []):
            # 检查是否包含多值字段，如POL: 'A/B/C' 和 POD: 'D/E'
            expanded_prices = executor.expand_item_cartesian(price_item)
            expanded_result["prices"].extend(expanded_prices)
        
        # 展开附加费数据
        for surcharge_item in result.get("surcharge_items", []):
            expanded_surcharge = executor.expand_item_cartesian(surcharge_item)
            expanded_result["surcharge_items"].extend(expanded_surcharge)
        
        # 展开备注数据
        for remark_item in result.get("other_remarks", []):
            expanded_remarks = executor.expand_item_cartesian(remark_item)
            expanded_result["other_remarks"].extend(expanded_remarks)
        
        result = expanded_result
        
        end_time = time.time()
        return result, end_time - start_time
        
    except Exception as e:
        logger.error(f"处理邮件时出错: {e}")
        raise e


# 数据库文件路径
DB_PATH = 'mail_sync.db'

class EmailAttachmentModel:
    """邮件和附件数据模型"""
    def __init__(self, email_id, subject, sender, receiver, date, content, html_content, 
                 attachment_id, filename, file_path, created_time):
        self.email_id = email_id
        self.subject = subject
        self.sender = sender
        self.receiver = receiver
        self.date = date
        self.content = content
        self.html_content = html_content
        self.attachment_id = attachment_id
        self.filename = filename
        self.file_path = file_path
        self.created_time = created_time


@app.get("/api/emails-with-attachments")
def get_emails_with_attachments(
    skip: int = 0, 
    limit: int = 5,
    subject_keyword: Optional[str] = None,
    sender_keyword: Optional[str] = None
):
    """
    查询邮件及附件信息
    
    参数:
    - skip: 跳过的记录数，默认为0
    - limit: 返回的最大记录数，默认为5
    - subject_keyword: 邮件主题关键词过滤
    - sender_keyword: 发件人关键词过滤
    """
    # 检查数据库是否存在
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail=f"数据库文件 {DB_PATH} 不存在")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 首先获取总记录数（用于分页）
        count_query = """
        SELECT COUNT(DISTINCT e.email_id)
        FROM emails e
        LEFT JOIN attachments a ON e.email_id = a.email_id
        WHERE e.is_del = 0
        """
        
        count_params = []
        
        # 添加过滤条件到计数查询
        if subject_keyword:
            count_query += " AND e.subject LIKE ?"
            count_params.append(f"%{subject_keyword}%")
            
        if sender_keyword:
            count_query += " AND e.sender LIKE ?"
            count_params.append(f"%{sender_keyword}%")
        
        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()[0]
        
        # 构建查询语句
        base_query = """
        SELECT 
            e.email_id,
            e.subject,
            e.sender,
            e.receiver,
            e.date,
            e.content,
            e.html_content,
            e.created_time,
            a.id as attachment_id,
            a.filename,
            a.file_path
        FROM emails e
        LEFT JOIN attachments a ON e.email_id = a.email_id
        WHERE e.is_del = 0
        """
        
        params = []
        
        # 添加过滤条件
        if subject_keyword:
            base_query += " AND e.subject LIKE ?"
            params.append(f"%{subject_keyword}%")
            
        if sender_keyword:
            base_query += " AND e.sender LIKE ?"
            params.append(f"%{sender_keyword}%")
        
        base_query += " ORDER BY e.created_time DESC LIMIT ? OFFSET ?"
        params.extend([limit, skip])
        
        cursor.execute(base_query, params)
        rows = cursor.fetchall()
        
        # 组织返回数据
        result = {}
        
        for row in rows:
            email_id = row[0]
            
            # 如果邮件ID不在结果字典中，则初始化
            if email_id not in result:
                result[email_id] = {
                    "email_id": email_id,
                    "subject": row[1],
                    "sender": row[2],
                    "receiver": row[3],
                    "date": row[4],
                    "content": row[5],
                    "html_content": row[6],
                    "created_time": row[7],
                    "attachments": []
                }
            
            # 如果存在附件，则添加到附件列表
            if row[8] is not None:  # attachment_id 不为空
                result[email_id]["attachments"].append({
                    "id": row[8],
                    "filename": row[9],
                    "file_path": row[10]
                })
        
        # 将字典转换为列表
        final_result = list(result.values())
        
        conn.close()
        
        # 返回结果和总记录数
        return {
            "data": final_result,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"数据库错误: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询过程中发生错误: {str(e)}")


@app.get("/api/emails/{email_id}", response_model=dict)
def get_email_by_id(email_id: str):
    """
    根据邮件ID查询特定邮件及其附件信息
    """
    # 检查数据库是否存在
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail=f"数据库文件 {DB_PATH} 不存在")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 查询邮件信息
        email_query = """
        SELECT 
            e.email_id,
            e.subject,
            e.sender,
            e.receiver,
            e.date,
            e.content,
            e.html_content,
            e.created_time
        FROM emails e
        WHERE e.email_id = ? AND e.is_del = 0
        """
        
        cursor.execute(email_query, (email_id,))
        email_row = cursor.fetchone()
        
        if not email_row:
            raise HTTPException(status_code=404, detail=f"未找到邮件ID为 {email_id} 的邮件")
        
        # 查询该邮件的附件信息
        attachment_query = """
        SELECT 
            a.id,
            a.filename,
            a.file_path,
            a.created_time
        FROM attachments a
        WHERE a.email_id = ? AND a.is_del = 0
        """
        
        cursor.execute(attachment_query, (email_id,))
        attachment_rows = cursor.fetchall()
        
        # 组织返回数据
        result = {
            "email_id": email_row[0],
            "subject": email_row[1],
            "sender": email_row[2],
            "receiver": email_row[3],
            "date": email_row[4],
            "content": email_row[5],
            "html_content": email_row[6],
            "created_time": email_row[7],
            "attachments": [
                {
                    "id": attachment[0],
                    "filename": attachment[1],
                    "file_path": attachment[2],
                    "created_time": attachment[3]
                }
                for attachment in attachment_rows
            ]
        }
        
        conn.close()
        
        return result
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"数据库错误: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询过程中发生错误: {str(e)}")


@app.get("/api/attachments-by-email/{email_id}", response_model=List[dict])
def get_attachments_by_email_id(email_id: str):
    """
    根据邮件ID查询其所有附件信息
    """
    # 检查数据库是否存在
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail=f"数据库文件 {DB_PATH} 不存在")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 查询附件信息
        query = """
        SELECT 
            a.id,
            a.email_id,
            a.filename,
            a.file_path,
            a.created_time
        FROM attachments a
        WHERE a.email_id = ? AND a.is_del = 0
        """
        
        cursor.execute(query, (email_id,))
        rows = cursor.fetchall()
        
        result = [
            {
                "id": row[0],
                "email_id": row[1],
                "filename": row[2],
                "file_path": row[3],
                "created_time": row[4]
            }
            for row in rows
        ]
        
        conn.close()
        
        return result
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"数据库错误: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询过程中发生错误: {str(e)}")


@app.get("/api/stats", response_model=dict)
def get_database_stats():
    """
    获取数据库统计信息
    """
    # 检查数据库是否存在
    if not os.path.exists(DB_PATH):
        raise HTTPException(status_code=404, detail=f"数据库文件 {DB_PATH} 不存在")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 查询邮件总数
        cursor.execute("SELECT COUNT(*) FROM emails WHERE is_del = 0")
        total_emails = cursor.fetchone()[0]
        
        # 查询附件总数
        cursor.execute("SELECT COUNT(*) FROM attachments WHERE is_del = 0")
        total_attachments = cursor.fetchone()[0]
        
        # 查询最近的邮件
        cursor.execute("SELECT created_time FROM emails WHERE is_del = 0 ORDER BY created_time DESC LIMIT 1")
        latest_email_time = cursor.fetchone()
        latest_time = latest_email_time[0] if latest_email_time else None
        
        conn.close()
        
        return {
            "total_emails": total_emails,
            "total_attachments": total_attachments,
            "latest_email_time": latest_time
        }
        
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"数据库错误: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询过程中发生错误: {str(e)}")


# 解析html_content
@app.post("/api/parse-email-content")
async def parse_email_content_api(request: dict):
    """
    解析邮件内容
    """
    try:
        html_content = request.get("html_content", "")
        if not html_content:
            raise HTTPException(status_code=400, detail="html_content is required")
        
        # 调用main_parse函数进行解析
        result, processing_time = main_parse(html_content)
        
        return {
            "result": result,
            "processing_time": processing_time,
            "success": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"解析过程中发生错误: {str(e)}")




# 接口 获取前端formData 传过来的文件 
@app.route('/api/ocr', methods=['POST'])
def ocr_upload():
    """
    处理前端上传的文件，使用OCR解析后获取HTML内容，然后传递给main_parse
    """
    try:
        # 检查是否有文件被上传
        if 'file' not in request.files:
            return jsonify({'error': '没有文件被上传'}), 400
        
        file = request.files['file']
        
        # 检查文件名是否为空
        if file.filename == '':
            return jsonify({'error': '文件名为空'}), 400
        
        # 检查文件类型
        allowed_extensions = {'pdf', 'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp'}
        if '.' not in file.filename or \
           file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({'error': f'不支持的文件格式，支持的格式: {allowed_extensions}'}), 400
        
        # 保存上传的文件到临时位置
        import tempfile
        import os
        temp_dir = tempfile.mkdtemp()
        temp_file_path = os.path.join(temp_dir, file.filename)
        file.save(temp_file_path)
        
        try:
            # 调用OCR解析方法获取HTML内容
            from utils.ocr import hehe_anylze
            result = hehe_anylze(temp_file_path)
            
            # 从返回的结果中提取HTML内容
            # 假设返回结果中包含HTML内容的字段名为'html_content'或其他可能的字段名
            html_content = (
                result.get("result", {}).get("html_content", "") or
                result.get("result", {}).get("html", "") or
                result.get("result", {}).get("content", "") or
                result.get("data", {}).get("html_content", "") or
                result.get("data", {}).get("html", "") or
                result.get("data", {}).get("content", "") or
                ""
            )
            
            if not html_content:
                return jsonify({'error': 'OCR解析未返回HTML内容'}), 500
            
            # 调用main_parse函数处理HTML内容
            from app import main_parse  # 导入main_parse函数
            parsed_result = main_parse(html_content)
            
            # 返回解析结果
            return jsonify({
                'success': True,
                'html_content': html_content,
                'parsed_result': parsed_result
            })
            
        finally:
            # 清理临时文件
            import shutil
            shutil.rmtree(temp_dir)
    
    except Exception as e:
        print(f"OCR处理失败: {str(e)}")
        return jsonify({'error': f'OCR处理失败: {str(e)}'}), 500







################## 下方为 saijia 的相关接口 ##################


def saijia_parse_with_llm(clean_html: str) -> dict:
    """
    使用大模型解析HTML内容
    """
    import openai
    import json
    
    # 构建提示词
    prompt = f"""
角色定义
你是一个专业的国际物流邮件解析模型，擅长从复杂英文邮件正文与富文本表格中提取结构化字段。
解析目标
请从以下邮件正文中
{clean_html}
提取指定字段，输出为 JSON。所有字段均必须来自邮件正文或表格，不要编造、不要推断。
需要提取的字段
{{
  "POL": "",
  "POD": "",
  "transport_mode": "",
  "orders": [
    {{
      "order_no": "",
      "delivery_note": "",
      "store_code_or_whs_code": "",
      "brand": "",
      "country": ""
    }}
  ]
}}
字段规则（非常重要）
POL / POD
从正文中Booking后面的信息提取 POL、POD 
提取到什么就输出什么
transport_mode
只允许以下枚举值之一：
SEA FCL
SEA LCL
AIR
若正文或表格中出现 SEA FCL、SEA-FCL、SEA FCL 8*40HQ，统一输出 SEA FCL
orders（多行表格数据）
表格中 每一行有效订单 = orders 中的一个对象
必须逐行提取，不可合并、不遗漏
order_no
来自表格中的 ORDER NO. / ORDER Nº / ORDER NUMBER
delivery_note
来自表格中的 DELIVERY NOTE 列
原样提取文本（如 requesting items by 28th Jan）
store_code_or_whs_code
优先提取 STORE CODE 或 WHS CODE
若字段合并显示（如 STORE CODE/WHS CODE），直接提取该列值
brand
来自表格中的 BRAND
country
来自表格中的 COUNTRY
输出要求
仅输出 JSON
不要解释、不加说明、不输出原文
若某字段在单行中缺失，填空字符串 ""
表格有多少行，就生成多少条 orders
"""

    try:
        # 调用大模型API
        client = AzureOpenAI(
        api_key=LLM_CONFIG['api_key'],
        azure_endpoint=LLM_CONFIG['azure_endpoint'],
        api_version=LLM_CONFIG['api_version']
    )
    
        response = client.chat.completions.create(
            model=LLM_CONFIG['model'],
            messages=[
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0,
            timeout=60
        )
        
        res = json.loads(response.choices[0].message.content)
        return res if res else ""


    except Exception as e:
        print(f"LLM解析出错: {str(e)}")
        # 出错时返回默认结构
        return {
            "POL": "",
            "POD": "",
            "transport_mode": "",
            "orders": []
        }

# 清理html
def clean_html_content(html_content: str) -> str:
    """
    清理HTML内容，去除样式属性等，只保留基本标签结构
    """
    from bs4 import BeautifulSoup
    
    # 解析HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 移除所有style属性
    for tag in soup.find_all():
        if tag.attrs:
            # 移除style属性
            if 'style' in tag.attrs:
                del tag['style']
            # 移除其他非必要的属性，保留基本标签结构
            attrs_to_keep = []
            for attr in tag.attrs:
                # 只保留一些基本属性如href, src等
                if attr.lower() in ['href', 'src', 'alt', 'title', 'target', 'rel', 'id', 'class']:
                    attrs_to_keep.append(attr)
            
            # 删除不需要的属性
            for attr in list(tag.attrs.keys()):
                if attr not in attrs_to_keep:
                    del tag[attr]
    
    return str(soup)

















######### 解析saijia邮件正文接口content #########
@app.post("/api/parse-saijia-content")
async def parse_rich_content_api(request: dict):
    """
    解析富文本内容
    """
    try:
        time1 = time.time()
        html_content = request.get("html_content", "")
        if not html_content:
            raise HTTPException(status_code=400, detail="html_content is required")
        
        # 1. clean html
        cleanhtmlcontent = clean_html_content(html_content)

        # 2. 使用大模型进行解析
        result = saijia_parse_with_llm(cleanhtmlcontent)
        
        return {
            "result": result,
            "processing_time": time.time() - time1,
            "success": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"解析过程中发生错误: {str(e)}")




# 挂载静态目录 - 放在最后，确保API路由已经注册
if frontend_dist_path:
    app.mount("/", SPAStaticFiles(directory=frontend_dist_path, html=True), name="frontend")
else:
    print(f"Error: 找不到包含 index.html 的前端构建目录")
    # 如果找不到前端文件，至少提供API服务
    print("仅启动API服务，无前端界面")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)