#!/bin/bash

echo "🚀 Building all services with Maven + Jib Docker Build (SKIPPING TESTS)..."

# Function to build service
build_service() {
    local service_name=$1
    local image_name=$2
    
    echo "📦 Building $service_name..."
    echo "📍 Current directory: $(pwd)"
    
    cd $service_name
    
    if [ -f "pom.xml" ]; then
        echo "🔨 Running: mvn clean package jib:dockerBuild -DskipTests -Djib.to.image=$image_name:latest"
        ./mvnw clean package jib:dockerBuild -DskipTests -Djib.to.image=$image_name:latest
        
        if [ $? -eq 0 ]; then
            echo "✅ $service_name built successfully!"
        else
            echo "❌ $service_name build failed!"
            return 1
        fi
    else
        echo "❌ pom.xml not found in $service_name"
        return 1
    fi
    
    cd ..
    echo "---"
}

# Build all services
echo "🏗️ Starting build process..."

build_service "eurekaserver" "greenproject-eureka"
build_service "configserver" "greenproject-config"
build_service "gatewayserver" "greenproject-gateway"
build_service "ProductService" "greenproject-product"
build_service "OrderService" "greenproject-order"
build_service "CustomerService" "greenproject-customer"
build_service "PaymentService" "greenproject-payment"
build_service "BasketService" "greenproject-basket"
build_service "AuthService" "greenproject-auth"

echo "🎉 All services build process completed!"
echo "📋 Built Docker images:"
docker images | grep greenproject

echo "📊 Build Summary:"
echo "Total images built: $(docker images | grep greenproject | wc -l)"




