package com.battcn.boot.swagger.utils;

import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.util.StringUtils.hasText;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromContextPath;

/**
 * @author Levin
 * @since 2018/12/6 0006
 */
public class HostNameProvider {
    public HostNameProvider() {
        throw new UnsupportedOperationException();
    }

    public static UriComponents componentsFrom(
            HttpServletRequest request,
            String basePath) {

        ServletUriComponentsBuilder builder = fromServletMapping(request, basePath);

        UriComponents components = UriComponentsBuilder.fromHttpRequest(
                new ServletServerHttpRequest(request))
                .build();

        String host = components.getHost();
        if (!hasText(host)) {
            return builder.build();
        }

        builder.host(host);
        builder.port(components.getPort());

        return builder.build();
    }

    private static ServletUriComponentsBuilder fromServletMapping(
            HttpServletRequest request,
            String basePath) {

        ServletUriComponentsBuilder builder = fromContextPath(request);

        builder.replacePath(prependForwardedPrefix(request, basePath));
        if (hasText(new UrlPathHelper().getPathWithinServletMapping(request))) {
            builder.path(request.getServletPath());
        }

        return builder;
    }

    private static String prependForwardedPrefix(
            HttpServletRequest request,
            String path) {

        String prefix = request.getHeader("X-Forwarded-Prefix");
        if (prefix != null) {
            return prefix + path;
        } else {
            return path;
        }
    }
}
