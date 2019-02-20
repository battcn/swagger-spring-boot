package com.swagger.controller.other;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.*;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@RestController
@RequestMapping("/json")
@Api(description = "阿里JSON", value = "阿里JSON")
public class JsonController {

    @GetMapping
    public String string(String value) {
        return value;
    }

    @PostMapping("/test1")
    public String test1(@RequestBody String object) {
        return object;
    }

    @PostMapping("/test2")
    public JSONObject test2(@RequestBody JSONObject object) {
        return object;
    }
}
