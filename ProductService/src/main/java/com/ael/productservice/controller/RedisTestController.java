package com.ael.productservice.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Set;

@RestController
@RequestMapping("/redis-test")
@AllArgsConstructor
public class RedisTestController {

    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/ping")
    public String ping() {
        try {
            String result = redisTemplate.getConnectionFactory()
                    .getConnection()
                    .ping();
            return "Redis connection: " + result;
        } catch (Exception e) {
            return "Redis connection failed: " + e.getMessage();
        }
    }

    @GetMapping("/test-cache")
    public String testCache() {
        String key = "test:key";
        String value = "test-value";

        redisTemplate.opsForValue().set(key, value, Duration.ofMinutes(1));
        Object retrieved = redisTemplate.opsForValue().get(key);

        return "Cache test: " + retrieved;
    }

    @GetMapping("/keys")
    public Set<String> getAllCacheKeys() {
        return redisTemplate.keys("*");
    }

    @GetMapping("/keys/{pattern}")
    public Set<String> getCacheKeysByPattern(@PathVariable String pattern) {
        return redisTemplate.keys(pattern);
    }

    @GetMapping("/value/{key}")
    public Object getCacheValue(@PathVariable String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @DeleteMapping("/clear")
    public String clearAllCache() {
        Set<String> keys = redisTemplate.keys("*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
        return "Cache cleared successfully";
    }
}