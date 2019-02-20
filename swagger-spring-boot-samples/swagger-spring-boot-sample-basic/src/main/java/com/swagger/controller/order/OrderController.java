package com.swagger.controller.order;

import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import com.swagger.entity.order.Order;
import com.swagger.entity.order.OrderLine;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Levin
 * @since 2019/2/12 0012
 */
@RestController
@RequestMapping("/orders")
@Api(tags = {"9.0.1"}, description = "订单", value = "订单")
public class OrderController {


    @GetMapping
    @ApiOperation(value = "条件查询（DONE）")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "status", value = "状态", example = "111", paramType = "query", defaultValue = "100", allowableValues = "1,2,3,4"),
            @ApiImplicitParam(name = "name", value = "姓名", example = "姓名", paramType = "query", required = true),
            @ApiImplicitParam(name = "remark", value = "备注", example = "备注", paramType = "query", required = true),
    })
    public String query(Integer status, String name, String remark) {
        return status + "===" + name + "|||" + remark;
    }

    @PostMapping("/add1")
    @ApiOperation(value = "测试添加（DONE）")
    public Order post(@RequestBody Order order) {
        return order;
    }

    @PostMapping("/add2")
    @ApiOperation(value = "测试添加（DONE）")
    public List<Order> post(@RequestBody List<Order> orders) {
        return orders;
    }

    @PostMapping("/add3")
    @ApiOperation(value = "测试添加（DONE）")
    public List<Order> post3(@RequestParam String key1, @RequestParam String key2, String key3, String key4, @RequestBody List<Order> orders) {
        System.out.println("==================key1==================" + key1);
        System.out.println("==================key2==================" + key2);
        System.out.println("==================key3==================" + key3);
        System.out.println("==================key4==================" + key4);
        return orders;
    }


    @PutMapping("/{key}/{key1}/a/b/{key2}/add4")
    @ApiOperation(value = "测试添加（DONE）")
    public List<Order> post4(@PathVariable String key, @PathVariable String key1, @PathVariable String key2, String key3, String key4, @RequestBody List<Order> orders) {
        System.out.println("==================key==================" + key);
        System.out.println("==================key1==================" + key1);
        System.out.println("==================key2==================" + key2);
        System.out.println("==================key3==================" + key3);
        System.out.println("==================key4==================" + key4);
        return orders;
    }

    public static void main(String[] args) {
        List<Order> orders = Lists.newArrayList();
        Order order = new Order();
        order.setId(1);
        order.setCount(10L);
        OrderLine line = new OrderLine();
        line.setId(111L);
        order.setOrderLines(Lists.newArrayList(line));
        orders.add(order);
        System.out.println(JSON.toJSONString(orders));
    }


}
