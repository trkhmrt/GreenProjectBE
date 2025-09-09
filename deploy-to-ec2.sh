#!/bin/bash

echo "🚀 Deploying GreenProject to EC2..."

# EC2 IP Address
EC2_IP="18.194.225.14"
KEY_FILE="greenproject-key.pem"

echo "📦 Copying project files to EC2..."
scp -r -i $KEY_FILE . ec2-user@$EC2_IP:~/GreenProject

echo "🔧 Copying Docker Compose files..."
scp -i $KEY_FILE docker-compose-prod.yml ec2-user@$EC2_IP:~/GreenProject/

echo "📋 Copying deployment script..."
scp -i $KEY_FILE build-all-services-skip-tests.sh ec2-user@$EC2_IP:~/GreenProject/

echo "✅ Files copied successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. SSH to EC2: ssh -i $KEY_FILE ec2-user@$EC2_IP"
echo "2. Navigate to project: cd ~/GreenProject"
echo "3. Build images: ./build-all-services-skip-tests.sh"
echo "4. Deploy: docker-compose -f docker-compose-prod.yml up -d"
echo ""
echo "🌐 Access URLs:"
echo "- Gateway: http://$EC2_IP:8072"
echo "- Eureka: http://$EC2_IP:8761"
echo "- RabbitMQ: http://$EC2_IP:15672"
echo "- Product Service: http://$EC2_IP:8073"
echo "- Order Service: http://$EC2_IP:8074"
echo "- Customer Service: http://$EC2_IP:8078"
echo "- Payment Service: http://$EC2_IP:8075"
echo "- Basket Service: http://$EC2_IP:8076"
echo "- Auth Service: http://$EC2_IP:8077"




