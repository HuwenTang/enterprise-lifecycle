package com.tzdig.framework.statistics.second;

public class SignedIncDto {

    /**
     * 内资项目数量
     */
    private long nzProjNums;

    /**
     * 内资总投资
     */
    private double nzTz;

    /**
     * 外资项目数量
     */
    private long wzProjNums;

    /**
     * 外资投资（单位亿元）
     */
    private double wzTz;

    /**
     * 外资投资额（单位亿美元）
     */
    private double wzTzDollar;

    public long getNzProjNums() {
        return nzProjNums;
    }

    public void setNzProjNums(long nzProjNums) {
        this.nzProjNums = nzProjNums;
    }

    public double getNzTz() {
        return nzTz;
    }

    public void setNzTz(double nzTz) {
        this.nzTz = nzTz;
    }

    public long getWzProjNums() {
        return wzProjNums;
    }

    public void setWzProjNums(long wzProjNums) {
        this.wzProjNums = wzProjNums;
    }

    public double getWzTz() {
        return wzTz;
    }

    public void setWzTz(double wzTz) {
        this.wzTz = wzTz;
    }

    public double getWzTzDollar() {
        return wzTzDollar;
    }

    public void setWzTzDollar(double wzTzDollar) {
        this.wzTzDollar = wzTzDollar;
    }
}
