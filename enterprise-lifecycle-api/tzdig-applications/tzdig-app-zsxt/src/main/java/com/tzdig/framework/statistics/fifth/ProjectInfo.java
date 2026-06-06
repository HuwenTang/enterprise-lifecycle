package com.tzdig.framework.statistics.fifth;

import java.util.ArrayList;
import java.util.List;

/**
 * 项目状态统计
 */
public class ProjectInfo {

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
     * 金额
     */
    private double qyje;

    /**
     * 状态数据
     */
    private List<ProjectStatusInfo> children = new ArrayList<>();

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

    public double getQyje() {
        return qyje;
    }

    public void setQyje(double qyje) {
        this.qyje = qyje;
    }

    public List<ProjectStatusInfo> getChildren() {
        return children;
    }

    public void setChildren(List<ProjectStatusInfo> children) {
        this.children = children;
    }
}
