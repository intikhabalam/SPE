
export const REACT_APP_AZURE_SERVER_APP_ID = process.env.REACT_APP_AZURE_APP_ID!;
export const AZURE_CLIENT_ID = process.env.REACT_APP_AZURE_APP_ID;
export const SPE_CONTAINER_TYPE_ID = process.env.REACT_APP_SPE_CONTAINER_TYPE_ID;
// export const AUTH_AUTHORITY = `https://login.microsoftonline.com/common`;
export const AUTH_AUTHORITY = `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`;
export const SP_ROOT_SITE_URL = process.env.REACT_APP_SP_ROOT_SITE_URL;
export const REACT_APP_TENANT_ID = process.env.REACT_APP_TENANT_ID;
export const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
export const AZURE_CLIENT_CERT_THUMBPRINT = process.env.AZURE_CLIENT_CERT_THUMBPRINT;
export const AZURE_CLIENT_CERT_PRIVATE_KEY = process.env.AZURE_CLIENT_CERT_PRIVATE_KEY;