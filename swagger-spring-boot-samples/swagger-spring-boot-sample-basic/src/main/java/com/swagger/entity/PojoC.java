package com.swagger.entity;

/**
 * @author Levin
 * @since 2018/10/17 0017
 */
public class PojoC {

    private long id;
    private String address;
    private PojoD pojoD;

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

    public PojoD getPojoD() {
        return pojoD;
    }

    public void setPojoD(PojoD pojoD) {
        this.pojoD = pojoD;
    }
}
