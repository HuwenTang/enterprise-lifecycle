package com.tzdig.framework.statistics.second;

public class SignedProjectInfoDto {

    /**
     * 项目数量
     */
    private long projNums;

    /**
     * 总投资
     */
    private double ztz;

    /**
     * 组合码  “district_code”_"proj_type"
     */
    private String code;

    /**
     * 区划名称
     */
    private String district;

    /**
     * 区划编码
     */
    private String districtCode;



    public long getProjNums() {
        return projNums;
    }

    public void setProjNums(long projNums) {
        this.projNums = projNums;
    }

    public double getZtz() {
        return ztz;
    }

    public void setZtz(double ztz) {
        this.ztz = ztz;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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
}
