package com.tzdig.framework.model.vo;

import cn.idev.excel.annotation.ExcelProperty;
import lombok.Data;

/**
 * 市（区）活动记录导出 VO
 */
@Data
public class TProjInvestActivitiesVO {

    /**
     * 市区名称
     */
    @ExcelProperty("市区")
    private String name;

    @ExcelProperty("园区")
    private String zoneName;

    @ExcelProperty("镇街")
    private String townName;

    /**
     * 开始时间
     */
    @ExcelProperty("开始时间")
    private String startTime;
    /**
     * 结束时间
     */
    @ExcelProperty("结束时间")
    private String endTime;

    /**
     * 活动内容
     */
    @ExcelProperty("活动内容")
    private String activityContent;

    @ExcelProperty("活动地址")
    private String zjbAddress;


    /**
     * 市（区）参加活动主要领导
     */
    @ExcelProperty("主要领导")
    private String leaders;

    /**
     * 所属产业链名称
     */
    @ExcelProperty("所属产业链")
    private String industryName;






}
