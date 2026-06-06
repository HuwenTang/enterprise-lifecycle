package com.tzdig.framework.core.constant

object CacheConstants {
    // Authorization
    const val USER_ACCOUNT = "Authorization::user-account:userId+1h"
    const val USER_PERMISSION = "Authorization::user-permission:userId+1h"
    const val USER_ORGANIZATION = "Authorization::user-organization:organizationId+1h"
    const val USER_ORGANIZATIONS = "Authorization::user-organization:userid+5m"
    const val USER_ROLE = "Authorization::user-role:roleId+1h"
    const val USER_ROLES = "Authorization::user-role:userid+30m"
    const val USER_DATA_GRANTS = "Authorization::user-data-grants:userId+1h"
    const val USER_ORGANIZATION_UPPER = "Authorization::upper-organization:organizationId+12h"
    const val USER_ORGANIZATION_LOWER = "Authorization::lower-organization:organizationId+24h"

    // System
    const val SYSTEM_DICT = "System::dict+60m"
    const val SYSTEM_AREA = "System::area+60m"
    const val SYSTEM_SETTINGS = "System::settings+12h"

    // Api
    const val TAIZHENGTONG_APP_TOKEN = "Api::taizhengtong-app-token+90m"
    const val TAIZHENGTONG_FETCH_DEPARTMENTS = "Api::taizhengtong-fetch-departments+60m"
    const val TAIZHENGTONG_FETCH_STAFFS = "Api::taizhengtong-fetch-staffs+60m"

    const val STATISTIC_HOME = "Statistic::home+24h"

    // Prime Business
    const val PRIME_PRE_EVALUATION_STATISTICS = "Prime::pre-evaluation-statistics:year,projectType+5m"

    // Prime Business - 五大战区首页统计缓存
    const val PRIME_ZONE_INVESTMENT_HOME_STATISTICS = "Prime::zone-investment-home-statistics:year,amountRange,sortBy+5m"
}
