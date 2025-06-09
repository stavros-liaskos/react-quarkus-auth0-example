import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

const auth0Config: Auth0ClientOptions = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://api.auth0-poc.com',  // should be the auth0 API Identifier
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

export default auth0Config; 