/**
 * Environment variables validation
 */

const requiredEnv = [
    'VITE_API_URL'
];

export const validateEnv = () => {
    const missing = requiredEnv.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
        console.warn(`[Env Validation] Missing optional or recommended environment variables: ${missing.join(', ')}`);
        console.info(`[Env Validation] Using defaults for missing variables.`);
    } else {
        console.log('[Env Validation] All required environment variables are present.');
    }
};

export const ENV = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
};
