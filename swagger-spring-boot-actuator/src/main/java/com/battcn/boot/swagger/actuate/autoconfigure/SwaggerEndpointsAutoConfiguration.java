package com.battcn.boot.swagger.actuate.autoconfigure;

import com.battcn.boot.swagger.actuate.endpoint.SwaggerEndpoint;
import org.springframework.boot.actuate.autoconfigure.endpoint.condition.ConditionalOnEnabledEndpoint;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * @author <a href="mailto:1837307557@qq.com">Levin</a>
 * @see Configuration
 * @since 2.0.2
 */
@Configuration
@EnableAutoConfiguration
@PropertySource(
        name = "Swagger Endpoints Default Properties",
        value = "classpath:/META-INF/swagger-endpoins-default.properties")
public class SwaggerEndpointsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnEnabledEndpoint
    public SwaggerEndpoint swaggerEndpoint() {
        return new SwaggerEndpoint();
    }

}
