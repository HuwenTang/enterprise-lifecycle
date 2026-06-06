package com.tzdig.framework.model.vo;

import cn.idev.excel.annotation.ExcelProperty;
import lombok.Data;

/**
 * 项目相关的交互 DTO
 * 包含转共享、转签约等操作所需的各类前端传参
 */
@Data
public class TProjectVO {

    /**
     * 投资方名称
     */
    @ExcelProperty("投资方名称")
    private String investor;

    /**
     * 项目类别 (1-内资, 2-外资)
     */
    @ExcelProperty("项目类别")
    private String pType;

    /**
     * 投资规模
     */
    @ExcelProperty("投资规模")
    private String investMoney;

    /**
     * 洽谈进度
     * 1-接洽中 2-已本地考察 3-签约前谈判 4-意向达成 5-签约
     */
    @ExcelProperty("洽谈进度")
    private String progress;

    /**
     * 项目内容, 大文本框
     */
    @ExcelProperty("项目内容")
    private String desc;

    /**
     * 区县名称
     */
    @ExcelProperty("市区")
    private String district;

    /**
     * 园区名称
     */
    @ExcelProperty("园区")
    private String zoneName;


    /**
     * 是否提请市级协调
     */
    @ExcelProperty("是否提请市级协调")
    private String requestCityCoordination;

    /**
     * 初次对接时间
     */
    @ExcelProperty("保送日期")
    private String firstTime;

    /**
     * 数据状态 1流转至签约项目 2 流转至共享项目
     */
    @ExcelProperty("数据状态")
    private  String sjStatus;



}
