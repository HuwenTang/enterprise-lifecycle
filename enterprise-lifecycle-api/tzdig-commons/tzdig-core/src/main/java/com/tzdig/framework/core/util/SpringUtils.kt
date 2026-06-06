package com.tzdig.framework.core.util

import org.springframework.beans.factory.InitializingBean
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class SpringUtils(
    private val applicationContext: ApplicationContext,
    private val environment: Environment,
) : InitializingBean {
    override fun afterPropertiesSet() {
        Companion.applicationContext = this.applicationContext
        Companion.environment = this.environment
    }

    companion object {
        private lateinit var applicationContext: ApplicationContext
        private lateinit var environment: Environment

        @JvmStatic
        inline fun <reified T> getBean() = getBean(T::class.java)

        @JvmStatic
        fun getBean(name: String) = applicationContext.getBean(name)

        @JvmStatic
        fun <T> getBean(clazz: Class<T>) = applicationContext.getBean(clazz)

        @JvmStatic
        fun <T> getBean(name: String, clazz: Class<T>) = applicationContext.getBean(name, clazz)

        @JvmStatic
        fun getProperty(key: String): String? = environment.getProperty(key)

        @JvmStatic
        fun <T : Any> getProperty(key: String, clazz: Class<T>): T? = environment.getProperty(key, clazz)
    }
}
