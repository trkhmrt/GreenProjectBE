package com.ael.orderservice.config.rabbitmq.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String ORDER_QUEUE = "order.queue";
    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_ROUTING_KEY = "order.routingKey";
    
    // Stok düşürme için kuyruk
    public static final String STOCK_UPDATE_QUEUE = "stock.update.queue";
    public static final String STOCK_UPDATE_EXCHANGE = "stock.update.exchange";
    public static final String STOCK_UPDATE_ROUTING_KEY = "stock.update";

    @Bean
    public Queue orderQueue() {
        return new Queue(ORDER_QUEUE, true);
    }

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(ORDER_EXCHANGE);
    }

    @Bean
    public Binding orderBinding(Queue orderQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with(ORDER_ROUTING_KEY);
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
