package com.swagger.controller;

import com.swagger.entity.PojoA;
import com.swagger.entity.PojoC;
import com.swagger.entity.PojoD;
import com.swagger.entity.TreeNode;
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
@RequestMapping("/trees")
@Api(tags = "2.5", description = "数型结构", value = "数型结构")
public class TreeController {

    @GetMapping
    public TreeNode tree() {

        return new TreeNode();
    }

    @GetMapping("/test2")
    public PojoA test2() {
        return new PojoA();
    }


    @GetMapping("/test3")
    public PojoC test3() {
        return new PojoC();
    }

}
