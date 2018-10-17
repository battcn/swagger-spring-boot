package com.swagger.entity;

/**
 * @author Levin
 * @since 2018/10/17 0017
 */
public class PojoA {

    private long id;
    private String email;
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
