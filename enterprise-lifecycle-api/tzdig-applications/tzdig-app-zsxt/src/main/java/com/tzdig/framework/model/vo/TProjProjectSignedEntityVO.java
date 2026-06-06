package com.tzdig.framework.model.vo;

import com.tzdig.framework.file.annotation.S3Transformable;
import com.tzdig.framework.mybatis.entity.zsxt.TProjProjectSigned;
import com.tzdig.framework.util.S3TransformUtil;
import kotlin.jvm.functions.Function1;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;

public class TProjProjectSignedEntityVO extends TProjProjectSigned implements S3Transformable {


    public TProjProjectSignedEntityVO(TProjProjectSigned record){
        BeanUtils.copyProperties(record, this);
        // 手动复制 is 开头的字段
        this.setKcProj(record.isKcProj());
        this.setFixedAsset(record.isFixedAsset());
        this.setUseLand(record.isUseLand());
        this.setSixpro(record.isSixpro());
        this.setNew(record.isNew());
        this.setWorld(record.isWorld());
        this.setChina(record.isChina());
        this.setListed(record.isListed());
        this.setUnicorn(record.isUnicorn());
        this.setNewproject(record.isNewproject());
        this.setGx(record.isGx());
        this.setGjs(record.isGjs());
        this.setGxjs(record.isGxjs());
        this.setRzxq(record.isRzxq());
        this.setQflp(record.isQflp());
        this.setSwzjtr(record.isSwzjtr());
        this.setGyzl(record.isGyzl());
        this.setWaterpf(record.isWaterpf());
        this.setWuran(record.isWuran());
        this.setYanfa(record.isYanfa());
        this.setZhuanli(record.isZhuanli());
        this.setImportant(record.isImportant());
        this.setZsh(record.isZsh());
        this.setGazelle(record.isGazelle());
        this.setSpecialized(record.isSpecialized());
        this.setImportProj(record.isImportProj());
    }


    @Override
    public void s3transform (@NotNull Function1<? super String, String> transform) {
        this.setFiles(S3TransformUtil.transformFileList(this.getFiles(), transform));
    }
}
