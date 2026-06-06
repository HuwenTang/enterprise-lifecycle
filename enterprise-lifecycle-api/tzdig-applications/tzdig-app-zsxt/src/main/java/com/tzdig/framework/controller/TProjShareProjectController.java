package com.tzdig.framework.controller;

import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.vo.TManagerVO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProject;
import com.tzdig.framework.mybatis.entity.zsxt.TProjShareProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjShareProject;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.util.UserInfoUtil;
import com.tzdig.framework.web.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

@Tag(name = "共享项目管理")
@RestController
@RequestMapping("tProjShareProject")
public class TProjShareProjectController {

    @Resource
    private ITProjShareProject itProjShareProjectService;

    @Resource
    private ITProjProject itProjProject;
    /**
     * 分页查询共享项目列表
     */
    
    @Operation(summary = "项目列表")
    @PostMapping("/searchProjShareProject")
    @PageableQuery
    public PageableResult<TProjShareProject> searchProjShareProject(
            Pageable pageable,
            @RequestBody TProjShareProject entity) {

        QueryWrapper queryWrapper = new QueryWrapper();
            // 投资方模糊查询
            if (entity.getInvestor() != null && !entity.getInvestor().isEmpty()) {
                queryWrapper.like(TProjShareProject::getInvestor, entity.getInvestor());
            }
            // 项目类别精确查询
            if (entity.getPType() != null) {
                queryWrapper.eq(TProjShareProject::getPType, entity.getPType());
            }
            if (entity.getDistrictCode() != null) {
                queryWrapper.likeRight(TProjShareProject::getDistrictCode, entity.getDistrictCode());
            }
            // 园区模糊查询
            if (entity.getZoneCode() != null) {
                queryWrapper.likeRight(TProjShareProject::getZoneCode, entity.getZoneCode());
            }
        queryWrapper.orderBy(TProjShareProject::getCreateTime).desc();

        Page<TProjShareProject> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjShareProject> resultPage = itProjShareProjectService.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }


    
    @Operation(summary = "项目认领")
    @PostMapping("/claimProject")
    @PageableQuery
    public Boolean claimProject(@RequestBody TProjShareProject shareProject) {
        if(ObjectUtils.isEmpty(shareProject.getId())){
            throw new ApiException("id参数不能为空", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        TProjShareProject en = itProjShareProjectService.getById(shareProject.getId());
        en.setProgress("2");
        itProjShareProjectService.updateById(en);
        // 在谈项目新增一条记录
        TProjProject proj = new TProjProject();
        proj.setSjly(3);// 共享认领
        proj.setDistrict(en.getDistrict());
        proj.setDistrictCode(en.getDistrictCode());
        proj.setZoneCode(en.getZoneCode());
        proj.setZoneName(en.getZoneName());
        proj.setProgress(shareProject.getQtjd());
        proj.setInvestor(en.getInvestor());
        proj.setPType(en.getPType());
        proj.setInvestMoney(en.getInvestMoney());
        proj.setDesc(en.getDesc());
        proj.setCreatorId(en.getCreatorId());
        proj.setCreatorName(en.getCreatorName());
        return itProjProject.save(proj);
    }
    /**
     * 获取共享项目详情
     */
    
    @Operation(summary = "查看详情")
    @GetMapping("{id}")
    public TProjShareProject getProjShareProjectById(@PathVariable("id") String id) {
        return itProjShareProjectService.getById(id);
    }

    /**
     * 保存或更新共享项目
     */
    
    @Operation(summary = "保存或更新")
    @PostMapping("/updateOrSaveProjShareProj")
    public void updateOrSaveProjShareProj(@RequestBody TProjShareProject entity) {
        if (ObjectUtils.isEmpty(entity.getId())) {
            entity.setCreatorId(getUserAccount().getId());
            entity.setCreatorName(getUserAccount().getRealName());
            itProjShareProjectService.save(entity);
        } else {
            // 修改
            itProjShareProjectService.updateById(entity);
        }
    }

    /**
     * 删除共享项目
     */
    
    @Operation(summary = "删除项目")
    @DeleteMapping("{id}")
    public void delProjShareProject(@PathVariable("id") String id) {
        itProjShareProjectService.removeById(id);
    }
}
