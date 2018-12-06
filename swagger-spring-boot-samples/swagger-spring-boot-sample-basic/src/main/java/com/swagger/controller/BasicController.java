package com.swagger.controller;

import com.battcn.boot.swagger.annotation.ApiOrder;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@ApiOrder(200)
@RestController
@RequestMapping("/basic")
@Api(description = "测试排序", value = "测试排序",tags = "4.0.7")
public class BasicController {


    @GetMapping("/1")
    public int testPage1() {

        return 100;
    }


}
