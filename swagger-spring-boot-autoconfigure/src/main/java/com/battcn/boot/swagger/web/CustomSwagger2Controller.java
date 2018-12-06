package com.battcn.boot.swagger.web;

import com.battcn.boot.swagger.annotation.ApiOrder;
import com.battcn.boot.swagger.model.Order;
import com.battcn.boot.swagger.properties.SwaggerSecurityProperties;
import com.battcn.boot.swagger.utils.HostNameProvider;
import com.battcn.boot.swagger.utils.RequestUtils;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.models.Swagger;
import io.swagger.models.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.UriComponents;
import springfox.documentation.annotations.ApiIgnore;
import springfox.documentation.service.Documentation;
import springfox.documentation.spring.web.DocumentationCache;
import springfox.documentation.spring.web.json.Json;
import springfox.documentation.spring.web.json.JsonSerializer;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.mappers.ServiceModelToSwagger2Mapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.google.common.base.Strings.isNullOrEmpty;

/**
 * @author Levin
 * @since 2018/7/6 0006
 */
@ConditionalOnProperty(name = "spring.swagger.enabled", havingValue = "true", matchIfMissing = true)
@RestController
@ApiIgnore
public class CustomSwagger2Controller {

    private static final String DEFAULT = "DEFAULT";
    private static final String V3_SWAGGER_API_DOCS = "/v3/api-docs";
    private static final String V3_SWAGGER_SECURITY_URL = "/v3/swagger-security";
    private static final String V3_SWAGGER_SECURITY_LOGIN_URL = "/v3/swagger-login";
    private final SwaggerSecurityProperties swaggerSecurityProperties;

    private final String hostNameOverride;
    private final DocumentationCache documentationCache;
    private final ServiceModelToSwagger2Mapper mapper;
    private final JsonSerializer jsonSerializer;
    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Autowired
    public CustomSwagger2Controller(SwaggerSecurityProperties swaggerSecurityProperties, Environment environment,
                                    DocumentationCache documentationCache,
                                    ServiceModelToSwagger2Mapper mapper,
                                    JsonSerializer jsonSerializer) {
        this.hostNameOverride = environment.getProperty("springfox.documentation.swagger.v2.host", "DEFAULT");
        this.documentationCache = documentationCache;
        this.mapper = mapper;
        this.jsonSerializer = jsonSerializer;
        this.swaggerSecurityProperties = swaggerSecurityProperties;
    }

    @GetMapping(value = V3_SWAGGER_SECURITY_URL, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<Map<String, Boolean>> getCustomDocumentation() {
        Map<String, Boolean> meteData = new HashMap<>(2);
        meteData.put("security", swaggerSecurityProperties.isFilterPlugin());
        return new ResponseEntity<>(meteData, HttpStatus.OK);
    }

    @PostMapping(value = V3_SWAGGER_SECURITY_LOGIN_URL, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<Void> loginSwagger(HttpSession session, HttpServletResponse response, String username, String password) throws IOException {
        if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password)) {
            RequestUtils.writeForbidden(response);
        }
        if (!(username.equals(swaggerSecurityProperties.getUsername()) && password.equals(swaggerSecurityProperties.getPassword()))) {
            RequestUtils.writeForbidden(response);
        }
        if (swaggerSecurityProperties.getUsername().equals(username) && password.equals(swaggerSecurityProperties.getPassword())) {
            final String sessionId = session.getId();
            session.setAttribute(sessionId, sessionId);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping(value = V3_SWAGGER_API_DOCS, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE})
    public ResponseEntity<Json> getDocumentation(@RequestParam(value = "group", required = false) String swaggerGroup,
                                                 HttpServletRequest servletRequest) {
        String groupName = Optional.ofNullable(swaggerGroup).orElse(Docket.DEFAULT_GROUP_NAME);
        Documentation documentation = documentationCache.documentationByGroup(groupName);
        if (documentation == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Swagger swagger = mapper.mapDocumentation(documentation);
        swagger.setVendorExtension("x-order-tags", "");
        UriComponents uriComponents = HostNameProvider.componentsFrom(servletRequest, swagger.getBasePath());
        swagger.basePath(Strings.isNullOrEmpty(uriComponents.getPath()) ? "/" : uriComponents.getPath());
        if (isNullOrEmpty(swagger.getHost())) {
            swagger.host(hostName(uriComponents));
        }
        List<Order> orders = findOrder();
        final List<Tag> tags = swagger.getTags();
        for (Tag tag : tags) {
            for (Order order : orders) {
                if (order.getTags().contains(tag.getName())) {
                    tag.setVendorExtension("x-order", order.getOrder());
                }
            }
        }
        return new ResponseEntity<>(jsonSerializer.toJson(swagger), HttpStatus.OK);
    }

    private List<Order> findOrder() {
        List<Order> orders = Lists.newArrayList();
        final Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();
        for (Map.Entry<RequestMappingInfo, HandlerMethod> methodEntry : handlerMethods.entrySet()) {
            HandlerMethod method = methodEntry.getValue();
            final Class<?> declaringClass = method.getMethod().getDeclaringClass();
            final String simpleName = declaringClass.getSimpleName();
            final ApiOrder apiOrder = AnnotationUtils.findAnnotation(declaringClass, ApiOrder.class);
            final Api api = AnnotationUtils.findAnnotation(declaringClass, Api.class);
            Order order = new Order();
            if (apiOrder != null) {
                order.setOrder(apiOrder.value());
            }
            if (api != null) {
                order.setTags(Lists.newArrayList(api.tags()));
            } else {
                // 格式化class
                final String lowerCase = simpleName.replaceAll("-", "").toLowerCase();
                order.setTags(Lists.newArrayList(lowerCase));
            }
            orders.add(order);
        }
        return orders;
    }


    private String hostName(UriComponents uriComponents) {
        if (DEFAULT.equals(hostNameOverride)) {
            String host = uriComponents.getHost();
            int port = uriComponents.getPort();
            if (port > -1) {
                return String.format("%s:%d", host, port);
            }
            return host;
        }
        return hostNameOverride;
    }
}
