package com.tzdig.framework.statistics;

/**
 * 签约项目明细表
 */
public class ProjSignedDetailVo {

    /**
     * 项目名称
     */
    private String name;

    /**
     * 总投资
     */
    private double investMoney;

    /**
     * 市区
     */
    private String district;

    /**
     * 园区
     */
    private String zoneName;

    /**
     * 投资方名称
     */
    private String investor;

    /**
     * 项目简介
     */
    private String projDesc;

    /**
     * 认定进度
     */
    private String progressRd;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getInvestMoney() {
        return investMoney;
    }

    public void setInvestMoney(double investMoney) {
        this.investMoney = investMoney;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public String getInvestor() {
        return investor;
    }

    public void setInvestor(String investor) {
        this.investor = investor;
    }

    public String getProjDesc() {
        return projDesc;
    }

    public void setProjDesc(String projDesc) {
        this.projDesc = projDesc;
    }

    public String getProgressRd() {
        return progressRd;
    }

    public void setProgressRd(String progressRd) {
        this.progressRd = progressRd;
    }
}
