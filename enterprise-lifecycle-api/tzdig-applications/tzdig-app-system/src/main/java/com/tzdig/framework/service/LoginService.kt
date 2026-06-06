package com.tzdig.framework.service

import com.tzdig.framework.model.dto.LoginDTO
import com.tzdig.framework.model.vo.SessionVO

interface LoginService {
    fun loginWithPassword(dto: LoginDTO): SessionVO
    fun loginWithTaizhengtong(dto: LoginDTO): SessionVO
    fun loginWithTaizhoutong(dto: LoginDTO): SessionVO
}
