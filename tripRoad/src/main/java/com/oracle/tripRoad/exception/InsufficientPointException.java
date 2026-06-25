package com.oracle.tripRoad.exception;

public class InsufficientPointException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    
    public InsufficientPointException(String message) {
        super(message);
    }
}