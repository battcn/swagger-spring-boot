package com.battcn.swagger;

import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

/**
 * @author 唐亚峰
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({SwaggerAutoConfiguration.class})
public @interface EnableSwagger {


}