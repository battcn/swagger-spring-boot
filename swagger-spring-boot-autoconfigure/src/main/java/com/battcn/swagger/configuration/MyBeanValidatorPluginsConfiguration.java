package com.battcn.swagger.configuration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;

/**
 * @author Levin
 * @since 2018/6/14 0014
 */
@Configuration
@ConditionalOnProperty(name = "spring.swagger.validator-plugin", havingValue = "true")
public class MyBeanValidatorPluginsConfiguration extends BeanValidatorPluginsConfiguration {

}
