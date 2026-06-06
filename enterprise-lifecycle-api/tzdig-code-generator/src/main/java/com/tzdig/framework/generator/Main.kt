package com.tzdig.framework.generator

import com.tzdig.framework.generator.model.Tables
import com.tzdig.framework.generator.properties.Configuration
import java.io.File

fun main(args: Array<String>) {
    Configuration.load(*args).initializeDatabaseConnection()
    val tables = Tables.getTables(Configuration.tables)
    val mybatisGenerator = MybatisGenerator(
        File("tzdig-mybatis/src/main/java"),
        packages = "com.tzdig.framework.mybatis",
        subPackage = Configuration.subPackage,
    )
    val primaryGenerator = PrimaryGenerator(
        File("tzdig-applications/tzdig-app-${Configuration.module}/src/main/java"),
        packages = "com.tzdig.framework",
        mybatisPackage = "com.tzdig.framework.mybatis",
        mybatisSubPackage = Configuration.subPackage,
    )
    for (table in tables) {
        mybatisGenerator.generate(table.tableName!!, table.tableComment!!)
        primaryGenerator.generate(table.tableName!!, table.tableComment!!)
    }
}
