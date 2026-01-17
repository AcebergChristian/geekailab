# 整个html 洗干净扔进去

# --------- sys ---------
import json
import time
import os
import re
import sys
from pathlib import Path
# 添加项目根目录到系统路径，以便导入config
sys.path.insert(0, str(Path(__file__).parent.parent))

# --------- pip ---------
from openai import AzureOpenAI

# --------- user ---------
from utils.html_parser import HtmlTableParser
from config import LLM_CONFIG


def sanitize_filename(filename):
    """
    清理文件名，移除或替换非法字符
    """
    # 替换可能导致问题的字符
    illegal_chars = '<>:/\\|*?\"'
    for char in illegal_chars:
        filename = filename.replace(char, '_')
    
    # 限制文件名长度
    max_length = 200  # 限制文件名长度，避免过长
    if len(filename) > max_length:
        filename = filename[:max_length]
    
    return filename




# 读文件，拆楼，只保留第一层
def loop_mail_data():
    """
    读取 mailData.json的数据，拿每一项的html_content，
    如果有多层楼（发件人后面有"时间"字样的），就只拿第一个楼层的html数据
    """
    # 读取 mailData.json 文件
    with open('mailData.json', 'r', encoding='utf-8') as f:
        mail_data = json.load(f)
    
    subjects = [item.get('subject', '') for item in mail_data]
    all_html_content = []
    
    for mail_item in mail_data:
        html_content = mail_item.get('html_content', '')
        
        # 查找所有"发件人...时间"的匹配项
        matches = list(re.finditer(r'发件人[\s\S]{0,500}?(?:时间|日期)', html_content))
        
        # 如果有2个或更多匹配项，说明有盖楼，只取第一个楼层
        if len(matches) >= 2:
            # 取第一个匹配项之前的内容 + 第一个匹配项的内容，作为第一个楼层
            first_floor_end = matches[1].start()  # 第二个匹配项的开始位置
            first_floor = html_content[:first_floor_end]
        else:
            # 如果只有1个或没有匹配项，说明没有盖楼，取全部内容
            first_floor = html_content
        
        all_html_content.append(first_floor)
    
    return subjects, all_html_content



# 处理每个进来的html字符串
def process_html_to_tables(html_content):
    """
    处理HTML内容，提取清洗后的表格数据
    
    Args:
        html_content (str): 原始HTML内容
        
    Returns:
        list: 包含所有表格的列表
    """
    # 如果HTML内容为空，直接返回空列表
    if not html_content or html_content.strip() == '':
        print("HTML内容为空")
        return []
    
    # 创建解析器实例
    parser = HtmlTableParser(html_content)
    
    # 清洗HTML并解析
    cleaned_html = parser.clean_html()
    
    # 如果清洗后的内容为空，返回空列表
    if not cleaned_html or cleaned_html.strip() == '':
        print("清洗后的HTML内容为空")
        return []
    
    # 提取所有表格
    tables = parser.extract_tables()
    
    print(f"找到 {len(tables)} 个表格")
    
    # 解析表格单元格（处理rowspan和colspan）
    parsed_tables = []
    for i, table in enumerate(tables):
        table_data = parser.parse_table_cells(table["html"])
        parsed_tables.append(table_data) # [[], [], ...]
    
    return parsed_tables


def save_tables_to_json(tables, output_file="parsed_tables.json"):
    """
    将表格数据保存为JSON文件
    
    Args:
        tables (list): 表格数据列表
        output_file (str): 输出文件名
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(tables, f, ensure_ascii=False, indent=2)








# ----------- llm ------------
def llm_process(tables):
    """
    调用LLM处理上下文
    
    Args:
        context: 输入上下文
        
    Returns:
        str: LLM返回的结果
    """
    prompt = f"""
        你是一个专业的货代运价表格处理专家，请分析并处理以下数据内容。

# 输入数据：海运费表格，包含起运港(POL)、目的港(POD)、箱型(20GP/40GP等)、运价等信息（只处理海运费主表，忽略附加费、总价计算等其他结构）
# 目的：此次大模型主要处理表格格式化 与 数据的归一化标准化


## 表格聚类与分割

### 1. 多表格识别
- **依据**：
  - 表头风格突变（关键词变化）
  - 数据主题变化（如从美线切换到欧线）
  - 出现空行分隔
- **处理**：识别独立的表格边界，分别聚类

### 2. 聚类规则
1. **按表头聚类**：相同/相似表头结构的数据行归为一组
2. **按数据连续性**：连续的数据行，即使表头不明显，也视为同一表格
3. **按语义主题**：相同航线或港口组合的数据归为一组


## 表头识别与处理

### 1. 表头类型识别

#### A. 单行表头，直接作为表头
- 示例：['POL', 'POD', "20'GP", "40'GP", '航程', '生效日期', '截止日期']

#### B. 多行复合表头（常见情况），将空值单元格与下方有值单元格合并，形成完整表头
- 示例：
    行1：['', '', 'C', 'D', 'E', 'F', '', '', '']
    行2：['A', 'B', '', '', '', '', "20'GP", "40'GP", "40'HC"]
- 合并后：['A', 'B', 'C', 'D', 'E', 'F', "20'GP", "40'GP", "40'HC", '40NOR', '40HR']

#### C. 无表头行或者缺少表头字段时，根据数据内容和列位置内容推断表头
- 示例：
    数据：['A', 'B', '1200', '1300', '1400', '1500']
- 表头：['pol', 'pod', "20'GP", "40'GP", "40'HC", '40NOR']
  数据：['A', 'B', '1200', '1300', '1400', '1500']


## 数据归一化与标准化

### 1. 多值处理
- **港口名称**：
  - `上海,宁波,青岛` → `上海/宁波/青岛`
  - `上海/宁波` → `上海/宁波`（保持不变）
  - `上海 宁波` → `上海/宁波`
  - **保持完整**：`上海港/宁波港/青岛港`

- **箱型/其他**：
  - `20GP,40GP` → `20GP/40GP`
  - 注意：保留原始单位符号，如"20'GP"

### 2. 空值处理
- **全空行**：删除所有单元格都为空的整行
- **部分空值**：保留行，空单元格保持为空或标记为""
- **重复相邻行**：删除完全相同的相邻数据行

### 3. 日期格式化
- 统一日期格式：`mm/dd/yy` 或 `yyyy-mm-dd`
- 日期范围：`01/01/24-01/31/24` 保持原格式或拆分为两列


## 输出要求

### 1. 结构化输出格式
```json
{{
  "tables": [
    {{
      "header": ["POL", "POD", "20GP", "40GP", "有效期"],
      "data": [
        ["上海", "洛杉矶", "1500", "2800", "01/01/24-01/31/24"],
        ["宁波", "长滩", "1450", "2750", "01/01/24-01/31/24"]
      ],
      "data_type": "price"  # price | surcharge | remark
    }},
    {{
      "header": ["起运港", "目的港", "20GP", "航程"],
      "data": [
        ["深圳", "汉堡", "1200", "35"],
        ["广州", "鹿特丹", "1250", "36"]
      ],
      "data_type": "price"  # price | surcharge | remark
    }},
  ]
}}
2. 特殊情况处理
无表头表格：根据数据推断最合理的表头

表头不完整：补充缺失的列名（如"列1"、"列2"），并添加说明

数据错位：尝试对齐列，必要时标记为异常

3. 完整性检查
每个表格必须包含header和data两部分

header应为数组，data为二维数组

确保列数一致（header长度与每行data长度相同）

输入数据
{tables}

请按照以上规则处理数据，输出结构化的表格集合。
确保聚类准确，表头处理合理，数据清洗规范。
    """



    client = AzureOpenAI(
        api_key=LLM_CONFIG['api_key'],
        azure_endpoint=LLM_CONFIG['azure_endpoint'],
        api_version=LLM_CONFIG['api_version']
    )
    
    # 设置超时和重试
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=LLM_CONFIG['model'],
                messages=[
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0,
                timeout=60
            )
            
            res = response.choices[0].message.content
            return res if res else ""
            
        except Exception as e:
            print(f"LLM调用失败，第 {attempt + 1} 次尝试: {e}")
            if attempt == max_retries - 1:  # 如果是最后一次尝试
                print("LLM调用失败，返回空结果")
                return "{}"  # 返回一个空的JSON对象
    
    return "{}"



# def main(subject, tables):
#     """主函数"""
    
    
#     # 执行LLM处理
#     result = llm_process(tables)
    
#     output_dir = 'outputs'
#     if not os.path.exists(output_dir):
#         os.makedirs(output_dir)
    

#     re_subject = sanitize_filename(subject)
#     # 生成带时间戳的文件名
#     output_filename = f"result-{re_subject}.json"
#     output_path = os.path.join(output_dir, output_filename)
    
#     with open(output_path, 'w', encoding='utf-8') as f:
#         f.write(result)
#     print(f"处理完成，结果已保存到 {output_path}")


