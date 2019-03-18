package com.swagger.controller.user;

import com.battcn.boot.swagger.model.DataType;
import com.battcn.boot.swagger.model.ParamType;
import com.swagger.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@RestController
@RequestMapping("/users")
@Api(tags = "2.0.11", description = "用户管理", value = "用户管理")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping
    @ApiOperation(value = "条件查询（DONE）",notes = "测试一下notes属性")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username", value = "用户名", dataType = DataType.STRING, paramType = ParamType.QUERY,defaultValue = "username111"),
            @ApiImplicitParam(name = "password", value = "密码", dataType = DataType.STRING, paramType = ParamType.QUERY),
    })
    public User query(String username, String password) {
        log.info("多个参数用  @ApiImplicitParams");
        //return new User(1L, username, password);
        throw new RuntimeException("服务器异常..2019-03-18 15:12:11.306 ERROR 17128 --- [nio-8080-exec-4] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is java.lang.RuntimeException: 服务器异常...] with root cause\n.");
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "主键查询（DONE）",notes = "测试一下notes属性")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "用户编号", dataType = DataType.LONG, paramType = ParamType.PATH),
    })
    public User get(@PathVariable Long id) {
        log.info("单个参数用  @ApiImplicitParam");
        return new User(id, "u1", "p1");
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "删除用户（DONE）",notes = "测试一下notes属性111")
    @ApiImplicitParam(name = "id", value = "用户编号", dataType = DataType.LONG, paramType = ParamType.PATH)
    public void delete(@PathVariable Long id) {
        log.info("单个参数用 ApiImplicitParam");
    }

    @PostMapping
    @ApiOperation(value = "添加用户（DONE）")
    public User post(@RequestBody User user) {
        log.info("如果是 POST PUT 这种带 @RequestBody 的可以不用写 @ApiImplicitParam");
        return user;
    }

    @PostMapping("/multipar")
    @ApiOperation(value = "添加用户（DONE）")
    public List<User> multipar(@RequestBody List<User> user) {
        log.info("如果是 POST PUT 这种带 @RequestBody 的可以不用写 @ApiImplicitParam");

        return user;
    }

    @PostMapping("/array")
    @ApiOperation(value = "添加用户（DONE）")
    public User[] array(@RequestBody User[] user) {
        log.info("如果是 POST PUT 这种带 @RequestBody 的可以不用写 @ApiImplicitParam");
        return user;
    }

    @PostMapping("/multipar2")
    @ApiOperation(value = "添加用户（DONE）")
    public List<User> multipar2(@RequestBody List<User> user) {
        log.info("如果是 POST PUT 这种带 @RequestBody 的可以不用写 @ApiImplicitParam");

        return user;
    }

    @PostMapping("/array2")
    @ApiOperation(value = "添加用户（DONE）")
    public User[] array2(@RequestBody User[] user) {
        log.info("如果是 POST PUT 这种带 @RequestBody 的可以不用写 @ApiImplicitParam");
        return user;
    }


    @PutMapping("/{id}")
    @ApiOperation(value = "修改用户（DONE）")
    public void put(@PathVariable Long id, @RequestBody User user) {
        log.info("如果你不想写 @ApiImplicitParam 那么 swagger 也会使用默认的参数名作为描述信息 ");
    }

    @PostMapping("/{id}/file")
    @ApiOperation(value = "文件上传（DONE）")
    public String file(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        log.info(file.getContentType());
        log.info(file.getName());
        log.info(file.getOriginalFilename());
        return file.getOriginalFilename();
    }


}
