from bs4 import BeautifulSoup
import re
from typing import List, Dict, Any
from utils.table_classifier import classify_table  # 导入分类器
from config import HEADER_INDICATORS, HEADER_KEYWORDS


class HtmlTableParser:
    """HTML表格解析器"""
    
    def __init__(self, html: str):
        self.raw_html = html
        self.html = ""
        self.tables = []
        self.segments = []

    # ======================================================
    # Step 1：清洗 HTML
    # ======================================================
    def clean_html(self) -> str:
        """清洗HTML内容"""
        # 首先检查是否需要截断HTML
        self.raw_html = self._truncate_html_if_needed(self.raw_html)
        
        soup = BeautifulSoup(self.raw_html, "html.parser")

        # 删除无关标签
        for tag in soup(["script", "style", "meta", "link"]):
            tag.decompose()

        # 去掉多余空白
        self.html = str(soup).replace('<br/>', '/').replace('\r\n', ' ').replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
        self.html = re.sub(r'\s+', ' ', self.html).strip()

        return self.html



    def _truncate_html_if_needed(self, html: str) -> str:
        """
        通过邮件头特征判断盖楼：
        - 发件人行包含邮箱 <...@...>
        - 第二层楼出现第二个类似的发件人行就截断
        """

        # 匹配 '发件人' 后面跟 <邮箱> 的模式
        header_patterns = [
            r'(?:发件人|From|Sender|from)[\s\S]{0,500}?(?:时间|Date|日期|发送时间|发送日期|time)',
            r'(?:From|发件人|Sender)[\s\S]{0,500}?(?:Date|时间|日期|发送时间|发送日期|time)',
            r'(?:发件人|From|Sender)[\s\S]{0,500}?(?:收件人|To|收信人)',
            r'(?:From|发件人|Sender)[\s\S]{0,500}?(?:主题|Subject|subject)',
            r'(?:发件人|From|Sender)[\s\S]{0,500}?(?:邮箱|email|<.*@.*>)',
            r'(?:发件人|From|Sender)[\s\S]{0,500}?(?:\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})',  # 日期格式
        ]

        matches = []
        for pattern in header_patterns:
            pattern_matches = list(re.finditer(pattern, html))
            matches.extend(pattern_matches)
        
        # 按位置排序并去重
        matches = sorted(matches, key=lambda x: x.start())
        
        # 去重：保留位置相近的匹配中的第一个
        unique_matches = []
        last_end = -1
        for match in matches:
            if match.start() > last_end:  # 避免重叠匹配
                unique_matches.append(match)
                last_end = match.end()
        
        # 只有 0 或 1 个完整邮件头，不截断
        if len(unique_matches) <= 1:
            return html

        # 第一层楼从第一个匹配开始
        first_start = unique_matches[0].start()

        # 截断点为第二个匹配开始
        second_start = unique_matches[1].start()

        return html[first_start:second_start]


    # 判断是否为字段行
    def _is_header_row(self, row: List[str]) -> bool:
        """
        判断一行是否为表头行
        
        Args:
            row: 表格行数据
            
        Returns:
            bool: 是否为表头行
        """
        # 如果行为空或只有空字符串，则不是表头
        if not row or all(not cell.strip() for cell in row):
            return False
        
        # 统计非空单元格数量
        non_empty_cells = [cell for cell in row if cell.strip()]
        
        # 如果非空单元格很少，可能是表头
        if len(non_empty_cells) <= 2:
            return True
        
        # 检查是否包含典型的表头关键词
        header_keywords = HEADER_KEYWORDS
        header_text = ' '.join(non_empty_cells).lower()
        
        # 如果包含表头关键词，则认为是表头
        for keyword in header_keywords:
            if keyword in header_text:
                return True
        
        # 检查是否大部分单元格都是简短的文字（通常是表头特征）
        short_text_cells = [cell for cell in non_empty_cells if len(cell.strip()) <= 15]
        if len(short_text_cells) / len(non_empty_cells) >= 0.7:
            return True
        
        # 检查是否包含常见的表头标识符
        header_indicators = HEADER_INDICATORS
        for indicator in header_indicators:
            if indicator in header_text.upper():
                return True
        
        return False




    # ======================================================
    # Step 2：提取所有 table 基本信息
    # ======================================================
    def extract_tables(self) -> List[Dict]:
        """提取所有表格基本信息"""
        table_pattern = r"<table[^>]*>.*?</table>"
        table_htmls = re.findall(table_pattern, self.html, re.DOTALL | re.IGNORECASE)

        tables = []
        positions = []  # 记录每个表格在HTML中的位置
        
        for idx, table_html in enumerate(table_htmls):
            start_pos = self.html.find(table_html)
            end_pos = start_pos + len(table_html)
            
            soup = BeautifulSoup(table_html, "html.parser")
            tbody = soup.find("tbody")
            tr_count = len(tbody.find_all("tr")) if tbody else 0

            tables.append({
                "index": idx,
                "html": table_html,
                "tr_count": tr_count,
                "is_single_row": tr_count == 1,
                "start_pos": start_pos,
                "end_pos": end_pos
            })
            
            positions.append((start_pos, end_pos))

        self.tables = tables
        return tables

    # ======================================================
    # Step 3：解析非表格内容和表格内容为统一列表
    # ======================================================
    def parse_to_section_list(self) -> List[Dict]:
        """将HTML内容解析为统一的段落列表，包含文本和表格"""
        # 提取所有表格信息
        self.extract_tables()
        
        # 获取所有内容块（文本和表格）的位置信息
        content_blocks = []
        
        # 添加文本块
        last_end = 0
        for table in self.tables:
            start_pos = table["start_pos"]
            end_pos = table["end_pos"]
            
            # 添加表格前面的文本内容
            if start_pos > last_end:
                text_content = self.html[last_end:start_pos]
                if text_content.strip():
                    # 将文本按HTML结构分割
                    blocks = self._split_text_by_html_structure(text_content)
                    for block in blocks:
                        content_blocks.append({
                            "type": "text",
                            "content": block,
                            "position": (last_end, start_pos)
                        })
            
            # 添加表格内容
            content_blocks.append({
                "type": "table",
                "table_info": table,
                "position": (start_pos, end_pos)
            })
            
            last_end = end_pos
        
        # 添加最后的文本内容
        if last_end < len(self.html):
            text_content = self.html[last_end:]
            if text_content.strip():
                # 将文本按HTML结构分割
                blocks = self._split_text_by_html_structure(text_content)
                for block in blocks:
                    content_blocks.append({
                        "type": "text",
                        "content": block,
                        "position": (last_end, len(self.html))
                    })
        
        # 按位置排序
        content_blocks.sort(key=lambda x: x["position"][0])
        
        # 去重处理
        content_blocks = self._remove_duplicate_blocks(content_blocks)
        
        # 构建最终结果
        result = []
        
        for block in content_blocks:
            if block["type"] == "text":
                # 文本块
                content_text = self._extract_text_from_html(block["content"])
                # 过滤掉空内容或无意义内容
                if self._is_meaningful_content(content_text):
                    result.append({
                        "section_type": "text",
                        "table_type": "",  # 文本块此项为空
                        "upcontent": "",  # 表格上方内容
                        "content": content_text,  # 核心内容在此
                        "bottom_content": "",  # 表格下方内容
                        "cols": [],  # 文本块此项为空数组
                        "rows": []  # 文本块此项为空数组
                    })
            else:
                # 表格块
                table_info = block["table_info"]
                data = self.parse_table_cells(table_info["html"])
                
                if not data:
                    continue
                
                # 根据表头行分割表格数据
                sections = self._split_table_by_headers(data)
                print('sections===========>>>>>>', sections)
                
                # 为每个section创建一个表格对象
                for i, section in enumerate(sections):
                    table_obj = {
                        "section_type": "table",
                        "table_type": "",  # 稍后填充
                        "upcontent": "",  # 表格上方内容
                        "content": "",  # 文本块的内容，表格块通常为空
                        "bottom_content": "",  # 表格下方内容
                        "cols": section["headers"],  # 表头行
                        "rows": section["data"],  # 数据行
                        "table_id": f"table_{table_info['index']}_{i}"  # 添加table_id
                    }
                    
                    # 对表格进行分类
                    table_type = classify_table({
                        "col": table_obj["cols"],
                        "data": table_obj["rows"]
                    })
                    table_obj["table_type"] = table_type.value  # 添加分类信息
                    
                    result.append(table_obj)
        
        return result


    
    def _split_table_by_headers(self, rows: List[List[str]]) -> List[Dict]:
        """
        根据表头行分割表格数据
        
        Args:
            rows: 表格的所有行
            
        Returns:
            List[Dict]: 包含headers和data的section列表
        """
        if not rows:
            return []
        
        sections = []
        current_headers = []
        current_data = []
        
        for row in rows:
            if self._is_header_row(row):
                # 如果当前已经有表头和数据，保存为一个section
                if current_headers or current_data:
                    sections.append({
                        "headers": current_headers,
                        "data": current_data
                    })
                # 开始新的section
                current_headers = [row]  # 新的表头行
                current_data = []  # 重置数据行
            else:
                # 添加数据行到当前section
                current_data.append(row)
        
        # 保存最后一个section
        if current_headers or current_data:
            sections.append({
                "headers": current_headers,
                "data": current_data
            })
        
        return sections



    def _split_text_by_html_structure(self, text: str) -> List[str]:
        """根据HTML结构将文本分割成块"""
        # 使用BeautifulSoup解析文本
        soup = BeautifulSoup(text, "html.parser")
        
        # 提取主要的块级元素
        blocks = []
        # 先尝试提取包含"转发消息"的div元素
        all_divs = soup.find_all('div')
        forward_msg_found = False
        for div in all_divs:
            if '转发消息' in div.get_text() and div.get_text().strip():
                # 只添加第一个包含转发消息的div
                if not forward_msg_found:
                    blocks.append(str(div))
                    forward_msg_found = True
                # 避免添加重复的转发消息
        
        # 如果没有找到转发消息相关的元素，再查找其他块级元素
        if not blocks:
            for element in soup.find_all(['div', 'p', 'section', 'article', 'blockquote']):
                if element.get_text().strip():
                    blocks.append(str(element))
        
        # 如果仍然没有找到块级元素，则将整个文本作为一个块
        if not blocks:
            blocks.append(text)
        # 限制块的数量，避免重复
        if len(blocks) > 5:
            blocks = blocks[:2]
            
        return blocks

    def _merge_text_blocks_by_structure(self, blocks: List[Dict]) -> List[Dict]:
        """基于HTML结构合并文本块"""
        if not blocks:
            return blocks
            
        merged_blocks = []
        i = 0
        
        while i < len(blocks):
            current_block = blocks[i]
            
            # 如果是表格块，直接添加
            if current_block["type"] == "table":
                merged_blocks.append(current_block)
                i += 1
                continue
            
            # 如果是文本块
            if current_block["type"] == "text":
                # 直接添加文本块，不进行额外的合并
                merged_blocks.append(current_block)
                i += 1
            else:
                i += 1
                
        return merged_blocks

    def _extract_text_from_html(self, html_content: str) -> str:
        """从HTML内容中提取纯文本"""
        soup = BeautifulSoup(html_content, "html.parser")
        # 获取文本内容并清理多余的空白字符
        text = soup.get_text()
        # 将多个连续的空白字符替换为单个空格
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def _split_text_into_blocks(self, text: str) -> List[str]:
        """将文本按块分割，保留有意义的文本块"""
        # 按照段落标记分割文本
        blocks = re.split(r'(<p[^>]*>.*?</p>|<div[^>]*>.*?</div>|<br\s*/?>)', text, flags=re.DOTALL | re.IGNORECASE)
        # 清理并过滤空块
        cleaned_blocks = []
        for block in blocks:
            cleaned = block.strip()
            if cleaned:
                cleaned_blocks.append(cleaned)
        return cleaned_blocks

    def _split_text_into_paragraphs(self, text: str) -> List[str]:
        """将文本按段落分割"""
        # 使用BeautifulSoup提取文本块
        soup = BeautifulSoup(text, "html.parser")
        # 提取所有文本节点
        texts = []
        for string in soup.stripped_strings:
            if string:
                texts.append(string)
        
        # 合并文本，用空格分隔
        combined_text = ' '.join(texts)
        # 使用句子结束符分割文本
        sentences = re.split(r'[.!?]+', combined_text)
        # 清理并过滤空句子
        cleaned_sentences = []
        for sentence in sentences:
            cleaned = sentence.strip()
            if cleaned:
                cleaned_sentences.append(cleaned)
        return cleaned_sentences

    def _is_meaningful_content(self, content: str) -> bool:
        """判断内容是否有意义"""
        if not content:
            return False
        
        # 去除空白字符后的长度检查
        stripped_content = content.strip()
        if not stripped_content:
            return False
            
        # 过滤掉只包含符号或非常短的内容
        if len(stripped_content) <= 2 and re.match(r'^[/<>\-_\*\+=\[\]{}|\\]*$', stripped_content):
            return False
            
        # 过滤掉看起来像HTML标签碎片的内容
        if re.match(r'^[</>]*[a-zA-Z]+[</>]*$', stripped_content):
            return False
            
        return True

    # ======================================================
    # Step 4：解析 table → 二维数组（rowspan + colspan）
    # ======================================================
    def parse_table_cells(self, table_html: str) -> List[List[str]]:
        """解析表格单元格为二维数组"""
        soup = BeautifulSoup(table_html, "html.parser")
        tbody = soup.find("tbody")
        if not tbody:
            # 如果没有tbody，直接查找table下的所有tr
            rows = soup.find_all("tr")
        else:
            # 如果有tbody，则查找tbody下的tr
            rows = tbody.find_all("tr")
        if not rows:
            return []

        grid = []
        span_map = {}  # (row_idx, col_idx) -> value

        for r_idx, row in enumerate(rows):
            cells = row.find_all(["td", "th"])
            cell_idx = 0
            col_idx = 0
            grid_row = []

            # 👉 核心：只要还有 td，或者当前位置被 rowspan 占着，就继续
            while cell_idx < len(cells) or (r_idx, col_idx) in span_map:

                # 先处理 rowspan 占位
                if (r_idx, col_idx) in span_map:
                    grid_row.append(span_map[(r_idx, col_idx)])
                    col_idx += 1
                    continue

                # 正常 td/th
                cell = cells[cell_idx]
                cell_idx += 1

                val = cell.get_text().strip()
                # 处理 rowspan 和 colspan 属性
                rowspan_attr = cell.get("rowspan")
                colspan_attr = cell.get("colspan")
                
                # 将属性值转换为字符串再处理
                rowspan_str = str(rowspan_attr) if rowspan_attr else "1"
                colspan_str = str(colspan_attr) if colspan_attr else "1"
                
                rowspan = int(rowspan_str) if rowspan_str.isdigit() else 1
                colspan = int(colspan_str) if colspan_str.isdigit() else 1

                # 记录 rowspan / colspan 占位
                for rs in range(rowspan):
                    for cs in range(colspan):
                        if rs == 0 and cs == 0:
                            continue
                        span_map[(r_idx + rs, col_idx + cs)] = val

                # 当前行写入 colspan 次
                for _ in range(colspan):
                    grid_row.append(val)
                    col_idx += 1

            grid.append(grid_row)

        # 过滤掉全空的行
        filtered_grid = []
        for row in grid:
            # 检查行是否全为空
            if not all(cell == "" for cell in row):
                filtered_grid.append(row)
        
        return filtered_grid

    # ======================================================
    # 总入口
    # ======================================================
    def parse(self) -> List[Dict]:
        """解析HTML的总入口"""
        self.clean_html()
        return self.parse_to_section_list()

    def _remove_duplicate_blocks(self, blocks: List[Dict]) -> List[Dict]:
        """去除重复的内容块"""
        if not blocks:
            return blocks
            
        unique_blocks = []
        seen_contents = set()
        
        for block in blocks:
            # 对于文本块，基于内容去重
            if block["type"] == "text":
                content = self._extract_text_from_html(block["content"])
                # 简化内容用于比较（去除空白字符）
                simplified_content = re.sub(r'\s+', '', content)
                if simplified_content and simplified_content not in seen_contents:
                    unique_blocks.append(block)
                    seen_contents.add(simplified_content)
            else:
                # 对于表格块，直接添加
                unique_blocks.append(block)
                
        return unique_blocks