package com.swagger.controller;

import com.swagger.entity.DefaultPojo;
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
@RestController
@RequestMapping("/defaults")
@Api(tags = "1.6", description = "默认值", value = "默认值")
public class DefaultValueController {

    @GetMapping
    public DefaultPojo defaultPojo() {

        return new DefaultPojo();
    }
}
