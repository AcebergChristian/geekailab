import json
import time
import requests  # 导入requests
from urllib.parse import urlencode

def hehe_anylze(file_content):
    """
    调用 TextIn 文档解析 API
    file_content: 文件的二进制内容
    """
    try:
        # 官方接口地址和配置
        url = "https://api.textin.com/ai/service/v1/pdf_to_markdown"
        headers = {
            "x-ti-app-id": "8810db881e6a6c0102d193ad87eb5cc0",  # 从原代码中获取的app_id
            "x-ti-secret-code": "4ed228df7d0ce7eb5ee7562476fe9f08",  # 从原代码中获取的secret_code
            "Content-Type": "application/octet-stream"  # 关键：使用二进制流格式
        }

        # 直接将文件内容作为 data 传递
        response = requests.post(url, headers=headers, data=file_content)
        result = response.json()

        
        return result
        
    except Exception as e:
        print(f"转换失败: {str(e)}")
        return {"error": str(e), "success": False}