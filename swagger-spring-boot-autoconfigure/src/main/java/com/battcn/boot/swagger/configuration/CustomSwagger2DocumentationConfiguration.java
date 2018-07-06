package com.battcn.boot.swagger.configuration;

import com.battcn.boot.swagger.properties.SwaggerProperties;
import com.battcn.boot.swagger.properties.SwaggerSecurityProperties;
import com.battcn.boot.swagger.web.CustomSwagger2Controller;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.HandlerMapping;
import springfox.documentation.spring.web.PropertySourcedRequestMappingHandlerMapping;
import springfox.documentation.swagger2.configuration.Swagger2DocumentationConfiguration;

/**
 * @author Levin
 * @since 2018/7/6 0006
 */
@AutoConfigureAfter(Swagger2DocumentationConfiguration.class)
@EnableConfigurationProperties(SwaggerProperties.class)
@Configuration
public class CustomSwagger2DocumentationConfiguration {


    @Bean
    public HandlerMapping customSwagger2ControllerMapping(
            Environment environment,
            SwaggerSecurityProperties swaggerSecurityProperties) {
        return new PropertySourcedRequestMappingHandlerMapping(
                environment,
                new CustomSwagger2Controller(swaggerSecurityProperties));
    }


}
