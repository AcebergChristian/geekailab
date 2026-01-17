"""表格分类器 - 用于识别表格类型（价格、附加费、备注）"""
import re
from typing import List, Dict, Any
from models.data_models import TableType
from config import PRICE_KEYWORDS, SURCHARGE_KEYWORDS


def classify_table(table_data: Dict[str, Any]) -> TableType:
    """
    对表格进行分类，支持两种数据格式：
    1. 旧格式：{"col": [...], "data": [...], "important_content": "..."}
    2. 新格式：{"header": [...], "data": [...], "type": "..."}

    Args:
        table_data: 表格数据
        
    Returns:
        TableType: 表格类型
    """
    # 检查数据格式并提取相应字段
    headers = table_data.get("header", [])
    rows = table_data.get("data", [])
    
    # 根据数据格式选择相应的header
    # 新格式：{"header": [...], "data": [...], "type": "..."}
    header_text = " ".join(map(str, headers)).lower() if headers else ""
    body_text = " ".join(
        " ".join(map(str, r)).lower() for r in rows[:5] if r
    ) if rows else ""
    
    text = header_text + " " + body_text + " "

    score = {
        "price": 0,
        "surcharge": 0,
        "remark": 0
    }

    # 结构特征计算

    # 1 箱型列特征（价格 or surcharge）- 扩展支持更多箱型
    if re.search(r"\b(20|40|45)\s*(gp|hq|hc|rf|nor|hr)\b", header_text):
        score["price"] += 2
        score["surcharge"] += 1

    # 2 明显"附加"语义（不用枚举）
    if "on top" in text or "additional" in text or "surcharge" in text:
        score["surcharge"] += 1

    # 3 价格矩阵密度 - 支持更多数字格式（含货币符号、逗号、小数点）
    numeric_cells = sum(
        1 for r in rows[:5] for c in r 
        if isinstance(c, str) and c.strip().replace('$', '').replace(',', '').replace('.', '').isdigit()
    )
    if numeric_cells >= 10:  # 提高阈值以更准确识别价格表
        score["price"] += 1
    
    # 4 判定 headers 是否包含某些关键字
    price_header_keywords = PRICE_KEYWORDS
    if any(keyword in header_text.lower() for keyword in price_header_keywords):
        score["price"] += 2
    
    surcharge_header_keywords = SURCHARGE_KEYWORDS
    if any(keyword in header_text.lower() for keyword in surcharge_header_keywords):
        score["surcharge"] += 1

    # 5 备注型（没有矩阵）
    header_length = len(headers) if headers else 0
    if header_length <= 1 and numeric_cells < 3:
        score["remark"] += 3

    # ===== 最终判定 =====
    final = max(score.items(), key=lambda x: x[1])

    if final[1] == 0:
        return TableType.UNKNOWN

    return TableType(final[0])


class TableClassifier:
    """表格分类器类"""
    
    def __init__(self):
        pass
    
    def classify_tables(self, sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        对多个表格进行分类
        
        Args:
            sections: 表格段列表
            
        Returns:
            分类后的表格段列表
        """
        for section in sections:
            data_type = classify_table(section)
            section["data_type"] = data_type.value
        
        return sections