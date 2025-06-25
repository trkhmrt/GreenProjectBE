package com.ael.paymentservice.config.rabbitmq.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String ORDER_EXCHANGE = "order.exchange";
    public static final String ORDER_ROUTING_KEY = "order.routingKey";
    public static final String BASKET_EXCHANGE = "basket.exchange";
    public static final String BASKET_ROUTING_KEY = "basket.routingKey";
    public static final String BASKET_QUEUE = "basket.queue";

    @Bean
    public Queue basketQueue() {
        return new Queue(BASKET_QUEUE, true);
    }

    @Bean
    public DirectExchange basketExchange() {
        return new DirectExchange(BASKET_EXCHANGE);
    }

    @Bean
    public Binding basketBinding(Queue basketQueue, DirectExchange basketExchange) {
        return BindingBuilder.bind(basketQueue).to(basketExchange).with(BASKET_ROUTING_KEY);
    }
}
