require('dotenv').config();

const rootPath = process.env.NODE_ENV?.toLocaleLowerCase() === 'production'
  ? 'dist'
  : 'src';

console.log(rootPath);

module.exports = {
  type: process.env.DIALECT,
  // port: process.env.PORT,
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [
    `${rootPath}/core/infra/data/database/entities/**/*`
  ],
  migrations: [
    `${rootPath}/core/infra/data/database/migrations/**/*`,
  ],
  cli: {
    entitiesDir: `${rootPath}/core/infra/data/database/entities`,
    migrationsDir: `${rootPath}/core/infra/data/database/migrations`,
  },
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};