package com.tzdig.framework.statistics.fourth;

public class KeyZoneAndQxScoreReq {

    /**
     * 当前开始时间
     */
    private String currStartDate;

    /**
     * 当前结束时间
     */
    private String currEndDate;

    private String districtCode;

    private int type;

    /**
     * 年度
     */
    private Integer year;

    private int ptype;

    private int doller;

    public int getDoller() {
        return doller;
    }

    public void setDoller(int doller) {
        this.doller = doller;
    }

    /**
     * 开始月份
     */
    private Integer startMonth;

    /**
     * 结束月份
     */
    private Integer endMonth;

    private Integer rmb;

    /**
     * 项目类型
     */
    private String projType;

    public String getProjType() {
        return projType;
    }

    public void setProjType(String projType) {
        this.projType = projType;
    }

    public Integer getRmb() {
        return rmb;
    }

    public void setRmb(Integer rmb) {
        this.rmb = rmb;
    }

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

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getStartMonth() {
        return startMonth;
    }

    public void setStartMonth(Integer startMonth) {
        this.startMonth = startMonth;
    }

    public Integer getEndMonth() {
        return endMonth;
    }

    public void setEndMonth(Integer endMonth) {
        this.endMonth = endMonth;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public int getPtype() {
        return ptype;
    }

    public void setPtype(int ptype) {
        this.ptype = ptype;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
