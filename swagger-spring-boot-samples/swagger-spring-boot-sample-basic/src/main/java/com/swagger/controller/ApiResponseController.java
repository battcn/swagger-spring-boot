package com.swagger.controller;

import com.swagger.entity.Address;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.web.bind.annotation.*;

/**
 * @author Levin
 * @since 2018/12/3 0003
 */
@RestController
@RequestMapping(value = "/api_responses")
@Api(tags = "3.0.1", value = "注解测试", description = "注解测试")
public class ApiResponseController {


    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 204, message = "无数据")
    })
    @GetMapping("/test1")
    public String test1() {

        return "success";
    }

    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 204, message = "无数据")
    })
    @PostMapping("/test2")
    public String test2(@RequestParam("name")String name, @RequestBody Address address) {

        return name + address.toString();
    }

}
