package com.tzdig.framework.mybatis.vo;

import java.util.ArrayList;
import java.util.List;

public class OnePlusFourVo {

    /**
     * 区划名称
     */
    private String district;

    /**
     * 区划编号
     */
    private String districtCode;


    /**
     * 项目总数量
     */
    private long projNums;

    /**
     * 总投资
     */
    private double ztz;

    /**
     * 子类
     */
    private List<OnePlusFourClassify> children = new ArrayList<>();


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

    public double getZtz() {
        return ztz;
    }

    public void setZtz(double ztz) {
        this.ztz = ztz;
    }

    public List<OnePlusFourClassify> getChildren() {
        return children;
    }

    public void setChildren(List<OnePlusFourClassify> children) {
        this.children = children;
    }

    public static class OnePlusFourClassify {

        /**
         * 编号
         */
        private String code;

        /**
         * 名称
         */
        private String name;

        /**
         * 1+4 项目个数
         */
        private long t1;

        /**
         * 1+4 项目占比
         */
        private String t2;

        /**
         * 1+4 项目投资额
         */
        private double tze;


        public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public long getT1() {
            return t1;
        }

        public void setT1(long t1) {
            this.t1 = t1;
        }

        public String getT2() {
            return t2;
        }

        public void setT2(String t2) {
            this.t2 = t2;
        }

        public double getTze() {
            return tze;
        }

        public void setTze(double tze) {
            this.tze = tze;
        }
    }
}
