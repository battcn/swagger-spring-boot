package com.battcn.boot.swagger.model;

import lombok.Data;

import java.util.List;

/**
 * @author Levin
 * @since 2018/12/6 0006
 */
@Data
public class Order {

    private List<String> tags;
    private int order = 0;

}
