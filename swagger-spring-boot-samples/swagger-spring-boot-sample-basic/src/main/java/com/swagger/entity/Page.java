package com.swagger.entity;

import io.swagger.annotations.ApiModel;

/**
 * @author Levin
 * @since 2018/8/6 0006
 */
@ApiModel
public class Page {

    private Integer page;
    private Integer pageSize;

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
