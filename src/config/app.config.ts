export default () => ({
  jwtSecretString: process.env.JWT_SECRET_STRING,
  dbPort: process.env.DB_PORT,
  dbUsername: process.env.DB_USERNAME,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbUrl: process.env.DB_URL,
});
