package com.tzdig.framework.core.constant

object DeptConstant {
    /**
     * 泰州市
     */
    const val ROOT = "0"

    const val FAGAI_CODE = "kWu55tEqKE89f2Eg2i0by6aEC9zd"
    const val FAGAI_NAME = "发改委"
    const val KEJI_CODE = "yvuAzt2JA2GOt91X9HlK6aGPc1bB"
    const val KEJI_NAME = "科技局"
    const val GONGXIN_CODE = "jzuAxHPyePp3fG13GFPva6AGHW7y"
    const val GONGXIN_NAME = "工信局"

    const val SHENTAI_CODE = "XauYjFbLJbx9CL5GLUgkX3RYcj87"
    const val SHENTAI_NAME = "生态环境局"

    const val YINGJI_CODE = "rYu13cmwomzRFLxqLUKeADPYUowW"
    const val YINGJI_NAME = "应急局"
    const val SHANGWU_CODE = "qru1oF23k2GOtadgaIMxknGJtV6G"
    const val SHANGWU_NAME = "商务局"
    const val SHUIWU_CODE = "nYux8Ir3yVVBHmpwmIaabMHXawXl"
    const val SHUIWU_NAME = "税务局"


    val DEPARTMENT_LIST = arrayOf(
        FAGAI_CODE to FAGAI_NAME,
        KEJI_CODE to KEJI_NAME,
        GONGXIN_CODE to GONGXIN_NAME,
        SHENTAI_CODE to SHENTAI_NAME,
        YINGJI_CODE to YINGJI_NAME,
        SHANGWU_CODE to SHANGWU_NAME,
        SHUIWU_CODE to SHUIWU_NAME,
    )

    val FAGAI_LIST = arrayOf(
        FAGAI_CODE to AreaConstant.TAIZHOU_CODE to TAIZHOU_FAGAI_NAME,
        JINGJIANG_FAGAI_CODE to AreaConstant.JINGJIANG_CODE to JINGJIANG_FAGAI_NAME,

        TAIXING_FAGAI_CODE to AreaConstant.TAIXING_CODE to TAIXING_FAGAI_NAME,
        XINGHUA_FAGAI_CODE to AreaConstant.XINGHUA_CODE to XINGHUA_FAGAI_NAME,
        HAILING_FAGAI_CODE to AreaConstant.HAILING_CODE to HAILING_FAGAI_NAME,
        JIANGYAN_FAGAI_CODE to AreaConstant.JIANGYAN_CODE to JIANGYAN_FAGAI_NAME,
        XINGAO_FAGAI_CODE to AreaConstant.XINGAO_CODE to XINGAO_FAGAI_NAME,
    )

    val GONGXIN_LIST = arrayOf(
        GONGXIN_CODE to AreaConstant.TAIZHOU_CODE to TAIZHOU_GONGXIN_NAME,
        JINGJIANG_GONGXIN_CODE to AreaConstant.JINGJIANG_CODE to JINGJIANG_GONGXIN_NAME,

        TAIXING_GONGXIN_CODE to AreaConstant.TAIXING_CODE to TAIXING_GONGXIN_NAME,
        XINGHUA_GONGXIN_CODE to AreaConstant.XINGHUA_CODE to XINGHUA_GONGXIN_NAME,
        HAILING_GONGXIN_CODE to AreaConstant.HAILING_CODE to HAILING_GONGXIN_NAME,
        JIANGYAN_GONGXIN_CODE to AreaConstant.JIANGYAN_CODE to JIANGYAN_GONGXIN_NAME,
        XINGAO_GONGXIN_CODE to AreaConstant.XINGAO_CODE to XINGAO_GONGXIN_NAME,
    )


    val codeToNameMap = mapOf(
        FAGAI_CODE to TAIZHOU_FAGAI_NAME,
        TAIXING_FAGAI_CODE to TAIXING_FAGAI_NAME,
        XINGHUA_FAGAI_CODE to XINGHUA_FAGAI_NAME,
        HAILING_FAGAI_CODE to HAILING_FAGAI_NAME,
        JIANGYAN_FAGAI_CODE to JIANGYAN_FAGAI_NAME,
        XINGAO_FAGAI_CODE to XINGAO_FAGAI_NAME,
        JINGJIANG_FAGAI_CODE to JINGJIANG_FAGAI_NAME
    )
    val allCountyCodes = setOf(
        TAIXING_FAGAI_CODE,
        XINGHUA_FAGAI_CODE,
        HAILING_FAGAI_CODE,
        JIANGYAN_FAGAI_CODE,
        XINGAO_FAGAI_CODE,
        JINGJIANG_FAGAI_CODE
    )
    /**
     * 靖江市
     */
    const val JINGJIANG_CODE = "AWuGXCDqoDA1I8J38uG5qlgosea6"

    /**
     * 泰兴市
     */
    const val TAIXING_CODE = "1RuXtv8RvgKc78b7Cj662rmFpwo"

    /**
     * 兴化市
     */
    const val XINGHUA_CODE = "pYuoOFpO1pKBfmkAmIrb9W9Wcg3L"

    /**
     * 海陵区
     */
    const val HAILING_CODE = "aluzHm7LmJeF39b3IqgyPRvuLWr"

    /**
     * 姜堰区
     */
    const val JIANGYAN_CODE = "LMuXBIoXKolpsxjAxiYMaP10Tnv0"

    /**
     * 医药高新区（高港区）
     */
    const val XINGAO_CODE = "jzuwoCPyePp3fG13GFPl5Ow6tW7y"

    /**
     * 靖江市发改委
     */
    const val JINGJIANG_FAGAI_CODE = "K2uYKCRygRkjIe2neFEp1nKETmox"
    const val JINGJIANG_FAGAI_NAME = "靖江市发改委"

    /**
     * 泰兴市发改委
     */
    const val TAIXING_FAGAI_CODE = "AWugvIDqoDA1I8J38uz9PmqoFeDR"
    const val TAIXING_FAGAI_NAME = "泰兴市发改委"

    /**
     * 兴化市发改委
     */
    const val XINGHUA_FAGAI_CODE = "K2uYEFRygRkjIe2neFj7wXPYc50g"
    const val XINGHUA_FAGAI_NAME = "兴化市发改委"

    /**
     * 海陵区发改委
     */
    const val HAILING_FAGAI_CODE = "byuP2IMwoM19iPkKPsoLYEYEuVpG"
    const val HAILING_FAGAI_NAME = "海陵区发改委"

    /**
     * 姜堰区发改委
     */
    const val JIANGYAN_FAGAI_CODE = "DWuwIwAYwWBswMxwCYKJlnGtyo0"
    const val JIANGYAN_FAGAI_NAME = "姜堰区发改委"

    /**
     * 医药高新区（高港区）发改委
     */
    const val XINGAO_FAGAI_CODE = "byuotMdEYYlcPkKPs99AvsYMnLE"
    const val XINGAO_FAGAI_NAME = "医药高新区（高港区）发改委"

    const val TAIZHOU_FAGAI_NAME = "泰州市发改委"

    /**
     * 靖江市工信局
     */
    const val JINGJIANG_GONGXIN_CODE = "LMuEkCoakJJ2txjAxiDDv0HOpbRl"
    const val JINGJIANG_GONGXIN_NAME = "靖江市工信局"

    /**
     * 泰兴市工信局
     */
    const val TAIXING_GONGXIN_CODE = "9WuAXH5ed53WHRqYRhzeaY8kf8W5"
    const val TAIXING_GONGXIN_NAME = "泰兴市工信局"

    /**
     * 兴化市工信局
     */
    const val XINGHUA_GONGXIN_CODE = "K2uYnIRemMMlte2neFnnWkHngvpv"
    const val XINGHUA_GONGXIN_NAME = "兴化市工信局"

    /**
     * 海陵区工信局
     */
    const val HAILING_GONGXIN_CODE = "5Wux0ijlRvvPCb1Kbfgg6MCeJObM"
    const val HAILING_GONGXIN_NAME = "海陵区工信局"

    /**
     * 姜堰区工信局
     */
    const val JIANGYAN_GONGXIN_CODE = "JWua9tnaGMMpt5ab5IggKvC20aWo"
    const val JIANGYAN_GONGXIN_NAME = "姜堰区工信局"

    /**
     * 医药高新区（高港区）工信局
     */
    const val XINGAO_GONGXIN_CODE = "GgujmUWn2zz3HBvVBIwwPYsrq261"
    const val XINGAO_GONGXIN_NAME = "医药高新区（高港区）工信局"

    const val TAIZHOU_GONGXIN_NAME = "泰州市工信局"
}






