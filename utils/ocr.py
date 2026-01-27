import json
import time
from urllib.parse import urlencode
from typing import Optional

class TextinOcr:
    def __init__(self, app_id: str, app_secret: str, host: str):
        self.app_id = app_id
        self.app_secret = app_secret
        self.host = host

class Options:
    def __init__(self, pdf_pwd: str = "", apply_document_tree: int = 1, apply_merge: int = 1,
                 catalog_details: int = 1, formula_level: int = 1, dpi: int = 144,
                 page_start: int = 0, page_count: int = 1000, markdown_details: int = 1,
                 table_flavor: str = "md", get_image: str = "", parse_mode: str = "scan",
                 page_details: int = 1, crop_dewarp: int = 1):


        self.pdf_pwd = pdf_pwd
        self.apply_document_tree = apply_document_tree
        self.apply_merge = apply_merge
        self.catalog_details = catalog_details
        self.formula_level = formula_level
        self.dpi = dpi
        self.page_start = page_start
        self.page_count = page_count
        self.markdown_details = markdown_details
        self.table_flavor = table_flavor
        self.get_image = get_image
        self.parse_mode = parse_mode
        self.page_details = page_details
        self.crop_dewarp = crop_dewarp

def recognize_pdf_to_md(ocr: TextinOcr, file_url: str, options: Options) -> requests.Response:
    url = f"{ocr.host}/ai/service/v1/pdf_to_markdown"

    headers = {
        "x-ti-app-id": ocr.app_id,
        "x-ti-secret-code": ocr.app_secret,
        "Content-Type": "application/octet-stream"
    }

    # Convert options to query parameters
    params = {}
    for key, value in options.__dict__.items():
        if value is not None and value != "":
            params[key] = value

    full_url = f"{url}?{urlencode(params)}"

    response = requests.post(full_url, data=file_url.encode('utf-8'), headers=headers)
    return response

def general_analyze(file_url: str, app_id: str, app_secret: str, host: str) -> str:
    # Validate URL format
    if not file_url.startswith("http://") and not file_url.startswith("https://"):
        raise ValueError("无效的URL格式，URL必须以http://或https://开头")

    if not file_url:
        raise ValueError("文件URL不能为空")

    print(f"使用URL分析文件: {file_url}")

    # Initialize OCR client
    textin = TextinOcr(app_id, app_secret, host)
    options = Options()

    print("开始发送请求...")
    start_time = time.time()

    try:
        resp = recognize_pdf_to_md(textin, file_url, options)
        print(f"请求完成，耗时: {time.time() - start_time:.2f}秒，状态码: {resp.status_code}")

        print(f"收到响应，响应内容长度: {len(resp.content)} 字节")

        # Parse JSON response
        json_data = resp.json()

        # Check response status
        if json_data.get("code") not in [0, 200]:
            raise Exception(f"API返回错误: 代码={json_data.get('code')}, 消息={json_data.get('message')}")

        # Check markdown content
        markdown_content = json_data.get("result", {}).get("detail", "")
        if not markdown_content:
            raise Exception(f"API返回成功但没有Markdown内容，响应体: {resp.text}")

        print(f"成功获取Markdown内容，长度: {len(markdown_content)} 字节")
        # return markdown_content

        return json_data

    except requests.RequestException as e:
        raise Exception(f"请求文件分析失败: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"解析响应JSON失败: {str(e)}, 响应内容: {resp.text}")
    except Exception as e:
        raise e


def hehe_anylze(file_url: str):
    try:
        # You would get these from your config
        app_id = "8810db881e6a6c0102d193ad87eb5cc0"
        app_secret = "4ed228df7d0ce7eb5ee7562476fe9f08"
        host = "https://api.textin.com"
        result = general_analyze(file_url, app_id, app_secret, host)
        return result
    except Exception as e:
        print(f"转换失败: {str(e)}")
        


# Example usage:
# if __name__ == "__main__":
    
#     ossurl = 'https://pai-ocr-files.oss-cn-beijing.aliyuncs.com/email_attachments/Arrival%20Notice_20251101181836.pdf'
    
#     hehe_anylze(ossurl)
