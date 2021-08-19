module.exports = {
    // arquivos que vão entrar no coverage
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    // diretório onde vai ser colocado os arquivos dos relatórios de cobertura
    coverageDirectory: 'coverage',
    // diretórios que vão ser ignorados pelo coverage
    coveragePathIgnorePatterns: [
        '\\\\node_modules\\\\',
        '<rootDir>/src/core/infra/data/database/migrations'
    ],
    // diretório onde vai ter os testes
    roots: [
        '<rootDir>/tests'
    ],
    // o ambiente onde será rodado os testes
    testEnvironment: 'node',
    // transpila os teste de ts para js e roda
    transform: {
        '.+\\.ts$': 'ts-jest'
    }
};