import org.junit.Test
import java.time.LocalDateTime

class DateTimeTests {
    @Test
    fun parse() {
        val dt = LocalDateTime.parse("2025-01-01T00:00:00")
        print(dt)
    }
}
