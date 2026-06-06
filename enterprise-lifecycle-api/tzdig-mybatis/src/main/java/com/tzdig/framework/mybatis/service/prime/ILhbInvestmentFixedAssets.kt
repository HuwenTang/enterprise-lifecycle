package com.tzdig.framework.mybatis.service.prime

import com.mybatisflex.core.service.IService
import com.mybatisflex.spring.service.impl.ServiceImpl
import com.tzdig.framework.mybatis.entity.prime.LhbInvestmentFixedAssets
import com.tzdig.framework.mybatis.mapper.prime.LhbInvestmentFixedAssetsMapper
import org.springframework.stereotype.Service

@Service
class ILhbInvestmentFixedAssets : IService<LhbInvestmentFixedAssets>,
    ServiceImpl<LhbInvestmentFixedAssetsMapper, LhbInvestmentFixedAssets>()
