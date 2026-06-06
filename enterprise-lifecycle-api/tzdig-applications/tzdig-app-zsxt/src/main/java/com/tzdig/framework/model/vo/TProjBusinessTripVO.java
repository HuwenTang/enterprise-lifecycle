package com.tzdig.framework.model.vo;

import cn.idev.excel.annotation.ExcelProperty;
import lombok.Data;

/**
 * 因公出访招商项目情况导出 VO
 */
@Data
public class TProjBusinessTripVO {

    /**
     * 市（区）名称
     */
    @ExcelProperty("市(区)")
    private String name;

    @ExcelProperty("园区")
    private String zoneName;

    @ExcelProperty("镇街")
    private String townName;

    /**
     * 年份
     */
    @ExcelProperty("年份")
    private String year;

    /**
     * 团组名称
     */
    @ExcelProperty("团组名称")
    private String groupName;

    /**
     * 主要成员
     */
    @ExcelProperty("主要成员")
    private String mainMembers;

    /**
     * 出访地（国家、地区）
     */
    @ExcelProperty("出访地（国家、地区）")
    private String visitDestination;

    /**
     * 主要开展活动和拜访企业
     */
    @ExcelProperty("主要开展活动和拜访企业")
    private String activitiesAndVisits;

    /**
     * 取得成果
     */
    @ExcelProperty("取得成果")
    private String achievements;

    /**
     * 下一步打算
     */
    @ExcelProperty("下一步打算")
    private String nextPlan;
}
