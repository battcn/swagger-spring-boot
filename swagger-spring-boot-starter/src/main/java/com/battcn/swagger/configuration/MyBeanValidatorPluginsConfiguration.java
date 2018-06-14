package com.battcn.swagger.configuration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.swagger2.configuration.Swagger2DocumentationConfiguration;

/**
 * @author Levin
 * @since 2018/6/14 0014
 */
@Configuration
@ConditionalOnProperty(name = "spring.swagger.validator-plugin", havingValue = "true", matchIfMissing = true)
@Import({Swagger2DocumentationConfiguration.class, BeanValidatorPluginsConfiguration.class})
@EnableAutoConfiguration
public class MyBeanValidatorPluginsConfiguration extends BeanValidatorPluginsConfiguration {

}
