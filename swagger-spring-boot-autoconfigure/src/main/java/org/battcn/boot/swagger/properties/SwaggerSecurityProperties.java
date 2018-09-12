package org.battcn.boot.swagger.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * @author Levin
 */
@ConfigurationProperties("spring.swagger.security")
public class SwaggerSecurityProperties {

    /**
     * 安全过滤器插件开关
     */
    private boolean filterPlugin;
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;

    public boolean isFilterPlugin() {
        return filterPlugin;
    }

    public void setFilterPlugin(boolean filterPlugin) {
        this.filterPlugin = filterPlugin;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}