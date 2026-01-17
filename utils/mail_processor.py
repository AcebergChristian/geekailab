"""邮件处理器 - 负责拆楼等邮件内容处理"""
import re
from typing import List, Dict, Any


class MailProcessor:
    """邮件处理器，负责邮件拆楼等功能"""
    
    def __init__(self):
        pass

    def truncate_html_if_needed(self, html: str) -> str:
        """
        通过邮件头特征判断盖楼：
        - 发件人行包含邮箱 <...@...>
        - 第二层楼出现第二个类似的发件人行就截断
        """
        # 匹配 '发件人' 后面跟 <邮箱> 的模式
        header_pattern = r'发件人[\s\S]{0,500}?时间'

        matches = list(re.finditer(header_pattern, html))

        # 只有 0 或 1 个完整邮件头，不截断
        if len(matches) <= 1:
            return html

        # 有2个或更多邮件头，说明有盖楼，只取第一个楼层
        first_match = matches[0]
        second_match = matches[1]

        # 取第一个邮件头之前的内容 + 第一个邮件头的内容，作为第一个楼层
        start_pos = first_match.start()
        end_pos = second_match.start()

        # 截断HTML，只保留第一层
        truncated_html = html[start_pos:end_pos]

        return truncated_html