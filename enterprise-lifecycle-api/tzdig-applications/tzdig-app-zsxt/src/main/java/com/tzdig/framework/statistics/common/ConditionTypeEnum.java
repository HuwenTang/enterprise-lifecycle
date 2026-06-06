package com.tzdig.framework.statistics.common;

/**
 * 条件枚举
 */
public enum ConditionTypeEnum {

    /**
     * 1亿人民币（1000万美元）
     */
    ONE_HUNDRED_MILLION(1,1000,0.1),

    /**
     * 5亿人民币（3000万美元）
     */
    FIVE_HUNDRED_MILLION(5,3000,0.3),

    /**
     * 10亿人民币（1亿美元）
     */
    TEN_HUNDRED_MILLION(10,10000,1);

    /**
     * 人民币
     */
    private int rmb;

    /**
     * 美元
     */
    private int dollar;

    /**
     * “万”美元转成 “亿”美元
     */
    private double convert;

    ConditionTypeEnum(int rmb,int dollar,double convert) {
        this.rmb = rmb;
        this.dollar = dollar;
        this.convert = convert;
    }

    public int getRmb() {
        return rmb;
    }

    public int getDollar() {
        return dollar;
    }

    public double getConvert() {
        return convert;
    }

    public static ConditionTypeEnum getInstanceByRmb(int rmb) {
        for(ConditionTypeEnum e : ConditionTypeEnum.values()) {
            if(e.getRmb() == rmb) {
                return e;
            }
        }
        return null;
    }
}
