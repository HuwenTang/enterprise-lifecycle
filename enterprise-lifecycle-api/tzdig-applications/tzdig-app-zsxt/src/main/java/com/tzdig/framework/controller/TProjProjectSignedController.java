package com.tzdig.framework.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.file.util.TempFileUtilKt;
import com.tzdig.framework.model.dto.ProjCheckDTO;
import com.tzdig.framework.model.dto.TProjProjectSignedDTO;
import com.tzdig.framework.model.vo.TProjProjectSignedEntityVO;
import com.tzdig.framework.mybatis.entity.zsxt.TFile;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableQuery;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.service.zsxt.ITProjProjectSigned;
import com.tzdig.framework.mybatis.vo.TProjProjectSignedReq;
import com.tzdig.framework.service.IProjProjectSignedService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "签约项目")
@RestController
@RequestMapping("tProjProjectSigned")
public class TProjProjectSignedController {
    private static final List<String> DEFAULT_DISPLAY_FIELDS = new ArrayList<>();
    private static final Map<String, String> EXPORT_HEADER_MAP = new LinkedHashMap<>();

    static {
        DEFAULT_DISPLAY_FIELDS.add("name");
        DEFAULT_DISPLAY_FIELDS.add("code");
        DEFAULT_DISPLAY_FIELDS.add("signedStatDate");
        DEFAULT_DISPLAY_FIELDS.add("investMoney");
        EXPORT_HEADER_MAP.put("name", "项目名称");
        EXPORT_HEADER_MAP.put("code", "项目代码");
        EXPORT_HEADER_MAP.put("signedStatDate", "签约信息统计日期");
        EXPORT_HEADER_MAP.put("investMoney", "总投资");
        EXPORT_HEADER_MAP.put("districtCode", "市区");
        EXPORT_HEADER_MAP.put("zoneCode", "园区");
        EXPORT_HEADER_MAP.put("ptype", "项目类别");
        EXPORT_HEADER_MAP.put("projType", "项目类型");
        EXPORT_HEADER_MAP.put("industryCode", "行业编码");
        EXPORT_HEADER_MAP.put("investor", "投资方名称");
        EXPORT_HEADER_MAP.put("investorPlace", "投资方来源");
        EXPORT_HEADER_MAP.put("investorType", "投资方性质");
        EXPORT_HEADER_MAP.put("checkStatus", "审核状态");
        EXPORT_HEADER_MAP.put("finishCheckDate", "完成报批时间");
        EXPORT_HEADER_MAP.put("startDateCommit", "开工认定日期");
        EXPORT_HEADER_MAP.put("completeDate", "竣工认定日期");
    }

    @Resource
    private IProjProjectSignedService projProjectSignedService;

    @Resource
    private ITProjProjectSigned service;

    /**
     * 修改信息
     */
    
    @Operation(summary = "修改")
    @PutMapping("{id}")
    public Boolean update(@PathVariable("id") String id, @RequestBody TProjProjectSigned entity) {
        entity.setId(id);
        return service.updateById(entity);
    }

    /**
     * 删除
     */
    
    @Operation(summary = "删除")
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") String id) {
        service.removeById(id);
    }

    /**
     * 根据id删除签约项目（逻辑删除）
     */
    
    @Operation(summary = "根据id删除签约项目（逻辑删除）")
    @PostMapping("/deleteById")
    public void deleteById(@RequestBody TProjProjectSigned entity) {
        projProjectSignedService.deleteById(entity.getId());
    }

    /**
     * 将意向项目转为签约项目（原 toSigned 逻辑）
     * 提取自老系统：获取原项目参数生成签约项目、修改状态、判断是否进行质态评估等
     */
    
    @Operation(summary = "转签约")
    @PostMapping("/toSigned")
    public void toSigned(@RequestBody TProjProjectSigned params) {
        projProjectSignedService.toSigned(params);
    }

    /**
     * 根据条件多维度查询签约项目（原 searchProjProjectSigned 逻辑）
     * 提取自老系统：包含对项目进度、投资金额区间、各个时间范围、用户管辖权限的数据过滤。
     */
    
    @Operation(summary = "多维度查询签约项目")
    @PostMapping("/searchProjProjectSigned")
    @PageableQuery
    public PageableResult<TProjProjectSigned> searchProjProjectSigned(Pageable pageable, @RequestBody TProjProjectSignedDTO reqObj) {
        return projProjectSignedService.search(pageable, reqObj);
    }

    /**
     * 新增签约项目
     */
    
    @Operation(summary = "新增签约项目")
    @PostMapping("/save")
    public void save(@RequestBody TProjProjectSigned signedEntity) throws JsonProcessingException {
        projProjectSignedService.save(signedEntity);
    }

    /**
     * 更新签约项目
     */
    
    @Operation(summary = "更新签约项目")
    @PostMapping("/update")
    public void update(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.update(signedEntity);
    }

    /**
     * 注册
     */
    
    @Operation(summary = "注册")
    @PostMapping("/updateOrSaveRegister")
    public void updateOrSaveRegister(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.updateOrSaveRegister(signedEntity);
    }

    /**
     * 备案
     */
    
    @Operation(summary = "备案")
    @PostMapping("/updateOrSaveBA")
    public void updateOrSaveBA(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.updateOrSaveBA(signedEntity);
    }

    /**
     * 报批
     */
    
    @Operation(summary = "报批")
    @PostMapping("/updateOrSaveApprove")
    public void updateOrSaveApprove(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.updateOrSaveApprove(signedEntity);
    }

    /**
     * 开工
     */
    
    @Operation(summary = "开工")
    @PostMapping("/createKg")
    public void createKg(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.createKg(signedEntity);
    }

    /**
     * 竣工
     */
    
    @Operation(summary = "竣工")
    @PostMapping("/createJg")
    public void createJg(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.createJg(signedEntity);
    }


    /**
     * 竣工
     */
    
    @Operation(summary = "导出word文档")
    @PostMapping("/exportWord")
    public TProjProjectSignedEntityVO exportWord(@RequestBody TProjProjectSigned signedEntity) {
        TFile path = projProjectSignedService.exportWord(signedEntity);
        List<TFile> files = new ArrayList<>();
        files.add(path);
        signedEntity.setFiles(files);
        return new TProjProjectSignedEntityVO(signedEntity);
    }


    /**
     * 新增或修改签约项目
     */
    
    @Operation(summary = "新增或修改签约项目")
    @PostMapping("/saveTemp")
    public void saveTemp(@RequestBody TProjProjectSigned signedEntity) {
        projProjectSignedService.saveTemp(signedEntity);
    }

    /**
     * 保存备注信息
     */
    
    @Operation(summary = "保存备注信息")
    @PostMapping("/saveRemarks")
    public void saveRemarks(@RequestBody TProjProjectSigned entity) {
        projProjectSignedService.saveRemarks(entity);
    }

    /**
     * 根据id查询签约项目
     */
    
    @Operation(summary = "根据id查询签约项目")
    @PostMapping("/findById")
    public TProjProjectSignedEntityVO findById(@RequestBody TProjProjectSigned entity) {
        TProjProjectSigned en = projProjectSignedService.findById(entity.getId());
        return new TProjProjectSignedEntityVO(en);
    }

    /**
     * 审核签约项目
     */
    
    @Operation(summary = "审核签约项目")
    @PostMapping("/checkProject")
    public void checkProject(@RequestBody ProjCheckDTO checkDTO) throws JsonProcessingException {
        projProjectSignedService.checkProject(checkDTO);
    }

    /**
     * 导出签约项目Excel
     */
    
    @Operation(summary = "导出签约项目Excel")
    @PostMapping("/exportExcel")
    public FileDownloadVO exportExcel(@RequestBody TProjProjectSignedDTO reqObj) {

        return projProjectSignedService.exportExcel(reqObj);
    }

    @Operation(summary = "全生命周期回调接口")
    
    @PostMapping("/bmpgCallBack")
    public void bmpgCallBack(@RequestBody TProjProjectSignedReq req) {
        projProjectSignedService.bmpgCallBack(req);
    }

    @Operation(summary = "开工竣工回调接口")
    
    @PostMapping("/kgjgCheckCallBack")
    public void kgjgCheckCallBack(@RequestBody TProjProjectSignedReq req) {
        projProjectSignedService.kgjgCheckCallBack(req);
    }

    @Operation(summary = "审核列表查询")
    
    @PostMapping("/searchCheckList")
    @PageableQuery
    public PageableResult<TProjProjectSigned> searchCheckList(Pageable pageable, @RequestBody TProjProjectSignedDTO reqObj) {
        return projProjectSignedService.searchCheckList(pageable, reqObj);
    }


    @Operation(summary = "组合报表")
    @PostMapping("/searchProjProjectSignedBy")
    @PageableQuery
    public PageableResult<TProjProjectSigned> searchProjProjectSignedBy(Pageable pageable, @RequestBody TProjProjectSignedDTO reqObj) {
        PageableResult<TProjProjectSigned> resultPage = projProjectSignedService.searchBy(pageable, reqObj);
//        List<String> displayFields = parseDisplayFields(reqObj);
//        List<Map<String, Object>> records = resultPage.getRecords()
//                .stream()
//                .map(record -> toDynamicRecord(record, displayFields))
//                .collect(Collectors.toList());

        return new PageableResult<>(
                resultPage.getPage(),
                resultPage.getSize(),
                resultPage.getTotalPage(),
                resultPage.getTotal(),
                resultPage.getRecords()
        );
    }

    @Operation(summary = "组合报表导出")
    @PostMapping("/exportProjProjectSignedBy")
    public FileDownloadVO exportProjProjectSignedBy(@RequestBody TProjProjectSignedDTO reqObj) {
        List<TProjProjectSigned> list = projProjectSignedService.listBy(reqObj);
        List<String> displayFields = parseDisplayFields(reqObj);
        File file = TempFileUtilKt.createNewTempFile("xlsx");
        try (XSSFWorkbook workbook = new XSSFWorkbook(); FileOutputStream outputStream = new FileOutputStream(file)) {
            Sheet sheet = workbook.createSheet("组合报表");
            Row head = sheet.createRow(0);
            for (int i = 0; i < displayFields.size(); i++) {
                Cell cell = head.createCell(i);
                String field = displayFields.get(i);
                cell.setCellValue(EXPORT_HEADER_MAP.getOrDefault(field, field));
            }

            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> rowMap = toDynamicRecord(list.get(i), displayFields);
                Row row = sheet.createRow(i + 1);
                for (int j = 0; j < displayFields.size(); j++) {
                    String key = displayFields.get(j);
                    Object value = rowMap.get(key);
                    row.createCell(j).setCellValue(value == null ? "" : String.valueOf(value));
                }
            }
            workbook.write(outputStream);
        } catch (Exception e) {
            throw new RuntimeException("导出组合报表失败", e);
        }
        return FileDownloadVO.Companion.downloadVO(file, "签约项目组合报表导出.xlsx");
    }

    private List<String> parseDisplayFields(TProjProjectSignedDTO reqObj) {
        List<String> fields = reqObj == null ? new ArrayList<>() : reqObj.getDisplayFields();
        if (fields.isEmpty()) {
            fields = new ArrayList<>(DEFAULT_DISPLAY_FIELDS);
        }
        return fields.stream().map(this::normalizeField).distinct().collect(Collectors.toList());
    }

    private Map<String, Object> toDynamicRecord(TProjProjectSigned entity, List<String> displayFields) {
        Map<String, Object> row = new LinkedHashMap<>();
        BeanWrapper beanWrapper = new BeanWrapperImpl(entity);
        if (displayFields.isEmpty()) {
            for (java.beans.PropertyDescriptor descriptor : beanWrapper.getPropertyDescriptors()) {
                String field = descriptor.getName();
                if ("class".equals(field) || !beanWrapper.isReadableProperty(field)) {
                    continue;
                }
                row.put(field, beanWrapper.getPropertyValue(field));
            }
            return row;
        }
        for (String field : displayFields) {
            Object value = null;
            if (beanWrapper.isReadableProperty(field)) {
                value = beanWrapper.getPropertyValue(field);
            }
            row.put(field, value);
        }
        return row;
    }

    private String normalizeField(String field) {
        if (ObjectUtils.isEmpty(field)) {
            return field;
        }
        String normalized = field.trim();
        if ("projectName".equals(normalized)) return "name";
        if ("projectCode".equals(normalized)) return "code";
        if ("projectTotalInvest".equals(normalized)) return "investMoney";
        if ("statDate".equals(normalized)) return "signedStatDate";
        if ("finishCheckTime".equals(normalized)) return "finishCheckDate";
        if ("kgDate".equals(normalized)) return "startDateCommit";
        if ("jgDate".equals(normalized)) return "completeDate";
        return normalized;
    }
}
