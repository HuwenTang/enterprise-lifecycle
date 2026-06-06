package com.tzdig.framework.core.annotation

import cn.idev.excel.annotation.write.style.HeadStyle

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD)
@HeadStyle(fillForegroundColor = 10)
annotation class ExcelRequired
