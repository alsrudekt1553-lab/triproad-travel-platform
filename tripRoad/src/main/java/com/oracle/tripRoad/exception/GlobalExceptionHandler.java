package com.oracle.tripRoad.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InsufficientPointException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientPoint(InsufficientPointException e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "INSUFFICIENT_POINT",
            "message", e.getMessage()
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "INVALID_ARGUMENT",
            "message", e.getMessage()
        ));
    }
    
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, String>> handleForbidden(
            ForbiddenException e
    ) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "FORBIDDEN",
                        "message", e.getMessage()
                ));
    }
}