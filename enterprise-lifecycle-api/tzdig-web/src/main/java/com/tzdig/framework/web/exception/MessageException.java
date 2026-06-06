package com.tzdig.framework.web.exception;

import java.io.Serial;

public class MessageException extends Exception {

    /**
     *
     */
    @Serial
    private static final long serialVersionUID = 2136919048113607762L;

    private String[] args;

    public MessageException(String message, String... args) {
        super(message);
        this.args = args;
    }

    public String[] getArgs() {
        return args;
    }

    public void setArgs(String[] args) {
        this.args = args;
    }
}
