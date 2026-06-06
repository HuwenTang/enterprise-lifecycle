package com.tzdig.framework.web.util

import cn.idev.excel.FastExcel
import cn.idev.excel.enums.CellDataTypeEnum
import cn.idev.excel.metadata.Head
import cn.idev.excel.metadata.data.WriteCellData
import cn.idev.excel.write.handler.CellWriteHandler
import cn.idev.excel.write.handler.SheetWriteHandler
import cn.idev.excel.write.metadata.holder.WriteSheetHolder
import cn.idev.excel.write.metadata.holder.WriteTableHolder
import cn.idev.excel.write.metadata.holder.WriteWorkbookHolder
import cn.idev.excel.write.style.column.LongestMatchColumnWidthStyleStrategy
import com.tzdig.framework.core.annotation.ExcelOptions
import com.tzdig.framework.core.util.SpringUtils
import com.tzdig.framework.web.annotation.ExcelAreaName
import com.tzdig.framework.web.annotation.ExcelLabel
import com.tzdig.framework.web.service.AreaService
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.util.CellRangeAddressList
import reactor.core.publisher.Flux
import java.io.File
import kotlin.reflect.KClass

class ExcelWriteUtils<T : Any>(
    private val head: Class<T>,
) : SheetWriteHandler, CellWriteHandler {
    constructor(head: KClass<T>) : this(head.java)

    fun writeWith(file: File, fields: Set<String>? = null, data: () -> Flux<T>): File {
        FastExcel.write()
            .registerWriteHandler(LongestMatchColumnWidthStyleStrategy())
            .registerWriteHandler(this)
            .file(file)
            .head(head)
            .includeColumnFieldNames(fields)
            .build()
            .use { writer ->
                val sheet = FastExcel.writerSheet("Sheet").build()
                data()
                    .buffer()
                    .doOnNext { writer.write(it, sheet) }
                    .blockLast()
            }
        return file
    }

    override fun afterCellDataConverted(
        writeSheetHolder: WriteSheetHolder,
        writeTableHolder: WriteTableHolder?,
        cellData: WriteCellData<*>,
        cell: Cell,
        head: Head,
        relativeRowIndex: Int,
        isHead: Boolean,
    ) {
        if (isHead) return
        val value = when (cellData.type) {
            CellDataTypeEnum.STRING -> cellData.stringValue
            CellDataTypeEnum.BOOLEAN -> cellData.booleanValue.toString()
            CellDataTypeEnum.NUMBER -> cellData.numberValue.toString()
            else -> return
        }
        val catalog = head.field?.getAnnotation(ExcelLabel::class.java)
            ?.catalog
        if (catalog != null) {
            cellData.type = CellDataTypeEnum.STRING
            cellData.stringValue = DictUtils.getDictLabelByCode(catalog, value)
            return
        }
        val excelArea = head.field?.getAnnotation(ExcelAreaName::class.java)
        if (excelArea != null) {
            cellData.type = CellDataTypeEnum.STRING
            cellData.stringValue = areaService.getById(value)?.name ?: value
            return
        }
    }

    @JvmOverloads
    fun writeTemplate(file: File, dictSheets: Map<String, List<String>> = emptyMap()): File {
        FastExcel.write()
            .registerWriteHandler(LongestMatchColumnWidthStyleStrategy())
            .registerWriteHandler(this)
            .file(file)
            .excludeColumnFieldNames(listOf("failReason"))
            .build()
            .use { writer ->
                val sheet = FastExcel.writerSheet("Sheet")
                    .head(head)
                    .build()
                writer.write(emptyList<T>(), sheet)
                for ((dictName, dictValues) in dictSheets) {
                    val sheet = FastExcel.writerSheet("hidden_${dictName}")
                        .needHead(false)
                        .build()
                    writer.write(dictValues.data(), sheet)
                }
            }
        return file
    }

    override fun afterCellDispose(
        writeSheetHolder: WriteSheetHolder,
        writeTableHolder: WriteTableHolder?,
        cellDataList: List<WriteCellData<*>>,
        cell: Cell,
        head: Head,
        relativeRowIndex: Int,
        isHead: Boolean,
    ) {
        if (!isHead) return
        val options = head.field.getAnnotation(ExcelOptions::class.java)
            ?: return
        val helper = writeSheetHolder.sheet.dataValidationHelper
        val refers = $$"hidden_$${options.value}!$A$1:$A$$${EXCEL_MAX_LINE}"
        val constraint = helper.createFormulaListConstraint(refers)
        val addressList = CellRangeAddressList(1, EXCEL_MAX_LINE, head.columnIndex, head.columnIndex)
        val dataValidation = helper.createValidation(constraint, addressList)
        writeSheetHolder.sheet.addValidationData(dataValidation)
    }

    override fun afterSheetCreate(
        writeWorkbookHolder: WriteWorkbookHolder,
        writeSheetHolder: WriteSheetHolder,
    ) {
        val workbook = writeWorkbookHolder.workbook
        workbook.sheetIterator()
            .withIndex()
            .forEach { (index, sheet) ->
                val hidden = sheet.sheetName.startsWith("hidden_")
                workbook.setSheetHidden(index, hidden)
            }
    }

    private fun List<String>.data() = map {
        object {
            @Suppress("unused")
            val value = it
        }
    }

    companion object {
        private const val EXCEL_MAX_LINE = 1 shl 20 - 1
        private val areaService: AreaService by lazy { SpringUtils.getBean() }
    }
}
