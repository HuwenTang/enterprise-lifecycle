package com.tzdig.framework.mybatis.config

import org.mybatis.spring.annotation.MapperScan
import org.springframework.context.annotation.Configuration

@Configuration
@MapperScan(basePackages = ["com.tzdig.framework.mybatis.mapper", "com.tzdig.framework.mybatis.dao"])
class MybatisMapperAutoConfig
