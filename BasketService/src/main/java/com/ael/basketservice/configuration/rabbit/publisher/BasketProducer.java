package com.ael.basketservice.configuration.rabbit.publisher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ael.basketservice.configuration.event.BasketEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class BasketProducer {

    private Logger LOGGER =  LoggerFactory.getLogger(BasketProducer.class);

    // Statik değerler
    private static final String EXCHANGE = "basket.paid.exchange";
    private static final String ROUTING_KEY = "basket.routingKey";

    private RabbitTemplate rabbitTemplate;

    public BasketProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(BasketEvent basketEvent) {
        LOGGER.info("Sending event: {}", basketEvent.toString());
        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, basketEvent);
    }
}
