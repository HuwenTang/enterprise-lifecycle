package com.tzdig.framework.model.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ProjMoneyBatchDTO {

    private Long projId;

    private List<ProjMoneyItemDTO> bdateAndReceivedMoneysArrays;
}
