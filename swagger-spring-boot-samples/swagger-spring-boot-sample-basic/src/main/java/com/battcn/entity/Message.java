package com.battcn.entity;

import io.swagger.annotations.ApiModel;

@ApiModel
public class Message {

    private String msg;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
