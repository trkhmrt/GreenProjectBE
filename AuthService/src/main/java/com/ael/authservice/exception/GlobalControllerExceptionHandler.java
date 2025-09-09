package com.ael.authservice.exception;


import com.ael.authservice.dto.response.ErrorResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.validation.FieldError;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice  // ✅ Tüm controller'ları kapsar
@Slf4j
@RequiredArgsConstructor

public class GlobalControllerExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        log.error("Validation error occurred: {}", ex.getMessage());

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse(
                "ValidationException",
                System.currentTimeMillis(),
                errors,
                Collections.emptyMap()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)  // ✅ Tüm exception'ları yakalar
    public ResponseEntity<ErrorResponse> handleGenericException(Exception exception) {
        log.error("Exception occurred: {}", exception.getMessage(), exception);
        ErrorResponse errorResponse = new ErrorResponse(
                exception.getClass().getSimpleName(),                    // exception field
                System.currentTimeMillis(),           // timestamp field
                Collections.singletonList(exception.getMessage()), // errors field
                Collections.emptyMap()                // fieldErrors field
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
