package com.tzdig.framework.mybatis.vo;

import lombok.Data;

/**
 * 老系统用户相关信息
 */
@Data
public class TManagerVO {

    private Long id;

    private String loginName;

    private String userName;

    private String deptCode;

    private String deptName;

    private Integer isAdmin;

    private Integer userLevel;

}
