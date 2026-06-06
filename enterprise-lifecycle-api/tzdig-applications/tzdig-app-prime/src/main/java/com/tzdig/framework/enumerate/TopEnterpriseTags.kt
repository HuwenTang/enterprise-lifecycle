package com.tzdig.framework.enumerate

enum class TopEnterpriseTags(
    val tag: String,
    val tagName: String,
    val digitalTagName: String,
) {
    TOP_INDUSTRY("top_industry", "规模以上工业企业", "规上工业数字经济核心产业"),
    TOP_CONSTRUCTION("top_construction", "资质等级建筑业企业", "资质内建筑业数字经济核心产业"),
    TOP_TRADE("top_trade", "限额以上批零住餐企业", "限上批零业数字经济核心产业"),
    TOP_SERVICE("top_service", "规模以上服务业企业", "规上服务业数字经济核心产业"),
    ;
}
