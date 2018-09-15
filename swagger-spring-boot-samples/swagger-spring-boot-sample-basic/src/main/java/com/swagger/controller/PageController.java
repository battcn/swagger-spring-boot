package com.swagger.controller;

import com.swagger.entity.Page;
import com.swagger.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@RestController
@RequestMapping("/pages")
@Api(tags = "1.2", description = "分页管理", value = "系统管理")
public class PageController {


    @PostMapping
    public Page testPage(@RequestBody Page page) {

        return page;
    }

    @PostMapping("/users")
    @ApiOperation(value = "测试双POST（DONE）",notes = "测试一下notes属性")
    public User post(@RequestBody User user) {
        return user;
    }

    @GetMapping("/1")
    public int testPage1() {

        return 100;
    }


}
