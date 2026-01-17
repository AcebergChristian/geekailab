from enum import Enum
from typing import List, Dict, Any, Optional


class TableType(Enum):
    """表格类型枚举"""
    PRICE = "price"
    SURCHARGE = "surcharge"
    REMARK = "remark"
    UNKNOWN = "unknown"


class PriceItem:
    """运价项目模型"""
    def __init__(self, data: Optional[Dict[str, Any]] = None):
        if data:
            self.POL = data.get("POL", "")
            self.POLCode = data.get("POLCode", "")
            self.POD = data.get("POD", "")
            self.PODCode = data.get("PODCode", "")
            self.PDL = data.get("PDL", "")
            self.VIA = data.get("VIA", "")
            self.VIACode = data.get("VIACode", "")
            self.Shipper = data.get("Shipper", "")
            self.Dock = data.get("Dock", "")
            self.SailingSchedule = data.get("SailingSchedule", "")
            self.Voyaga = data.get("Voyaga", "")
            self.Currency = data.get("Currency", "USD")
            self.F20GP = data.get("F20GP", 0)
            self.F40GP = data.get("F40GP", 0)
            self.F40HQ = data.get("F40HQ", 0)
            self.F45HQ = data.get("F45HQ", 0)
            self.StartTime = data.get("StartTime", "")
            self.OverTime = data.get("OverTime", "")
            self.Remark = data.get("Remark", "")
        else:
            self.POL = ""
            self.POLCode = ""
            self.POD = ""
            self.PODCode = ""
            self.PDL = ""
            self.VIA = ""
            self.VIACode = ""
            self.Shipper = ""
            self.Dock = ""
            self.SailingSchedule = ""
            self.Voyaga = ""
            self.Currency = "USD"
            self.F20GP = 0
            self.F40GP = 0
            self.F40HQ = 0
            self.F45HQ = 0
            self.StartTime = ""
            self.OverTime = ""
            self.Remark = ""


class SurchargeItem:
    """附加费项目模型"""
    def __init__(self, data: Optional[Dict[str, Any]] = None):
        if data:
            self.name = data.get("name", "")
            self.container_type = data.get("container_type", "")
            self.currency = data.get("currency", "")
            self.price = data.get("price", 0)
            self.remark = data.get("remark", "")
        else:
            self.name = ""
            self.container_type = ""
            self.currency = ""
            self.price = 0
            self.remark = ""


class OtherRemark:
    """其他重要信息模型"""
    def __init__(self, data: Optional[Dict[str, Any]] = None):
        if data:
            self.content = data.get("content", "")
            self.category = data.get("category", "")
        else:
            self.content = ""
            self.category = ""