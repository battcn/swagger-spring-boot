package com.swagger.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author Levin
 * @since 2018/12/19 0019
 */
@ApiModel
public class AllowableValue {

    private Long id;
    @ApiModelProperty(value = "状态码", allowableValues = "1,2,3,4")
    private Integer status;
    @ApiModelProperty(value = "名字", allowableValues = "小明")
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
