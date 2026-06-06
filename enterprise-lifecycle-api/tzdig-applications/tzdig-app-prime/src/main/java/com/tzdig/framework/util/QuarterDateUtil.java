package com.tzdig.framework.util;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

public class QuarterDateUtil {


    /**
     * 获取当前季度的开始时间（季度第一天的 00:00:00）
     */
    public static LocalDateTime getCurrentQuarterStart() {
        LocalDateTime now = LocalDateTime.now();
        int currentMonth = now.getMonthValue();

        // 确定当前季度的第一个月
        int startMonth = switch (currentMonth) {
            case 1, 2, 3 -> 1;   // 第一季度
            case 4, 5, 6 -> 4;   // 第二季度
            case 7, 8, 9 -> 7;   // 第三季度
            default -> 10;       // 第四季度（10-12月）
        };

        // 构建季度第一天的00:00:00
        return now.withMonth(startMonth)
                .with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    /**
     * 获取当前季度的结束时间（季度最后一天的 23:59:59.999999999）
     */
    public static LocalDateTime getCurrentQuarterEnd() {
        LocalDateTime now = LocalDateTime.now();
        int currentMonth = now.getMonthValue();

        // 确定当前季度的最后一个月
        int endMonth = switch (currentMonth) {
            case 1, 2, 3 -> 3;   // 第一季度
            case 4, 5, 6 -> 6;   // 第二季度
            case 7, 8, 9 -> 9;   // 第三季度
            default -> 12;       // 第四季度
        };

        // 构建季度最后一天的23:59:59.999999999
        return now.withMonth(endMonth)
                .with(TemporalAdjusters.lastDayOfMonth())
                .withHour(23)
                .withMinute(59)
                .withSecond(59)
                .withNano(999_999_999);
    }

    public static LocalDateTime getQuarterStart(int year, int quarter) {
        // 确定季度的第一个月
        int startMonth = getStartMonthOfQuarter(quarter);
        // 构建季度第一天的00:00:00
        return LocalDateTime.of(year, startMonth, 1, 0, 0, 0, 0)
                .with(TemporalAdjusters.firstDayOfMonth());
    }

    public static LocalDateTime getQuarterEnd(int year, int quarter) {
        // 确定季度的最后一个月
        int endMonth = getEndMonthOfQuarter(quarter);
        // 构建季度最后一天的23:59:59.999999999
        return LocalDateTime.of(year, endMonth, 1, 23, 59, 59, 999_999_999)
                .with(TemporalAdjusters.lastDayOfMonth());
    }

    // 根据季度获取开始月份
    private static int getStartMonthOfQuarter(int quarter) {
        return switch (quarter) {
            case 1 -> 1;   // Q1: 1月
            case 2 -> 4;   // Q2: 4月
            case 3 -> 7;   // Q3: 7月
            case 4 -> 10;  // Q4: 10月
            default -> throw new IllegalArgumentException("无效的季度：" + quarter);
        };
    }

    // 根据季度获取结束月份
    private static int getEndMonthOfQuarter(int quarter) {
        return switch (quarter) {
            case 1 -> 3;   // Q1: 3月
            case 2 -> 6;   // Q2: 6月
            case 3 -> 9;   // Q3: 9月
            case 4 -> 12;  // Q4: 12月
            default -> throw new IllegalArgumentException("无效的季度：" + quarter);
        };
    }

//    // 测试示例
//    public static void main(String[] args) {
//        // 测试正常情况
//        LocalDateTime q1Start = getQuarterStart("2024", "1");
//        LocalDateTime q1End = getQuarterEnd("2024", "1");
//        System.out.println("2024年Q1开始：" + q1Start);  // 2024-01-01T00:00:00
//        System.out.println("2024年Q1结束：" + q1End);    // 2024-03-31T23:59:59.999999999
//
//        // 测试Q3
//        LocalDateTime q3Start = getQuarterStart("2025", "3");
//        LocalDateTime q3End = getQuarterEnd("2025", "3");
//        System.out.println("2025年Q3开始：" + q3Start);  // 2025-07-01T00:00:00
//        System.out.println("2025年Q3结束：" + q3End);    // 2025-09-30T23:59:59.999999999
//    }
}
