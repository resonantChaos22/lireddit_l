import dotenv from "dotenv";
dotenv.config();

export const __dbuser__ = "shreyash";
export const __dbpass__ = process.env.DB_PASS;
export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
