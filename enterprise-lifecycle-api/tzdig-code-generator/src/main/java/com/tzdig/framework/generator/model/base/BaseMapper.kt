package com.tzdig.framework.generator.model.base

import com.mybatisflex.core.BaseMapper

interface BaseMapper<T : BaseModel<T>> : BaseMapper<T>
