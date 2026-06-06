import com.tzdig.framework.SystemApplication
import com.tzdig.framework.file.properties.S3Properties
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(classes = [SystemApplication::class])
class SpringBootTestsDemo {
    @Autowired
    private lateinit var properties: S3Properties

    @Test
    fun test() {
        println(properties.provider)
    }
}
