package com.tzdig.framework.report.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tzdig.framework.mybatis.dto.HalfYearProjectReqDTO;
import com.tzdig.framework.mybatis.dto.KeyZoneAndQxScoreReqDTO;
import com.tzdig.framework.mybatis.dto.StatisticsSignedProjectReqDTO;
import com.tzdig.framework.service.IStatisticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StatisticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IStatisticsService statisticsService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testStatisticsSignedProjectInfo() throws Exception {
        StatisticsSignedProjectReqDTO reqDTO = new StatisticsSignedProjectReqDTO();
        reqDTO.setRmb(5);
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-12-31");
        reqDTO.setLastYearStartDate("2023-01-01");
        reqDTO.setLastYearEndDate("2023-12-31");
        reqDTO.setYear(2024);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/signedProjectInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsSignedProjectInfoYq() throws Exception {
        StatisticsSignedProjectReqDTO reqDTO = new StatisticsSignedProjectReqDTO();
        reqDTO.setRmb(5);
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-12-31");
        reqDTO.setLastYearStartDate("2023-01-01");
        reqDTO.setLastYearEndDate("2023-12-31");
        reqDTO.setDeptCode("3212");

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/signedProjectInfoYq")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsHalfYearProjInfo() throws Exception {
        HalfYearProjectReqDTO reqDTO = new HalfYearProjectReqDTO();
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-06-30");
        reqDTO.setLastYearStartDate("2023-01-01");
        reqDTO.setLastYearEndDate("2023-06-30");
        reqDTO.setYear(2024);
        reqDTO.setStartMonth(1);
        reqDTO.setEndMonth(6);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/halfYearProjInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsKeyZoneScorePlus() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/keyZoneScorePlus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsKeyZoneCompleteProjNums() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/keyZoneCompleteProjNums")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsQxScorePlus() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/qxScorePlus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsQxCompleteProjNums() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/qxCompleteProjNums")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsProjectInfo() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/projectInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsProjectInfoList() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/projectInfoList")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsProjectStatusInfo() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/projectStatusInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsSixCode() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/sixCode")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticProjForQxMap() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/projForQxMap")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsOnePlusFourForQx() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setStartDate("2024-01-01");
        reqDTO.setEndDate("2024-12-31");
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/onePlusFourForQx")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsSignedProjectInfoWithNullRmb() throws Exception {
        StatisticsSignedProjectReqDTO reqDTO = new StatisticsSignedProjectReqDTO();
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-12-31");

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/signedProjectInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsSignedProjectInfoWithNullDates() throws Exception {
        StatisticsSignedProjectReqDTO reqDTO = new StatisticsSignedProjectReqDTO();
        reqDTO.setRmb(5);
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-12-31");

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/signedProjectInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsHalfYearProjInfoWithNullDates() throws Exception {
        HalfYearProjectReqDTO reqDTO = new HalfYearProjectReqDTO();
        reqDTO.setCurrStartDate("2024-01-01");
        reqDTO.setCurrEndDate("2024-06-30");
        reqDTO.setYear(2024);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/halfYearProjInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void testStatisticsProjectInfoWithNullDates() throws Exception {
        KeyZoneAndQxScoreReqDTO reqDTO = new KeyZoneAndQxScoreReqDTO();
        reqDTO.setRmb(5);

        mockMvc.perform(MockMvcRequestBuilders.post("/statistics/projectInfo")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqDTO)))
                .andExpect(status().isOk())
                .andDo(print());
    }
}
