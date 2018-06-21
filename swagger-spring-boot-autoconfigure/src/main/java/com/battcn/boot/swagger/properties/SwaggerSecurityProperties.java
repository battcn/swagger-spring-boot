package com.battcn.boot.swagger.properties;

import com.battcn.boot.swagger.model.PathType;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;


/**
 * @author Levin
 */
@Data
@ConfigurationProperties("spring.swagger.security")
public class SwaggerSecurityProperties {

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
         * 自定义匹配路径的正则(如：/anyPath.*)
         */
        private String authRegex = "/anyPath.*";

        /**
         * 匹配的路径（默认所有）
         */
        private PathType pathType = PathType.ANY;

        /**
         * 传递参数的类型；默认 header 存放
         */
        private String paramType = "header";
    }
}