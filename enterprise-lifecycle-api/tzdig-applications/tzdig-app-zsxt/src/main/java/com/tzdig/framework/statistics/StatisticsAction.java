//package com.tzdig.framework.statistics;
//
//import cn.hutool.core.collection.CollUtil;
//import cn.hutool.core.date.DateTime;
//import cn.hutool.core.date.DateUtil;
//import cn.hutool.core.util.NumberUtil;
//import cn.hutool.core.util.ObjectUtil;
//import cn.hutool.core.util.StrUtil;
//import com.alibaba.excel.EasyExcel;
//import com.alibaba.excel.ExcelWriter;
//import com.alibaba.excel.write.metadata.WriteSheet;
//import com.alibaba.fastjson2.JSON;
//import com.qry.common.base.BaseAction;
//import com.qry.common.base.json.JSONObject;
//import com.qry.common.base.util.ContextUtil;
//import com.qry.common.base.util.ExcelUtil;
//import com.qry.common.base.util.Util;
//import com.qry.common.biz.dept.DeptDao;
//import com.qry.common.mybatis.SqlSessionFactoryUtils;
//import com.qry.statistics.common.ConditionTypeEnum;
//import com.qry.statistics.fifth.ProjectInfo;
//import com.qry.statistics.fifth.ProjectStatusInfo;
//import com.qry.statistics.fourth.KeyZoneAndQxScoreReq;
//import com.qry.statistics.fourth.KeyZoneScoreVo;
//import com.qry.statistics.fourth.QxScoreVo;
//import com.qry.statistics.second.SignedIncDto;
//import com.qry.statistics.second.SignedProjectInc;
//import com.qry.statistics.second.SignedProjectInfoDto;
//import com.qry.statistics.third.OnePlusFourVo;
//import com.snowday.core.constant.CommonConstant;
//import com.snowday.core.vo.ResultUtils;
//import org.apache.ibatis.session.SqlSession;
//
//import javax.servlet.ServletOutputStream;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.File;
//import java.io.IOException;
//import java.io.UnsupportedEncodingException;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.util.*;
//
///**
// * 新统计Action
// */
//public class StatisticsAction extends BaseAction {
//
//    /**
//     * 统计各市（区）新签约总投资10亿元（1亿美元）以上项目情况表
//     */
//    public String statisticsSignedProjectInfo(JSONObject reqJson) {
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        List<SignedProjectInfo> records = mapper.statisticsSignedProjectInfo(req, e.getRmb(), e.getDollar());
//        if (CollUtil.isNotEmpty(records)) {
//            // 计算出全市
//            long projectNums = records.stream().mapToLong(SignedProjectInfo::getProjNums).sum();
//            // 去年的项目总数
//            long lastProjectNums = records.stream().mapToLong(SignedProjectInfo::getLastYearProjNums).sum();
//            // 总投资
//            double ztz = records.stream().mapToDouble(SignedProjectInfo::getZtz).sum();
//            // 去年总投资
//            double lastZtz = records.stream().mapToDouble(SignedProjectInfo::getLastZtz).sum();
//            //计算出全市年度完成目标总数
//            long ndmbrws = records.stream().mapToLong(SignedProjectInfo::getNdmbrws).sum();
//
//            SignedProjectInfo info = new SignedProjectInfo();
//            info.setDistrict("全市");
//            info.setDistrictCode("3212");
//
//            info.setProjNums(projectNums);
//            info.setProjTb(lastProjectNums == 0L ? "-" : String.format("%.2f", (double) (projectNums - lastProjectNums) / lastProjectNums * 100));
//
//            info.setNdmbrws(ndmbrws);
//            info.setNdmbwcl(ndmbrws == 0L ? "-" : String.format("%.2f", (double) projectNums / ndmbrws * 100));
//
//            //总投资保留两位小数
//            info.setZtz(Double.valueOf(String.format("%.2f", ztz)));
//            info.setZtzTb(lastZtz == 0d ? "-" : String.format("%.2f", (ztz - lastZtz) / lastZtz * 100));
//
//            // 内资项目数
//            info.setNzProjNum(records.stream().mapToLong(SignedProjectInfo::getNzProjNum).sum());
//            // 内资投资金额
//            info.setNzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getNzTz).sum())));
//
//            // 外资项目数量
//            info.setWzProjNum(records.stream().mapToLong(SignedProjectInfo::getWzProjNum).sum());
//            // 外资投资金额 保留2位
//            info.setWzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getWzTz).sum())));
//
//            // 其中10亿以上项目元（1亿美元）项目总数
////            info.setProjTotalNums(records.stream().mapToLong(SignedProjectInfo::getProjTotalNums).sum());
////            // 其中10亿以上项目元（1亿美元）项目总投资 -- 保留2位小数
////            info.setProjTotalTz(Double.valueOf(String.format("%.2f",
////                    records.stream().mapToDouble(SignedProjectInfo::getProjTotalTz).sum())));
//            records.add(info);
//        }
//        return JSON.toJSONString(ResultUtils.success(records));
//    }
//
//    public String exportStatisticsSignedProjectInfo(JSONObject reqJson) {
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        List<SignedProjectInfo> records = mapper.statisticsSignedProjectInfo(req, e.getRmb(), e.getDollar());
//        if (CollUtil.isNotEmpty(records)) {
//            // 计算出全市
//            long projectNums = records.stream().mapToLong(SignedProjectInfo::getProjNums).sum();
//            // 去年的项目总数
//            long lastProjectNums = records.stream().mapToLong(SignedProjectInfo::getLastYearProjNums).sum();
//            // 总投资
//            double ztz = records.stream().mapToDouble(SignedProjectInfo::getZtz).sum();
//            // 去年总投资
//            double lastZtz = records.stream().mapToDouble(SignedProjectInfo::getLastZtz).sum();
//            //计算出全市年度完成目标总数
//            long ndmbrws = records.stream().mapToLong(SignedProjectInfo::getNdmbrws).sum();
//
//            SignedProjectInfo info = new SignedProjectInfo();
//            info.setDistrict("全市");
//            info.setDistrictCode("3212");
//
//            info.setProjNums(projectNums);
//            info.setProjTb(lastProjectNums == 0L ? "-" : String.format("%.2f", (double) (projectNums - lastProjectNums) / lastProjectNums * 100));
//
//            info.setNdmbrws(ndmbrws);
//            info.setNdmbwcl(ndmbrws == 0L ? "-" : String.format("%.2f", (double) projectNums / ndmbrws * 100));
//
//            //总投资保留两位小数
//            info.setZtz(Double.valueOf(String.format("%.2f", ztz)));
//            info.setZtzTb(lastZtz == 0d ? "-" : String.format("%.2f", (ztz - lastZtz) / lastZtz * 100));
//
//            // 内资项目数
//            info.setNzProjNum(records.stream().mapToLong(SignedProjectInfo::getNzProjNum).sum());
//            // 内资投资金额
//            info.setNzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getNzTz).sum())));
//
//            // 外资项目数量
//            info.setWzProjNum(records.stream().mapToLong(SignedProjectInfo::getWzProjNum).sum());
//            // 外资投资金额 保留2位
//            info.setWzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getWzTz).sum())));
//
//            records.add(info);
//        }
//        try {
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template2.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < records.size(); i++) {
//                SignedProjectInfo vo = records.get(i);
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getProjTb() + "%");
//                list2.add(vo.getZtz());
//                list2.add(vo.getZtzTb() + "%");
//                list2.add(vo.getNzProjNum());
//                list2.add(vo.getNzTz());
//                list2.add(vo.getWzProjNum());
//                list2.add(vo.getWzTz());
//                list2.add(vo.getNdmbrws());
//                list2.add(vo.getNdmbwcl() + "%");
//                resultList.add(list2);
//            }
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 3);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//    }
//
//    /**
//     * 统计园区新签约总投资10亿元（1亿美元）以上项目情况表
//     */
//    public String statisticsSignedProjectInfoYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        SignedProjectInfoReq req = checkParam(reqJson);
//        req.setDeptCode(deptCode);
//
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        List<SignedProjectInfo> records = mapper.statisticsSignedProjectInfoYq(req, e.getRmb(), e.getDollar());
//        if (CollUtil.isNotEmpty(records)) {
//            // 计算
//            long projectNums = records.stream().mapToLong(SignedProjectInfo::getProjNums).sum();
//            // 去年的项目总数
//            long lastProjectNums = records.stream().mapToLong(SignedProjectInfo::getLastYearProjNums).sum();
//            // 总投资
//            double ztz = records.stream().mapToDouble(SignedProjectInfo::getZtz).sum();
//            // 去年总投资
//            double lastZtz = records.stream().mapToDouble(SignedProjectInfo::getLastZtz).sum();
//            //计算出全市年度完成目标总数
//            long ndmbrws = records.stream().mapToLong(SignedProjectInfo::getNdmbrws).sum();
//
//            SignedProjectInfo info = new SignedProjectInfo();
//            info.setDistrict("全市（区）");
//            info.setDistrictCode(deptCode);
//
//            info.setProjNums(projectNums);
//            info.setProjTb(lastProjectNums == 0L ? "-" : String.format("%.2f", (double) (projectNums - lastProjectNums) / lastProjectNums * 100));
//
//            info.setNdmbrws(ndmbrws);
//            info.setNdmbwcl(ndmbrws == 0L ? "-" : String.format("%.2f", (double) projectNums / ndmbrws * 100));
//
//            //总投资保留两位小数
//            info.setZtz(Double.valueOf(String.format("%.2f", ztz)));
//            info.setZtzTb(lastZtz == 0d ? "-" : String.format("%.2f", (ztz - lastZtz) / lastZtz * 100));
//
//            // 内资项目数
//            info.setNzProjNum(records.stream().mapToLong(SignedProjectInfo::getNzProjNum).sum());
//            // 内资投资金额
//            info.setNzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getNzTz).sum())));
//
//            // 外资项目数量
//            info.setWzProjNum(records.stream().mapToLong(SignedProjectInfo::getWzProjNum).sum());
//            // 外资投资金额 保留2位
//            info.setWzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getWzTz).sum())));
//
//            // 其中10亿以上项目元（1亿美元）项目总数
////            info.setProjTotalNums(records.stream().mapToLong(SignedProjectInfo::getProjTotalNums).sum());
////            // 其中10亿以上项目元（1亿美元）项目总投资 -- 保留2位小数
////            info.setProjTotalTz(Double.valueOf(String.format("%.2f",
////                    records.stream().mapToDouble(SignedProjectInfo::getProjTotalTz).sum())));
//            records.add(info);
//        }
//        return JSON.toJSONString(ResultUtils.success(records));
//    }
//
//    public String exportStatisticsSignedProjectInfoYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        SignedProjectInfoReq req = checkParam(reqJson);
//        req.setDeptCode(deptCode);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        List<SignedProjectInfo> records = mapper.statisticsSignedProjectInfoYq(req, e.getRmb(), e.getDollar());
//        if (CollUtil.isNotEmpty(records)) {
//            // 计算
//            long projectNums = records.stream().mapToLong(SignedProjectInfo::getProjNums).sum();
//            // 去年的项目总数
//            long lastProjectNums = records.stream().mapToLong(SignedProjectInfo::getLastYearProjNums).sum();
//            // 总投资
//            double ztz = records.stream().mapToDouble(SignedProjectInfo::getZtz).sum();
//            // 去年总投资
//            double lastZtz = records.stream().mapToDouble(SignedProjectInfo::getLastZtz).sum();
//            //计算出全市年度完成目标总数
//            long ndmbrws = records.stream().mapToLong(SignedProjectInfo::getNdmbrws).sum();
//
//            SignedProjectInfo info = new SignedProjectInfo();
//            info.setDistrict("全市（区）");
//            info.setDistrictCode(deptCode);
//
//            info.setProjNums(projectNums);
//            info.setProjTb(lastProjectNums == 0L ? "-" : String.format("%.2f", (double) (projectNums - lastProjectNums) / lastProjectNums * 100));
//
//            info.setNdmbrws(ndmbrws);
//            info.setNdmbwcl(ndmbrws == 0L ? "-" : String.format("%.2f", (double) projectNums / ndmbrws * 100));
//
//            //总投资保留两位小数
//            info.setZtz(Double.valueOf(String.format("%.2f", ztz)));
//            info.setZtzTb(lastZtz == 0d ? "-" : String.format("%.2f", (ztz - lastZtz) / lastZtz * 100));
//
//            // 内资项目数
//            info.setNzProjNum(records.stream().mapToLong(SignedProjectInfo::getNzProjNum).sum());
//            // 内资投资金额
//            info.setNzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getNzTz).sum())));
//
//            // 外资项目数量
//            info.setWzProjNum(records.stream().mapToLong(SignedProjectInfo::getWzProjNum).sum());
//            // 外资投资金额 保留2位
//            info.setWzTz(Double.valueOf(String.format("%.2f", records.stream().mapToDouble(SignedProjectInfo::getWzTz).sum())));
//
//            records.add(info);
//        }
//        try {
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template2.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < records.size(); i++) {
//                SignedProjectInfo vo = records.get(i);
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getProjTb() + "%");
//                list2.add(vo.getZtz());
//                list2.add(vo.getZtzTb() + "%");
//                list2.add(vo.getNzProjNum());
//                list2.add(vo.getNzTz());
//                list2.add(vo.getWzProjNum());
//                list2.add(vo.getWzTz());
//                list2.add(vo.getNdmbrws());
//                list2.add(vo.getNdmbwcl() + "%");
//                resultList.add(list2);
//            }
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 3);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//    }
//
//    /**
//     * 半年项目招引信息
//     */
//    public String statisticsHalfYearProjInfo(JSONObject reqJson) {
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        try {
//            SignedProjectInc firstInc = new SignedProjectInc();
//            StatisticsMapper mapper = getMapper();
//
//            List<SignedProjectInc> firstIncList = mapper.statisticsXmzyxx(req.getCurrStartDate(), req.getCurrEndDate());
//            // 计算出全市
//            firstInc.setXqyxmsOne(firstIncList.stream().mapToLong(SignedProjectInc::getXqyxmsOne).sum());
//            firstInc.setXqytzeOne(NumberUtil.round(firstIncList.stream().mapToDouble(SignedProjectInc::getXqytzeOne).sum(), 2).doubleValue());
//            firstInc.setXqyxmsFive(firstIncList.stream().mapToLong(SignedProjectInc::getXqyxmsFive).sum());
//            firstInc.setXqytzeFive(firstIncList.stream().mapToDouble(SignedProjectInc::getXqytzeFive).sum());
//            firstInc.setXqyxmsTen(firstIncList.stream().mapToLong(SignedProjectInc::getXqyxmsTen).sum());
//            firstInc.setXqytzeTen(NumberUtil.round(firstIncList.stream().mapToDouble(SignedProjectInc::getXqytzeTen).sum(), 3).doubleValue());
//            firstInc.setNzxqyxmsOne(firstIncList.stream().mapToLong(SignedProjectInc::getNzxqyxmsOne).sum());
//            firstInc.setNzxqytzeOne(firstIncList.stream().mapToDouble(SignedProjectInc::getNzxqytzeOne).sum());
//            firstInc.setWzxqyxmsOne(firstIncList.stream().mapToLong(SignedProjectInc::getWzxqyxmsOne).sum());
//            firstInc.setWzxqytzeOne(firstIncList.stream().mapToDouble(SignedProjectInc::getWzxqytzeOne).sum());
//            // 4 重点园区1亿（1000万美元）项目数量
//            ConditionTypeEnum e = ConditionTypeEnum.ONE_HUNDRED_MILLION;
//            SignedIncDto fourthDto = mapper.statisticsKeyZoneProjInfo(req.getCurrStartDate(), req.getCurrEndDate(), e.getRmb(), e.getDollar());
//            // 4.1
//            firstInc.setKeyZoneProjNums(ObjectUtil.isNotEmpty(fourthDto) ? (fourthDto.getNzProjNums() + fourthDto.getWzProjNums()) : 0);
//            firstInc.setKeyZoneTz(Double.valueOf(String.format("%.2f", ObjectUtil.isNotEmpty(fourthDto) ? (fourthDto.getNzTz() + fourthDto.getWzTz()) : 0)));
//
//            firstInc.setKeyZoneProjPercent(String.format("%.2f", firstInc.getKeyZoneProjNums() / (firstInc.getXqyxmsOne() * 1.00d) * 100));
//            firstInc.setKeyZoneTzPercent(firstInc.getXqytzeOne() == 0d ? "-" : String.format("%.2f", firstInc.getKeyZoneTz() / (firstInc.getXqytzeOne() * 1.00d) * 100));
//            // 5 统计全市 “大海新晨的数量和总投资”
//            Map<String, SignedProjectInfoDto> map = mapper.statisticsSixCode(req.getCurrStartDate(), req.getCurrEndDate(), e.getRmb(), e.getDollar());
//            if (CollUtil.isNotEmpty(map)) {
//                List<Long> list = new ArrayList<>();
//                for (Map.Entry<String, String> entry : CommonConstant.getIndustryFirstLevel().entrySet()) {
//                    SignedProjectInfoDto temp = map.get(entry.getKey());
//                    if (ObjectUtil.isNotNull(temp)) {
//                        firstInc.setOnePlusFourProjNums(firstInc.getOnePlusFourProjNums() + temp.getProjNums());
//                        firstInc.setOnePlusFourZtz(firstInc.getOnePlusFourZtz() + temp.getZtz());
//                        list.add(temp.getProjNums());
//                    } else {
//                        list.add(0L);
//                    }
//                }
//                firstInc.setT1(list.get(0));
//                firstInc.setT2(list.get(1));
//                firstInc.setT3(list.get(2));
//                firstInc.setT4(list.get(3));
//                // 保留2位小数
//                firstInc.setOnePlusFourZtz(Double.valueOf(String.format("%.2f", firstInc.getOnePlusFourZtz())));
//            }
//            return JSON.toJSONString(ResultUtils.success(firstInc));
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("统计异常！");
//        }
//    }
//
//    /**
//     * 各个区县 1+4项目数量占比（全市新签约项目分产业汇总表）
//     */
//    public String statisticsOnePlusFourForQx(JSONObject reqJson) {
//        String currStartDate = reqJson.optStr("currStartDate");
//        String currEndDate = reqJson.optStr("currEndDate");
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 统计各个区县的项目总量和总投资
//            Map<String, SignedProjectInfoDto> projectMapQx = mapper.statisticProjForQxMap(currStartDate, currEndDate, e.getRmb(), e.getDollar());
//            // 统计各区县1+4项目数量和总投资
//            Map<String, SignedProjectInfoDto> onePlusFourQx = mapper.statisticsOnePlusFourForQx(currStartDate, currEndDate, e.getRmb(), e.getDollar());
//
//            List<OnePlusFourVo> records = new ArrayList<>();
//            for (Map.Entry<String, String> entry : CommonConstant.getArea().entrySet()) {
//                OnePlusFourVo vo = new OnePlusFourVo();
//                vo.setDistrictCode(entry.getKey());
//                vo.setDistrict(entry.getValue());
//                SignedProjectInfoDto dto = projectMapQx.get(entry.getKey());
//                if (ObjectUtil.isNotNull(dto)) {
//                    // 设置项目数量和投资额
//                    vo.setProjNums(dto.getProjNums());
//                    vo.setZtz(dto.getZtz());
//                }
//                // 设置产业
//                SignedProjectInfoDto temp;
//                for (Map.Entry<String, String> industry : CommonConstant.getIndustry().entrySet()) {
//                    OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
//                    t.setCode(industry.getKey());
//                    t.setName(industry.getValue());
//                    temp = onePlusFourQx.get(String.format("%s_%s", entry.getKey(), industry.getKey()));
//                    if (ObjectUtil.isNotNull(temp)) {
//                        t.setT1(temp.getProjNums());
//                        t.setT2(vo.getProjNums() == 0L ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
//                        t.setTze(temp.getZtz());
//                    }
//                    vo.getChildren().add(t);
//                }
//                records.add(vo);
//            }
//            return JSON.toJSONString(ResultUtils.success(records));
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return error("统计失败！");
//        }
//    }
//
//    /**
//     * 各个区县 1+4项目数量占比（全市新签约项目分产业汇总表）
//     */
//    public String exportStatisticsOnePlusFourForQx(JSONObject reqJson) {
//        String currStartDate = reqJson.optStr("currStartDate");
//        String currEndDate = reqJson.optStr("currEndDate");
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 统计各个区县的项目总量和总投资
//            Map<String, SignedProjectInfoDto> projectMapQx = mapper.statisticProjForQxMap(currStartDate, currEndDate, e.getRmb(), e.getDollar());
//            // 统计各区县1+4项目数量和总投资
//            Map<String, SignedProjectInfoDto> onePlusFourQx = mapper.statisticsOnePlusFourForQx(currStartDate, currEndDate, e.getRmb(), e.getDollar());
//
//            List<OnePlusFourVo> records = new ArrayList<>();
//            for (Map.Entry<String, String> entry : CommonConstant.getArea().entrySet()) {
//                OnePlusFourVo vo = new OnePlusFourVo();
//                vo.setDistrictCode(entry.getKey());
//                vo.setDistrict(entry.getValue());
//                SignedProjectInfoDto dto = projectMapQx.get(entry.getKey());
//                if (ObjectUtil.isNotNull(dto)) {
//                    // 设置项目数量和投资额
//                    vo.setProjNums(dto.getProjNums());
//                    vo.setZtz(dto.getZtz());
//                }
//                // 设置产业
//                SignedProjectInfoDto temp;
//                for (Map.Entry<String, String> industry : CommonConstant.getIndustry().entrySet()) {
//                    OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
//                    t.setCode(industry.getKey());
//                    t.setName(industry.getValue());
//                    temp = onePlusFourQx.get(String.format("%s_%s", entry.getKey(), industry.getKey()));
//                    if (ObjectUtil.isNotNull(temp)) {
//                        t.setT1(temp.getProjNums());
//                        t.setT2(vo.getProjNums() == 0L ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
//                        t.setTze(temp.getZtz());
//                    }
//                    vo.getChildren().add(t);
//                }
//                records.add(vo);
//            }
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template3.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            int t1 = 0;
//            double t2 = 0;
//            int t3 = 0;
//            double t4 = 0;
//            int t5 = 0;
//            double t6 = 0;
//            int t7 = 0;
//            double t8 = 0;
//            int t9 = 0;
//            double t10 = 0;
//            int t11 = 0;
//            double t12 = 0;
//            int t13 = 0;
//            double t14 = 0;
//            int t15 = 0;
//            double t16 = 0;
//            int t17 = 0;
//            double t18 = 0;
//            int t19 = 0;
//            double t20 = 0;
//            for (int i = 0; i < records.size(); i++) {
//                OnePlusFourVo vo = records.get(i);
//                t1 += vo.getProjNums();
//                t2 += vo.getZtz();
//                t3 += vo.getChildren().get(0).getT1();
//                t4 += vo.getChildren().get(0).getTze();
//                t5 += vo.getChildren().get(1).getT1();
//                t6 += vo.getChildren().get(1).getTze();
//                t7 += vo.getChildren().get(2).getT1();
//                t8 += vo.getChildren().get(2).getTze();
//                t9 += vo.getChildren().get(3).getT1();
//                t10 += vo.getChildren().get(3).getTze();
//                t11 += vo.getChildren().get(4).getT1();
//                t12 += vo.getChildren().get(4).getTze();
//                t13 += vo.getChildren().get(5).getT1();
//                t14 += vo.getChildren().get(5).getTze();
//                t15 += vo.getChildren().get(6).getT1();
//                t16 += vo.getChildren().get(6).getTze();
//                t17 += vo.getChildren().get(7).getT1();
//                t18 += vo.getChildren().get(7).getTze();
//                t17 += vo.getChildren().get(7).getT1();
//                t18 += vo.getChildren().get(7).getTze();
//                t19 += vo.getChildren().get(8).getT1();
//                t20 += vo.getChildren().get(8).getTze();
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getZtz());
//                list2.add(vo.getChildren().get(0).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(0).getT2()) ? "-" : vo.getChildren().get(0).getT2() + "%");
//                list2.add(vo.getChildren().get(0).getTze());
//                list2.add(vo.getChildren().get(1).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(1).getT2()) ? "-" : vo.getChildren().get(1).getT2() + "%");
//                list2.add(vo.getChildren().get(1).getTze());
//                list2.add(vo.getChildren().get(2).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(2).getT2()) ? "-" : vo.getChildren().get(2).getT2() + "%");
//                list2.add(vo.getChildren().get(2).getTze());
//                list2.add(vo.getChildren().get(3).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(3).getT2()) ? "-" : vo.getChildren().get(3).getT2() + "%");
//                list2.add(vo.getChildren().get(3).getTze());
//                list2.add(vo.getChildren().get(4).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(4).getT2()) ? "-" : vo.getChildren().get(4).getT2() + "%");
//                list2.add(vo.getChildren().get(4).getTze());
//                list2.add(vo.getChildren().get(5).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(5).getT2()) ? "-" : vo.getChildren().get(5).getT2() + "%");
//                list2.add(vo.getChildren().get(5).getTze());
//                list2.add(vo.getChildren().get(6).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(6).getT2()) ? "-" : vo.getChildren().get(6).getT2() + "%");
//                list2.add(vo.getChildren().get(6).getTze());
//                list2.add(vo.getChildren().get(7).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(7).getT2()) ? "-" : vo.getChildren().get(7).getT2() + "%");
//                list2.add(vo.getChildren().get(7).getTze());
//                list2.add(vo.getChildren().get(8).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(8).getT2()) ? "-" : vo.getChildren().get(8).getT2() + "%");
//                list2.add(vo.getChildren().get(8).getTze());
//                resultList.add(list2);
//            }
//            // 添加合计
//            List<Object> objs = new ArrayList<>();
//            objs.add("全市");
//            objs.add(t1);
//            objs.add(t2);
//            objs.add(t3);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t3 / t1 * 100) + "%");
//            objs.add(t4);
//            objs.add(t5);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t5 / t1 * 100) + "%");
//            objs.add(t6);
//            objs.add(t7);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t7 / t1 * 100) + "%");
//            objs.add(t8);
//            objs.add(t9);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t9 / t1 * 100) + "%");
//            objs.add(t10);
//            objs.add(t11);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t1 / t1 * 100) + "%");
//            objs.add(t12);
//            objs.add(t13);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t13 / t1 * 100) + "%");
//            objs.add(t14);
//            objs.add(t15);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t15 / t1 * 100) + "%");
//            objs.add(t16);
//            objs.add(t17);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t17 / t1 * 100) + "%");
//            objs.add(t18);
//            objs.add(t19);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t19 / t1 * 100) + "%");
//            objs.add(t20);
//            resultList.add(objs);
//
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 5);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//
//    }
//
//
//    /**
//     * 各个园区 1+4项目数量占比（全市新签约项目分产业汇总表）
//     */
//    public String statisticsOnePlusFourForQxYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        String currStartDate = reqJson.optStr("currStartDate");
//        String currEndDate = reqJson.optStr("currEndDate");
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 统计各个园区的项目总量和总投资
//            Map<String, SignedProjectInfoDto> projectMapQx = mapper.statisticProjForQxMapYq(currStartDate, currEndDate, e.getRmb(), e.getDollar(),deptCode);
//            // 统计各园区1+4项目数量和总投资
//            Map<String, SignedProjectInfoDto> onePlusFourQx = mapper.statisticsOnePlusFourForQxYq(currStartDate, currEndDate, e.getRmb(), e.getDollar(),deptCode);
//
//            List<OnePlusFourVo> records = new ArrayList<>();
//            for (Map.Entry<String, SignedProjectInfoDto> entry : projectMapQx.entrySet()) {
//                OnePlusFourVo vo = new OnePlusFourVo();
//                vo.setDistrictCode(entry.getKey());
//                vo.setDistrict(entry.getValue().getDistrict());
//                SignedProjectInfoDto dto = projectMapQx.get(entry.getKey());
//                if (ObjectUtil.isNotNull(dto)) {
//                    // 设置项目数量和投资额
//                    vo.setProjNums(dto.getProjNums());
//                    vo.setZtz(dto.getZtz());
//                }
//                // 设置产业
//                SignedProjectInfoDto temp;
//                for (Map.Entry<String, String> industry : CommonConstant.getIndustry().entrySet()) {
//                    OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
//                    t.setCode(industry.getKey());
//                    t.setName(industry.getValue());
//                    temp = onePlusFourQx.get(String.format("%s_%s", entry.getKey(), industry.getKey()));
//                    if (ObjectUtil.isNotNull(temp)) {
//                        t.setT1(temp.getProjNums());
//                        t.setT2(vo.getProjNums() == 0L ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
//                        t.setTze(temp.getZtz());
//                    }
//                    vo.getChildren().add(t);
//                }
//                records.add(vo);
//            }
//            return JSON.toJSONString(ResultUtils.success(records));
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return error("统计失败！");
//        }
//    }
//
//    /**
//     * 各个园区 1+4项目数量占比（全市新签约项目分产业汇总表）
//     */
//    public String exportStatisticsOnePlusFourForQxYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        String currStartDate = reqJson.optStr("currStartDate");
//        String currEndDate = reqJson.optStr("currEndDate");
//        int rmb = reqJson.optInt("rmb");
//        //获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = rmb == 0 ? ConditionTypeEnum.FIVE_HUNDRED_MILLION : ConditionTypeEnum.getInstanceByRmb(rmb);
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 统计各个区县的项目总量和总投资
//            Map<String, SignedProjectInfoDto> projectMapQx = mapper.statisticProjForQxMapYq(currStartDate, currEndDate, e.getRmb(), e.getDollar(),deptCode);
//            // 统计各区县1+4项目数量和总投资
//            Map<String, SignedProjectInfoDto> onePlusFourQx = mapper.statisticsOnePlusFourForQxYq(currStartDate, currEndDate, e.getRmb(), e.getDollar(),deptCode);
//
//            List<OnePlusFourVo> records = new ArrayList<>();
//            for (Map.Entry<String, SignedProjectInfoDto> entry : projectMapQx.entrySet()) {
//                OnePlusFourVo vo = new OnePlusFourVo();
//                vo.setDistrictCode(entry.getKey());
//                vo.setDistrict(entry.getValue().getDistrict());
//                SignedProjectInfoDto dto = projectMapQx.get(entry.getKey());
//                if (ObjectUtil.isNotNull(dto)) {
//                    // 设置项目数量和投资额
//                    vo.setProjNums(dto.getProjNums());
//                    vo.setZtz(dto.getZtz());
//                }
//                // 设置产业
//                SignedProjectInfoDto temp;
//                for (Map.Entry<String, String> industry : CommonConstant.getIndustry().entrySet()) {
//                    OnePlusFourVo.OnePlusFourClassify t = new OnePlusFourVo.OnePlusFourClassify();
//                    t.setCode(industry.getKey());
//                    t.setName(industry.getValue());
//                    temp = onePlusFourQx.get(String.format("%s_%s", entry.getKey(), industry.getKey()));
//                    if (ObjectUtil.isNotNull(temp)) {
//                        t.setT1(temp.getProjNums());
//                        t.setT2(vo.getProjNums() == 0L ? "-" : String.format("%.2f", (double) t.getT1() / vo.getProjNums() * 100));
//                        t.setTze(temp.getZtz());
//                    }
//                    vo.getChildren().add(t);
//                }
//                records.add(vo);
//            }
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template3.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            int t1 = 0;
//            double t2 = 0;
//            int t3 = 0;
//            double t4 = 0;
//            int t5 = 0;
//            double t6 = 0;
//            int t7 = 0;
//            double t8 = 0;
//            int t9 = 0;
//            double t10 = 0;
//            int t11 = 0;
//            double t12 = 0;
//            int t13 = 0;
//            double t14 = 0;
//            int t15 = 0;
//            double t16 = 0;
//            int t17 = 0;
//            double t18 = 0;
//            int t19 = 0;
//            double t20 = 0;
//            for (int i = 0; i < records.size(); i++) {
//                OnePlusFourVo vo = records.get(i);
//                t1 += vo.getProjNums();
//                t2 += vo.getZtz();
//                t3 += vo.getChildren().get(0).getT1();
//                t4 += vo.getChildren().get(0).getTze();
//                t5 += vo.getChildren().get(1).getT1();
//                t6 += vo.getChildren().get(1).getTze();
//                t7 += vo.getChildren().get(2).getT1();
//                t8 += vo.getChildren().get(2).getTze();
//                t9 += vo.getChildren().get(3).getT1();
//                t10 += vo.getChildren().get(3).getTze();
//                t11 += vo.getChildren().get(4).getT1();
//                t12 += vo.getChildren().get(4).getTze();
//                t13 += vo.getChildren().get(5).getT1();
//                t14 += vo.getChildren().get(5).getTze();
//                t15 += vo.getChildren().get(6).getT1();
//                t16 += vo.getChildren().get(6).getTze();
//                t17 += vo.getChildren().get(7).getT1();
//                t18 += vo.getChildren().get(7).getTze();
//                t17 += vo.getChildren().get(7).getT1();
//                t18 += vo.getChildren().get(7).getTze();
//                t19 += vo.getChildren().get(8).getT1();
//                t20 += vo.getChildren().get(8).getTze();
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getZtz());
//                list2.add(vo.getChildren().get(0).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(0).getT2()) ? "-" : vo.getChildren().get(0).getT2() + "%");
//                list2.add(vo.getChildren().get(0).getTze());
//                list2.add(vo.getChildren().get(1).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(1).getT2()) ? "-" : vo.getChildren().get(1).getT2() + "%");
//                list2.add(vo.getChildren().get(1).getTze());
//                list2.add(vo.getChildren().get(2).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(2).getT2()) ? "-" : vo.getChildren().get(2).getT2() + "%");
//                list2.add(vo.getChildren().get(2).getTze());
//                list2.add(vo.getChildren().get(3).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(3).getT2()) ? "-" : vo.getChildren().get(3).getT2() + "%");
//                list2.add(vo.getChildren().get(3).getTze());
//                list2.add(vo.getChildren().get(4).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(4).getT2()) ? "-" : vo.getChildren().get(4).getT2() + "%");
//                list2.add(vo.getChildren().get(4).getTze());
//                list2.add(vo.getChildren().get(5).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(5).getT2()) ? "-" : vo.getChildren().get(5).getT2() + "%");
//                list2.add(vo.getChildren().get(5).getTze());
//                list2.add(vo.getChildren().get(6).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(6).getT2()) ? "-" : vo.getChildren().get(6).getT2() + "%");
//                list2.add(vo.getChildren().get(6).getTze());
//                list2.add(vo.getChildren().get(7).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(7).getT2()) ? "-" : vo.getChildren().get(7).getT2() + "%");
//                list2.add(vo.getChildren().get(7).getTze());
//                list2.add(vo.getChildren().get(8).getT1());
//                list2.add(ObjectUtil.isEmpty(vo.getChildren().get(8).getT2()) ? "-" : vo.getChildren().get(8).getT2() + "%");
//                list2.add(vo.getChildren().get(8).getTze());
//                resultList.add(list2);
//            }
//            // 添加合计
//            List<Object> objs = new ArrayList<>();
//            objs.add("全市");
//            objs.add(t1);
//            objs.add(t2);
//            objs.add(t3);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t3 / t1 * 100) + "%");
//            objs.add(t4);
//            objs.add(t5);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t5 / t1 * 100) + "%");
//            objs.add(t6);
//            objs.add(t7);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t7 / t1 * 100) + "%");
//            objs.add(t8);
//            objs.add(t9);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t9 / t1 * 100) + "%");
//            objs.add(t10);
//            objs.add(t11);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t1 / t1 * 100) + "%");
//            objs.add(t12);
//            objs.add(t13);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t13 / t1 * 100) + "%");
//            objs.add(t14);
//            objs.add(t15);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t15 / t1 * 100) + "%");
//            objs.add(t16);
//            objs.add(t17);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t17 / t1 * 100) + "%");
//            objs.add(t18);
//            objs.add(t19);
//            objs.add(t1 == 0L ? "-" : String.format("%.2f", (double) t19 / t1 * 100) + "%");
//            objs.add(t20);
//            resultList.add(objs);
//
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 5);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//
//    }
//
//
//    /**
//     * 统计"三比一提升”重点园区项目签约得分表
//     */
//    public String statisticsKeyZoneScore(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        if (null == req) {
//            return error("参数错误！");
//        }
//        try {
//            StatisticsMapper mapper = getMapper();
//            List<KeyZoneScoreVo> records = mapper.statisticsKeyZoneScorePlus(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear(), req.getStartMonth(), req.getEndMonth());
//            if (CollUtil.isNotEmpty(records)) {
//                Map<String, KeyZoneScoreVo> task = mapper.statisticsKeyZoneCompleteProjNums(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear());
//                records.stream().forEach(en -> {
//                    KeyZoneScoreVo t = task.get(en.getZoneCode());
//                    if (ObjectUtil.isNotNull(t)) {
//                        //1亿
//                        en.setOneTaskCount(t.getOneTaskCount());
//                        en.setOneCount(t.getOneCount());
//                        // 完成率 和得分
//                        double ot = t.getOneTaskCount() == 0 ? 0d : (double) t.getOneCount() / t.getOneTaskCount();
//                        en.setOnePercent(String.format("%.2f", ot * 100d));
////                        en.setOneScore(Double.valueOf(String.format("%.2f", ot * 0.1d)));
//                        //5亿
//                        en.setFiveCount(t.getFiveCount());
//                        en.setFiveTaskCount(t.getFiveTaskCount());
//                        // 完成率 和得分
//                        double ft = t.getFiveTaskCount() == 0 ? 0d : (double) t.getFiveCount() / t.getFiveTaskCount();
//                        en.setFivePercent(String.format("%.2f", ft * 100d));
//                        en.setFiveScore(Double.valueOf(String.format("%.2f", ft * 0.1d)));
//                        // 10亿
//                        en.setTenTaskCount(t.getTenTaskCount());
//                        en.setTenCount(t.getTenCount());
//                        double tt = t.getTenTaskCount() == 0 ? 0d : (double) t.getTenCount() / t.getTenTaskCount();
//                        en.setTenPercent(String.format("%.2f", tt * 100d));
//                        en.setTenScore(Double.valueOf(String.format("%.2f", tt * 0.3d)));
//                    }
//                });
////                List<KeyZoneScoreVo> list = records.stream().sorted(Comparator.comparingInt
////                (KeyZoneScoreVo::getGear)).collect(Collectors.toList());
//                return JSON.toJSONString(ResultUtils.success(records));
//            }
//            return JSON.toJSONString(ResultUtils.success(Collections.EMPTY_LIST));
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("统计失败！");
//        }
//    }
//
//    /**
//     * 统计"三比一提升”重点园区项目签约得分表
//     */
//    public String exportStatisticsKeyZoneScore(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        if (null == req) {
//            return error("参数错误！");
//        }
//        try {
//            StatisticsMapper mapper = getMapper();
//            List<KeyZoneScoreVo> records = mapper.statisticsKeyZoneScorePlus(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear(), req.getStartMonth(), req.getEndMonth());
//            if (CollUtil.isNotEmpty(records)) {
//                Map<String, KeyZoneScoreVo> task = mapper.statisticsKeyZoneCompleteProjNums(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear());
//                records.stream().forEach(en -> {
//                    KeyZoneScoreVo t = task.get(en.getZoneCode());
//                    if (ObjectUtil.isNotNull(t)) {
//                        //1亿
//                        en.setOneTaskCount(t.getOneTaskCount());
//                        en.setOneCount(t.getOneCount());
//                        // 完成率 和得分
//                        double ot = t.getOneTaskCount() == 0 ? 0d : (double) t.getOneCount() / t.getOneTaskCount();
//                        en.setOnePercent(String.format("%.2f", ot * 100d));
////                        en.setOneScore(Double.valueOf(String.format("%.2f", ot * 0.1d)));
//                        //5亿
//                        en.setFiveCount(t.getFiveCount());
//                        en.setFiveTaskCount(t.getFiveTaskCount());
//                        // 完成率 和得分
//                        double ft = t.getFiveTaskCount() == 0 ? 0d : (double) t.getFiveCount() / t.getFiveTaskCount();
//                        en.setFivePercent(String.format("%.2f", ft * 100d));
//                        en.setFiveScore(Double.valueOf(String.format("%.2f", ft * 0.1d)));
//                        // 10亿
//                        en.setTenTaskCount(t.getTenTaskCount());
//                        en.setTenCount(t.getTenCount());
//                        double tt = t.getTenTaskCount() == 0 ? 0d : (double) t.getTenCount() / t.getTenTaskCount();
//                        en.setTenPercent(String.format("%.2f", tt * 100d));
//                        en.setTenScore(Double.valueOf(String.format("%.2f", tt * 0.3d)));
//                    }
//                });
//            }
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template6.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < records.size(); i++) {
//                KeyZoneScoreVo vo = records.get(i);
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getZoneName());
//                list2.add(vo.getScorePlus());
//                list2.add(vo.getOneTaskCount());
//                list2.add(vo.getOneCount());
//                list2.add(vo.getOneTaskCount() == 0 ? "-" : vo.getOneTaskCount() + "%");
//                list2.add(0);
//                list2.add(vo.getFiveTaskCount());
//                list2.add(vo.getFiveCount());
//                list2.add(vo.getFiveTaskCount() == 0 ? "-" : vo.getFivePercent() + "%");
//                list2.add(vo.getFiveScore());
//                list2.add(vo.getTenTaskCount());
//                list2.add(vo.getTenCount());
//                list2.add(vo.getTenTaskCount() == 0 ? "-" : vo.getTenPercent() + "%");
//                list2.add(vo.getTenScore());
//                resultList.add(list2);
//            }
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 4);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("统计失败！");
//        }
//    }
//
//    /**
//     * “三比一提升”市（区）项目签约得分表
//     */
//    public String statisticsQxScore(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        if (null == req) {
//            return error("参数错误！");
//        }
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 获取区县的加分项
//            List<QxScoreVo> records = mapper.statisticsQxScorePlus(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear(), req.getStartMonth(), req.getEndMonth());
//            if (CollUtil.isNotEmpty(records)) {
//                // 获取全市的完成情况
//                Map<String, QxScoreVo> taskMap = mapper.statisticsQxCompleteProjNums(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear());
//                records.stream().forEach(en -> {
//                    QxScoreVo temp = taskMap.get(en.getDistrictCode());
//                    if (!ObjectUtil.isNull(temp)) {
//                        //1亿
//                        en.setOneTaskCount(temp.getOneTaskCount());
//                        en.setOneCount(temp.getOneCount());
//                        // 完成率 和得分
//                        double ot = temp.getOneTaskCount() == 0 ? 0d : (double) temp.getOneCount() / temp.getOneTaskCount();
//                        en.setOnePercent(String.format("%.2f", ot * 100d));
////                        en.setOneScore(Double.valueOf(String.format("%.2f", ot * 0.1d)));
//                        //5亿
//                        en.setFiveTaskCount(temp.getFiveTaskCount());
//                        en.setFiveCount(temp.getFiveCount());
//                        // 完成率 和得分
//                        double ft = temp.getFiveTaskCount() == 0 ? 0d : (double) temp.getFiveCount() / temp.getFiveTaskCount();
//                        en.setFivePercent(String.format("%.2f", ft * 100d));
//                        en.setFiveScore(Double.valueOf(String.format("%.2f", ft * 0.1d)));
//                        // 10亿
//                        en.setTenTaskCount(temp.getTenTaskCount());
//                        en.setTenCount(temp.getTenCount());
//                        double tt = temp.getTenTaskCount() == 0 ? 0d : (double) temp.getTenCount() / temp.getTenTaskCount();
//                        en.setTenPercent(String.format("%.2f", tt * 100d));
//                        en.setTenScore(Double.valueOf(String.format("%.2f", tt * 0.3d)));
//                    }
//                });
//            }
//            return JSON.toJSONString(ResultUtils.success(records));
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("三比一提升市（区）项目签约得分表异常！");
//        }
//    }
//
//    /**
//     * “三比一提升”市（区）项目签约得分表
//     */
//    public String exportStatisticsQxScore(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        if (null == req) {
//            return error("参数错误！");
//        }
//        try {
//            StatisticsMapper mapper = getMapper();
//            // 获取区县的加分项
//            List<QxScoreVo> records = mapper.statisticsQxScorePlus(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear(), req.getStartMonth(), req.getEndMonth());
//            if (CollUtil.isNotEmpty(records)) {
//                // 获取全市的完成情况
//                Map<String, QxScoreVo> taskMap = mapper.statisticsQxCompleteProjNums(req.getCurrStartDate(), req.getCurrEndDate(), req.getYear());
//                records.stream().forEach(en -> {
//                    QxScoreVo temp = taskMap.get(en.getDistrictCode());
//                    if (!ObjectUtil.isNull(temp)) {
//                        //1亿
//                        en.setOneTaskCount(temp.getOneTaskCount());
//                        en.setOneCount(temp.getOneCount());
//                        // 完成率 和得分
//                        double ot = temp.getOneTaskCount() == 0 ? 0d : (double) temp.getOneCount() / temp.getOneTaskCount();
//                        en.setOnePercent(String.format("%.2f", ot * 100d));
//                        en.setOneScore(0d);
//                        //5亿
//                        en.setFiveTaskCount(temp.getFiveTaskCount());
//                        en.setFiveCount(temp.getFiveCount());
//                        // 完成率 和得分
//                        double ft = temp.getFiveTaskCount() == 0 ? 0d : (double) temp.getFiveCount() / temp.getFiveTaskCount();
//                        en.setFivePercent(String.format("%.2f", ft * 100d));
//                        en.setFiveScore(Double.valueOf(String.format("%.2f", ft * 0.1d)));
//                        // 10亿
//                        en.setTenTaskCount(temp.getTenTaskCount());
//                        en.setTenCount(temp.getTenCount());
//                        double tt = temp.getTenTaskCount() == 0 ? 0d : (double) temp.getTenCount() / temp.getTenTaskCount();
//                        en.setTenPercent(String.format("%.2f", tt * 100d));
//                        en.setTenScore(Double.valueOf(String.format("%.2f", tt * 0.3d)));
//                    }
//                });
//            }
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template5.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            double t1 = 0;
//            int t2 = 0;
//            int t3 = 0;
//            int t4 = 0;
//            int t5 = 0;
//            int t6 = 0;
//            int t7 = 0;
//            for (int i = 0; i < records.size(); i++) {
//                QxScoreVo vo = records.get(i);
//                t1 += vo.getScorePlus();
//                t2 += vo.getFiveTaskCount();
//                t3 += vo.getFiveCount();
//                t4 += vo.getTenTaskCount();
//                t5 += vo.getTenCount();
//                t6 += vo.getOneTaskCount();
//                t7 += vo.getOneCount();
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getScorePlus());
//                list2.add(vo.getOneTaskCount());
//                list2.add(vo.getOneCount());
//                list2.add(vo.getOnePercent() + "%");
//                list2.add(vo.getOneScore());
//                list2.add(vo.getFiveTaskCount());
//                list2.add(vo.getFiveCount());
//                list2.add(vo.getFivePercent() + "%");
//                list2.add(vo.getFiveScore());
//                list2.add(vo.getTenTaskCount());
//                list2.add(vo.getTenCount());
//                list2.add(vo.getTenPercent() + "%");
//                list2.add(vo.getTenScore());
//                resultList.add(list2);
//            }
//            List<Object> obj = new ArrayList<>();
//            obj.add("全市");
//            obj.add(t1);
//            obj.add(t6);
//            obj.add(t7);
//            obj.add(String.format("%.2f", (t6 == 0 ? 0d : (double) t7 / t6) * 100d) + "%");
//            obj.add(0d);
//            obj.add(t2);
//            obj.add(t3);
//            obj.add(String.format("%.2f", (t2 == 0 ? 0d : (double) t3 / t2) * 100d) + "%");
//            obj.add(Double.valueOf(String.format("%.2f", (t2 == 0 ? 0d : (double) t3 / t2) * 0.1d)));
//            obj.add(t4);
//            obj.add(t5);
//            obj.add(String.format("%.2f", (t4 == 0 ? 0d : (double) t5 / t4) * 100d) + "%");
//            obj.add(Double.valueOf(String.format("%.2f", (t4 == 0 ? 0d : (double) t5 / t4) * 0.1d)));
//            resultList.add(obj);
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 4);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", records);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("三比一提升市（区）项目签约得分表异常！");
//        }
//    }
//
//    /**
//     * 按照区划和状态统计项目的数量和金额
//     */
//    public String statisticsProjectStatusInfo(JSONObject reqJson) {
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        // 获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        // 项目总览
//        //Map<String, ProjectInfo> parent = mapper.statisticsProjectInfo(req.getCurrStartDate(), req.getCurrEndDate(),
//        //        ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        List<ProjectInfo> parent = mapper.statisticsProjectInfoList(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        // 按状态统计
//        Map<String, ProjectStatusInfo> children = mapper.statisticsProjectStatusInfo(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        for (ProjectInfo entry : parent) {
//            String districtCode = entry.getDistrictCode();
//            //CommonConstant
//            for (Map.Entry<Integer, String> statusEntry : CommonConstant.getProjectStatus().entrySet()) {
//                ProjectStatusInfo t = children.get(String.format("%s_%s", districtCode, statusEntry.getKey()));
//                if (ObjectUtil.isNull(t)) {
//                    t = new ProjectStatusInfo();
//                    t.setProgress(statusEntry.getKey());
//                    t.setProjNums(0L);
//                    t.setDistrictCode(districtCode);
//                    t.setQyje(0d);
//                }
//                entry.getChildren().add(t);
//            }
//        }
//        return JSON.toJSONString(ResultUtils.success(parent));
//    }
//
//    /**
//     * 按照区划和状态统计项目的数量和金额
//     */
//    public String exportStatisticsProjectStatusInfo(JSONObject reqJson) {
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        // 获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        // 项目总览
//        //Map<String, ProjectInfo> parent = mapper.statisticsProjectInfo(req.getCurrStartDate(), req.getCurrEndDate(),
//        //        ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        List<ProjectInfo> parent = mapper.statisticsProjectInfoList(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        // 按状态统计
//        Map<String, ProjectStatusInfo> children = mapper.statisticsProjectStatusInfo(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        for (ProjectInfo entry : parent) {
//            String districtCode = entry.getDistrictCode();
//            //CommonConstant
//            for (Map.Entry<Integer, String> statusEntry : CommonConstant.getProjectStatus().entrySet()) {
//                ProjectStatusInfo t = children.get(String.format("%s_%s", districtCode, statusEntry.getKey()));
//                if (ObjectUtil.isNull(t)) {
//                    t = new ProjectStatusInfo();
//                    t.setProgress(statusEntry.getKey());
//                    t.setProjNums(0L);
//                    t.setDistrictCode(districtCode);
//                    t.setQyje(0d);
//                }
//                entry.getChildren().add(t);
//            }
//        }
//        try {
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template4.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            int t1 = 0;
//            double t2 = 0;
//            int t3 = 0;
//            double t4 = 0;
//            int t5 = 0;
//            double t6 = 0;
//            int t7 = 0;
//            double t8 = 0;
//            int t9 = 0;
//            double t10 = 0;
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < parent.size(); i++) {
//                ProjectInfo vo = parent.get(i);
//                t1 += vo.getProjNums();
//                t2 += vo.getQyje();
//                t3 += vo.getChildren().get(0).getProjNums();
//                t4 += vo.getChildren().get(0).getQyje();
//                t5 += vo.getChildren().get(1).getProjNums();
//                t6 += vo.getChildren().get(1).getQyje();
//                t7 += vo.getChildren().get(2).getProjNums();
//                t8 += vo.getChildren().get(2).getQyje();
//                t9 += vo.getChildren().get(3).getProjNums();
//                t10 += vo.getChildren().get(3).getQyje();
//
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getQyje());
//                list2.add(vo.getChildren().get(0).getProjNums());
//                list2.add(vo.getChildren().get(0).getQyje());
//                list2.add(vo.getChildren().get(1).getProjNums());
//                list2.add(vo.getChildren().get(1).getQyje());
//                list2.add(vo.getChildren().get(2).getProjNums());
//                list2.add(vo.getChildren().get(2).getQyje());
//                list2.add(vo.getChildren().get(3).getProjNums());
//                list2.add(vo.getChildren().get(3).getQyje());
//                resultList.add(list2);
//            }
//            // 添加合计
//            List<Object> objs = new ArrayList<>();
//            objs.add("全市");
//            objs.add(t1);
//            objs.add(t2);
//            objs.add(t3);
//            objs.add(t4);
//            objs.add(t5);
//            objs.add(t6);
//            objs.add(t7);
//            objs.add(t8);
//            objs.add(t9);
//            objs.add(t10);
//            resultList.add(objs);
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 4);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", parent);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//    }
//
//    /**
//     * 按照区划和状态统计项目的数量和金额
//     */
//    public String statisticsProjectStatusInfoYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        // 获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        // 项目总览
//        //Map<String, ProjectInfo> parent = mapper.statisticsProjectInfo(req.getCurrStartDate(), req.getCurrEndDate(),
//        //        ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        List<ProjectInfo> parent = mapper.statisticsProjectInfoListYq(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar(),deptCode);
//        // 按状态统计
//        Map<String, ProjectStatusInfo> children = mapper.statisticsProjectStatusInfoYq(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar(),deptCode);
//        for (ProjectInfo entry : parent) {
//            String districtCode = entry.getDistrictCode();
//            //CommonConstant
//            for (Map.Entry<Integer, String> statusEntry : CommonConstant.getProjectStatus().entrySet()) {
//                ProjectStatusInfo t = children.get(String.format("%s_%s", districtCode, statusEntry.getKey()));
//                if (ObjectUtil.isNull(t)) {
//                    t = new ProjectStatusInfo();
//                    t.setProgress(statusEntry.getKey());
//                    t.setProjNums(0L);
//                    t.setDistrictCode(districtCode);
//                    t.setQyje(0d);
//                }
//                entry.getChildren().add(t);
//            }
//        }
//        return JSON.toJSONString(ResultUtils.success(parent));
//    }
//
//    /**
//     * 按照区划和状态统计项目的数量和金额
//     */
//    public String exportStatisticsProjectStatusInfoYq(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        //获取用户部门
//        String deptCode = (String) loginManager.get("dept_code");
//        DeptDao deptDao = new DeptDao();
//        //得到部门信息
//        Map deptMap = deptDao.getDeptByCode(deptCode);
//        String deptName = (String) deptMap.get("dept_name");
//        SignedProjectInfoReq req = checkParam(reqJson);
//        if (null == req) {
//            return error("日期不能为空！");
//        }
//        int rmb = reqJson.optInt("rmb");
//        // 获取条件 1亿/5亿/10亿
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(rmb);
//        StatisticsMapper mapper = getMapper();
//        // 项目总览
//        //Map<String, ProjectInfo> parent = mapper.statisticsProjectInfo(req.getCurrStartDate(), req.getCurrEndDate(),
//        //        ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar());
//        List<ProjectInfo> parent = mapper.statisticsProjectInfoListYq(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar(),deptCode);
//        // 按状态统计
//        Map<String, ProjectStatusInfo> children = mapper.statisticsProjectStatusInfoYq(req.getCurrStartDate(), req.getCurrEndDate(), ObjectUtil.isNull(e) ? null : e.getRmb(), ObjectUtil.isNull(e) ? null : e.getDollar(),deptCode);
//        for (ProjectInfo entry : parent) {
//            String districtCode = entry.getDistrictCode();
//            //CommonConstant
//            for (Map.Entry<Integer, String> statusEntry : CommonConstant.getProjectStatus().entrySet()) {
//                ProjectStatusInfo t = children.get(String.format("%s_%s", districtCode, statusEntry.getKey()));
//                if (ObjectUtil.isNull(t)) {
//                    t = new ProjectStatusInfo();
//                    t.setProgress(statusEntry.getKey());
//                    t.setProjNums(0L);
//                    t.setDistrictCode(districtCode);
//                    t.setQyje(0d);
//                }
//                entry.getChildren().add(t);
//            }
//        }
//        try {
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template4.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            int t1 = 0;
//            double t2 = 0;
//            int t3 = 0;
//            double t4 = 0;
//            int t5 = 0;
//            double t6 = 0;
//            int t7 = 0;
//            double t8 = 0;
//            int t9 = 0;
//            double t10 = 0;
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < parent.size(); i++) {
//                ProjectInfo vo = parent.get(i);
//                t1 += vo.getProjNums();
//                t2 += vo.getQyje();
//                t3 += vo.getChildren().get(0).getProjNums();
//                t4 += vo.getChildren().get(0).getQyje();
//                t5 += vo.getChildren().get(1).getProjNums();
//                t6 += vo.getChildren().get(1).getQyje();
//                t7 += vo.getChildren().get(2).getProjNums();
//                t8 += vo.getChildren().get(2).getQyje();
//                t9 += vo.getChildren().get(3).getProjNums();
//                t10 += vo.getChildren().get(3).getQyje();
//
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getDistrict());
//                list2.add(vo.getProjNums());
//                list2.add(vo.getQyje());
//                list2.add(vo.getChildren().get(0).getProjNums());
//                list2.add(vo.getChildren().get(0).getQyje());
//                list2.add(vo.getChildren().get(1).getProjNums());
//                list2.add(vo.getChildren().get(1).getQyje());
//                list2.add(vo.getChildren().get(2).getProjNums());
//                list2.add(vo.getChildren().get(2).getQyje());
//                list2.add(vo.getChildren().get(3).getProjNums());
//                list2.add(vo.getChildren().get(3).getQyje());
//                resultList.add(list2);
//            }
//            // 添加合计
//            List<Object> objs = new ArrayList<>();
//            objs.add("全市");
//            objs.add(t1);
//            objs.add(t2);
//            objs.add(t3);
//            objs.add(t4);
//            objs.add(t5);
//            objs.add(t6);
//            objs.add(t7);
//            objs.add(t8);
//            objs.add(t9);
//            objs.add(t10);
//            resultList.add(objs);
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 4);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", parent);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception en) {
//            en.printStackTrace();
//            return error("数据错误");
//        }
//    }
//
//    private StatisticsMapper getMapper() {
//        SqlSession session = SqlSessionFactoryUtils.openSqlSession();
//        StatisticsMapper mapper = session.getMapper(StatisticsMapper.class);
//        return mapper;
//    }
//
//    private KeyZoneAndQxScoreReq checkReq(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = new KeyZoneAndQxScoreReq();
//        // 2024-07-01
//        String currStartDate = reqJson.optStr("currStartDate");
//        String currEndDate = reqJson.optStr("currEndDate");
//        if (StrUtil.isEmpty(currStartDate) || StrUtil.isEmpty(currEndDate)) {
//            return null;
//        }
//        Date startDate = DateUtil.parse(currStartDate, "yyyy-MM-dd");
//        Date endDate = DateUtil.parse(currEndDate, "yyyy-MM-dd");
//        // 开始-结束月份
//        int startMonth = DateUtil.month(startDate) + 1;
//        int endMonth = DateUtil.month(endDate) + 1;
//        req.setCurrStartDate(currStartDate);
//        req.setCurrEndDate(currEndDate);
//        req.setStartMonth(startMonth);
//        req.setEndMonth(endMonth);
//        req.setYear(DateUtil.year(startDate));
//        return req;
//    }
//
//    private SignedProjectInfoReq checkParam(JSONObject reqJson) {
//        // 如 2024-07-01
//        String currStartDate = reqJson.optString("currStartDate");
//        if (StrUtil.isEmpty(currStartDate)) {
//            return null;
//        }
//        String currEndDate = StrUtil.isEmpty(reqJson.optString("currEndDate")) ? DateUtil.today() : reqJson.optString("currEndDate");
//
//        Date startDate = DateUtil.parse(currStartDate, "yyyy-MM-dd");
//
//        // 获取去年的时间段
//        String lastYearStartDate = DateUtil.offsetMonth(DateUtil.parse(currStartDate, "yyyy-MM-dd"), -12).toDateStr();
//        String lastYearEndDate = DateUtil.offsetMonth(DateUtil.parse(currEndDate, "yyyy-MM-dd"), -12).toDateStr();
//
//        SignedProjectInfoReq req = new SignedProjectInfoReq();
//        req.setCurrStartDate(currStartDate);
//        req.setCurrEndDate(currEndDate);
//        req.setLastYearStartDate(lastYearStartDate);
//        req.setLastYearEndDate(lastYearEndDate);
//        req.setYear(DateUtil.year(startDate));
//        return req;
//    }
//
//    public String countSignedProj(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        req.setPtype(reqJson.optInt("ptype"));
//        req.setType(reqJson.optInt("type"));
//        List<SignedProjectInfo> info = mapper.countSignedProj(req);
//        return JSON.toJSONString(ResultUtils.success(info));
//    }
//
//    public String countSignedProjJe(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        req.setPtype(reqJson.optInt("ptype"));
//        req.setType(reqJson.optInt("type"));
//        List<SignedProjectInfo> info = mapper.countSignedProj(req);
//        return JSON.toJSONString(ResultUtils.success(info));
//    }
//
//    public String countSignedProjQyqs(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        Map<String, SignedProjectInfo> infos = mapper.countSignedProjQyqs(req);
//        Date startDate = DateUtil.parse(req.getCurrStartDate());
//        Date endDate = DateUtil.parse(req.getCurrEndDate());
//        List<String> yearMonthList = new ArrayList<>();
//        // 从起始日期开始，遍历到结束日期
//        while (!((DateTime) startDate).isAfter(endDate)) { // 只要startDate不晚于endDate
//            yearMonthList.add(DateUtil.year(startDate) + "-" + String.format("%02d", DateUtil.month(startDate) + 1)); // 获取年-月格式
//            System.out.println(yearMonthList);
//            startDate = DateUtil.offsetMonth(startDate, +1); // 增加一个月
//        }
//        for (String s : yearMonthList) {
//            if (ObjectUtil.isEmpty(infos.get(s))) {
//                SignedProjectInfo i = new SignedProjectInfo();
//                i.setSignedDate(s);
//                infos.put(s, i);
//            }
//        }
//        List<SignedProjectInfo> info = new ArrayList<>(infos.values());
//        info.sort(Comparator.comparing(SignedProjectInfo::getSignedDate));
//        return JSON.toJSONString(ResultUtils.success(info));
//    }
//
//    public String countSignedProjCyfb(JSONObject reqJson) {
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        List<SignedProjectInfo> infos = mapper.countSignedProjCyfb(req);
//
//        return JSON.toJSONString(ResultUtils.success(infos));
//    }
//
//    public String countSignedProjSqTask(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        List<QxScoreVo> taskMap = mapper.countSignedProjSqTask(req);
//        return JSON.toJSONString(ResultUtils.success(taskMap));
//    }
//
//    public String countSignedProjZoneTask(JSONObject reqJson) {
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        Map loginManager = ContextUtil.getLoginManager();
//        StatisticsMapper mapper = getMapper();
//        req.setDistrictCode(loginManager.get("dept_code").toString());
//        List<QxScoreVo> taskMap = mapper.countSignedProjZoneTask(req);
//        return JSON.toJSONString(ResultUtils.success(taskMap));
//    }
//
//    public String countSignedProjType(JSONObject reqJson) {
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(reqJson.optInt("rmb"));
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        StatisticsMapper mapper = getMapper();
//        req.setRmb(reqJson.optInt("rmb"));
//        req.setDoller(e.getDollar());
//        List<SignedCylVo> taskMap = mapper.countSignedProjType(req);
//        return JSON.toJSONString(ResultUtils.success(taskMap));
//    }
//
//    public String countProjSigned(JSONObject reqJson) {
//        ConditionTypeEnum e = ConditionTypeEnum.getInstanceByRmb(reqJson.optInt("rmb"));
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        StatisticsMapper mapper = getMapper();
//        req.setRmb(reqJson.optInt("rmb"));
//        req.setDoller(e.getDollar());
//        req.setProjType(reqJson.getString("projType"));
//        List<ProjSignedDetailVo> taskMap = mapper.countProjSigned(req);
//        return JSON.toJSONString(ResultUtils.success(taskMap));
//    }
//
//    /**
//     * 导出四重
//     *
//     * @param reqJson
//     * @return
//     */
//    public String exportSignedProjType(JSONObject reqJson) {
//        ConditionTypeEnum en = ConditionTypeEnum.getInstanceByRmb(reqJson.optInt("rmb"));
//        KeyZoneAndQxScoreReq req = checkReq(reqJson);
//        StatisticsMapper mapper = getMapper();
//        req.setRmb(reqJson.optInt("rmb"));
//        req.setDoller(en.getDollar());
//        List<SignedCylVo> taskMap = mapper.countSignedProjType(req);
//        try {
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template1.xlsx";
//            File f = new File(templateFile);
//            if (!f.exists()) {
//                return error("数据模板不存在");
//            }
//            List<List<Object>> resultList = new ArrayList<>();
//            for (int i = 0; i < taskMap.size(); i++) {
//                SignedCylVo vo = taskMap.get(i);
//                List<Object> list2 = new ArrayList<>();
//                list2.add(vo.getName());
//                list2.add(vo.getJjsNum());
//                list2.add(vo.getJjsQyje());
//                list2.add(vo.getTxsNum());
//                list2.add(vo.getTxsQyje());
//                list2.add(vo.getXhsNum());
//                list2.add(vo.getXhsQyje());
//                list2.add(vo.getHlqNum());
//                list2.add(vo.getHlqQyje());
//                list2.add(vo.getJyqNum());
//                list2.add(vo.getJyqQyje());
//                list2.add(vo.getYygxqNum());
//                list2.add(vo.getYygxqQyje());
//                list2.add(vo.getTotal());
//                list2.add(vo.getTotalQyje());
//                resultList.add(list2);
//            }
//            UUID uuid = UUID.randomUUID();
//            String str = uuid.toString();
//            String director = request.getServletContext().getRealPath("/") + "down/";
//            File folder = new File(director);
//            // 判断文件夹是否存在
//            if (!folder.exists()) {
//                folder.mkdirs();
//            }
//            File f2 = new File(director + str + ".xlsx");
//            f2.createNewFile();
//            Util.copyFile(f, f2);
//            ExcelUtil.writeExcel(resultList, f2.getAbsolutePath(), 3);
//            JSONObject jsonObject = new JSONObject();
//            jsonObject.put("datalist", taskMap);
//            jsonObject.put("filepath", "../../down/" + str + ".xlsx");
//            return result(jsonObject);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return error("数据错误");
//        }
//
//    }
//
//    /**
//     * 导出四重
//     *
//     * @param reqJson
//     * @return
//     */
//    public void exportProjSigned(JSONObject reqJson) throws Exception {
//        ExcelWriter excelWriter = null;
//        ServletOutputStream out = null;
//        try {
//            // 参数校验
//            if (reqJson == null) {
//                throw new IllegalArgumentException("请求参数不能为空");
//            }
//
//            ConditionTypeEnum en = ConditionTypeEnum.getInstanceByRmb(reqJson.optInt("rmb"));
//            KeyZoneAndQxScoreReq req = checkReq(reqJson);
//            if (req == null) {
//                throw new IllegalArgumentException("日期参数错误");
//            }
//
//            StatisticsMapper mapper = getMapper();
//            req.setRmb(reqJson.optInt("rmb"));
//            req.setDoller(en.getDollar());
//            req.setProjType(reqJson.getString("projType"));
//            List<ProjSignedDetailVo> taskMap = mapper.countProjSigned(req);
//
//            HttpServletRequest request = ContextUtil.getHttpRequest();
//            HttpServletResponse response = ContextUtil.getHttpResponse();
//
//            // 设置响应头
//            setExcelResponseHeader(response, "产业链项目明细表");
//
//            String templateFile = request.getServletContext().getRealPath("/") + "excel/template7.xlsx";
//            File template = new File(templateFile);
//            if (!template.exists()) {
//                throw new IllegalStateException("导出模板文件不存在");
//            }
//
//            // 准备基础数据
//            Map<String, Object> baseData = new HashMap<>();
//            baseData.put("dateStr", String.format("%s-%s",
//                    DateUtil.format(DateUtil.parse(req.getCurrStartDate(),"yyyy-MM-dd"),"yyyy年MM月"),
//                    DateUtil.format(DateUtil.parse(req.getCurrEndDate(),"yyyy-MM-dd"),"yyyy年MM月")));
//
//            String jeStr;
//            if(en.getRmb()==1){
//                jeStr = "1亿人民币（1000万美元）";
//            } else if(en.getRmb()==5){
//                jeStr = "5亿人民币（3000万美元）";
//            } else {
//                jeStr = "10亿人民币（1亿美元）";
//            }
//            baseData.put("jeStr", jeStr);
//            baseData.put("projType", reqJson.getString("projTypeName").split("-")[1]);
//
//            // 获取输出流
//            out = response.getOutputStream();
//
//            // 使用2.2.6版本的写法
//            excelWriter = EasyExcel.write(out)
//                    .withTemplate(templateFile)
//                    .build();
//            WriteSheet writeSheet = EasyExcel.writerSheet().build();
//
//            // 填充数据
//            excelWriter.fill(taskMap, writeSheet);
//            excelWriter.fill(baseData, writeSheet);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            throw e;
//        } finally {
//            // 确保ExcelWriter正确关闭
//            if (excelWriter != null) {
//                try {
//                    excelWriter.finish();
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//            // 关闭输出流
//            if (out != null) {
//                try {
//                    out.flush();
//                    out.close();
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            }
//        }
//    }
//
//    // 优化响应头设置方法
//    private void setExcelResponseHeader(HttpServletResponse response, String fileName)
//            throws UnsupportedEncodingException {
//        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//        response.setCharacterEncoding("utf-8");
//        // 处理文件名中的特殊字符
//        fileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.name())
//                .replaceAll("\\+", "%20");
//        response.setHeader("Content-disposition", String.format("attachment;filename*=utf-8''%s.xlsx", fileName));
//        // 禁用缓存
//        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//        response.setHeader("Pragma", "no-cache");
//        response.setHeader("Expires", "0");
//    }
//}
