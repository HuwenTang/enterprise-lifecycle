package com.tzdig.framework.generator.properties

import com.mybatisflex.kotlin.scope.runFlex
import com.tzdig.framework.generator.model.Columns
import com.tzdig.framework.generator.model.Tables
import com.tzdig.framework.generator.util.ResourceUtils.classLoader
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.apache.ibatis.logging.stdout.StdOutImpl
import org.springframework.boot.DefaultApplicationArguments
import org.yaml.snakeyaml.Yaml

class Configuration {
    var module: String
        get() = Companion.module
        set(value) {
            Companion.module = value
        }
    var subPackage: String
        get() = Companion.subPackage
        set(value) {
            Companion.subPackage = value
        }
    var mysql: Mysql
        get() = Companion.mysql
        set(value) {
            Companion.mysql = value
        }

    data class Mysql(
        var host: String = "localhost",
        var port: Int = 3306,
        var username: String = "",
        var password: String = "",
        var schema: String = "",
    )

    companion object {
        var mysql: Mysql = Mysql()
        var module: String = ""
        var subPackage: String = ""
        var tables: List<String> = emptyList()

        fun load(vararg args: String): Configuration = with(Yaml()) {
            val configuration = loadAs(
                classLoader.getResourceAsStream("configuration.yaml")!!,
                Configuration::class.java,
            )
            val applicationArguments = DefaultApplicationArguments(*args)
            mysql.host = applicationArguments.getOptionValues("host")?.firstOrNull() ?: mysql.host
            mysql.port = applicationArguments.getOptionValues("port")?.firstOrNull()?.toInt() ?: mysql.port
            mysql.username = applicationArguments.getOptionValues("username")?.firstOrNull() ?: mysql.username
            mysql.password = applicationArguments.getOptionValues("password")?.firstOrNull() ?: mysql.password
            mysql.schema = applicationArguments.getOptionValues("schema")?.firstOrNull() ?: mysql.schema
            module = applicationArguments.getOptionValues("module")?.firstOrNull() ?: module
            subPackage = applicationArguments.getOptionValues("sub-package")?.firstOrNull() ?: subPackage
            tables = applicationArguments.getOptionValues("tables")?.flatMap { it.split(",") } ?: emptyList()
            return configuration
        }
    }

    fun initializeDatabaseConnection() {
        val dataSource = with(HikariConfig()) {
            driverClassName = com.mysql.cj.jdbc.Driver::class.qualifiedName
            jdbcUrl = "jdbc:mysql://${mysql.host}:${mysql.port}/${mysql.schema}"
            username = mysql.username
            password = mysql.password
            maximumPoolSize = 5
            HikariDataSource(this)
        }
        runFlex {
            // 配置数据源 相当于 setDataSource(dataSource)
            +dataSource
            // 配置Mapper 相当于 addMapper(Columns::class.java)
            +Columns.Mapper::class
            +Tables.Mapper::class
            // 配置日志输出 相当于 setLogImpl(StdOutImpl::class.java)
            logImpl = StdOutImpl::class
        }
    }
}
