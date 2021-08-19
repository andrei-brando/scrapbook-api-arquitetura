require('dotenv').config();

const rootPath = process.env.NODE_ENV?.toLocaleLowerCase() === 'production'
  ? 'dist'
  : 'src';

let config = {};

if (process.env.NODE_ENV?.toLocaleLowerCase() === 'test') {
  config = {
    type: 'sqlite',
    database: './testedb.sql',
    entities: [
      'src/core/infra/data/database/entities/**/*',
    ],
    migrations: [
      'src/core/infra/data/database/migrations/**/*',
    ]
  }
} else {
  config = {
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
  }
}

module.exports = config;