package com.tzdig.framework.statistics;

/**
 * 各市（区）新签约总投资10亿元（1亿美元）以上项目情况表
 * 请求参数
 */
public class SignedProjectInfoReq {

    /**
     * 条件 1亿/5亿/10亿
     */
    private int rmb;

    /**
     * 当前开始时间
     */
    private String currStartDate;

    /**
     * 当前结束时间
     */
    private String currEndDate;

    /**
     * 部门编码
     */
    private String districtCode;


    /**
     * 去年同期开始时间
     */
    private String lastYearStartDate;

    private int year;

    /**
     * 去年同期结束时间
     */
    private String lastYearEndDate;

    private Integer level;

    private Integer pType;

    private String deptCode;

    public String getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    private Integer type;


    public String getCurrStartDate() {
        return currStartDate;
    }

    public void setCurrStartDate(String currStartDate) {
        this.currStartDate = currStartDate;
    }

    public String getCurrEndDate() {
        return currEndDate;
    }

    public void setCurrEndDate(String currEndDate) {
        this.currEndDate = currEndDate;
    }

    public String getLastYearStartDate() {
        return lastYearStartDate;
    }

    public void setLastYearStartDate(String lastYearStartDate) {
        this.lastYearStartDate = lastYearStartDate;
    }

    public String getLastYearEndDate() {
        return lastYearEndDate;
    }

    public void setLastYearEndDate(String lastYearEndDate) {
        this.lastYearEndDate = lastYearEndDate;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public int getRmb() {
        return rmb;
    }

    public void setRmb(int rmb) {
        this.rmb = rmb;
    }
}
