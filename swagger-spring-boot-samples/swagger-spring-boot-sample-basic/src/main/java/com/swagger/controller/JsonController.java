package com.swagger.controller;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@RestController
@RequestMapping("/json")
@Api(tags = "1.7", description = "阿里JSON", value = "阿里JSON")
public class JsonController {

    @PostMapping
    public JSONObject jsonObject(@ApiParam("这是一串JSON内容")@RequestBody JSONObject value) {
        return value;
    }
}
