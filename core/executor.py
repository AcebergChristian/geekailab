"""执行器 - 批量处理表格数据并调用LLM"""
import json
import time
from typing import List, Dict, Any, Callable
from core.llm_processor import to_llm
from utils.cartesian_classifier import CartesianClassifier
from config import BATCH_CONFIG, LLM_CONFIG


class Executor:
    """执行器类，负责批量处理表格数据"""
    
    def __init__(self):
        self.cartesian_classifier = CartesianClassifier()

    def execute(self, data_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        执行LLM处理流程
        根据笛卡尔积复杂度智能判断批处理大小
        """

        all_prices = []
        all_surcharge_items = []
        all_other_remarks = []
        
        for section_index, section_data in enumerate(data_list):
            # 获取表格数据
            headers = section_data.get("header", [])
            rows = section_data.get("data", [])
            table_type = section_data.get("data_type", "price")  # price / surcharge / remark
            # table_structure_type = section_data.get("type", "Normal")


            if not rows:
                continue  # 如果没有数据行，跳过处理

            # 使用笛卡尔积分类器确定批处理策略
            batch_strategy = self.cartesian_classifier.get_batch_strategy(rows)

            # 按批处理策略处理数据
            current_batch = []
            current_start_idx = 0
            
            for i, strategy in enumerate(batch_strategy):
                row_data = strategy['row_data']
                level = strategy['level']
                cartesian_count = strategy['cartesian_count']
                print(f"🔍 第 {section_index + 1} 表格,  第 {current_start_idx + 1} 行, 策略: {strategy}")
                time1 = time.time()
                # 根据笛卡尔积级别确定批处理大小
                if level == 'high_risk':
                    batch_size = BATCH_CONFIG.get('risk_batch_size', 1)
                    # 对高风险数据进行笛卡尔积展开
                    expanded_rows = self.cartesian_classifier.expand_cartesian_row(row_data)
                    # 将展开后的多行数据添加到批次中
                    for expanded_row in expanded_rows:
                        current_batch.append(expanded_row)
                elif level == 'weak_risk':
                    batch_size = BATCH_CONFIG.get('weakrisk_batch_size', 10)
                else:
                    batch_size = BATCH_CONFIG.get('normal_batch_size', 20)
                
                if level != 'high_risk':
                    current_batch.append(row_data)


                
                # 当前批次已满或到达最后一个元素时，执行处理
                if len(current_batch) >= batch_size or i == len(batch_strategy) - 1:
                    # 构建上下文
                    headers_text = " | ".join(str(h) for h in headers)
                    rows_text = "\n".join(" | ".join(str(c) for c in r) for r in current_batch)

                    context = f"""
table data type:
{table_type}

headers:
{headers_text}

rules:
- headers: to show fileds about price or surcharge
- do_not_expand_enum_values: true

rows:
{rows_text}"""

                    # 调用LLM处理，带重试机制
                    result = self._call_llm_with_retry(context)

                    print(f"⏱️ 表格 {section_index + 1} 行 {current_start_idx + 1}-{current_start_idx + len(current_batch)} 花耗时间: {time.time() - time1:.2f} 秒")
                    
                    if result:
                        # 根据table_type将结果添加到相应列表
                        if table_type == "price":
                            all_prices.extend(result.get("prices", []))
                            all_surcharge_items.extend(result.get("surcharge_items", []))
                            all_other_remarks.extend(result.get("other_remarks", []))

                        elif table_type == "surcharge":
                            # ❗️无论 LLM 怎么吐，都只进 surcharge
                            all_surcharge_items.extend(result.get("surcharge_items", []))
                            for p in result.get("prices", []):
                                content = p.get("Remark") or json.dumps(p, ensure_ascii=False)
                                all_surcharge_items.append({
                                    "name": "additional",
                                    "content": content
                                })

                        elif table_type == "remark":
                            all_other_remarks.extend(result.get("other_remarks", []))

                        print(f"✅ 表格 {section_index + 1} 行 {current_start_idx + 1}-{current_start_idx + len(current_batch)} 处理成功")
                    
                    # 重置批次
                    current_batch = []
                    current_start_idx = i + 1

        return {
            "prices": all_prices,
            "surcharge_items": all_surcharge_items,
            "other_remarks": all_other_remarks
        }
    
    def _call_llm_with_retry(self, context: str) -> Dict[str, Any]:
        """
        带重试机制的LLM调用
        
        Args:
            context: 输入上下文
            
        Returns:
            解析结果字典
        """
        max_retries = BATCH_CONFIG.get('max_retries', 3)
        base_retry_interval = BATCH_CONFIG.get('base_retry_interval', 2.0)
        
        for attempt in range(max_retries):
            try:
                result_str = to_llm(context)
                result = {}
                
                # 解析LLM返回的JSON结果
                try:
                    result = json.loads(result_str)
                except json.JSONDecodeError:
                    print(f"LLM返回结果非JSON格式: {result_str[:200]}...")
                    # 尝试从返回结果中提取JSON部分
                    import re
                    json_match = re.search(r'\{.*\}', result_str, re.DOTALL)
                    if json_match:
                        try:
                            result = json.loads(json_match.group())
                        except json.JSONDecodeError:
                            print("无法解析LLM返回的JSON")
                            result = {"prices": [], "surcharge_items": [], "other_remarks": []}
                    else:
                        result = {"prices": [], "surcharge_items": [], "other_remarks": []}
                
                return result
                
            except Exception as e:
                print(f"LLM调用失败，第 {attempt + 1} 次尝试: {e}")
                
                if attempt < max_retries - 1:
                    # 指数退避策略
                    wait_time = base_retry_interval * (2 ** attempt)
                    time.sleep(wait_time)
                else:
                    # 所有重试都失败，返回空结果
                    print("LLM调用最终失败，返回空结果")
                    return {"prices": [], "surcharge_items": [], "other_remarks": []}
        
        # 确保函数在所有路径上都返回值
        return {"prices": [], "surcharge_items": [], "other_remarks": []}
    

    def execute_without_cartesian_check(self, data_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        执行LLM处理流程 - 不进行笛卡尔积检查，直接按50行分批处理
        """
        import math
        
        all_prices = []
        all_surcharge_items = []
        all_other_remarks = []
        
        for section_index, section_data in enumerate(data_list):
            # 获取表格数据
            headers = section_data.get("header", [])
            rows = section_data.get("data", [])
            table_type = section_data.get("data_type", "price")  # price / surcharge / remark

            if not rows:
                continue  # 如果没有数据行，跳过处理

            # 按50行分批处理
            batch_size = 10
            for batch_start in range(0, len(rows), batch_size):
                batch_end = min(batch_start + batch_size, len(rows))
                current_batch = rows[batch_start:batch_end]
                
                # 构建上下文
                headers_text = " | ".join(str(h) for h in headers)
                rows_text = "\n".join(" | ".join(str(c) for c in r) for r in current_batch)


                context = f"""
table data type:
{table_type}

headers:
{headers_text}

rules:
- headers: to show fileds about price or surcharge
- do_not_expand_enum_values: true

rows:
{rows_text}"""

                # 调用LLM处理，带重试机制
                time1 = time.time()
                result = self._call_llm_with_retry(context)

                print(f"⏱️ 表格 {section_index + 1} 行 {batch_start + 1}-{batch_end} 花耗时间: {time.time() - time1:.2f} 秒")
                
                if result:
                    # 根据table_type将结果添加到相应列表
                    if table_type == "price":
                        all_prices.extend(result.get("prices", []))
                        all_surcharge_items.extend(result.get("surcharge_items", []))
                        all_other_remarks.extend(result.get("other_remarks", []))

                    elif table_type == "surcharge":
                        # ❗️无论 LLM 怎么吐，都只进 surcharge
                        all_surcharge_items.extend(result.get("surcharge_items", []))
                        for p in result.get("prices", []):
                            content = p.get("Remark") or json.dumps(p, ensure_ascii=False)
                            all_surcharge_items.append({
                                "name": "additional",
                                "content": content
                            })

                    elif table_type == "remark":
                        all_other_remarks.extend(result.get("other_remarks", []))

                    print(f"✅ 表格 {section_index + 1} 行 {batch_start + 1}-{batch_end} 处理成功")

        return {
            "prices": all_prices,
            "surcharge_items": all_surcharge_items,
            "other_remarks": all_other_remarks
        }

    
    def expand_item_cartesian(self, item: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        对单个项目进行笛卡尔积展开
        例如：pol:'A/B/C' pod:'D/E' 展开成 3*2=6 行
        注意：只对pol、pod、pdl三个字段进行展开
        """
        from itertools import product
        import re
        
        # 只对指定的三个字段进行笛卡尔积展开
        target_fields = ['pol', 'pod', 'pdl']
        
        # 找出包含多值的字段
        multi_value_fields = {}
        single_value_fields = {}
        
        for key, value in item.items():
            # 检查是否是目标字段
            is_target_field = key.lower() in target_fields
            
            if isinstance(value, str):
                # 检查是否包含分隔符，但排除日期等非业务字段
                is_date_format = bool(re.match(r'^\d{1,2}/\d{1,2}/\d{4}$', value))
                is_numeric = value.replace(',', '').replace('.', '', 1).replace('-', '', 1).isdigit()
                is_amount = bool(re.match(r'^\$?[\d,]+\.?\d*$', value))
                
                if is_date_format or is_numeric or is_amount:
                    # 日期、数字、金额等非业务字段不展开
                    single_value_fields[key] = value
                elif is_target_field:
                    # 只对目标字段检查是否包含分隔符
                    separators = [r'\/', r',', r'，', r'、']
                    expanded = False
                    for sep in separators:
                        if re.search(sep, value):
                            values = re.split(sep, value)
                            values = [v.strip() for v in values if v.strip()]
                            if len(values) > 1:
                                multi_value_fields[key] = values
                                expanded = True
                                break
                    
                    if not expanded:
                        # 如果没有找到分隔符，该字段只有一个值
                        single_value_fields[key] = value
                else:
                    # 非目标字段不展开
                    single_value_fields[key] = value
            else:
                single_value_fields[key] = value
        
        # 如果没有多值字段，直接返回原项目
        if not multi_value_fields:
            return [item]
        
        # 生成笛卡尔积
        keys = list(multi_value_fields.keys())
        values = list(multi_value_fields.values())
        
        expanded_items = []
        for combination in product(*values):
            new_item = single_value_fields.copy()
            for i, key in enumerate(keys):
                new_item[key] = combination[i]
            expanded_items.append(new_item)
        
        return expanded_items

    
    # 使用LLM处理单个批次的数据
    def _process_batch_with_llm(self, context: str) -> str:
        """
        使用LLM处理单个批次的数据
        
        Args:
            context: 批次数据的文本表示
            
        Returns:
            LLM处理结果字符串
        """
        # 调用现有的to_llm方法
        return to_llm(context)


    # excel 数据直接分批次 默认50，给大模型方法
    def exceldata_batch_llm(self, data: List[Dict[str, Any]], batch_size: int = 50) -> Dict[str, Any]:
        """
        将数据分批次 直接给大模型方法 然后拼成最终结果
        
        Args:
            data: 要处理的数据列表
            batch_size: 每批次处理的数据量
            
        Returns:
            合并后的完整结果字典
        """
        if not data:
            return {
                "prices": [],
                "surcharge_items": [],
                "other_remarks": []
            }
            
        all_prices = []
        all_surcharge_items = []
        all_other_remarks = []
        
        # 将数据分成批次
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            print(f"处理第 {i//batch_size + 1} 批数据，共 {len(batch)} 条记录")
            
            # 将批次数据转换为字符串格式，包含header信息
            batch_context_lines = []
            for item in batch:
                if isinstance(item, dict) and "header" in item and "row_data" in item:
                    # 构造包含header的完整数据行
                    header_str = " | ".join(str(h) for h in item["header"])
                    data_str = " | ".join(str(d) for d in item["row_data"])
                    batch_context_lines.append(f"Header: {header_str}\nData: {data_str}")
            
            batch_context = "\n---\n".join(batch_context_lines)
            
            try:
                # 调用LLM处理批次数据
                batch_result_str = self._process_batch_with_llm(batch_context)
                
                # 解析LLM返回的JSON结果
                try:
                    batch_result = json.loads(batch_result_str)
                    if isinstance(batch_result, dict):
                        # 提取各个部分并添加到总结果中
                        if "prices" in batch_result and isinstance(batch_result["prices"], list):
                            all_prices.extend(batch_result["prices"])
                        if "surcharge_items" in batch_result and isinstance(batch_result["surcharge_items"], list):
                            all_surcharge_items.extend(batch_result["surcharge_items"])
                        if "other_remarks" in batch_result and isinstance(batch_result["other_remarks"], list):
                            all_other_remarks.extend(batch_result["other_remarks"])
                    else:
                        print(f"批次 {i//batch_size + 1} 返回结果格式不正确: {type(batch_result)}")
                except json.JSONDecodeError as e:
                    print(f"批次 {i//batch_size + 1} JSON解析失败: {e}")
                    print(f"返回内容: {batch_result_str}")
                    
            except Exception as e:
                print(f"处理批次 {i//batch_size + 1} 时出错: {e}")
                continue
                
        # 返回合并后的完整结果
        return {
            "prices": all_prices,
            "surcharge_items": all_surcharge_items,
            "other_remarks": all_other_remarks
        }