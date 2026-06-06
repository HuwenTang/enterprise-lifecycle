package com.tzdig.framework.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.idev.excel.EasyExcel;
import cn.idev.excel.ExcelWriter;
import cn.idev.excel.write.metadata.WriteSheet;
import com.tzdig.framework.mybatis.dto.HalfYearProjectReqDTO;
import com.tzdig.framework.mybatis.dto.KeyZoneAndQxScoreReqDTO;
import com.tzdig.framework.mybatis.dto.StatisticsSignedProjectReqDTO;
import com.tzdig.framework.mybatis.mapper.zsxt.TProjProjectSignedMapper;
import com.tzdig.framework.mybatis.vo.*;
import com.tzdig.framework.service.IStatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import com.mybatisflex.core.query.QueryWrapper;
import com.tzdig.framework.mybatis.entity.zsxt.TLy;
import com.tzdig.framework.mybatis.service.zsxt.ITBizInvest;
import com.tzdig.framework.mybatis.service.zsxt.ITLy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tzdig.framework.security.extension.UserExtensionKt.getUserAccount;

@Tag(name = "统计报表")
@RestController
@RequestMapping("statistics")
public class StatisticsController {

    @Resource
    private IStatisticsService statisticsService;

    @Resource
    private TProjProjectSignedMapper signedMapper;

    // ==================== 统计方法 ====================

    @Operation(summary = "统计各市（区）新签约总投资项目情况表")
    @PostMapping("/signedProjectInfo")
    public List<SignedProjectInfoVO> statisticsSignedProjectInfo(@RequestBody StatisticsSignedProjectReqDTO reqDTO) {
        return statisticsService.statisticsSignedProjectInfo(reqDTO);
    }

    @Operation(summary = "统计园区新签约总投资项目情况表")
    @PostMapping("/signedProjectInfoYq")
    public List<SignedProjectInfoVO> statisticsSignedProjectInfoYq(@RequestBody StatisticsSignedProjectReqDTO reqDTO) {
        return statisticsService.statisticsSignedProjectInfoYq(reqDTO);
    }

    @Operation(summary = "半年项目招引信息")
    @PostMapping("/halfYearProjInfo")
    public HalfYearProjectInfoVO statisticsHalfYearProjInfo(@RequestBody HalfYearProjectReqDTO reqDTO) {
        return statisticsService.statisticsHalfYearProjInfo(reqDTO);
    }

    @Operation(summary = "统计重点园区加分")
    @PostMapping("/keyZoneScorePlus")
    public List<KeyZoneScoreVO> statisticsKeyZoneScorePlus(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsKeyZoneScorePlus(reqDTO);
    }

    @Operation(summary = "统计重点园区年度任务以及完成数")
    @PostMapping("/keyZoneCompleteProjNums")
    public Map<String, KeyZoneScoreVO> statisticsKeyZoneCompleteProjNums(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsKeyZoneCompleteProjNums(reqDTO);
    }

    @Operation(summary = "统计区县重大加分项")
    @PostMapping("/qxScorePlus")
    public List<QxScoreVO> statisticsQxScorePlus(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsQxScorePlus(reqDTO);
    }

    @Operation(summary = "统计区县年度任务以及完成数")
    @PostMapping("/qxCompleteProjNums")
    public Map<String, QxScoreVO> statisticsQxCompleteProjNums(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsQxCompleteProjNums(reqDTO);
    }

    @Operation(summary = "按照区划统计项目的数量和金额")
    @PostMapping("/projectInfo")
    public Map<String, ProjectInfoVO> statisticsProjectInfo(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsProjectInfo(reqDTO);
    }

    @Operation(summary = "按照区划统计项目的数量和金额列表")
    @PostMapping("/projectInfoList")
    public List<ProjectInfoVO> statisticsProjectInfoList(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsProjectInfoList(reqDTO);
    }

    @Operation(summary = "按照区划和状态统计项目的数量和金额")
    @PostMapping("/projectStatusInfo")
    public List<ProjectInfoVO> statisticsProjectStatusInfo(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsProjectStatusInfo(reqDTO);
    }

    @Operation(summary = "按照区县和状态统计项目的数量和金额")
    @PostMapping("/statisticsProjectStatusInfoQx")
    public List<ProjectInfoVO> statisticsProjectStatusInfoQx(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsProjectStatusInfoQx(reqDTO);
    }

    @Operation(summary = "统计全市产业代码项目数量和投资额")
    @PostMapping("/sixCode")
    public Map<String, SignedProjectInfoVO> statisticsSixCode(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsSixCode(reqDTO);
    }

    @Operation(summary = "统计各区县项目数量和投资金额")
    @PostMapping("/projForQxMap")
    public Map<String, SignedProjectInfoVO> statisticProjForQxMap(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticProjForQxMap(reqDTO);
    }

    @Operation(summary = "统计各区县1+4项目数量和投资额")
    @PostMapping("/onePlusFourForQx")
    public List<OnePlusFourVo> statisticsOnePlusFourForQx(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsOnePlusFourForQx(reqDTO);
    }

    @Operation(summary = "统计各区县1+4项目数量和投资额")
    @PostMapping("/onePlusFourForQxYq")
    public List<OnePlusFourVo> statisticsOnePlusFourForQxYq(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.statisticsOnePlusFourForQxYq(reqDTO);
    }

    @Operation(summary = "统计签约项目区域趋势")
    @PostMapping("/countSignedProjQyqs")
    public List<SignedProjectInfoVO> countSignedProjQyqs(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.countSignedProjQyqs(reqDTO);
    }

    @Operation(summary = "统计签约项目产业分布")
    @PostMapping("/countSignedProjCyfb")
    public List<SignedProjectInfoVO> countSignedProjCyfb(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO) {
        return statisticsService.countSignedProjCyfb(reqDTO);
    }

    // ==================== 导出方法 ====================

    @Operation(summary = "导出各市（区）新签约总投资项目情况表")
    @PostMapping("/exportSignedProjectInfo")
    public void exportStatisticsSignedProjectInfo(@RequestBody StatisticsSignedProjectReqDTO reqDTO,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) {
        try {
            List<SignedProjectInfoVO> records = statisticsService.statisticsSignedProjectInfo(reqDTO);
            String fileName = "各市（区）新签约总投资项目情况表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template2.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 3;

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            for (int i = 0; i < records.size(); i++) {
                SignedProjectInfoVO vo = records.get(i);
                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums() != null ? vo.getProjNums() : 0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getProjTb() != null ? vo.getProjTb() + "%" : "");
                cell2.setCellStyle(borderStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(vo.getZtz() != null ? vo.getZtz() : 0.0);
                cell3.setCellStyle(borderStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(vo.getZtzTb() != null ? vo.getZtzTb() + "%" : "");
                cell4.setCellStyle(borderStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(vo.getNzProjNum() != null ? vo.getNzProjNum() : 0);
                cell5.setCellStyle(borderStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(vo.getNzTz() != null ? vo.getNzTz() : 0.0);
                cell6.setCellStyle(borderStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(vo.getWzProjNum() != null ? vo.getWzProjNum() : 0);
                cell7.setCellStyle(borderStyle);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(vo.getWzTz() != null ? vo.getWzTz() : 0.0);
                cell8.setCellStyle(borderStyle);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(vo.getNdmbrws() != null ? vo.getNdmbrws() : 0);
                cell9.setCellStyle(borderStyle);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(vo.getNdmbwcl() != null ? vo.getNdmbwcl() + "%" : "");
                cell10.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出园区新签约总投资项目情况表")
    @PostMapping("/exportSignedProjectInfoYq")
    public void exportStatisticsSignedProjectInfoYq(@RequestBody StatisticsSignedProjectReqDTO reqDTO,
                                                     HttpServletRequest request,
                                                     HttpServletResponse response) {
        try {
            List<SignedProjectInfoVO> records = statisticsService.statisticsSignedProjectInfoYq(reqDTO);
            String fileName = "园区新签约总投资项目情况表";
            setExcelResponseHeader(response, fileName);

            // 加载模板
            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template2.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            // 从第3行开始写入数据
            int startRow = 3;
            CellStyle stringStyle = workbook.createCellStyle();
            stringStyle.setDataFormat(workbook.createDataFormat().getFormat("@"));

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            for (int i = 0; i < records.size(); i++) {
                SignedProjectInfoVO vo = records.get(i);
                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums() != null ? vo.getProjNums() : 0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getProjTb() != null ? vo.getProjTb() + "%" : "");
                cell2.setCellStyle(borderStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(vo.getZtz() != null ? vo.getZtz() : 0.0);
                cell3.setCellStyle(borderStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(vo.getZtzTb() != null ? vo.getZtzTb() + "%" : "");
                cell4.setCellStyle(borderStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(vo.getNzProjNum() != null ? vo.getNzProjNum() : 0);
                cell5.setCellStyle(borderStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(vo.getNzTz() != null ? vo.getNzTz() : 0.0);
                cell6.setCellStyle(borderStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(vo.getWzProjNum() != null ? vo.getWzProjNum() : 0);
                cell7.setCellStyle(borderStyle);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(vo.getWzTz() != null ? vo.getWzTz() : 0.0);
                cell8.setCellStyle(borderStyle);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(vo.getNdmbrws() != null ? vo.getNdmbrws() : 0);
                cell9.setCellStyle(borderStyle);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(vo.getNdmbwcl() != null ? vo.getNdmbwcl() + "%" : "");
                cell10.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出各区县1+4项目数量和投资额")
    @PostMapping("/exportOnePlusFourForQx")
    public void exportStatisticsOnePlusFourForQx(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) {
        try {
            List<OnePlusFourVo> records = statisticsService.statisticsOnePlusFourForQx(reqDTO);
            String fileName = "各区县1+4项目数量和投资额";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template3.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 5; // 从第5行开始写入（0-indexed = 第5行）

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            // 计算合计
            long t1Total = 0;
            double t2Total = 0;
            long[] childT1 = new long[9];
            double[] childTze = new double[9];

            for (int i = 0; i < records.size(); i++) {
                OnePlusFourVo vo = records.get(i);
                t1Total += vo.getProjNums();
                t2Total += vo.getZtz();

                Row row = sheet.createRow(startRow + i);
                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums());
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getZtz());
                cell2.setCellStyle(borderStyle);

                int col = 3;
                for (int j = 0; j < vo.getChildren().size() && j < 9; j++) {
                    OnePlusFourVo.OnePlusFourClassify child = vo.getChildren().get(j);
                    childT1[j] += child.getT1();
                    childTze[j] += child.getTze();

                    Cell cellT1 = row.createCell(col++);
                    cellT1.setCellValue(child.getT1());
                    cellT1.setCellStyle(borderStyle);

                    Cell cellT2 = row.createCell(col++);
                    cellT2.setCellValue(child.getT2() != null ? child.getT2() + "%" : "-");
                    cellT2.setCellStyle(borderStyle);

                    Cell cellTze = row.createCell(col++);
                    cellTze.setCellValue(child.getTze());
                    cellTze.setCellStyle(borderStyle);
                }
            }

            // 写入合计行
            int totalRow = startRow + records.size();
            Row totalDataRow = sheet.createRow(totalRow);
            Cell totalCell0 = totalDataRow.createCell(0);
            totalCell0.setCellValue("全市");
            totalCell0.setCellStyle(borderStyle);

            Cell totalCell1 = totalDataRow.createCell(1);
            totalCell1.setCellValue(t1Total);
            totalCell1.setCellStyle(borderStyle);

            Cell totalCell2 = totalDataRow.createCell(2);
            totalCell2.setCellValue(t2Total);
            totalCell2.setCellStyle(borderStyle);

            int col = 3;
            for (int j = 0; j < 9; j++) {
                Cell c1 = totalDataRow.createCell(col++);
                c1.setCellValue(childT1[j]);
                c1.setCellStyle(borderStyle);

                Cell c2 = totalDataRow.createCell(col++);
                c2.setCellValue(t1Total == 0 ? "-" : String.format("%.2f", (double) childT1[j] / t1Total * 100) + "%");
                c2.setCellStyle(borderStyle);

                Cell c3 = totalDataRow.createCell(col++);
                c3.setCellValue(childTze[j]);
                c3.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出园区1+4项目数量和投资额")
    @PostMapping("/exportOnePlusFourForQxYq")
    public void exportStatisticsOnePlusFourForQxYq(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) {
        try {
            List<OnePlusFourVo> records = statisticsService.statisticsOnePlusFourForQxYq(reqDTO);
            String fileName = "园区1+4项目数量和投资额";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template3.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 5; // 从第5行开始写入（0-indexed = 第5行）

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            // 计算合计
            long t1Total = 0;
            double t2Total = 0;
            long[] childT1 = new long[9];
            double[] childTze = new double[9];

            for (int i = 0; i < records.size(); i++) {
                OnePlusFourVo vo = records.get(i);
                t1Total += vo.getProjNums();
                t2Total += vo.getZtz();

                Row row = sheet.createRow(startRow + i);
                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums());
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getZtz());
                cell2.setCellStyle(borderStyle);

                int col = 3;
                for (int j = 0; j < vo.getChildren().size() && j < 9; j++) {
                    OnePlusFourVo.OnePlusFourClassify child = vo.getChildren().get(j);
                    childT1[j] += child.getT1();
                    childTze[j] += child.getTze();

                    Cell cellT1 = row.createCell(col++);
                    cellT1.setCellValue(child.getT1());
                    cellT1.setCellStyle(borderStyle);

                    Cell cellT2 = row.createCell(col++);
                    cellT2.setCellValue(child.getT2() != null ? child.getT2() + "%" : "-");
                    cellT2.setCellStyle(borderStyle);

                    Cell cellTze = row.createCell(col++);
                    cellTze.setCellValue(child.getTze());
                    cellTze.setCellStyle(borderStyle);
                }
            }

            // 写入合计行
            int totalRow = startRow + records.size();
            Row totalDataRow = sheet.createRow(totalRow);
            Cell totalCell0 = totalDataRow.createCell(0);
            totalCell0.setCellValue("全市");
            totalCell0.setCellStyle(borderStyle);

            Cell totalCell1 = totalDataRow.createCell(1);
            totalCell1.setCellValue(t1Total);
            totalCell1.setCellStyle(borderStyle);

            Cell totalCell2 = totalDataRow.createCell(2);
            totalCell2.setCellValue(t2Total);
            totalCell2.setCellStyle(borderStyle);

            int col = 3;
            for (int j = 0; j < 9; j++) {
                Cell c1 = totalDataRow.createCell(col++);
                c1.setCellValue(childT1[j]);
                c1.setCellStyle(borderStyle);

                Cell c2 = totalDataRow.createCell(col++);
                c2.setCellValue(t1Total == 0 ? "-" : String.format("%.2f", (double) childT1[j] / t1Total * 100) + "%");
                c2.setCellStyle(borderStyle);

                Cell c3 = totalDataRow.createCell(col++);
                c3.setCellValue(childTze[j]);
                c3.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出园区项目状态统计")
    @PostMapping("/exportStatisticsProjectStatusInfoQx")
    public void exportStatisticsProjectStatusInfoQx(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) {
        try {
            List<ProjectInfoVO> records = statisticsService.statisticsProjectStatusInfoQx(reqDTO);
            String fileName = "园区项目状态统计表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template4.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 4; // 从第6行开始写入

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            // 计算合计
            long t1Total = 0;
            double t2Total = 0;
            long[] childProjNums = new long[4];
            double[] childZtz = new double[4];

            for (int i = 0; i < records.size(); i++) {
                ProjectInfoVO vo = records.get(i);
                t1Total += vo.getProjNums() != null ? vo.getProjNums() : 0;
                t2Total += vo.getZtz() != null ? vo.getZtz() : 0;

                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums() != null ? vo.getProjNums() : 0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getZtz() != null ? vo.getZtz() : 0.0);
                cell2.setCellStyle(borderStyle);

                int col = 3;
                for (int j = 0; j < vo.getChildren().size() && j < 4; j++) {
                    ProjectStatusInfoVO child = vo.getChildren().get(j);
                    childProjNums[j] += child.getProjNums() != null ? child.getProjNums() : 0;
                    childZtz[j] += child.getZtz() != null ? child.getZtz() : 0.0;

                    Cell cellProjNums = row.createCell(col++);
                    cellProjNums.setCellValue(child.getProjNums() != null ? child.getProjNums() : 0);
                    cellProjNums.setCellStyle(borderStyle);

                    Cell cellZtz = row.createCell(col++);
                    cellZtz.setCellValue(child.getZtz() != null ? child.getZtz() : 0.0);
                    cellZtz.setCellStyle(borderStyle);
                }
            }

            // 写入合计行
            int totalRow = startRow + records.size();
            Row totalDataRow = sheet.createRow(totalRow);
            Cell totalCell0 = totalDataRow.createCell(0);
            totalCell0.setCellValue("全市");
            totalCell0.setCellStyle(borderStyle);

            Cell totalCell1 = totalDataRow.createCell(1);
            totalCell1.setCellValue(t1Total);
            totalCell1.setCellStyle(borderStyle);

            Cell totalCell2 = totalDataRow.createCell(2);
            totalCell2.setCellValue(t2Total);
            totalCell2.setCellStyle(borderStyle);

            int col = 3;
            for (int j = 0; j < 4; j++) {
                Cell c1 = totalDataRow.createCell(col++);
                c1.setCellValue(childProjNums[j]);
                c1.setCellStyle(borderStyle);

                Cell c2 = totalDataRow.createCell(col++);
                c2.setCellValue(childZtz[j]);
                c2.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出重点园区得分")
    @PostMapping("/exportKeyZoneScore")
    public void exportStatisticsKeyZoneScore(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                              HttpServletRequest request,
                                              HttpServletResponse response) {
        try {
            List<KeyZoneScoreVO> scorePlusList = statisticsService.statisticsKeyZoneScorePlus(reqDTO);
            Map<String, KeyZoneScoreVO> completeProjNums = statisticsService.statisticsKeyZoneCompleteProjNums(reqDTO);

            // 合并数据
            scorePlusList.forEach(vo -> {
                KeyZoneScoreVO task = completeProjNums.get(vo.getZoneCode());
                if (task != null) {
                    vo.setOneTaskCount(task.getOneTaskCount());
                    vo.setOneCount(task.getOneCount());
                    vo.setFiveTaskCount(task.getFiveTaskCount());
                    vo.setFiveCount(task.getFiveCount());
                    vo.setTenTaskCount(task.getTenTaskCount());
                    vo.setTenCount(task.getTenCount());
                }
            });

            String fileName = "重点园区项目签约得分表";
            exportExcel(scorePlusList, fileName, request, response);
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出区县得分")
    @PostMapping("/exportQxScore")
    public void exportStatisticsQxScore(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                         HttpServletRequest request,
                                         HttpServletResponse response) {
        try {
            List<QxScoreVO> scorePlusList = statisticsService.statisticsQxScorePlus(reqDTO);
            Map<String, QxScoreVO> completeProjNums = statisticsService.statisticsQxCompleteProjNums(reqDTO);

            // 合并数据
            scorePlusList.forEach(vo -> {
                QxScoreVO task = completeProjNums.get(vo.getDistrictCode());
                if (task != null) {
                    vo.setOneTaskCount(task.getOneTaskCount());
                    vo.setOneCount(task.getOneCount());
                    vo.setFiveTaskCount(task.getFiveTaskCount());
                    vo.setFiveCount(task.getFiveCount());
                    vo.setTenTaskCount(task.getTenTaskCount());
                    vo.setTenCount(task.getTenCount());
                }
            });

            String fileName = "市（区）项目签约得分表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template5.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 4;

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            double t1Total = 0;
            long t2Total = 0, t3Total = 0, t4Total = 0, t5Total = 0, t6Total = 0, t7Total = 0;

            for (int i = 0; i < scorePlusList.size(); i++) {
                QxScoreVO vo = scorePlusList.get(i);
                t1Total += vo.getScorePlus() != null ? vo.getScorePlus() : 0;
                t2Total += vo.getOneTaskCount() != null ? vo.getOneTaskCount() : 0;
                t3Total += vo.getOneCount() != null ? vo.getOneCount() : 0;
                t4Total += vo.getFiveTaskCount() != null ? vo.getFiveTaskCount() : 0;
                t5Total += vo.getFiveCount() != null ? vo.getFiveCount() : 0;
                t6Total += vo.getTenTaskCount() != null ? vo.getTenTaskCount() : 0;
                t7Total += vo.getTenCount() != null ? vo.getTenCount() : 0;

                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getScorePlus() != null ? vo.getScorePlus() : 0.0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getOneTaskCount() != null ? vo.getOneTaskCount() : 0);
                cell2.setCellStyle(borderStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(vo.getOneCount() != null ? vo.getOneCount() : 0);
                cell3.setCellStyle(borderStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(vo.getOnePercent() != null ? vo.getOnePercent() + "%" : "-");
                cell4.setCellStyle(borderStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(vo.getOneScore() != null ? vo.getOneScore() : 0.0);
                cell5.setCellStyle(borderStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(vo.getFiveTaskCount() != null ? vo.getFiveTaskCount() : 0);
                cell6.setCellStyle(borderStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(vo.getFiveCount() != null ? vo.getFiveCount() : 0);
                cell7.setCellStyle(borderStyle);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(vo.getFivePercent() != null ? vo.getFivePercent() + "%" : "-");
                cell8.setCellStyle(borderStyle);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(vo.getFiveScore() != null ? vo.getFiveScore() : 0.0);
                cell9.setCellStyle(borderStyle);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(vo.getTenTaskCount() != null ? vo.getTenTaskCount() : 0);
                cell10.setCellStyle(borderStyle);

                Cell cell11 = row.createCell(11);
                cell11.setCellValue(vo.getTenCount() != null ? vo.getTenCount() : 0);
                cell11.setCellStyle(borderStyle);

                Cell cell12 = row.createCell(12);
                cell12.setCellValue(vo.getTenPercent() != null ? vo.getTenPercent() + "%" : "-");
                cell12.setCellStyle(borderStyle);

                Cell cell13 = row.createCell(13);
                cell13.setCellValue(vo.getTenScore() != null ? vo.getTenScore() : 0.0);
                cell13.setCellStyle(borderStyle);
            }

            // 写入合计行
            int totalRow = startRow + scorePlusList.size();
            Row totalDataRow = sheet.createRow(totalRow);
            totalDataRow.createCell(0).setCellValue("全市");
            totalDataRow.createCell(0).setCellStyle(borderStyle);
            totalDataRow.createCell(1).setCellValue(t1Total);
            totalDataRow.createCell(1).setCellStyle(borderStyle);
            totalDataRow.createCell(2).setCellValue(t2Total);
            totalDataRow.createCell(2).setCellStyle(borderStyle);
            totalDataRow.createCell(3).setCellValue(t3Total);
            totalDataRow.createCell(3).setCellStyle(borderStyle);
            totalDataRow.createCell(4).setCellValue(t2Total == 0 ? "-" : String.format("%.2f", (double) t3Total / t2Total * 100) + "%");
            totalDataRow.createCell(4).setCellStyle(borderStyle);
            totalDataRow.createCell(5).setCellValue(0.0);
            totalDataRow.createCell(5).setCellStyle(borderStyle);
            totalDataRow.createCell(6).setCellValue(t4Total);
            totalDataRow.createCell(6).setCellStyle(borderStyle);
            totalDataRow.createCell(7).setCellValue(t5Total);
            totalDataRow.createCell(7).setCellStyle(borderStyle);
            totalDataRow.createCell(8).setCellValue(t4Total == 0 ? "-" : String.format("%.2f", (double) t5Total / t4Total * 100) + "%");
            totalDataRow.createCell(8).setCellStyle(borderStyle);
            totalDataRow.createCell(9).setCellValue(t4Total == 0 ? 0.0 : Double.parseDouble(String.format("%.2f", (double) t5Total / t4Total * 0.1)));
            totalDataRow.createCell(9).setCellStyle(borderStyle);
            totalDataRow.createCell(10).setCellValue(t6Total);
            totalDataRow.createCell(10).setCellStyle(borderStyle);
            totalDataRow.createCell(11).setCellValue(t7Total);
            totalDataRow.createCell(11).setCellStyle(borderStyle);
            totalDataRow.createCell(12).setCellValue(t6Total == 0 ? "-" : String.format("%.2f", (double) t7Total / t6Total * 100) + "%");
            totalDataRow.createCell(12).setCellStyle(borderStyle);
            totalDataRow.createCell(13).setCellValue(t6Total == 0 ? 0.0 : Double.parseDouble(String.format("%.2f", (double) t7Total / t6Total * 0.1)));
            totalDataRow.createCell(13).setCellStyle(borderStyle);

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出项目状态统计")
    @PostMapping("/exportProjectStatusInfo")
    public void exportStatisticsProjectStatusInfo(@RequestBody KeyZoneAndQxScoreReqDTO reqDTO,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) {
        try {
            List<ProjectInfoVO> records = statisticsService.statisticsProjectStatusInfo(reqDTO);
            String fileName = "项目状态统计表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template4.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 4;

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            long t1Total = 0;
            double t2Total = 0;
            long[] childProjNums = new long[4];
            double[] childZtz = new double[4];

            for (int i = 0; i < records.size(); i++) {
                ProjectInfoVO vo = records.get(i);
                t1Total += vo.getProjNums() != null ? vo.getProjNums() : 0;
                t2Total += vo.getZtz() != null ? vo.getZtz() : 0;

                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getProjNums() != null ? vo.getProjNums() : 0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getZtz() != null ? vo.getZtz() : 0.0);
                cell2.setCellStyle(borderStyle);

                int col = 3;
                for (int j = 0; j < vo.getChildren().size() && j < 4; j++) {
                    ProjectStatusInfoVO child = vo.getChildren().get(j);
                    childProjNums[j] += child.getProjNums() != null ? child.getProjNums() : 0;
                    childZtz[j] += child.getZtz() != null ? child.getZtz() : 0.0;

                    Cell cellProjNums = row.createCell(col++);
                    cellProjNums.setCellValue(child.getProjNums() != null ? child.getProjNums() : 0);
                    cellProjNums.setCellStyle(borderStyle);

                    Cell cellZtz = row.createCell(col++);
                    cellZtz.setCellValue(child.getZtz() != null ? child.getZtz() : 0.0);
                    cellZtz.setCellStyle(borderStyle);
                }
            }

            int totalRow = startRow + records.size();
            Row totalDataRow = sheet.createRow(totalRow);
            Cell totalCell0 = totalDataRow.createCell(0);
            totalCell0.setCellValue("全市");
            totalCell0.setCellStyle(borderStyle);

            Cell totalCell1 = totalDataRow.createCell(1);
            totalCell1.setCellValue(t1Total);
            totalCell1.setCellStyle(borderStyle);

            Cell totalCell2 = totalDataRow.createCell(2);
            totalCell2.setCellValue(t2Total);
            totalCell2.setCellStyle(borderStyle);

            int col = 3;
            for (int j = 0; j < 4; j++) {
                Cell c1 = totalDataRow.createCell(col++);
                c1.setCellValue(childProjNums[j]);
                c1.setCellStyle(borderStyle);

                Cell c2 = totalDataRow.createCell(col++);
                c2.setCellValue(childZtz[j]);
                c2.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出签约项目类型统计")
    @PostMapping("/exportSignedProjType")
    public void exportSignedProjType(@RequestBody StatisticsSignedProjectReqDTO reqDTO,
                                      HttpServletRequest request,
                                      HttpServletResponse response) {
        try {
            List<SignedCylVo> records = statisticsService.countSignedProjType(reqDTO);
            String fileName = "签约项目类型统计表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template1.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            int startRow = 3;

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            for (int i = 0; i < records.size(); i++) {
                SignedCylVo vo = records.get(i);
                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getName() != null ? vo.getName() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getJjsNum() != null ? vo.getJjsNum() : 0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getJjsQyje() != null ? vo.getJjsQyje() : 0.0);
                cell2.setCellStyle(borderStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(vo.getTxsNum() != null ? vo.getTxsNum() : 0);
                cell3.setCellStyle(borderStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(vo.getTxsQyje() != null ? vo.getTxsQyje() : 0.0);
                cell4.setCellStyle(borderStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(vo.getXhsNum() != null ? vo.getXhsNum() : 0);
                cell5.setCellStyle(borderStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(vo.getXhsQyje() != null ? vo.getXhsQyje() : 0.0);
                cell6.setCellStyle(borderStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(vo.getHlqNum() != null ? vo.getHlqNum() : 0);
                cell7.setCellStyle(borderStyle);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(vo.getHlqQyje() != null ? vo.getHlqQyje() : 0.0);
                cell8.setCellStyle(borderStyle);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(vo.getJyqNum() != null ? vo.getJyqNum() : 0);
                cell9.setCellStyle(borderStyle);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(vo.getJyqQyje() != null ? vo.getJyqQyje() : 0.0);
                cell10.setCellStyle(borderStyle);

                Cell cell11 = row.createCell(11);
                cell11.setCellValue(vo.getYygxqNum() != null ? vo.getYygxqNum() : 0);
                cell11.setCellStyle(borderStyle);

                Cell cell12 = row.createCell(12);
                cell12.setCellValue(vo.getYygxqQyje() != null ? vo.getYygxqQyje() : 0.0);
                cell12.setCellStyle(borderStyle);

                Cell cell13 = row.createCell(13);
                cell13.setCellValue(vo.getTotal() != null ? vo.getTotal() : 0);
                cell13.setCellStyle(borderStyle);

                Cell cell14 = row.createCell(14);
                cell14.setCellValue(vo.getTotalQyje() != null ? vo.getTotalQyje() : 0.0);
                cell14.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    @Operation(summary = "导出项目签约明细")
    @PostMapping("/exportProjSigned")
    public void exportProjSigned(@RequestBody StatisticsSignedProjectReqDTO reqDTO,
                                  HttpServletRequest request,
                                  HttpServletResponse response) {
        try {
            List<ProjSignedDetailVo> records = statisticsService.countProjSigned(reqDTO);
            String fileName = "产业链项目明细表";
            setExcelResponseHeader(response, fileName);

            InputStream templateStream = getClass().getClassLoader().getResourceAsStream("template/template7.xlsx");
            if (templateStream == null) {
                throw new RuntimeException("导出模板不存在");
            }
            Workbook workbook = new XSSFWorkbook(templateStream);
            Sheet sheet = workbook.getSheetAt(0);

            String jeStr = "1亿人民币（1000万美元）";
            if (reqDTO.getRmb() != null) {
                if (reqDTO.getRmb() == 5) {
                    jeStr = "5亿人民币（3000万美元）";
                } else if (reqDTO.getRmb() == 10) {
                    jeStr = "10亿人民币（1亿美元）";
                }
            }
            String projTypeStr = reqDTO.getProjType() != null ? reqDTO.getProjType() : "";
            String dateStr = reqDTO.getCurrStartDate() + "至" + reqDTO.getCurrEndDate();

            // 创建边框样式
            CellStyle borderStyle = workbook.createCellStyle();
            borderStyle.setBorderTop(BorderStyle.THIN);
            borderStyle.setBorderBottom(BorderStyle.THIN);
            borderStyle.setBorderLeft(BorderStyle.THIN);
            borderStyle.setBorderRight(BorderStyle.THIN);

            // 替换模板中的占位符
            Row titleRow = sheet.getRow(1);
            if (titleRow == null) titleRow = sheet.createRow(1);
            for (int col = 0; col <= 2; col++) {
                Cell cell = titleRow.getCell(col);
                if (cell != null && cell.getStringCellValue() != null) {
                    String val = cell.getStringCellValue();
                    val = val.replace("{dateStr}", dateStr);
                    val = val.replace("{jeStr}", jeStr);
                    val = val.replace("{projType}", projTypeStr);
                    cell.setCellValue(val);
                    cell.setCellStyle(borderStyle);
                }
            }
            int startRow = 2;

            for (int i = 0; i < records.size(); i++) {
                ProjSignedDetailVo vo = records.get(i);
                Row row = sheet.createRow(startRow + i);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(vo.getName() != null ? vo.getName() : "");
                cell0.setCellStyle(borderStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(vo.getInvestMoney() != null ? vo.getInvestMoney() : 0.0);
                cell1.setCellStyle(borderStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(vo.getDistrict() != null ? vo.getDistrict() : "");
                cell2.setCellStyle(borderStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(vo.getZoneName() != null ? vo.getZoneName() : "");
                cell3.setCellStyle(borderStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(vo.getInvestor() != null ? vo.getInvestor() : "");
                cell4.setCellStyle(borderStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(vo.getProjDesc() != null ? vo.getProjDesc() : "");
                cell5.setCellStyle(borderStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(vo.getProgressRd() != null ? vo.getProgressRd() : "");
                cell6.setCellStyle(borderStyle);
            }

            workbook.write(response.getOutputStream());
            workbook.close();
            templateStream.close();
        } catch (Exception e) {
            throw new RuntimeException("导出失败: " + e.getMessage());
        }
    }

    // ==================== 签约项目类型统计 ====================

    @Operation(summary = "签约项目类型统计")
    @PostMapping("/countSignedProjType")
    public List<SignedCylVo> countSignedProjType(@RequestBody StatisticsSignedProjectReqDTO reqDTO) {
        return statisticsService.countSignedProjType(reqDTO);
    }

    @Operation(summary = "签约项目明细")
    @PostMapping("/countProjSigned")
    public List<ProjSignedDetailVo> countProjSigned(@RequestBody StatisticsSignedProjectReqDTO reqDTO) {
        return statisticsService.countProjSigned(reqDTO);
    }

    // ==================== 辅助方法 ====================

    private <T> void exportExcel(List<T> data, String fileName,
                                  HttpServletRequest request, HttpServletResponse response) throws Exception {
        setExcelResponseHeader(response, fileName);
        EasyExcel.write(response.getOutputStream())
                .sheet(fileName)
                .doWrite(data);
    }

    private void setExcelResponseHeader(HttpServletResponse response, String fileName)
            throws UnsupportedEncodingException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        fileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.name())
                .replaceAll("\\+", "%20");
        response.setHeader("Content-disposition",
                String.format("attachment;filename*=utf-8''%s.xlsx", fileName));
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
    }

    // ==================== 待办留言查询 ====================

    @Resource
    private ITLy tLyService;

    @Resource
    private ITBizInvest tBizInvestService;

    @Operation(summary = "查询待办留言数量")
    @PostMapping("/todoMessageCount")
    public Map<String, Object> getTodoMessageCount() {
        QueryWrapper queryWrapper = new QueryWrapper();
        queryWrapper.eq("status", 0);
        queryWrapper.eq("cl_is", 0);
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);
        String deptCode = null;
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            deptCode = zoneCodes.get(0);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            deptCode = townCodes.get(0);
        }
        // 如果当前登陆人不是市级人员
        if (deptCode.length() > 3) {
            queryWrapper.eq("dept_code", deptCode);
        } else {
            queryWrapper.isNull("dept_code");
        }
        long count = tLyService.count(queryWrapper);
        return Map.of("count", count);
    }

    @Operation(summary = "查询待审核数据统计")
    @PostMapping("/pendingReviewCount")
    public Map<String, Object> getPendingReviewCount() {
        long count = statisticsService.countPendingReview();
        return Map.of("count", count);
    }

    @Operation(summary = "投资意向统计")
    @PostMapping("/investCompanyCount")
    public Map<String, Object> getInvestCompanyCount() {
        String id = getUserAccount().getId();
        List<String> zoneCodes = signedMapper.getZoneCodesByUserId(id);
        List<String> townCodes = signedMapper.getTownCodesByUserId(id);
        String deptCode = null;
        if (CollectionUtil.isNotEmpty(zoneCodes)) {
            deptCode = zoneCodes.get(0);
        }
        if (CollectionUtil.isEmpty(zoneCodes)) {
            deptCode = townCodes.get(0);
        }
        long notFeeBack = tBizInvestService.countNotFeedback(deptCode);
        Map<String, Object> result = new HashMap<>();
        result.put("count", notFeeBack);
        return result;
    }
}
