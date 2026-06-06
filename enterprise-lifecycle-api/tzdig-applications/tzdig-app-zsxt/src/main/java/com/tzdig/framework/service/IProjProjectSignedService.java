package com.tzdig.framework.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tzdig.framework.file.model.vo.FileDownloadVO;
import com.tzdig.framework.model.dto.ProjCheckDTO;
import com.tzdig.framework.model.dto.ProjCheckListDTO;
import com.tzdig.framework.model.dto.TProjProjectSignedDTO;
import com.tzdig.framework.mybatis.entity.zsxt.TFile;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.mybatis.pageable.Pageable;
import com.tzdig.framework.mybatis.pageable.PageableResult;
import com.tzdig.framework.mybatis.vo.TProjProjectSignedReq;
import java.util.List;

/**
 * 签约项目业务 Service
 */
public interface IProjProjectSignedService {

    /**
     * 多维度分页查询签约项目
     */
    PageableResult<TProjProjectSigned> search(Pageable pageable, TProjProjectSignedDTO reqObj);
    
    /**
     * 组合报表分页查询（重写版，独立于 search）
     */
    PageableResult<TProjProjectSigned> searchBy(Pageable pageable, TProjProjectSignedDTO reqObj);

    /**
     * 组合报表列表查询（导出使用）
     */
    List<TProjProjectSigned> listBy(TProjProjectSignedDTO reqObj);

    /**
     * 保存备注信息
     */
    void saveRemarks(TProjProjectSigned entity);

    void saveTemp(TProjProjectSigned signedEntity);

    void save(TProjProjectSigned signedEntity);

    void update(TProjProjectSigned signedEntity);

    void updateOrSaveRegister(TProjProjectSigned signedEntity);

    void updateOrSaveBA(TProjProjectSigned signedEntity);

    void updateOrSaveApprove(TProjProjectSigned signedEntity);

    void createKg(TProjProjectSigned signedEntity);

    void createJg(TProjProjectSigned signedEntity);

    TFile exportWord(TProjProjectSigned signedEntity);

    /**
     * 根据id查询签约项目详情（包含附件和附则信息）
     */
    TProjProjectSigned findById(String id);

    /**
     * 根据id删除签约项目（逻辑删除，更新 deleted = 1）
     */
    void deleteById(String id);

    /**
     * 审核签约项目
     */
    void checkProject(ProjCheckDTO checkDTO) throws JsonProcessingException;

    /**
     * 导出签约项目Excel
     */
    FileDownloadVO exportExcel(TProjProjectSignedDTO reqObj);

    void bmpgCallBack(TProjProjectSignedReq req);

    void kgjgCheckCallBack(TProjProjectSignedReq req);

    PageableResult<TProjProjectSigned> searchCheckList(Pageable pageable, TProjProjectSignedDTO reqObj);

    void toSigned(TProjProjectSigned params);
}
