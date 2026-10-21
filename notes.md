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
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)