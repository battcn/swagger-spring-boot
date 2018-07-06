package com.battcn.boot.swagger.properties.enums;

/**
 * 授权路径
 *
 * @author Levin
 */
public enum PathType {

    /**
     * 所有地址都进行授权
     */
    ANY("any"),
    /**
     * 所有地址都不进行授权
     */
    NONE("none"),
    /**
     * 根据正则进行匹配
     */
    REGEX("regex"),;

    private String path;

    PathType(String path) {
        this.path = path;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
