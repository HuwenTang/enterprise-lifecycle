package com.tzdig.framework.model.vo;

import com.tzdig.framework.file.annotation.S3Transformable;
import com.tzdig.framework.mybatis.entity.zsxt.TBizInvestDemand;
import com.tzdig.framework.util.S3TransformUtil;
import kotlin.jvm.functions.Function1;
import lombok.Data;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeanUtils;

/**
 * 招商需求留言板 VO
 */
@Data
public class TBizInvestDemandVO extends TBizInvestDemand implements S3Transformable {

    public TBizInvestDemandVO(TBizInvestDemand record){
        BeanUtils.copyProperties(record, this);
    }

    @Override
    public void s3transform(@NotNull Function1<? super String, String> transform) {
        this.setFilePath(S3TransformUtil.transformCommaSeparated(this.getFilePath(), transform));
    }
}