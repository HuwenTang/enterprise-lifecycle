package com.tzdig.framework.statistics.second;

/**
 * 项目招引信息
 */
public class SignedProjectInc {

    /**
     * 1.1项目总数
     */
    private long projNums;

    /**
     * 1.2项目同比
     */
    private String projTb;

    /**
     * 1.3总投资（亿元）
     */
    private double ztz;

    /**
     * 1.4总投资同比
     */
    private String ztzTb;


    /**
     * 1.5内资项目数
     */
    private long nzProjNum;

    /**
     * 1.6内资投资金额
     */
    private double nzTz;

    /**
     * 1.7外资项目数量
     */
    private long wzProjNum;

    /**
     * 1.8外资投资金额
     */
    private double wzTz;

    // ==============================

    /**
     * 2.1 10亿元（1亿美元）项目数量
     */
    private long projNumsForTen;

    /**
     * 2.2 10亿元（1亿美元）投资总额
     */
    private double ztzForTen;

    // -==============================

    /**
     * 3.1 5亿项目百分比
     */
    private String fivePercent;

    /**
     * 3.2 10亿项目百分比
     */
    private String tenPercent;

    // ===============================

    /**
     * 4.1 重点园区 5亿（3000万美元）项目数量
     */
    private long keyZoneProjNums;

    /**
     * 4.2 重点园区 5亿（3000万美元）总投资
     */
    private double keyZoneTz;

    /**
     * 4.3 重点园区 5亿（3000万美元）项目数量 / 全市项目占比
     */
    private String keyZoneProjPercent;

    /**
     * 4.4 重点园区 5亿（3000万美元）总投资 / 全市项目占比
     */
    private String keyZoneTzPercent;

    // =====================================
    /**
     * 5.1 1+4项目总数量
     */
    private long onePlusFourProjNums;

    /**
     * 5.1 1+4项目总投资
     */
    private double onePlusFourZtz;

    private long t1;

    private long t2;

    private long t3;

    private long t4;

//    private long t5;
//
//    private long t6;
    //累计新签约亿元（1000万美元）项目数
    private long xqyxmsOne;

    //累计新签约亿元（1000万美元）投资额
    private double xqytzeOne;

    //累计新签约5亿元（3000万美元）项目数
    private long xqyxmsFive;

    //累计新签约5亿元（3000万美元）投资额
    private double xqytzeFive;

    //累计新签约10亿元（1亿美元）项目数
    private long xqyxmsTen;

    //累计新签约10亿元（1亿美元）投资额
    private double xqytzeTen;

    //累计新签约亿元（1000万美元）内资项目数
    private long nzxqyxmsOne;

    //累计新签约亿元（1000万美元）内资投资额
    private double nzxqytzeOne;

    //累计新签约亿元（1000万美元）外资项目数
    private long wzxqyxmsOne;

    //累计新签约亿元（1000万美元）外资投资额
    private double wzxqytzeOne;

    public long getXqyxmsOne() {
        return xqyxmsOne;
    }

    public void setXqyxmsOne(long xqyxmsOne) {
        this.xqyxmsOne = xqyxmsOne;
    }

    public double getXqytzeOne() {
        return xqytzeOne;
    }

    public void setXqytzeOne(double xqytzeOne) {
        this.xqytzeOne = xqytzeOne;
    }

    public long getXqyxmsFive() {
        return xqyxmsFive;
    }

    public void setXqyxmsFive(long xqyxmsFive) {
        this.xqyxmsFive = xqyxmsFive;
    }

    public double getXqytzeFive() {
        return xqytzeFive;
    }

    public void setXqytzeFive(double xqytzeFive) {
        this.xqytzeFive = xqytzeFive;
    }

    public long getXqyxmsTen() {
        return xqyxmsTen;
    }

    public void setXqyxmsTen(long xqyxmsTen) {
        this.xqyxmsTen = xqyxmsTen;
    }

    public double getXqytzeTen() {
        return xqytzeTen;
    }

    public void setXqytzeTen(double xqytzeTen) {
        this.xqytzeTen = xqytzeTen;
    }

    public long getNzxqyxmsOne() {
        return nzxqyxmsOne;
    }

    public void setNzxqyxmsOne(long nzxqyxmsOne) {
        this.nzxqyxmsOne = nzxqyxmsOne;
    }

    public double getNzxqytzeOne() {
        return nzxqytzeOne;
    }

    public void setNzxqytzeOne(double nzxqytzeOne) {
        this.nzxqytzeOne = nzxqytzeOne;
    }

    public long getWzxqyxmsOne() {
        return wzxqyxmsOne;
    }

    public void setWzxqyxmsOne(long wzxqyxmsOne) {
        this.wzxqyxmsOne = wzxqyxmsOne;
    }

    public double getWzxqytzeOne() {
        return wzxqytzeOne;
    }

    public void setWzxqytzeOne(double wzxqytzeOne) {
        this.wzxqytzeOne = wzxqytzeOne;
    }

    public long getOnePlusFourProjNums() {
        return onePlusFourProjNums;
    }

    public void setOnePlusFourProjNums(long onePlusFourProjNums) {
        this.onePlusFourProjNums = onePlusFourProjNums;
    }

    public double getOnePlusFourZtz() {
        return onePlusFourZtz;
    }

    public void setOnePlusFourZtz(double onePlusFourZtz) {
        this.onePlusFourZtz = onePlusFourZtz;
    }

    public long getT1() {
        return t1;
    }

    public void setT1(long t1) {
        this.t1 = t1;
    }

    public long getT2() {
        return t2;
    }

    public void setT2(long t2) {
        this.t2 = t2;
    }

    public long getT3() {
        return t3;
    }

    public void setT3(long t3) {
        this.t3 = t3;
    }

    public long getT4() {
        return t4;
    }

    public void setT4(long t4) {
        this.t4 = t4;
    }

//    public long getT5() {
//        return t5;
//    }
//
//    public long getT6() {
//        return t6;
//    }
//
//    public void setT5(long t5) {
//        this.t5 = t5;
//    }
//
//    public void setT6(long t6) {
//        this.t6 = t6;
//    }

    public long getKeyZoneProjNums() {
        return keyZoneProjNums;
    }

    public void setKeyZoneProjNums(long keyZoneProjNums) {
        this.keyZoneProjNums = keyZoneProjNums;
    }

    public double getKeyZoneTz() {
        return keyZoneTz;
    }

    public void setKeyZoneTz(double keyZoneTz) {
        this.keyZoneTz = keyZoneTz;
    }

    public String getKeyZoneProjPercent() {
        return keyZoneProjPercent;
    }

    public void setKeyZoneProjPercent(String keyZoneProjPercent) {
        this.keyZoneProjPercent = keyZoneProjPercent;
    }

    public String getKeyZoneTzPercent() {
        return keyZoneTzPercent;
    }

    public void setKeyZoneTzPercent(String keyZoneTzPercent) {
        this.keyZoneTzPercent = keyZoneTzPercent;
    }

    public String getFivePercent() {
        return fivePercent;
    }

    public void setFivePercent(String fivePercent) {
        this.fivePercent = fivePercent;
    }

    public String getTenPercent() {
        return tenPercent;
    }

    public void setTenPercent(String tenPercent) {
        this.tenPercent = tenPercent;
    }

    public long getProjNumsForTen() {
        return projNumsForTen;
    }

    public void setProjNumsForTen(long projNumsForTen) {
        this.projNumsForTen = projNumsForTen;
    }

    public double getZtzForTen() {
        return ztzForTen;
    }

    public void setZtzForTen(double ztzForTen) {
        this.ztzForTen = ztzForTen;
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
}
