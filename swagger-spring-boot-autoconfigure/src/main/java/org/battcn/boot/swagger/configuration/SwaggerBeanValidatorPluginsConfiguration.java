package org.battcn.boot.swagger.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;

/**
 * @author <a href="mailto:1837307557@qq.com">Levin</a>
 * @since 2.0.2
 */
@Configuration
@ConditionalOnProperty(name = {"spring.swagger.enabled", "spring.swagger.validator-plugin"}, havingValue = "true")
public class SwaggerBeanValidatorPluginsConfiguration extends BeanValidatorPluginsConfiguration {

}
