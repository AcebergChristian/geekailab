"""笛卡尔积分类器 - 用于判断表格数据的笛卡尔积复杂度"""
import re
from typing import List, Dict, Any
from config import BATCH_CONFIG
from itertools import product


class CartesianClassifier:
    """笛卡尔积分类器类，用于判断表格行是否会产生大量笛卡尔积组合"""
    
    def __init__(self, 
                 low_threshold: int = BATCH_CONFIG.get('cartesian_low_threshold', 2), 
                 high_threshold: int = BATCH_CONFIG.get('cartesian_high_threshold', 10)):
        """
        初始化分类器
        
        Args:
            low_threshold: 低笛卡尔积阈值，超过此值的行使用中等批处理
            high_threshold: 高笛卡尔积阈值，超过此值的行将单独处理
        """
        self.low_threshold = low_threshold
        self.high_threshold = high_threshold
    
    def calculate_cartesian_impact(self, row: List[str]) -> int:
        """
        计算一行数据可能产生的笛卡尔积数量
        
        Args:
            row: 表格行数据
            
        Returns:
            预估的笛卡尔积数量
        """
        if not row:
            return 1
        
        # 计算每个单元格可能的值的数量
        possible_values_per_cell = []
        
        for cell in row:
            if not isinstance(cell, str):
                possible_values_per_cell.append(1)
                continue
            
            # 去除首尾空白
            cell = cell.strip()
            if not cell:
                possible_values_per_cell.append(1)
                continue
            
            # 检查是否包含分隔符，如 / , 或 、
            separators = [r'\/', r',', r'，', r'、']
            for sep in separators:
                if re.search(sep, cell):
                    # 分割并计算可能的值数量
                    values = re.split(sep, cell)
                    values = [v.strip() for v in values if v.strip()]
                    possible_values_per_cell.append(len(values))
                    break
            else:
                # 如果没有分隔符，该单元格只有1个值
                possible_values_per_cell.append(1)
        
        # 计算笛卡尔积总数
        total_combinations = 1
        for count in possible_values_per_cell:
            total_combinations *= count
        
        return total_combinations
    
    def classify_cartesian_level(self, row: List[str]) -> str:
        """
        分类笛卡尔积级别
        
        Args:
            row: 表格行数据
            
        Returns:
            笛卡尔积级别 ('normal', 'weak_risk', 'high_risk')
        """
        cartesian_count = self.calculate_cartesian_impact(row)
        
        if cartesian_count > self.high_threshold:
            return 'high_risk'
        elif cartesian_count > self.low_threshold:
            return 'weak_risk'
        else:
            return 'normal'
    
    def get_batch_strategy(self, rows: List[List[str]]) -> List[Dict[str, Any]]:
        """
        获取批处理策略
        
        Args:
            rows: 表格数据行列表
            
        Returns:
            批处理策略列表，每个元素包含行和处理方式
        """
        strategies = []
        
        for i, row in enumerate(rows):
            level = self.classify_cartesian_level(row)
            cartesian_count = self.calculate_cartesian_impact(row)
            
            # 根据级别确定批处理大小
            if level == 'high_risk':
                batch_size = BATCH_CONFIG.get('risk_batch_size', 1)
            elif level == 'weak_risk':
                batch_size = BATCH_CONFIG.get('weakrisk_batch_size', 10)
            else:
                batch_size = BATCH_CONFIG.get('normal_batch_size', 20)
            
            strategies.append({
                'row_index': i,
                'row_data': row,
                'level': level,
                'cartesian_count': cartesian_count,
                'batch_size': batch_size
            })
        
        return strategies


    # 展开包含笛卡尔积的行，将一行变成多行
    def expand_cartesian_row(self, row: List[str]) -> List[List[str]]:
        """
        展开包含笛卡尔积的行，将一行变成多行
        只对业务相关的字段（如港口）进行展开，对时间、数字等字段不展开
        
        Args:
            row: 包含可能的多值单元格的行数据
            
        Returns:
            展开后的多行数据列表
        """
        if not row:
            return [row]
        
        # 为每个单元格创建可能的值列表
        cell_options = []
        
        for idx, cell in enumerate(row):
            if not isinstance(cell, str):
                # 非字符串直接作为单个选项
                cell_options.append([cell])
            else:
                cell = cell.strip()
                if not cell:
                    cell_options.append([''])
                else:
                    # 检查是否包含分隔符，但排除日期等非业务字段
                    # 检查是否是日期格式（如 11/1/2025）
                    is_date_format = bool(re.match(r'^\d{1,2}/\d{1,2}/\d{4}$', cell))
                    # 检查是否是纯数字
                    is_numeric = cell.replace(',', '').replace('.', '', 1).isdigit()
                    # 检查是否是货币或金额
                    is_amount = bool(re.match(r'^\$?[\d,]+\.?\d*$', cell))
                    
                    if is_date_format or is_numeric or is_amount:
                        # 日期、数字、金额等非业务字段不展开
                        cell_options.append([cell])
                    else:
                        # 检查是否包含分隔符（业务字段，如港口列表）
                        separators = [r'\/', r',', r'，', r'、']
                        expanded = False
                        for sep in separators:
                            if re.search(sep, cell):
                                values = re.split(sep, cell)
                                values = [v.strip() for v in values if v.strip()]
                                if len(values) > 1:
                                    cell_options.append(values)
                                    expanded = True
                                    break
                        
                        if not expanded:
                            # 如果没有找到分隔符，该单元格只有一个值
                            cell_options.append([cell])
        
        # 使用笛卡尔积生成所有组合
        expanded_rows = []
        for combination in product(*cell_options):
            expanded_rows.append(list(combination))
        
        return expanded_rows