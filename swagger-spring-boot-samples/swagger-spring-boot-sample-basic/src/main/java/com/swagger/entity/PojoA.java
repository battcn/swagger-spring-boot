package com.swagger.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author Levin
 * @since 2018/10/17 0017
 */
@ApiModel(description = "pojoA对象")
public class PojoA {

    @ApiModelProperty("ID")
    private long id;
    @ApiModelProperty("邮箱")
    private String email;
    @ApiModelProperty("pojoB对象")
    private PojoB pojoB;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public PojoB getPojoB() {
        return pojoB;
    }

    public void setPojoB(PojoB pojoB) {
        this.pojoB = pojoB;
    }
}
