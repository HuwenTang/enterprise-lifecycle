package com.tzdig.framework.model.vo;

import lombok.Data;

@Data
public class TActivitiesVO {

    private String zjbAddress;

    private String zjbCode;

    public TActivitiesVO(String zjbAddress, String zjbCode) {
        this.zjbCode = zjbCode;
        this.zjbAddress = zjbAddress;
    }
}
