package com.battcn.swagger.properties;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


/**
 * @author Levin
 */
@Data
@ConfigurationProperties("spring.swagger")
public class SwaggerProperties {


    private static final String DEFAULT_NULL = "";

    /**
     * 是否开启swagger
     */
    private Boolean enabled;
    /**
     * 标题
     */
    private String title = DEFAULT_NULL;
    /**
     * 描述
     */
    private String description = DEFAULT_NULL;
    /**
     * 版本
     */
    private String version = DEFAULT_NULL;
    /**
     * 许可证
     */
    private String license = DEFAULT_NULL;
    /**
     * 许可证URL
     */
    private String licenseUrl = DEFAULT_NULL;
    /**
     * 服务条款URL
     */
    private String termsOfServiceUrl = DEFAULT_NULL;

    /**
     * swagger会解析的包路径
     */
    private String basePackage = DEFAULT_NULL;

    /**
     * host信息
     */
    private String host = DEFAULT_NULL;

    /**
     * 联系人信息
     */
    private Contact contact = new Contact();

    /**
     * swagger会解析的url规则
     */
    private List<String> basePath = new ArrayList<>();
    /**
     * 在basePath基础上需要排除的url规则
     */
    private List<String> excludePath = new ArrayList<>();

    /**
     * 分组文档
     */
    private Map<String, GroupInfo> groups = new LinkedHashMap<>();


    /**
     * 全局参数配置
     */
    private List<GlobalOperationParameter> globalOperationParameters;

    /**
     * 是否开启验证插件支持（默认关闭）
     */
    private boolean validatorPlugin = false;

    public boolean isValidatorPlugin() {
        return validatorPlugin;
    }

    public void setValidatorPlugin(boolean validatorPlugin) {
        this.validatorPlugin = validatorPlugin;
    }

    @Data
    @NoArgsConstructor
    public static class GlobalOperationParameter {

        /**
         * 参数名
         */
        private String name;

        /**
         * 描述信息
         */
        private String description;

        /**
         * 指定参数类型
         */
        private String modelRef;

        /**
         * 参数存放位置:
         *
         * @see ApiParamType
         */
        private String parameterType;

        /**
         * 是否必须传
         */
        private Boolean required = false;

    }

    @Data
    @NoArgsConstructor
    @ConfigurationProperties("spring.swagger.groups")
    public static class GroupInfo {

        /**
         * 标题
         */
        private String title = DEFAULT_NULL;
        /**
         * 描述
         */
        private String description = DEFAULT_NULL;

        /**
         * 版本
         */
        private String version = DEFAULT_NULL;

        /**
         * 许可证
         */
        private String license = DEFAULT_NULL;

        /**
         * 许可证URL
         */
        private String licenseUrl = DEFAULT_NULL;

        /**
         * 服务条款URL
         */
        private String termsOfServiceUrl = DEFAULT_NULL;

        private Contact contact = new Contact();

        /**
         * swagger会解析的包路径
         */
        private String basePackage = DEFAULT_NULL;

        /**
         * swagger会解析的url规则
         */
        private List<String> basePath = new ArrayList<>();
        /**
         * 在basePath基础上需要排除的url规则
         */
        private List<String> excludePath = new ArrayList<>();

        /**
         * 分组里的全局参数
         */
        private List<GlobalOperationParameter> globalOperationParameters;

    }

    @Data
    @NoArgsConstructor
    public static class Contact {
        /**
         * 联系人
         */
        private String name = DEFAULT_NULL;
        /**
         * 联系人url
         */
        private String url = DEFAULT_NULL;
        /**
         * 联系人email
         */
        private String email = DEFAULT_NULL;

    }

}