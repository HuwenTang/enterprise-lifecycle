package com.tzdig.framework.model.vo;

import com.tzdig.framework.file.annotation.S3Transformable;
import com.tzdig.framework.mybatis.entity.zsxt.TProjInvestActivities;
import com.tzdig.framework.util.S3TransformUtil;
import kotlin.jvm.functions.Function1;
import lombok.Data;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;

/**
 * 市（区）活动记录导出 VO
 */
@Data
public class TProjInvestActivitiesEntityVO extends TProjInvestActivities implements S3Transformable {

    public TProjInvestActivitiesEntityVO(TProjInvestActivities record){
        BeanUtils.copyProperties(record, this);
    }

    @Override
    public void s3transform (@NotNull Function1<? super String, String> transform) {
        this.setImages(S3TransformUtil.transformCommaSeparated(this.getImages(), transform));
    }
}
