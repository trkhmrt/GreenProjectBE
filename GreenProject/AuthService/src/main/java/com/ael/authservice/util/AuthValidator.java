package com.ael.authservice.util;

public class AuthValidator {
    public static void validateUsername(String username) {
        if (username == null || username.length() < 5 || username.length() > 15 || !username.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Kullanıcı adı 5-15 karakter arası olmalı ve en az bir rakam içermelidir.");
        }
    }

    public static void validatePassword(String password) {
        if (password == null || password.length() < 8 ||
            !password.matches(".*[A-Z].*") ||
            !password.matches(".*[a-z].*") ||
            !password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermeli.");
        }
    }
} 