// src/config/index.ts
export const CONFIG = {
    NETWORK: import.meta.env.VITE_SUI_NETWORK || 'testnet',
    PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID,
    CERT_FUNCTION: import.meta.env.VITE_CERTIFICATE_FUNCTION_NAME,
    ADMIN_FUNCTION: import.meta.env.VITE_ADMIN_FUNCTION_NAME,
    CERT_TYPE: import.meta.env.VITE_CERT_TYPE,
    INST_TYPE: import.meta.env.VITE_INST_TYPE,
    ADMIN_TYPE: import.meta.env.VITE_ADMIN_TYPE,
    REGISTRY: import.meta.env.VITE_REGISTRY
};