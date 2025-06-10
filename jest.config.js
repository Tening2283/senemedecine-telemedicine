module.exports = {
  // Configuration Jest pour SeneMedecine
  
  // Projets à tester
  projects: [
    {
      displayName: 'Backend',
      testMatch: ['<rootDir>/backend/**/*.spec.ts', '<rootDir>/backend/**/*.test.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: '.',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/backend/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/backend/test/setup.ts'],
      collectCoverageFrom: [
        'backend/src/**/*.ts',
        '!backend/src/**/*.spec.ts',
        '!backend/src/**/*.test.ts',
        '!backend/src/main.ts',
        '!backend/src/**/*.module.ts',
        '!backend/src/**/*.interface.ts',
        '!backend/src/**/*.dto.ts',
        '!backend/src/**/*.entity.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/backend',
      coverageReporters: ['text', 'lcov', 'html'],
      coverageThreshold: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    {
      displayName: 'Frontend',
      testMatch: ['<rootDir>/frontend/**/*.test.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      rootDir: '.',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/frontend/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/frontend/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/frontend/src/setupTests.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['react-app'] }],
      },
      collectCoverageFrom: [
        'frontend/src/**/*.{js,jsx,ts,tsx}',
        '!frontend/src/**/*.test.{js,jsx,ts,tsx}',
        '!frontend/src/index.tsx',
        '!frontend/src/reportWebVitals.ts',
        '!frontend/src/**/*.stories.{js,jsx,ts,tsx}',
        '!frontend/src/**/*.d.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/frontend',
      coverageReporters: ['text', 'lcov', 'html'],
      coverageThreshold: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    },
  ],

  // Configuration globale
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Seuils de couverture globaux
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 65,
      lines: 65,
      statements: 65,
    },
  },

  // Fichiers à ignorer
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
  ],

  // Extensions de fichiers à transformer
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // Variables d'environnement pour les tests
  setupFiles: ['<rootDir>/jest.env.js'],

  // Timeout global pour les tests
  testTimeout: 30000,

  // Affichage des résultats
  verbose: true,
  
  // Nettoyage automatique des mocks
  clearMocks: true,
  
  // Restauration automatique des mocks
  restoreMocks: true,
};

