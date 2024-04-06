import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const HOST = "http://localhost:" + PORT;

export const SECRET_JWT = "marifyTechnologies";
export const MONGODB_URI =process.env.MONGODB_URI || "mongodb://localhost:27017/companydb";

//Cuenta admin

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
export const ADMIN_NAME = process.env.ADMIN_NAME || "admin";
export const ADMIN_LASTNAME = process.env.ADMIN_NAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";


//variables de paypal

export const PAYPAL_API_CLIENT= process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET= process.env.PAYPAL_API_SECRET;
export const PAYPAL_API='https://api-m.sandbox.paypal.com';

//variables de google OAuth2

export const EMAIL_PORT=process.env.EMAIL_PORT
export const EMAIL_PASSWORD=process.env.EMAIL_PASSWORD
export const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET

//variables de Stripe

export const STRIPE_SECRET=process.env.STRIPE_SECRET
