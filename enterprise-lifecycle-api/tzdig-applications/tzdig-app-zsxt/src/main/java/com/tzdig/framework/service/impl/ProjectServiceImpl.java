package com.tzdig.framework.service.impl;

import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.file.util.TempFileUtilKt;
import com.tzdig.framework.model.dto.TProjectDTO;
import com.tzdig.framework.model.vo.TProjectVO;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProject;
import com.tzdig.framework.mybatis.entity.zsxt.TProjShareProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjExchange;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProjectSigned;
import com.tzdig.framework.mybatis.service.zsxt.ITProjShareProject;
import com.tzdig.framework.service.IProjectService;
import com.tzdig.framework.web.util.ExcelWriteUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;

import java.io.File;
import java.util.List;

@Service
public class ProjectServiceImpl implements IProjectService {

    @Resource
    private ITProjProject tProjProjectService;

    @Resource
    private ITProjProjectSigned itProjProjectSignedService;

    @Resource
    private ITProjShareProject itProjShareProjectService;

    @Resource
    private ITProjExchange itProjExchangeService;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public Boolean toShare(TProjectDTO dto) {
        TProjProject entity = tProjProjectService.getById(dto.getId());
        if (entity == null) {
            return false;
        }
        // 1. 更新原意向项目状态为“已流转至共享” (2)
        entity.setSjStatus(2);
        tProjProjectService.updateById(entity);
        // 2. 创建并保存新的共享项目记录
        TProjShareProject share = new TProjShareProject();
        share.setInvestor(entity.getInvestor());
        share.setPType(entity.getPType());
        share.setInvestMoney(entity.getInvestMoney());
        share.setDistrict(entity.getDistrict());
        share.setDistrictCode(entity.getDistrictCode());
        share.setZoneCode(entity.getZoneCode());
        share.setZoneName(entity.getZoneName());
        share.setDesc(entity.getDesc());
        share.setCreatorId(entity.getCreatorId());
        share.setCreatorName(entity.getCreatorName());
        share.setProgress("1"); // 1-待认领
        share.setSjly(2);       // 对应老系统 2-再谈归入
        share.setQtjd(entity.getProgress());
        share.setRemark(dto.getFqyy());
        return itProjShareProjectService.save(share);
    }

//    /**
//     * 计算签约金额 (qyje)
//     */
//    private Double calculateQyje(int pType, Double investMoney) {
//        if (investMoney == null) {
//            return 0.0;
//        }
//        if (pType == 1) {
//            return investMoney;
//        }
//
//        String currentYear = String.valueOf(LocalDate.now().getYear());
//        QueryWrapper queryWrapper = new QueryWrapper()
//                .where("b_year = " + currentYear);
//        TProjExchange exchange = itProjExchangeService.getOne(queryWrapper);
//        if (exchange != null && exchange.getExchangeRate() != null) {
//            return (investMoney * exchange.getExchangeRate().doubleValue()) / 10000.0;
//        }
//        return investMoney;
//    }

    @Override
    public FileDownloadVO export(TProjProject tProjProject) {
        QueryWrapper queryWrapper = buildQueryWrapper(tProjProject);
        List<TProjProject> list = tProjProjectService.list(queryWrapper);
        File file = new ExcelWriteUtils<>(TProjectVO.class)
                .writeWith(TempFileUtilKt.createNewTempFile("xlsx"), null, () -> Flux.fromIterable(list).map(record -> {
                    TProjectVO vo = new TProjectVO();
                    vo.setInvestor(record.getInvestor());

                    // 转译项目类别 (1-内资, 2-外资)
                    if (record.getPType() != null) {
                        vo.setPType(record.getPType() == 1 ? "内资" : "外资");
                    }
                    vo.setInvestMoney(record.getInvestMoney());
                    vo.setDesc(record.getDesc());
                    vo.setZoneName(record.getZoneName());
                    vo.setDistrict(record.getDistrict());
                    vo.setFirstTime(record.getFirstTime());
                    // 转译洽谈进度 (1-接洽中 2-已本地考察 3-签约前谈判 4-意向达成 5-签约)
                    String progress = record.getProgress();
                    if (progress != null) {
                        switch (progress) {
                            case "1":
                                vo.setProgress("接洽中");
                                break;
                            case "2":
                                vo.setProgress("已本地考察");
                                break;
                            case "3":
                                vo.setProgress("签约前谈判");
                                break;
                            case "4":
                                vo.setProgress("意向达成");
                                break;
                            case "5":
                                vo.setProgress("签约");
                                break;
                            default:
                                vo.setProgress(progress);
                        }
                    }
                    // 转译是否提请市级协调
                    if (record.getRequestCityCoordination() != null) {
                        vo.setRequestCityCoordination(record.getRequestCityCoordination() == 1 ? "是" : "否");
                    }
                    if (record.getSjStatus() != null) {
                        if (record.getSjStatus() == 1) {
                            vo.setSjStatus("流转至签约项目");
                        } else if (record.getSjStatus() == 2) {
                            vo.setSjStatus("流转至共享项目");
                        }
                    }
                    return vo;
                }));

        return FileDownloadVO.Companion.downloadVO(file, "项目列表导出.xlsx");
    }

    /**
     * 构建项目查询条件
     *
     * @param tProjProject 过滤条件
     * @return QueryWrapper
     */
    @Override
    public QueryWrapper buildQueryWrapper(TProjProject tProjProject) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (tProjProject == null) {
            return queryWrapper;
        }
        // --- 统一查询逻辑 (源自 TProjProjectController) ---
        // 投资方模糊查询
        if (!ObjectUtils.isEmpty(tProjProject.getInvestor())) {
            queryWrapper.like(TProjProject::getInvestor, tProjProject.getInvestor());
        }
        // 项目类别精确查询
        if (!ObjectUtils.isEmpty(tProjProject.getPType())) {
            queryWrapper.eq(TProjProject::getPType, tProjProject.getPType());
        }
        // 区域代码前缀匹配
        if (!ObjectUtils.isEmpty(tProjProject.getDistrictCode())) {
            queryWrapper.likeRight(TProjProject::getDistrictCode, tProjProject.getDistrictCode());
        }
        // 园区代码前缀匹配
        if (!ObjectUtils.isEmpty(tProjProject.getZoneCode())) {
            queryWrapper.likeRight(TProjProject::getZoneCode, tProjProject.getZoneCode());
        }
        // 是否市级协调
        if (!ObjectUtils.isEmpty(tProjProject.getRequestCityCoordination())) {
            queryWrapper.eq(TProjProject::getRequestCityCoordination, tProjProject.getRequestCityCoordination());
        }
        // 按创建时间降序
        queryWrapper.orderBy(TProjProject::getCreateTime).desc();
        return queryWrapper;
    }
}
