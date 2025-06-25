package com.ael.gatewayserver;

import com.ael.gatewayserver.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayserverApplication {

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}

	@Bean
	public RouteLocator greenProjectRouteConfig(RouteLocatorBuilder routeLocatorBuilder) {
		return routeLocatorBuilder.routes()
				.route(p -> p
						.path("/ael/authservice/**")
						.filters( f -> f.rewritePath("/ael/authservice/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString())
								.filter(jwtAuthenticationFilter.apply(new JwtAuthenticationFilter.Config()))
						)
						.uri("lb://AUTHSERVICE"))
				.route(p -> p
						.path("/ael/customerservice/**")
						.filters( f -> f.rewritePath("/ael/customerservice/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString()))
						.uri("lb://CUSTOMERSERVICE"))
				.route(p -> p
						.path("/ael/basketservice/**")
						.filters( f -> f.rewritePath("/ael/basketservice/(?<segment>.*)","/${segment}")
								.addResponseHeader("X-Response-Time", LocalDateTime.now().toString()))
						.uri("lb://BASKETSERVICE"))


				.build();
	}
}
