package com.tzdig.framework.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson2.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.core.util.URLUtilsKt;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.file.service.FileService;
import com.tzdig.framework.file.util.CustomMultipartFile;
import com.tzdig.framework.file.util.TempFileUtilKt;
import com.tzdig.framework.model.dto.ProjCheckDTO;
import com.tzdig.framework.model.dto.TProjProjectSignedDTO;
import com.tzdig.framework.model.vo.TProjProjectSignedExportVO;
import com.tzdig.framework.mybatis.entity.view.XmJbxx;
import com.tzdig.framework.mybatis.entity.zsxt.*;
import com.tzdig.framework.mybatis.mapper.zsxt.*;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjExchange;
import com.tzdig.framework.mybatis.service.zsxt.ITProjPgyj;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProject;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProjectSigned;
import com.tzdig.framework.mybatis.vo.TProjProjectSignedReq;
import com.tzdig.framework.mybatis.vo.TProjProjectSignedVO;
import com.tzdig.framework.service.IProjProjectSignedService;
import com.tzdig.framework.service.ProjectZSCreateService;
import com.tzdig.framework.util.UserInfoUtil;
import com.tzdig.framework.web.exception.NotFoundException;
import com.tzdig.framework.web.rpc.OpenapiFeignClient;
import com.tzdig.framework.web.util.ExcelWriteUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xwpf.usermodel.*;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import reactor.core.publisher.Flux;

import java.io.*;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

/**
 * 签约项目业务 Service 实现类
 */
@Slf4j
@Service
public class ProjProjectSignedServiceImpl implements IProjProjectSignedService {

    @Resource
    private ITProjProjectSigned itProjProjectSignedService;

    @Resource
    private ITProjExchange itProjExchangeService;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    @Resource
    private TFileMapper fileMapper;

    @Resource
    private ProjectSignedFzMapper fzMapper;

    @Resource
    private ITProjPgyj itProjPgyj;

    @Resource
    private TProjTypeMapper projTypeMapper;

    @Resource
    private TProjSignedQrCodeMapper qrCodeMapper;

    @Resource
    private FileService fileService;

    @Resource
    private OpenapiFeignClient openapiFeignClient;

    @Resource
    private ITProjProject tProjProjectService;

    @Resource
    private ProjectZSCreateService zsCreateService;

    /**
     * 替换段落中的占位符（保持格式）
     */
    private static void replaceInParagraphsWithFormat(XWPFDocument document, Map<String, String> data) throws IOException, InvalidFormatException {
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            replaceInParagraphWithFormat(paragraph, data);
        }
    }

    /**
     * 在单个段落中替换占位符（保持格式）
     */
    private static void replaceInParagraphWithFormat(XWPFParagraph paragraph, Map<String, String> data) throws IOException, InvalidFormatException {
        String paragraphText = paragraph.getText();
        if (paragraphText != null && paragraphText.contains("${")) {

            // 遍历所有runs来查找和替换占位符
            for (XWPFRun run : paragraph.getRuns()) {
                String runText = run.getText(0);
                if (runText != null && runText.contains("${")) {
                    String newText = runText;

                    // 替换当前run中的占位符
                    for (Map.Entry<String, String> entry : data.entrySet()) {
                        String placeholder = "${" + entry.getKey() + "}";
                        if (newText.contains(placeholder)) {
                            newText = newText.replace(placeholder, entry.getValue());
                        }
                        if (newText.equals("${w}")) {
                            paragraph.removeRun(0);
                            addImageToParagraph(paragraph, data.get("Text1"));
                        }
                    }

                    // 只有当文本发生变化时才更新
                    if (!newText.equals(runText)) {
                        run.setText(newText, 0);
                    }
                }
            }
        }
    }

    private static void addImageToParagraph(XWPFParagraph paragraph, String text1) throws IOException, InvalidFormatException {
        XWPFRun run = paragraph.createRun();
        run.addPicture(new FileInputStream(text1), XWPFDocument.PICTURE_TYPE_PNG, text1, unitsToEMU(80), unitsToEMU(80)); // 设置宽高
    }

    private static int unitsToEMU(int i) {
        return i * 9525;
    }

    /**
     * 替换表格中的占位符（保持格式）
     */
    private static void replaceInTables(XWPFDocument document, Map<String, String> data) throws IOException, InvalidFormatException {
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph paragraph : cell.getParagraphs()) {
                        replaceInParagraphWithFormat(paragraph, data);
                    }
                }
            }
        }
    }

    /**
     * 替换页眉页脚
     */
    private static void replaceHeadersAndFooters(XWPFDocument document, Map<String, String> data) throws IOException, InvalidFormatException {
        // 替换页眉
        for (XWPFHeader header : document.getHeaderList()) {
            for (XWPFParagraph paragraph : header.getParagraphs()) {
                replaceInParagraphWithFormat(paragraph, data);
            }
        }

        // 替换页脚
        for (XWPFFooter footer : document.getFooterList()) {
            for (XWPFParagraph paragraph : footer.getParagraphs()) {
                replaceInParagraphWithFormat(paragraph, data);
            }
        }
    }

    public static String createQrCode(String obj, String wangge) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        String resourcesPath = System.getProperty("user.dir") + "/tzdig-applications/tzdig-app-zsxt/src/main/resources/";
        String savePath = resourcesPath + wangge + ".png";
        Path dirPath = FileSystems.getDefault().getPath(resourcesPath);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }
        BitMatrix bitMatrix = qrCodeWriter.encode(obj, BarcodeFormat.QR_CODE, 200, 200);
        Path file = FileSystems.getDefault().getPath(savePath);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", file);
        return savePath;
    }

    @Override
    public PageableResult<TProjProjectSigned> search(Pageable pageable, TProjProjectSignedDTO reqObj) {
        // 查询当前人员权限
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);

        QueryWrapper queryWrapper = new QueryWrapper();
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            queryWrapper.in("zone_code", zoneCodes);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("town_code", townCodes);
        }
        // 判断是否是驻外机构
        String orgCode = UserInfoUtil.getOrgCode();
        if (ObjectUtils.isNotEmpty(orgCode)) {
            queryWrapper.in("investor_place", orgCode);
        }

        // 提取核心查询条件
        String sInvestMoney = ObjectUtils.isNotEmpty(reqObj.getInvestMoney()) ? reqObj.getInvestMoney() : "";
        String hProgress = ObjectUtils.isNotEmpty(reqObj.getHprogress()) ? reqObj.getHprogress() : "";
        String sProgress = ObjectUtils.isNotEmpty(reqObj.getProgress()) ? reqObj.getProgress() : "";
        String rProgress = ObjectUtils.isNotEmpty(reqObj.getRprogress()) ? reqObj.getRprogress() : "";

        // ================== 进度条件逻辑 ==================1
        if (!hProgress.isEmpty() && sProgress.isEmpty()) {
            if ("0".equals(hProgress)) queryWrapper.and("((progress = '0' and check_status = 1) or progress > '0')");
            else if ("1".equals(hProgress))
                queryWrapper.and("((progress = '1' and check_status = 1) or progress > '1')");
            else if ("5".equals(hProgress))
                queryWrapper.and("((progress = '5' and check_status = 1) or progress in ('4','3','2'))");
            else if ("4".equals(hProgress))
                queryWrapper.and("((progress = '4' and check_status = 1) or progress in ('3','2'))");
            else if ("2".equals(hProgress))
                queryWrapper.and("((progress = '2' and check_status = 1) or progress = '3')");
            else if ("3".equals(hProgress)) queryWrapper.and("(progress = '3' and check_status = 1)");
            else if ("10".equals(hProgress))
                queryWrapper.and("(((progress in ('1','5','4')) and check_status = 1) or progress > '1')");
        }

        if (!rProgress.isEmpty()) {
            queryWrapper.eq("r_progress", rProgress);
        }

        if (!hProgress.isEmpty() && !sProgress.isEmpty()) {
            queryWrapper.eq("progress", sProgress);
        }

        if (!sProgress.isEmpty() && hProgress.isEmpty()) {
            if ("10".equals(sProgress)) {
                queryWrapper.and("progress in ('1', '5', '4')");
            } else {
                queryWrapper.eq("progress", sProgress);
            }
        }

        // ================== 基础状态与字段精确/模糊匹配 ==================
        queryWrapper.eq("deleted", 0);

        if (ObjectUtils.isNotEmpty(reqObj.getName())) queryWrapper.like("name", reqObj.getName());
        if (ObjectUtils.isNotEmpty(reqObj.getCode())) queryWrapper.like("code", reqObj.getCode());
        if (ObjectUtils.isNotEmpty(reqObj.getPtype())) queryWrapper.eq("p_type", reqObj.getPtype());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestorPlace()))
            queryWrapper.eq("investor_place", reqObj.getInvestorPlace());

        // ================== 投资额筛选逻辑 ==================
        if ("0".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 1) or (p_type = 2 and invest_money >= 1000))");
        } else if ("1".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 5) or (p_type = 2 and invest_money >= 3000))");
        } else if ("2".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 10) or (p_type = 2 and invest_money >= 10000))");
        }

        // ================== 其它条件关联 ==================
        if (ObjectUtils.isNotEmpty(reqObj.getDistrictCode()))
            queryWrapper.eq("district_code", reqObj.getDistrictCode());
        if (ObjectUtils.isNotEmpty(reqObj.getZoneCode())) queryWrapper.eq("zone_code", reqObj.getZoneCode());
        if (ObjectUtils.isNotEmpty(reqObj.getTownCode())) queryWrapper.eq("town_code", reqObj.getTownCode());
        if (ObjectUtils.isNotEmpty(reqObj.getIndustryCode()))
            queryWrapper.eq("industry_code", reqObj.getIndustryCode());
        if (ObjectUtils.isNotEmpty(reqObj.getProjType())) queryWrapper.likeLeft("proj_type", reqObj.getProjType());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestor())) queryWrapper.like("investor", reqObj.getInvestor());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestorType()))
            queryWrapper.eq("investor_type", reqObj.getInvestorType());
        if (ObjectUtils.isNotEmpty(reqObj.getCheckStatus())) queryWrapper.eq("check_status", reqObj.getCheckStatus());
        if (ObjectUtils.isNotEmpty(reqObj.getBindustry())) queryWrapper.eq("b_industry", reqObj.getBindustry());
        if (ObjectUtils.isNotEmpty(reqObj.getIndustryFirstCode()))
            queryWrapper.eq("industry_first_code", reqObj.getIndustryFirstCode());
        if (ObjectUtils.isNotEmpty(reqObj.getRemark())) queryWrapper.like("`desc`", reqObj.getRemark());

        // 日期筛选
        processDateRange(queryWrapper, "signed_stat_date", reqObj.getSignedStatDate());
        processDateRange(queryWrapper, "licence_date", reqObj.getSLicenceDate());
        processDateRange(queryWrapper, "start_date_commit", reqObj.getStartDateCommit());
        processDateRange(queryWrapper, "complete_date", reqObj.getCompleteDate());
        processDateRange(queryWrapper, "reg_stat_date", reqObj.getRegStatDate());
        processDateRange(queryWrapper, "check_stat_date", reqObj.getCheckStatDate());
        processDateRange(queryWrapper, "signed_date", reqObj.getSSignedDate());
        processDateRange(queryWrapper, "finish_check_date", reqObj.getFinishCheckDate());

        queryWrapper.orderBy("create_time", false);

        Page<TProjProjectSigned> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjProjectSigned> resultPage = itProjProjectSignedService.page(page, queryWrapper);

        return PageableResult.of(resultPage);
    }

    @Override
    public PageableResult<TProjProjectSigned> searchBy(Pageable pageable, TProjProjectSignedDTO reqObj) {
        QueryWrapper queryWrapper = buildSearchByQuery(reqObj);
        Page<TProjProjectSigned> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjProjectSigned> resultPage = itProjProjectSignedService.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    @Override
    public List<TProjProjectSigned> listBy(TProjProjectSignedDTO reqObj) {
        QueryWrapper queryWrapper = buildSearchByQuery(reqObj);
        return itProjProjectSignedService.list(queryWrapper);
    }

    private QueryWrapper buildSearchByQuery(TProjProjectSignedDTO reqObj) {
        QueryWrapper queryWrapper = new QueryWrapper();
        if (ObjectUtils.isNotEmpty(reqObj.getName())) queryWrapper.like("name", reqObj.getName());
        if (ObjectUtils.isNotEmpty(reqObj.getCode())) queryWrapper.like("code", reqObj.getCode());
        if (ObjectUtils.isNotEmpty(reqObj.getPtype())) queryWrapper.eq("p_type", reqObj.getPtype());
        if (ObjectUtils.isNotEmpty(reqObj.getDistrictCode())) queryWrapper.eq("district_code", reqObj.getDistrictCode());
        if (ObjectUtils.isNotEmpty(reqObj.getZoneCode())) queryWrapper.eq("zone_code", reqObj.getZoneCode());
        if (ObjectUtils.isNotEmpty(reqObj.getTownCode())) queryWrapper.eq("town_code", reqObj.getTownCode());
        if (ObjectUtils.isNotEmpty(reqObj.getIndustryCode())) queryWrapper.eq("industry_code", reqObj.getIndustryCode());
        if (ObjectUtils.isNotEmpty(reqObj.getProjType())) queryWrapper.likeLeft("proj_type", reqObj.getProjType());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestor())) queryWrapper.like("investor", reqObj.getInvestor());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestorPlace())) queryWrapper.eq("investor_place", reqObj.getInvestorPlace());
        if (ObjectUtils.isNotEmpty(reqObj.getInvestorType())) queryWrapper.eq("investor_type", reqObj.getInvestorType());
        if (ObjectUtils.isNotEmpty(reqObj.getCheckStatus())) queryWrapper.eq("check_status", reqObj.getCheckStatus());
        if (ObjectUtils.isNotEmpty(reqObj.getBindustry())) queryWrapper.eq("b_industry", reqObj.getBindustry());
        if (ObjectUtils.isNotEmpty(reqObj.getIndustryFirstCode())) queryWrapper.eq("industry_first_code", reqObj.getIndustryFirstCode());
        if (ObjectUtils.isNotEmpty(reqObj.getRemark())) queryWrapper.like("`desc`", reqObj.getRemark());
        if (ObjectUtils.isNotEmpty(reqObj.getProgress())) queryWrapper.eq("progress", reqObj.getProgress());
        if (ObjectUtils.isNotEmpty(reqObj.getRprogress())) queryWrapper.eq("r_progress", reqObj.getRprogress());
        String sInvestMoney = ObjectUtils.isNotEmpty(reqObj.getInvestMoney()) ? reqObj.getInvestMoney() : "";
        if ("0".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 1) or (p_type = 2 and invest_money >= 1000))");
        } else if ("1".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 5) or (p_type = 2 and invest_money >= 3000))");
        } else if ("2".equals(sInvestMoney)) {
            queryWrapper.and("((p_type = 1 and invest_money >= 10) or (p_type = 2 and invest_money >= 10000))");
        }
        processDateRange(queryWrapper, "signed_stat_date", reqObj.getSignedStatDate());
        processDateRange(queryWrapper, "licence_date", reqObj.getSLicenceDate());
        processDateRange(queryWrapper, "start_date_commit", reqObj.getStartDateCommit());
        processDateRange(queryWrapper, "complete_date", reqObj.getCompleteDate());
        processDateRange(queryWrapper, "reg_stat_date", reqObj.getRegStatDate());
        processDateRange(queryWrapper, "check_stat_date", reqObj.getCheckStatDate());
        processDateRange(queryWrapper, "signed_date", reqObj.getSSignedDate());
        processDateRange(queryWrapper, "finish_check_date", reqObj.getFinishCheckDate());
        queryWrapper.orderBy("create_time", false);
        return queryWrapper;
    }

    private void processDateRange(QueryWrapper queryWrapper, String column, String dateVal) {
        if (ObjectUtils.isNotEmpty(dateVal) && dateVal.contains("~")) {
            String[] split = dateVal.split("~");
            if (split.length == 2) {
                queryWrapper.ge(column, split[0].trim());
                queryWrapper.le(column, split[1].trim());
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveRemarks(TProjProjectSigned entity) {
        if (entity.getId() == null) {
            throw new RuntimeException("项目ID不能为空");
        }
        itProjProjectSignedService.updateById(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveTemp(TProjProjectSigned entity) {
        // 如果id不为空 查询id是否在再谈表 t_proj_project 如果有 更新成转签约
        entity.setId(ObjectUtils.isNotEmpty(entity.getId()) ? entity.getId() : String.valueOf(IdUtil.getSnowflakeNextId()));
        TProjProject oldProj = tProjProjectService.getById(entity.getId());
        if (oldProj != null) {
            oldProj.setSjStatus(1); // 1-流转至签约项目
            tProjProjectService.updateById(oldProj);
        }
        entity.setProgress(null);// 已签约
        entity.setCheckStatus(4);// 待审核
        entity.setPgStatus(null);
        setCreateUser(entity);
        handlerFile(entity);
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        if (ObjectUtils.isEmpty(signed)) {
            itProjProjectSignedService.save(entity);
        } else {
            itProjProjectSignedService.updateById(entity);
        }
    }

    private void setCreateUser(TProjProjectSigned entity) {
        entity.setCreatorId(getUserAccount().getId());
//        entity.setCreatorDept(vo.getDeptCode());
        entity.setCreatorName(getUserAccount().getRealName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void save(TProjProjectSigned entity) {
        // 获取token
        entity.setId(ObjectUtils.isNotEmpty(entity.getId()) ? entity.getId() : String.valueOf(IdUtil.getSnowflakeNextId()));
        int pType = entity.getPtype();
        entity.setProgress(0);// 已签约
        entity.setCheckStatus(0);// 待审核
        entity.setPgStatus("3");// 无需评估
        entity.setQyje(calculateQyje(entity.getPtype(), entity.getInvestMoney()));
        // 当签约金额小于1e 或者 1000w 审核直接通过无需质态评估
        if ((1 == pType && entity.getInvestMoney() < 1) || (2 == pType && entity.getInvestMoney() < 1000)) {
            entity.setCheckStatus(1);// 市级审核通过
            entity.setCode(getCode(entity));
            entity.setRProgress("0");
//            // 数据来源部门推荐
            if (entity.getProgress() == 0 && entity.getBresource() == 2) {
                openapiFeignClient.createProjectReview(JSON.toJSONString(toVO(entity)));
            }
        } else if ((1 == pType && entity.getInvestMoney() >= 5) || (2 == pType && entity.getInvestMoney() >= 3000)) {
            entity.setPgStatus("1");
            // 质态评估
            uploadQsmzq(entity);
        }
        handlerFile(entity);
        itProjProjectSignedService.save(entity);
        JSON.toJSONString(toXmJbxx(entity));
        // 同步全生命周期
        zsCreateService.createZS(toXmJbxx(entity));
    }

    private void uploadQsmzq(TProjProjectSigned entity) {
        openapiFeignClient.createQualityEvaluation(JSON.toJSONString(toVO(entity)));
    }

    private void handlerFile(TProjProjectSigned entity) {
        // 附件信息
        if (!CollectionUtils.isEmpty(entity.getFiles())) {
            String cate_code = "99,0,66";
            // 删除原有的附件 附则
            fileMapper.deleteByQuery(new QueryWrapper().eq("main_id", entity.getId()).in("cate_code", Arrays.asList(cate_code.split(","))));
            entity.getFiles().forEach(file -> {
                file.setMainId(entity.getId());
            });
            fileMapper.insertBatch(entity.getFiles());
        }
        // 附则信息
        if (!CollectionUtils.isEmpty(entity.getFzList())) {

            fzMapper.deleteByQuery(new QueryWrapper().eq("signed_id", entity.getId()));
            List<ProjectSignedFz> fzList = new ArrayList<>();
            entity.getFzList().forEach(item -> {
                ProjectSignedFz fz = new ProjectSignedFz();
                fz.setSignedId(entity.getId());
                fz.setContent(item);
                fzList.add(fz);
            });
            fzMapper.insertBatch(fzList);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(TProjProjectSigned entity) {
        int pType = entity.getPtype();
        double investMoney = entity.getInvestMoney();
        handlerFile(entity);
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        if (ObjectUtil.isEmpty(signed.getProgress()) || (signed.getProgress() == 0 && (signed.getCheckStatus() == 0 || signed.getCheckStatus() >= 3))) {
            entity.setPgStatus("3");
            entity.setCheckStatus(0);
            // 如果还没有质态评估
            if (((pType == 1 && investMoney >= 5) || (pType == 2 && investMoney >= 3000)) && (ObjectUtil.isEmpty(signed.getPgStatus()) || "1".equals(signed.getPgStatus()))) {
                entity.setPgStatus("1");
                // 数据同步企业生命周期
                uploadQsmzq(entity);
            } else if ((1 == pType && entity.getInvestMoney() < 1) || (2 == pType && entity.getInvestMoney() < 1000)) {
                entity.setCheckStatus(1);// 市级审核通过
                entity.setCode(getCode(entity));
                entity.setRProgress("0");
                // 数据来源部门推荐
                if (entity.getProgress() == 0 && entity.getBresource() == 2) {
                    openapiFeignClient.createProjectReview(JSON.toJSONString(toVO(entity)));
                }
            }
        } else {
            entity.setCheckStatus(signed.getCheckStatus());
        }
        itProjProjectSignedService.updateById(entity);
        // 同步全生命周期
        zsCreateService.createZS(toXmJbxx(entity));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrSaveRegister(TProjProjectSigned entity) {
        entity.setProgress(1);
        entity.setRProgress("1"); //认定状态
        entity.setCheckStatus(1);
        itProjProjectSignedService.updateById(entity);
        handlerOneTypeFile(entity);
        // 同步全生命周期
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        zsCreateService.createZS(toXmJbxx(signed));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrSaveBA(TProjProjectSigned entity) {
        entity.setProgress(5);
        entity.setRProgress("5"); //认定状态
        entity.setCheckStatus(1);
        handlerOneTypeFile(entity);
        itProjProjectSignedService.updateById(entity);
        // 同步全生命周期
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        zsCreateService.createZS(toXmJbxx(signed));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateOrSaveApprove(TProjProjectSigned entity) {
        entity.setProgress(4);
        entity.setRProgress("4"); //认定状态
        entity.setCheckStatus(1);
        handlerOneTypeFile(entity);
        itProjProjectSignedService.updateById(entity);
        // 同步全生命周期
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        zsCreateService.createZS(toXmJbxx(signed));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createKg(TProjProjectSigned entity) {
        entity.setProgress(2);
        entity.setCheckStatus(0);
        itProjProjectSignedService.updateById(entity);
        handlerOneTypeFile(entity);
        openapiFeignClient.startApproval(JSON.toJSONString(toKgVO(entity)));
        // 同步全生命周期
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        zsCreateService.createZS(toXmJbxx(signed));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createJg(TProjProjectSigned entity) {
        entity.setProgress(3);
        entity.setCheckStatus(0);
        itProjProjectSignedService.updateById(entity);
        handlerOneTypeFile(entity);
        openapiFeignClient.completionApproval(JSON.toJSONString(toJgVO(entity)));
        // 同步全生命周期
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        zsCreateService.createZS(toXmJbxx(signed));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public TFile exportWord(TProjProjectSigned signedEntity) {
        log.info("开始生成Word文档，项目ID: {}", signedEntity.getId());

        File tempFile = null;
        String qrCodeImagePath = null;
        try {
            int pType = signedEntity.getPtype();
            String templatePath = null;

            if (pType == 1) {
                templatePath = "template/内资.docx";
            } else {
                templatePath = "template/外资.docx";
            }

            Map<String, String> data = getMap(signedEntity);

            String uuid = UUID.randomUUID().toString().replace("-", "");
            String qrCodeContent = String.format("https://invest.swj.taizhou.gov.cn:443/h8/#/?id=%s&qrCode=%s", signedEntity.getQrKey(), uuid);
            qrCodeImagePath = createQrCode(qrCodeContent, uuid);
            data.put("Text1", qrCodeImagePath);

            String fileUid = UUID.randomUUID().toString();
            String tempFileName = fileUid + ".docx";

            try (InputStream fis = getClass().getClassLoader().getResourceAsStream(templatePath)) {
                if (fis == null) {
                    throw new RuntimeException("模板文件不存在: " + templatePath);
                }

                XWPFDocument document = new XWPFDocument(fis);

                try {
                    replaceInParagraphsWithFormat(document, data);
                    replaceInTables(document, data);
                    replaceHeadersAndFooters(document, data);

                    tempFile = File.createTempFile("signed_", ".docx");
                    try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                        document.write(fos);
                    }

                    TFile file = uploadWordFile(tempFile, tempFileName);

                    TProjSignedQrCode qrCode = new TProjSignedQrCode();
                    qrCode.setSignedId(signedEntity.getQrKey());
                    qrCode.setCode(uuid);
                    qrCodeMapper.insert(qrCode);

                    if (signedEntity.getId() != null) {
                        TProjProjectSigned signed = itProjProjectSignedService.getById(signedEntity.getId());
                        if (ObjectUtils.isNotEmpty(signed)) {
                            signed.setQrKey(signedEntity.getQrKey());
                            itProjProjectSignedService.updateById(signed);
                        }
                    }
                    log.info("Word文档生成并上传成功，文件路径: {}", file.getFilePath());
                    return file;
                } finally {
                    document.close();
                }
            }
        } catch (IOException e) {
            log.error("IO异常，生成Word文档失败", e);
            throw new RuntimeException("生成协议失败：文件读写异常", e);
        } catch (InvalidFormatException e) {
            log.error("格式异常，生成Word文档失败", e);
            throw new RuntimeException("生成协议失败：文档格式异常", e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                Thread.sleep(3000);
                cleanupTempFiles(qrCodeImagePath, tempFile);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

        }
    }

    private TFile uploadWordFile(File file, String fileName) {
        try {
            TFile file1 = new TFile();
            String contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            CustomMultipartFile multipartFile = new CustomMultipartFile(file, fileName, contentType);
            String uploadedFileName = fileService.upload(multipartFile);
            if (uploadedFileName == null) {
                throw new RuntimeException("文件上传失败");
            }
            String path = "/file/" + uploadedFileName + '#' + URLUtilsKt.getUrlEncoded(multipartFile.getOriginalFilename());
            file1.setName(multipartFile.getOriginalFilename());
            file1.setFilePath(path);
            return file1;
        } catch (Exception e) {
            log.error("上传Word文件失败", e);
            throw new RuntimeException("文件上传失败", e);
        }
    }

    private void cleanupTempFiles(String qrCodeImagePath, File tempFile) {
        try {
            if (qrCodeImagePath != null) {
                Path qrCodePath = FileSystems.getDefault().getPath(qrCodeImagePath);
                if (Files.exists(qrCodePath)) {
                    Files.delete(qrCodePath);
                }
            }

            if (tempFile != null && tempFile.exists()) {
                boolean deleted = tempFile.delete();
                if (!deleted) {
                    log.warn("临时文件删除失败: {}", tempFile.getAbsolutePath());
                }
            }
        } catch (Exception e) {
            log.warn("清理临时文件时发生异常", e);
        }
    }

    private Map<String, String> getMap(TProjProjectSigned entity) {
        Map<String, String> map = new HashMap<>();
        map.put("a", entity.getZsf() != null ? entity.getZsf() : "");
        map.put("b", entity.getTzf() != null ? entity.getTzf() : "");
        map.put("c", entity.getTzdz() != null ? entity.getTzdz() : "");
        map.put("d", entity.getName() != null ? entity.getName() : "");
        map.put("e", entity.getInvestMoney() != null ? entity.getInvestMoney().toString() : "");
        map.put("f", entity.getZhuceMoney() != null ? entity.getZhuceMoney() : "");
        map.put("g", entity.getProjectAddress() != null ? entity.getProjectAddress() : "");
        map.put("h", entity.getSqLandArea() != null ? entity.getSqLandArea() : "");
        map.put("i", entity.getPlanStartDate() != null ? entity.getPlanStartDate().toString() : "");
        map.put("j", entity.getPlanEndDate() != null ? entity.getPlanEndDate().toString() : "");
        map.put("k", entity.getYqKpxs1() != null ? entity.getYqKpxs1() : "");
        map.put("l", entity.getYqSs1() != null ? entity.getYqSs1() : "");

        StringBuilder text2 = new StringBuilder();
        if (entity.getFzList() != null && !entity.getFzList().isEmpty()) {
            // 添加每行内容
            for (int i = 0, len = entity.getFzList().size(); i < len; i++) {
                if (i > 0) {
                    text2.append("  ");
                }
                text2.append(entity.getFzList().get(i)).append("\r\n"); // 添加缩进
            }
        }
        map.put("m", text2.toString());
        return map;
    }

    /**
     * 处理同一种类型文件
     *
     * @param entity
     */
    private void handlerOneTypeFile(TProjProjectSigned entity) {
        // 查询所有cata_code
        List<String> str = entity.getFiles().stream().map(TFile::getCateCode)  // 假设 File 类有 getCataCode() 方法
                .collect(Collectors.toList());
        if (!CollectionUtils.isEmpty(entity.getFiles())) {
            // 处理图片 删除历史图片
            fileMapper.deleteByQuery(new QueryWrapper().eq("main_id", entity.getId()).in("cate_code", str));
            entity.getFiles().forEach(file -> {
                file.setMainId(entity.getId());
            });
            fileMapper.insertBatch(entity.getFiles());
        }
    }

    // 获取项目code
    private @Nullable String getCode(TProjProjectSigned entity) {
        // 查询这个机构的code
        TProjProjectSigned en = signedMapper.selectOneByQuery(new QueryWrapper().eq("district_code", entity.getDistrictCode()).eq("deleted", 0).isNotNull("code").limit(1));
        String code = en.getCode().substring(0,6);
        return code + System.currentTimeMillis();
    }

    /**
     * 计算签约金额 (qyje)
     */
    private Double calculateQyje(int pType, Double investMoney) {
        if (investMoney == null) return 0.0;
        if (pType == 1) return investMoney;
        String currentYear = String.valueOf(LocalDate.now().getYear());
        QueryWrapper queryWrapper = new QueryWrapper().where("b_year = " + currentYear);
        TProjExchange exchange = itProjExchangeService.getOne(queryWrapper);
        if (ObjectUtils.isEmpty(exchange)) {
            throw new NotFoundException("本年度无换算汇率!");
        }
        return (investMoney * exchange.getExchangeRate().doubleValue()) / 10000.0;
    }

    @Override
    public TProjProjectSigned findById(String id) {
        TProjProjectSigned entity = itProjProjectSignedService.getById(id);
        if (entity == null) {
            throw new NotFoundException("签约项目不存在");
        }

        // 查询附件信息
        List<com.tzdig.framework.mybatis.entity.zsxt.TFile> files = fileMapper.selectListByQuery(new QueryWrapper().eq("main_id", id));
        entity.setFiles(files);

        // 查询附则信息
        List<ProjectSignedFz> fzList = fzMapper.selectListByQuery(new QueryWrapper().eq("signed_id", id));
        entity.setFzLists(fzList);

        return entity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(String id) {
        TProjProjectSigned entity = itProjProjectSignedService.getById(id);
        if (entity == null) {
            throw new NotFoundException("签约项目不存在");
        }
        entity.setStatus("2");
        // 删除质态评估
        entity.setDeleted(true);
        itProjProjectSignedService.updateById(entity);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void checkProject(ProjCheckDTO checkDTO) throws JsonProcessingException {
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        Integer userLevel = zoneCodes.get(0).length() == 3 ? 1 : 2;

        TProjProjectSigned entity = itProjProjectSignedService.getById(checkDTO.getId());
        if (entity == null) {
            throw new RuntimeException("审核的项目不存在，请确认后再试！");
        }

        Integer checkStatus = entity.getCheckStatus();
        Integer progress = entity.getProgress();
        Integer pType = entity.getPtype();
        Double investMoney = entity.getInvestMoney();
        Integer bResource = entity.getBresource();

        if (checkDTO.getCheck() == 1) {
            if (checkStatus == 1) {
                throw new RuntimeException("该项目已经审核通过，无需再次通过");
            }
            if (userLevel == 2 && checkStatus == 2) {
                throw new RuntimeException("该项目已经审核通过，无需再次通过");
            }

            if ((userLevel == 1) && ((pType == 1 && investMoney >= 5) || (pType == 2 && investMoney >= 3000))) {
                entity.setCheckStatus(1);
                entity.setRProgress(progress.toString());
                if (progress == 0 && bResource == 2) {
                    openapiFeignClient.createProjectReview(JSON.toJSONString(toVO(entity)));
                }
            }
            if ((userLevel == 2) && ((pType == 1 && investMoney < 5) || (pType == 2 && investMoney < 3000))) {
                entity.setCheckStatus(1);
                entity.setRProgress("0");
                if (progress == 0 && bResource == 2) {
                    openapiFeignClient.createProjectReview(JSON.toJSONString(toVO(entity)));
                }
            }

            if ((userLevel == 2) && ((pType == 1 && investMoney >= 5) || (pType == 2 && investMoney >= 3000))) {
                entity.setCheckStatus(2);
                checkDTO.setCheck(2);
//                entity.setRProgress(progress == 0 ? null : progress == 1 ? "0" : progress == 5 ? "1" : progress == 4 ? "5" : null);
            }
            if (ObjectUtil.isEmpty(entity.getCode())) {
                entity.setCode(getCode(entity));
            }

            if (progress == 0) {
                entity.setSignedStatDate(LocalDate.now());
            } else if (progress == 1) {
                entity.setRegStatDate(LocalDate.now());
            } else if (progress == 5) {
                entity.setCheckStatDate(LocalDate.now());
            } else if (progress == 4) {
                entity.setFinishCheckDate(LocalDate.now());
            } else if (progress == 2) {
                entity.setStartDateCommit(LocalDate.now());
            } else if (progress == 3) {
                entity.setCompleteDate(LocalDate.now());
            }

            entity.setLastCheckDesc("");
        } else {
            if (userLevel == 2 && checkStatus == 2) {
                throw new RuntimeException("该项目已经提交上级审核，请确认后再试");
            }
            entity.setCheckStatus(3);
            entity.setLastCheckDesc(checkDTO.getFailContent());
        }
        // 添加日志
        itProjProjectSignedService.updateById(entity);
    }

    public TProjProjectSignedVO toVO(TProjProjectSigned entity) {
        TProjProjectSignedVO vo = new TProjProjectSignedVO();
        List<TFile> files = fileMapper.selectListByQuery(new QueryWrapper().eq("main_id",entity.getId()));
        vo.setId(entity.getId());
        vo.set_name(entity.getName());
        vo.set_code(entity.getCode());
        vo.setProject_content(entity.getDesc());
        vo.setDistrict_code(entity.getDistrictCode());
        vo.setDistrict(entity.getDistrict());
        vo.setZone_code(entity.getZoneCode());
        vo.setZone_name(entity.getZoneName());
        vo.setTown_code(entity.getTownCode());
        vo.setTown_name(entity.getTownName());
        vo.setP_type(entity.getPtype());
        vo.setInvest_money(entity.getInvestMoney());
        vo.setForeign_money(entity.getForeignMoney());
        vo.setProj_type(entity.getProjType());
        vo.setProj_type_name(entity.getProjTypeName());
        vo.setIndustry_first_code(entity.getIndustryFirstCode());
        vo.setIndustry_first_name(entity.getIndustryFirstName());
        vo.setIndustry_code(entity.getIndustryCode());
        vo.setIndustry_name(entity.getIndustryName());
        vo.setB_industry(entity.getBindustry());
        vo.setInvestor(entity.getInvestor());
        vo.setInvestor_type(entity.getInvestorType());
        vo.setInvestor_place(entity.getInvestorPlace());
        vo.setSigned_date(ObjectUtil.isEmpty(entity.getSignedDate()) ? null : DateUtil.date(entity.getSignedDate()).getTime());
        vo.setSigned_stat_date(ObjectUtil.isEmpty(entity.getSignedStatDate()) ? null : DateUtil.date(entity.getSignedStatDate()).getTime());
        vo.set_desc(entity.getDesc());
        vo.setCheck_name(entity.getCheckName());
        vo.setCheck_money(entity.getCheckMoney());
        vo.setCheck_date(ObjectUtil.isEmpty(entity.getCheckDate()) ? null : DateUtil.date(entity.getCheckDate()).getTime());
        vo.setCheck_stat_date(ObjectUtil.isEmpty(entity.getCheckStatDate()) ? null : DateUtil.date(entity.getCheckStatDate()).getTime());
        vo.setU_code(entity.getUcode());
        vo.setCy_gl(entity.getCyGl());
        vo.setCompany_name(entity.getCompanyName());
        vo.setReg_money(entity.getRegMoney());
        vo.setReg_date(ObjectUtil.isEmpty(entity.getRegDate()) ? null : DateUtil.date(entity.getRegDate()).getTime());
        vo.setReg_foreign_money(entity.getRegForeignMoney());
        vo.setReg_stat_date(ObjectUtil.isEmpty(entity.getRegStatDate()) ? null : DateUtil.date(entity.getRegStatDate()).getTime());
        vo.setIs_fixed_asset(entity.isFixedAsset());
        vo.setIs_use_land(entity.isUseLand());
        vo.setLand_licence(entity.getLandLicence());
        vo.setFinish_check_date(ObjectUtil.isEmpty(entity.getFinishCheckDate()) ? null : DateUtil.date(entity.getFinishCheckDate()).getTime());
        vo.setLicence_date(ObjectUtil.isEmpty(entity.getLicenceDate()) ? null : DateUtil.date(entity.getLicenceDate()).getTime());
        vo.setReceived_money(entity.getReceivedMoney());
        vo.setProgress(entity.getProgress());
        vo.setCheck_status(entity.getCheckStatus());
        vo.setStart_date_commit(ObjectUtil.isEmpty(entity.getStartDateCommit()) ? null : DateUtil.date(entity.getStartDateCommit()).getTime());
        vo.setComplete_date(ObjectUtil.isEmpty(entity.getCompleteDate()) ? null : DateUtil.date(entity.getCompleteDate()).getTime());
        vo.setLinker(entity.getLinker());
        vo.setLinker_tel(entity.getLinkerTel());
        vo.setLinker_tz(entity.getLinkerTz());
        vo.setLinker_tz_tel(entity.getLinkerTzTel());
        vo.setCreator_name(entity.getCreatorName());
        vo.setCreator_dept(entity.getCreatorDept());
        vo.setLast_check_desc(entity.getLastCheckDesc());
        vo.setCg_remark(entity.getCgRemark());
        vo.setActual_invest(entity.getActualInvest());
        vo.setStart_code(entity.getStartCode());
        vo.setActual_output(entity.getActualOutput());
        vo.setSum_actual_invest(entity.getSumActualInvest());
        vo.setUpdate_id(entity.getUpdateId());
        vo.setOld_create_by(entity.getOldCreateBy());
        vo.setOld_update_by(entity.getOldUpdateBy());
        vo.setOld_id(entity.getOldId());
        vo.setIs_sixpro(entity.isSixpro());
        vo.setSixpro_code(entity.getSixproCode());
        vo.setRemarks(entity.getRemarks());
        vo.setOrder_idx(entity.getOrderIdx());
        vo.setQyje(entity.getQyje());
        vo.setFixed_percent(entity.getFixedPercent());
        vo.setKgqr(entity.getKgqr());
        vo.setJgqr(entity.getJgqr());
        vo.setProj_level(entity.getProjLevel());
        vo.setIs_new(entity.isNew());
        vo.setIs_world(entity.isWorld());
        vo.setIs_china(entity.isChina());
        vo.setIs_listed(entity.isListed());
        vo.setIs_unicorn(entity.isUnicorn());
        vo.setMujun_tax(entity.getMujunTax());
        vo.setMain_customer(entity.getMainCustomer());
        vo.setPlan_total(entity.getPlanTotal());
        vo.setZhuce_money(entity.getZhuceMoney());
        vo.setPlan_start_date(ObjectUtil.isEmpty(entity.getPlanStartDate()) ? null : DateUtil.date(entity.getPlanStartDate()).getTime());
        vo.setPlan_end_date(ObjectUtil.isEmpty(entity.getPlanEndDate()) ? null : DateUtil.date(entity.getPlanEndDate()).getTime());
        vo.setProject_material(entity.getProjectMaterial());
        vo.setMain_process(entity.getMainProcess());
        vo.setIs_newproject(entity.isNewproject());
        vo.setIs_kc_proj(entity.isKcProj());
        vo.setIs_qflp(entity.isQflp());
        vo.setIs_gxjs(entity.isGxjs());
        vo.setTshy(entity.getTshy());
        vo.setZrxz(entity.getZrxz());
        vo.setLgxm(entity.getLgxm());
        vo.setZjspf(entity.getZjspf());
        vo.setZl_land_area(entity.getZlLandArea());
        vo.setZl_land_area_zs(entity.getZlLandAreaZs());
        vo.setKc_proj_tj(entity.getKcProjTj());
        vo.setKc_proj_type(entity.getKcProjType());
        vo.setCxqk(entity.getCxqk());
        vo.setIs_rzxq(entity.isRzxq());
        vo.setRz_money(entity.getRzMoney());
        vo.setProject_address(entity.getProjectAddress());
        vo.setSq_land_area(entity.getSqLandArea());
        vo.setIs_gx(entity.isGx());
        vo.setIs_gjs(entity.isGjs());
        vo.setIs_gyzl(entity.isGyzl());
        vo.setFar(entity.getFar());
        vo.setYq_kpxs(entity.getYqKpxs());
        vo.setYq_ss(entity.getYqSs());
        vo.setYq_worker(entity.getYqWorker());
        vo.setFixed_percent(entity.getFixedPercent());
        vo.setInvest_level(entity.getInvestLevel());
        vo.setYq_mjtax(entity.getYqMjtax());
        vo.setIs_waterpf(entity.isWaterpf());
        vo.setIs_wuran(entity.isWuran());
        vo.setTotal_use(entity.getTotalUse());
        vo.setIs_yanfa(entity.isYanfa());
        vo.setIs_zhuanli(entity.isZhuanli());
        vo.setIs_important(entity.isImportant());
        vo.setIs_zsh(entity.isZsh());
        vo.setZsh_name(entity.getZshName());
        vo.setYj_year(entity.getYjYear());
        vo.setRemark(entity.getRemark());
        vo.setIs_gazelle(entity.isGazelle());
        vo.setIs_specialized(entity.isSpecialized());
        vo.setDevice_invest(entity.getDeviceInvest());
        vo.setFixed_invest(entity.getFixedInvest());
        vo.setB_resource(entity.getBresource());
        vo.setSjjg_name(entity.getSjjgName());
        vo.setQy_linker(entity.getQyLinker());
        vo.setQy_phone(entity.getQyPhone());
        vo.setSq_land_year(entity.getSqLandYear());
        vo.setYq_cz1(entity.getYqCz1());
        vo.setZpj_level(entity.getZpjLevel());
        vo.setImport_proj_type(entity.getImportProjType());
        vo.setPlan_total1(entity.getPlanTotal1());
        vo.setPlan_total2(entity.getPlanTotal2());
        vo.setIs_import_proj(entity.isImportProj());
        vo.setFx_name(entity.getFxName());
        vo.setYq_kpxs1(entity.getYqKpxs1());
        vo.setYq_kpxs2(entity.getYqKpxs2());
        vo.setYq_kpxs3(entity.getYqKpxs3());
        vo.setYq_ss1(entity.getYqSs1());
        vo.setYq_ss2(entity.getYqSs2());
        vo.setYq_ss3(entity.getYqSs3());
        vo.setYq_mjtax1(entity.getYqMjtax1());
        vo.setYq_mjtax2(entity.getYqMjtax2());
        vo.setYq_mjtax3(entity.getYqMjtax3());
        vo.setStart_stat_date(ObjectUtil.isEmpty(entity.getStartDateCommit()) ? null : DateUtil.date(entity.getStartDateCommit()).getTime());
        vo.setComplete_stat_date(ObjectUtil.isEmpty(entity.getCompleteDate()) ? null : DateUtil.date(entity.getCompleteDate()).getTime());
        vo.setFinish_check_stat_date(ObjectUtil.isEmpty(entity.getFinishCheckDate()) ? null : DateUtil.date(entity.getFinishCheckDate()).getTime());
        String xyzzcl = "";
        String kccl = "";
        String ztpgzzcl = "";
        String kgzzcl = "";
        String rczzcl = "";
        String kczzcl = "";
        String jgzzcl = "";
        String str = "";
        if (CollectionUtil.isEmpty(files)) {
            files = entity.getFiles();
        }
        if (CollectionUtil.isNotEmpty(files)) {
            for (TFile tFile : files) {
                switch (tFile.getCateCode()) {
                    case "99":
                        ztpgzzcl += tFile.getFilePath() + ";";
                        break;
                    case "0":
                        xyzzcl += tFile.getFilePath() + ";";
                        break;
                    case "66":
                        kccl += tFile.getFilePath() + ";";
                        break;
                    case "98":
                        kgzzcl += tFile.getFilePath() + ";";
                        break;
                    case "77":
                        rczzcl += tFile.getFilePath() + ";";
                        break;
                    case "88":
                        kczzcl += tFile.getFilePath() + ";";
                        break;
                    case "97":
                        jgzzcl += tFile.getFilePath() + ";";
                        break;
                    default:
                        break;
                }
                vo.setKgzzcl(kgzzcl);
                vo.setRczzcl(rczzcl);
                vo.setKczzcl(kczzcl);
                vo.setJgzzcl(jgzzcl);
                vo.setKccl(kccl);
                vo.setZtpgzzcl(ztpgzzcl);
                vo.setXyzzcl(xyzzcl);
            }
        }
        return vo;
    }

    public Map<String, Object> toKgVO(TProjProjectSigned entity) {
        TProjProjectSigned signed = itProjProjectSignedService.getById(entity.getId());
        Map<String, Object> kg = new HashMap<>();
        kg.put("pzwh", entity.getPzwh());
        kg.put("cxqk", entity.getCxqk());
        kg.put("zone_name", entity.getKgZydw());
        kg.put("name", entity.getKgXmmc());
        kg.put("investor", entity.getKgTzfmc());
        kg.put("project_address", entity.getKgXmdz());
        kg.put("b_industry", entity.getKgXmlx());
        kg.put("is_kc_proj", signed.isKcProj());
        kg.put("kc_proj_tj", entity.getKcProjTj());
        kg.put("is_qflp", entity.getKgQflp());
        kg.put("u_code", entity.getKgTyxydm());
        kg.put("industry_code", entity.getKgHydm());
        kg.put("industry_name", entity.getKgHymc());
        kg.put("proj_type", entity.getKgCyfx());
        kg.put("invest_money", entity.getKgZtz());
        kg.put("fixed_invest", entity.getKgGdzctz());
        kg.put("id", entity.getId());
        kg.put("desc", entity.getKgJsnr());
        kg.put("kg_is_zkc", entity.getKgIsZkc());

        String kgzzcl = "";
        String kczzcl = "";
        String rczzcl = "";
        if (!CollectionUtils.isEmpty(entity.getFiles())) {
            for (TFile tFile : entity.getFiles()) {
                switch (tFile.getCateCode()) {
                    case "98":
                        kgzzcl += tFile.getFilePath() + ";";
                        break;
                    case "88":
                        kczzcl += tFile.getFilePath() + ";";
                        break;
                    case "77":
                        rczzcl += tFile.getFilePath() + ";";
                        break;
                    default:
                        break;
                }
            }
        }
        kg.put("kgzzcl", kgzzcl);
        kg.put("kczzcl", kczzcl);
        kg.put("rczzcl", rczzcl);

        kg.put("reg_date", ObjectUtil.isEmpty(entity.getRegDate()) ? null : DateUtil.date(signed.getRegDate()).getTime());
        kg.put("pzrq", ObjectUtil.isEmpty(entity.getPzrq()) ? null : DateUtil.date(entity.getPzrq()).getTime());
        kg.put("start_date_commit", ObjectUtil.isEmpty(entity.getStartDateCommit()) ? null : DateUtil.date(entity.getStartDateCommit()).getTime());
        kg.put("signed_stat_date", ObjectUtil.isEmpty(entity.getKgQyrq()) ? null : DateUtil.date(entity.getKgQyrq()).getTime());

        return kg;
    }

    public Map<String, Object> toJgVO(TProjProjectSigned entity) {
        Map<String, Object> jg = new HashMap<>();
        jg.put("complete_date", ObjectUtil.isEmpty(entity.getCompleteDate()) ? null : DateUtil.date(entity.getCompleteDate()).getTime());
        jg.put("id", entity.getId());
        jg.put("qy_total_num", entity.getQyTotalNum());
        jg.put("qy_sb_num", entity.getQySbNum());
        jg.put("qy_tzyf_num", entity.getQyTzyfNum());
        jg.put("qy_yf_money", entity.getQyYfMoney());
        jg.put("jg_is_zkc", entity.getJgIsZkc());

        String jgzzcl = "";
        if (!CollectionUtils.isEmpty(entity.getFiles())) {
            for (TFile tFile : entity.getFiles()) {
                switch (tFile.getCateCode()) {
                    case "97":
                        jgzzcl += tFile.getFilePath() + ";";
                        break;
                    default:
                        break;
                }
            }
        }
        jg.put("jgzzcl", jgzzcl);

        return jg;
    }

    @Override
    public FileDownloadVO exportExcel(TProjProjectSignedDTO reqObj) {
        Pageable pageable = new Pageable(1, 5000);
        PageableResult<TProjProjectSigned> result = search(pageable, reqObj);
        List<TProjProjectSigned> list = result.getRecords();

        File file = new ExcelWriteUtils<>(TProjProjectSignedExportVO.class).writeWith(TempFileUtilKt.createNewTempFile("xlsx"), null, () -> {
            return Flux.fromIterable(list).map(record -> {
                TProjProjectSignedExportVO vo = new TProjProjectSignedExportVO();
                BeanUtils.copyProperties(record, vo);
                vo.setPType(record.getPtype() != null && record.getPtype() == 1 ? "内资" : "外资");
                vo.setBindustry(ObjectUtil.isNotEmpty(record.getBindustry()) ? record.getBindustry() == 1 ? "服务业" : "制造业" : "");
                TProjType tProjType = projTypeMapper.selectOneByQuery(new QueryWrapper().eq("_code", record.getProjType()));
                vo.setProjType(ObjectUtil.isEmpty(tProjType) || ObjectUtil.isEmpty(tProjType.getName()) ? "" : tProjType.getName());
                vo.setInvestorPlace(getInvestorPlaceName(record.getInvestorPlace()));
                vo.setInvestorType(getInvestorTypeName(String.valueOf(record.getInvestorType())));
                vo.setProgress(getProgressName(String.valueOf(record.getProgress()), record.getCheckStatus()));
                vo.setBresource(record.getBresource() != null && record.getBresource() == 1 ? "自行接洽" : "市级机关推荐");
                vo.setSignedStatDate(LocalDateTimeUtil.format(record.getSignedStatDate(), "yyyy-MM-dd"));
                vo.setSignedDate(LocalDateTimeUtil.format(record.getSignedDate(), "yyyy-MM-dd"));
                return vo;
            });
        });

        return FileDownloadVO.Companion.downloadVO(file, "签约项目导出.xlsx");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bmpgCallBack(TProjProjectSignedReq req) {
        log.info("部门评估回调开始-------------------------");
        if (ObjectUtil.isEmpty(req.getSignedId())) {
            throw new NotFoundException("项目id不能为空");
        }
        List<TProjPgyj> lists = req.getPgList();
        String str = "";
        if (CollectionUtil.isNotEmpty(lists)) {
            for (TProjPgyj e : lists) {
                e.setId(String.valueOf(IdUtil.getSnowflakeNextId()));
                e.setSignedId(req.getSignedId().toString());
                str += String.format("评估单位: %s,评估人: %s,评估意见: %s,评估状态: %s;", e.getPgbm(), e.getName(), e.getPgyj(), e.getStatus());
                log.info("评估信息-----------------" + str);
            }
            itProjPgyj.saveBatch(lists);
        }
        TProjProjectSigned signed = itProjProjectSignedService.getById(req.getSignedId());
        signed.setPgStatus("2");
        signed.setTzfFx(str);
        itProjProjectSignedService.updateById(signed);
        log.info("部门评估回调结束-------------------------");
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void kgjgCheckCallBack(TProjProjectSignedReq req) {
        log.info("开工竣工审核回调开始-------------------------");
        if (ObjectUtil.isEmpty(req.getSignedId())) {
            throw new NotFoundException("项目id不能为空");
        }
        TProjProjectSigned signed = itProjProjectSignedService.getById(req.getSignedId());
        signed.setCheckStatus(req.getCheckStatus());
        // 审核拒绝
        if (3 == req.getCheckStatus()) {
            signed.setLastCheckDesc(req.getLastCheckDesc());
        } else {
            // 审核通过  工单认定状态 已开工
            signed.setRProgress(signed.getProgress().toString());
        }
        itProjProjectSignedService.updateById(signed);
        log.info("开工竣工审核回调结束-------------------------");
    }

    @Override
    public PageableResult<TProjProjectSigned> searchCheckList(Pageable pageable, TProjProjectSignedDTO reqObj) {
        // 查询当前人员权限
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);

        int userLevel = getUserLevel(zoneCodes.get(0));

        QueryWrapper queryWrapper = new QueryWrapper();
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            queryWrapper.in("zone_code", zoneCodes);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            queryWrapper.in("town_code", townCodes);
        }

        if (ObjectUtil.isNotEmpty(reqObj.getInvestMoney())) {
            String sInvestMoney = reqObj.getInvestMoney();
            if ("0".equals(sInvestMoney)) {
                queryWrapper.and("(p_type = 1 && invest_money >= 1) || (p_type = 2 && invest_money >= 1000)");
            } else if ("1".equals(sInvestMoney)) {
                queryWrapper.and("(p_type = 1 && invest_money >= 5) || (p_type = 2 && invest_money >= 3000)");
            } else if ("2".equals(sInvestMoney)) {
                queryWrapper.and("(p_type = 1 && invest_money >= 10) || (p_type = 2 && invest_money >= 10000)");
            }
        }
        if (ObjectUtil.isNotEmpty(reqObj.getName())) {
            queryWrapper.like("name", reqObj.getName());
        }

        if ("10".equals(reqObj.getProgress())) {
            queryWrapper.and("progress in (1, 5, 4)");
        } else if (ObjectUtil.isNotEmpty(reqObj.getProgress())) {
            queryWrapper.eq("progress", reqObj.getProgress());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getProjType())) {
            queryWrapper.eq("proj_type", reqObj.getProjType());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getInvestor())) {
            queryWrapper.like("investor", reqObj.getInvestor());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getDistrictCode())) {
            queryWrapper.eq("district_code", reqObj.getDistrictCode());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getZoneCode())) {
            queryWrapper.eq("zone_code", reqObj.getZoneCode());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getIndustryCode())) {
            queryWrapper.eq("industry_code", reqObj.getIndustryCode());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getPtype())) {
            queryWrapper.eq("p_type", reqObj.getPtype());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getInvestorType())) {
            queryWrapper.eq("investor_type", reqObj.getInvestorType());
        }

        if (ObjectUtil.isNotEmpty(reqObj.getCode())) {
            queryWrapper.eq("code", reqObj.getCode());
        }

//        if (ObjectUtil.isNotEmpty(reqObj.six())) {
//            queryWrapper.eq("sixpro_code", reqObj.getSSixproCode());
//        }

        queryWrapper.and("progress not in (2, 3)");

        if (userLevel == 1) {
//            queryWrapper.and("((p_type = 1 && invest_money >= 5) || (p_type = 2 && invest_money >= 3000))");
            queryWrapper.eq("check_status", 2);
        } else {
            queryWrapper.eq("check_status", 0);
        }

        queryWrapper.orderBy("create_time", false);
        Page<TProjProjectSigned> page = new Page<>(pageable.getPageNumber(), pageable.getPageSize());
        Page<TProjProjectSigned> resultPage = itProjProjectSignedService.page(page, queryWrapper);
        return PageableResult.of(resultPage);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void toSigned(TProjProjectSigned params) {
        // 1. 更新原意向项目状态为“已转签约” (1)
        TProjProject oldProj = tProjProjectService.getById(params.getId());
        if (oldProj != null) {
            oldProj.setSjStatus(1); // 1-流转至签约项目
            tProjProjectService.updateById(oldProj);
        }
        save(params);
    }

    private Integer getUserLevel(String deptCode) {
        if (deptCode == null) {
            return 0;
        }
        if (deptCode.length() == 3) {
            return 1;
        } else if (deptCode.length() == 6) {
            return 2;
        }
        return 3;
    }

    private String getInvestorPlaceName(String investorPlace) {
        if (ObjectUtil.isEmpty(investorPlace)) {
            return "";
        }
        switch (investorPlace) {
            case "101":
                return "北京（京津冀区域）";
            case "200":
                return "上海（长三角区域）";
            case "300":
                return "南京（南京、合肥区域）";
            case "400":
                return "深圳（珠三角区域）";
            case "500":
                return "内资其他";
            case "80":
                return "外资其他";
            case "81":
                return "其他（境内）";
            case "82":
                return "其他（境外）";
            case "90":
                return "香港";
            case "100":
                return "台湾";
            case "110":
                return "日本";
            case "120":
                return "韩国";
            case "130":
                return "美国";
            case "140":
                return "欧洲";
            case "150":
                return "新加坡";
            default:
                return "";
        }
    }

    private String getInvestorTypeName(String investorType) {
        if (ObjectUtil.isEmpty(investorType)) {
            return "";
        }
        switch (investorType) {
            case "10":
                return "央企";
            case "20":
                return "民营巨头";
            case "30":
                return "世界500强或跨国公司";
            case "40":
                return "其它";
            default:
                return "";
        }
    }

    private String getProgressName(String progress, Integer checkStatus) {
        if ("0".equals(progress)) {
            return "已签约";
        } else if ("1".equals(progress)) {
            return "已注册";
        } else if ("2".equals(progress)) {
            return "已开工";
        } else if ("3".equals(progress)) {
            return "已竣工";
        } else if ("4".equals(progress)) {
            return "完成报批";
        } else if ("5".equals(progress)) {
            return "已备案";
        }
        return "";
    }

    /**
     * 将TProjProjectSigned实体转换为XmJbxx实体
     *
     * @param entity TProjProjectSigned实体
     * @return XmJbxx实体
     */
    public XmJbxx toXmJbxx(TProjProjectSigned entity) {
        XmJbxx xmJbxx = new XmJbxx();
        xmJbxx.setXmid(entity.getId());
        xmJbxx.setXmbm(entity.getCode());
        // ssbk: if town_name is null use zone_name, else town_name
        xmJbxx.setSsbk(ObjectUtils.isEmpty(entity.getTownName()) ? entity.getZoneName() : entity.getTownName());
        xmJbxx.setIndustryName(entity.getIndustryName());
        TProjType t = projTypeMapper.selectOneByQuery(new QueryWrapper().eq("_code", entity.getProjType()));
        xmJbxx.setProjTypeName(t.getName());
        // xmsx: 固定值 "招商项目"
        xmJbxx.setXmsx("招商项目");
        xmJbxx.setXmnr(entity.getDesc());
        // tzbs: if p_type=1 then "内资" else "外资"
        xmJbxx.setTzbs(entity.getPtype() != null && entity.getPtype() == 1 ? "内资" : "外资");
        // investor_place/jt_place: 根据investor_place编码转换为中文名称
        String investorPlaceName = convertInvestorPlace(entity.getInvestorPlace());
        xmJbxx.setInvestorPlace(investorPlaceName);
        xmJbxx.setJtPlace(investorPlaceName);
        xmJbxx.setInvestMoney(entity.getInvestMoney());
        // zczb: if p_type=1 then reg_money else reg_foreign_money/10000
        Double zczb = 0.0;
        if (entity.getPtype() != null && entity.getPtype() == 1) {
            zczb = entity.getRegMoney();
        } else if (entity.getRegForeignMoney() != null) {
            zczb = entity.getRegForeignMoney() / 10000.0;
        }
        xmJbxx.setZczb(zczb);
        // dqjd: progress转换为中文
        xmJbxx.setDqjd(convertProgress(entity.getProgress()));
        xmJbxx.setRksj(DateUtil.date().toLocalDateTime());
        // zczj: same as zczb
        xmJbxx.setZczj(zczb);
        xmJbxx.setRegDate(entity.getRegDate());
        xmJbxx.setTzgm(entity.getTzgm());
        xmJbxx.setZjkc(entity.getZjkc());
        xmJbxx.setRegStatDate(entity.getRegStatDate());
        xmJbxx.setCheckName(entity.getCheckName());
        xmJbxx.setCheckMoney(entity.getCheckMoney());
        xmJbxx.setCheckDate(entity.getCheckDate());
        xmJbxx.setCheckStatDate(entity.getCheckStatDate());
        // is_fixed_asset: 1="是", 2="否"
        xmJbxx.setFixedAsset(convertIsYesNo(entity.isFixedAsset()));
        // is_use_land: 1="是", 2="否"
        xmJbxx.setUseLand(convertIsYesNo(entity.isUseLand()));
        xmJbxx.setLandLicence(entity.getLandLicence());
        xmJbxx.setLicenceDate(entity.getLicenceDate());
        xmJbxx.setFinishCheckDate(entity.getFinishCheckDate());
        xmJbxx.setStartDateCommit(entity.getStartDateCommit());
        xmJbxx.setCompleteDate(entity.getCompleteDate());
        xmJbxx.setNew(null);
        // xmpj: if p_type=1 then "内资" else "外资"
        xmJbxx.setXmpj(entity.getPtype() != null && entity.getPtype() == 1 ? "内资" : "外资");
        xmJbxx.setJhztz(null);
        xmJbxx.setXmxzwz(entity.getProjectAddress());
        xmJbxx.isZs();
        xmJbxx.setZshmc(null);
        xmJbxx.setProgress(convertProgress(entity.getProgress()));
        xmJbxx.setSignedDate(entity.getSignedDate());
        xmJbxx.setSignedStatDate(entity.getSignedStatDate());
        xmJbxx.setQyht(null);
        // wzzje: if p_type=2 then invest_money/10000 else 0
        Double wzzje = 0.0;
        if (entity.getPtype() != null && entity.getPtype() == 2 && entity.getInvestMoney() != null) {
            wzzje = entity.getInvestMoney() / 10000.0;
        }
        xmJbxx.setWzzje(wzzje);
        // nzzje: if p_type=1 then invest_money else 0
        Double nzzje = 0.0;
        if (entity.getPtype() != null && entity.getPtype() == 1 && entity.getInvestMoney() != null) {
            nzzje = entity.getInvestMoney();
        }
        xmJbxx.setNzzje(nzzje);
        xmJbxx.setProjectName(entity.getName());
        xmJbxx.setDistrict(entity.getDistrict());
        xmJbxx.setPark(entity.getZoneName());
        xmJbxx.setInvestor(entity.getInvestor());
        // investor_type: 根据编码转换为中文
        xmJbxx.setInvestorType(convertInvestorType(entity.getInvestorType()));
        xmJbxx.setUCode(entity.getUcode());
        xmJbxx.setCompanyName(entity.getCompanyName());
        xmJbxx.setRegMoney(entity.getRegMoney());
        xmJbxx.setQyLinker(entity.getQyLinker());
        xmJbxx.setQyPhone(entity.getQyPhone());
        xmJbxx.setSqLandYear(entity.getSqLandYear());
        xmJbxx.setYqCz(entity.getYqCz());
        xmJbxx.setZpLevel(entity.getZpjLevel());
        xmJbxx.setListed(entity.isListed() != null ? entity.isListed().shortValue() : null);
        xmJbxx.setProjectAddress(entity.getProjectAddress());
        xmJbxx.setSqLandArea(entity.getSqLandArea());
        xmJbxx.setPlanStartDate(entity.getPlanStartDate());
        xmJbxx.setPlanEndDate(entity.getPlanEndDate());
        xmJbxx.setPlanTotal(entity.getPlanTotal());
        xmJbxx.setFixedInvest(entity.getFixedInvest());
        xmJbxx.setDeviceInvest(entity.getDeviceInvest());
        xmJbxx.setZhuceMoney(entity.getZhuceMoney());
        xmJbxx.setInvestLevel(entity.getInvestLevel());
        xmJbxx.setYqKpxs(entity.getYqKpxs());
        xmJbxx.setYqSs(entity.getYqSs());
        xmJbxx.setYqMjtax(entity.getYqMjtax());
        xmJbxx.setTotalUse(entity.getTotalUse());
        xmJbxx.setWaterpf(entity.isWaterpf());
        xmJbxx.setWuran(entity.isWuran());
        xmJbxx.setImportProjType(entity.getImportProjType());
        xmJbxx.setImportProj(entity.isImportProj());
        xmJbxx.setPlanTotal1(entity.getPlanTotal1());
        xmJbxx.setPlanTotal2(entity.getPlanTotal2());
        xmJbxx.setWarningInvest(entity.isWarningInvest());
        xmJbxx.setFxName(entity.getFxName());
        xmJbxx.setYqKpxs1(entity.getYqKpxs1());
        xmJbxx.setYqKpxs2(entity.getYqKpxs2());
        xmJbxx.setYqKpxs3(entity.getYqKpxs3());
        xmJbxx.setYqSs1(entity.getYqSs1());
        xmJbxx.setYqSs2(entity.getYqSs2());
        xmJbxx.setYqSs3(entity.getYqSs3());
        xmJbxx.setYqMjtax1(entity.getYqMjtax1());
        xmJbxx.setYqMjtax2(entity.getYqMjtax2());
        xmJbxx.setYqMjtax3(entity.getYqMjtax3());
        xmJbxx.setTzfLevel(entity.getTzfLevel());
        xmJbxx.setTzfFx(entity.getTzfFx());
        xmJbxx.setCyGl(entity.getCyGl());
        xmJbxx.setCpGy(entity.getCpGy());
        xmJbxx.setTeam(entity.getTeam());
        xmJbxx.setDesc(entity.getDesc());
        xmJbxx.setIndustryCode(entity.getIndustryCode());
        xmJbxx.setZlNum(entity.getZlNum());
        xmJbxx.setSjProj(entity.getSjProjIs());
        xmJbxx.setHjContent(entity.getHjContent());
        xmJbxx.setBIndustry(entity.getBindustry() != null ? entity.getBindustry().shortValue() : null);
        xmJbxx.setBResource(entity.getBresource());
        xmJbxx.setSjjgName(entity.getSjjgName());
        xmJbxx.setYqCz1(entity.getYqCz1());
        xmJbxx.setYqCz2(entity.getYqCz2());
        xmJbxx.setYqCz3(entity.getYqCz3());
        xmJbxx.setCpQj(entity.getCpQj());
        xmJbxx.setGyXl(entity.getGyXl());
        xmJbxx.setGyLp(entity.getGyLp());
        xmJbxx.setGyPj(entity.getGyPj());
        xmJbxx.setZcfz(entity.getZcfz());
        xmJbxx.setLirun(entity.getLirun());
        xmJbxx.setXjll(entity.getXjll());
        xmJbxx.setGdldzb(entity.getZczb());
        xmJbxx.setZjly(entity.getZjly());
        xmJbxx.setXypj(entity.getXypj());
        xmJbxx.setXhpj(entity.getXhpj());
        xmJbxx.setHegui(entity.getHegui());
        xmJbxx.setZhpg(entity.getZhpg());
        xmJbxx.setStatus(entity.getCheckStatus() != null ? entity.getCheckStatus().shortValue() : null);
        xmJbxx.setRProgress(entity.getRProgress());
        xmJbxx.setCheckStatus(entity.getCheckStatus() != null ? entity.getCheckStatus().shortValue() : null);
        xmJbxx.setPgStatus(entity.getPgStatus());
        xmJbxx.setKcProj(entity.isKcProj());
        xmJbxx.setKcProjTj(entity.getKcProjTj());
        xmJbxx.setQflp(entity.isQflp());
        xmJbxx.setCgRemark(entity.getCgRemark());
        xmJbxx.setTshy(entity.getTshy());
        xmJbxx.setZrxz(entity.getZrxz());
        xmJbxx.setLgxm(entity.getLgxm());
        xmJbxx.setZjspf(entity.getZjspf());
        xmJbxx.setCpscxz(entity.getCpscxz());
        xmJbxx.setGysp(entity.getGysp());
        xmJbxx.setScxl(entity.getScxl());
        xmJbxx.setLpl(entity.getLpl());
        xmJbxx.setGxjs(entity.isGxjs());
        xmJbxx.setIfBuildYfzx(entity.getBuildYfzxIs());
        xmJbxx.setBuildYfzx(entity.getBuildYfzx());
        xmJbxx.setQyje(entity.getQyje() != null ? entity.getQyje() : null);
        xmJbxx.setIndustryFirstName(entity.getIndustryFirstName());
        xmJbxx.setIndustryFirstCode(entity.getIndustryFirstCode());
        xmJbxx.setRzxq(entity.isRzxq());
        xmJbxx.setRzMoney(entity.getRzMoney());
        xmJbxx.setZlLandArea(entity.getZlLandArea());
        xmJbxx.setZlLandAreaZs(entity.getZlLandAreaZs());
        xmJbxx.setPlaceInfo(entity.getPlaceInfo());
        xmJbxx.setYgmj(entity.getYgmj());
        xmJbxx.setPhmj(entity.getPhmj());
        return xmJbxx;
    }

    /**
     * 将investor_place编码转换为中文名称
     */
    private String convertInvestorPlace(String investorPlace) {
        if (ObjectUtils.isEmpty(investorPlace)) {
            return null;
        }
        switch (investorPlace) {
            case "120":
                return "韩国";
            case "130":
                return "美国";
            case "140":
                return "欧洲";
            case "150":
                return "新加坡";
            case "80":
                return "外资其他";
            case "81":
                return "其他（境内）";
            case "82":
                return "其他（境外）";
            case "101":
                return "北京（京津冀区域）";
            case "200":
                return "上海（长三角区域）";
            case "300":
                return "南京（南京、合肥区域）";
            case "400":
                return "深圳（珠三角区域）";
            case "500":
                return "内资其他";
            case "90":
                return "香港";
            case "100":
                return "台湾";
            case "110":
                return "日本";
            default:
                return investorPlace;
        }
    }

    /**
     * 将progress转换为中文
     */
    private String convertProgress(Integer progress) {
        if (progress == null) {
            return null;
        }
        switch (progress) {
            case 0:
                return "已签约";
            case 1:
                return "已注册";
            case 2:
                return "已开工";
            case 3:
                return "已竣工";
            case 4:
                return "完成报批";
            case 5:
                return "已备案";
            default:
                return null;
        }
    }

    /**
     * 将investor_type编码转换为中文
     */
    private String convertInvestorType(Integer investorType) {
        if (investorType == null) {
            return null;
        }
        switch (investorType) {
            case 10:
                return "央企";
            case 20:
                return "民营巨头";
            case 30:
                return "世界500强或跨国公司";
            case 40:
                return "其它";
            default:
                return investorType.toString();
        }
    }

    /**
     * 将1/2转换为是/否
     */
    private String convertIsYesNo(Integer value) {
        if (value == null) {
            return null;
        }
        if (value == 1) {
            return "是";
        } else if (value == 2) {
            return "否";
        }
        return value.toString();
    }

}
