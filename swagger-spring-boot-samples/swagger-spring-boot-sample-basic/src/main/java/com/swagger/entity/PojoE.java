package com.swagger.entity;

/**
 * @author Levin
 * @since 2018/10/17 0017
 */
public class PojoE {

    private long id;
    private String address;
    private PojoE pojoE;

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

    public PojoE getPojoE() {
        return pojoE;
    }

    public void setPojoE(PojoE pojoE) {
        this.pojoE = pojoE;
    }
}
