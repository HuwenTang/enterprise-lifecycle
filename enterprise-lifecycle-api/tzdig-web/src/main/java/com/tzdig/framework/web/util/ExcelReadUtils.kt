package com.tzdig.framework.web.util

import cn.idev.excel.FastExcel
import cn.idev.excel.context.AnalysisContext
import cn.idev.excel.read.listener.ReadListener
import reactor.core.publisher.Flux
import java.io.File
import kotlin.reflect.KClass

class ExcelReadUtils<T : Any>
private constructor(
    private val head: Class<T>,
    private val callback: (T) -> Unit,
) : ReadListener<T> {
    private var finish: () -> Unit = {}

    /**
     * 每条数据解析调用一次
     */
    override fun invoke(data: T, context: AnalysisContext) = callback(data)

    /**
     * 全部数据解析完成调用一次
     */
    override fun doAfterAllAnalysed(context: AnalysisContext) = finish()

    fun read(file: File, sheetNo: Int = 0) = FastExcel.read()
        .registerReadListener(this)
        .file(file)
        .head(head)
        .sheet(sheetNo)
        .doRead()

    companion object {
        @JvmStatic
        @JvmOverloads
        fun <T : Any> readFlux(file: File, head: Class<T>, sheetNo: Int = 0) =
            Flux.create { emitter ->
                ExcelReadUtils(head) { emitter.next(it) }
                    .apply { finish = emitter::complete }
                    .read(file, sheetNo)
            }

        @JvmStatic
        @JvmOverloads
        fun <T : Any> readFlux(file: File, head: KClass<T>, sheetNo: Int = 0): Flux<T> =
            readFlux(file, head.java, sheetNo)
    }
}
