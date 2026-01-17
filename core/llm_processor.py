"""LLM处理器 - 负责调用大模型进行数据处理和聚类"""
from openai import AzureOpenAI
import json
from typing import Dict, Any
from config import LLM_CONFIG


def to_llm(context: str) -> str:
    print("to_llm  context :", context)
    """
    调用LLM处理上下文
    
    Args:
        context: 输入上下文
        
    Returns:
        str: LLM返回的结果
    """
    prompt = f"""
        你是一个专业的运价解析模型。请从下面的船司运价邮件中提取结构化信息。
        输出 JSON，包含：prices，surcharge_items，other_remarks。
        禁止遗漏、禁止臆断。

        ① rate运价（prices）
        注意：
        1. 需要根据规定的格式输出POL,POD,PDL（都可能是多个值）, 且避免将内陆点、最终目的地、PDL等识别成POD，注意区分POD和PDL。POL不可能为空，无法找到时赋值POL为null。
        2. 规定输出格式字段之外的其他字段不考虑，有则放到remark里。
        3. 如果数据行内有pol或者pod等情况, 则需要关注此值的语义，并赋值到指定的字段里，同时数据必须根据对应的header字段行去提取并输出，禁止遗漏。
        4. 如果数据行内pol或pod的值会有多个值的时候，如 
        ['pol', '', ...]
        ['Shekou, GD, China;Qinzhou, Qinzhou, Guangxi, China', '', ...]
        则输出的pol: 'Shekou/Qinzhou/'
        去掉重复的城市或省级或国家等归属地，只保留城市名称，多个城市之间用 / 分隔，如Shekou/Qinzhou


        ② 附加费（surcharge_items）
        注意：
        1. 如果table type是附加费类型，或者表格或表头中包含：Additional, Surcharge, On top, Remarks, CSS, HCS, PNC, FAF, BUC, ISPS
        2. 数据都追加到 surcharge_items 的list中，不要遗漏，不要臆断

        ③ 其他重要信息（other_remarks）
        注意：
        1.根据每次输入内容，提取涉及非运价（prices），附加费（surcharge_items）的所有数据，且全部追加到（other_remarks） 的list中

        输出格式（字段顺序严格遵守），以下是示例数据：
        {{
        "prices": [
        {{
        "POL": "Shanghai", # 起运港英文名称，POL不可能为空，无法找到时赋值POL为null
        "POLCode": "CNSHA", # 起运港五字码
        "POD": "Los Angeles", # 目的港（卸货港）英文名称
        "PODCode": "USLAX", # 目的港（卸货港）五字码
        "PDL": "Chicago", # 最终目的地（内陆点）英文名称（如果有）
        "VIA": "", # 中转港英文名称（如果有）
        "VIACode": "", # 中转港五字码（如果有）
        "Shipper": "COSCO", # 船公司代码
        "Dock": "", # 挂靠码头代码（如果有）
        "SailingSchedule": "1,3,5", # 船期（1-7，多值用英文逗号分隔）
        "Voyaga": "WSA", # 航程（多值用英文逗号分隔）
        "Currency": "USD", # 币种代码（默认USD）
        "F20GP": 1500, # 20GP普货运价（整数，单位：美元）
        "F40GP": 2500, # 40GP普货运价（整数，单位：美元）
        "F40HQ": 2600, # 40HQ普货运价（整数，单位：美元）
        "F45HQ": 0, # 45HQ普货运价（整数，单位：美元）
        "F40NOR": 0, # 40NOR运价（整数，单位：美元）
        "F40HR": 0, # 40HR运价（整数，单位：美元）
        "StartTime": "2024-01-01", # 运价有效期开始日期（格式：YYYY-MM-DD）
        "OverTime": "2024-03-31", # 运价有效期结束日期（格式：YYYY-MM-DD）
        "Remark": "附加费另计，其他海运费相关备注等" # 该条运价无法结构化的补充说明
        }}
        ],
        "surcharge_items": [
        {{
            "name": "FAF", # 附加费名称（例如 FAF、GFS、ISPS、additional）
            "content": "适用于上海至洛杉矶，每个20GP300USD；subject to...；on top of Los Angeles； " # 附加费内容（大模型整理数据按每条理解输出，包括港口、箱型、价格、适用条款、备注等信息）
        }}
        ]
        "other_remarks": [
        {{
            "content": "2024/6/01 起，取消前 7 天退关费 USD200/TEU", # 其他重要信息内容
            "category": "policy" # 其他重要信息类别，如policy（政策）、notice（通知）、warning（警告）、etc（其他）
        }},
        }}

        以下是输入内容：
        {context}
    """

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
    
    res = response.choices[0].message.content
    return res if res else ""