package com.battcn.controller.book;

import com.battcn.entity.Book;
import com.battcn.swagger.properties.ApiDataType;
import com.battcn.swagger.properties.ApiParamType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * swagger
 *
 * @author Levin
 * @since 2018/5/16 0016
 */
@RestController
@RequestMapping("/books")
@Api(tags = "1.2", description = "书籍管理", value = "书籍管理")
public class BookController {

    private static final Logger log = LoggerFactory.getLogger(BookController.class);

    @GetMapping
    @ApiOperation(value = "条件查询（DONE）")
    public Book query(String name) {
        log.info("query books by name : {}", name);
        return new Book(1L, name);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "删除用户（DONE）")
    @ApiImplicitParam(name = "id", value = "用户编号", dataType = ApiDataType.LONG, paramType = ApiParamType.PATH)
    public void delete(@PathVariable Long id) {
        log.info(" delete books by id : {}", id);
    }


}
