package org.battcn.boot.swagger.actuate.endpoint;

import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.context.annotation.Configuration;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.battcn.boot.swagger.actuate.endpoint.SwaggerEndpoint.SWAGGER_ENDPOINT_ID;

/**
 * @author <a href="mailto:1837307557@qq.com">Levin</a>
 * @see Configuration
 * @since 2.0.2
 */
@Endpoint(id = SWAGGER_ENDPOINT_ID)
public class SwaggerEndpoint {

    static final String SWAGGER_ENDPOINT_ID = "swagger";
    private static final String SWAGGER_SPRING_BOOT_VERSION = "2.0.2-RELEASE";
    private static final String SWAGGER_VERSION = "2.8.0";
    private static final String SWAGGER_SPRING_BOOT_GITHUB_URL = "https://github.com/battcn/swagger-spring-boot";
    private static final String SWAGGER_SPRING_BOOT_ISSUES_URL = SWAGGER_SPRING_BOOT_GITHUB_URL + "/issues";

    @ReadOperation
    public Map<String, Object> invoke() {

        Map<String, Object> metaData = new LinkedHashMap<>();

        metaData.put("timestamp", System.currentTimeMillis());

        Map<String, String> versions = new LinkedHashMap<>();
        versions.put("swagger-spring-boot", SWAGGER_SPRING_BOOT_VERSION);
        versions.put("swagger", SWAGGER_VERSION);

        Map<String, String> urls = new LinkedHashMap<>();
        urls.put("github", SWAGGER_SPRING_BOOT_GITHUB_URL);
        urls.put("issues", SWAGGER_SPRING_BOOT_ISSUES_URL);

        metaData.put("versions", versions);
        metaData.put("urls", urls);
        metaData.put("email", "1837307557@qq.com");
        return metaData;
    }

}
