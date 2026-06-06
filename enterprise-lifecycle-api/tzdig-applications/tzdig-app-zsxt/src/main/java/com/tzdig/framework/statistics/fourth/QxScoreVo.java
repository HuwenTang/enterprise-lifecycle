package com.tzdig.framework.statistics.fourth;

/**
 *
 */
public class QxScoreVo {

    /**
     * 区县名称
     */
    private String district;

    /**
     * 区县编码
     */
    private String districtCode;

    /**
     * 重大加分项
     */
    private double scorePlus;

    /**
     * 1亿年度目标
     */
    private long oneTaskCount;

    /**
     * 1亿完成数
     */
    private long oneCount;

    /**
     * 1亿完成率
     */
    private String onePercent;

    /**
     * 1亿得分 0.3*完成率
     */
    private double oneScore;

    /**
     * 5亿年度目标
     */
    private long fiveTaskCount;

    public String getOnePercent() {
        return onePercent;
    }

    public void setOnePercent(String onePercent) {
        this.onePercent = onePercent;
    }

    public double getOneScore() {
        return oneScore;
    }

    public void setOneScore(double oneScore) {
        this.oneScore = oneScore;
    }

    /**
     * 5亿完成数
     */
    private long fiveCount;

    /**
     * 5亿完成率
     */
    private String fivePercent;

    /**
     * 5亿得分 0.1*完成率
     */
    private double fiveScore;

    /**
     * 10亿年度任务数
     */
    private long tenTaskCount;

    /**
     * 10亿完成数
     */
    private long tenCount;

    /**
     * 10亿完成率
     */
    private String tenPercent;

    /**
     * 10亿得分 0.3*完成率
     */
    private double tenScore;

    private String projTypeName;

    private String projType;

    public String getProjTypeName() {
        return projTypeName;
    }

    public void setProjTypeName(String projTypeName) {
        this.projTypeName = projTypeName;
    }

    public String getProjType() {
        return projType;
    }

    public void setProjType(String projType) {
        this.projType = projType;
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

    public double getScorePlus() {
        return scorePlus;
    }

    public void setScorePlus(double scorePlus) {
        this.scorePlus = scorePlus;
    }

    public long getFiveTaskCount() {
        return fiveTaskCount;
    }

    public void setFiveTaskCount(long fiveTaskCount) {
        this.fiveTaskCount = fiveTaskCount;
    }

    public long getFiveCount() {
        return fiveCount;
    }

    public void setFiveCount(long fiveCount) {
        this.fiveCount = fiveCount;
    }

    public String getFivePercent() {
        return fivePercent;
    }

    public void setFivePercent(String fivePercent) {
        this.fivePercent = fivePercent;
    }

    public double getFiveScore() {
        return fiveScore;
    }

    public void setFiveScore(double fiveScore) {
        this.fiveScore = fiveScore;
    }

    public long getTenTaskCount() {
        return tenTaskCount;
    }

    public void setTenTaskCount(long tenTaskCount) {
        this.tenTaskCount = tenTaskCount;
    }

    public long getTenCount() {
        return tenCount;
    }

    public void setTenCount(long tenCount) {
        this.tenCount = tenCount;
    }

    public String getTenPercent() {
        return tenPercent;
    }

    public void setTenPercent(String tenPercent) {
        this.tenPercent = tenPercent;
    }

    public double getTenScore() {
        return tenScore;
    }

    public void setTenScore(double tenScore) {
        this.tenScore = tenScore;
    }

    public long getOneTaskCount() {
        return oneTaskCount;
    }

    public void setOneTaskCount(long oneTaskCount) {
        this.oneTaskCount = oneTaskCount;
    }

    public long getOneCount() {
        return oneCount;
    }

    public void setOneCount(long oneCount) {
        this.oneCount = oneCount;
    }
}
