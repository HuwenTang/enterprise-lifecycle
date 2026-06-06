package com.tzdig.framework.service.impl

import cn.idev.excel.FastExcel
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.model.excel.ProjectOnlineApprovalInfoDetailExcelRow
import com.tzdig.framework.model.excel.ProjectOnlineApprovalInfoExcelRow
import com.tzdig.framework.service.OnlineApprovalService
import com.tzdig.framework.web.util.ExcelReadUtils
import org.springframework.stereotype.Service
import java.io.File

@Service
class OnlineApprovalServiceImpl : OnlineApprovalService {
    override fun importApprovalServiceInfo(file: File) {
        val onlineApprovalId = file.nameWithoutExtension
        ExcelReadUtils.readFlux(file, ProjectOnlineApprovalInfoExcelRow::class)
            .map { it.toProjectOnlineApprovalInfo() }
            .collectList()
            .subscribe { records ->
                records.forEachIndexed { index, record ->
                    record.onlineApprovalId = onlineApprovalId
                    record.rowId = (index + 2).toShort()
                    record.id = "${record.onlineApprovalId}|${String.format("%03d", record.rowId)}"
                }
                records.batchInsert()
            }
    }

    override fun importApprovalServiceInfoDetail(file: File) {
        val onlineApprovalId = file.nameWithoutExtension
        val reader = FastExcel.read(file).build()
        val sheetList = reader.excelExecutor().sheetList()
            .let { it.subList(1, it.size) }
        for (sheet in sheetList) {
            println(sheet.sheetNo)
            println(sheet.sheetName)
            val rowId = Regex("^\\d+").find(sheet.sheetName)?.value?.toShortOrNull()
            ExcelReadUtils.readFlux(file, ProjectOnlineApprovalInfoDetailExcelRow::class, sheet.sheetNo)
                .map { it.toProjectOnlineApprovalInfoDetail() }
                .collectList()
                .subscribe { records ->
                    records.forEachIndexed { index, record ->
                        record.onlineApprovalId = onlineApprovalId
                        record.onlineApprovalInfoId = "${onlineApprovalId}|${String.format("%03d", rowId)}"
                    }
                    records.batchInsert()
                }
        }
    }
}
