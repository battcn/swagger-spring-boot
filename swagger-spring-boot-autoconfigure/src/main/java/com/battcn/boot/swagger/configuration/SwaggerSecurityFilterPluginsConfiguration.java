package com.battcn.boot.swagger.configuration;

import com.battcn.boot.swagger.utils.RequestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * @author <a href="mailto:1837307557@qq.com">Levin</a>
 * @since 2.0.2
 */
public class SwaggerSecurityFilterPluginsConfiguration implements Filter {

    private static Logger logger = LoggerFactory.getLogger(SwaggerSecurityFilterPluginsConfiguration.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("==================== init swagger security filter plugin ====================");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        final HttpServletResponse response = (HttpServletResponse) servletResponse;
        final HttpServletRequest request = (HttpServletRequest) servletRequest;
        final HttpSession session = request.getSession();
        if (session == null || session.getAttribute(session.getId()) == null) {
            RequestUtils.writeForbidden(response);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        logger.info("==================== destroy swagger security filter plugin ====================");
    }
}
