import logging

# 日志配置
LOGGING_CONFIG = {
    'level': logging.INFO,
    'format': '%(asctime)s - %(levelname)s - %(message)s',
    'handlers': [
        logging.FileHandler('app.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
}

# LLM配置
LLM_CONFIG = {
    'api_key': "sk-xxx",
    'azure_endpoint': "https://prime-02.openai.azure.com/",
    'api_version': "2025-04-01-preview",
    'model': "gpt-4.1"
}

# 批处理配置
BATCH_CONFIG = {
    'cartesian_threshold': 10,
    'normal_batch_size': 20, # 正常批处理大小
    'weakrisk_batch_size': 10,  # 弱风险批处理大小
    'risk_batch_size': 1,  # 风险批处理大小

    'max_retries': 3,  # 最大重试次数
    'base_retry_interval': 2.0  # 基础重试间隔
}

# 文件路径配置
PATH_CONFIG = {
    'input_data': 'mailData0113.json',
    'output_data': 'tableData0.json',
    'output_dir': 'outputs'
}


# ========== 关键词配置 ==========

# 运价相关关键词配置
PRICE_KEYWORDS = {
    "date", "pol", "pod", "port of load", "port of load", "port of discharge", "pdl", "via", "freight", "price", "destination", "country"
}

# 附加费相关关键词配置
SURCHARGE_KEYWORDS = {
    "additional", "surcharge", 'surcharges', "on top", "remarks", "css", "hcs", "pnc", 
    "faf", "buc", "isps", "thc", "ctn", "srs", "fes", "baf", "brc", 
    "lws", "slf", "cls", "gfs", "wrs", "dof", "doc", "pad", "ovw", 
    "ccc", "pcs", "ams", "isp", "tad", "pts", "subject to", "overweight", "onc"
}

# 备注相关关键词配置
REMARK_KEYWORDS = {
    "port", "load", "discharge", "destination", "origin"
}

# HEADER相关关键词配置
HEADER_INDICATORS = {
    'PORT', 'LOAD', 'DISCHARGE', 'DESTINATION', 'ORIGIN',
    'POL', 'POD', 'PDL', 'FREIGHT', 'DATE', 'CURRENCY', 'CONTAINER TYPE', 'VIA', '20GP', '40GP', '40HQ', 'CY', 'CFS'
}
HEADER_KEYWORDS = {
    '港口', '港', '费用', '费', '价格', '单价', '航线', '船期', '时间', '日期', '币种', '箱型', '类型', '目的地', '起运港', '卸货港',
    'POL', 'POD', 'PDL', 'FREIGHT', 'DATE', 'CURRENCY', 'CONTAINER TYPE'
}