import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import-x'
import { fixupPluginRules } from '@eslint/compat' // Official compatibility utility

export default tseslint.config(
    {
        ignores: ['dist', 'node_modules', 'build', 'coverage']
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            // Wrap the legacy plugin to make it compatible with ESLint v10 API
            'react': fixupPluginRules(react),
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'import': importPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...react.configs['recommended'].rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'react/jsx-no-leaked-render': ['warn', { validStrategies: ['coerce', 'ternary'] }],

            // TypeScript Strictness
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: { attributes: false } }],
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unnecessary-type-conversion': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',
            'no-empty': 'warn',
            '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/no-confusing-void-expression': 'warn',


            // Code Organization & Quality
            'import/order': ['error', {
                'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
                'alphabetize': { order: 'asc', caseInsensitive: true }
            }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'eqeqeq': ['warn', 'always', { null: 'ignore' }],
        },
    },
)