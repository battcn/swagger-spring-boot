package com.battcn.swagger;

import com.battcn.swagger.properties.SwaggerProperties;
import com.google.common.base.Predicate;
import com.google.common.collect.Lists;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
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
@ConditionalOnProperty(name = "swagger.enabled", matchIfMissing = true)
@Import({
        Swagger2DocumentationConfiguration.class,
        BeanValidatorPluginsConfiguration.class
})
public class SwaggerAutoConfiguration implements BeanFactoryAware {

    private static final String DEFAULT_DOCKET = "defaultDocket";
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
        if (swaggerProperties.getDocket().size() == 0) {
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

            configurableBeanFactory.registerSingleton(DEFAULT_DOCKET, docket);
            docketList.add(docket);
            return docketList;
        }

        // 分组创建
        for (String groupName : swaggerProperties.getDocket().keySet()) {
            SwaggerProperties.DocketInfo docketInfo = swaggerProperties.getDocket().get(groupName);
            SwaggerProperties.Contact contact = docketInfo.getContact();
            ApiInfo apiInfo = new ApiInfoBuilder()
                    .title(docketInfo.getTitle().isEmpty() ? swaggerProperties.getTitle() : docketInfo.getTitle())
                    .description(docketInfo.getDescription().isEmpty() ? swaggerProperties.getDescription() : docketInfo.getDescription())
                    .version(docketInfo.getVersion().isEmpty() ? swaggerProperties.getVersion() : docketInfo.getVersion())
                    .license(docketInfo.getLicense().isEmpty() ? swaggerProperties.getLicense() : docketInfo.getLicense())
                    .licenseUrl(docketInfo.getLicenseUrl().isEmpty() ? swaggerProperties.getLicenseUrl() : docketInfo.getLicenseUrl())
                    .contact(
                            new Contact(
                                    contact.getName().isEmpty() ? swaggerProperties.getContact().getName() : contact.getName(),
                                    contact.getUrl().isEmpty() ? swaggerProperties.getContact().getUrl() : contact.getUrl(),
                                    contact.getEmail().isEmpty() ? swaggerProperties.getContact().getEmail() : contact.getEmail()
                            )
                    )
                    .termsOfServiceUrl(docketInfo.getTermsOfServiceUrl().isEmpty() ? swaggerProperties.getTermsOfServiceUrl() : docketInfo.getTermsOfServiceUrl())
                    .build();

            // base-path处理
            // 当没有配置任何path的时候，解析/**
            if (docketInfo.getBasePath().isEmpty()) {
                docketInfo.getBasePath().add(BASE_PATH);
            }

            List<Predicate<String>> basePath = docketInfo.getBasePath().stream().map(PathSelectors::ant).collect(toList());

            // exclude-path处理
            List<Predicate<String>> excludePath = Lists.newArrayList();
            for (String path : docketInfo.getExcludePath()) {
                excludePath.add(PathSelectors.ant(path));
            }

            Docket docket = new Docket(DocumentationType.SWAGGER_2)
                    .host(swaggerProperties.getHost())
                    .apiInfo(apiInfo)
                    .globalOperationParameters(assemblyGlobalOperationParameters(swaggerProperties.getGlobalOperationParameters(),
                            docketInfo.getGlobalOperationParameters()))
                    .groupName(groupName)
                    .select()
                    .apis(RequestHandlerSelectors.basePackage(docketInfo.getBasePackage()))
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
                    .required(Boolean.parseBoolean(globalOperationParameter.getRequired()))
                    .build());
        }
        return parameters;
    }

    /**
     * 局部参数按照name覆盖局部参数
     *
     * @param globalOperationParameters 全局参数
     * @param docketOperationParameters 附加参数
     * @return 参数集
     */
    private List<Parameter> assemblyGlobalOperationParameters(
            List<SwaggerProperties.GlobalOperationParameter> globalOperationParameters,
            List<SwaggerProperties.GlobalOperationParameter> docketOperationParameters) {
        if (Objects.isNull(docketOperationParameters) || docketOperationParameters.isEmpty()) {
            return buildGlobalOperationParameters(globalOperationParameters);
        }

        Set<String> docketNames = docketOperationParameters.stream()
                .map(SwaggerProperties.GlobalOperationParameter::getName)
                .collect(toSet());

        List<SwaggerProperties.GlobalOperationParameter> resultOperationParameters = globalOperationParameters.stream()
                .filter(parameter -> !docketNames.contains(parameter.getName()))
                .collect(toList());

        resultOperationParameters.addAll(docketOperationParameters);
        return buildGlobalOperationParameters(resultOperationParameters);
    }
}