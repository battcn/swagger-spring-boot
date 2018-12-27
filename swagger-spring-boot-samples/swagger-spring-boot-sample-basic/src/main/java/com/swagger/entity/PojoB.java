package com.swagger.entity;

import io.swagger.annotations.ApiModel;

/**
 * @author Levin
 * @since 2018/10/17 0017
 */
@ApiModel(description = "class pojoB对象")
public class PojoB {

    private long id;
    private String address;
    private PojoA pojoA;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public PojoA getPojoA() {
        return pojoA;
    }

    public void setPojoA(PojoA pojoA) {
        this.pojoA = pojoA;
    }
}
