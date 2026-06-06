package com.tzdig.framework.util;

import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.vo.TManagerVO;
import com.tzdig.framework.mybatis.entity.zsxt.TCommonManager;
import com.tzdig.framework.mybatis.service.zsxt.ITCommonManager;
import com.tzdig.framework.security.service.UserService;
import com.tzdig.framework.web.exception.ApiException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Set;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 用户信息工具类
 */
@Component
public class UserInfoUtil {

    private static ITCommonManager service;
    private static UserService userService;

    @Resource
    private ITCommonManager serviceResource;

    @Resource
    private UserService userServiceResource;

    @PostConstruct
    public void init() {
        service = serviceResource;
        userService = userServiceResource;
    }

    /**
     * 静态获取当前登录的管理员信息
     */
    public static TManagerVO getUserInfo() {
        if (getUserAccount() == null) {
            throw new ApiException("用户未登录", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String id = getUserAccount().getId();
        Set<String> deptList = userService.getCobsByUserid(id);
        if (ObjectUtils.isEmpty(deptList)) {
            throw new ApiException("未分配部门权限", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.where(TCommonManager::getUStatus).eq(1)
                .and(TCommonManager::getTztDept).in(deptList);
        // 如果有多条，限制取第一条
        queryWrapper.limit(1);

        TCommonManager manager = service.getOne(queryWrapper);
        if (manager == null) {
            throw new ApiException("用户信息获取失败，未找到有效的管理员记录", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        TManagerVO vo = new TManagerVO();
        BeanUtils.copyProperties(manager, vo);
        // 手动处理 ID 类型转换 (String -> Long)
        if (manager.getId() != null) {
            try {
                vo.setId(Long.valueOf(manager.getId()));
            } catch (NumberFormatException ignored) {
            }
        }
        return vo;
    }

    /**
     * 静态获取当前登录的管理员信息
     */
    public static String getOrgCode() {
        if (getUserAccount() == null) {
            throw new ApiException("用户未登录", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String id = getUserAccount().getId();
        Set<String> deptList = userService.getCobsByUserid(id);
        // 判断是否包含特定角色并返回对应的code
        if (deptList.contains("dyundHPrj88dFez3eFMMXpfwAlKP")) {
            return "400";
        }
        if (deptList.contains("JWux2unB2nP3I5ab5IPb6qGjIL71")) {
            return "200";
        }
        if (deptList.contains("pYulYfpgkRREtmkAmIaawVHKEMxg")) {
            return "101";
        }
        if (deptList.contains("rYuRCmwomzRFLxqLUDeDdEato3J")) {
            return "300";
        }
        return null;
    }
}
