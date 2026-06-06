package com.tzdig.framework.service

import java.io.File

interface OnlineApprovalService {
    fun importApprovalServiceInfo(file: File)
    fun importApprovalServiceInfoDetail(file: File)
}
