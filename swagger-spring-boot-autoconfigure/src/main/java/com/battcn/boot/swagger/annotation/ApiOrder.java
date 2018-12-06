package com.battcn.boot.swagger.annotation;

import org.springframework.core.Ordered;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Documented
public @interface ApiOrder {

    /**
     * The order value.
     * <p>Default is {@link Ordered#LOWEST_PRECEDENCE}.
     * @see Ordered#getOrder()
     */
    int value() default Ordered.LOWEST_PRECEDENCE;

}
