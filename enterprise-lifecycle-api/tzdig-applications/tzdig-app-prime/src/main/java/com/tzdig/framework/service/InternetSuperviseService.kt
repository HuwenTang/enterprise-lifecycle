package com.tzdig.framework.service

import com.tzdig.framework.model.vo.UserInfoVO
import com.tzdig.framework.mybatis.entity.system.UserAccount

interface InternetSuperviseService {
    fun getUserInfo(user: UserAccount):UserInfoVO

    fun getStatistic(): Long
}
