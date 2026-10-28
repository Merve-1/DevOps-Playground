# AWS E-Commerce Website

The project demonstrates how to deploy a full-stack e-commerce application on AWS using managed services, containerized microservices, serverless components, and cloud networking.

## Architecture

The application uses AWS services to host the frontend, run backend microservices, manage product and cart data, process orders, and handle notifications.
<img width="1906" height="996" alt="arc" src="https://github.com/user-attachments/assets/a2cbe478-bd64-41fb-b1d6-a161e89379bd" />

**Main components:**

- **Frontend:** React, Amazon S3, and Amazon CloudFront.
- **Authentication:** Amazon Cognito for user registration and login.
- **API Management:** Amazon API Gateway with HTTP integrations, VPC Link, and JWT authorization.
- **Backend:** Containerized microservices running on Amazon ECS with AWS Fargate.
- **Container Registry:** Amazon Elastic Container Registry (ECR).
- **Load Balancing:** Application Load Balancer (ALB).
- **Database:** Amazon RDS for PostgreSQL.
- **Product and Cart Data:** Amazon DynamoDB.
- **Configuration Management:** AWS Systems Manager Parameter Store.
- **Product Images:** Amazon S3 and CloudFront.
- **Notifications:** Amazon SNS and Amazon SQS.
- **Networking:** Amazon VPC, public and private subnets, route tables, Internet Gateway, and NAT Gateway.
- **Monitoring:** Amazon CloudWatch Logs.

## Key Features

- User registration and authentication.
- Product catalog and product image delivery.
- Shopping cart management.
- Order placement and processing.
- Backend API routing and JWT-based authorization.
- Asynchronous notifications using SNS and SQS.
- Private backend services deployed on AWS Fargate.
- Secure communication between frontend, API Gateway, and backend services.

## Architecture Overview

The application follows this request flow:

1. Users access the frontend through CloudFront, which serves static files from an S3 bucket.
2. Amazon Cognito handles user authentication.
3. The frontend sends API requests to Amazon API Gateway.
4. API Gateway routes requests through a VPC Link to the backend services.
5. The Application Load Balancer forwards requests to the appropriate ECS services.
6. Backend services interact with DynamoDB and Amazon RDS as required.
7. Order-related events trigger notifications through Amazon SNS and Amazon SQS.

## Backend Services

The application consists of four main backend services:

| Service | Responsibility |
|---|---|
| Product Service | Retrieves product information from DynamoDB. |
| Cart Service | Manages shopping cart data in DynamoDB. |
| User Service | Handles user-related application operations. |
| Order Service | Processes orders and integrates with the notification workflow. |

Each service is containerized with Docker, stored in Amazon ECR, and deployed to Amazon ECS using AWS Fargate.

## Deployment Overview

The project was deployed through the following stages:

1. **Network Setup:** Created the VPC, subnets, route tables, Internet Gateway, and NAT Gateway.
2. **Authentication:** Configured the Cognito user pool and app client.
3. **Frontend Deployment:** Built the React application and deployed it to S3 behind CloudFront.
4. **Data Layer:** Created DynamoDB tables and an S3 bucket for product images.
5. **Database Setup:** Provisioned an RDS PostgreSQL database and configured private access.
6. **Configuration:** Stored backend configuration parameters in AWS Systems Manager Parameter Store.
7. **Containerization:** Built Docker images and pushed them to private ECR repositories.
8. **Backend Deployment:** Created ECS task definitions and deployed the microservices using AWS Fargate.
9. **Load Balancing:** Configured the Application Load Balancer, target groups, and listener rules.
10. **API Gateway:** Configured HTTP integrations, VPC Link, routes, JWT authorization, and CORS.
11. **Integration:** Updated the frontend API endpoint, rebuilt the application, and invalidated the CloudFront cache.
12. **Notifications:** Configured SNS topics, SQS queues, and subscriptions for order notifications.

## Security Considerations

- Backend services run in private subnets without public IP addresses.
- Database access is restricted through security groups.
- Amazon Cognito provides user authentication.
- API Gateway uses JWT authorization for protected routes.
- AWS Systems Manager Parameter Store stores backend configuration and database credentials.
- CloudFront accesses the private frontend S3 bucket through Origin Access Control (OAC).

For production deployments, IAM permissions should follow the principle of least privilege, and sensitive parameters should use `SecureString` where appropriate.

## Technologies Used

**Frontend**
- React
- JavaScript
- Vite

**Backend and Containers**
- Docker
- Amazon ECS
- AWS Fargate
- Amazon ECR

**AWS Services**
- Amazon S3
- Amazon CloudFront
- Amazon Cognito
- Amazon API Gateway
- Application Load Balancer
- Amazon DynamoDB
- Amazon RDS for PostgreSQL
- AWS Systems Manager Parameter Store
- Amazon SNS
- Amazon SQS
- Amazon VPC
- Amazon CloudWatch

## Documentation

Detailed implementation notes, AWS configuration steps, architecture diagrams, troubleshooting information, and deployment screenshots are available in the project documentation (notes.md).

Refer to the implementation notes in this repository for the complete walkthrough.


## Cleanup

AWS resources can incur charges while they are running. When the project is no longer needed, delete the resources created for the deployment, including ECS services, load balancers, RDS databases, NAT Gateway, CloudFront distributions, S3 buckets, DynamoDB tables, and other associated resources.

Check the implementation notes for the complete cleanup checklist.

## Acknowledgments

This project was implemented as a learning exercise based on the Udemy course [Build E-Commerce Application on AWS](https://www.udemy.com/course/build-ecommerce-application-on-aws/).
