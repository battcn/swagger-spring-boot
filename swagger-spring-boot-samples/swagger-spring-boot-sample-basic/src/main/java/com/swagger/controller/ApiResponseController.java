package com.swagger.controller;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.swagger.entity.Address;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import springfox.documentation.spring.web.DocumentationCache;

import java.util.Map;
import java.util.Set;

/**
 * @author Levin
 * @since 2018/12/3 0003
 */
@RestController
@RequestMapping(value = "/api_responses")
@Api(tags = {"3.0.1", "2.0.5"}, value = "注解测试11", description = "注解测试22")
public class ApiResponseController {

    @Autowired
    private DocumentationCache documentationCache;
    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 204, message = "无数据")
    })
    @GetMapping("/test1")
    public Set<Map<String, String>> test1() {
        Set<Map<String, String>> classes = Sets.newLinkedHashSet();
        Map<RequestMappingInfo, HandlerMethod> map = requestMappingHandlerMapping.getHandlerMethods();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> m : map.entrySet()) {
            Map<String, String> hashMap = Maps.newHashMap();
            HandlerMethod method = m.getValue();
            final Class<?> declaringClass = method.getMethod().getDeclaringClass();
            hashMap.put("className", declaringClass.getSimpleName());
            classes.add(hashMap);
        }
        return classes;
    }

    @ApiResponses({
            @ApiResponse(code = 200, message = "成功"),
            @ApiResponse(code = 204, message = "无数据")
    })
    @PostMapping("/test2")
    public String test2(@RequestParam("name") String name, @RequestBody Address address) {

        return name + address.toString();
    }

}
