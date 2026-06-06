import com.mybatisflex.kotlin.extensions.db.query
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.inList
import com.mybatisflex.kotlin.extensions.kproperty.notIn
import com.tzdig.framework.PrimeApplication
import com.tzdig.framework.core.extension.string
import com.tzdig.framework.core.extension.toJsonRequest
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalInvestmentAttracting
import com.tzdig.framework.mybatis.entity.prime.ProjectDigitalProjectReviewAll
import okhttp3.OkHttpClient
import okhttp3.Request
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(classes = [PrimeApplication::class])
@ActiveProfiles("prd")
class CallbackTests {
    private val okHttpClient = OkHttpClient()

    @Test
    fun test() {

        val list = query<ProjectDigitalInvestmentAttracting> {
            and(ProjectDigitalInvestmentAttracting::auditStatusKaigong eq "2")
            and(ProjectDigitalInvestmentAttracting::rProgress notIn listOf("2", "3"))
        }.mapNotNull { it.id }
        val reviews = query<ProjectDigitalProjectReviewAll> {
            where(ProjectDigitalProjectReviewAll::digitalInvestmentId inList list)
            and(ProjectDigitalProjectReviewAll::step eq "4")
        }
//        reviews.forEachIndexed {index, it->
//            println(index)
//        }
        reviews.forEach { review ->
            val signId = query<ProjectDigitalInvestmentAttracting> {
                and(ProjectDigitalInvestmentAttracting::id eq review.digitalInvestmentId)
            }.firstNotNullOf { it.investOnlineId }
            val item = buildString {
                append("项目审核结果：")
                append("委办局：${review.deptName}， ")
                append("审核结果：${if (true) "通过" else "未通过"}，")
                append("审核评价：${review.comment ?: "无"}。")
            }
            val requestBody = mapOf(
                "signedId" to signId,
                "checkStatus" to if (true) 1 else 3,
                "lastCheckDesc" to item,
            ).toJsonRequest()
            val request = Request.Builder()
                .url("http://172.22.71.96/zsxt-api/tProjProjectSigned/kgjgCheckCallBack")
                .header("Authorization", "zJ_GLBcxJF5sxe65w_sQmYps2QslH8Zb07__")
                .post(requestBody)
                .build()
            okHttpClient.newCall(request).execute().use { response ->
                println(response.string())
            }
        }

    }
}
