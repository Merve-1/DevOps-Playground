# AWS E-Commerce Website: Implementation Notes

Implementation of the course project
[Udemy: Build E-Commerce Application on AWS](https://www.udemy.com/course/build-ecommerce-application-on-aws/learn/lecture/55627777#overview).

**Total cost of running this application:** _TODO: fill in_

---

## Contents

1. [Setup](#1-setup)
2. [Architecture overview](#2-architecture-overview)
3. [Application request flows](#3-application-request-flows)
4. [Network setup (VPC)](#4-network-setup-vpc)
5. [Authentication (Cognito)](#5-authentication-cognito)
6. [Frontend deployment (S3 + CloudFront)](#6-frontend-deployment-s3--cloudfront)

---

## 1. Setup

- On Windows, **WSL is required** to run `install.sh`.
- Create an **access key** in the AWS Console so the CLI and scripts can authenticate.

![Access key creation](notesImages/accesskeyCreation.png)

---

## 2. Architecture overview

**High-level architecture**

![Project architecture](notesImages/ProjectArchitecture-1.png)

**AWS services used**

![AWS services](notesImages/AWSServices.png)

**Project flow**

![Project flow, part 1](notesImages/ProjectArchitecture-2.png)
![Project flow, part 2](notesImages/ProjectArchitecture-3.png)

---

## 3. Application request flows

### 3.1 Access the application (home page)

![Access application home flow](notesImages/AccessApplicationHomeFlow.png)

### 3.2 Add products to the cart

![Add products to cart flow](notesImages/AddProductstCartFlow.png)

### 3.3 Place an order and send a notification

![Place order and notification flow](notesImages/PlaceOrderNotificationFlow.png)

---

## 4. Network setup (VPC)

### 4.1 Network architecture

The network contains:

| Component | Role |
|---|---|
| **NAT Gateway** | Translates addresses so private resources can reach the internet outbound |
| **ECS containers** | Run the application, in private subnets |
| **Application Load Balancer** | Entry point that routes traffic to the ECS containers |
| **PostgreSQL database** | Data store, in private subnets |

![Network architecture](notesImages/NetworkArc.png)

**Route table plan**

![Route tables overview](notesImages/routeTables.png)

### 4.2 Build order

Follow these steps in order.

**Step 1: Create the VPC**

![VPC](notesImages/VPC.png)

**Step 2: Create the Internet Gateway**

![Internet gateway](notesImages/InternetGateway.png)

**Step 3: Attach the Internet Gateway to the VPC**

![Attach IGW to VPC, part 1](notesImages/IGtoVPC.png)
![Attach IGW to VPC, part 2](notesImages/IGtoVPC2.png)

**Step 4: Create the subnets**

![Subnet 1](notesImages/subnet1.png)
![Subnet 2](notesImages/subnet2.png)

**Step 5: Create the route tables**

![Route table 1](notesImages/routeTable1.png)
![Route table 2](notesImages/routeTable2.png)

**Step 6: Associate subnets with route tables**

![Subnet associations](notesImages/subnetAssociations.png)

**Step 7: Route table for the private ECS subnets**

![Private ECS route table, part 1](notesImages/routeTable3.png)
![Private ECS route table, part 2](notesImages/routeTable4.png)

**Step 8: Route table for the private database subnets**

![Private DB route table, part 1](notesImages/routeTable5.png)
![Private DB route table, part 2](notesImages/routeTable6.png)

**Step 9: Create the NAT Gateway**

![NAT gateway, part 1](notesImages/NAT1.png)
![NAT gateway, part 2](notesImages/NAT2.png)

---

## 5. Authentication (Cognito)

**User pool setup**

![Cognito setup, part 1](notesImages/cognitoSetup1.png)
![Cognito setup, part 2](notesImages/cognitoSetup2.png)

**App client setup**

![Cognito app client, part 1](notesImages/CognitoApp1.png)
![Cognito app client, part 2](notesImages/CognitoApp2.png)

> **Remember:** the callback (return) URL and sign-out URL must be updated to the real URL once the app is deployed on AWS. See step 6 of the frontend deployment below.

---

## 6. Frontend deployment (S3 + CloudFront)

### 6.1 Architecture

**Frontend architecture**

![Frontend architecture, part 1](notesImages/FrontendArc1.png)

**Frontend and backend together**

![Frontend and backend architecture](notesImages/FrontendArc2.png)

**Frontend only**

![Frontend only architecture](notesImages/FrontendArc3.png)

**Origin Access Control (OAC)**

CloudFront uses OAC to read from a **private** S3 bucket:

- It is the newer mechanism for giving CloudFront access to a private bucket.
- It signs requests with **SigV4**.

### 6.2 Deployment checklist

- [ ] 1. Create the S3 bucket that hosts the frontend
- [ ] 2. Create the CloudFront distribution
- [ ] 3. Put the Cognito details and API URL into the frontend configuration
- [ ] 4. Build the frontend
- [ ] 5. Upload the build output to the S3 bucket
- [ ] 6. Update the Cognito callback and sign-out URLs to the CloudFront URL

> **Rebuild note:** with the Vite version of the app, the build output folder is `dist/` (the old Create React App version used `build/`). `VITE_*` environment variables are baked in at build time, so set them **before** running `npm run build`.

### 6.3 Step details

**Step 1: Create the S3 bucket**

![S3 bucket](notesImages/S3Buket.png)

**Step 2: Create the CloudFront distribution**

Select the **free tier** plan, then follow the screens below.

![CloudFront setup 1](notesImages/CloudFront1.png)
![CloudFront setup 2](notesImages/CloudFront2.png)
![CloudFront setup 3](notesImages/CloudFront3.png)

**Error page configuration**

![CloudFront error page 1](notesImages/CloudFront4.png)
![CloudFront error page 2](notesImages/CloudFront5.png)

### 6.4 Current Status
![CloudFront Link](notesImages/CurrentStatus1.png)
![Create Account](notesImages/CurrentStatus2.png)
![Login](notesImages/CurrentStatus3.png)


### 6.5 Data Layer

#### 6.5.1 Architecture Overview

![Data layer architecture](notesImages/DataLayerArch.png)

#### 6.5.2 Upload Product Images to S3

Product images are stored in an S3 bucket and served through CloudFront.

![S3 product images](notesImages/S3Product.png)

**Steps:**

1. Configure the S3 bucket to store product images.
2. Upload the product images using `upload-images-to-s3.sh`.
3. Configure the required environment variables:

| Variable | Where to find it | Example |
|---|---|---|
| `BUCKET_NAME` | AWS Console → S3 → Buckets | `ecommerce-product-images-12345` |
| `REGION` | AWS Console → S3 → Bucket → Properties | `ap-south-1` |
| `IMAGES_DIR` | Project directory | `product-images` |
| `S3_PREFIX` | Choose a prefix for the uploaded files | `images/products` |
| `CLOUDFRONT_DOMAIN` | AWS Console → CloudFront → Distributions | `d123abc.cloudfront.net` |

![Image upload script configuration](notesImages/ImageUploadScript.png)

#### 6.5.3 Create DynamoDB Tables

Create the following DynamoDB tables to store product and shopping cart data.

![DynamoDB tables](notesImages/DynamoDBTables.png)

1. **Product Table** – Stores product information, including names, prices, descriptions, and image URLs.
2. **Cart Table** – Stores shopping cart information.

![DynamoDB configuration](notesImages/DynamoDB1.png)
![DynamoDB configuration](notesImages/DynamoDB2.png)

![DynamoDB table details](notesImages/DynamoDB3.png)

#### 6.5.4 Update Product Image URLs

The product image URLs in `products.json` must point to the CloudFront distribution rather than directly to S3. This allows the frontend to load images through CloudFront.

**Steps:**

1. Update the CloudFront domain in the configuration.
2. Run `update-product-image-urls.sh` to replace the S3 image URLs with the corresponding CloudFront URLs.
3. Verify that the image URLs in `products.json` are correct.
4. Load the updated product data into the DynamoDB Product Table.

![Update product image URLs](notesImages/UpdateProduct1.png)

![Updated product configuration](notesImages/UpdateProduct2.png)

## 6.6 RDS Database Setup

This section covers the creation of the PostgreSQL database, its subnet group, security group, and connection parameters.

### 6.6.1 Create a DB Subnet Group

1. Open **AWS Console → RDS → Subnet groups**.
2. Create a new DB subnet group.
3. Select the VPC used by the application.
4. Add at least two private subnets in different Availability Zones.

![Create DB subnet group](notesImages/CreateDBSubnetGroup.png)

### 6.6.2 Create a Database Security Group

Create a security group for the RDS database.

Configure the inbound rules with the following settings:

| Setting | Value |
|---|---|
| Type | PostgreSQL |
| Protocol | TCP |
| Port | `5432` |
| Source | Application security group |

**Security note:** Allow database access only from the required application security group. Avoid exposing PostgreSQL directly to the public internet.

![RDS security group configuration](notesImages/RDSSecurityGroup.png)

![Create database security group](notesImages/CreateSecurityGroup.png)

### 6.6.3 Create the RDS Database

Create the PostgreSQL database using the DB subnet group and security group configured above.

Follow the configuration steps shown in the screenshots.

![RDS database creation — Step 1](notesImages/CreateDB1.png)
![RDS database creation — Step 2](notesImages/CreateDB2.png)
![RDS database creation — Step 3](notesImages/CreateDB3.png)
![RDS database creation — Step 4](notesImages/CreateDB4.png)
![RDS database creation — Step 5](notesImages/CreateDB5.png)
![RDS database creation — Step 6](notesImages/CreateDB6.png)
![RDS database creation — Step 7](notesImages/CreateDB7.png)
![RDS database creation — Step 8](notesImages/CreateDB8.png)
![RDS database creation — Step 9](notesImages/CreateDB9.png)
![RDS database creation — Step 10](notesImages/CreateDB10.png)

---

## 6.7 AWS Systems Manager Parameter Store

Use **AWS Systems Manager Parameter Store** to store configuration values required by the backend services.

### 6.7.1 Create the AWS Region Parameter

Create a parameter containing the AWS Region used by the application.

![Create AWS Region parameter — Step 1](notesImages/CreateParameter1.png)
![Create AWS Region parameter — Step 2](notesImages/CreateParameter2.png)

### 6.7.2 Create the Database Host Parameter

Create a parameter containing the RDS database endpoint.

![Create database host parameter — Step 1](notesImages/CreateParameter3.png)
![Create database host parameter — Step 2](notesImages/CreateParameter4.png)

### 6.7.3 Create the Database Password Parameter

Store the database password in Parameter Store.

![Create database password parameter — Step 1](notesImages/CreateParameter5.png)
![Create database password parameter — Step 2](notesImages/CreateParameter6.png)

**Security recommendation:** Store sensitive credentials as `SecureString` parameters and grant access only to the IAM roles that require them.

### 6.7.4 Verify Parameter Store Configuration

Review the parameters created for the backend services.

![Parameter Store configuration — Step 1](notesImages/ParameterStore1.png)
![Parameter Store configuration — Step 2](notesImages/ParameterStore2.png)
![Parameter Store configuration — Step 3](notesImages/ParameterStore3.png)

---

## 6.8 Backend Architecture and ECS Deployment

The backend consists of containerized services deployed on Amazon ECS. Amazon ECR stores the Docker images, while the Application Load Balancer distributes incoming requests to the appropriate services.

### 6.8.1 Backend Architecture

![ECS backend architecture](notesImages/ECSArc.png)

### 6.8.2 Deployment Workflow

Follow these steps to deploy the backend services:

1. Create private ECR repositories for the backend services.
2. Build Docker images for each service.
3. Push the Docker images to the corresponding ECR repositories.
4. Create ECS task definitions for all backend services.
5. Create an ECS cluster.
6. Create ECS services using the corresponding task definitions.
7. Configure the services to use the appropriate Application Load Balancer target groups.
8. Verify that the ECS tasks start successfully and the target groups report healthy targets.

**Important:** Configure the required environment variables, database connection settings, IAM permissions, and security groups before deploying the ECS services.

---

## 6.9 Security Groups and Target Groups

### 6.9.1 EC2 Security Group

Configure the security group associated with the ECS infrastructure according to the networking mode and resources used by the deployment.

![EC2 security group configuration](notesImages/CreateSecurityGroup1.png)

### 6.9.2 Create Target Groups

Create a separate target group for each backend service that receives traffic through the Application Load Balancer.

| Target Group | Backend Service | Screenshot |
|---|---|---|
| Product | Product service | `TargetGroup2.png` |
| Cart | Cart service | `TargetGroup3.png` |
| User | User service | `TargetGroup4.png` |
| Order | Order service | `TargetGroup5.png` |

**Initial target group configuration**

![Target group configuration](notesImages/TargetGroup1.png)

**Product service**

![Product target group](notesImages/TargetGroup2.png)

**Cart service**

![Cart target group](notesImages/TargetGroup3.png)

**User service**

![User target group](notesImages/TargetGroup4.png)

**Order service**

![Order target group](notesImages/TargetGroup5.png)

**Configuration checklist:**

- Select the correct VPC.
- Configure the appropriate target type for the ECS networking mode.
- Set the correct protocol and port for each service.
- Configure health check paths and success criteria.
- Verify that the registered targets become healthy after deployment.

---

## 6.10 Application Load Balancer Configuration

The Application Load Balancer (ALB) provides a single entry point for backend requests and forwards traffic to the appropriate target group based on the configured listener rules.

### 6.10.1 Create the Application Load Balancer

Create an ALB in the application VPC and configure its networking and security settings.

![Create ALB — Step 1](notesImages/CreateALB1.png)
![Create ALB — Step 2](notesImages/CreateALB2.png)
![Create ALB — Step 3](notesImages/CreateALB3.png)

### 6.10.2 Configure Listener Rules

Configure the ALB listener rules to route incoming requests to the appropriate backend service.

The following screenshots document the listener rule configuration.

![ALB listener rules — Step 1](notesImages/LBRules1.png)
![ALB listener rules — Step 2](notesImages/LBRules2.png)
![ALB listener rules — Step 3](notesImages/LBRules3.png)
![ALB listener rules — Step 4](notesImages/LBRules4.png)
![ALB listener rules — Step 5](notesImages/LBRules5.png)
![ALB listener rules — Step 6](notesImages/LBRules6.png)
![ALB listener rules — Step 7](notesImages/LBRules7.png)
![ALB listener rules — Additional configuration](notesImages/LBRules9.png)

**Validation checklist:**

- Confirm that each listener rule forwards requests to the correct target group.
- Verify that rule priorities do not conflict.
- Confirm that the target groups contain healthy targets.
- Test the application API endpoints through the ALB DNS name.

---

## 6.11 Amazon ECR: Create Repositories and Push Docker Images

Amazon Elastic Container Registry (ECR) stores the Docker images used by the ECS services.

### 6.11.1 Create Private ECR Repositories

Create a private ECR repository for each backend service.

![Create private ECR repository — Step 1](notesImages/CreatePrivateRepo1.png)
![Create private ECR repository — Step 2](notesImages/CreatePrivateRepo2.png)
![Create private ECR repository — Step 3](notesImages/CreatePrivateRepo3.png)
![Create private ECR repository — Step 4](notesImages/CreatePrivateRepo4.png)

### 6.11.2 Authenticate Docker with ECR

Configure Docker to authenticate with the ECR registry in the AWS account and Region used by the project.

![Docker authentication and ECR connection](notesImages/DockerStarter.png)

### 6.11.3 Build Docker Images

Build the Docker images for the backend services before pushing them to ECR.

![Docker image build](notesImages/DockerBuild1.png)

**Deployment workflow:**

1. Authenticate Docker with ECR.
2. Build the Docker image for the required service.
3. Tag the image with the appropriate ECR repository URI.
4. Push the image to the ECR repository.
5. Update the ECS task definition to use the new image, when necessary.
6. Deploy the updated ECS service and verify its health.

**Note:** Repeat this workflow for each backend service.

---

## 6.12 Final Backend Deployment Checklist

Use this checklist to verify the backend deployment.

### Networking and Database

- [ ] VPC and subnets are configured.
- [ ] Route tables and the NAT Gateway are configured as required.
- [ ] The RDS DB subnet group uses the intended private subnets.
- [ ] The PostgreSQL database is available.
- [ ] Database security group rules allow access only from the required application resources.

### Configuration and Secrets

- [ ] The AWS Region parameter exists in Parameter Store.
- [ ] The database host parameter contains the correct RDS endpoint.
- [ ] The database password is stored securely.
- [ ] ECS task execution and task roles have the necessary permissions.

### Container Deployment

- [ ] Private ECR repositories have been created.
- [ ] Docker images have been built and pushed to ECR.
- [ ] ECS task definitions reference the correct image URIs.
- [ ] The ECS cluster has been created.
- [ ] ECS services are running successfully.

### Load Balancing and Validation

- [ ] The ALB has been created and configured.
- [ ] Each backend service has the correct target group.
- [ ] Listener rules route requests to the appropriate services.
- [ ] Target group health checks are passing.
- [ ] Backend API endpoints respond as expected.
- [ ] The frontend can communicate with the backend.

---
