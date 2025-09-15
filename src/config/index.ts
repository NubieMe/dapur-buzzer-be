import "dotenv/config";

export const config = {
  PORT: process.env.PORT || 3210,
  API_KEY: process.env.API_KEY || '',
  API_HOST: process.env.API_HOST || '',
  API_URL: process.env.API_URL || '',
}
