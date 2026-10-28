#!/bin/bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: bash services/build-and-deploy-services.sh <account-id> <region> [service]"
  echo "Example (single): bash services/build-and-deploy-services.sh 002581114746 eu-north-1 cart"
  exit 1
fi

ACCOUNT_ID="$1"
REGION="$2"
FILTER="$3"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
CLUSTER="ecommerce-app-cluster"

declare -A ECS_SERVICE_MAP=(
  ["product-service"]="product-service-service-0sa046ui"
  ["cart-service"]="cart-service-service-cdclf0i8"
  ["user-service"]="user-service-service-aa69s3f2"
  ["order-service"]="order-service-service-jvmprhdw"
)

if [ -n "$FILTER" ]; then
  SERVICE_NAME="${FILTER}-service"
  if [ -z "${ECS_SERVICE_MAP[$SERVICE_NAME]}" ]; then
    echo "Error: Unknown service '$FILTER'. Valid values: product, cart, user, order"
    exit 1
  fi
  SERVICES=("$SERVICE_NAME")
else
  SERVICES=("product-service" "cart-service" "user-service" "order-service")
fi

echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

for SERVICE in "${SERVICES[@]}"; do
  echo ""
  echo "==> Building $SERVICE..."
  docker build -t ecommerce/$SERVICE services/$SERVICE
  docker tag ecommerce/$SERVICE:latest $ECR_REGISTRY/ecommerce/$SERVICE:latest
  docker push $ECR_REGISTRY/ecommerce/$SERVICE:latest
done

echo ""
echo "==> Registering new task definitions and deploying..."
for SERVICE in "${SERVICES[@]}"; do
  ECS_SERVICE="${ECS_SERVICE_MAP[$SERVICE]}"

  DIGEST=$(aws ecr describe-images --repository-name ecommerce/$SERVICE \
    --image-ids imageTag=latest --region $REGION \
    --query 'imageDetails[0].imageDigest' --output text)

  # Use the task definition the service is currently running (no family-name guessing)
  CURRENT_TD=$(aws ecs describe-services --cluster $CLUSTER --services $ECS_SERVICE \
    --region $REGION --query 'services[0].taskDefinition' --output text)

  aws ecs describe-task-definition --task-definition $CURRENT_TD --region $REGION \
    --query taskDefinition \
  | jq --arg img "$ECR_REGISTRY/ecommerce/$SERVICE@$DIGEST" \
      '.containerDefinitions[0].image=$img
       | del(.taskDefinitionArn,.revision,.status,.requiresAttributes,.compatibilities,.registeredAt,.registeredBy)' \
  > /tmp/$SERVICE-td.json

  NEW_TD=$(aws ecs register-task-definition --cli-input-json file:///tmp/$SERVICE-td.json \
    --region $REGION --query 'taskDefinition.taskDefinitionArn' --output text)
  echo "$SERVICE -> $NEW_TD"

  aws ecs update-service --cluster $CLUSTER --service $ECS_SERVICE \
    --task-definition $NEW_TD --force-new-deployment --region $REGION \
    --query 'service.serviceName' --output text
done

echo "Done."