package com.swagger.controller.other;

import com.swagger.entity.AllowableValue;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

/**
 * @author Levin
 * @since 2018/12/19 0019
 */
@RestController
@RequestMapping(value = "/allowable_values")
@Api(tags = {"6.0.1"}, value = "AllowableValue", description = "AllowableValue")
public class AllowableValueController {


    @GetMapping
    @ApiOperation(value = "条件查询（DONE）")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "status", value = "状态", paramType = "query", defaultValue = "100", allowableValues = ""),
    })
    public Integer query(Integer status) {
        return status;
    }

    @PostMapping
    @ApiOperation(value = "测试添加（DONE）")
    public AllowableValue post(@RequestBody AllowableValue allowableValue) {
        return allowableValue;
    }


}
