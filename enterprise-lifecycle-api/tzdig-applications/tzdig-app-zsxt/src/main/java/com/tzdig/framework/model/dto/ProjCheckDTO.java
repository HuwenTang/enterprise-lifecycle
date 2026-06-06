package com.tzdig.framework.model.dto;

import lombok.Data;

/**
 * 签约项目审核 DTO
 */
@Data
public class ProjCheckDTO {
    
    /**
     * 项目ID
     */
    private String id;
    
    /**
     * 审核结果 1-通过 0-不通过
     */
    private Integer check;
    
    /**
     * 失败原因
     */
    private String failContent;
}