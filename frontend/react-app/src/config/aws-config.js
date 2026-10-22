const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      loginWith: { email: true },
    },
  },
};

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
).replace(/\/$/, '');

export default awsConfig;