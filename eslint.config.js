const eslint = require('@eslint/js');
const typescript = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['src/**/*.ts'],
    ignores: [
      'eslint.config.js',
      'dist',
      'test',
      'node_modules',
      '*.config.js',
      '*.config.ts',
      'coverage/**',
      '*.mock.ts',
      '*.dto.ts',
      '*.middleware.ts',
      '*.interface.ts',
      '*.decorator.ts',
      '*.guard.ts',
      '*.strategy.ts',
      '*.pipe.ts',
      '*.filter.ts',
      '*.midleware.ts',
      '*.enum.ts',
      '*.dto.ts',
      'BadRequestError.ts',
      'NotFoundError.ts',
      '*.interceptor.ts',
      'DomainException.ts',
      '.index.ts',
      '*.logger.ts',
      '*.entity.ts',
    ],
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      globals: {
        process: true,
        console: true,
        Buffer: true,
        Express: true
      }
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-block': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-console': 'off',
      'no-undef': 'off',
      'no-empty': 'off',
      'no-unused-vars': 'off'
    },
  },
];
