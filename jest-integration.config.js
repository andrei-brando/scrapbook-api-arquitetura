const config = require('./jest.config');

// define apenas os testes de integração
config.testMatch = ['**/*.test.ts'];

module.exports = config;