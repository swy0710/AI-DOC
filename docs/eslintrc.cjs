module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'import', 'check-file'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'coverage',
    '*.config.js',
    '*.config.ts',
  ],
  rules: {
    /*
     * no-restricted-imports: 전역 적용 금지.
     * 레이어별 의존성 제약은 아래 overrides에서 레이어마다 독립적으로 선언한다.
     * overrides는 전역 규칙을 대체(replace)하므로 전역에 두면 의도치 않은 충돌이 발생한다.
     */

    /*
     * 1) default export 금지
     */
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Default export is forbidden. Use named exports.',
      },
    ],

    /*
     * 2) any 금지
     */
    '@typescript-eslint/no-explicit-any': 'error',

    /*
     * 3) type import 강제
     */
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],

    /*
     * 4) import 순서 강제
     */
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    /*
     * 5) 파일명 규칙
     * - tsx: PascalCase (컴포넌트)
     * - ts: camelCase (비컴포넌트)
     */
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.tsx': 'PASCAL_CASE',
        '**/*.ts': 'CAMEL_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],

    /*
     * 6) unused vars 방지
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    /*
     * 7) 명시적 반환 타입 강제
     * allowExpressions: false — arrow function 컴포넌트도 반환 타입 명시 강제
     */
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: false,
        allowTypedFunctionExpressions: true,
      },
    ],
  },

  overrides: [
    /*
     * [Presentation] → Data 금지
     * Presentation은 Domain use case를 통해서만 데이터에 접근한다.
     */
    {
      files: ['src/presentation/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '@/data/*',
                  'src/data/*',
                  '../data/*',
                  '../../data/*',
                  '../../../data/*',
                  '../../../../data/*',
                ],
                message:
                  'Presentation must not import Data directly. Use Domain use cases.',
              },
            ],
          },
        ],
      },
    },

    /*
     * [Domain] → Presentation 금지, Data 금지, 프레임워크/인프라 금지
     * Domain은 순수 TypeScript여야 한다.
     */
    {
      files: ['src/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '@/presentation/*',
                  'src/presentation/*',
                  '../presentation/*',
                  '../../presentation/*',
                  '../../../presentation/*',
                  '../../../../presentation/*',
                ],
                message: 'Domain must not depend on Presentation.',
              },
              {
                group: [
                  '@/data/*',
                  'src/data/*',
                  '../data/*',
                  '../../data/*',
                  '../../../data/*',
                  '../../../../data/*',
                ],
                message: 'Domain must not depend on Data.',
              },
              {
                group: ['react', 'react-dom', '@tanstack/*', 'zustand', 'ky'],
                message:
                  'Domain must remain framework-agnostic and infrastructure-agnostic.',
              },
            ],
          },
        ],
      },
    },

    /*
     * [Data] → Presentation 금지
     * Data는 Domain 인터페이스를 구현하며 Presentation에 의존하지 않는다.
     */
    {
      files: ['src/data/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '@/presentation/*',
                  'src/presentation/*',
                  '../presentation/*',
                  '../../presentation/*',
                  '../../../presentation/*',
                  '../../../../presentation/*',
                ],
                message: 'Data must not depend on Presentation.',
              },
            ],
          },
        ],
      },
    },

    /*
     * [App] — 레이어 제약 없음 (composition root)
     * App은 모든 레이어를 조합하는 진입점이다.
     */
  ],
};
