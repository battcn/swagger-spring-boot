package com.battcn.swagger.annotation;

import com.battcn.swagger.SwaggerAutoConfiguration;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

/**
 * 发现Swagger中有个EnableSwagger2 故而此处改成EnableSwagger2Doc
 *
 * @author 唐亚峰
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({SwaggerAutoConfiguration.class})
public @interface EnableSwagger2Doc {


}