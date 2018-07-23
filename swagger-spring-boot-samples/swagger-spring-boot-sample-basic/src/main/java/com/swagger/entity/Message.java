package com.swagger.entity;

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

    public Message() {
    }

    public Message(String msg) {
        this.msg = msg;
    }
}
