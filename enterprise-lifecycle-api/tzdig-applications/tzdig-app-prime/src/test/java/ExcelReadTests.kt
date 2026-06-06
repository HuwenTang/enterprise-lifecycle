import cn.idev.excel.context.AnalysisContext
import cn.idev.excel.read.listener.ReadListener
import com.tzdig.framework.model.dto.ProjectOnlineApprovalExcelRow
import com.tzdig.framework.web.util.ExcelReadUtils
import java.io.File
import kotlin.test.Test

class ExcelReadTests : ReadListener<ProjectOnlineApprovalExcelRow> {
    private val dataList = mutableListOf<ProjectOnlineApprovalExcelRow>()

    @Test
    fun test() {
        val file = File("/tmp/download/e0a92420-bdb5-4a24-9827-67e7fca7cae0.xlsx")
        ExcelReadUtils.readFlux(file, ProjectOnlineApprovalExcelRow::class)
            .subscribe { println(it) }
//        FastExcel.read()
//            .filedCacheLocation(CacheLocationEnum.NONE)
//            .excelType(ExcelTypeEnum.XLSX)
//            .registerReadListener(this)
//            .file("/tmp/download/e0a92420-bdb5-4a24-9827-67e7fca7cae0.xlsx")
//            .head(ProjectOnlineApprovalExcelRow::class.java)
//            .sheet(0)
//            .doRead()
    }

    override fun invoke(
        data: ProjectOnlineApprovalExcelRow,
        context: AnalysisContext?
    ) {
        println(data)
        dataList.add(data)
    }

    override fun doAfterAllAnalysed(context: AnalysisContext) {
        println("ok")
    }
}
