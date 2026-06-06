package com.tzdig.framework.statistics;

/**
 * 各市（区）新签约总投资10亿元（1亿美元）以上项目情况表
 */
public class SignedProjectInfo {

    /**
     * 区域名称
     */
    private String district;

    /**
     * 区域编码
     */
    private String districtCode;

    /**
     * 项目总数
     */
    private long projNums;

    /**
     * 项目同比
     */
    private String projTb;

    /**
     * 总投资（亿元）
     */
    private double ztz;

    /**
     * 总投资同比
     */
    private String ztzTb;

    // ========================


    /**
     * 内资项目数
     */
    private long nzProjNum;

    /**
     * 内资投资金额
     */
    private double nzTz;

    /**
     * 外资项目数量
     */
    private long wzProjNum;

    /**
     * 外资投资金额
     */
    private double wzTz;

    /**
     * 其中10亿以上项目元（1亿美元）
     * 项目总数
     */
    //private long projTotalNums;

    /**
     * 其中10亿以上项目元（1亿美元）
     * 项目总投资
     */
    //private double projTotalTz;


    // 去年项目数量
    private long lastYearProjNums;

    // 去年总投资
    private double lastZtz;

    private String signedDate;

    private Integer sixproCode;

    private String projType;

    private String projName;

    //年度目标任务数
    private long ndmbrws;

    //年度完成数
    private long ndwcs;

    //年度目标任务完成率
    private String ndmbwcl;

    public long getNdmbrws() {
        return ndmbrws;
    }

    public void setNdmbrws(long ndmbrws) {
        this.ndmbrws = ndmbrws;
    }

    public long getNdwcs() {
        return ndwcs;
    }

    public void setNdwcs(long ndwcs) {
        this.ndwcs = ndwcs;
    }

    public String getNdmbwcl() {
        return ndmbwcl;
    }

    public void setNdmbwcl(String ndmbwcl) {
        this.ndmbwcl = ndmbwcl;
    }

    public String getProjType() {
        return projType;
    }

    public void setProjType(String projType) {
        this.projType = projType;
    }

    public String getProjName() {
        return projName;
    }

    public void setProjName(String projName) {
        this.projName = projName;
    }

    public Integer getSixproCode() {
        return sixproCode;
    }

    public void setSixproCode(Integer sixproCode) {
        this.sixproCode = sixproCode;
    }

    public String getSignedDate() {
        return signedDate;
    }

    public void setSignedDate(String signedDate) {
        this.signedDate = signedDate;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public long getProjNums() {
        return projNums;
    }

    public void setProjNums(long projNums) {
        this.projNums = projNums;
    }

    public String getProjTb() {
        return projTb;
    }

    public void setProjTb(String projTb) {
        this.projTb = projTb;
    }

    public double getZtz() {
        return ztz;
    }

    public void setZtz(double ztz) {
        this.ztz = ztz;
    }

    public String getZtzTb() {
        return ztzTb;
    }

    public void setZtzTb(String ztzTb) {
        this.ztzTb = ztzTb;
    }

    public long getNzProjNum() {
        return nzProjNum;
    }

    public void setNzProjNum(long nzProjNum) {
        this.nzProjNum = nzProjNum;
    }

    public double getNzTz() {
        return nzTz;
    }

    public void setNzTz(double nzTz) {
        this.nzTz = nzTz;
    }

    public long getWzProjNum() {
        return wzProjNum;
    }

    public void setWzProjNum(long wzProjNum) {
        this.wzProjNum = wzProjNum;
    }

    public double getWzTz() {
        return wzTz;
    }

    public void setWzTz(double wzTz) {
        this.wzTz = wzTz;
    }

//    public long getProjTotalNums() {
//        return projTotalNums;
//    }
//
//    public void setProjTotalNums(long projTotalNums) {
//        this.projTotalNums = projTotalNums;
//    }
//
//    public double getProjTotalTz() {
//        return projTotalTz;
//    }
//
//    public void setProjTotalTz(double projTotalTz) {
//        this.projTotalTz = projTotalTz;
//    }

    public long getLastYearProjNums() {
        return lastYearProjNums;
    }

    public void setLastYearProjNums(long lastYearProjNums) {
        this.lastYearProjNums = lastYearProjNums;
    }

    public double getLastZtz() {
        return lastZtz;
    }

    public void setLastZtz(double lastZtz) {
        this.lastZtz = lastZtz;
    }
}
