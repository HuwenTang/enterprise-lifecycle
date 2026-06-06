package com.tzdig.framework.service

import com.tzdig.framework.core.model.vo.SimpleValueDTO
import com.tzdig.framework.model.dto.ExtZsProjProjectSignedDTO
import com.tzdig.framework.model.dto.ExtZsProjectOperationDTO

interface ProjectReviewService {
    fun createQualityEvaluationTask(dto: ExtZsProjProjectSignedDTO)

    fun createProjectReviewTask(dto: ExtZsProjProjectSignedDTO)
    fun createProjectCompletionReview(dto: ExtZsProjectOperationDTO)
    fun generateWarning(zsId : String): SimpleValueDTO<MutableList<String>>
    fun createStartApproval(dto: ExtZsProjectOperationDTO)


}
