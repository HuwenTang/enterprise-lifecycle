package com.tzdig.framework.mybatis.base

import com.mybatisflex.core.BaseMapper

interface BaseMapper<T : BaseModel<T>> : BaseMapper<T>
