package com.ael.productservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String IMAGE_UPLOAD_QUEUE = "image.upload.queue";
    public static final String IMAGE_UPLOAD_EXCHANGE = "image.upload.exchange";
    public static final String IMAGE_UPLOAD_ROUTING_KEY = "image.upload";
    
    // Stok düşürme için kuyruk
    public static final String STOCK_UPDATE_QUEUE = "stock.update.queue";
    public static final String STOCK_UPDATE_EXCHANGE = "stock.update.exchange";
    public static final String STOCK_UPDATE_ROUTING_KEY = "stock.update";

    @Bean
    public Queue imageUploadQueue() {
        return new Queue(IMAGE_UPLOAD_QUEUE, true);
    }

    @Bean
    public TopicExchange imageUploadExchange() {
        return new TopicExchange(IMAGE_UPLOAD_EXCHANGE);
    }

    @Bean
    public Binding imageUploadBinding(Queue imageUploadQueue, TopicExchange imageUploadExchange) {
        return BindingBuilder.bind(imageUploadQueue)
                .to(imageUploadExchange)
                .with(IMAGE_UPLOAD_ROUTING_KEY);
    }
    
    // Stok güncelleme kuyruğu
    @Bean
    public Queue stockUpdateQueue() {
        return new Queue(STOCK_UPDATE_QUEUE, true);
    }

    @Bean
    public TopicExchange stockUpdateExchange() {
        return new TopicExchange(STOCK_UPDATE_EXCHANGE);
    }

    @Bean
    public Binding stockUpdateBinding(Queue stockUpdateQueue, TopicExchange stockUpdateExchange) {
        return BindingBuilder.bind(stockUpdateQueue)
                .to(stockUpdateExchange)
                .with(STOCK_UPDATE_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
