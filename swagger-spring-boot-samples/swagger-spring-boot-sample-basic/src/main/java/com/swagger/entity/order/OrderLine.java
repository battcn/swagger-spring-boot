package com.swagger.entity.order;

import com.swagger.entity.Address;
import com.swagger.entity.Message;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author Levin
 * @since 2019/2/12 0012
 */
@ApiModel(description = "订单行项")
public class OrderLine {

    @ApiModelProperty(value = "ID")
    private long id;
    @ApiModelProperty(value = "名字", allowableValues = "衣服")
    private String name;
    @ApiModelProperty("收货地址")
    private List<Address> addresses;
    @ApiModelProperty(value = "订单标签", allowableValues = "奔驰,宝马")
    private List<String> tags;

    private Message message;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }
}
