module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jquery: true,
    },
    extends: 'eslint:recommended',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
    },
    rules: {
        indent: [
            'error',
            4,
            { SwitchCase: 1 },
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'always',
        ],
        'no-console': [
            'warn',
        ],
    },
};