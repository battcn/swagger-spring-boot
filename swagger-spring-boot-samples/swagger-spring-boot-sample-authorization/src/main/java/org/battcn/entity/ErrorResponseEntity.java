package org.battcn.entity;

/**
 * @author Levin
 * @version 1.0.1
 * @since 2018-01-16
 */
public class ErrorResponseEntity {

    private int customCode;
    private String message;

    public int getCustomCode() {
        return customCode;
    }

    public void setCustomCode(int customCode) {
        this.customCode = customCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
