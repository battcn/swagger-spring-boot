package com.swagger.entity.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Levin
 * @since 2019/2/12 0012
 */
@ApiModel(description = "订单类")
public class Order {

    @ApiModelProperty(value = "ID")
    private int id;
    @ApiModelProperty("价格")
    private BigDecimal price;
    @ApiModelProperty("库存")
    private Long count;
    @ApiModelProperty(value = "描述", allowEmptyValue = true)
    private String desc;
    @ApiModelProperty(value = "状态码", allowableValues = "1,2,3,4")
    private Integer status;
    @ApiModelProperty(value = "名字", allowableValues = "测试商品")
    private String remark;


    @ApiModelProperty(required = true, value = "订单行")
    private List<OrderLine> orderLines;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<OrderLine> getOrderLines() {
        return orderLines;
    }

    public void setOrderLines(List<OrderLine> orderLines) {
        this.orderLines = orderLines;
    }
}
