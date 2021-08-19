const config = require('./jest.config');

// define apenas os testes unitários
config.testMatch = ['**/*.spec.ts'];

module.exports = config;