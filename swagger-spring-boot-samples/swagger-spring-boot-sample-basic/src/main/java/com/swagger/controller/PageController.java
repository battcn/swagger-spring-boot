package com.swagger.controller;

import com.swagger.entity.Page;
import io.swagger.annotations.Api;
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

    @GetMapping("/1")
    public int testPage1() {

        return 100;
    }


}
