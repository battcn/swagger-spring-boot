package org.battcn.boot.swagger.utils;

import org.battcn.boot.swagger.web.CustomSwagger2Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Levin
 * @since 2018/7/6 0006
 */
public class RequestUtils {

    private RequestUtils() {
    }

    public static boolean SWAGGER_IS_LOGIN = false;

    private static final Logger logger = LoggerFactory.getLogger(CustomSwagger2Controller.class);

    public static void writeForbidden(HttpServletResponse response) throws IOException {
        final HttpStatus status = HttpStatus.UNAUTHORIZED;
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        ServletOutputStream outputStream = response.getOutputStream();
        String error = "{\"code\":%d,\"message\":\"%s\"}";
        final String format = String.format(error, status.value(), status.getReasonPhrase());
        logger.error(format);
        outputStream.write(format.getBytes());
        outputStream.flush();
        outputStream.close();
    }


}
