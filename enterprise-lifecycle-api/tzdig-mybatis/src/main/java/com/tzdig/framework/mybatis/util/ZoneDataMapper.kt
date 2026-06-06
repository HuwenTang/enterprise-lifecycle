package com.tzdig.framework.mybatis.util

/**
 * 战区数据映射工具类
 * 将实际数据中的战区变体映射到5个固定分类
 */
object ZoneDataMapper {
    
    // 5个固定战区分类
    const val ZONE_BEIJING = "北京(京津冀)"
    const val ZONE_SHANGHAI = "上海(长三角)"
    const val ZONE_SHENZHEN = "深圳(珠三角)"
    const val ZONE_NANJING = "南京(南京、合肥)"
    const val ZONE_OTHER = "其他地区"
    
    /**
     * 将实际战区数据映射到标准分类
     * @param rawValue 原始战区值
     * @return 标准化后的战区分类
     */
    fun mapToStandardZone(rawValue: String?): String? {
        if (rawValue == null || rawValue.trim().isEmpty()) {
            return null
        }
        
        val trimmedValue = rawValue.trim()
        
        return when {
            // 北京(京津冀)战区
            trimmedValue.contains("北京") -> ZONE_BEIJING
            
            // 上海(长三角)战区
            trimmedValue.contains("上海") || 
            trimmedValue.contains("长三角") -> ZONE_SHANGHAI
            
            // 深圳(珠三角)战区
            trimmedValue.contains("深圳") || 
            trimmedValue.contains("珠三角") ||
            trimmedValue == "广州" -> ZONE_SHENZHEN
            
            // 南京(南京、合肥)战区
            trimmedValue.contains("南京") || 
            trimmedValue.contains("合肥") -> ZONE_NANJING
            
            // 其他地区（包含所有其他境内地区）
            trimmedValue.contains("其他") ||
            trimmedValue == "内资其他" || 
            trimmedValue == "外资其他" ||
            trimmedValue.contains("其他城市") -> ZONE_OTHER
            
            // 默认返回原值
            else -> trimmedValue
        }
    }
    
    /**
     * 批量映射战区数据
     * @param rawValues 原始战区值列表
     * @return 标准化后的战区分类列表
     */
    fun mapBatchToStandardZone(rawValues: List<String?>): List<String?> {
        return rawValues.map { mapToStandardZone(it) }
    }
}