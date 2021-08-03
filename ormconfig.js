require('dotenv').config();

module.exports = {
  type: process.env.DIALECT,
  // host: process.env.DB_HOST,
  port: process.env.PORT,
  url: process.env.DATABASE_URL,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    'src/core/infra/data/database/entities/**/*'
    // 'src/core/infra/data/database/entities/*'
  ],
  migrations: [
    'src/core/infra/data/database/migrations/**/*'
  ],
  cli: {
    entitiesDir: 'src/core/infra/data/database/entities',
    migrationsDir: 'src/core/infra/data/database/migrations'
  },
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};