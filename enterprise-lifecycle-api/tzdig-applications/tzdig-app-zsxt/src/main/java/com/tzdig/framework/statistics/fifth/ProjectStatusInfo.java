package com.tzdig.framework.statistics.fifth;

/**
 * 项目状态统计
 */
public class ProjectStatusInfo {

    /**
     * 编码  district_code + "_" + status
     */
    private String code;

    /**
     * 区域编码
     */
    private String districtCode;

    /**
     * 项目进度
     */
    private int progress;

    /**
     * 项目总数
     */
    private long projNums;

    /**
     * 金额
     */
    private double qyje;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public long getProjNums() {
        return projNums;
    }

    public void setProjNums(long projNums) {
        this.projNums = projNums;
    }

    public double getQyje() {
        return qyje;
    }

    public void setQyje(double qyje) {
        this.qyje = qyje;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }
}
