package com.tzdig.framework.web.config

import com.alibaba.fastjson2.toJSONString
import com.mybatisflex.kotlin.extensions.db.deleteWith
import com.mybatisflex.kotlin.extensions.db.update
import com.mybatisflex.kotlin.extensions.kproperty.eq
import com.mybatisflex.kotlin.extensions.kproperty.lt
import com.mybatisflex.kotlin.extensions.model.batchInsert
import com.tzdig.framework.core.annotation.CustomJob
import com.tzdig.framework.core.annotation.DistributedLock
import com.tzdig.framework.mybatis.entity.system.SystemScheduledJob
import com.tzdig.framework.mybatis.entity.system.scheduled.info.ScheduledInfo
import io.swagger.v3.oas.annotations.Operation
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.boot.web.context.WebServerInitializedEvent
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.ContextClosedEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.util.ClassUtils
import java.net.NetworkInterface
import java.time.LocalDateTime
import kotlin.random.Random

@Configuration
class ScheduleJobConfig(
    private val serverProperties: ServerProperties,
    private val applicationContext: ApplicationContext,
    @param:Value($$"${server.prefer-ip-prefix:}")
    private val preferIpPrefix: String,
) {
    companion object {
        private val instanceId = Random.nextLong(Long.MAX_VALUE / 100, Long.MAX_VALUE / 10)
        var serverIp: String? = null
            private set
        var serverPort: Int? = null
            private set
        var serverContextPath: String? = null
            private set

        fun check(scheduledJob: SystemScheduledJob): Boolean {
            if (serverIp != scheduledJob.ip) return false
            if (serverPort != scheduledJob.port) return false
            if (instanceId != scheduledJob.pid) return false
            if (serverContextPath != scheduledJob.contextPath) return false
            return true
        }
    }

    @EventListener(WebServerInitializedEvent::class)
    fun onApplicationEvent(event: WebServerInitializedEvent) {
        serverContextPath = serverProperties.servlet.contextPath
        serverPort = event.webServer.port
        for (ni in NetworkInterface.getNetworkInterfaces()) {
            if (ni.isLoopback || ni.isVirtual || ni.isPointToPoint || !ni.isUp) {
                continue
            }
            for (addr in ni.inetAddresses) {
                if (!addr.isLoopbackAddress) {
                    val address = addr.hostAddress
                    if (address.startsWith(preferIpPrefix)) {
                        serverIp = address
                        break
                    }
                }
            }
            if (!serverIp.isNullOrEmpty()) break
        }
    }

    @EventListener(ApplicationReadyEvent::class)
    fun readyEvent() {
        if (serverIp.isNullOrEmpty()) return
        this.closeEvent()
        val result = mutableListOf<SystemScheduledJob>()
        val beanNames = applicationContext.beanDefinitionNames
        for (beanName in beanNames) {
            val bean = applicationContext.getBean(beanName)
            var beanClass = bean::class.java
            if (beanClass.name.contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {
                beanClass = beanClass.getSuperclass()
            }
            if (beanClass == ScheduleJobConfig::class.java) {
                continue
            }
            for (method in beanClass.getDeclaredMethods()) {
                val scheduled = method.getAnnotation(Scheduled::class.java)
                val customJob = method.getAnnotation(CustomJob::class.java)
                val operation = method.getAnnotation(Operation::class.java)
                if (scheduled == null && customJob == null) continue
                if (operation?.hidden == true) continue
                val record = SystemScheduledJob {
                    this.pid = instanceId
                    this.ip = serverIp
                    this.port = serverPort
                    this.contextPath = serverContextPath
                    this.summary = operation?.summary?.takeIf { it.isNotBlank() }
                        ?: "${beanName}.${method.name}()"
                    this.beanName = beanName
                    this.beanClass = beanClass.typeName
                    this.methodName = method.name
                    this.scheduledProps = scheduled?.let { ScheduledInfo(it).toJSONString() }
                    this.parameterTypes = method.parameterTypes.map { it.typeName }.toJSONString()
                }
                result.add(record)
            }
        }
        if (result.isNotEmpty()) {
            result.batchInsert()
        }
    }

    @EventListener(ContextClosedEvent::class)
    fun closeEvent() {
        deleteWith<SystemScheduledJob> {
            (SystemScheduledJob::pid eq instanceId)
                .and(SystemScheduledJob::ip eq serverIp)
                .and(SystemScheduledJob::port eq serverPort)
        }
    }

    @Operation(hidden = true)
    @Scheduled(cron = "0 * * * * ?")
    @DistributedLock
    fun clear() {
        update<SystemScheduledJob> {
            and(SystemScheduledJob::pid eq instanceId)
            and(SystemScheduledJob::ip eq serverIp)
            and(SystemScheduledJob::port eq serverPort)
        }
        deleteWith<SystemScheduledJob> {
            val dt = LocalDateTime.now().minusMinutes(3)
            SystemScheduledJob::updateTime lt dt
        }
    }
}
