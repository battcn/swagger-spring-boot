package com.battcn.boot.swagger.properties;

import com.google.common.collect.Maps;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMethod;

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


    private static final String DEFAULT_VALUE = "";

    /**
     * 是否开启swagger
     */
    private Boolean enabled;
    /**
     * 标题
     */
    private String title = DEFAULT_VALUE;
    /**
     * 描述
     */
    private String description = DEFAULT_VALUE;
    /**
     * 版本
     */
    private String version = DEFAULT_VALUE;
    /**
     * 许可证
     */
    private String license = DEFAULT_VALUE;
    /**
     * 许可证URL
     */
    private String licenseUrl = DEFAULT_VALUE;
    /**
     * 服务条款URL
     */
    private String termsOfServiceUrl = DEFAULT_VALUE;

    /**
     * swagger会解析的包路径
     */
    private String basePackage = DEFAULT_VALUE;

    /**
     * host信息
     */
    private String host = DEFAULT_VALUE;

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
     * 全局响应配置
     */
    private Map<RequestMethod, List<ResponseMessageBody>> globalResponseMessages = Maps.newLinkedHashMap();

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


    private ApiKey apiKey;

    @Data
    public static class ApiKey {

        /**
         * 鉴权策略ID；对应 SecurityReferences ID
         */
        private String name = "X-Authorization";

        /**
         * 传递的鉴权参数字段名
         */
        private String keyName = "token";


        /**
         * 自定义匹配路径的正则(如：/anyPath.* 或者 ^.*$) 默认匹配所有
         */
        private String authRegex =  "^.*$";

        /**
         * 传递参数的类型；默认 header 存放
         */
        private String paramType = "header";
    }

    @Data
    public static class ResponseMessageBody {
        /**
         * 状态码
         */
        private int code;
        /**
         * 响应的消息内容
         */
        private String message;
        /**
         * 响应体（对象）
         */
        private String modelRef;
    }

    @Data
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
         * @see ParamType
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
        private String title = DEFAULT_VALUE;
        /**
         * 描述
         */
        private String description = DEFAULT_VALUE;

        /**
         * 版本
         */
        private String version = DEFAULT_VALUE;

        /**
         * 许可证
         */
        private String license = DEFAULT_VALUE;

        /**
         * 许可证URL
         */
        private String licenseUrl = DEFAULT_VALUE;

        /**
         * 服务条款URL
         */
        private String termsOfServiceUrl = DEFAULT_VALUE;

        private Contact contact = new Contact();

        /**
         * swagger会解析的包路径
         */
        private String basePackage = DEFAULT_VALUE;

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
        private String name = DEFAULT_VALUE;
        /**
         * 联系人url
         */
        private String url = DEFAULT_VALUE;
        /**
         * 联系人email
         */
        private String email = DEFAULT_VALUE;

    }

}