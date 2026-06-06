package com.tzdig.framework.core.constant

object AreaConstant {
    const val TAIZHOU_CODE = "321200000000"
    const val TAIZHOU_NAME = "泰州市"


    const val TAIZHOU_LEVEL_CODE = "321200000000"
    const val TAIZHOU_LEVEL_NAME = "泰州市本机"

    const val JINGJIANG_CODE = "321282000000"
    const val JINGJIANG_NAME = "靖江市"

    const val TAIXING_CODE = "321283000000"
    const val TAIXING_NAME = "泰兴市"

    const val XINGHUA_CODE = "321281000000"
    const val XINGHUA_NAME = "兴化市"

    const val HAILING_CODE = "321202000000"
    const val HAILING_NAME = "海陵区"

    const val JIANGYAN_CODE = "321204000000"
    const val JIANGYAN_NAME = "姜堰区"

    const val XINGAO_CODE = "321203000000"
    const val XINGAO_NANE = "医药高新区（高港区）"

    @JvmField
    val DISTRICT_LIST = arrayOf(
        JINGJIANG_CODE to JINGJIANG_NAME, // 靖江
        TAIXING_CODE to TAIXING_NAME,     // 泰兴
        XINGHUA_CODE to XINGHUA_NAME,     // 兴化
        HAILING_CODE to HAILING_NAME,     // 海陵
        JIANGYAN_CODE to JIANGYAN_NAME,   // 姜堰
        XINGAO_CODE to XINGAO_NANE,       // 新高
    )

    val DISTRICT_LIST_ALL = arrayOf(
        TAIZHOU_CODE to "市（区）",
        JINGJIANG_CODE to JINGJIANG_NAME, // 靖江
        TAIXING_CODE to TAIXING_NAME,     // 泰兴
        XINGHUA_CODE to XINGHUA_NAME,     // 兴化
        HAILING_CODE to HAILING_NAME,     // 海陵
        JIANGYAN_CODE to JIANGYAN_NAME,   // 姜堰
        XINGAO_CODE to XINGAO_NANE,       // 新高
    )
}
