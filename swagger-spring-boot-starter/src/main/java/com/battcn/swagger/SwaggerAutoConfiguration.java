package com.battcn.swagger;

import com.battcn.swagger.properties.SwaggerProperties;
import com.google.common.base.Predicate;
import com.google.common.collect.Lists;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.configuration.Swagger2DocumentationConfiguration;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static com.google.common.base.Predicates.*;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;


/**
 * @author Levin
 */
@Configuration
@ConditionalOnProperty(name = "spring.swagger.enabled", havingValue = "true", matchIfMissing = true)
@Import({
        Swagger2DocumentationConfiguration.class,
        BeanValidatorPluginsConfiguration.class
})
@EnableAutoConfiguration
public class SwaggerAutoConfiguration implements BeanFactoryAware {

    private static final String DEFAULT_GROUP_NAME = "default";
    private static final String BASE_PATH = "/**";

    private BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
    }

    @Bean
    @ConditionalOnMissingBean
    public SwaggerProperties swaggerProperties() {
        return new SwaggerProperties();
    }

    @Bean
    @ConditionalOnMissingBean
    public List<Docket> createRestApi(SwaggerProperties swaggerProperties) {
        ConfigurableBeanFactory configurableBeanFactory = (ConfigurableBeanFactory) beanFactory;
        List<Docket> docketList = new LinkedList<>();

        // 没有分组
        if (swaggerProperties.getGroups().size() == 0) {
            ApiInfo apiInfo = new ApiInfoBuilder()
                    .title(swaggerProperties.getTitle())
                    .description(swaggerProperties.getDescription())
                    .version(swaggerProperties.getVersion())
                    .license(swaggerProperties.getLicense())
                    .licenseUrl(swaggerProperties.getLicenseUrl())
                    .contact(new Contact(swaggerProperties.getContact().getName(),
                            swaggerProperties.getContact().getUrl(),
                            swaggerProperties.getContact().getEmail()))
                    .termsOfServiceUrl(swaggerProperties.getTermsOfServiceUrl())
                    .build();

            // base-path处理
            // 当没有配置任何path的时候，解析/**
            if (swaggerProperties.getBasePath().isEmpty()) {
                swaggerProperties.getBasePath().add(BASE_PATH);
            }

            List<Predicate<String>> basePath = swaggerProperties.getBasePath().stream().map(PathSelectors::ant).collect(toList());

            // exclude-path 处理
            List<Predicate<String>> excludePath = Lists.newArrayList();
            for (String path : swaggerProperties.getExcludePath()) {
                excludePath.add(PathSelectors.ant(path));
            }

            Docket docket = new Docket(DocumentationType.SWAGGER_2)
                    .host(swaggerProperties.getHost())
                    .apiInfo(apiInfo)
                    .globalOperationParameters(buildGlobalOperationParameters(swaggerProperties.getGlobalOperationParameters()))
                    .select()
                    .apis(RequestHandlerSelectors.basePackage(swaggerProperties.getBasePackage()))
                    .paths(and(not(or(excludePath)), or(basePath)))
                    .build();

            configurableBeanFactory.registerSingleton(DEFAULT_GROUP_NAME, docket);
            docketList.add(docket);
            return docketList;
        }

        // 分组创建
        for (String groupName : swaggerProperties.getGroups().keySet()) {
            SwaggerProperties.GroupInfo groupInfo = swaggerProperties.getGroups().get(groupName);
            SwaggerProperties.Contact contact = groupInfo.getContact();
            ApiInfo apiInfo = new ApiInfoBuilder()
                    .title(defaultString(groupInfo.getTitle(), swaggerProperties.getTitle()))
                    .description(defaultString(groupInfo.getDescription(), swaggerProperties.getDescription()))
                    .version(defaultString(groupInfo.getVersion(), swaggerProperties.getVersion()))
                    .license(defaultString(groupInfo.getLicense(), swaggerProperties.getLicense()))
                    .licenseUrl(defaultString(groupInfo.getLicenseUrl(), swaggerProperties.getLicenseUrl()))
                    .contact(new Contact(
                            defaultString(contact.getName(), swaggerProperties.getContact().getName()),
                            defaultString(contact.getUrl(), swaggerProperties.getContact().getUrl()),
                            defaultString(contact.getEmail(), swaggerProperties.getContact().getEmail())))
                    .termsOfServiceUrl(defaultString(groupInfo.getTermsOfServiceUrl(), swaggerProperties.getTermsOfServiceUrl()))
                    .build();

            // base-path处理
            // 当没有配置任何path的时候，解析/**
            if (groupInfo.getBasePath().isEmpty()) {
                groupInfo.getBasePath().add(BASE_PATH);
            }

            List<Predicate<String>> basePath = groupInfo.getBasePath().stream().map(PathSelectors::ant).collect(toList());
            // exclude-path处理
            List<Predicate<String>> excludePath = Lists.newArrayList();
            for (String path : groupInfo.getExcludePath()) {
                excludePath.add(PathSelectors.ant(path));
            }

            Docket docket = new Docket(DocumentationType.SWAGGER_2)
                    .host(swaggerProperties.getHost())
                    .apiInfo(apiInfo)
                    .globalOperationParameters(assemblyGlobalOperationParameters(swaggerProperties.getGlobalOperationParameters(),
                            groupInfo.getGlobalOperationParameters()))
                    .groupName(groupName)
                    .select()
                    .apis(RequestHandlerSelectors.basePackage(groupInfo.getBasePackage()))
                    .paths(and(not(or(excludePath)), or(basePath)))
                    .build();

            configurableBeanFactory.registerSingleton(groupName, docket);
            docketList.add(docket);
        }
        return docketList;
    }

    /**
     * 读取SwaggerProperties配置,构建全局操作参数
     *
     * @param globalOperationParameters 全局参数
     * @return 参数集
     */
    private List<Parameter> buildGlobalOperationParameters(List<SwaggerProperties.GlobalOperationParameter> globalOperationParameters) {
        List<Parameter> parameters = Lists.newArrayList();

        if (Objects.isNull(globalOperationParameters)) {
            return parameters;
        }
        for (SwaggerProperties.GlobalOperationParameter globalOperationParameter : globalOperationParameters) {
            parameters.add(new ParameterBuilder()
                    .name(globalOperationParameter.getName())
                    .description(globalOperationParameter.getDescription())
                    .modelRef(new ModelRef(globalOperationParameter.getModelRef()))
                    .parameterType(globalOperationParameter.getParameterType())
                    .required(globalOperationParameter.getRequired())
                    .build());
        }
        return parameters;
    }

    /**
     * 局部参数按照name覆盖局部参数
     *
     * @param globalOperationParameters 全局参数
     * @param groupOperationParameters  附加参数
     * @return 参数集
     */
    private List<Parameter> assemblyGlobalOperationParameters(
            List<SwaggerProperties.GlobalOperationParameter> globalOperationParameters,
            List<SwaggerProperties.GlobalOperationParameter> groupOperationParameters) {
        if (Objects.isNull(groupOperationParameters) || groupOperationParameters.isEmpty()) {
            return buildGlobalOperationParameters(globalOperationParameters);
        }
        Set<String> groupNames = groupOperationParameters.stream().map(SwaggerProperties.GlobalOperationParameter::getName).collect(toSet());

        List<SwaggerProperties.GlobalOperationParameter> resultOperationParameters = Lists.newArrayList();
        if (Objects.nonNull(globalOperationParameters)) {
            for (SwaggerProperties.GlobalOperationParameter parameter : globalOperationParameters) {
                if (!groupNames.contains(parameter.getName())) {
                    resultOperationParameters.add(parameter);
                }
            }
        }
        resultOperationParameters.addAll(groupOperationParameters);
        return buildGlobalOperationParameters(resultOperationParameters);
    }


    private static String defaultString(final String str, final String defaultStr) {
        return str == null || Objects.equals(str.trim(), "") || str.length() == 0 ? defaultStr : str;
    }
}