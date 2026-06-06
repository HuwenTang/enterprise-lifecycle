package com.tzdig.framework.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjMoneyItemDTO {

    private LocalDate bdate;

    private Double receivedMoney;
}
